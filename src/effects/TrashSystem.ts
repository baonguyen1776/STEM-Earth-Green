/**
 * Trash System
 * 
 * Floating trash/debris particles
 * 
 * @module effects/TrashSystem
 * 
 * Design principles:
 * - Orbiting debris particles
 * - Spawn rate based on pollution
 * - Various trash types/sizes
 */

import * as THREE from 'three'
import { EARTH_GEOMETRY } from '../config/earthConfig'
import { COLORS } from '../config/colors'
import { clamp, lerp } from '../utils/math'

/**
 * Trash Particle
 */
interface TrashParticle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  rotation: THREE.Euler
  rotationSpeed: THREE.Vector3
  scale: number
  active: boolean
}

/**
 * Trash System Options
 */
export interface TrashSystemOptions {
  /** Max particles (default: 200) */
  maxParticles?: number
  
  /** Initial pollution level (0-100) */
  pollutionLevel?: number
  
  /** Earth radius for orbit positioning */
  earthRadius?: number
  
  /** Orbit height above Earth (default: 0.2) */
  orbitHeight?: number
}

/**
 * Trash System Class
 * 
 * Floating debris/trash around Earth
 * 
 * @example
 * ```typescript
 * const trash = new TrashSystem({ pollutionLevel: 75 })
 * scene.add(trash.mesh)
 * 
 * // Update trong animation loop
 * trash.update(deltaTime)
 * 
 * // Update pollution level
 * trash.setPollutionLevel(90)
 * ```
 */
export class TrashSystem {
  // PRIVATE PROPERTIES
  private _group: THREE.Group
  private _meshes: THREE.InstancedMesh[]
  private _particles: TrashParticle[] = []
  private _maxParticles: number
  private _pollutionLevel: number = 0
  private _earthRadius: number
  private _orbitHeight: number
  private _spawnTimer: number = 0
  private _activeCount: number = 0
  private _dummy: THREE.Object3D
  private _isDisposed: boolean = false

  // CONSTRUCTOR
  /**
   * Create new TrashSystem
   * 
   * @param options - Trash system options
   */
  constructor(options: TrashSystemOptions = {}) {
    // Config
    this._maxParticles = options.maxParticles ?? 200
    this._pollutionLevel = options.pollutionLevel ?? 0
    this._earthRadius = options.earthRadius ?? EARTH_GEOMETRY.radius
    this._orbitHeight = options.orbitHeight ?? 0.2
    
    // Create group
    this._group = new THREE.Group()
    this._group.name = 'trash-system'
    
    // Create dummy for matrix transforms
    this._dummy = new THREE.Object3D()
    
    // Initialize particles
    for (let i = 0; i < this._maxParticles; i++) {
      this._particles.push({
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        rotation: new THREE.Euler(),
        rotationSpeed: new THREE.Vector3(),
        scale: 1,
        active: false,
      })
    }
    
    // Create instanced meshes for different trash types
    this._meshes = this.createTrashMeshes()
    
    // Initial geometry update
    this.updateGeometry()
  }

  // PUBLIC GETTERS
  /**
   * Get trash group (contains all meshes)
   */
  get mesh(): THREE.Group {
    return this._group
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
   * Update trash system
   * 
   * @param deltaTime - Time since last frame (seconds)
   */
  update(deltaTime: number): void {
    if (this._isDisposed) return
    
    // Spawn new particles based on pollution
    this.spawnParticles(deltaTime)
    
    // Update existing particles
    this.updateParticles(deltaTime)
    
    // Update instanced mesh matrices
    this.updateGeometry()
  }

  /**
   * Set pollution level
   * 
   * Higher pollution = more trash particles
   * 
   * @param level - Pollution level (0-100)
   */
  setPollutionLevel(level: number): void {
    if (this._isDisposed) return
    
    this._pollutionLevel = clamp(level, 0, 100)
    
    // Clear some particles if pollution decreases
    if (this._pollutionLevel < 60) {
      this.reduceParticles()
    }
  }

  /**
   * Show trash
   */
  show(): void {
    this._group.visible = true
  }

  /**
   * Hide trash
   */
  hide(): void {
    this._group.visible = false
  }

  /**
   * Clear all particles
   */
  clear(): void {
    for (const particle of this._particles) {
      particle.active = false
    }
    this._activeCount = 0
    this.updateGeometry()
  }

  /**
   * Dispose trash system
   */
  dispose(): void {
    if (this._isDisposed) return
    
    for (const mesh of this._meshes) {
      mesh.geometry.dispose()
      if (mesh.material instanceof THREE.Material) {
        mesh.material.dispose()
      }
    }
    
    this._isDisposed = true
  }

  // PRIVATE METHODS
  /**
   * Create instanced meshes for trash types
   */
  private createTrashMeshes(): THREE.InstancedMesh[] {
    const meshes: THREE.InstancedMesh[] = []
    
    // Box trash (plastic bottles, etc)
    const boxGeom = new THREE.BoxGeometry(0.02, 0.04, 0.02)
    const boxMat = new THREE.MeshStandardMaterial({
      color: COLORS.effects.plasticTrash,
      roughness: 0.8,
    })
    const boxMesh = new THREE.InstancedMesh(
      boxGeom,
      boxMat,
      Math.floor(this._maxParticles / 2)
    )
    boxMesh.name = 'trash-boxes'
    meshes.push(boxMesh)
    this._group.add(boxMesh)
    
    // Sphere trash (balls, etc)
    const sphereGeom = new THREE.IcosahedronGeometry(0.015, 0)
    const sphereMat = new THREE.MeshStandardMaterial({
      color: COLORS.effects.metalTrash,
      roughness: 0.6,
    })
    const sphereMesh = new THREE.InstancedMesh(
      sphereGeom,
      sphereMat,
      Math.floor(this._maxParticles / 2)
    )
    sphereMesh.name = 'trash-spheres'
    meshes.push(sphereMesh)
    this._group.add(sphereMesh)
    
    return meshes
  }

  /**
   * Spawn new particles - EXPONENTIAL at SEVERE pollution
   */
  private spawnParticles(deltaTime: number): void {
    // Only spawn if pollution > 40%
    if (this._pollutionLevel < 40) return
    
    // EXPONENTIAL SPAWN RATE
    // 40-80%: Linear increase 2-15 particles/sec
    // 81-100%: EXPONENTIAL explosion to 60+ particles/sec
    let spawnRate: number
    
    if (this._pollutionLevel <= 80) {
      // Linear phase
      const normalizedPollution = (this._pollutionLevel - 40) / 40 // 0-1
      spawnRate = lerp(2, 15, normalizedPollution)
    } else {
      // SEVERE PHASE - Exponential explosion of trash
      const severeProgress = (this._pollutionLevel - 80) / 20 // 0-1
      // Exponential: 15 → 60 particles/sec
      spawnRate = 15 + Math.pow(severeProgress, 1.8) * 45
    }
    
    this._spawnTimer += deltaTime
    const spawnInterval = 1 / spawnRate
    
    while (this._spawnTimer >= spawnInterval) {
      this._spawnTimer -= spawnInterval
      this.spawnParticle()
    }
  }

  /**
   * Spawn single particle - larger and more varied at severe pollution
   */
  private spawnParticle(): void {
    // Find inactive particle
    const particle = this._particles.find(p => !p.active)
    if (!particle) return
    
    // Random spawn point in orbit
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    
    // Spawn in orbit - wider orbit range at high pollution
    const severeWeight = Math.max(0, (this._pollutionLevel - 80) / 20)
    const orbitVariation = lerp(0.3, 0.8, severeWeight)
    const orbitRadius = this._earthRadius + this._orbitHeight + Math.random() * orbitVariation
    
    particle.position.set(
      orbitRadius * Math.sin(phi) * Math.cos(theta),
      orbitRadius * Math.sin(phi) * Math.sin(theta),
      orbitRadius * Math.cos(phi)
    )
    
    // Orbital velocity (tangent to surface)
    const normal = particle.position.clone().normalize()
    const tangent = new THREE.Vector3()
      .crossVectors(normal, new THREE.Vector3(0, 1, 0))
      .normalize()
    
    // If near poles, use different axis
    if (tangent.length() < 0.01) {
      tangent.crossVectors(normal, new THREE.Vector3(1, 0, 0)).normalize()
    }
    
    // Faster debris at severe pollution (chaotic movement)
    const baseSpeed = lerp(0.05, 0.12, severeWeight)
    const orbitalSpeed = baseSpeed + Math.random() * 0.05
    particle.velocity.copy(tangent).multiplyScalar(orbitalSpeed)
    
    // Add some drift - more chaotic at severe
    const driftIntensity = lerp(0.02, 0.06, severeWeight)
    particle.velocity.add(normal.multiplyScalar(-driftIntensity + Math.random() * driftIntensity * 2))
    
    // Random rotation
    particle.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    )
    
    // Faster tumbling at severe pollution
    const rotSpeed = lerp(2, 4, severeWeight)
    particle.rotationSpeed.set(
      (Math.random() - 0.5) * rotSpeed,
      (Math.random() - 0.5) * rotSpeed,
      (Math.random() - 0.5) * rotSpeed
    )
    
    // Larger debris at severe pollution
    const baseScale = lerp(0.5, 0.8, severeWeight)
    const scaleVariation = lerp(1.5, 2.5, severeWeight)
    particle.scale = baseScale + Math.random() * scaleVariation
    particle.active = true
    
    this._activeCount++
  }

  /**
   * Update existing particles
   */
  private updateParticles(deltaTime: number): void {
    this._activeCount = 0
    
    for (const particle of this._particles) {
      if (!particle.active) continue
      
      this._activeCount++
      
      // Update position
      particle.position.add(
        particle.velocity.clone().multiplyScalar(deltaTime)
      )
      
      // Update rotation
      particle.rotation.x += particle.rotationSpeed.x * deltaTime
      particle.rotation.y += particle.rotationSpeed.y * deltaTime
      particle.rotation.z += particle.rotationSpeed.z * deltaTime
      
      // Check if too far from Earth (despawn)
      const distance = particle.position.length()
      if (distance > this._earthRadius * 2 || distance < this._earthRadius * 0.9) {
        particle.active = false
      }
    }
  }

  /**
   * Reduce particles when pollution decreases
   */
  private reduceParticles(): void {
    // Map pollution from 0-60 to 0-30% of max particles
    const normalizedPollution = this._pollutionLevel / 60 // 0-1
    const targetCount = Math.floor(
      lerp(0, this._maxParticles * 0.3, normalizedPollution)
    )
    
    let removeCount = this._activeCount - targetCount
    
    for (const particle of this._particles) {
      if (removeCount <= 0) break
      if (particle.active) {
        particle.active = false
        removeCount--
      }
    }
  }

  /**
   * Update instanced mesh matrices
   */
  private updateGeometry(): void {
    const halfCount = Math.floor(this._maxParticles / 2)
    
    let boxIndex = 0
    let sphereIndex = 0
    
    for (let i = 0; i < this._particles.length; i++) {
      const particle = this._particles[i]
      
      // Alternate between box và sphere meshes
      const meshIndex = i < halfCount ? 0 : 1
      const mesh = this._meshes[meshIndex]
      const instanceIndex = meshIndex === 0 ? boxIndex++ : sphereIndex++
      
      if (particle.active) {
        this._dummy.position.copy(particle.position)
        this._dummy.rotation.copy(particle.rotation)
        this._dummy.scale.setScalar(particle.scale)
      } else {
        // Hide inactive particles
        this._dummy.position.set(0, -1000, 0)
        this._dummy.scale.setScalar(0)
      }
      
      this._dummy.updateMatrix()
      mesh.setMatrixAt(instanceIndex, this._dummy.matrix)
    }
    
    // Update matrices
    for (const mesh of this._meshes) {
      mesh.instanceMatrix.needsUpdate = true
    }
  }
}
