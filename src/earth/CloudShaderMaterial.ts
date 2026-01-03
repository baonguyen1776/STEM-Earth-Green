/**
 * Cloud Shader Material
 * 
 * Cloud layer với texture blending cho pollution effects
 * Clean white clouds → Dark polluted smog
 * 
 * @module earth/CloudShaderMaterial
 */

import * as THREE from 'three'
import { lerp, clamp } from '../utils/math'

/**
 * Cloud Vertex Shader
 */
const cloudVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/**
 * Cloud Fragment Shader - Pollution Blending
 */
const cloudFragmentShader = `
  uniform sampler2D cleanCloudMap;
  uniform sampler2D pollutedCloudMap;
  uniform float pollutionLevel;
  uniform float opacity;
  uniform vec3 lightDirection;
  uniform vec3 cloudTint;
  uniform vec3 smogTint;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  void main() {
    // Sample both cloud textures
    vec4 cleanClouds = texture2D(cleanCloudMap, vUv);
    vec4 pollutedClouds = texture2D(pollutedCloudMap, vUv);
    
    // Blend based on pollution level
    vec4 blendedClouds = mix(cleanClouds, pollutedClouds, pollutionLevel);
    
    // === LIGHTING ===
    // Calculate lighting based on sun direction
    float lightIntensity = max(dot(vNormal, lightDirection), 0.0);
    lightIntensity = pow(lightIntensity, 0.7); // Softer lighting for clouds
    
    // === COLOR TINTING ===
    vec3 finalColor = blendedClouds.rgb;
    
    // Clean clouds: keep white/bright
    // Polluted clouds: dark brown/black tint
    vec3 colorTint = mix(cloudTint, smogTint, pollutionLevel);
    finalColor *= colorTint;
    
    // Apply lighting
    finalColor *= (0.5 + lightIntensity * 0.5);
    
    // === ALPHA/OPACITY ===
    float finalAlpha = blendedClouds.a * opacity;
    
    // At high pollution, increase opacity to create smothering effect
    if (pollutionLevel > 0.7) {
      float smogDensity = (pollutionLevel - 0.7) * 2.0; // 0-0.6 range
      finalAlpha = mix(finalAlpha, finalAlpha * 1.5, smogDensity);
    }
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`

/**
 * Cloud Shader Material Options
 */
export interface CloudShaderMaterialOptions {
  /** Clean cloud texture */
  cleanCloudMap?: THREE.Texture
  
  /** Polluted cloud texture */
  pollutedCloudMap?: THREE.Texture
  
  /** Base opacity */
  opacity?: number
  
  /** Pollution level (0-100) */
  pollutionLevel?: number
  
  /** Light direction */
  lightDirection?: THREE.Vector3
  
  /** Clean cloud tint */
  cloudTint?: THREE.Color
  
  /** Smog/pollution tint */
  smogTint?: THREE.Color
}

/**
 * Cloud Shader Material Class
 */
export class CloudShaderMaterial {
  private _material: THREE.ShaderMaterial
  private _pollutionLevel: number = 0
  private _opacity: number = 0.4
  private _isDisposed: boolean = false

  constructor(options: CloudShaderMaterialOptions = {}) {
    this._pollutionLevel = options.pollutionLevel ?? 0
    this._opacity = options.opacity ?? 0.4
    
    this._material = new THREE.ShaderMaterial({
      vertexShader: cloudVertexShader,
      fragmentShader: cloudFragmentShader,
      uniforms: {
        cleanCloudMap: { value: options.cleanCloudMap ?? null },
        pollutedCloudMap: { value: options.pollutedCloudMap ?? null },
        pollutionLevel: { value: this._pollutionLevel / 100 },
        opacity: { value: this._opacity },
        lightDirection: { value: options.lightDirection ?? new THREE.Vector3(1, 0.3, 0.5).normalize() },
        cloudTint: { value: options.cloudTint ?? new THREE.Color(0xffffff) },
        smogTint: { value: options.smogTint ?? new THREE.Color(0x2d1810) }, // Dark brown
      },
      transparent: true,
      side: THREE.FrontSide,
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

  get opacity(): number {
    return this._opacity
  }

  get isDisposed(): boolean {
    return this._isDisposed
  }

  // METHODS
  /**
   * Set pollution level - affects cloud color and density
   */
  setPollutionLevel(level: number): void {
    if (this._isDisposed) return
    
    this._pollutionLevel = clamp(level, 0, 100)
    this._material.uniforms.pollutionLevel.value = this._pollutionLevel / 100
    
    // At extreme pollution, dramatically increase opacity
    const baseOpacity = 0.4
    const maxOpacity = 0.85 // Nearly opaque at 100%
    const currentOpacity = lerp(baseOpacity, maxOpacity, this._pollutionLevel / 100)
    
    this._opacity = currentOpacity
    this._material.uniforms.opacity.value = this._opacity
  }

  /**
   * Set textures
   */
  setTextures(textures: {
    cleanCloudMap?: THREE.Texture
    pollutedCloudMap?: THREE.Texture
  }): void {
    if (this._isDisposed) return

    if (textures.cleanCloudMap) {
      this._material.uniforms.cleanCloudMap.value = textures.cleanCloudMap
    }
    if (textures.pollutedCloudMap) {
      this._material.uniforms.pollutedCloudMap.value = textures.pollutedCloudMap
    }
  }

  /**
   * Set light direction
   */
  setLightDirection(direction: THREE.Vector3): void {
    if (this._isDisposed) return
    this._material.uniforms.lightDirection.value.copy(direction).normalize()
  }

  /**
   * Set base opacity
   */
  setOpacity(opacity: number): void {
    if (this._isDisposed) return
    this._opacity = clamp(opacity, 0, 1)
    this._material.uniforms.opacity.value = this._opacity
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