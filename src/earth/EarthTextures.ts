/**
 * Earth Textures
 * 
 * Load và quản lý textures cho Earth
 * 
 * @module earth/EarthTextures
 * 
 * Design principles:
 * - Lazy loading với progress callback
 * - Caching để tránh reload
 * - Error handling
 * - Disposal support
 */

import * as THREE from 'three'
import { EARTH_ASSETS } from '../config/earthConfig'

/**
 * Texture Load Progress
 */
export interface TextureLoadProgress {
  loaded: number
  total: number
  percentage: number
  currentTexture: string
}

/**
 * Texture Load Callback
 */
export type TextureLoadCallback = (progress: TextureLoadProgress) => void

/**
 * Earth Textures Interface - Extended with pollution support
 */
export interface EarthTextureSet {
  dayMap: THREE.Texture | null
  nightMap: THREE.Texture | null
  cloudsMap: THREE.Texture | null
  normalMap: THREE.Texture | null
  specularMap: THREE.Texture | null
  // Pollution textures
  pollutedDayMap: THREE.Texture | null
  pollutedCloudMap: THREE.Texture | null
}

/**
 * Texture paths từ config - Extended with pollution
 */
const TEXTURE_PATHS = {
  dayMap: EARTH_ASSETS.dayMap,
  nightMap: EARTH_ASSETS.nightMap,
  cloudsMap: EARTH_ASSETS.cloudMap,
  normalMap: EARTH_ASSETS.normalMap,
  specularMap: EARTH_ASSETS.specularMap,
  // Pollution textures
  pollutedDayMap: EARTH_ASSETS.pollutedDayMap,
  pollutedCloudMap: EARTH_ASSETS.pollutedCloudMap,
}

/**
 * Earth Textures Class
 * 
 * Load và cache textures cho Earth
 * 
 * @example
 * ```typescript
 * const textures = new EarthTextures()
 * 
 * // Load với progress
 * await textures.loadAll((progress) => {
 *   console.log(`Loading: ${progress.percentage}%`)
 * })
 * 
 * // Get textures
 * const dayMap = textures.get('dayMap')
 * 
 * // Cleanup
 * textures.dispose()
 * ```
 */
export class EarthTextures {
  // PRIVATE PROPERTIES
  private _loader: THREE.TextureLoader
  private _textures: EarthTextureSet = {
    dayMap: null,
    nightMap: null,
    cloudsMap: null,
    normalMap: null,
    specularMap: null,
    // Pollution textures
    pollutedDayMap: null,
    pollutedCloudMap: null,
  }
  private _isLoaded: boolean = false
  private _isLoading: boolean = false
  private _isDisposed: boolean = false

  // CONSTRUCTOR
  constructor() {
    this._loader = new THREE.TextureLoader()
  }

  // PUBLIC GETTERS
  /**
   * Check if all textures are loaded
   */
  get isLoaded(): boolean {
    return this._isLoaded
  }

  /**
   * Check if currently loading
   */
  get isLoading(): boolean {
    return this._isLoading
  }

  /**
   * Check if disposed
   */
  get isDisposed(): boolean {
    return this._isDisposed
  }

  /**
   * Get all textures
   */
  get textures(): Readonly<EarthTextureSet> {
    return { ...this._textures }
  }

  // PUBLIC METHODS
  /**
   * Get specific texture
   * 
   * @param name - Texture name
   * @returns Texture or null
   */
  get(name: keyof EarthTextureSet): THREE.Texture | null {
    return this._textures[name]
  }

  /**
   * Load all textures
   * 
   * @param onProgress - Progress callback
   * @returns Promise resolving to texture set
   */
  async loadAll(onProgress?: TextureLoadCallback): Promise<EarthTextureSet> {
    if (this._isLoaded) {
      return this._textures
    }
    
    if (this._isLoading) {
      // Wait for existing load to complete
      return new Promise((resolve) => {
        const checkLoaded = setInterval(() => {
          if (this._isLoaded) {
            clearInterval(checkLoaded)
            resolve(this._textures)
          }
        }, 100)
      })
    }
    
    this._isLoading = true
    
    const textureNames = Object.keys(TEXTURE_PATHS) as Array<keyof typeof TEXTURE_PATHS>
    const total = textureNames.length
    let loaded = 0
    
    for (const name of textureNames) {
      const path = TEXTURE_PATHS[name]
      
      if (onProgress) {
        onProgress({
          loaded,
          total,
          percentage: Math.round((loaded / total) * 100),
          currentTexture: name,
        })
      }
      
      try {
        const texture = await this.loadTexture(path)
        this._textures[name] = texture
      } catch (error) {
        console.warn(`Failed to load texture: ${name}`, error)
        // Continue loading other textures
      }
      
      loaded++
    }
    
    if (onProgress) {
      onProgress({
        loaded: total,
        total,
        percentage: 100,
        currentTexture: 'complete',
      })
    }
    
    this._isLoaded = true
    this._isLoading = false
    
    return this._textures
  }

  /**
   * Load single texture
   * 
   * @param path - Texture path
   * @returns Promise resolving to texture
   */
  loadTexture(path: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      this._loader.load(
        path,
        (texture) => {
          // Configure texture
          texture.colorSpace = THREE.SRGBColorSpace
          texture.anisotropy = 16
          resolve(texture)
        },
        undefined,
        (error) => {
          reject(error)
        }
      )
    })
  }

  /**
   * Preload textures (non-blocking)
   * 
   * @param onProgress - Progress callback
   */
  preload(onProgress?: TextureLoadCallback): void {
    this.loadAll(onProgress).catch((error) => {
      console.error('Failed to preload textures:', error)
    })
  }

  /**
   * Dispose all textures
   */
  dispose(): void {
    if (this._isDisposed) return
    
    for (const key of Object.keys(this._textures) as Array<keyof EarthTextureSet>) {
      const texture = this._textures[key]
      if (texture) {
        texture.dispose()
        this._textures[key] = null
      }
    }
    
    this._isLoaded = false
    this._isDisposed = true
  }
}

/**
 * Singleton instance for shared textures
 */
let sharedInstance: EarthTextures | null = null

/**
 * Get shared EarthTextures instance
 * 
 * @returns Shared instance
 */
export function getSharedTextures(): EarthTextures {
  if (!sharedInstance) {
    sharedInstance = new EarthTextures()
  }
  return sharedInstance
}

/**
 * Dispose shared instance
 */
export function disposeSharedTextures(): void {
  if (sharedInstance) {
    sharedInstance.dispose()
    sharedInstance = null
  }
}
