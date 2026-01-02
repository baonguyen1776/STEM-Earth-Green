/**
 * Smoke System
 * 
 * Particle system cho smoke/pollution effect
 * 
 * @module effects/SmokeSystem
 * 
 * Design principles:
 * - Particle system với lifetime management
 * - Spawn rate based on pollution level
 * - Rising smoke với dispersion
 */

import * as THREE from 'three'
import { EARTH_GEOMETRY } from '../config/earthConfig'
import { COLORS } from '../config/colors'
import { clamp, lerp } from '../utils/math'

/**
 * Smoke Particle
 */
interface SmokeParticle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  life: number
  maxLife: number
  size: number
  opacity: number
}

/**
 * Smoke System Options
 */
export interface SmokeSystemOptions {
  /** Max particles (default: 500) */
  maxParticles?: number
  
  /** Initial pollution level (0-100) */
  pollutionLevel?: number
  
  /** Earth radius for spawn positioning */
  earthRadius?: number
  
  /** Smoke color (default: gray) */
  color?: number | string
}

/**
 * Smoke System Class
 * 
 * Particle system cho industrial smoke/pollution
 * 
 * @example
 * ```typescript
 * const smoke = new SmokeSystem({ pollutionLevel: 75 })
 * scene.add(smoke.mesh)
 * 
 * // Update trong animation loop
 * smoke.update(deltaTime)
 * 
 * // Update pollution level
 * smoke.setPollutionLevel(90)
 * ```
 */
export class SmokeSystem {
  // PRIVATE PROPERTIES
  private _mesh: THREE.Points
  private _geometry: THREE.BufferGeometry
  private _material: THREE.PointsMaterial
  private _particles: SmokeParticle[] = []
  private _maxParticles: number
  private _pollutionLevel: number = 0
  private _earthRadius: number
  private _spawnTimer: number = 0
  private _activeCount: number = 0
  private _isDisposed: boolean = false

  // CONSTRUCTOR
  /**
   * Create new SmokeSystem
   * 
   * @param options - Smoke system options
   */
  constructor(options: SmokeSystemOptions = {}) {
    // Config
    this._maxParticles = options.maxParticles ?? 500
    this._pollutionLevel = options.pollutionLevel ?? 0
    this._earthRadius = options.earthRadius ?? EARTH_GEOMETRY.radius
    const color = options.color ?? COLORS.effects.smoke
    
    // Initialize particles
    for (let i = 0; i < this._maxParticles; i++) {
      this._particles.push({
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 0,
        size: 0,
        opacity: 0,
      })
    }
    
    // Create geometry
    const positions = new Float32Array(this._maxParticles * 3)
    const sizes = new Float32Array(this._maxParticles)
    const opacities = new Float32Array(this._maxParticles)
    
    this._geometry = new THREE.BufferGeometry()
    this._geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this._geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    this._geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1))
    
    // Create material
    this._material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.NormalBlending,
      depthWrite: false,
    })
    
    // Create mesh
    this._mesh = new THREE.Points(this._geometry, this._material)
    this._mesh.name = 'smoke-system'
    this._mesh.frustumCulled = false
  }

  // PUBLIC GETTERS
  /**
   * Get smoke mesh
   */
  get mesh(): THREE.Points {
    return this._mesh
  }

  /**
   * Get active particle count
   */
  get activeCount(): number {
    return this._activeCount
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
   * Update smoke system
   * 
   * @param deltaTime - Time since last frame (seconds)
   */
  update(deltaTime: number): void {
    if (this._isDisposed) return
    
    // Spawn new particles based on pollution
    this.spawnParticles(deltaTime)
    
    // Update existing particles
    this.updateParticles(deltaTime)
    
    // Update geometry
    this.updateGeometry()
  }

  /**
   * Set pollution level - EXPONENTIAL particle increase at SEVERE levels
   * 
   * 0-50%: Minimal smoke
   * 50-80%: Moderate increase
   * 81-100% (SEVERE): EXPONENTIAL explosion of particles
   * 
   * @param level - Pollution level (0-100)
   */
  setPollutionLevel(level: number): void {
    if (this._isDisposed) return
    
    this._pollutionLevel = clamp(level, 0, 100)
    
    // Update smoke color based on pollution
    const cleanColor = new THREE.Color(COLORS.effects.smoke)
    const dirtyColor = new THREE.Color(COLORS.effects.smokeDense || 0x1a1a1a)
    const weight = this._pollutionLevel / 100
    this._material.color.lerpColors(cleanColor, dirtyColor, weight)
    
    // OPACITY increases with pollution 
    const opacity = lerp(0.3, 0.8, weight)
    this._material.opacity = opacity
    
    // SIZE increases at severe levels 
    const severeWeight = Math.max(0, (this._pollutionLevel - 80) / 20)
    const particleSize = lerp(0.1, 0.25, severeWeight)
    this._material.size = particleSize
  }

  /**
   * Set smoke color
   * 
   * @param color - Smoke color
   */
  setColor(color: number | string | THREE.Color): void {
    if (this._isDisposed) return
    
    this._material.color = new THREE.Color(color)
  }

  /**
   * Show smoke
   */
  show(): void {
    this._mesh.visible = true
  }

  /**
   * Hide smoke
   */
  hide(): void {
    this._mesh.visible = false
  }

  /**
   * Clear all particles
   */
  clear(): void {
    for (const particle of this._particles) {
      particle.life = 0
    }
    this._activeCount = 0
    this.updateGeometry()
  }

  /**
   * Dispose smoke system
   */
  dispose(): void {
    if (this._isDisposed) return
    
    this._geometry.dispose()
    this._material.dispose()
    
    this._isDisposed = true
  }

  // PRIVATE METHODS
  /**
   * Spawn new particles - EXPONENTIAL at SEVERE pollution
   */
  private spawnParticles(deltaTime: number): void {
    // Only spawn if pollution > 30%
    if (this._pollutionLevel < 30) return
    
    // EXPONENTIAL SPAWN RATE
    // 30-80%: Linear increase 5-30 particles/sec
    // 81-100%: EXPONENTIAL jump to 100+ particles/sec
    let spawnRate: number
    
    if (this._pollutionLevel <= 80) {
      // Linear phase
      const normalizedPollution = (this._pollutionLevel - 30) / 50 // 0-1
      spawnRate = lerp(5, 30, normalizedPollution)
    } else {
      // SEVERE PHASE - Exponential explosion
      const severeProgress = (this._pollutionLevel - 80) / 20 // 0-1
      // Exponential curve: 30 → 150 particles/sec
      spawnRate = 30 + Math.pow(severeProgress, 2) * 120
    }
    
    this._spawnTimer += deltaTime
    const spawnInterval = 1 / spawnRate
    
    while (this._spawnTimer >= spawnInterval) {
      this._spawnTimer -= spawnInterval
      this.spawnParticle()
    }
  }

  /**
   * Spawn single particle - larger at severe pollution
   */
  private spawnParticle(): void {
    // Find dead particle
    const particle = this._particles.find(p => p.life <= 0)
    if (!particle) return
    
    // Random spawn point on Earth surface
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    
    // Spawn slightly above surface
    const spawnRadius = this._earthRadius * 1.05
    
    particle.position.set(
      spawnRadius * Math.sin(phi) * Math.cos(theta),
      spawnRadius * Math.sin(phi) * Math.sin(theta),
      spawnRadius * Math.cos(phi)
    )
    
    // Velocity: outward và upward
    const normal = particle.position.clone().normalize()
    const upward = new THREE.Vector3(0, 1, 0)
    
    particle.velocity.copy(normal)
      .multiplyScalar(0.2)
      .add(upward.multiplyScalar(0.1 + Math.random() * 0.1))
    
    // Add some randomness
    particle.velocity.x += (Math.random() - 0.5) * 0.1
    particle.velocity.y += (Math.random() - 0.5) * 0.1
    particle.velocity.z += (Math.random() - 0.5) * 0.1
    
    // Lifetime
    particle.maxLife = 2 + Math.random() * 2
    particle.life = particle.maxLife
    particle.size = 0.05 + Math.random() * 0.1
    particle.opacity = 0.3 + Math.random() * 0.3
    
    this._activeCount++
  }

  /**
   * Update existing particles
   */
  private updateParticles(deltaTime: number): void {
    this._activeCount = 0
    
    for (const particle of this._particles) {
      if (particle.life <= 0) continue
      
      // Update life
      particle.life -= deltaTime
      
      if (particle.life <= 0) continue
      
      this._activeCount++
      
      // Update position
      particle.position.add(
        particle.velocity.clone().multiplyScalar(deltaTime)
      )
      
      // Slow down và expand
      particle.velocity.multiplyScalar(0.99)
      particle.size *= 1.01
      
      // Fade out
      const lifeRatio = particle.life / particle.maxLife
      particle.opacity = lerp(0, 0.5, lifeRatio)
    }
  }

  /**
   * Update geometry attributes
   */
  private updateGeometry(): void {
    const positions = this._geometry.attributes.position as THREE.BufferAttribute
    const posArray = positions.array as Float32Array
    
    for (let i = 0; i < this._particles.length; i++) {
      const particle = this._particles[i]
      
      if (particle.life > 0) {
        posArray[i * 3] = particle.position.x
        posArray[i * 3 + 1] = particle.position.y
        posArray[i * 3 + 2] = particle.position.z
      } else {
        // Move off-screen
        posArray[i * 3] = 0
        posArray[i * 3 + 1] = -1000
        posArray[i * 3 + 2] = 0
      }
    }
    
    positions.needsUpdate = true
  }
}
