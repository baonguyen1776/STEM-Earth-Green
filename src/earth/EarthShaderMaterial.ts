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
 * Fragment Shader
 * 
 * Blend dayMap và nightMap based on sun direction
 * - Phần hướng về lightDirection: hiện dayMap
 * - Phần tối (ngược lightDirection): hiện nightMap với city lights
 * - Terminator zone: smooth blend giữa 2 textures
 */
const earthFragmentShader = `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D normalMap;
  uniform sampler2D specularMap;
  uniform sampler2D cloudsMap;
  
  uniform vec3 lightDirection;
  uniform vec3 lightColor;
  uniform float ambientIntensity;
  uniform float pollutionLevel;
  uniform vec3 pollutionTint;
  uniform float nightLightIntensity;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldNormal;
  
  void main() {
    // Sample textures
    vec4 dayColor = texture2D(dayMap, vUv);
    vec4 nightColor = texture2D(nightMap, vUv);
    
    // Calculate light intensity based on angle to sun
    float lightIntensity = dot(vWorldNormal, lightDirection);
    
    // Create smooth terminator (day/night transition)
    // -0.2 to 0.2 creates a smooth twilight zone
    float dayFactor = smoothstep(-0.1, 0.3, lightIntensity);
    float nightFactor = 1.0 - dayFactor;
    
    // === DAY SIDE ===
    vec3 dayResult = dayColor.rgb;
    
    // Apply diffuse lighting to day side
    float diffuse = max(lightIntensity, 0.0);
    dayResult *= (ambientIntensity + diffuse * 0.8);
    
    // Specular highlight on water (if specular map available)
    vec3 viewDir = normalize(-vPosition);
    vec3 reflectDir = reflect(-lightDirection, vNormal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    dayResult += spec * 0.3 * lightColor;
    
    // === NIGHT SIDE ===
    vec3 nightResult = nightColor.rgb;
    
    // City lights glow - affected by pollution (smog blocks light)
    float cityLightBrightness = nightLightIntensity * (1.0 - pollutionLevel * 0.009);
    nightResult *= cityLightBrightness;
    
    // Add slight ambient to night side so it's not pure black
    nightResult += dayColor.rgb * 0.03;
    
    // === BLEND DAY AND NIGHT ===
    vec3 finalColor = mix(nightResult, dayResult, dayFactor);
    
    // === APPLY POLLUTION EFFECTS ===
    // Desaturation
    float gray = dot(finalColor, vec3(0.299, 0.587, 0.114));
    float desatAmount = pollutionLevel * 0.006;
    finalColor = mix(finalColor, vec3(gray), desatAmount);
    
    // Pollution tint overlay
    finalColor = mix(finalColor, pollutionTint, pollutionLevel * 0.004);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

/**
 * Earth Shader Material Options
 */
export interface EarthShaderMaterialOptions {
  /** Day texture */
  dayMap?: THREE.Texture
  
  /** Night texture (city lights) */
  nightMap?: THREE.Texture
  
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
        lightDirection: { value: this._lightDirection },
        lightColor: { value: new THREE.Color(0xfff5e6) },
        ambientIntensity: { value: 0.15 },
        pollutionLevel: { value: this._pollutionLevel },
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
   * Set pollution level - affects city lights and surface color
   */
  setPollutionLevel(level: number): void {
    if (this._isDisposed) return
    
    this._pollutionLevel = clamp(level, 0, 100)
    this._material.uniforms.pollutionLevel.value = this._pollutionLevel
    
    // Night light intensity decreases with pollution (smog blocks light)
    // 1.5 at clean -> 0.2 at max pollution
    const nightIntensity = lerp(1.5, 0.2, this._pollutionLevel / 100)
    this._material.uniforms.nightLightIntensity.value = nightIntensity
    
    // Pollution tint shifts from brown to gray-black at severe levels
    const brownTint = new THREE.Color(0x4a3828)
    const blackTint = new THREE.Color(0x1a1a1a)
    const tint = new THREE.Color()
    tint.lerpColors(brownTint, blackTint, this._pollutionLevel / 100)
    this._material.uniforms.pollutionTint.value = tint
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
   * Apply textures
   */
  setTextures(textures: {
    dayMap?: THREE.Texture
    nightMap?: THREE.Texture
    normalMap?: THREE.Texture
    specularMap?: THREE.Texture
    cloudsMap?: THREE.Texture
  }): void {
    if (this._isDisposed) return
    
    if (textures.dayMap) {
      textures.dayMap.colorSpace = THREE.SRGBColorSpace
      this._material.uniforms.dayMap.value = textures.dayMap
    }
    if (textures.nightMap) {
      textures.nightMap.colorSpace = THREE.SRGBColorSpace
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
