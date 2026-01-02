/**
 * Earth Material
 * 
 * PBR Material cho Earth với pollution-based color lerp
 * 
 * @module earth/EarthMaterial
 * 
 * Design principles:
 * - Dynamic color based on pollution level
 * - PBR rendering cho realistic look
 * - Night lights intensity control
 * - Texture support
 */

import * as THREE from 'three'
import { EARTH_MATERIAL } from '../config/earthConfig'
import { COLORS } from '../config/colors'
import { lerp, clamp } from '../utils/math'
import type { EarthTextureSet } from './EarthTextures'

/**
 * Earth Material Options
 */
export interface EarthMaterialOptions {
  /** Initial pollution level (0-100) */
  pollutionLevel?: number
  
  /** Textures to apply */
  textures?: Partial<EarthTextureSet>
  
  /** Material roughness (0-1) */
  roughness?: number
  
  /** Material metalness (0-1) */
  metalness?: number
  
  /** Enable emissive (night lights) */
  enableEmissive?: boolean
}

/**
 * Earth Material Class
 * 
 * Creates and manages Earth material với pollution-based appearance
 * 
 * @example
 * ```typescript
 * const material = new EarthMaterial({
 *   pollutionLevel: 0,
 *   textures: await textures.loadAll()
 * })
 * 
 * // Update pollution
 * material.setPollutionLevel(75)
 * 
 * // Get Three.js material
 * const mesh = new THREE.Mesh(geometry, material.material)
 * ```
 */
export class EarthMaterial {
  // PRIVATE PROPERTIES
  private _material: THREE.MeshStandardMaterial
  private _pollutionLevel: number = 0
  private _cleanColor: THREE.Color
  private _pollutedColor: THREE.Color
  private _currentColor: THREE.Color
  private _enableEmissive: boolean
  private _baseEmissiveIntensity: number = 1.0
  private _isDisposed: boolean = false

  // CONSTRUCTOR
  /**
   * Create new EarthMaterial
   * 
   * @param options - Material options
   */
  constructor(options: EarthMaterialOptions = {}) {
    // Parse colors - Land colors
    this._cleanColor = new THREE.Color(COLORS.earth.clean)
    this._pollutedColor = new THREE.Color(COLORS.earth.polluted)
    this._currentColor = this._cleanColor.clone()
    
    // Options
    this._enableEmissive = options.enableEmissive ?? true
    this._pollutionLevel = options.pollutionLevel ?? 0
    
    // Create material với better PBR settings
    this._material = new THREE.MeshStandardMaterial({
      color: 0xffffff,  // White base, texture provides color
      roughness: options.roughness ?? EARTH_MATERIAL.roughness,
      metalness: options.metalness ?? EARTH_MATERIAL.metalness,
      // Enhanced normal map settings
      normalScale: new THREE.Vector2(
        EARTH_MATERIAL.normalScale || 0.8,
        EARTH_MATERIAL.normalScale || 0.8
      ),
    })
    
    // Apply textures
    if (options.textures) {
      this.applyTextures(options.textures)
    }
    
    // Apply initial pollution
    this.setPollutionLevel(this._pollutionLevel)
  }

  // PUBLIC GETTERS
  /**
   * Get Three.js MeshStandardMaterial
   */
  get material(): THREE.MeshStandardMaterial {
    return this._material
  }

  /**
   * Get current pollution level
   */
  get pollutionLevel(): number {
    return this._pollutionLevel
  }

  /**
   * Get current color
   */
  get currentColor(): THREE.Color {
    return this._currentColor.clone()
  }

  /**
   * Check if disposed
   */
  get isDisposed(): boolean {
    return this._isDisposed
  }

  // PUBLIC METHODS
  /**
   * Set pollution level và update material - DRAMATIC VISUAL CHANGES
   * 
   * 5 CHANNELS of visual degradation:
   * 1. Surface desaturation (green → brown, blue → gray)
   * 2. Roughness increase (shiny → matte dead surface)
   * 3. City lights dimming (1.0 → 0.1 emissive intensity)
   * 4. Color tinting (overlay pollution color)
   * 5. Normal map weakening (terrain becomes flat/dead)
   * 
   * @param level - Pollution level (0-100)
   */
  setPollutionLevel(level: number): void {
    if (this._isDisposed) return
    
    this._pollutionLevel = clamp(level, 0, 100)
    
    // Calculate blend weights
    const weight = this._pollutionLevel / 100
    const severeWeight = Math.max(0, (this._pollutionLevel - 80) / 20)  // 0-1 trong 80-100%
    
    // === 1. SURFACE COLOR DESATURATION ===
    // Land: Green lush → Brown dead
    // Ocean: Blue vibrant → Gray-black dead
    this._currentColor.lerpColors(this._cleanColor, this._pollutedColor, weight)
    
    // Apply color tint overlay (không thay thế texture, nhưng tint nó)
    // At high pollution, surface gets muddy brown overlay
    const tintColor = new THREE.Color()
    const brownTint = new THREE.Color(0x8b4513)  // Saddle brown
    const grayTint = new THREE.Color(0x2c2c2c)   // Dark gray
    tintColor.lerpColors(brownTint, grayTint, severeWeight)
    
    // Blend original color with pollution tint
    this._material.color.lerpColors(
      new THREE.Color(0xffffff),  // Clean: white (texture shows through)
      tintColor,                   // Polluted: brown/gray tint
      weight * 0.6                 // Don't fully replace, blend
    )
    
    // === 2. CITY LIGHTS DIMMING (Critical for night side) ===
    if (this._enableEmissive) {
      this.updateEmissive(weight)
    }
    
    // === 3. MATERIAL PROPERTIES DEGRADATION ===
    this.updateMaterialProperties(weight, severeWeight)
    
    this._material.needsUpdate = true
  }

  /**
   * Apply textures to material - Enhanced với proper PBR setup
   * 
   * @param textures - Texture set
   */
  applyTextures(textures: Partial<EarthTextureSet>): void {
    if (this._isDisposed) return
    
    if (textures.dayMap) {
      this._material.map = textures.dayMap
      // Ensure texture is properly configured
      textures.dayMap.colorSpace = THREE.SRGBColorSpace
    }
    
    if (textures.normalMap) {
      this._material.normalMap = textures.normalMap
      // Strong normal map for mountain shadows
      this._material.normalScale.set(0.8, 0.8)
    }
    
    if (textures.specularMap) {
      // Specular map controls ocean vs land reflectivity
      // Ocean (bright in specular) = low roughness = shiny
      // Land (dark in specular) = high roughness = matte
      this._material.roughnessMap = textures.specularMap
      // Invert interpretation: bright areas = low roughness
      this._material.roughness = 0.5  // Base roughness, map modifies it
    }
    
    this._material.needsUpdate = true
  }

  /**
   * Set emissive color (night lights)
   * 
   * @param color - Emissive color
   * @param intensity - Emissive intensity
   */
  setEmissive(color: number | string | THREE.Color, intensity: number = 1): void {
    if (this._isDisposed) return
    
    this._material.emissive = new THREE.Color(color)
    this._material.emissiveIntensity = intensity
  }

  /**
   * Set night map as emissive map
   * 
   * @param nightMap - Night texture
   */
  setNightMap(nightMap: THREE.Texture): void {
    if (this._isDisposed) return
    
    this._material.emissiveMap = nightMap
    this._material.emissive = new THREE.Color(0xffcc88)
    this._material.emissiveIntensity = 1
    this._material.needsUpdate = true
  }

  /**
   * Set roughness
   * 
   * @param roughness - Roughness (0-1)
   */
  setRoughness(roughness: number): void {
    if (this._isDisposed) return
    
    this._material.roughness = clamp(roughness, 0, 1)
  }

  /**
   * Set metalness
   * 
   * @param metalness - Metalness (0-1)
   */
  setMetalness(metalness: number): void {
    if (this._isDisposed) return
    
    this._material.metalness = clamp(metalness, 0, 1)
  }

  /**
   * Get interpolated color for current pollution
   * 
   * @returns Hex color string
   */
  getColorHex(): string {
    return '#' + this._currentColor.getHexString()
  }

  /**
   * Clone material
   * 
   * @returns New EarthMaterial instance
   */
  clone(): EarthMaterial {
    const cloned = new EarthMaterial({
      pollutionLevel: this._pollutionLevel,
      roughness: this._material.roughness,
      metalness: this._material.metalness,
      enableEmissive: this._enableEmissive,
    })
    
    // Copy textures
    if (this._material.map) {
      cloned._material.map = this._material.map
    }
    if (this._material.normalMap) {
      cloned._material.normalMap = this._material.normalMap
    }
    if (this._material.emissiveMap) {
      cloned._material.emissiveMap = this._material.emissiveMap
    }
    
    return cloned
  }

  /**
   * Dispose material
   */
  dispose(): void {
    if (this._isDisposed) return
    
    this._material.dispose()
    this._isDisposed = true
  }

  // PRIVATE METHODS
  /**
   * Update emissive (night lights) based on pollution
   * 
   * CRITICAL: City lights dim dramatically with pollution
   * - Clean (0%): Full brightness 1.0 - cities sparkle at night
   * - Moderate (50%): Reduced to 0.5 - smog starting to block light
   * - Severe (100%): Dim 0.1 - barely visible through thick smog
   */
  private updateEmissive(pollutionWeight: number): void {
    // Exponential dimming - faster at higher pollution
    const curve = Math.pow(pollutionWeight, 0.7)  // Slightly faster than linear
    const emissiveIntensity = lerp(this._baseEmissiveIntensity, 0.1, curve)
    this._material.emissiveIntensity = emissiveIntensity
    
    // Also shift emissive color from warm city lights to dim red (dying cities)
    const warmCityLight = new THREE.Color(0xffcc88)  // Warm yellow
    const dyingCityLight = new THREE.Color(0x553311) // Dim brown-red
    const emissiveColor = new THREE.Color()
    emissiveColor.lerpColors(warmCityLight, dyingCityLight, pollutionWeight)
    this._material.emissive = emissiveColor
  }

  /**
   * Update material properties based on pollution
   * 
   * Surface degradation:
   * - Roughness increases (shiny oceans → matte dead surface)
   * - Normal scale decreases (terrain flattens, looks dead)
   */
  private updateMaterialProperties(pollutionWeight: number, severeWeight: number = 0): void {
    // ROUGHNESS
    // Clean: Ocean shiny (0.3), land matte (0.7)
    // Polluted: Everything becomes rough matte (0.95)
    const baseRoughness = EARTH_MATERIAL.roughness
    this._material.roughness = lerp(baseRoughness, 0.95, pollutionWeight * 0.7)
    
    //  METALNESS
    // Slight increase for that "oily pollution" look at severe levels
    this._material.metalness = lerp(0, 0.1, severeWeight)
    
    // NORMAL MAP SCALE
    // Terrain detail fades as pollution covers everything
    const normalStrength = lerp(0.8, 0.2, pollutionWeight)
    this._material.normalScale.set(normalStrength, normalStrength)
  }
}
