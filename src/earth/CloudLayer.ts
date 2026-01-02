/**
 * Cloud Layer
 * 
 * Cloud/Smog sphere với DRAMATIC pollution transformation
 * 
 * @module earth/CloudLayer
 * 
 * Design principles:
 * - Clean: Light fluffy clouds
 * - Polluted: Dense toxic smog che lấp lục địa
 * - Ở 100%: Opacity 0.85+ che gần như toàn bộ bề mặt
 */

import * as THREE from 'three'
import { EARTH_GEOMETRY, EARTH_CLOUDS } from '../config/earthConfig'
import { COLORS } from '../config/colors'
import { clamp, lerp } from '../utils/math'

/**
 * Cloud Layer Options
 */
export interface CloudLayerOptions {
  /** Cloud texture */
  cloudTexture?: THREE.Texture
  
  /** Initial opacity (default: 0.4) - lower for clean state */
  opacity?: number
  
  /** Initial pollution level (0-100) */
  pollutionLevel?: number
  
  /** Cloud layer offset from Earth (default: 0.02) */
  heightOffset?: number
}

/**
 * Cloud Layer Class
 * 
 * Clean clouds → Toxic smog transformation
 * 
 * @example
 * ```typescript
 * const clouds = new CloudLayer({
 *   cloudTexture: textures.get('cloudsMap'),
 *   pollutionLevel: 0,
 * })
 * 
 * scene.add(clouds.mesh)
 * 
 * // At 100%, smog covers entire Earth
 * clouds.setPollutionLevel(100)
 * ```
 */
export class CloudLayer {
  // PRIVATE PROPERTIES
  private _mesh: THREE.Mesh
  private _material: THREE.MeshStandardMaterial
  private _pollutionLevel: number = 0
  private _baseOpacity: number
  private _rotationSpeed: number
  private _cleanColor: THREE.Color
  private _smogColor: THREE.Color
  private _isDisposed: boolean = false

  // CONSTRUCTOR
  /**
   * Create new CloudLayer
   * 
   * @param options - Cloud layer options
   */
  constructor(options: CloudLayerOptions = {}) {
    // Config
    const radius = EARTH_GEOMETRY.radius
    const heightOffset = options.heightOffset ?? (EARTH_CLOUDS.radius - EARTH_GEOMETRY.radius)
    const cloudRadius = radius + heightOffset
    const segments = EARTH_GEOMETRY.widthSegments
    
    this._baseOpacity = options.opacity ?? 0.4  // Start with lighter clouds
    this._rotationSpeed = EARTH_CLOUDS.rotationSpeed
    this._pollutionLevel = options.pollutionLevel ?? 0
    
    // Color setup - Clean white → Dark smog
    this._cleanColor = new THREE.Color(COLORS.atmosphere.clouds)  // #f0f0f0
    this._smogColor = new THREE.Color(COLORS.atmosphere.smog || 0x2d2418)  // Dark brown smog
    
    // Create geometry
    const geometry = new THREE.SphereGeometry(cloudRadius, segments, segments)
    
    // Create material với more sophisticated settings
    this._material = new THREE.MeshStandardMaterial({
      color: this._cleanColor,
      transparent: true,
      opacity: this._baseOpacity,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.NormalBlending,
      roughness: 1.0,
      metalness: 0.0,
    })
    
    // Apply texture
    if (options.cloudTexture) {
      this._material.map = options.cloudTexture
      this._material.alphaMap = options.cloudTexture
    }
    
    // Create mesh
    this._mesh = new THREE.Mesh(geometry, this._material)
    this._mesh.name = 'clouds'
    
    // Apply initial pollution
    this.setPollutionLevel(this._pollutionLevel)
  }

  // PUBLIC GETTERS
  /**
   * Get cloud mesh
   */
  get mesh(): THREE.Mesh {
    return this._mesh
  }

  /**
   * Get cloud material
   */
  get material(): THREE.MeshStandardMaterial {
    return this._material
  }

  /**
   * Get current opacity
   */
  get opacity(): number {
    return this._material.opacity
  }

  /**
   * Get pollution level
   */
  get pollutionLevel(): number {
    return this._pollutionLevel
  }

  /**
   * Check if disposed
   */
  get isDisposed(): boolean {
    return this._isDisposed
  }

  // PUBLIC METHODS
  /**
   * Update cloud rotation
   * 
   * @param deltaTime - Time since last frame (seconds)
   */
  update(deltaTime: number): void {
    if (this._isDisposed) return
    
    // Pollution slows down cloud movement (dense smog moves slower)
    const speedMultiplier = lerp(1.0, 0.3, this._pollutionLevel / 100)
    this._mesh.rotation.y += this._rotationSpeed * deltaTime * speedMultiplier
  }

  /**
   * Set pollution level - DRAMATIC TRANSFORMATION
   * 
   * 0%: Light wispy clouds, low opacity
   * 50%: Gray thickening clouds
   * 80%+: Dark brown/black smog
   * 100%: Opacity 0.85 - almost complete coverage
   * 
   * @param level - Pollution level (0-100)
   */
  setPollutionLevel(level: number): void {
    if (this._isDisposed) return
    
    this._pollutionLevel = clamp(level, 0, 100)
    const weight = this._pollutionLevel / 100
    
    // === OPACITY - CRITICAL for visual impact ===
    // Clean: 0.4 (light clouds visible)
    // Polluted: 0.85 (dense smog covers surface)
    const opacity = lerp(this._baseOpacity, 0.85, Math.pow(weight, 0.8))
    this._material.opacity = opacity
    
    // === COLOR SHIFT ===
    // White fluffy → Dark brown/gray smog
    this._material.color.lerpColors(this._cleanColor, this._smogColor, weight)
    
    // === EMISSIVE for "glowing" pollution effect at high levels ===
    if (weight > 0.6) {
      const emissiveWeight = (weight - 0.6) / 0.4  // 0-1 trong range 60-100%
      this._material.emissive = new THREE.Color(0x1a0f00)  // Dim orange-brown
      this._material.emissiveIntensity = emissiveWeight * 0.15
    } else {
      this._material.emissiveIntensity = 0
    }
    
    // === SCALE - Smog expands slightly ===
    const scaleBoost = lerp(1.0, 1.03, weight)
    this._mesh.scale.setScalar(scaleBoost)
    
    this._material.needsUpdate = true
  }

  /**
   * Set opacity directly
   * 
   * @param opacity - Opacity (0-1)
   */
  setOpacity(opacity: number): void {
    if (this._isDisposed) return
    
    this._material.opacity = clamp(opacity, 0, 1)
  }

  /**
   * Set cloud texture
   * 
   * @param texture - Cloud texture
   */
  setTexture(texture: THREE.Texture): void {
    if (this._isDisposed) return
    
    this._material.map = texture
    this._material.alphaMap = texture
    this._material.needsUpdate = true
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
   * Show clouds
   */
  show(): void {
    this._mesh.visible = true
  }

  /**
   * Hide clouds
   */
  hide(): void {
    this._mesh.visible = false
  }

  /**
   * Toggle visibility
   * 
   * @returns New visibility state
   */
  toggle(): boolean {
    this._mesh.visible = !this._mesh.visible
    return this._mesh.visible
  }

  /**
   * Dispose cloud layer
   */
  dispose(): void {
    if (this._isDisposed) return
    
    this._mesh.geometry.dispose()
    this._material.dispose()
    
    this._isDisposed = true
  }
}
