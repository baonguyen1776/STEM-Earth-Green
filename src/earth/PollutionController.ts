/**
 * Pollution Controller
 * 
 * Centralized controller for managing pollution effects across
 * Earth, Clouds, and Atmosphere components
 * 
 * @module earth/PollutionController
 */

import * as THREE from 'three'
import { EarthShaderMaterial } from './EarthShaderMaterial'
import { CloudShaderMaterial } from './CloudShaderMaterial'
import { AtmosphereShaderMaterial } from './AtmosphereShaderMaterial'

/**
 * Pollution Controller Options
 */
export interface PollutionControllerOptions {
  /** Initial pollution level (0-100) */
  initialLevel?: number
}

/**
 * Pollution Controller Class
 * 
 * Manages pollution effects across all Earth components
 */
export class PollutionController {
  private _pollutionLevel: number = 0
  private _earthMaterial: EarthShaderMaterial | null = null
  private _cloudMaterial: CloudShaderMaterial | null = null
  private _atmosphereMaterial: AtmosphereShaderMaterial | null = null
  private _lightDirection: THREE.Vector3 = new THREE.Vector3(1, 0.3, 0.5).normalize()

  constructor(options: PollutionControllerOptions = {}) {
    this._pollutionLevel = options.initialLevel ?? 0
  }

  // GETTERS
  get pollutionLevel(): number {
    return this._pollutionLevel
  }

  get lightDirection(): THREE.Vector3 {
    return this._lightDirection.clone()
  }

  // COMPONENT REGISTRATION
  /**
   * Register Earth material for pollution control
   */
  registerEarthMaterial(material: EarthShaderMaterial): void {
    this._earthMaterial = material
    this._updateEarthPollution()
  }

  /**
   * Register Cloud material for pollution control
   */
  registerCloudMaterial(material: CloudShaderMaterial): void {
    this._cloudMaterial = material
    this._updateCloudPollution()
  }

  /**
   * Register Atmosphere material for pollution control
   */
  registerAtmosphereMaterial(material: AtmosphereShaderMaterial): void {
    this._atmosphereMaterial = material
    this._updateAtmospherePollution()
  }

  // POLLUTION CONTROL
  /**
   * Set pollution level - updates all registered components
   * 
   * @param level - Pollution level (0-100)
   */
  setPollutionLevel(level: number): void {
    this._pollutionLevel = Math.max(0, Math.min(100, level))
    
    // Update all components
    this._updateEarthPollution()
    this._updateCloudPollution()
    this._updateAtmospherePollution()
  }

  // LIGHTING CONTROL
  /**
   * Set light direction (sun position) - updates all materials
   */
  setLightDirection(direction: THREE.Vector3): void {
    this._lightDirection.copy(direction).normalize()
    
    if (this._earthMaterial) {
      this._earthMaterial.setLightDirection(this._lightDirection)
    }
    if (this._cloudMaterial) {
      this._cloudMaterial.setLightDirection(this._lightDirection)
    }
    if (this._atmosphereMaterial) {
      this._atmosphereMaterial.setLightDirection(this._lightDirection)
    }
  }

  // TEXTURE MANAGEMENT
  /**
   * Set Earth textures
   */
  setEarthTextures(textures: {
    dayMap?: THREE.Texture
    nightMap?: THREE.Texture
    normalMap?: THREE.Texture
    specularMap?: THREE.Texture
    pollutedDayMap?: THREE.Texture
  }): void {
    if (this._earthMaterial) {
      this._earthMaterial.setTextures(textures)
    }
  }

  /**
   * Set Cloud textures
   */
  setCloudTextures(textures: {
    cleanCloudMap?: THREE.Texture
    pollutedCloudMap?: THREE.Texture
  }): void {
    if (this._cloudMaterial) {
      this._cloudMaterial.setTextures(textures)
    }
  }

  // ANIMATION HELPERS
  /**
   * Animate pollution level over time
   * 
   * @param targetLevel - Target pollution level (0-100)
   * @param duration - Animation duration in milliseconds
   * @param onComplete - Callback when animation completes
   */
  animatePollutionTo(
    targetLevel: number, 
    duration: number = 2000,
    onComplete?: () => void
  ): void {
    const startLevel = this._pollutionLevel
    const startTime = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Smooth easing
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2
      
      const currentLevel = startLevel + (targetLevel - startLevel) * easeProgress
      this.setPollutionLevel(currentLevel)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        onComplete?.()
      }
    }
    
    requestAnimationFrame(animate)
  }

  // PRIVATE METHODS
  private _updateEarthPollution(): void {
    if (this._earthMaterial) {
      this._earthMaterial.setPollutionLevel(this._pollutionLevel)
    }
  }

  private _updateCloudPollution(): void {
    if (this._cloudMaterial) {
      this._cloudMaterial.setPollutionLevel(this._pollutionLevel)
    }
  }

  private _updateAtmospherePollution(): void {
    if (this._atmosphereMaterial) {
      this._atmosphereMaterial.setPollutionLevel(this._pollutionLevel)
    }
  }

  // DISPOSAL
  /**
   * Clean up resources
   */
  dispose(): void {
    this._earthMaterial = null
    this._cloudMaterial = null
    this._atmosphereMaterial = null
  }
}