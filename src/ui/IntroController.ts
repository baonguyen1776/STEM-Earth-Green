/**
 * Intro Controller
 * 
 * GSAP animation controller cho camera fly-in
 * 
 * @module ui/IntroController
 * 
 * Design principles:
 * - GSAP Timeline cho smooth animations
 * - Camera fly-in từ xa
 * - Callback-based completion
 */

import gsap from 'gsap'
import type { CameraManager } from '../core/CameraManager'

/**
 * Intro Controller Options
 */
export interface IntroControllerOptions {
  /** Camera manager */
  cameraManager: CameraManager
  
  /** Animation duration (default: 3) */
  duration?: number
  
  /** Start distance (default: 20) */
  startDistance?: number
  
  /** End distance (default: from camera config) */
  endDistance?: number
  
  /** Easing function (default: 'power2.out') */
  ease?: string
  
  /** On complete callback */
  onComplete?: () => void
  
  /** On update callback (progress 0-1) */
  onUpdate?: (progress: number) => void
}

/**
 * Intro Controller Class
 * 
 * Animates camera from far to configured position
 * 
 * @example
 * ```typescript
 * const introController = new IntroController({
 *   cameraManager,
 *   duration: 3,
 *   onComplete: () => {
 *     slider.enable()
 *     panel.show()
 *   }
 * })
 * 
 * // Start animation
 * introController.play()
 * 
 * // Or skip
 * introController.skip()
 * ```
 */
export class IntroController {
  // PRIVATE PROPERTIES
  private _cameraManager: CameraManager
  private _timeline: gsap.core.Timeline | null = null
  private _duration: number
  private _endDistance: number
  private _onComplete: (() => void) | null
  private _onUpdate: ((progress: number) => void) | null
  private _isPlaying: boolean = false
  private _isCompleted: boolean = false
  private _isDisposed: boolean = false

  // CONSTRUCTOR
  /**
   * Create new IntroController
   * 
   * @param options - Controller options
   */
  constructor(options: IntroControllerOptions) {
    this._cameraManager = options.cameraManager
    this._duration = options.duration ?? 3
    this._endDistance = options.endDistance ?? this._cameraManager.position.z
    this._onComplete = options.onComplete ?? null
    this._onUpdate = options.onUpdate ?? null
  }

  // PUBLIC GETTERS
  /**
   * Check if animation is playing
   */
  get isPlaying(): boolean {
    return this._isPlaying
  }

  /**
   * Check if animation has completed
   */
  get isCompleted(): boolean {
    return this._isCompleted
  }

  /**
   * Check if disposed
   */
  get isDisposed(): boolean {
    return this._isDisposed
  }

  /**
   * Get animation progress (0-1)
   */
  get progress(): number {
    if (!this._timeline) return 0
    return this._timeline.progress()
  }

  // PUBLIC METHODS
  /**
   * Play intro animation
   * 
   * @returns Promise resolving when complete
   */
  play(): Promise<void> {
    if (this._isDisposed || this._isPlaying || this._isCompleted) {
      return Promise.resolve()
    }
    
    return new Promise((resolve) => {
      this._isPlaying = true
      
      // DON'T reset position here - use current camera position as start
      // This allows main.ts to set custom start position (e.g., Earth at bottom)
      
      // Create timeline
      this._timeline = gsap.timeline({
        onComplete: () => {
          this._isPlaying = false
          this._isCompleted = true
          
          // Force target to origin one more time after animation
          this._cameraManager.setTarget(0, 0, 0)
          
          // Re-enable controls
          this._cameraManager.enableControls()
          
          if (this._onComplete) {
            this._onComplete()
          }
          
          resolve()
        },
        onUpdate: () => {
          if (this._onUpdate && this._timeline) {
            this._onUpdate(this._timeline.progress())
          }
        },
      })
      
      // Disable controls during animation
      this._cameraManager.disableControls()
      
      // Animate camera position smoothly to end position
      const camera = this._cameraManager.camera
      
      // Smooth animation: y goes back to 0, z goes to endDistance
      this._timeline.to(camera.position, {
        x: 0,
        y: 0,
        z: this._endDistance,
        duration: this._duration,
        ease: 'power2.inOut',
      })
      
      // Optional: Add rotation effect
      // this._timeline.to(this._cameraManager.camera.rotation, {
      //   y: Math.PI * 0.1,
      //   duration: this._duration * 0.5,
      //   ease: 'power1.inOut',
      //   yoyo: true,
      //   repeat: 1,
      // }, 0)
    })
  }

  /**
   * Skip animation and go to end state
   */
  skip(): void {
    if (this._isDisposed || this._isCompleted) return
    
    // Kill existing animation
    if (this._timeline) {
      this._timeline.kill()
      this._timeline = null
    }
    
    // Set final position
    this._cameraManager.setPosition(0, 0, this._endDistance)
    this._cameraManager.enableControls()
    
    this._isPlaying = false
    this._isCompleted = true
    
    if (this._onComplete) {
      this._onComplete()
    }
  }

  /**
   * Pause animation
   */
  pause(): void {
    if (this._timeline && this._isPlaying) {
      this._timeline.pause()
    }
  }

  /**
   * Resume animation
   */
  resume(): void {
    if (this._timeline && this._isPlaying) {
      this._timeline.resume()
    }
  }

  /**
   * Reset animation to start
   */
  reset(): void {
    if (this._isDisposed) return
    
    // Kill existing
    if (this._timeline) {
      this._timeline.kill()
      this._timeline = null
    }
    
    this._isPlaying = false
    this._isCompleted = false
    
    // Reset camera to start position
    this._cameraManager.setPosition(0, -1, 4)
    this._cameraManager.setTarget(0, 0, 0)
    this._cameraManager.disableControls()
  }

  /**
   * Set on complete callback
   * 
   * @param callback - Callback function
   */
  setOnComplete(callback: () => void): void {
    this._onComplete = callback
  }

  /**
   * Set on update callback
   * 
   * @param callback - Callback function
   */
  setOnUpdate(callback: (progress: number) => void): void {
    this._onUpdate = callback
  }

  /**
   * Dispose controller
   */
  dispose(): void {
    if (this._isDisposed) return
    
    if (this._timeline) {
      this._timeline.kill()
      this._timeline = null
    }
    
    this._isDisposed = true
  }
}
