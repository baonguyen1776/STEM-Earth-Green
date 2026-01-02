/**
 * Scene Manager
 * 
 * Quản lý Three.js Scene và lighting system
 * 
 * @module core/SceneManager
 * 
 * Design principles:
 * - Centralized scene management
 * - Configurable lighting
 * - Easy object management (add/remove)
 * - Cleanup và disposal
 */

import * as THREE from 'three'
import { COLORS } from '../config/colors'

/**
 * Light Configuration
 */
export interface LightConfig {
  /** Ambient light intensity (0-1) */
  ambientIntensity?: number
  
  /** Ambient light color */
  ambientColor?: number | string
  
  /** Directional light intensity (0-1) */
  directionalIntensity?: number
  
  /** Directional light color */
  directionalColor?: number | string
  
  /** Directional light position */
  directionalPosition?: { x: number; y: number; z: number }
  
  /** Back light intensity (0-1) */
  backLightIntensity?: number
  
  /** Back light color */
  backLightColor?: number | string
  
  /** Back light position */
  backLightPosition?: { x: number; y: number; z: number }
}

/**
 * Scene Manager Options
 */
export interface SceneManagerOptions {
  /** Background color (default: 0x000000) */
  backgroundColor?: number | string | THREE.Color
  
  /** Fog configuration */
  fog?: {
    color: number | string
    near: number
    far: number
  }
  
  /** Light configuration */
  lights?: LightConfig
}

/**
 * Default light configuration - THREE-POINT LIGHTING SYSTEM
 * 
 * Key Light (Directional): Main sun light creating terminator line
 * Fill Light (Back): Subtle fill for depth
 * Ambient: Base illumination
 */
const DEFAULT_LIGHTS: Required<LightConfig> = {
  // AMBIENT - Base illumination (tăng để Earth sáng hơn)
  ambientIntensity: 0.6,  // Tăng từ 0.4 để sáng hơn
  ambientColor: COLORS.lights.ambient,
  
  // KEY LIGHT (Sun) - Creates terminator line on Earth
  directionalIntensity: 3.5,  // Tăng từ 2.5 để ánh sáng mặt trời mạnh hơn
  directionalColor: 0xffffff,  // Ánh sáng trắng tinh khiết của mặt trời
  directionalPosition: { x: 5, y: 3, z: 10 },  // Điều chỉnh vị trí để chiếu thẳng hơn
  
  // FILL LIGHT (Back) - Rim lighting for depth
  backLightIntensity: 0.8,  // Tăng để tạo rim light rõ hơn
  backLightColor: 0x6688cc,  // Cool blue for contrast
  backLightPosition: { x: -8, y: -3, z: -8 },
}

/**
 * Scene Manager Class
 * 
 * Quản lý Three.js Scene, lights, và objects
 * 
 * @example
 * ```typescript
 * const sceneManager = new SceneManager({
 *   backgroundColor: 0x000011,
 *   lights: {
 *     ambientIntensity: 0.5,
 *     directionalIntensity: 1.0,
 *   }
 * })
 * 
 * // Add objects
 * sceneManager.add(earthMesh)
 * sceneManager.add(starfield)
 * 
 * // Get scene for rendering
 * renderer.render(sceneManager.scene, camera)
 * 
 * // Cleanup
 * sceneManager.dispose()
 * ```
 */
export class SceneManager {
  // PRIVATE PROPERTIES
  private _scene: THREE.Scene
  private _ambientLight: THREE.AmbientLight
  private _directionalLight: THREE.DirectionalLight
  private _backLight: THREE.DirectionalLight
  private _objects: Map<string, THREE.Object3D> = new Map()
  private _isDisposed: boolean = false

  // CONSTRUCTOR
  /**
   * Create new SceneManager
   * 
   * @param options - Scene options
   */
  constructor(options: SceneManagerOptions = {}) {
    // Create scene
    this._scene = new THREE.Scene()
    
    // Set background
    if (options.backgroundColor !== undefined) {
      this._scene.background = new THREE.Color(options.backgroundColor)
    }
    
    // Set fog
    if (options.fog) {
      this._scene.fog = new THREE.Fog(
        options.fog.color,
        options.fog.near,
        options.fog.far
      )
    }
    
    // Setup lights
    const lightConfig = { ...DEFAULT_LIGHTS, ...options.lights }
    
    // Ambient light
    this._ambientLight = new THREE.AmbientLight(
      lightConfig.ambientColor,
      lightConfig.ambientIntensity
    )
    this._scene.add(this._ambientLight)
    
    // Directional light (main light source - sun)
    this._directionalLight = new THREE.DirectionalLight(
      lightConfig.directionalColor,
      lightConfig.directionalIntensity
    )
    this._directionalLight.position.set(
      lightConfig.directionalPosition.x,
      lightConfig.directionalPosition.y,
      lightConfig.directionalPosition.z
    )
    this._scene.add(this._directionalLight)
    
    // Back light (fill light for depth)
    this._backLight = new THREE.DirectionalLight(
      lightConfig.backLightColor,
      lightConfig.backLightIntensity
    )
    this._backLight.position.set(
      lightConfig.backLightPosition.x,
      lightConfig.backLightPosition.y,
      lightConfig.backLightPosition.z
    )
    this._scene.add(this._backLight)
  }

  // PUBLIC GETTERS
  /**
   * Get Three.js Scene
   */
  get scene(): THREE.Scene {
    return this._scene
  }

  /**
   * Get ambient light
   */
  get ambientLight(): THREE.AmbientLight {
    return this._ambientLight
  }

  /**
   * Get directional light
   */
  get directionalLight(): THREE.DirectionalLight {
    return this._directionalLight
  }

  /**
   * Get back light
   */
  get backLight(): THREE.DirectionalLight {
    return this._backLight
  }

  /**
   * Get all managed objects
   */
  get objects(): Map<string, THREE.Object3D> {
    return new Map(this._objects)
  }

  /**
   * Check if scene is disposed
   */
  get isDisposed(): boolean {
    return this._isDisposed
  }

  // PUBLIC METHODS - OBJECT MANAGEMENT
  /**
   * Add object to scene
   * 
   * @param object - Object to add
   * @param name - Optional name for retrieval
   * @returns The added object
   * 
   * @example
   * ```typescript
   * sceneManager.add(earthMesh, 'earth')
   * sceneManager.add(starfield, 'starfield')
   * ```
   */
  add<T extends THREE.Object3D>(object: T, name?: string): T {
    if (this._isDisposed) {
      console.warn('SceneManager: Cannot add object after disposal')
      return object
    }
    
    this._scene.add(object)
    
    // Store reference if name provided
    if (name) {
      this._objects.set(name, object)
    }
    
    return object
  }

  /**
   * Remove object from scene
   * 
   * @param objectOrName - Object hoặc name để remove
   * @returns true nếu removed thành công
   * 
   * @example
   * ```typescript
   * sceneManager.remove('starfield')
   * sceneManager.remove(earthMesh)
   * ```
   */
  remove(objectOrName: THREE.Object3D | string): boolean {
    if (this._isDisposed) return false
    
    let object: THREE.Object3D | undefined
    
    if (typeof objectOrName === 'string') {
      object = this._objects.get(objectOrName)
      if (object) {
        this._objects.delete(objectOrName)
      }
    } else {
      object = objectOrName
      // Remove from map if stored
      for (const [name, obj] of this._objects) {
        if (obj === object) {
          this._objects.delete(name)
          break
        }
      }
    }
    
    if (object) {
      this._scene.remove(object)
      return true
    }
    
    return false
  }

  /**
   * Get object by name
   * 
   * @param name - Object name
   * @returns Object hoặc undefined
   * 
   * @example
   * ```typescript
   * const earth = sceneManager.get('earth')
   * if (earth) {
   *   earth.rotation.y += 0.01
   * }
   * ```
   */
  get<T extends THREE.Object3D>(name: string): T | undefined {
    return this._objects.get(name) as T | undefined
  }

  /**
   * Check if object exists
   * 
   * @param name - Object name
   * @returns true nếu exists
   */
  has(name: string): boolean {
    return this._objects.has(name)
  }

  /**
   * Clear all objects (giữ lights)
   */
  clearObjects(): void {
    for (const [, object] of this._objects) {
      this._scene.remove(object)
    }
    this._objects.clear()
  }

  // PUBLIC METHODS - LIGHTING
  /**
   * Set ambient light intensity
   * 
   * @param intensity - Intensity (0-1)
   */
  setAmbientIntensity(intensity: number): void {
    this._ambientLight.intensity = intensity
  }

  /**
   * Set directional light intensity
   * 
   * @param intensity - Intensity (0-1)
   */
  setDirectionalIntensity(intensity: number): void {
    this._directionalLight.intensity = intensity
  }

  /**
   * Set back light intensity
   * 
   * @param intensity - Intensity (0-1)
   */
  setBackLightIntensity(intensity: number): void {
    this._backLight.intensity = intensity
  }

  /**
   * Set all light intensities
   * 
   * @param ambient - Ambient intensity
   * @param directional - Directional intensity
   * @param backLight - Back light intensity
   */
  setLightIntensities(
    ambient: number,
    directional: number,
    backLight: number
  ): void {
    this._ambientLight.intensity = ambient
    this._directionalLight.intensity = directional
    this._backLight.intensity = backLight
  }

  /**
   * Set directional light position
   * 
   * @param x - X position
   * @param y - Y position
   * @param z - Z position
   */
  setDirectionalLightPosition(x: number, y: number, z: number): void {
    this._directionalLight.position.set(x, y, z)
  }

  /**
   * Set background color
   * 
   * @param color - Color
   */
  setBackground(color: number | string | THREE.Color | null): void {
    if (color === null) {
      this._scene.background = null
    } else {
      this._scene.background = new THREE.Color(color)
    }
  }

  /**
   * Set fog
   * 
   * @param color - Fog color
   * @param near - Near distance
   * @param far - Far distance
   */
  setFog(color: number | string, near: number, far: number): void {
    this._scene.fog = new THREE.Fog(color, near, far)
  }

  /**
   * Clear fog
   */
  clearFog(): void {
    this._scene.fog = null
  }

  // PUBLIC METHODS - TRAVERSAL
  /**
   * Traverse all objects in scene
   * 
   * @param callback - Callback for each object
   */
  traverse(callback: (object: THREE.Object3D) => void): void {
    this._scene.traverse(callback)
  }

  /**
   * Find object by predicate
   * 
   * @param predicate - Predicate function
   * @returns Found object hoặc undefined
   */
  find(predicate: (object: THREE.Object3D) => boolean): THREE.Object3D | undefined {
    let found: THREE.Object3D | undefined
    
    this._scene.traverse((object) => {
      if (!found && predicate(object)) {
        found = object
      }
    })
    
    return found
  }

  // PUBLIC METHODS - DISPOSAL
  /**
   * Dispose scene và cleanup
   */
  dispose(): void {
    if (this._isDisposed) return
    
    // Dispose all managed objects
    for (const [, object] of this._objects) {
      this.disposeObject(object)
    }
    this._objects.clear()
    
    // Dispose lights
    this._ambientLight.dispose()
    this._directionalLight.dispose()
    this._backLight.dispose()
    
    // Clear scene
    this._scene.clear()
    
    this._isDisposed = true
  }

  /**
   * Dispose single object recursively
   * 
   * @param object - Object to dispose
   */
  private disposeObject(object: THREE.Object3D): void {
    // Dispose geometry
    if ('geometry' in object && object.geometry) {
      (object.geometry as THREE.BufferGeometry).dispose()
    }
    
    // Dispose material(s)
    if ('material' in object && object.material) {
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material]
      
      for (const material of materials) {
        if (material && typeof material.dispose === 'function') {
          material.dispose()
        }
      }
    }
    
    // Recursively dispose children
    for (const child of object.children) {
      this.disposeObject(child)
    }
  }
}
