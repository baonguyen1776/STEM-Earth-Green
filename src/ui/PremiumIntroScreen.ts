/**
 * Premium Intro Screen with 3D Earth
 * 
 * Earth positioned at bottom of screen, rotates continuously,
 * then moves to center when user clicks "Explore"
 * 
 * @module ui/PremiumIntroScreen
 */

import * as THREE from 'three'
import gsap from 'gsap'
import { EARTH_ASSETS } from '../config/earthConfig'

/**
 * Premium Intro Screen Options
 */
export interface PremiumIntroScreenOptions {
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
  
  /** Auto hide after start */
  autoHide?: boolean
}

/**
 * Premium Intro Screen Class
 * 
 * Fullscreen intro with 3D Earth at bottom, auto-rotating
 */
export class PremiumIntroScreen {
  // DOM Elements
  private _container: HTMLElement
  private _overlay!: HTMLElement
  private _content!: HTMLElement
  private _canvas!: HTMLCanvasElement
  private _starsCanvas!: HTMLCanvasElement
  private _titleElement!: HTMLElement
  private _subtitleElement!: HTMLElement
  private _button!: HTMLButtonElement
  
  // Three.js for Earth
  private _renderer!: THREE.WebGLRenderer
  private _scene!: THREE.Scene
  private _camera!: THREE.PerspectiveCamera
  private _earth!: THREE.Mesh
  private _animationId: number | null = null
  
  // Three.js for Stars (fullscreen)
  private _starsRenderer!: THREE.WebGLRenderer
  private _starsScene!: THREE.Scene
  private _starsCamera!: THREE.PerspectiveCamera
  
  // State
  private _onStart: (() => void) | null
  private _autoHide: boolean
  private _isDisposed: boolean = false
  private _isAnimatingOut: boolean = false
  
  // Animation values
  private _autoRotationSpeed: number = 0.003  // Faster rotation
  private _earthStartY: number = 0  // Earth at center of canvas

  constructor(options: PremiumIntroScreenOptions = {}) {
    // Get container
    this._container = this.resolveContainer(options.container)
    
    // Config
    this._onStart = options.onStart ?? null
    this._autoHide = options.autoHide ?? true
    
    // Create DOM structure
    this.createDOM(options)
    
    // Initialize Three.js
    this.initializeThreeJS()
    
    // Create 3D Earth
    this.createEarth()
    
    // Setup event listeners
    this.setupEventListeners()
    
    // Start animation loop
    this.animate()
  }

  /**
   * Resolve container element
   */
  private resolveContainer(container?: HTMLElement | string): HTMLElement {
    if (container instanceof HTMLElement) return container
    if (typeof container === 'string') {
      const element = document.querySelector(container) as HTMLElement
      if (!element) throw new Error(`Container not found: ${container}`)
      return element
    }
    return document.body
  }

  /**
   * Create DOM structure
   */
  private createDOM(options: PremiumIntroScreenOptions): void {
    // Overlay - same black background as main app
    this._overlay = document.createElement('div')
    this._overlay.className = 'intro-overlay'
    this._overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000000;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 40px 20px;
      box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      overflow: hidden;
    `

    // Fullscreen Stars Canvas (background layer)
    this._starsCanvas = document.createElement('canvas')
    this._starsCanvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
      z-index: 0;
    `
    this._overlay.appendChild(this._starsCanvas)

    // Canvas for Earth (positioned at bottom of screen)
    this._canvas = document.createElement('canvas')
    this._canvas.style.cssText = `
      position: absolute;
      bottom: -100px;
      left: 50%;
      transform: translateX(-50%);
      width: 700px;
      height: 700px;
      display: block;
      z-index: 1;
      pointer-events: none;
    `
    this._overlay.appendChild(this._canvas)

    // Content wrapper (on top of canvas)
    this._content = document.createElement('div')
    this._content.style.cssText = `
      position: relative;
      z-index: 10;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      pointer-events: none;
    `
    this._overlay.appendChild(this._content)

    // Top section (Title)
    const topSection = document.createElement('div')
    topSection.style.cssText = `
      text-align: center;
      margin-top: 60px;
      opacity: 0;
      animation: fadeInDown 1.2s ease-out 0.5s forwards;
    `

    this._titleElement = document.createElement('h1')
    this._titleElement.textContent = options.title || 'TRÁI ĐẤT XANH'
    this._titleElement.style.cssText = `
      font-size: clamp(32px, 8vw, 64px);
      font-weight: 700;
      margin: 0 0 16px 0;
      color: #ffffff;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-shadow: 0 0 30px rgba(0, 200, 255, 0.3);
    `
    topSection.appendChild(this._titleElement)

    this._subtitleElement = document.createElement('p')
    this._subtitleElement.textContent = options.subtitle || 'Hai Tương Lai'
    this._subtitleElement.style.cssText = `
      font-size: clamp(14px, 3vw, 24px);
      margin: 0;
      color: #b0e0ff;
      font-weight: 300;
      letter-spacing: 1px;
    `
    topSection.appendChild(this._subtitleElement)

    this._content.appendChild(topSection)

    // Bottom section (Button)
    const bottomSection = document.createElement('div')
    bottomSection.style.cssText = `
      margin-bottom: 60px;
      opacity: 0;
      animation: fadeInUp 1.2s ease-out 0.8s forwards;
      pointer-events: auto;
    `

    this._button = document.createElement('button')
    this._button.textContent = options.buttonText || 'Khám Phá'
    this._button.style.cssText = `
      padding: 16px 48px;
      font-size: clamp(14px, 2.5vw, 18px);
      font-weight: 600;
      border: 2px solid #00c8ff;
      background: rgba(0, 200, 255, 0.1);
      color: #00c8ff;
      border-radius: 50px;
      cursor: pointer;
      letter-spacing: 1px;
      transition: all 0.3s ease;
      text-transform: uppercase;
      box-shadow: 0 0 20px rgba(0, 200, 255, 0.2);
    `

    // Button hover effect
    this._button.addEventListener('mouseenter', () => {
      gsap.to(this._button, {
        background: 'rgba(0, 200, 255, 0.2)',
        boxShadow: '0 0 40px rgba(0, 200, 255, 0.5)',
        duration: 0.3,
      })
    })

    this._button.addEventListener('mouseleave', () => {
      gsap.to(this._button, {
        background: 'rgba(0, 200, 255, 0.1)',
        boxShadow: '0 0 20px rgba(0, 200, 255, 0.2)',
        duration: 0.3,
      })
    })

    bottomSection.appendChild(this._button)
    this._content.appendChild(bottomSection)

    // Add CSS animations
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `
    document.head.appendChild(style)

    // Add to container
    this._container.appendChild(this._overlay)
  }

  /**
   * Initialize Three.js
   */
  private initializeThreeJS(): void {
    // ===== FULLSCREEN STARS RENDERER =====
    this._starsScene = new THREE.Scene()
    
    const starsWidth = window.innerWidth
    const starsHeight = window.innerHeight
    this._starsCanvas.width = starsWidth
    this._starsCanvas.height = starsHeight
    
    this._starsCamera = new THREE.PerspectiveCamera(75, starsWidth / starsHeight, 0.1, 10000)
    this._starsCamera.position.set(0, 0, 1)
    
    this._starsRenderer = new THREE.WebGLRenderer({
      canvas: this._starsCanvas,
      antialias: true,
      alpha: false,
    })
    this._starsRenderer.setSize(starsWidth, starsHeight)
    this._starsRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Create fullscreen starfield
    this.createStarfield()

    // ===== EARTH RENDERER =====
    this._scene = new THREE.Scene()
    this._scene.background = null  // Transparent to show stars behind

    const width = 700
    const height = 700
    this._canvas.width = width
    this._canvas.height = height

    this._camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000)
    this._camera.position.set(0, 0, 2.5)

    // Renderer with alpha for transparency
    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
      alpha: true,
    })
    this._renderer.setSize(width, height)
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this._renderer.outputColorSpace = THREE.SRGBColorSpace
    this._renderer.toneMapping = THREE.ACESFilmicToneMapping
    this._renderer.toneMappingExposure = 1.2

    // Lighting - same as main app (NASA style)
    const ambientLight = new THREE.AmbientLight(0x0a0a1a, 0.6)
    this._scene.add(ambientLight)

    // Key light (warm sun)
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.5)
    keyLight.position.set(5, 3, 8)
    this._scene.add(keyLight)

    // Rim light (cyan edge)
    const rimLight = new THREE.DirectionalLight(0x00f2ff, 2.8)
    rimLight.position.set(-5, 2, -8)
    this._scene.add(rimLight)

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x4da6ff, 0.8)
    fillLight.position.set(0, -3, 3)
    this._scene.add(fillLight)
  }

  /**
   * Create starfield background (fullscreen, same style as main app)
   */
  private createStarfield(): void {
    const starCount = 2500
    const positions = new Float32Array(starCount * 3)
    const sizes = new Float32Array(starCount)
    const opacities = new Float32Array(starCount)
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3
      // Spread stars in a sphere around camera
      const radius = 50 + Math.random() * 150
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
      
      // Vary star sizes - small like main app
      sizes[i] = 0.3 + Math.random() * 0.5
      opacities[i] = 0.3 + Math.random() * 0.5
    }
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    
    // Create circular star texture (same as main app Starfield)
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)
    
    const starTexture = new THREE.CanvasTexture(canvas)
    
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.8,
      map: starTexture,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    
    const stars = new THREE.Points(geometry, material)
    this._starsScene.add(stars)
  }

  /**
   * Create 3D Earth with same textures as main app (Earth + Clouds + Atmosphere)
   */
  private createEarth(): void {
    const textureLoader = new THREE.TextureLoader()
    
    // Create Earth Group to hold all components
    const earthGroup = new THREE.Group()
    
    // === EARTH SPHERE ===
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64)
    const earthTexture = textureLoader.load(EARTH_ASSETS.dayMap)
    earthTexture.colorSpace = THREE.SRGBColorSpace
    
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      metalness: 0,
      roughness: 0.7,
    })

    this._earth = new THREE.Mesh(earthGeometry, earthMaterial)
    earthGroup.add(this._earth)

    // === CLOUDS LAYER (same as main app) ===
    const cloudsGeometry = new THREE.SphereGeometry(1.02, 64, 64)
    const cloudsTexture = textureLoader.load(EARTH_ASSETS.cloudMap)
    
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    earthGroup.add(clouds);
    
    // Store clouds for rotation
    (this._earth as any)._clouds = clouds

    // === ATMOSPHERE GLOW (same color as main app: #1e90ff) ===
    const atmosphereGeometry = new THREE.SphereGeometry(1.15, 64, 64)
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x1e90ff,  // Dodger blue - same as main app
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    earthGroup.add(atmosphere)
    
    // === OUTER GLOW ===
    const outerGlowGeometry = new THREE.SphereGeometry(1.25, 64, 64)
    const outerGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0x1e90ff,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    })
    const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
    earthGroup.add(outerGlow);

    // Position and tilt
    earthGroup.position.y = this._earthStartY;
    earthGroup.rotation.x = 0.3;
    earthGroup.rotation.z = -0.2;
    
    this._scene.add(earthGroup);
    
    // Store earthGroup reference for animations
    (this._earth as any)._group = earthGroup
    
    console.log('🌍 Intro Earth created with clouds and atmosphere')
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Button click
    this._button.addEventListener('click', () => {
      this.startExploration()
    })

    // Window resize
    window.addEventListener('resize', () => {
      this.onWindowResize()
    })
  }

  /**
   * Start exploration - Earth moves to center, then camera zooms
   */
  private startExploration(): void {
    if (this._isAnimatingOut) return
    this._isAnimatingOut = true

    // Smooth transition timeline
    const timeline = gsap.timeline({
      onComplete: () => {
        // Delay callback slightly to let main app render first
        setTimeout(() => {
          if (this._onStart) {
            this._onStart()
          }
          if (this._autoHide) {
            this.hide()
          }
        }, 100)
      },
    })

    // Fade out text first (faster)
    timeline.to(this._content, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    }, 0)

    // Canvas moves up smoothly to center
    timeline.to(this._canvas, {
      bottom: '50%',
      transform: 'translateX(-50%) translateY(50%)',
      duration: 1.5,
      ease: 'power3.inOut',
    }, 0.3)

    // Camera zoom in (slower for cinematic effect)
    timeline.to(this._camera.position, {
      z: 0.5,
      duration: 1.8,
      ease: 'power2.in',
    }, 0.3)

    // Fade out entire overlay smoothly
    timeline.to(this._overlay, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
    }, 1.2)
  }

  /**
   * Animation loop
   */
  private animate = (): void => {
    this._animationId = requestAnimationFrame(this.animate)

    // Auto rotate Earth and clouds (clouds rotate slightly faster)
    if (this._earth) {
      this._earth.rotation.y += this._autoRotationSpeed
      
      // Rotate clouds slightly faster (like main app)
      const clouds = (this._earth as any)._clouds as THREE.Mesh | undefined
      if (clouds) {
        clouds.rotation.y += this._autoRotationSpeed * 1.1
      }
    }

    // Render fullscreen stars
    this._starsRenderer.render(this._starsScene, this._starsCamera)
    
    // Render Earth
    this._renderer.render(this._scene, this._camera)
  }

  /**
   * Handle window resize
   */
  private onWindowResize = (): void => {
    // Resize Earth canvas
    const width = this._canvas.clientWidth
    const height = this._canvas.clientHeight
    this._camera.aspect = width / height
    this._camera.updateProjectionMatrix()
    this._renderer.setSize(width, height)
    
    // Resize fullscreen stars canvas
    const starsWidth = window.innerWidth
    const starsHeight = window.innerHeight
    this._starsCanvas.width = starsWidth
    this._starsCanvas.height = starsHeight
    this._starsCamera.aspect = starsWidth / starsHeight
    this._starsCamera.updateProjectionMatrix()
    this._starsRenderer.setSize(starsWidth, starsHeight)
  }

  /**
   * Show intro
   */
  public show(): void {
    if (this._isDisposed) return
    this._overlay.style.display = 'flex'
  }

  /**
   * Hide intro
   */
  public hide(): void {
    if (this._isDisposed) return
    gsap.to(this._overlay, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        this._overlay.style.display = 'none'
      },
    })
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    if (this._isDisposed) return

    // Cancel animation
    if (this._animationId !== null) {
      cancelAnimationFrame(this._animationId)
    }

    // Remove event listeners
    window.removeEventListener('resize', this.onWindowResize)

    // Dispose Earth Three.js
    if (this._earth?.geometry) this._earth.geometry.dispose()
    if (this._earth?.material) {
      const mat = this._earth.material as THREE.Material
      mat.dispose()
    }
    this._renderer.dispose()
    
    // Dispose Stars Three.js
    this._starsRenderer.dispose()

    // Remove DOM
    this._overlay.remove()

    this._isDisposed = true
  }
}
