/**
 * Cloud Layer
 * 
 * Cloud/Smog sphere với DRAMATIC pollution transformation
 * Using advanced shader-based texture blending
 * 
 * @module earth/CloudLayer
 * 
 * Design principles:
 * - Clean: Light fluffy clouds
 * - Polluted: Dense toxic smog che lấp lục địa
 * - Ở 100%: Opacity 0.85+ che gần như toàn bộ bề mặt
 */

import * as THREE from 'three'
import { EARTH_GEOMETRY, EARTH_CLOUDS } from '../config/earthConfig'
import { clamp, lerp } from '../utils/math'

/**
 * Cloud Shader Material Options
 */
interface CloudShaderMaterialOptions {
  cleanCloudMap?: THREE.Texture
  pollutedCloudMap?: THREE.Texture
  opacity?: number
  pollutionLevel?: number
  lightDirection?: THREE.Vector3
  side?: THREE.Side
}

/**
 * Cloud Shader Material with Pollution Blending
 * IMPROVED: Better visibility and cinematic lighting
 */
class CloudShaderMaterial {
  private _material: THREE.ShaderMaterial
  private _pollutionLevel: number = 0

  constructor(options: CloudShaderMaterialOptions = {}) {
    this._pollutionLevel = clamp(options.pollutionLevel ?? 0, 0, 100)
    
    this._material = new THREE.ShaderMaterial({
      uniforms: {
        cleanCloudMap: { value: options.cleanCloudMap ?? null },
        pollutedCloudMap: { value: options.pollutedCloudMap ?? null },
        opacity: { value: options.opacity ?? 0.6 },  // Higher base opacity
        pollutionLevel: { value: this._pollutionLevel / 100 },
        lightDirection: { value: options.lightDirection ?? new THREE.Vector3(8, 5, 6).normalize() },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D cleanCloudMap;
        uniform sampler2D pollutedCloudMap;
        uniform float opacity;
        uniform float pollutionLevel;
        uniform vec3 lightDirection;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        
        void main() {
          // Sample cloud textures
          vec4 cleanClouds = texture2D(cleanCloudMap, vUv);
          vec4 pollutedClouds = texture2D(pollutedCloudMap, vUv);
          
          // Blend clean and polluted based on pollution level
          vec4 blendedClouds = mix(cleanClouds, pollutedClouds, pollutionLevel);
          
          // === CAMERA-FACING LIGHTING ===
          // Use view-based lighting (from camera direction)
          vec3 viewDir = normalize(-vNormal);
          float lightIntensity = dot(vWorldNormal, lightDirection);
          float dayFactor = smoothstep(-0.1, 0.5, lightIntensity);
          
          // Clouds are brighter overall
          vec3 cloudColor = blendedClouds.rgb;
          
          // Clean clouds: bright white
          // Polluted clouds: slightly dimmer
          vec3 cleanTint = vec3(1.0, 1.0, 1.0);
          vec3 pollutedTint = vec3(0.7, 0.65, 0.6);
          cloudColor *= mix(cleanTint, pollutedTint, pollutionLevel);
          
          // Apply lighting - high base brightness
          cloudColor *= (0.6 + dayFactor * 0.6);
          
          // === OPACITY - CLOUDS FADE WITH POLLUTION ===
          // Base cloud alpha from texture
          float cloudAlpha = blendedClouds.a;
          
          // Boost visibility for clean clouds
          cloudAlpha = pow(cloudAlpha, 0.6);
          
          // === KEY CHANGE: Clouds DISAPPEAR with pollution ===
          // At 0% pollution: full clouds
          // At 100% pollution: no clouds (all burned away/acid rain)
          float pollutionFade = 1.0 - pollutionLevel * 0.9;
          float finalOpacity = opacity * cloudAlpha * pollutionFade;
          
          // Ensure some visibility at low pollution
          finalOpacity = max(finalOpacity, 0.0);
          
          gl_FragColor = vec4(cloudColor, clamp(finalOpacity, 0.0, 0.8));
        }
      `,
      side: options.side ?? THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })
  }

  get material() { return this._material }

  setPollutionLevel(level: number): void {
    this._pollutionLevel = clamp(level, 0, 100)
    this._material.uniforms.pollutionLevel.value = this._pollutionLevel / 100
  }

  setOpacity(opacity: number): void {
    this._material.uniforms.opacity.value = opacity
  }

  setTextures(textures: { cleanCloudMap?: THREE.Texture; pollutedCloudMap?: THREE.Texture }): void {
    if (textures.cleanCloudMap) {
      this._material.uniforms.cleanCloudMap.value = textures.cleanCloudMap
    }
    if (textures.pollutedCloudMap) {
      this._material.uniforms.pollutedCloudMap.value = textures.pollutedCloudMap
    }
  }

  setLightDirection(direction: THREE.Vector3): void {
    this._material.uniforms.lightDirection.value = direction.normalize()
  }

  dispose(): void {
    this._material.dispose()
  }
}

/**
 * Cloud Layer Options
 */
export interface CloudLayerOptions {
  /** Clean cloud texture */
  cleanCloudTexture?: THREE.Texture
  
  /** Polluted cloud texture */
  pollutedCloudTexture?: THREE.Texture
  
  /** Initial opacity (default: 0.4) - lower for clean state */
  opacity?: number
  
  /** Initial pollution level (0-100) */
  pollutionLevel?: number
  
  /** Cloud layer offset from Earth (default: 0.02) */
  heightOffset?: number
  
  /** Light direction for shading */
  lightDirection?: THREE.Vector3
}

/**
 * Cloud Layer Class
 * 
 * Clean clouds → Toxic smog transformation
 * 
 * @example
 * ```typescript
 * const clouds = new CloudLayer({
 *   cloudTexture: textures.get('cloudsMap'),
 *   pollutionLevel: 0,
 * })
 * 
 * scene.add(clouds.mesh)
 * 
 * // At 100%, smog covers entire Earth
 * clouds.setPollutionLevel(100)
 * ```
 */
export class CloudLayer {
  // PRIVATE PROPERTIES
  private _mesh: THREE.Mesh
  private _material: CloudShaderMaterial
  private _pollutionLevel: number = 0
  private _baseOpacity: number
  private _rotationSpeed: number
  private _isDisposed: boolean = false

  // CONSTRUCTOR
  /**
   * Create new CloudLayer with shader-based pollution blending
   * 
   * @param options - Cloud layer options
   */
  constructor(options: CloudLayerOptions = {}) {
    // Config
    const radius = EARTH_GEOMETRY.radius
    const heightOffset = options.heightOffset ?? (EARTH_CLOUDS.radius - EARTH_GEOMETRY.radius)
    const cloudRadius = radius + heightOffset
    const segments = EARTH_GEOMETRY.widthSegments
    
    this._baseOpacity = options.opacity ?? 0.4  // Start with lighter clouds
    this._rotationSpeed = EARTH_CLOUDS.rotationSpeed
    this._pollutionLevel = options.pollutionLevel ?? 0
    
    // Create geometry
    const geometry = new THREE.SphereGeometry(cloudRadius, segments, segments)
    
    // Create shader material
    this._material = new CloudShaderMaterial({
      cleanCloudMap: options.cleanCloudTexture,
      pollutedCloudMap: options.pollutedCloudTexture,
      opacity: this._baseOpacity,
      pollutionLevel: this._pollutionLevel,
      lightDirection: options.lightDirection,
      side: THREE.DoubleSide,
    })
    
    // Create mesh
    this._mesh = new THREE.Mesh(geometry, this._material.material)
    this._mesh.name = 'clouds'
    
    // Apply initial pollution
    this.setPollutionLevel(this._pollutionLevel)
  }

  // PUBLIC GETTERS
  /**
   * Get cloud mesh
   */
  get mesh(): THREE.Mesh {
    return this._mesh
  }

  /**
   * Get cloud material
   */
  get material(): CloudShaderMaterial {
    return this._material
  }

  /**
   * Get current opacity
   */
  get opacity(): number {
    return this._material.material.uniforms.opacity.value
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
   * Update cloud rotation
   * 
   * @param deltaTime - Time since last frame (seconds)
   */
  update(deltaTime: number): void {
    if (this._isDisposed) return
    
    // Pollution slows down cloud movement (dense smog moves slower)
    const speedMultiplier = lerp(1.0, 0.3, this._pollutionLevel / 100)
    this._mesh.rotation.y += this._rotationSpeed * deltaTime * speedMultiplier
  }

  /**
   * Set pollution level - DRAMATIC TRANSFORMATION via Shader Blending
   * 
   * 0%: Light wispy clouds, low opacity
   * 50%: Gray thickening clouds
   * 80%+: Dark brown/black smog
   * 100%: Opacity 0.85 - almost complete coverage
   * 
   * @param level - Pollution level (0-100)
   */
  setPollutionLevel(level: number): void {
    if (this._isDisposed) return
    
    this._pollutionLevel = clamp(level, 0, 100)
    
    // Pass pollution level to shader for texture blending
    this._material.setPollutionLevel(this._pollutionLevel)
  }

  /**
   * Set textures for cloud blending
   */
  setTextures(textures: {
    cleanCloudMap?: THREE.Texture
    pollutedCloudMap?: THREE.Texture
  }): void {
    if (this._isDisposed) return
    this._material.setTextures(textures)
  }

  /**
   * Set light direction for shader
   */
  setLightDirection(direction: THREE.Vector3): void {
    if (this._isDisposed) return
    this._material.setLightDirection(direction)
  }

  /**
   * Set opacity directly
   * 
   * @param opacity - Opacity (0-1)
   */
  setOpacity(opacity: number): void {
    if (this._isDisposed) return
    this._material.setOpacity(opacity)
  }

  /**
   * Set rotation speed
   * 
   * @param speed - Rotation speed (radians per second)
   */
  setRotationSpeed(speed: number): void {
    this._rotationSpeed = speed
  }

  /**
   * Show clouds
   */
  show(): void {
    this._mesh.visible = true
  }

  /**
   * Hide clouds
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
   * Dispose cloud layer
   */
  dispose(): void {
    if (this._isDisposed) return
    
    this._mesh.geometry.dispose()
    this._material.dispose()
    
    this._isDisposed = true
  }
}
