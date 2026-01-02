/**
 * Starfield
 * 
 * Particle-based background stars
 * 
 * @module effects/Starfield
 * 
 * Design principles:
 * - BufferGeometry cho performance
 * - Random distribution với distance-based sizing
 * - Optional animation
 */

import * as THREE from 'three'
import { clamp } from '../utils/math'

/**
 * Starfield Options
 */
export interface StarfieldOptions {
  /** Number of stars (default: 5000) */
  count?: number
  
  /** Minimum distance from center (default: 50) */
  minDistance?: number
  
  /** Maximum distance from center (default: 300) */
  maxDistance?: number
  
  /** Star size (default: 0.5) */
  size?: number
  
  /** Star color (default: white) */
  color?: number | string
  
  /** Enable twinkle animation (default: false) */
  twinkle?: boolean
}

/**
 * Starfield Class
 * 
 * Creates particle-based star background
 * 
 * @example
 * ```typescript
 * const stars = new Starfield({ count: 5000 })
 * scene.add(stars.mesh)
 * 
 * // Optional: animate twinkle
 * stars.update(deltaTime)
 * ```
 */
export class Starfield {
  // PRIVATE PROPERTIES
  private _mesh: THREE.Points
  private _geometry: THREE.BufferGeometry
  private _material: THREE.PointsMaterial
  private _count: number
  private _twinkle: boolean
  private _originalSizes: Float32Array | null = null
  private _twinkleSpeed: number = 2
  private _time: number = 0
  private _isDisposed: boolean = false

  // CONSTRUCTOR
  /**
   * Create new Starfield
   * 
   * @param options - Starfield options
   */
  constructor(options: StarfieldOptions = {}) {
    // Config
    this._count = options.count ?? 5000
    const minDistance = options.minDistance ?? 50
    const maxDistance = options.maxDistance ?? 300
    const size = options.size ?? 0.5
    const color = options.color ?? 0xffffff
    this._twinkle = options.twinkle ?? false
    
    // Create positions
    const positions = new Float32Array(this._count * 3)
    const sizes = new Float32Array(this._count)
    
    for (let i = 0; i < this._count; i++) {
      // Random direction
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      // Random distance
      const distance = minDistance + Math.random() * (maxDistance - minDistance)
      
      // Convert spherical to cartesian
      const x = distance * Math.sin(phi) * Math.cos(theta)
      const y = distance * Math.sin(phi) * Math.sin(theta)
      const z = distance * Math.cos(phi)
      
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      
      // Random size variation
      sizes[i] = size * (0.5 + Math.random() * 0.5)
    }
    
    // Create geometry
    this._geometry = new THREE.BufferGeometry()
    this._geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this._geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    
    // Store original sizes for twinkle
    if (this._twinkle) {
      this._originalSizes = new Float32Array(sizes)
    }
    
    // Create material
    this._material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: size,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    
    // Create mesh
    this._mesh = new THREE.Points(this._geometry, this._material)
    this._mesh.name = 'starfield'
  }

  // PUBLIC GETTERS
  /**
   * Get star mesh
   */
  get mesh(): THREE.Points {
    return this._mesh
  }

  /**
   * Get star count
   */
  get count(): number {
    return this._count
  }

  /**
   * Check if disposed
   */
  get isDisposed(): boolean {
    return this._isDisposed
  }

  // PUBLIC METHODS
  /**
   * Update starfield (for twinkle animation)
   * 
   * @param deltaTime - Time since last frame (seconds)
   */
  update(deltaTime: number): void {
    if (this._isDisposed || !this._twinkle || !this._originalSizes) return
    
    this._time += deltaTime * this._twinkleSpeed
    
    const sizes = this._geometry.attributes.size as THREE.BufferAttribute
    const sizeArray = sizes.array as Float32Array
    
    for (let i = 0; i < this._count; i++) {
      // Sin wave với random phase
      const phase = i * 0.01
      const twinkleFactor = 0.7 + 0.3 * Math.sin(this._time + phase)
      sizeArray[i] = this._originalSizes[i] * twinkleFactor
    }
    
    sizes.needsUpdate = true
  }

  /**
   * Set star color
   * 
   * @param color - Star color
   */
  setColor(color: number | string | THREE.Color): void {
    if (this._isDisposed) return
    
    this._material.color = new THREE.Color(color)
  }

  /**
   * Set opacity
   * 
   * @param opacity - Opacity (0-1)
   */
  setOpacity(opacity: number): void {
    if (this._isDisposed) return
    
    this._material.opacity = clamp(opacity, 0, 1)
  }

  /**
   * Set size
   * 
   * @param size - Star size
   */
  setSize(size: number): void {
    if (this._isDisposed) return
    
    this._material.size = size
  }

  /**
   * Enable/disable twinkle
   * 
   * @param enabled - Enable twinkle
   */
  setTwinkle(enabled: boolean): void {
    this._twinkle = enabled
    
    if (enabled && !this._originalSizes) {
      const sizes = this._geometry.attributes.size as THREE.BufferAttribute
      this._originalSizes = new Float32Array(sizes.array as Float32Array)
    }
  }

  /**
   * Show starfield
   */
  show(): void {
    this._mesh.visible = true
  }

  /**
   * Hide starfield
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
   * Dispose starfield
   */
  dispose(): void {
    if (this._isDisposed) return
    
    this._geometry.dispose()
    this._material.dispose()
    
    this._isDisposed = true
  }
}
