/**
 * Earth
 * 
 * Main Earth class quản lý mesh, material, clouds, atmosphere
 * 
 * @module earth/Earth
 * 
 * Design principles:
 * - Composition: Kết hợp các components (material, clouds, atmosphere)
 * - Single update point: Một phương thức update() cho tất cả
 * - Pollution control: Centralized pollution level management
 * - Day/Night cycle: Custom shader với realistic sun lighting
 */

import * as THREE from 'three'
import { EARTH_GEOMETRY, EARTH_ANIMATION } from '../config/earthConfig'
import { EarthMaterial, type EarthMaterialOptions } from './EarthMaterial'
import { EarthShaderMaterial } from './EarthShaderMaterial'
import { EarthTextures, getSharedTextures, type EarthTextureSet } from './EarthTextures'
import { CloudLayer, type CloudLayerOptions } from './CloudLayer'
import { Atmosphere, type AtmosphereOptions } from './Atmosphere'
import { clamp } from '../utils/math'

/**
 * Earth Options
 */
export interface EarthOptions {
  /** Initial pollution level (0-100) */
  pollutionLevel?: number
  
  /** Pre-loaded textures */
  textures?: Partial<EarthTextureSet>
  
  /** Enable cloud layer (default: true) */
  enableClouds?: boolean
  
  /** Enable atmosphere (default: true) */
  enableAtmosphere?: boolean
  
  /** Auto rotate (default: true) */
  autoRotate?: boolean
  
  /** Rotation speed (default: from config) */
  rotationSpeed?: number
  
  /** Use custom day/night shader (default: true) */
  useDayNightShader?: boolean
  
  /** Material options */
  materialOptions?: EarthMaterialOptions
  
  /** Cloud options */
  cloudOptions?: CloudLayerOptions
  
  /** Atmosphere options */
  atmosphereOptions?: AtmosphereOptions
}

/**
 * Earth Class
 * 
 * Main Earth visualization với pollution-based appearance
 * 
 * @example
 * ```typescript
 * // Create Earth
 * const earth = new Earth({
 *   pollutionLevel: 0,
 *   enableClouds: true,
 *   enableAtmosphere: true,
 * })
 * 
 * // Load textures và apply
 * await earth.loadTextures()
 * 
 * // Add to scene
 * scene.add(earth.group)
 * 
 * // Update trong animation loop
 * earth.update(deltaTime)
 * 
 * // Update pollution từ slider
 * earth.setPollutionLevel(75)
 * 
 * // Cleanup
 * earth.dispose()
 * ```
 */
export class Earth {
  // PRIVATE PROPERTIES
  private _group: THREE.Group
  private _mesh: THREE.Mesh
  private _material: EarthMaterial | null = null
  private _shaderMaterial: EarthShaderMaterial | null = null
  private _useDayNightShader: boolean
  private _clouds: CloudLayer | null = null
  private _atmosphere: Atmosphere | null = null
  private _textures: EarthTextures
  private _pollutionLevel: number = 0
  private _autoRotate: boolean
  private _rotationSpeed: number
  private _isDisposed: boolean = false

  // CONSTRUCTOR
  /**
   * Create new Earth
   * 
   * @param options - Earth options
   */
  constructor(options: EarthOptions = {}) {
    // Config
    this._pollutionLevel = options.pollutionLevel ?? 0
    this._autoRotate = options.autoRotate ?? true
    this._rotationSpeed = options.rotationSpeed ?? EARTH_ANIMATION.rotationSpeed
    this._useDayNightShader = options.useDayNightShader ?? true
    
    // Create group để chứa tất cả components
    this._group = new THREE.Group()
    this._group.name = 'earth-system'
    
    // Create Earth geometry
    const geometry = new THREE.SphereGeometry(
      EARTH_GEOMETRY.radius,
      EARTH_GEOMETRY.widthSegments,
      EARTH_GEOMETRY.heightSegments
    )
    
    // Create material - choose between shader and standard
    let material: THREE.Material
    
    if (this._useDayNightShader) {
      // Use custom day/night shader
      this._shaderMaterial = new EarthShaderMaterial({
        pollutionLevel: this._pollutionLevel,
        dayMap: options.textures?.dayMap ?? undefined,
        nightMap: options.textures?.nightMap ?? undefined,
        normalMap: options.textures?.normalMap ?? undefined,
        specularMap: options.textures?.specularMap ?? undefined,
      })
      material = this._shaderMaterial.material
    } else {
      // Use standard PBR material
      this._material = new EarthMaterial({
        ...options.materialOptions,
        pollutionLevel: this._pollutionLevel,
        textures: options.textures,
      })
      material = this._material.material
    }
    
    // Create mesh
    this._mesh = new THREE.Mesh(geometry, material)
    this._mesh.name = 'earth'
    this._group.add(this._mesh)
    
    // Create cloud layer with texture blending support
    if (options.enableClouds !== false) {
      this._clouds = new CloudLayer({
        ...options.cloudOptions,
        pollutionLevel: this._pollutionLevel,
        cleanCloudTexture: options.textures?.cloudsMap ?? undefined,
        pollutedCloudTexture: options.textures?.pollutedCloudMap ?? undefined,
      })
      this._group.add(this._clouds.mesh)
    }
    
    // Create atmosphere
    if (options.enableAtmosphere !== false) {
      this._atmosphere = new Atmosphere({
        ...options.atmosphereOptions,
        pollutionLevel: this._pollutionLevel,
      })
      this._group.add(this._atmosphere.mesh)
    }
    
    // Get shared textures instance
    this._textures = getSharedTextures()
  }

  // PUBLIC GETTERS
  /**
   * Get Earth group (contains mesh, clouds, atmosphere)
   */
  get group(): THREE.Group {
    return this._group
  }

  /**
   * Get Earth mesh only
   */
  get mesh(): THREE.Mesh {
    return this._mesh
  }

  /**
   * Get Earth material (null if using shader material)
   */
  get material(): EarthMaterial | null {
    return this._material
  }

  /**
   * Get Earth shader material (null if using standard material)
   */
  get shaderMaterial(): EarthShaderMaterial | null {
    return this._shaderMaterial
  }

  /**
   * Get cloud layer (nullable)
   */
  get clouds(): CloudLayer | null {
    return this._clouds
  }

  /**
   * Get atmosphere (nullable)
   */
  get atmosphere(): Atmosphere | null {
    return this._atmosphere
  }

  /**
   * Get current pollution level
   */
  get pollutionLevel(): number {
    return this._pollutionLevel
  }

  /**
   * Get rotation
   */
  get rotation(): THREE.Euler {
    return this._mesh.rotation
  }

  /**
   * Check if disposed
   */
  get isDisposed(): boolean {
    return this._isDisposed
  }

  // PUBLIC METHODS - TEXTURES
  /**
   * Load textures và apply to Earth
   * 
   * @param onProgress - Progress callback
   * @returns Promise resolving when loaded
   */
  async loadTextures(
    onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
  ): Promise<void> {
    const textures = await this._textures.loadAll(onProgress)
    this.applyTextures(textures)
  }

  /**
   * Apply textures to Earth components
   * 
   * @param textures - Texture set
   */
  applyTextures(textures: Partial<EarthTextureSet>): void {
    if (this._isDisposed) return
    
    if (this._useDayNightShader && this._shaderMaterial) {
      // Apply to shader material with pollution textures
      this._shaderMaterial.setTextures({
        dayMap: textures.dayMap ?? undefined,
        nightMap: textures.nightMap ?? undefined,
        normalMap: textures.normalMap ?? undefined,
        specularMap: textures.specularMap ?? undefined,
        cloudsMap: textures.cloudsMap ?? undefined,
        pollutedDayMap: textures.pollutedDayMap ?? undefined,
      })
    } else if (this._material) {
      // Apply to standard material
      this._material.applyTextures(textures)
      
      // Apply night map as emissive
      if (textures.nightMap) {
        this._material.setNightMap(textures.nightMap)
      }
    }
    
    // Apply cloud textures (clean + polluted)
    if (this._clouds) {
      this._clouds.setTextures({
        cleanCloudMap: textures.cloudsMap ?? undefined,
        pollutedCloudMap: textures.pollutedCloudMap ?? undefined,
      })
    }
  }

  // PUBLIC METHODS - POLLUTION
  /**
   * Set pollution level
   * 
   * Updates Earth, clouds, và atmosphere appearance
   * 
   * @param level - Pollution level (0-100)
   */
  setPollutionLevel(level: number): void {
    if (this._isDisposed) return
    
    this._pollutionLevel = clamp(level, 0, 100)
    
    // Update all components
    if (this._shaderMaterial) {
      this._shaderMaterial.setPollutionLevel(this._pollutionLevel)
    }
    if (this._material) {
      this._material.setPollutionLevel(this._pollutionLevel)
    }
    this._clouds?.setPollutionLevel(this._pollutionLevel)
    this._atmosphere?.setPollutionLevel(this._pollutionLevel)
  }

  // PUBLIC METHODS - UPDATE
  /**
   * Update Earth (rotation, clouds)
   * 
   * @param deltaTime - Time since last frame (seconds)
   */
  update(deltaTime: number): void {
    if (this._isDisposed) return
    
    // Auto rotate Earth
    if (this._autoRotate) {
      this._mesh.rotation.y += this._rotationSpeed * deltaTime
    }
    
    // Update clouds (rotates independently)
    this._clouds?.update(deltaTime)
  }

  // PUBLIC METHODS - ROTATION
  /**
   * Set rotation
   * 
   * @param x - X rotation (radians)
   * @param y - Y rotation (radians)
   * @param z - Z rotation (radians)
   */
  setRotation(x: number, y: number, z: number): void {
    this._mesh.rotation.set(x, y, z)
  }

  /**
   * Set rotation speed
   * 
   * @param speed - Rotation speed (radians per second)
   */
  setRotationSpeed(speed: number): void {
    this._rotationSpeed = speed
  }

  /**
   * Enable/disable auto rotation
   * 
   * @param enabled - Enable auto rotation
   */
  setAutoRotate(enabled: boolean): void {
    this._autoRotate = enabled
  }

  // PUBLIC METHODS - VISIBILITY
  /**
   * Show/hide clouds
   * 
   * @param visible - Visibility state
   */
  setCloudsVisible(visible: boolean): void {
    if (this._clouds) {
      visible ? this._clouds.show() : this._clouds.hide()
    }
  }

  /**
   * Show/hide atmosphere
   * 
   * @param visible - Visibility state
   */
  setAtmosphereVisible(visible: boolean): void {
    if (this._atmosphere) {
      visible ? this._atmosphere.show() : this._atmosphere.hide()
    }
  }

  // PUBLIC METHODS - POSITION/SCALE
  /**
   * Set position
   * 
   * @param x - X position
   * @param y - Y position
   * @param z - Z position
   */
  setPosition(x: number, y: number, z: number): void {
    this._group.position.set(x, y, z)
  }

  /**
   * Set scale
   * 
   * @param scale - Uniform scale
   */
  setScale(scale: number): void {
    this._group.scale.setScalar(scale)
  }

  // PUBLIC METHODS - DISPOSAL
  /**
   * Dispose Earth và all components
   */
  dispose(): void {
    if (this._isDisposed) return
    
    // Dispose components
    this._material?.dispose()
    this._shaderMaterial?.dispose()
    this._clouds?.dispose()
    this._atmosphere?.dispose()
    
    // Dispose geometry
    this._mesh.geometry.dispose()
    
    // Remove from parent
    if (this._group.parent) {
      this._group.parent.remove(this._group)
    }
    
    this._isDisposed = true
  }
}
