/**
 * Atmosphere
 * 
 * Atmospheric glow effect cho Earth với pollution-based visual impact
 * 
 * @module earth/Atmosphere
 * 
 * Design principles:
 * - Fresnel-based glow effect
 * - Rim lighting cho depth
 * - DRAMATIC pollution effects - atmosphere chuyển từ xanh lam sang xám nâu độc hại
 * - Ở 100%, hào quang dày đặc che mờ Trái Đất
 */

import * as THREE from 'three'
import { EARTH_GEOMETRY } from '../config/earthConfig'
import { COLORS } from '../config/colors'
import { clamp, lerp } from '../utils/math'

/**
 * Atmosphere Options
 */
export interface AtmosphereOptions {
  /** Initial pollution level (0-100) */
  pollutionLevel?: number
  
  /** Atmosphere thickness multiplier (default: 1.12) */
  thickness?: number
  
  /** Glow intensity (default: 0.8) */
  intensity?: number
}

/**
 * Advanced Atmosphere Vertex Shader
 * 
 * Fresnel effect với depth-based calculations
 */
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  varying float vIntensity;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vPositionNormal = normalize(mvPosition.xyz);
    
    // Pre-calculate fresnel intensity in vertex shader for smooth gradients
    float rawFresnel = 1.0 - abs(dot(vNormal, -vPositionNormal));
    vIntensity = rawFresnel;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`

/**
 * Advanced Atmosphere Fragment Shader
 * 
 * Multi-layer glow với pollution-based thickness và opacity
 */
const atmosphereFragmentShader = `
  uniform vec3 glowColor;
  uniform vec3 innerColor;
  uniform float intensity;
  uniform float power;
  uniform float thickness;
  uniform float pollutionLevel;
  
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  varying float vIntensity;
  
  void main() {
    // Multi-power fresnel cho layered glow effect
    float fresnel = pow(vIntensity, power);
    float innerFresnel = pow(vIntensity, power * 0.5);
    
    // Outer glow - main atmosphere color
    vec3 outerGlow = glowColor * fresnel * intensity;
    
    // Inner glow - brighter edge
    vec3 innerGlow = innerColor * innerFresnel * intensity * 0.5;
    
    // Combine layers
    vec3 finalColor = outerGlow + innerGlow;
    
    // Alpha calculation - pollution increases opacity dramatically
    float baseAlpha = fresnel * intensity;
    float pollutionAlpha = pollutionLevel * 0.008; // Extra opacity from pollution
    float thicknessBoost = thickness * 0.3;
    
    // At high pollution, atmosphere becomes thick smog that obscures Earth
    float alpha = clamp(baseAlpha + pollutionAlpha + thicknessBoost, 0.0, 0.95);
    
    // Pollution adds a murky overlay
    if (pollutionLevel > 50.0) {
      float smogFactor = (pollutionLevel - 50.0) / 50.0;
      finalColor = mix(finalColor, glowColor * 0.3, smogFactor * 0.5);
      alpha = mix(alpha, 0.85, smogFactor * 0.6);
    }
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

/**
 * Atmosphere Class
 * 
 * Creates dramatic atmospheric glow effect around Earth
 * 
 * @example
 * ```typescript
 * const atmosphere = new Atmosphere({
 *   pollutionLevel: 0,
 *   intensity: 0.8,
 * })
 * 
 * scene.add(atmosphere.mesh)
 * 
 * // Update pollution - at 100%, atmosphere becomes toxic smog
 * atmosphere.setPollutionLevel(100)
 * ```
 */
export class Atmosphere {
  // PRIVATE PROPERTIES
  private _mesh: THREE.Mesh
  private _material: THREE.ShaderMaterial
  private _pollutionLevel: number = 0
  private _cleanColor: THREE.Color
  private _pollutedColor: THREE.Color
  private _baseIntensity: number
  private _baseThickness: number
  private _isDisposed: boolean = false

  // CONSTRUCTOR
  /**
   * Create new Atmosphere
   * 
   * @param options - Atmosphere options
   */
  constructor(options: AtmosphereOptions = {}) {
    // Config
    const radius = EARTH_GEOMETRY.radius
    this._baseThickness = options.thickness ?? 1.12
    const atmosphereRadius = radius * this._baseThickness
    const segments = EARTH_GEOMETRY.widthSegments
    this._baseIntensity = options.intensity ?? 0.8
    
    this._pollutionLevel = options.pollutionLevel ?? 0
    
    // Parse colors - DRAMATIC color shift
    this._cleanColor = new THREE.Color(COLORS.atmosphere.clean)  // Bright blue
    this._pollutedColor = new THREE.Color(COLORS.atmosphere.polluted) // Gray-brown toxic
    
    // Create geometry
    const geometry = new THREE.SphereGeometry(atmosphereRadius, segments, segments)
    
    // Create advanced shader material
    this._material = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        glowColor: { value: this._cleanColor.clone() },
        innerColor: { value: new THREE.Color(0x88ccff) },
        intensity: { value: this._baseIntensity },
        power: { value: 2.5 },
        thickness: { value: 0.0 },
        pollutionLevel: { value: 0.0 },
      },
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    
    // Create mesh
    this._mesh = new THREE.Mesh(geometry, this._material)
    this._mesh.name = 'atmosphere'
    
    // Apply initial pollution
    this.setPollutionLevel(this._pollutionLevel)
  }

  // PUBLIC GETTERS
  /**
   * Get atmosphere mesh
   */
  get mesh(): THREE.Mesh {
    return this._mesh
  }

  /**
   * Get atmosphere material
   */
  get material(): THREE.ShaderMaterial {
    return this._material
  }

  /**
   * Get pollution level
   */
  get pollutionLevel(): number {
    return this._pollutionLevel
  }

  /**
   * Check if disposed
   */
  get isDisposed(): boolean {
    return this._isDisposed
  }

  // PUBLIC METHODS
  /**
   * Set pollution level - DRAMATIC visual changes
   * 
   * 0%: Bright blue clean atmosphere
   * 50%: Starting to turn gray
   * 100%: Thick toxic smog obscuring Earth's surface
   * 
   * @param level - Pollution level (0-100)
   */
  setPollutionLevel(level: number): void {
    if (this._isDisposed) return
    
    this._pollutionLevel = clamp(level, 0, 100)
    const weight = this._pollutionLevel / 100
    
    // === COLOR SHIFT ===
    // Lerp từ xanh lam rực rỡ (#1e90ff) → xám nâu chì (#4a4a4a)
    const currentColor = new THREE.Color()
    currentColor.lerpColors(this._cleanColor, this._pollutedColor, weight)
    this._material.uniforms.glowColor.value = currentColor
    
    // Inner color also shifts
    const cleanInner = new THREE.Color(0x88ccff)
    const pollutedInner = new THREE.Color(0x3a3a3a)
    const innerColor = new THREE.Color()
    innerColor.lerpColors(cleanInner, pollutedInner, weight)
    this._material.uniforms.innerColor.value = innerColor
    
    // === INTENSITY - Glow becomes more prominent with pollution ===
    // Clean: subtle glow, Polluted: overwhelming smog
    const intensity = lerp(this._baseIntensity, this._baseIntensity * 1.8, weight)
    this._material.uniforms.intensity.value = intensity
    
    // === THICKNESS - Atmosphere gets thicker at high pollution ===
    const thicknessBoost = lerp(0, 1.0, Math.pow(weight, 1.5))
    this._material.uniforms.thickness.value = thicknessBoost
    
    // === FRESNEL POWER - Lower power = wider glow coverage ===
    const power = lerp(2.5, 1.5, weight)
    this._material.uniforms.power.value = power
    
    // === POLLUTION LEVEL for shader ===
    this._material.uniforms.pollutionLevel.value = this._pollutionLevel
    
    // === SCALE - Atmosphere expands at high pollution ===
    const scaleBoost = lerp(1.0, 1.15, Math.pow(weight, 2))
    this._mesh.scale.setScalar(scaleBoost)
    
    this._material.needsUpdate = true
  }

  /**
   * Set glow intensity
   * 
   * @param intensity - Intensity (0-2)
   */
  setIntensity(intensity: number): void {
    if (this._isDisposed) return
    
    this._material.uniforms.intensity.value = clamp(intensity, 0, 2)
  }

  /**
   * Set glow power (edge sharpness)
   * 
   * @param power - Power (1-10, higher = sharper edge)
   */
  setPower(power: number): void {
    if (this._isDisposed) return
    
    this._material.uniforms.power.value = clamp(power, 1, 10)
  }

  /**
   * Set glow color directly
   * 
   * @param color - Glow color
   */
  setColor(color: number | string | THREE.Color): void {
    if (this._isDisposed) return
    
    this._material.uniforms.glowColor.value = new THREE.Color(color)
  }

  /**
   * Show atmosphere
   */
  show(): void {
    this._mesh.visible = true
  }

  /**
   * Hide atmosphere
   */
  hide(): void {
    this._mesh.visible = false
  }

  /**
   * Toggle visibility
   * 
   * @returns New visibility state
   */
  toggle(): boolean {
    this._mesh.visible = !this._mesh.visible
    return this._mesh.visible
  }

  /**
   * Dispose atmosphere
   */
  dispose(): void {
    if (this._isDisposed) return
    
    this._mesh.geometry.dispose()
    this._material.dispose()
    
    this._isDisposed = true
  }
}
