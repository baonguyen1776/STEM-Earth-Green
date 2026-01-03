/**
 * Atmosphere Shader Material
 * 
 * Custom atmosphere with pollution-based glow effects
 * Clean: Bright blue glow
 * Polluted: Brown/gray smoggy atmosphere
 * 
 * @module earth/AtmosphereShaderMaterial
 */

import * as THREE from 'three'
import { lerp, clamp } from '../utils/math'

/**
 * Atmosphere Vertex Shader
 */
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/**
 * Atmosphere Fragment Shader - Cinematic Glow
 */
const atmosphereFragmentShader = `
  uniform vec3 glowColor;
  uniform float glowIntensity;
  uniform float pollutionLevel;
  uniform vec3 lightDirection;
  uniform vec3 pollutionColor;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
  void main() {
    // Calculate fresnel effect (rim lighting)
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = 1.0 - abs(dot(viewDirection, vNormal));
    
    // Enhance fresnel for more dramatic glow
    fresnel = pow(fresnel, 1.5);
    
    // === COLOR BLENDING BASED ON POLLUTION ===
    // Clean atmosphere: bright blue
    vec3 cleanAtmosphere = vec3(0.3, 0.7, 1.0);
    // Polluted atmosphere: brown/gray smog
    vec3 pollutedAtmosphere = vec3(0.6, 0.4, 0.2);
    
    // Blend colors based on pollution level
    vec3 atmosphereColor = mix(cleanAtmosphere, pollutedAtmosphere, pollutionLevel);
    
    // === SUNLIGHT SCATTERING ===
    // Calculate scattering based on light direction
    float lightScatter = max(dot(vNormal, lightDirection), 0.0);
    lightScatter = pow(lightScatter, 2.0);
    
    // At high pollution, reduce scattering (smog blocks light)
    lightScatter *= (1.0 - pollutionLevel * 0.7);
    
    // === FINAL GLOW CALCULATION ===
    float finalIntensity = glowIntensity * fresnel;
    
    // Add scattering contribution
    finalIntensity += lightScatter * 0.3;
    
    // At extreme pollution (>80%), add orange/brown glow from smog
    if (pollutionLevel > 0.8) {
      float smogGlow = (pollutionLevel - 0.8) * 5.0; // Intense glow
      vec3 smogColor = vec3(0.8, 0.4, 0.1); // Orange/brown
      atmosphereColor = mix(atmosphereColor, smogColor, smogGlow * 0.5);
      finalIntensity += smogGlow * 0.3;
    }
    
    vec3 finalColor = atmosphereColor * finalIntensity;
    
    // Alpha based on intensity (softer edges)
    float alpha = finalIntensity * 0.6;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

/**
 * Atmosphere Shader Material Options
 */
export interface AtmosphereShaderMaterialOptions {
  /** Base glow color (for clean atmosphere) */
  glowColor?: THREE.Color
  
  /** Glow intensity multiplier */
  glowIntensity?: number
  
  /** Current pollution level (0-100) */
  pollutionLevel?: number
  
  /** Light direction (sun position) */
  lightDirection?: THREE.Vector3
  
  /** Pollution tint color */
  pollutionColor?: THREE.Color
}

/**
 * Atmosphere Shader Material Class
 */
export class AtmosphereShaderMaterial {
  private _material: THREE.ShaderMaterial
  private _pollutionLevel: number = 0
  private _isDisposed: boolean = false

  constructor(options: AtmosphereShaderMaterialOptions = {}) {
    this._pollutionLevel = options.pollutionLevel ?? 0
    
    this._material = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        glowColor: { value: options.glowColor ?? new THREE.Color(0x4da6ff) },
        glowIntensity: { value: options.glowIntensity ?? 1.0 },
        pollutionLevel: { value: this._pollutionLevel / 100 },
        lightDirection: { value: options.lightDirection ?? new THREE.Vector3(1, 0.3, 0.5).normalize() },
        pollutionColor: { value: options.pollutionColor ?? new THREE.Color(0x664422) },
      },
      transparent: true,
      side: THREE.BackSide, // Important: render from inside
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }

  // GETTERS
  get material(): THREE.ShaderMaterial {
    return this._material
  }

  get pollutionLevel(): number {
    return this._pollutionLevel
  }

  get isDisposed(): boolean {
    return this._isDisposed
  }

  // METHODS
  /**
   * Set pollution level - affects atmosphere color and glow
   */
  setPollutionLevel(level: number): void {
    if (this._isDisposed) return
    
    this._pollutionLevel = clamp(level, 0, 100)
    this._material.uniforms.pollutionLevel.value = this._pollutionLevel / 100
    
    // Adjust glow intensity based on pollution
    // Clean: bright glow, Polluted: dimmer but more orange
    const baseIntensity = lerp(1.2, 0.8, this._pollutionLevel / 100)
    this._material.uniforms.glowIntensity.value = baseIntensity
  }

  /**
   * Set light direction (sun position)
   */
  setLightDirection(direction: THREE.Vector3): void {
    if (this._isDisposed) return
    this._material.uniforms.lightDirection.value.copy(direction).normalize()
  }

  /**
   * Set glow color
   */
  setGlowColor(color: THREE.Color): void {
    if (this._isDisposed) return
    this._material.uniforms.glowColor.value.copy(color)
  }

  /**
   * Set glow intensity
   */
  setGlowIntensity(intensity: number): void {
    if (this._isDisposed) return
    this._material.uniforms.glowIntensity.value = Math.max(0, intensity)
  }

  /**
   * Dispose material
   */
  dispose(): void {
    if (this._isDisposed) return
    this._material.dispose()
    this._isDisposed = true
  }
}