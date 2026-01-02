/**
 * Trái Đất Xanh - Hai Tương Lai
 * 
 * Interactive 3D Earth visualization showing impact of pollution
 * 
 * @module main
 * 
 * STEM Educational Project
 */

import './style.css'

// Core
import { Renderer, SceneManager, CameraManager, AnimationLoop } from './core'

// Earth
import { Earth, disposeSharedTextures } from './earth'

// Effects
import { Starfield, SmokeSystem, TrashSystem } from './effects'

// UI
import { PollutionSlider, InfoPanel, IntroScreen, IntroController } from './ui'

// Domain
import { EarthState } from './domain'

/**
 * Application Class
 * 
 * Main application orchestrator
 */
class App {
  // Components
  private renderer!: Renderer
  private sceneManager!: SceneManager
  private cameraManager!: CameraManager
  private animationLoop!: AnimationLoop
  
  // Earth
  private earth!: Earth
  
  // Effects
  private starfield!: Starfield
  private smokeSystem!: SmokeSystem
  private trashSystem!: TrashSystem
  
  // UI
  private slider!: PollutionSlider
  private infoPanel!: InfoPanel
  private introScreen!: IntroScreen
  private introController!: IntroController
  
  // State
  private earthState!: EarthState
  
  // Track if we've centered camera yet
  private _cameraCentered: boolean = false
  
  /**
   * Initialize application
   */
  async init(): Promise<void> {
    try {
      // Setup container
      this.setupContainer()
      
      // Initialize core
      this.initCore()
      
      // Initialize Earth
      await this.initEarth()
      
      // Initialize effects
      this.initEffects()
      
      // Initialize state
      this.initState()
      
      // Initialize UI
      this.initUI()
      
      // Setup event handlers
      this.setupEventHandlers()
      
      // Start animation loop (will center camera on first frame)
      this.animationLoop.start()
      
      console.log('🌍 Trái Đất Xanh initialized successfully!')
      
    } catch (error) {
      console.error('Failed to initialize application:', error)
      this.showError('Không thể khởi tạo ứng dụng. Vui lòng tải lại trang.')
    }
  }
  
  /**
   * Setup container element
   */
  private setupContainer(): void {
    const app = document.querySelector<HTMLDivElement>('#app')
    if (!app) {
      throw new Error('App container not found')
    }
    
    // Clear default content
    app.innerHTML = ''
    app.style.cssText = `
      width: 100vw;
      height: 100vh;
      margin: 0;
      padding: 0;
      overflow: hidden;
    `
  }
  
  /**
   * Initialize core components
   */
  private initCore(): void {
    // Create renderer
    this.renderer = new Renderer({ container: '#app' })
    
    // Create scene
    this.sceneManager = new SceneManager()
    
    // Create camera
    this.cameraManager = new CameraManager({
      domElement: this.renderer.domElement,
    })
    
    // Create animation loop
    this.animationLoop = new AnimationLoop()
  }
  
  /**
   * Initialize Earth
   */
  private async initEarth(): Promise<void> {
    // Create Earth
    this.earth = new Earth({
      pollutionLevel: 0,
      enableClouds: true,
      enableAtmosphere: true,
      autoRotate: true,
    })
    
    // Add to scene
    this.sceneManager.add(this.earth.group, 'earth')
    
    // Load textures (non-blocking)
    this.earth.loadTextures((progress) => {
      console.log(`Loading textures: ${progress.percentage}%`)
    }).catch((error) => {
      console.warn('Some textures failed to load:', error)
    })
  }
  
  /**
   * Initialize effects
   */
  private initEffects(): void {
    // Starfield
    this.starfield = new Starfield({
      count: 5000,
      twinkle: true,
    })
    this.sceneManager.add(this.starfield.mesh, 'starfield')
    
    // Smoke system
    this.smokeSystem = new SmokeSystem({
      pollutionLevel: 0,
    })
    this.sceneManager.add(this.smokeSystem.mesh, 'smoke')
    
    // Trash system
    this.trashSystem = new TrashSystem({
      pollutionLevel: 0,
    })
    this.sceneManager.add(this.trashSystem.mesh, 'trash')
  }
  
  /**
   * Initialize state
   */
  private initState(): void {
    this.earthState = new EarthState()
    
    // Subscribe to pollution changes
    this.earthState.addListener((event) => {
      this.onPollutionChange(event.newState.pollutionLevel)
    })
  }
  
  /**
   * Initialize UI
   */
  private initUI(): void {
    // Intro screen
    this.introScreen = new IntroScreen({
      title: 'Trái Đất Xanh',
      subtitle: 'Hai Tương Lai',
      buttonText: 'Khám Phá',
      onStart: () => this.startExperience(),
    })
    this.introScreen.show() // Show intro content with animation
    
    // Intro controller
    this.introController = new IntroController({
      cameraManager: this.cameraManager,
      duration: 3,
      startDistance: 20,
      endDistance: 15,
      onComplete: () => this.onIntroComplete(),
    })
    
    // Slider (initially disabled)
    this.slider = new PollutionSlider({
      initialValue: 0,
      onChange: (value) => {
        this.earthState.setPollution(value)
      },
    })
    this.slider.disable()
    
    // Info panel (initially hidden)
    this.infoPanel = new InfoPanel({
      position: 'top-right',
      initialValue: 0,
    })
    this.infoPanel.hide()
  }
  
  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    // Animation loop update
    this.animationLoop.add('main', (delta: number) => {
      // Center camera on first frame
      if (!this._cameraCentered) {
        this.centerCamera()
        this._cameraCentered = true
      }
      
      // Update Earth
      this.earth.update(delta)
      
      // Update effects
      this.starfield.update(delta)
      this.smokeSystem.update(delta)
      this.trashSystem.update(delta)
      
      // Update camera controls
      this.cameraManager.update()
      
      // Render scene
      this.renderer.render(this.sceneManager.scene, this.cameraManager.camera)
    })
    
    // Window resize
    window.addEventListener('resize', () => {
      this.renderer.updateSize()
      this.cameraManager.updateAspect(window.innerWidth / window.innerHeight)
    })
    
    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.introController.skip()
      }
    })
  }
  
  /**
   * Force camera to center on Earth at origin
   */
  private centerCamera(): void {
    // Set camera position directly looking at origin
    this.cameraManager.setPosition(0, 0, 20)
    this.cameraManager.setTarget(0, 0, 0)
    
    // Also set Earth position to origin explicitly
    this.earth.setPosition(0, 0, 0)
    
    // Debug logging
    console.log('🎥 Camera position:', this.cameraManager.camera.position)
    console.log('🎯 Camera target:', this.cameraManager.getTarget())
    console.log('🌍 Earth position:', this.earth.group.position)
    console.log('📐 Canvas size:', this.renderer.size)
    console.log('📏 Aspect ratio:', this.cameraManager.camera.aspect)
  }
  
  /**
   * Start experience after intro
   */
  private startExperience(): void {
    this.introController.play()
  }
  
  /**
   * Called when intro animation completes
   */
  private onIntroComplete(): void {
    // Enable UI
    this.slider.enable()
    this.infoPanel.show()
  }
  
  /**
   * Handle pollution change
   */
  private onPollutionChange(level: number): void {
    // Update Earth
    this.earth.setPollutionLevel(level)
    
    // Update effects
    this.smokeSystem.setPollutionLevel(level)
    this.trashSystem.setPollutionLevel(level)
    
    // Update UI
    this.infoPanel.update(level)
  }
  
  /**
   * Show error message
   */
  private showError(message: string): void {
    const app = document.querySelector<HTMLDivElement>('#app')
    if (app) {
      app.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #1a1a1a;
          color: white;
          font-family: system-ui, sans-serif;
          text-align: center;
          padding: 20px;
        ">
          <div>
            <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
            <h1 style="margin: 0 0 10px 0;">Đã xảy ra lỗi</h1>
            <p style="opacity: 0.7;">${message}</p>
            <button onclick="location.reload()" style="
              margin-top: 20px;
              padding: 12px 24px;
              background: #4CAF50;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            ">Tải lại</button>
          </div>
        </div>
      `
    }
  }
  
  /**
   * Dispose application
   */
  dispose(): void {
    // Stop animation
    this.animationLoop.stop()
    
    // Dispose components
    this.earth.dispose()
    this.starfield.dispose()
    this.smokeSystem.dispose()
    this.trashSystem.dispose()
    
    // Dispose textures
    disposeSharedTextures()
    
    // Dispose UI
    this.slider.dispose()
    this.infoPanel.dispose()
    this.introScreen.dispose()
    this.introController.dispose()
    
    // Dispose core
    this.cameraManager.dispose()
    this.sceneManager.dispose()
    this.renderer.dispose()
    
    console.log('🌍 Application disposed')
  }
}

// Initialize application
const app = new App()
app.init()

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  app.dispose()
})
