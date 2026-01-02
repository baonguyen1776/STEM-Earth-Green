/**
 * Pollution Slider
 * 
 * DOM-based slider control cho pollution level
 * 
 * @module ui/PollutionSlider
 * 
 * Design principles:
 * - Pure DOM manipulation (no framework)
 * - Accessible với keyboard support
 * - Visual feedback với gradient
 * - Event-based communication
 */

import { COLORS } from '../config/colors'
import { clamp } from '../utils/math'

/**
 * Pollution Slider Options
 */
export interface PollutionSliderOptions {
  /** Container element or selector */
  container?: HTMLElement | string
  
  /** Initial value (0-100) */
  initialValue?: number
  
  /** Min value (default: 0) */
  min?: number
  
  /** Max value (default: 100) */
  max?: number
  
  /** Step (default: 1) */
  step?: number
  
  /** Show value label (default: true) */
  showLabel?: boolean
  
  /** Label format function */
  labelFormatter?: (value: number) => string
  
  /** On change callback */
  onChange?: (value: number) => void
}

/**
 * Pollution Slider Class
 * 
 * Creates interactive slider control
 * 
 * @example
 * ```typescript
 * const slider = new PollutionSlider({
 *   container: '#app',
 *   initialValue: 0,
 *   onChange: (value) => {
 *     earth.setPollutionLevel(value)
 *   }
 * })
 * 
 * // Get current value
 * console.log(slider.value)
 * 
 * // Set value programmatically
 * slider.setValue(50)
 * 
 * // Cleanup
 * slider.dispose()
 * ```
 */
export class PollutionSlider {
  // PRIVATE PROPERTIES
  private _container: HTMLElement
  private _sliderContainer: HTMLElement
  private _slider: HTMLInputElement
  private _label: HTMLElement | null = null
  private _value: number
  private _min: number
  private _max: number
  private _onChange: ((value: number) => void) | null
  private _labelFormatter: (value: number) => string
  private _isDisposed: boolean = false

  // CONSTRUCTOR
  /**
   * Create new PollutionSlider
   * 
   * @param options - Slider options
   */
  constructor(options: PollutionSliderOptions = {}) {
    // Get container
    this._container = this.resolveContainer(options.container)
    
    // Config
    this._min = options.min ?? 0
    this._max = options.max ?? 100
    this._value = options.initialValue ?? 0
    this._onChange = options.onChange ?? null
    this._labelFormatter = options.labelFormatter ?? ((v) => `${Math.round(v)}%`)
    
    // Create elements
    this._sliderContainer = this.createSliderContainer()
    this._slider = this.createSlider(options.step ?? 1)
    
    if (options.showLabel !== false) {
      this._label = this.createLabel()
    }
    
    // Assemble
    this._sliderContainer.appendChild(this._slider)
    if (this._label) {
      this._sliderContainer.appendChild(this._label)
    }
    this._container.appendChild(this._sliderContainer)
    
    // Set initial value
    this.setValue(this._value)
    
    // Bind events
    this.bindEvents()
  }

  // PUBLIC GETTERS
  /**
   * Get current value
   */
  get value(): number {
    return this._value
  }

  /**
   * Get slider element
   */
  get element(): HTMLElement {
    return this._sliderContainer
  }

  /**
   * Check if disposed
   */
  get isDisposed(): boolean {
    return this._isDisposed
  }

  // PUBLIC METHODS
  /**
   * Set value
   * 
   * @param value - New value
   * @param triggerCallback - Trigger onChange callback (default: true)
   */
  setValue(value: number, triggerCallback: boolean = true): void {
    if (this._isDisposed) return
    
    this._value = clamp(value, this._min, this._max)
    this._slider.value = String(this._value)
    
    // Update label
    if (this._label) {
      this._label.textContent = this._labelFormatter(this._value)
    }
    
    // Update gradient
    this.updateSliderGradient()
    
    // Trigger callback
    if (triggerCallback && this._onChange) {
      this._onChange(this._value)
    }
  }

  /**
   * Set onChange callback
   * 
   * @param callback - Callback function
   */
  setOnChange(callback: (value: number) => void): void {
    this._onChange = callback
  }

  /**
   * Enable slider
   */
  enable(): void {
    if (this._isDisposed) return
    
    this._slider.disabled = false
    this._sliderContainer.style.opacity = '1'
    this._sliderContainer.style.pointerEvents = 'auto'
  }

  /**
   * Disable slider
   */
  disable(): void {
    if (this._isDisposed) return
    
    this._slider.disabled = true
    this._sliderContainer.style.opacity = '0.5'
    this._sliderContainer.style.pointerEvents = 'none'
  }

  /**
   * Show slider
   */
  show(): void {
    if (this._isDisposed) return
    
    this._sliderContainer.style.display = 'flex'
  }

  /**
   * Hide slider
   */
  hide(): void {
    if (this._isDisposed) return
    
    this._sliderContainer.style.display = 'none'
  }

  /**
   * Dispose slider
   */
  dispose(): void {
    if (this._isDisposed) return
    
    // Remove events
    this._slider.removeEventListener('input', this.handleInput)
    
    // Remove from DOM
    if (this._sliderContainer.parentNode) {
      this._sliderContainer.parentNode.removeChild(this._sliderContainer)
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
   * Create slider container
   */
  private createSliderContainer(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'pollution-slider-container'
    container.style.cssText = `
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 20px 30px;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 100;
      font-family: 'Segoe UI', system-ui, sans-serif;
    `
    return container
  }

  /**
   * Create slider input
   */
  private createSlider(step: number): HTMLInputElement {
    const slider = document.createElement('input')
    slider.type = 'range'
    slider.min = String(this._min)
    slider.max = String(this._max)
    slider.step = String(step)
    slider.value = String(this._value)
    slider.className = 'pollution-slider'
    slider.setAttribute('aria-label', 'Mức độ ô nhiễm')
    
    slider.style.cssText = `
      width: 300px;
      height: 8px;
      border-radius: 4px;
      outline: none;
      cursor: pointer;
      -webkit-appearance: none;
      appearance: none;
    `
    
    // Add custom styles
    this.addSliderStyles()
    
    return slider
  }

  /**
   * Create value label
   */
  private createLabel(): HTMLElement {
    const labelContainer = document.createElement('div')
    labelContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      width: 100%;
      color: white;
      font-size: 14px;
    `
    
    // Title
    const title = document.createElement('span')
    title.textContent = 'Mức ô nhiễm:'
    title.style.opacity = '0.8'
    
    // Value
    const value = document.createElement('span')
    value.className = 'pollution-value'
    value.textContent = this._labelFormatter(this._value)
    value.style.fontWeight = 'bold'
    
    labelContainer.appendChild(title)
    labelContainer.appendChild(value)
    
    // Store reference to value element
    return labelContainer.querySelector('.pollution-value') as HTMLElement
  }

  /**
   * Add custom slider styles
   */
  private addSliderStyles(): void {
    const styleId = 'pollution-slider-styles'
    
    // Check if styles already exist
    if (document.getElementById(styleId)) return
    
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      .pollution-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: white;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.8);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      .pollution-slider::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      }
      
      .pollution-slider::-moz-range-thumb {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: white;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.8);
      }
      
      .pollution-slider::-webkit-slider-runnable-track {
        height: 8px;
        border-radius: 4px;
      }
      
      .pollution-slider::-moz-range-track {
        height: 8px;
        border-radius: 4px;
      }
    `
    
    document.head.appendChild(style)
  }

  /**
   * Update slider gradient based on value
   */
  private updateSliderGradient(): void {
    const percentage = ((this._value - this._min) / (this._max - this._min)) * 100
    
    const cleanColor = COLORS.earth.clean
    const pollutedColor = COLORS.earth.polluted
    
    // Create gradient from clean to polluted
    this._slider.style.background = `
      linear-gradient(90deg, 
        ${cleanColor} 0%, 
        ${pollutedColor} 100%
      )
    `
    
    // Add fill indicator
    this._slider.style.background = `
      linear-gradient(90deg, 
        ${cleanColor} 0%, 
        ${pollutedColor} ${percentage}%,
        rgba(255, 255, 255, 0.2) ${percentage}%,
        rgba(255, 255, 255, 0.2) 100%
      )
    `
  }

  /**
   * Bind events
   */
  private bindEvents(): void {
    this.handleInput = this.handleInput.bind(this)
    this._slider.addEventListener('input', this.handleInput)
  }

  /**
   * Handle input event
   */
  private handleInput = (): void => {
    const value = parseFloat(this._slider.value)
    this.setValue(value, true)
  }
}
