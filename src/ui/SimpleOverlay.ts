/**
 * Simple Overlay Intro
 * 
 * Just text and button overlay - Main app's Earth renders behind.
 * When user clicks "Explore", overlay fades out and camera zooms out
 * to reveal the Earth "flying out" to center.
 * 
 * This ensures only ONE Earth exists throughout the experience.
 * 
 * @module ui/SimpleOverlay
 */

import gsap from 'gsap'

export interface SimpleOverlayOptions {
  title?: string
  subtitle?: string
  buttonText?: string
  onStart?: () => void
}

export class SimpleOverlay {
  private _overlay: HTMLElement
  private _isDisposed: boolean = false
  private _onStart: (() => void) | null

  constructor(options: SimpleOverlayOptions = {}) {
    this._onStart = options.onStart ?? null

    // Create overlay
    this._overlay = document.createElement('div')
    this._overlay.className = 'simple-overlay'
    this._overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(ellipse at center bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 60px 20px;
      box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `

    // Title section
    const topSection = document.createElement('div')
    topSection.style.cssText = `
      text-align: center;
      opacity: 0;
      transform: translateY(-30px);
    `

    const title = document.createElement('h1')
    title.textContent = options.title || 'TRÁI ĐẤT XANH'
    title.style.cssText = `
      font-size: clamp(36px, 10vw, 72px);
      font-weight: 800;
      margin: 0 0 16px 0;
      color: #ffffff;
      letter-spacing: 4px;
      text-transform: uppercase;
      text-shadow: 0 0 40px rgba(0, 200, 255, 0.5), 0 4px 20px rgba(0,0,0,0.5);
    `
    topSection.appendChild(title)

    const subtitle = document.createElement('p')
    subtitle.textContent = options.subtitle || 'Hai Tương Lai'
    subtitle.style.cssText = `
      font-size: clamp(16px, 4vw, 28px);
      margin: 0;
      color: #b0e0ff;
      font-weight: 300;
      letter-spacing: 2px;
      font-style: italic;
    `
    topSection.appendChild(subtitle)
    this._overlay.appendChild(topSection)

    // Spacer
    const spacer = document.createElement('div')
    spacer.style.flex = '1'
    this._overlay.appendChild(spacer)

    // Button section
    const bottomSection = document.createElement('div')
    bottomSection.style.cssText = `
      opacity: 0;
      transform: translateY(30px);
    `

    const button = document.createElement('button')
    button.textContent = options.buttonText || 'Khám Phá'
    button.style.cssText = `
      padding: 18px 60px;
      font-size: clamp(16px, 3vw, 20px);
      font-weight: 600;
      border: 2px solid #00c8ff;
      background: rgba(0, 200, 255, 0.15);
      color: #00c8ff;
      border-radius: 50px;
      cursor: pointer;
      letter-spacing: 2px;
      text-transform: uppercase;
      box-shadow: 0 0 30px rgba(0, 200, 255, 0.3);
      transition: all 0.3s ease;
    `

    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(0, 200, 255, 0.25)'
      button.style.boxShadow = '0 0 50px rgba(0, 200, 255, 0.5)'
      button.style.transform = 'scale(1.05)'
    })

    button.addEventListener('mouseleave', () => {
      button.style.background = 'rgba(0, 200, 255, 0.15)'
      button.style.boxShadow = '0 0 30px rgba(0, 200, 255, 0.3)'
      button.style.transform = 'scale(1)'
    })

    button.addEventListener('click', () => this.startExploration())

    bottomSection.appendChild(button)
    this._overlay.appendChild(bottomSection)

    document.body.appendChild(this._overlay)

    // Animate in
    gsap.to(topSection, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.3 })
    gsap.to(bottomSection, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.6 })
  }

  private startExploration(): void {
    if (this._isDisposed) return

    // Trigger callback (this will start camera animation)
    if (this._onStart) {
      this._onStart()
    }

    // Fade out overlay smoothly
    gsap.to(this._overlay, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      onComplete: () => this.dispose(),
    })
  }

  public show(): void {
    if (this._isDisposed) return
    this._overlay.style.display = 'flex'
  }

  public hide(): void {
    if (this._isDisposed) return
    this._overlay.style.display = 'none'
  }

  public dispose(): void {
    if (this._isDisposed) return
    this._isDisposed = true
    this._overlay.remove()
  }
}
