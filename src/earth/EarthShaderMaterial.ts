/**
 * Earth Shader Material
 * 
 * Custom shader với hiệu ứng ngày/đêm realistic
 * Khi Trái Đất xoay, phần hướng về mặt trời hiện dayMap,
 * phần tối hiện nightMap với city lights
 * 
 * @module earth/EarthShaderMaterial
 */

import * as THREE from 'three'
import { lerp, clamp } from '../utils/math'

/**
 * Vertex Shader
 * 
 * Tính toán vị trí và truyền normal, UV cho fragment shader
 */
const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldNormal;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/**
 * Fragment Shader - Advanced Earth with Camera-Facing Light
 * 
 * Features:
 * - Light follows camera direction (front-facing areas are bright)
 * - High overall brightness
 * - Pollution texture blending
 * - Sharp specular on oceans
 */
const earthFragmentShader = `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D normalMap;
  uniform sampler2D specularMap;
  uniform sampler2D cloudsMap;
  
  // Pollution texture blending
  uniform sampler2D pollutedDayMap;
  
  uniform vec3 lightDirection;
  uniform vec3 lightColor;
  uniform float ambientIntensity;
  uniform float pollutionLevel; // 0-1 (0-100 scaled)
  uniform vec3 pollutionTint;
  uniform float nightLightIntensity;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldNormal;
  
  void main() {
    // === TEXTURE SAMPLING ===
    vec4 cleanDayColor = texture2D(dayMap, vUv);
    vec4 nightColor = texture2D(nightMap, vUv);
    vec4 specularSample = texture2D(specularMap, vUv);
    
    // Sample pollution texture (fallback to synthetic if not available)
    vec4 pollutedDayColor = texture2D(pollutedDayMap, vUv);
    if (pollutedDayColor.a < 0.01) {
      vec3 desaturated = vec3(dot(cleanDayColor.rgb, vec3(0.3, 0.59, 0.11)));
      vec3 brownTint = vec3(0.6, 0.5, 0.4);
      pollutedDayColor = vec4(mix(desaturated, brownTint, 0.5), 1.0);
    }
    
    // Blend based on pollution level
    float pollutionFactor = pollutionLevel;
    vec4 blendedDayColor = mix(cleanDayColor, pollutedDayColor, pollutionFactor);
    
    // === CAMERA-FACING LIGHTING ===
    // View direction from camera
    vec3 viewDir = normalize(-vPosition);
    
    // Light intensity based on facing camera (front = bright)
    float lightIntensity = dot(vNormal, viewDir);
    
    // Also consider sun direction for day/night
    float sunIntensity = dot(vWorldNormal, lightDirection);
    
    // Combine: front-facing is always lit, plus sun adds more
    float combinedLight = max(lightIntensity * 0.7, 0.0) + max(sunIntensity * 0.5, 0.0);
    combinedLight = clamp(combinedLight, 0.0, 1.0);
    
    // Day/night based on sun position
    float dayFactor = smoothstep(-0.2, 0.3, sunIntensity);
    
    // === BRIGHT DAYLIGHT SHADING ===
    vec3 dayResult = blendedDayColor.rgb;
    
    // High ambient + strong diffuse for bright appearance
    float brightAmbient = ambientIntensity * 1.5;
    dayResult *= brightAmbient + combinedLight * 1.8;
    
    // === SPECULAR HIGHLIGHTS (Ocean sparkle) ===
    vec3 halfDir = normalize(lightDirection + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 64.0);
    
    float isOcean = specularSample.r;
    float specularStrength = isOcean * (1.0 - pollutionFactor * 0.6);
    dayResult += spec * specularStrength * 1.2 * lightColor;
    
    // === NIGHT SIDE ===
    vec3 nightResult = nightColor.rgb;
    float cityBrightness = nightLightIntensity * (1.0 - pollutionFactor * 0.7);
    nightResult *= cityBrightness;
    nightResult += blendedDayColor.rgb * 0.05;
    
    // === BLEND DAY/NIGHT ===
    vec3 finalColor = mix(nightResult, dayResult, dayFactor);
    
    // === RIM LIGHTING ===
    float rimFactor = 1.0 - max(dot(viewDir, vNormal), 0.0);
    rimFactor = pow(rimFactor, 2.5);
    vec3 rimColor = mix(vec3(0.4, 0.6, 1.0), vec3(0.5, 0.4, 0.3), pollutionFactor);
    finalColor += rimColor * rimFactor * 0.25 * dayFactor;
    
    // === POLLUTION TINTING ===
    if (pollutionFactor > 0.3) {
      vec3 smogOverlay = vec3(0.75, 0.6, 0.45);
      float smogIntensity = (pollutionFactor - 0.3) * 0.4;
      finalColor = mix(finalColor, finalColor * smogOverlay, smogIntensity);
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

/**
 * Earth Shader Material Options - Extended for pollution blending
 */
export interface EarthShaderMaterialOptions {
  /** Day texture (clean) */
  dayMap?: THREE.Texture
  
  /** Night texture (city lights) */
  nightMap?: THREE.Texture
  
  /** Polluted day texture */
  pollutedDayMap?: THREE.Texture
  
  /** Normal map */
  normalMap?: THREE.Texture
  
  /** Specular map */
  specularMap?: THREE.Texture
  
  /** Clouds map */
  cloudsMap?: THREE.Texture
  
  /** Initial pollution level (0-100) */
  pollutionLevel?: number
  
  /** Light direction (normalized) */
  lightDirection?: THREE.Vector3
}

/**
 * Earth Shader Material Class
 * 
 * Creates realistic day/night Earth rendering
 */
export class EarthShaderMaterial {
  private _material: THREE.ShaderMaterial
  private _pollutionLevel: number = 0
  private _lightDirection: THREE.Vector3
  private _isDisposed: boolean = false

  constructor(options: EarthShaderMaterialOptions = {}) {
    this._pollutionLevel = options.pollutionLevel ?? 0
    this._lightDirection = options.lightDirection ?? new THREE.Vector3(1, 0.3, 0.5).normalize()
    
    // Create shader material
    this._material = new THREE.ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
      uniforms: {
        dayMap: { value: options.dayMap ?? null },
        nightMap: { value: options.nightMap ?? null },
        normalMap: { value: options.normalMap ?? null },
        specularMap: { value: options.specularMap ?? null },
        cloudsMap: { value: options.cloudsMap ?? null },
        
        // Pollution texture uniforms
        pollutedDayMap: { value: options.pollutedDayMap ?? null },
        
        lightDirection: { value: this._lightDirection },
        lightColor: { value: new THREE.Color(0xffffff) },  // Pure white sunlight
        ambientIntensity: { value: 0.25 },  // Lower for cinematic contrast
        pollutionLevel: { value: this._pollutionLevel / 100 },  // Convert 0-100 to 0-1
        pollutionTint: { value: new THREE.Color(0x4a3828) },
        nightLightIntensity: { value: 1.5 },
      },
      side: THREE.FrontSide,
    })
    
    this.setPollutionLevel(this._pollutionLevel)
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

  // PUBLIC METHODS
  /**
   * Set pollution level - NEW: texture blending approach
   */
  setPollutionLevel(level: number): void {
    if (this._isDisposed) return
    
    this._pollutionLevel = clamp(level, 0, 100)
    // Pass as 0-1 to shader
    this._material.uniforms.pollutionLevel.value = this._pollutionLevel / 100
    
    // Night light intensity decreases with pollution (smog blocks light)
    // 1.5 at clean -> 0.2 at max pollution
    const nightIntensity = lerp(1.5, 0.2, this._pollutionLevel / 100)
    this._material.uniforms.nightLightIntensity.value = nightIntensity
    
    // Ambient intensity decreases with pollution for cinematic contrast
    const ambientIntensity = lerp(0.25, 0.15, this._pollutionLevel / 100)
    this._material.uniforms.ambientIntensity.value = ambientIntensity
  }

  /**
   * Set light direction (sun position)
   */
  setLightDirection(direction: THREE.Vector3): void {
    if (this._isDisposed) return
    this._lightDirection.copy(direction).normalize()
    this._material.uniforms.lightDirection.value = this._lightDirection
  }

  /**
   * Apply textures - Extended for pollution blending
   */
  setTextures(textures: {
    dayMap?: THREE.Texture
    nightMap?: THREE.Texture
    normalMap?: THREE.Texture
    specularMap?: THREE.Texture
    cloudsMap?: THREE.Texture
    pollutedDayMap?: THREE.Texture
  }): void {
    if (this._isDisposed) return

    if (textures.dayMap) {
      this._material.uniforms.dayMap.value = textures.dayMap
    }
    if (textures.nightMap) {
      this._material.uniforms.nightMap.value = textures.nightMap
    }
    if (textures.normalMap) {
      this._material.uniforms.normalMap.value = textures.normalMap
    }
    if (textures.specularMap) {
      this._material.uniforms.specularMap.value = textures.specularMap
    }
    if (textures.cloudsMap) {
      this._material.uniforms.cloudsMap.value = textures.cloudsMap
    }
    // NEW: Pollution texture support
    if (textures.pollutedDayMap) {
      this._material.uniforms.pollutedDayMap.value = textures.pollutedDayMap
    }
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
