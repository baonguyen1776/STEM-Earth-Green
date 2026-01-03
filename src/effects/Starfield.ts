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
  
  /** Enable sun glow in background (default: true) */
  enableSun?: boolean
  
  /** Sun position (default: behind camera, top-right) */
  sunPosition?: { x: number; y: number; z: number }
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
  
  // Sun glow
  private _sunGroup: THREE.Group | null = null
  private _sunCoreMesh: THREE.Mesh | null = null
  private _sunGlowMesh: THREE.Mesh | null = null
  private _sunRaysMesh: THREE.Mesh | null = null

  // CONSTRUCTOR
  /**
   * Create new Starfield
   * 
   * @param options - Starfield options
   */
  constructor(options: StarfieldOptions = {}) {
    // Config
    this._count = options.count ?? 2500  // Reduced from 5000 for refined look
    const minDistance = options.minDistance ?? 50
    const maxDistance = options.maxDistance ?? 300
    const size = options.size ?? 0.8  // Adjusted size
    const color = options.color ?? 0xffffff
    this._twinkle = options.twinkle ?? false
    
    // Create positions with size variation and opacity
    const positions = new Float32Array(this._count * 3)
    const sizes = new Float32Array(this._count)
    const opacities = new Float32Array(this._count)  // Random opacity for depth
    
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
      
      // Size variation for depth perception
      sizes[i] = size * (0.4 + Math.random() * 0.6)  // 0.4x to 1.0x
      
      // Random opacity (0.3 to 0.8) for atmospheric depth
      opacities[i] = 0.3 + Math.random() * 0.5
    }
    
    // Create geometry
    this._geometry = new THREE.BufferGeometry()
    this._geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this._geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    this._geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1))
    
    // Store original sizes for twinkle
    if (this._twinkle) {
      this._originalSizes = new Float32Array(sizes)
    }
    
    // Create canvas-based circle texture for soft star appearance
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    
    // Draw soft circle with gradient
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')    // Center: solid white
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)')  // Mid: slightly transparent
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')    // Edge: transparent
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    
    const starTexture = new THREE.CanvasTexture(canvas)
    
    // Create material with texture and custom opacity
    this._material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 1.0,  // Base size, individual sizes set via vertex attribute
      sizeAttenuation: true,
      map: starTexture,
      transparent: true,
      opacity: 1,  // Individual opacity set via vertex shader
      blending: THREE.AdditiveBlending,  // Stars glow/brighten background
      depthWrite: false,
    })
    
    // Create mesh
    this._mesh = new THREE.Points(this._geometry, this._material)
    this._mesh.name = 'starfield'
    
    // Create sun glow if enabled
    const enableSun = options.enableSun ?? true
    if (enableSun) {
      this._createSunGlow(options.sunPosition ?? { x: 40, y: 25, z: 60 })
    }
  }
  
  /**
   * Create sun glow effect in background
   * 
   * @param position - Sun position
   */
  private _createSunGlow(position: { x: number; y: number; z: number }): void {
    this._sunGroup = new THREE.Group()
    this._sunGroup.name = 'sunGlow'
    
    // 🌞 Sun Core - bright white/yellow center
    const coreGeometry = new THREE.SphereGeometry(3, 32, 32)
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffdd,  // Slightly yellowed for warmth
      transparent: true,
      opacity: 1,
    })
    this._sunCoreMesh = new THREE.Mesh(coreGeometry, coreMaterial)
    this._sunGroup.add(this._sunCoreMesh)
    
    // 💫 Inner Glow - warm yellow halo
    const glowGeometry = new THREE.SphereGeometry(6, 32, 32)
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0xffdd66) },
        intensity: { value: 3.5 },  // Increased from 1.5
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float intensity;
        varying vec3 vNormal;
        void main() {
          float glow = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(glowColor * intensity, glow * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    })
    this._sunGlowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
    this._sunGroup.add(this._sunGlowMesh)
    
    // ✨ Outer Rays - large soft glow
    const raysGeometry = new THREE.SphereGeometry(30, 32, 32)  // Increased from 22 - MUCH LARGER
    const raysMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0xffcc88) },  // Warm orange
        intensity: { value: 3.5 },  // Increased from 2.0 - BRIGHT
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float intensity;
        varying vec3 vNormal;
        void main() {
          float glow = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          gl_FragColor = vec4(glowColor * intensity, glow * 0.4);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    })
    this._sunRaysMesh = new THREE.Mesh(raysGeometry, raysMaterial)
    this._sunGroup.add(this._sunRaysMesh)
    
    // Position the sun - closer to camera for more impact
    this._sunGroup.position.set(position.x, position.y, position.z - 10)  // Moved closer (z-10)
    
    // Add to star mesh parent (will be added to scene together)
    this._mesh.add(this._sunGroup)
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
    
    // Dispose sun
    if (this._sunCoreMesh) {
      this._sunCoreMesh.geometry.dispose()
      ;(this._sunCoreMesh.material as THREE.Material).dispose()
    }
    if (this._sunGlowMesh) {
      this._sunGlowMesh.geometry.dispose()
      ;(this._sunGlowMesh.material as THREE.Material).dispose()
    }
    if (this._sunRaysMesh) {
      this._sunRaysMesh.geometry.dispose()
      ;(this._sunRaysMesh.material as THREE.Material).dispose()
    }
    
    this._isDisposed = true
  }
  
  /**
   * Get sun group (for external manipulation)
   */
  get sunGroup(): THREE.Group | null {
    return this._sunGroup
  }
}
