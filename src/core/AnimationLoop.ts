/**
 * Animation Loop
 * 
 * Quản lý requestAnimationFrame loop với delta time
 * 
 * @module core/AnimationLoop
 * 
 * Design principles:
 * - Precise timing với delta time
 * - Pausable/resumable
 * - Callback system cho updates
 * - Performance monitoring
 */

/**
 * Animation Callback
 * 
 * @param deltaTime - Time since last frame (seconds)
 * @param elapsedTime - Total elapsed time (seconds)
 * @param frame - Frame counter
 */
export type AnimationCallback = (
  deltaTime: number,
  elapsedTime: number,
  frame: number
) => void

/**
 * Animation Loop Options
 */
export interface AnimationLoopOptions {
  /** Auto start loop (default: false) */
  autoStart?: boolean
  
  /** Max delta time to prevent large jumps (default: 0.1) */
  maxDeltaTime?: number
  
  /** Target FPS (0 = unlimited, default: 0) */
  targetFPS?: number
}

/**
 * Animation Loop Class
 * 
 * Manages the main render/update loop với precise timing
 * 
 * @example
 * ```typescript
 * const loop = new AnimationLoop()
 * 
 * // Add update callback
 * loop.add('render', (dt, elapsed) => {
 *   earth.rotation.y += dt * 0.1
 *   renderer.render(scene, camera)
 * })
 * 
 * // Start loop
 * loop.start()
 * 
 * // Later...
 * loop.stop()
 * ```
 */
export class AnimationLoop {
  // PRIVATE PROPERTIES
  private _callbacks: Map<string, AnimationCallback> = new Map()
  private _isRunning: boolean = false
  private _isPaused: boolean = false
  private _animationFrameId: number | null = null
  private _lastTime: number = 0
  private _elapsedTime: number = 0
  private _frame: number = 0
  private _maxDeltaTime: number
  private _targetFPS: number
  private _fpsInterval: number = 0

  // Performance monitoring
  private _fpsHistory: number[] = []
  private _fpsHistorySize: number = 60

  // CONSTRUCTOR
  /**
   * Create new AnimationLoop
   * 
   * @param options - Loop options
   */
  constructor(options: AnimationLoopOptions = {}) {
    this._maxDeltaTime = options.maxDeltaTime ?? 0.1
    this._targetFPS = options.targetFPS ?? 0
    
    if (this._targetFPS > 0) {
      this._fpsInterval = 1000 / this._targetFPS
    }
    
    // Bind loop function
    this.loop = this.loop.bind(this)
    
    // Auto start if requested
    if (options.autoStart) {
      this.start()
    }
  }

  // PUBLIC GETTERS
  /**
   * Check if loop is running
   */
  get isRunning(): boolean {
    return this._isRunning
  }

  /**
   * Check if loop is paused
   */
  get isPaused(): boolean {
    return this._isPaused
  }

  /**
   * Get elapsed time (seconds)
   */
  get elapsedTime(): number {
    return this._elapsedTime
  }

  /**
   * Get frame counter
   */
  get frame(): number {
    return this._frame
  }

  /**
   * Get current FPS
   */
  get fps(): number {
    if (this._fpsHistory.length === 0) return 0
    
    const sum = this._fpsHistory.reduce((a, b) => a + b, 0)
    return Math.round(sum / this._fpsHistory.length)
  }

  /**
   * Get number of callbacks
   */
  get callbackCount(): number {
    return this._callbacks.size
  }

  // PUBLIC METHODS - CALLBACKS
  /**
   * Add callback to loop
   * 
   * @param name - Unique callback name
   * @param callback - Callback function
   * @returns Unsubscribe function
   * 
   * @example
   * ```typescript
   * const unsubscribe = loop.add('physics', (dt) => {
   *   updatePhysics(dt)
   * })
   * 
   * // Later...
   * unsubscribe()
   * ```
   */
  add(name: string, callback: AnimationCallback): () => void {
    this._callbacks.set(name, callback)
    
    return () => {
      this.remove(name)
    }
  }

  /**
   * Remove callback by name
   * 
   * @param name - Callback name to remove
   * @returns true if removed
   */
  remove(name: string): boolean {
    return this._callbacks.delete(name)
  }

  /**
   * Check if callback exists
   * 
   * @param name - Callback name
   * @returns true if exists
   */
  has(name: string): boolean {
    return this._callbacks.has(name)
  }

  /**
   * Clear all callbacks
   */
  clear(): void {
    this._callbacks.clear()
  }

  // PUBLIC METHODS - CONTROL
  /**
   * Start animation loop
   */
  start(): void {
    if (this._isRunning) return
    
    this._isRunning = true
    this._isPaused = false
    this._lastTime = performance.now()
    this._animationFrameId = requestAnimationFrame(this.loop)
  }

  /**
   * Stop animation loop
   */
  stop(): void {
    if (!this._isRunning) return
    
    this._isRunning = false
    this._isPaused = false
    
    if (this._animationFrameId !== null) {
      cancelAnimationFrame(this._animationFrameId)
      this._animationFrameId = null
    }
  }

  /**
   * Pause animation loop
   * 
   * Keeps running state but skips updates
   */
  pause(): void {
    this._isPaused = true
  }

  /**
   * Resume animation loop
   */
  resume(): void {
    if (!this._isPaused) return
    
    this._isPaused = false
    this._lastTime = performance.now()
  }

  /**
   * Toggle pause state
   * 
   * @returns New paused state
   */
  togglePause(): boolean {
    if (this._isPaused) {
      this.resume()
    } else {
      this.pause()
    }
    return this._isPaused
  }

  /**
   * Reset elapsed time và frame counter
   */
  reset(): void {
    this._elapsedTime = 0
    this._frame = 0
    this._fpsHistory = []
    this._lastTime = performance.now()
  }

  // PUBLIC METHODS - SINGLE FRAME
  /**
   * Execute single frame (useful for debugging)
   * 
   * @param deltaTime - Override delta time
   */
  tick(deltaTime?: number): void {
    const dt = deltaTime ?? (1 / 60) // Default to 60fps frame
    
    this._elapsedTime += dt
    this._frame++
    
    for (const callback of this._callbacks.values()) {
      try {
        callback(dt, this._elapsedTime, this._frame)
      } catch (error) {
        console.error('AnimationLoop callback error:', error)
      }
    }
  }

  // PUBLIC METHODS - DISPOSAL
  /**
   * Dispose animation loop
   */
  dispose(): void {
    this.stop()
    this.clear()
  }

  // PRIVATE METHODS
  /**
   * Main loop function
   */
  private loop(currentTime: number): void {
    if (!this._isRunning) return
    
    // Request next frame
    this._animationFrameId = requestAnimationFrame(this.loop)
    
    // Skip if paused
    if (this._isPaused) {
      this._lastTime = currentTime
      return
    }
    
    // Calculate delta time
    let deltaTime = (currentTime - this._lastTime) / 1000
    
    // FPS limiting
    if (this._targetFPS > 0) {
      const elapsed = currentTime - this._lastTime
      if (elapsed < this._fpsInterval) {
        return
      }
    }
    
    // Clamp delta time to prevent large jumps
    deltaTime = Math.min(deltaTime, this._maxDeltaTime)
    
    // Update timing
    this._lastTime = currentTime
    this._elapsedTime += deltaTime
    this._frame++
    
    // Track FPS
    const currentFPS = 1 / deltaTime
    this._fpsHistory.push(currentFPS)
    if (this._fpsHistory.length > this._fpsHistorySize) {
      this._fpsHistory.shift()
    }
    
    // Execute callbacks
    for (const callback of this._callbacks.values()) {
      try {
        callback(deltaTime, this._elapsedTime, this._frame)
      } catch (error) {
        console.error('AnimationLoop callback error:', error)
      }
    }
  }
}
