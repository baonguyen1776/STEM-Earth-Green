/**
 * Camera Manager
 * 
 * Quản lý PerspectiveCamera và OrbitControls
 * 
 * @module core/CameraManager
 * 
 * Design principles:
 * - Encapsulation: Wrap camera và controls
 * - Responsive: Auto aspect ratio update
 * - Configurable: Customizable limits và damping
 * - Animation ready: Support GSAP animations
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  CAMERA_PERSPECTIVE,
  CAMERA_POSITION,
  CAMERA_INTRO_POSITION,
  ORBIT_CONTROLS,
  CAMERA_ANIMATION,
} from '../config/camera'

/**
 * Camera Manager Options
 */
export interface CameraManagerOptions {
  /** Field of view (default: 75) */
  fov?: number
  
  /** Near clipping plane (default: 0.1) */
  near?: number
  
  /** Far clipping plane (default: 1000) */
  far?: number
  
  /** Initial position */
  position?: { x: number; y: number; z: number }
  
  /** Look at target */
  lookAt?: { x: number; y: number; z: number }
  
  /** Enable OrbitControls (default: true) */
  enableControls?: boolean
  
  /** DOM element for controls */
  domElement?: HTMLElement
}

/**
 * Camera Manager Class
 * 
 * Quản lý camera và orbit controls với auto resize
 * 
 * @example
 * ```typescript
 * const cameraManager = new CameraManager({
 *   domElement: renderer.domElement,
 *   position: { x: 0, y: 0, z: 15 },
 * })
 * 
 * // Update trong animation loop
 * cameraManager.update()
 * 
 * // Animate camera
 * cameraManager.animateTo({ x: 0, y: 5, z: 20 }, 2.0)
 * 
 * // Cleanup
 * cameraManager.dispose()
 * ```
 */
export class CameraManager {
  // PRIVATE PROPERTIES
  private _camera: THREE.PerspectiveCamera
  private _controls: OrbitControls | null = null
  private _resizeHandler: (() => void) | null = null
  private _isDisposed: boolean = false

  // CONSTRUCTOR
  /**
   * Create new CameraManager
   * 
   * @param options - Camera options
   */
  constructor(options: CameraManagerOptions = {}) {
    // Create camera
    const fov = options.fov ?? CAMERA_PERSPECTIVE.fov
    const near = options.near ?? CAMERA_PERSPECTIVE.near
    const far = options.far ?? CAMERA_PERSPECTIVE.far
    const aspect = window.innerWidth / window.innerHeight
    
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    
    // Set initial position
    const pos = options.position ?? CAMERA_POSITION
    this._camera.position.set(pos.x, pos.y, pos.z)
    
    // Look at target
    const lookAt = options.lookAt ?? { x: 0, y: 0, z: 0 }
    this._camera.lookAt(lookAt.x, lookAt.y, lookAt.z)
    
    // Setup controls
    if (options.enableControls !== false && options.domElement) {
      this.setupControls(options.domElement)
    }
    
    // Setup resize handling
    this.setupResizeHandling()
  }

  // PUBLIC GETTERS
  /**
   * Get Three.js PerspectiveCamera
   */
  get camera(): THREE.PerspectiveCamera {
    return this._camera
  }

  /**
   * Get OrbitControls (nullable)
   */
  get controls(): OrbitControls | null {
    return this._controls
  }

  /**
   * Get camera position
   */
  get position(): THREE.Vector3 {
    return this._camera.position.clone()
  }

  /**
   * Get camera rotation (Euler)
   */
  get rotation(): THREE.Euler {
    return this._camera.rotation.clone()
  }

  /**
   * Check if disposed
   */
  get isDisposed(): boolean {
    return this._isDisposed
  }

  // PUBLIC METHODS - CAMERA CONTROL
  /**
   * Set camera position
   * 
   * @param x - X position
   * @param y - Y position
   * @param z - Z position
   */
  setPosition(x: number, y: number, z: number): void {
    this._camera.position.set(x, y, z)
    this._controls?.update()
  }

  /**
   * Set camera target (look at)
   * 
   * @param x - X target
   * @param y - Y target
   * @param z - Z target
   */
  setTarget(x: number, y: number, z: number): void {
    if (this._controls) {
      this._controls.target.set(x, y, z)
      this._controls.update()
    } else {
      this._camera.lookAt(x, y, z)
    }
  }

  /**
   * Get current target
   */
  getTarget(): THREE.Vector3 {
    if (this._controls) {
      return this._controls.target.clone()
    }
    
    // Calculate from camera direction
    const direction = new THREE.Vector3()
    this._camera.getWorldDirection(direction)
    return this._camera.position.clone().add(direction.multiplyScalar(10))
  }

  /**
   * Set field of view
   * 
   * @param fov - Field of view (degrees)
   */
  setFOV(fov: number): void {
    this._camera.fov = fov
    this._camera.updateProjectionMatrix()
  }

  /**
   * Set aspect ratio
   * 
   * @param aspect - Aspect ratio (width / height)
   */
  setAspect(aspect: number): void {
    this._camera.aspect = aspect
    this._camera.updateProjectionMatrix()
  }

  /**
   * Update aspect ratio from container size
   * 
   * @param width - Container width
   * @param height - Container height
   */
  updateAspect(width: number, height?: number): void {
    // Support both (aspect) and (width, height) signatures
    if (height !== undefined) {
      this._camera.aspect = width / height
    } else {
      this._camera.aspect = width
    }
    this._camera.updateProjectionMatrix()
  }

  // PUBLIC METHODS - CONTROLS
  /**
   * Enable controls
   */
  enableControls(): void {
    if (this._controls) {
      this._controls.enabled = true
    }
  }

  /**
   * Disable controls
   */
  disableControls(): void {
    if (this._controls) {
      this._controls.enabled = false
    }
  }

  /**
   * Enable/disable controls
   * 
   * @param enabled - Enable controls
   */
  setControlsEnabled(enabled: boolean): void {
    if (this._controls) {
      this._controls.enabled = enabled
    }
  }

  /**
   * Enable/disable auto rotate
   * 
   * @param enabled - Enable auto rotate
   * @param speed - Rotation speed (default: 2.0)
   */
  setAutoRotate(enabled: boolean, speed: number = 2.0): void {
    if (this._controls) {
      this._controls.autoRotate = enabled
      this._controls.autoRotateSpeed = speed
    }
  }

  /**
   * Set zoom limits
   * 
   * @param min - Min distance
   * @param max - Max distance
   */
  setZoomLimits(min: number, max: number): void {
    if (this._controls) {
      this._controls.minDistance = min
      this._controls.maxDistance = max
    }
  }

  /**
   * Set polar angle limits (vertical rotation)
   * 
   * @param min - Min angle (radians)
   * @param max - Max angle (radians)
   */
  setPolarLimits(min: number, max: number): void {
    if (this._controls) {
      this._controls.minPolarAngle = min
      this._controls.maxPolarAngle = max
    }
  }

  /**
   * Reset camera to initial position
   */
  reset(): void {
    const pos = CAMERA_POSITION
    this.setPosition(pos.x, pos.y, pos.z)
    this.setTarget(0, 0, 0)
  }

  // PUBLIC METHODS - ANIMATION
  /**
   * Get position target for animation (GSAP compatible)
   * 
   * Trả về object có thể dùng với GSAP:
   * gsap.to(cameraManager.positionTarget, { z: 15, duration: 2 })
   * 
   * @returns Position object với getters/setters
   */
  get positionTarget(): { x: number; y: number; z: number } {
    const camera = this._camera
    return {
      get x() { return camera.position.x },
      set x(v: number) { camera.position.x = v },
      get y() { return camera.position.y },
      set y(v: number) { camera.position.y = v },
      get z() { return camera.position.z },
      set z(v: number) { camera.position.z = v },
    }
  }

  /**
   * Get position for animation (GSAP compatible)
   * 
   * Trả về object có thể dùng với GSAP:
   * gsap.to(cameraManager.positionObject, { x: 10, duration: 2 })
   * 
   * @returns Position object với getters/setters
   */
  get positionObject(): { x: number; y: number; z: number } {
    const camera = this._camera
    return {
      get x() { return camera.position.x },
      set x(v: number) { camera.position.x = v },
      get y() { return camera.position.y },
      set y(v: number) { camera.position.y = v },
      get z() { return camera.position.z },
      set z(v: number) { camera.position.z = v },
    }
  }

  /**
   * Get camera position for intro animation
   * 
   * @returns Intro start position (far)
   */
  getIntroStartPosition(): { x: number; y: number; z: number } {
    return { ...CAMERA_INTRO_POSITION }
  }

  /**
   * Get camera position for intro end
   * 
   * @returns Intro end position (close)
   */
  getIntroEndPosition(): { x: number; y: number; z: number } {
    return { ...CAMERA_POSITION }
  }

  /**
   * Get intro animation duration
   * 
   * @returns Duration in seconds
   */
  getIntroDuration(): number {
    return CAMERA_ANIMATION.introDuration
  }

  // PUBLIC METHODS - UPDATE
  /**
   * Update controls (call trong animation loop)
   */
  update(): void {
    if (this._isDisposed) return
    
    if (this._controls) {
      this._controls.update()
    }
  }

  // PUBLIC METHODS - DISPOSAL
  /**
   * Dispose camera manager
   */
  dispose(): void {
    if (this._isDisposed) return
    
    // Remove resize listener
    if (this._resizeHandler) {
      window.removeEventListener('renderer:resize', this._resizeHandler as EventListener)
      this._resizeHandler = null
    }
    
    // Dispose controls
    if (this._controls) {
      this._controls.dispose()
      this._controls = null
    }
    
    this._isDisposed = true
  }

  // PRIVATE METHODS
  /**
   * Setup OrbitControls
   */
  private setupControls(domElement: HTMLElement): void {
    this._controls = new OrbitControls(this._camera, domElement)
    
    // Set target to origin (Earth center)
    this._controls.target.set(0, 0, 0)
    
    // Apply config
    this._controls.enableDamping = ORBIT_CONTROLS.enableDamping
    this._controls.dampingFactor = ORBIT_CONTROLS.dampingFactor
    this._controls.enableZoom = ORBIT_CONTROLS.enableZoom
    this._controls.enablePan = ORBIT_CONTROLS.enablePan
    this._controls.enableRotate = ORBIT_CONTROLS.enableRotate
    
    // Zoom limits
    this._controls.minDistance = ORBIT_CONTROLS.minDistance
    this._controls.maxDistance = ORBIT_CONTROLS.maxDistance
    
    // Polar angle limits (vertical)
    this._controls.minPolarAngle = ORBIT_CONTROLS.minPolarAngle
    this._controls.maxPolarAngle = ORBIT_CONTROLS.maxPolarAngle
    
    // Auto rotate
    this._controls.autoRotate = ORBIT_CONTROLS.autoRotate
    this._controls.autoRotateSpeed = ORBIT_CONTROLS.autoRotateSpeed
    
    // Update controls to apply target
    this._controls.update()
  }

  /**
   * Setup resize handling
   */
  private setupResizeHandling(): void {
    this._resizeHandler = () => {
      const event = window.event as CustomEvent<{ width: number; height: number }>
      if (event?.detail) {
        this.updateAspect(event.detail.width, event.detail.height)
      }
    }
    
    window.addEventListener('renderer:resize', this._resizeHandler as EventListener)
  }
}
