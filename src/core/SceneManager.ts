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

/**
 * Light Configuration - NASA Satellite Style Cinematic Lighting
 */
export interface LightConfig {
  /** Ambient light intensity (0-1) */
  ambientIntensity?: number
  
  /** Ambient light color */
  ambientColor?: number | string
  
  /** Key light (sun) intensity */
  keyLightIntensity?: number
  
  /** Key light color */
  keyLightColor?: number | string
  
  /** Key light position */
  keyLightPosition?: { x: number; y: number; z: number }
  
  /** Rim light intensity - creates sharp edge silhouette */
  rimLightIntensity?: number
  
  /** Rim light color */
  rimLightColor?: number | string
  
  /** Rim light position */
  rimLightPosition?: { x: number; y: number; z: number }
  
  /** Fill light intensity - subtle fill for shadows */
  fillLightIntensity?: number
  
  /** Fill light color */
  fillLightColor?: number | string
  
  /** Fill light position */
  fillLightPosition?: { x: number; y: number; z: number }
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
 * Default light configuration - NASA SATELLITE STYLE CINEMATIC LIGHTING
 * 
 * 🌞 Key Light (Sun): Warm white directional light creating dramatic daylight
 *    - Positioned at camera angle for optimal specular on oceans
 *    - Warm tone (#fff5e6) mimics actual sunlight
 * 
 * 💫 Rim Light: Cyan backlight creating atmospheric edge glow
 *    - Creates sharp silhouette separating Earth from space
 *    - Position behind Earth (negative Z)
 * 
 * 🌌 Ambient: Very low dark blue for space atmosphere
 *    - Keeps shadow areas from being pure black
 *    - Adds subtle atmospheric color
 * 
 * 💡 Fill Light: Subtle fill to lift shadow detail
 *    - Prevents shadows from being too harsh
 */
const DEFAULT_LIGHTS: Required<LightConfig> = {
  // 🌌 AMBIENT - Dark space atmosphere
  ambientIntensity: 0.6,  // Increased from 0.4 for overall brightness
  ambientColor: 0x0a0a1a,  // Deep space blue
  
  // 🌞 KEY LIGHT (Sun) - Cinematic daylight with warm tone
  keyLightIntensity: 2.5,  // Increased from 1.8 - BRIGHTER SUN
  keyLightColor: 0xfff5e6,  // Warm white sunlight (slightly yellow)
  keyLightPosition: { x: 6, y: 4, z: 8 },  // Moved closer (from z=10 to z=8)
  
  // 💫 RIM LIGHT - Cyan atmospheric edge glow
  rimLightIntensity: 2.8,  // Increased from 2.2 - STRONGER EDGE
  rimLightColor: 0x00f2ff,  // Bright cyan for atmosphere edge
  rimLightPosition: { x: -3, y: 1, z: -8 },  // Brought closer (from z=-10 to z=-8)
  
  // 💡 FILL LIGHT (Back Light) - Sharp rim edge definition
  fillLightIntensity: 0.8,  // Increased from 0.5 for better shadow lift
  fillLightColor: 0x4466aa,  // Cool blue fill
  fillLightPosition: { x: -8, y: -2, z: 5 },  // Off to the side
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
  private _keyLight: THREE.DirectionalLight
  private _rimLight: THREE.PointLight
  private _fillLight: THREE.DirectionalLight
  private _objects: Map<string, THREE.Object3D> = new Map()
  private _isDisposed: boolean = false
  
  // Store original rim light color for pollution effects
  private _originalRimLightColor: THREE.Color
  private _originalKeyLightIntensity: number

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
    
    // Setup lights - NASA Satellite Style
    const lightConfig = { ...DEFAULT_LIGHTS, ...options.lights }
    
    // 🌌 Ambient light - Dark blue space atmosphere
    this._ambientLight = new THREE.AmbientLight(
      lightConfig.ambientColor,
      lightConfig.ambientIntensity
    )
    this._scene.add(this._ambientLight)
    
    // 🌞 Key light (Sun) - Main light source
    this._keyLight = new THREE.DirectionalLight(
      lightConfig.keyLightColor,
      lightConfig.keyLightIntensity
    )
    this._keyLight.position.set(
      lightConfig.keyLightPosition.x,
      lightConfig.keyLightPosition.y,
      lightConfig.keyLightPosition.z
    )
    this._scene.add(this._keyLight)
    
    // 💫 Rim light - Cyan atmospheric edge glow (PointLight for softer falloff)
    this._rimLight = new THREE.PointLight(
      lightConfig.rimLightColor,
      lightConfig.rimLightIntensity,
      50,  // distance
      1.5  // decay
    )
    this._rimLight.position.set(
      lightConfig.rimLightPosition.x,
      lightConfig.rimLightPosition.y,
      lightConfig.rimLightPosition.z
    )
    this._scene.add(this._rimLight)
    
    // 💡 Fill light - Subtle shadow fill
    this._fillLight = new THREE.DirectionalLight(
      lightConfig.fillLightColor,
      lightConfig.fillLightIntensity
    )
    this._fillLight.position.set(
      lightConfig.fillLightPosition.x,
      lightConfig.fillLightPosition.y,
      lightConfig.fillLightPosition.z
    )
    this._scene.add(this._fillLight)
    
    // Store original values for pollution effects
    this._originalRimLightColor = new THREE.Color(lightConfig.rimLightColor)
    this._originalKeyLightIntensity = lightConfig.keyLightIntensity
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
   * Get key light (main sun light)
   */
  get keyLight(): THREE.DirectionalLight {
    return this._keyLight
  }

  /**
   * Get directional light (alias for keyLight - backwards compatibility)
   */
  get directionalLight(): THREE.DirectionalLight {
    return this._keyLight
  }

  /**
   * Get rim light (cyan atmospheric edge glow)
   */
  get rimLight(): THREE.PointLight {
    return this._rimLight
  }

  /**
   * Get fill light
   */
  get fillLight(): THREE.DirectionalLight {
    return this._fillLight
  }

  /**
   * Get back light (alias for fillLight - backwards compatibility)
   */
  get backLight(): THREE.DirectionalLight {
    return this._fillLight
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
   * Set key light (sun) intensity
   * 
   * @param intensity - Intensity (0-3)
   */
  setKeyLightIntensity(intensity: number): void {
    this._keyLight.intensity = intensity
  }

  /**
   * Set directional light intensity (alias for setKeyLightIntensity)
   * 
   * @param intensity - Intensity (0-3)
   */
  setDirectionalIntensity(intensity: number): void {
    this._keyLight.intensity = intensity
  }

  /**
   * Set rim light intensity
   * 
   * @param intensity - Intensity (0-2)
   */
  setRimLightIntensity(intensity: number): void {
    this._rimLight.intensity = intensity
  }

  /**
   * Set fill light intensity
   * 
   * @param intensity - Intensity (0-1)
   */
  setFillLightIntensity(intensity: number): void {
    this._fillLight.intensity = intensity
  }

  /**
   * Set back light intensity (alias for setFillLightIntensity)
   * 
   * @param intensity - Intensity (0-1)
   */
  setBackLightIntensity(intensity: number): void {
    this._fillLight.intensity = intensity
  }

  /**
   * Set all light intensities
   * 
   * @param ambient - Ambient intensity
   * @param keyLight - Key light (sun) intensity
   * @param rimLight - Rim light intensity
   * @param fillLight - Fill light intensity
   */
  setLightIntensities(
    ambient: number,
    keyLight: number,
    rimLight: number,
    fillLight?: number
  ): void {
    this._ambientLight.intensity = ambient
    this._keyLight.intensity = keyLight
    this._rimLight.intensity = rimLight
    if (fillLight !== undefined) {
      this._fillLight.intensity = fillLight
    }
  }

  /**
   * Set key light position
   * 
   * @param x - X position
   * @param y - Y position
   * @param z - Z position
   */
  setKeyLightPosition(x: number, y: number, z: number): void {
    this._keyLight.position.set(x, y, z)
  }

  /**
   * Set directional light position (alias for setKeyLightPosition)
   * 
   * @param x - X position
   * @param y - Y position
   * @param z - Z position
   */
  setDirectionalLightPosition(x: number, y: number, z: number): void {
    this._keyLight.position.set(x, y, z)
  }

  /**
   * 🔥 UPDATE LIGHTING BASED ON POLLUTION LEVEL
   * 
   * As pollution increases:
   * - Rim light fades from cyan to gray (atmosphere becomes polluted)
   * - Sun intensity decreases (smog blocking light)
   * - Ambient becomes slightly more brown/gray
   * 
   * @param pollutionLevel - Pollution level (0-1)
   */
  updateLightingForPollution(pollutionLevel: number): void {
    const t = Math.max(0, Math.min(1, pollutionLevel))
    
    // Rim light: Cyan (#00f2ff) -> Gray (#666666)
    const rimGray = new THREE.Color(0x666666)
    const currentRimColor = this._originalRimLightColor.clone()
    currentRimColor.lerp(rimGray, t * 0.7)  // 70% transition to gray at max pollution
    this._rimLight.color.copy(currentRimColor)
    
    // Rim light intensity decreases with pollution (atmosphere becomes hazy)
    this._rimLight.intensity = 1.2 * (1 - t * 0.5)  // 50% reduction at max
    
    // Key light (sun) becomes slightly dimmer and more orange/brown
    const sunDimFactor = 1 - t * 0.3  // 30% dimmer at max pollution
    this._keyLight.intensity = this._originalKeyLightIntensity * sunDimFactor
    
    // Sun color shifts warmer/orange with pollution (like sunset through smog)
    const cleanSunColor = new THREE.Color(0xfff5e6)  // Warm white
    const pollutedSunColor = new THREE.Color(0xffaa66)  // Orange/brown
    const sunColor = cleanSunColor.clone()
    sunColor.lerp(pollutedSunColor, t * 0.4)  // Subtle color shift
    this._keyLight.color.copy(sunColor)
    
    // Ambient becomes slightly more brown/hazy
    const cleanAmbient = new THREE.Color(0x0a0a1a)  // Deep blue
    const pollutedAmbient = new THREE.Color(0x1a1510)  // Brown/gray
    const ambientColor = cleanAmbient.clone()
    ambientColor.lerp(pollutedAmbient, t * 0.5)
    this._ambientLight.color.copy(ambientColor)
    
    // Slightly increase ambient to simulate light scattering in smog
    this._ambientLight.intensity = 0.15 + t * 0.1
  }

  /**
   * Reset lighting to clean state
   */
  resetLighting(): void {
    this._rimLight.color.copy(this._originalRimLightColor)
    this._rimLight.intensity = 1.2
    this._keyLight.intensity = this._originalKeyLightIntensity
    this._keyLight.color.set(0xfff5e6)
    this._ambientLight.color.set(0x0a0a1a)
    this._ambientLight.intensity = 0.15
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
    this._keyLight.dispose()
    this._rimLight.dispose()
    this._fillLight.dispose()
    
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
