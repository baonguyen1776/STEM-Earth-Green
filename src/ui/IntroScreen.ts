/**
 * Intro Screen
 * 
 * Splash screen với title và start button
 * 
 * @module ui/IntroScreen
 * 
 * Design principles:
 * - Full screen overlay
 * - Animated entrance/exit
 * - Callback-based start trigger
 */

/**
 * Intro Screen Options
 */
export interface IntroScreenOptions {
  /** Container element or selector */
  container?: HTMLElement | string
  
  /** Title text */
  title?: string
  
  /** Subtitle text */
  subtitle?: string
  
  /** Start button text */
  buttonText?: string
  
  /** On start callback */
  onStart?: () => void
  
  /** Auto hide after start (default: true) */
  autoHide?: boolean
}

/**
 * Intro Screen Class
 * 
 * Full screen intro với title và start button
 * 
 * @example
 * ```typescript
 * const intro = new IntroScreen({
 *   title: 'Trái Đất Xanh',
 *   subtitle: 'Hai Tương Lai',
 *   onStart: () => {
 *     introController.startAnimation()
 *   }
 * })
 * 
 * // Show intro
 * intro.show()
 * ```
 */
export class IntroScreen {
  // PRIVATE PROPERTIES
  private _container: HTMLElement
  private _overlay: HTMLElement
  private _content: HTMLElement
  private _button: HTMLButtonElement
  private _onStart: (() => void) | null
  private _autoHide: boolean
  private _isDisposed: boolean = false
  private _isVisible: boolean = true

  // CONSTRUCTOR
  /**
   * Create new IntroScreen
   * 
   * @param options - Intro options
   */
  constructor(options: IntroScreenOptions = {}) {
    // Get container
    this._container = this.resolveContainer(options.container)
    
    // Config
    this._onStart = options.onStart ?? null
    this._autoHide = options.autoHide ?? true
    
    // Create elements
    this._overlay = this.createOverlay()
    this._content = this.createContent(
      options.title ?? 'Trái Đất Xanh',
      options.subtitle ?? 'Hai Tương Lai'
    )
    this._button = this.createButton(options.buttonText ?? 'Bắt đầu')
    
    // Assemble
    this._content.appendChild(this._button)
    this._overlay.appendChild(this._content)
    this._container.appendChild(this._overlay)
    
    // Bind events
    this.bindEvents()
  }

  // PUBLIC GETTERS
  /**
   * Get overlay element
   */
  get element(): HTMLElement {
    return this._overlay
  }

  /**
   * Check if visible
   */
  get isVisible(): boolean {
    return this._isVisible
  }

  /**
   * Check if disposed
   */
  get isDisposed(): boolean {
    return this._isDisposed
  }

  // PUBLIC METHODS
  /**
   * Show intro screen
   */
  show(): void {
    if (this._isDisposed) return
    
    this._overlay.style.opacity = '1'
    this._overlay.style.visibility = 'visible'
    this._isVisible = true
    
    // Animate content
    requestAnimationFrame(() => {
      this._content.style.opacity = '1'
      this._content.style.transform = 'translateY(0)'
    })
  }

  /**
   * Hide intro screen
   * 
   * @returns Promise resolving after animation
   */
  hide(): Promise<void> {
    if (this._isDisposed) return Promise.resolve()
    
    return new Promise((resolve) => {
      // Fade out content first
      this._content.style.opacity = '0'
      this._content.style.transform = 'translateY(20px)'
      
      // Then fade out overlay
      setTimeout(() => {
        this._overlay.style.opacity = '0'
        
        setTimeout(() => {
          this._overlay.style.visibility = 'hidden'
          this._isVisible = false
          resolve()
        }, 500)
      }, 300)
    })
  }

  /**
   * Set onStart callback
   * 
   * @param callback - Callback function
   */
  setOnStart(callback: () => void): void {
    this._onStart = callback
  }

  /**
   * Dispose intro screen
   */
  dispose(): void {
    if (this._isDisposed) return
    
    // Remove events
    this._button.removeEventListener('click', this.handleStart)
    
    // Remove from DOM
    if (this._overlay.parentNode) {
      this._overlay.parentNode.removeChild(this._overlay)
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
        console.warn(`Container not found: ${container}, using body`)
        return document.body
      }
      return element
    }
    
    return container
  }

  /**
   * Create overlay element
   */
  private createOverlay(): HTMLElement {
    const overlay = document.createElement('div')
    overlay.className = 'intro-overlay'
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0a1628 0%, #1a2a4a 50%, #0f1f35 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      transition: opacity 0.5s ease;
    `
    return overlay
  }

  /**
   * Create content container
   */
  private createContent(title: string, subtitle: string): HTMLElement {
    const content = document.createElement('div')
    content.className = 'intro-content'
    content.style.cssText = `
      text-align: center;
      color: white;
      font-family: 'Segoe UI', system-ui, sans-serif;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.5s ease;
    `
    
    // Earth icon
    const icon = document.createElement('div')
    icon.innerHTML = '🌍'
    icon.style.cssText = `
      font-size: 80px;
      margin-bottom: 24px;
      animation: float 3s ease-in-out infinite;
    `
    
    // Title
    const titleEl = document.createElement('h1')
    titleEl.textContent = title
    titleEl.style.cssText = `
      font-size: 48px;
      font-weight: 700;
      margin: 0 0 12px 0;
      background: linear-gradient(90deg, #4CAF50, #8BC34A, #4CAF50);
      background-size: 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradient 3s ease infinite;
    `
    
    // Subtitle
    const subtitleEl = document.createElement('p')
    subtitleEl.textContent = subtitle
    subtitleEl.style.cssText = `
      font-size: 24px;
      font-weight: 300;
      margin: 0 0 40px 0;
      opacity: 0.8;
    `
    
    // Add animation styles
    this.addAnimationStyles()
    
    content.appendChild(icon)
    content.appendChild(titleEl)
    content.appendChild(subtitleEl)
    
    return content
  }

  /**
   * Create start button
   */
  private createButton(text: string): HTMLButtonElement {
    const button = document.createElement('button')
    button.textContent = text
    button.className = 'intro-button'
    button.style.cssText = `
      padding: 16px 48px;
      font-size: 18px;
      font-weight: 600;
      color: white;
      background: linear-gradient(135deg, #4CAF50, #45a049);
      border: none;
      border-radius: 30px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
    `
    
    // Hover styles
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)'
      button.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.5)'
    })
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)'
      button.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.4)'
    })
    
    return button
  }

  /**
   * Add animation keyframes
   */
  private addAnimationStyles(): void {
    const styleId = 'intro-animation-styles'
    
    if (document.getElementById(styleId)) return
    
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `
    
    document.head.appendChild(style)
  }

  /**
   * Bind events
   */
  private bindEvents(): void {
    this.handleStart = this.handleStart.bind(this)
    this._button.addEventListener('click', this.handleStart)
  }

  /**
   * Handle start button click
   */
  private handleStart = (): void => {
    // Disable button
    this._button.disabled = true
    this._button.textContent = 'Đang tải...'
    
    // Call callback
    if (this._onStart) {
      this._onStart()
    }
    
    // Auto hide
    if (this._autoHide) {
      this.hide()
    }
  }
}
