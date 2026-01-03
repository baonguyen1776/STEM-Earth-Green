/**
 * Renderer
 * 
 * WebGL Renderer wrapper cho Three.js
 * 
 * @module core/Renderer
 * 
 * Design principles:
 * - Encapsulation: Wrap Three.js WebGLRenderer
 * - Responsive: Auto resize handling
 * - Performance: Pixel ratio optimization
 * - Cleanup: Proper disposal
 */

import * as THREE from 'three'

/**
 * Default renderer configuration
 */
const RENDERER_DEFAULTS = {
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance' as const,
  maxPixelRatio: 2,
  clearColor: 0x000000,
  clearAlpha: 1,
}

/**
 * Renderer Options
 */
export interface RendererOptions {
  /** Canvas element hoặc selector */
  canvas?: HTMLCanvasElement | string
  
  /** Container element hoặc selector */
  container?: HTMLElement | string
  
  /** Antialias (default: true) */
  antialias?: boolean
  
  /** Alpha/transparent background (default: true) */
  alpha?: boolean
  
  /** Pixel ratio (default: device pixel ratio, max 2) */
  pixelRatio?: number
  
  /** Power preference (default: 'high-performance') */
  powerPreference?: 'high-performance' | 'low-power' | 'default'
}

/**
 * Renderer Class
 * 
 * Quản lý WebGL renderer, resize handling, và rendering loop
 * 
 * @example
 * ```typescript
 * const renderer = new Renderer({ container: '#app' })
 * 
 * // Render frame
 * renderer.render(scene, camera)
 * 
 * // Resize event handled automatically
 * 
 * // Cleanup
 * renderer.dispose()
 * ```
 */
export class Renderer {
  // PRIVATE PROPERTIES
  private _renderer: THREE.WebGLRenderer
  private _container: HTMLElement
  private _resizeObserver: ResizeObserver | null = null
  private _resizeHandler: (() => void) | null = null
  private _isDisposed: boolean = false

  // CONSTRUCTOR
  /**
   * Create new Renderer
   * 
   * @param options - Renderer options
   */
  constructor(options: RendererOptions = {}) {
    // Resolve container
    this._container = this.resolveContainer(options.container)
    
    // Resolve canvas
    const canvas = this.resolveCanvas(options.canvas)
    
    // Create WebGL Renderer
    this._renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: options.antialias ?? RENDERER_DEFAULTS.antialias,
      alpha: options.alpha ?? RENDERER_DEFAULTS.alpha,
      powerPreference: options.powerPreference ?? RENDERER_DEFAULTS.powerPreference,
    })
    
    // Configure renderer
    this.configure(options)
    
    // Setup tone mapping for cinematic rendering
    this.setToneMapping(THREE.ACESFilmicToneMapping, 1.2)
    
    // Setup resize handling
    this.setupResizeHandling()
    
    // Initial size update
    this.updateSize()
  }

  // PUBLIC GETTERS
  /**
   * Get Three.js WebGLRenderer instance
   */
  get webGLRenderer(): THREE.WebGLRenderer {
    return this._renderer
  }

  /**
   * Get DOM element (canvas)
   */
  get domElement(): HTMLCanvasElement {
    return this._renderer.domElement
  }

  /**
   * Get container element
   */
  get container(): HTMLElement {
    return this._container
  }

  /**
   * Get current size
   */
  get size(): { width: number; height: number } {
    return {
      width: this._container.clientWidth,
      height: this._container.clientHeight,
    }
  }

  /**
   * Get aspect ratio
   */
  get aspectRatio(): number {
    const { width, height } = this.size
    return height > 0 ? width / height : 1
  }

  /**
   * Check if renderer is disposed
   */
  get isDisposed(): boolean {
    return this._isDisposed
  }

  // PUBLIC METHODS
  /**
   * Render scene với camera
   * 
   * @param scene - Three.js Scene
   * @param camera - Three.js Camera
   */
  render(scene: THREE.Scene, camera: THREE.Camera): void {
    if (this._isDisposed) {
      console.warn('Renderer: Attempting to render after disposal')
      return
    }
    
    this._renderer.render(scene, camera)
  }

  /**
   * Update renderer size
   * 
   * Gọi khi container size thay đổi
   */
  updateSize(): void {
    if (this._isDisposed) return
    
    const { width, height } = this.size
    
    this._renderer.setSize(width, height, false)
    
    // Dispatch custom event for camera updates
    window.dispatchEvent(new CustomEvent('renderer:resize', {
      detail: { width, height, aspectRatio: this.aspectRatio }
    }))
  }

  /**
   * Set pixel ratio
   * 
   * @param ratio - Pixel ratio (default: device pixel ratio)
   */
  setPixelRatio(ratio?: number): void {
    const maxRatio = RENDERER_DEFAULTS.maxPixelRatio ?? 2
    const deviceRatio = window.devicePixelRatio ?? 1
    const targetRatio = ratio ?? Math.min(deviceRatio, maxRatio)
    
    this._renderer.setPixelRatio(targetRatio)
  }

  /**
   * Set clear color
   * 
   * @param color - Color hex hoặc Three.js Color
   * @param alpha - Alpha (default: 1)
   */
  setClearColor(color: number | string | THREE.Color, alpha: number = 1): void {
    this._renderer.setClearColor(color, alpha)
  }

  /**
   * Enable/disable shadow mapping
   * 
   * @param enabled - Enable shadows
   * @param type - Shadow map type
   */
  setShadows(
    enabled: boolean,
    type: THREE.ShadowMapType = THREE.PCFSoftShadowMap
  ): void {
    this._renderer.shadowMap.enabled = enabled
    this._renderer.shadowMap.type = type
  }

  /**
   * Set tone mapping
   * 
   * @param toneMapping - Tone mapping type
   * @param exposure - Exposure (default: 1)
   */
  setToneMapping(
    toneMapping: THREE.ToneMapping = THREE.ACESFilmicToneMapping,
    exposure: number = 1
  ): void {
    this._renderer.toneMapping = toneMapping
    this._renderer.toneMappingExposure = exposure
  }

  /**
   * Get renderer info (memory, render calls, etc.)
   */
  getInfo(): THREE.WebGLInfo {
    return this._renderer.info
  }

  /**
   * Clear the canvas
   * 
   * @param color - Clear color buffer
   * @param depth - Clear depth buffer
   * @param stencil - Clear stencil buffer
   */
  clear(color: boolean = true, depth: boolean = true, stencil: boolean = true): void {
    this._renderer.clear(color, depth, stencil)
  }

  /**
   * Dispose renderer và cleanup
   */
  dispose(): void {
    if (this._isDisposed) return
    
    // Remove resize observer
    if (this._resizeObserver) {
      this._resizeObserver.disconnect()
      this._resizeObserver = null
    }
    
    // Remove window resize listener
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler)
      this._resizeHandler = null
    }
    
    // Dispose renderer
    this._renderer.dispose()
    
    // Remove canvas from DOM
    if (this._renderer.domElement.parentNode) {
      this._renderer.domElement.parentNode.removeChild(this._renderer.domElement)
    }
    
    this._isDisposed = true
  }

  // PRIVATE METHODS
  /**
   * Resolve container element
   */
  private resolveContainer(container?: HTMLElement | string): HTMLElement {
    if (!container) {
      return document.body
    }
    
    if (typeof container === 'string') {
      const element = document.querySelector<HTMLElement>(container)
      if (!element) {
        throw new Error(`Renderer: Container not found: ${container}`)
      }
      return element
    }
    
    return container
  }

  /**
   * Resolve canvas element
   */
  private resolveCanvas(canvas?: HTMLCanvasElement | string): HTMLCanvasElement | undefined {
    if (!canvas) {
      return undefined
    }
    
    if (typeof canvas === 'string') {
      const element = document.querySelector<HTMLCanvasElement>(canvas)
      if (!element) {
        throw new Error(`Renderer: Canvas not found: ${canvas}`)
      }
      return element
    }
    
    return canvas
  }

  /**
   * Configure renderer settings
   */
  private configure(options: RendererOptions): void {
    // Set pixel ratio
    const maxRatio = RENDERER_DEFAULTS.maxPixelRatio ?? 2
    const pixelRatio = options.pixelRatio ?? Math.min(window.devicePixelRatio, maxRatio)
    this._renderer.setPixelRatio(pixelRatio)
    
    // Set output color space
    this._renderer.outputColorSpace = THREE.SRGBColorSpace
    
    // Set tone mapping
    this._renderer.toneMapping = THREE.ACESFilmicToneMapping
    this._renderer.toneMappingExposure = 1.0
    
    // Set clear color
    const clearColor = RENDERER_DEFAULTS.clearColor ?? 0x000000
    const clearAlpha = RENDERER_DEFAULTS.clearAlpha ?? 1
    this._renderer.setClearColor(clearColor, clearAlpha)
    
    // Append canvas to container if not already in DOM
    if (!this._renderer.domElement.parentNode) {
      this._container.appendChild(this._renderer.domElement)
    }
    
    // Set canvas style
    this._renderer.domElement.style.display = 'block'
  }

  /**
   * Setup resize handling
   */
  private setupResizeHandling(): void {
    // Use ResizeObserver for container size changes
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => {
        this.updateSize()
      })
      this._resizeObserver.observe(this._container)
    }
    
    // Fallback to window resize event
    this._resizeHandler = () => {
      this.updateSize()
    }
    window.addEventListener('resize', this._resizeHandler)
  }
}
