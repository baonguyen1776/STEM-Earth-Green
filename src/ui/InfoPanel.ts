/**
 * Info Panel
 * 
 * Information panel showing pollution effects
 * 
 * @module ui/InfoPanel
 * 
 * Design principles:
 * - Dynamic content based on pollution level
 * - Animated transitions
 * - Responsive positioning
 */

import {
  POLLUTION_THRESHOLDS,
  PollutionLevel,
  getPollutionLevelFromValue,
} from '../config/pollutionThresholds'
import { clamp } from '../utils/math'

/**
 * Get message for pollution level
 */
function getPollutionMessage(value: number): string {
  const level = getPollutionLevelFromValue(value)
  return POLLUTION_THRESHOLDS[level].description
}

/**
 * Info Panel Options
 */
export interface InfoPanelOptions {
  /** Container element or selector */
  container?: HTMLElement | string
  
  /** Initial pollution level (0-100) */
  initialValue?: number
  
  /** Position (default: 'top-right') */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  
  /** Show title (default: true) */
  showTitle?: boolean
}

/**
 * Pollution Info Data
 */
interface PollutionInfo {
  level: PollutionLevel
  percentage: number
  message: string
  effects: string[]
  color: string
}

/**
 * Info Panel Class
 * 
 * Displays pollution information và effects
 * 
 * @example
 * ```typescript
 * const panel = new InfoPanel({
 *   container: '#app',
 *   position: 'top-right',
 * })
 * 
 * // Update với pollution level
 * panel.update(75)
 * 
 * // Cleanup
 * panel.dispose()
 * ```
 */
export class InfoPanel {
  // PRIVATE PROPERTIES
  private _container: HTMLElement
  private _panel: HTMLElement
  private _titleElement: HTMLElement | null = null
  private _levelElement: HTMLElement
  private _messageElement: HTMLElement
  private _effectsElement: HTMLElement
  private _value: number = 0
  private _isDisposed: boolean = false

  // CONSTRUCTOR
  /**
   * Create new InfoPanel
   * 
   * @param options - Panel options
   */
  constructor(options: InfoPanelOptions = {}) {
    // Get container
    this._container = this.resolveContainer(options.container)
    
    // Create panel
    this._panel = this.createPanel(options.position ?? 'top-right')
    
    // Create content elements
    if (options.showTitle !== false) {
      this._titleElement = this.createTitle()
      this._panel.appendChild(this._titleElement)
    }
    
    this._levelElement = this.createLevelDisplay()
    this._messageElement = this.createMessageDisplay()
    this._effectsElement = this.createEffectsDisplay()
    
    this._panel.appendChild(this._levelElement)
    this._panel.appendChild(this._messageElement)
    this._panel.appendChild(this._effectsElement)
    
    // Add to container
    this._container.appendChild(this._panel)
    
    // Set initial value
    this.update(options.initialValue ?? 0)
  }

  // PUBLIC GETTERS
  /**
   * Get panel element
   */
  get element(): HTMLElement {
    return this._panel
  }

  /**
   * Get current value
   */
  get value(): number {
    return this._value
  }

  /**
   * Check if disposed
   */
  get isDisposed(): boolean {
    return this._isDisposed
  }

  // PUBLIC METHODS
  /**
   * Update panel với pollution level
   * 
   * @param value - Pollution level (0-100)
   */
  update(value: number): void {
    if (this._isDisposed) return
    
    this._value = clamp(value, 0, 100)
    const info = this.getPollutionInfo(this._value)
    
    // Update displays
    this.updateLevelDisplay(info)
    this.updateMessageDisplay(info)
    this.updateEffectsDisplay(info)
    
    // Update panel border color
    this._panel.style.borderColor = info.color
  }

  /**
   * Show panel
   */
  show(): void {
    if (this._isDisposed) return
    
    this._panel.style.opacity = '1'
    this._panel.style.transform = 'translateY(0)'
  }

  /**
   * Hide panel
   */
  hide(): void {
    if (this._isDisposed) return
    
    this._panel.style.opacity = '0'
    this._panel.style.transform = 'translateY(-20px)'
  }

  /**
   * Dispose panel
   */
  dispose(): void {
    if (this._isDisposed) return
    
    if (this._panel.parentNode) {
      this._panel.parentNode.removeChild(this._panel)
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
   * Create panel element
   */
  private createPanel(position: string): HTMLElement {
    const panel = document.createElement('div')
    panel.className = 'info-panel'
    
    // Base styles
    let positionStyles = ''
    switch (position) {
      case 'top-left':
        positionStyles = 'top: 20px; left: 20px;'
        break
      case 'top-right':
        positionStyles = 'top: 20px; right: 20px;'
        break
      case 'bottom-left':
        positionStyles = 'bottom: 100px; left: 20px;'
        break
      case 'bottom-right':
        positionStyles = 'bottom: 100px; right: 20px;'
        break
    }
    
    panel.style.cssText = `
      position: fixed;
      ${positionStyles}
      min-width: 280px;
      max-width: 320px;
      padding: 20px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      color: white;
      font-family: 'Segoe UI', system-ui, sans-serif;
      z-index: 100;
      transition: all 0.3s ease;
    `
    
    return panel
  }

  /**
   * Create title element
   */
  private createTitle(): HTMLElement {
    const title = document.createElement('h3')
    title.textContent = 'Trạng thái Trái Đất'
    title.style.cssText = `
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.9;
    `
    return title
  }

  /**
   * Create level display
   */
  private createLevelDisplay(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'level-display'
    container.style.cssText = `
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 12px;
    `
    
    const label = document.createElement('span')
    label.textContent = 'Ô nhiễm:'
    label.style.opacity = '0.7'
    
    const value = document.createElement('span')
    value.className = 'level-value'
    value.style.cssText = `
      font-size: 32px;
      font-weight: bold;
    `
    
    const badge = document.createElement('span')
    badge.className = 'level-badge'
    badge.style.cssText = `
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    `
    
    container.appendChild(label)
    container.appendChild(value)
    container.appendChild(badge)
    
    return container
  }

  /**
   * Create message display
   */
  private createMessageDisplay(): HTMLElement {
    const message = document.createElement('p')
    message.className = 'message-display'
    message.style.cssText = `
      margin: 0 0 16px 0;
      font-size: 14px;
      line-height: 1.5;
      opacity: 0.9;
    `
    return message
  }

  /**
   * Create effects display
   */
  private createEffectsDisplay(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'effects-display'
    
    const title = document.createElement('h4')
    title.textContent = 'Tác động:'
    title.style.cssText = `
      margin: 0 0 8px 0;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.7;
    `
    
    const list = document.createElement('ul')
    list.className = 'effects-list'
    list.style.cssText = `
      margin: 0;
      padding-left: 20px;
      font-size: 13px;
      line-height: 1.6;
      opacity: 0.85;
    `
    
    container.appendChild(title)
    container.appendChild(list)
    
    return container
  }

  /**
   * Get pollution info for value
   */
  private getPollutionInfo(value: number): PollutionInfo {
    const level = getPollutionLevelFromValue(value)
    const message = getPollutionMessage(value)
    
    // Get effects based on level
    const effects = this.getEffectsForLevel(level, value)
    
    // Get color based on level
    const color = this.getColorForLevel(level)
    
    return {
      level,
      percentage: value,
      message,
      effects,
      color,
    }
  }

  /**
   * Get effects list for level
   */
  private getEffectsForLevel(level: PollutionLevel, value: number): string[] {
    const effects: string[] = []
    
    switch (level) {
      case PollutionLevel.CLEAN:
        effects.push('Không khí trong lành')
        effects.push('Hệ sinh thái cân bằng')
        effects.push('Nước sạch, an toàn')
        break
        
      case PollutionLevel.LIGHT:
        effects.push('Chất lượng không khí tốt')
        effects.push('Một số khu vực bắt đầu ô nhiễm nhẹ')
        break
        
      case PollutionLevel.MODERATE:
        effects.push('Ô nhiễm không khí nhẹ')
        effects.push('Một số loài bị ảnh hưởng')
        effects.push('Cần giảm khí thải')
        break
        
      case PollutionLevel.SEVERE:
        effects.push('⚠️ MỨC NGUY HIỂM')
        effects.push('Ô nhiễm không khí nghiêm trọng')
        effects.push('Nhiều loài bị đe dọa')
        effects.push('Sức khỏe con người bị ảnh hưởng')
        effects.push('Cần hành động ngay!')
        break
    }
    
    // Add specific effects based on value
    if (value > 50) {
      effects.push('🏭 Khói công nghiệp phát sinh')
    }
    
    if (value > 60) {
      effects.push('🗑️ Rác thải tràn ngập')
    }
    
    if (value > 70) {
      effects.push('🌊 Đại dương bị ô nhiễm')
    }
    
    return effects
  }

  /**
   * Get color for level
   */
  private getColorForLevel(level: PollutionLevel): string {
    return POLLUTION_THRESHOLDS[level].color
  }

  /**
   * Update level display
   */
  private updateLevelDisplay(info: PollutionInfo): void {
    const valueEl = this._levelElement.querySelector('.level-value')
    const badgeEl = this._levelElement.querySelector('.level-badge')
    
    if (valueEl) {
      valueEl.textContent = `${Math.round(info.percentage)}%`
      ;(valueEl as HTMLElement).style.color = info.color
    }
    
    if (badgeEl) {
      badgeEl.textContent = this.getLevelText(info.level)
      ;(badgeEl as HTMLElement).style.background = info.color
      ;(badgeEl as HTMLElement).style.color = info.level === PollutionLevel.CLEAN || info.level === PollutionLevel.LIGHT ? 'black' : 'white'
    }
  }

  /**
   * Get text for level
   */
  private getLevelText(level: PollutionLevel): string {
    switch (level) {
      case PollutionLevel.CLEAN: return 'Trong lành'
      case PollutionLevel.LIGHT: return 'Nhẹ'
      case PollutionLevel.MODERATE: return 'Trung bình'
      case PollutionLevel.SEVERE: return 'Nghiêm trọng'
      default: return 'N/A'
    }
  }

  /**
   * Update message display
   */
  private updateMessageDisplay(info: PollutionInfo): void {
    this._messageElement.textContent = info.message
  }

  /**
   * Update effects display
   */
  private updateEffectsDisplay(info: PollutionInfo): void {
    const list = this._effectsElement.querySelector('.effects-list')
    if (!list) return
    
    list.innerHTML = ''
    
    for (const effect of info.effects) {
      const li = document.createElement('li')
      li.textContent = effect
      list.appendChild(li)
    }
  }
}
