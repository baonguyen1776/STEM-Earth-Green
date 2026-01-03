/**
 * Earth Module - Advanced Pollution System
 * 
 * Barrel export cho Earth visualization components với shader-based pollution
 * 
 * @module earth
 * 
 * Usage:
 * ```typescript
 * import { 
 *   Earth, EarthTextures, EarthShaderMaterial, 
 *   CloudLayer, CloudShaderMaterial,
 *   AtmosphereShaderMaterial, PollutionController 
 * } from './earth'
 * 
 * const pollutionController = new PollutionController()
 * const earth = new Earth({ pollutionLevel: 0 })
 * await earth.loadTextures()
 * scene.add(earth.group)
 * ```
 */

// Main Earth class
export { Earth } from './Earth'
export type { EarthOptions } from './Earth'

// Shader Materials (Advanced)
export { EarthShaderMaterial } from './EarthShaderMaterial'
export type { EarthShaderMaterialOptions } from './EarthShaderMaterial'

export { CloudShaderMaterial } from './CloudShaderMaterial'
export type { CloudShaderMaterialOptions } from './CloudShaderMaterial'

export { AtmosphereShaderMaterial } from './AtmosphereShaderMaterial'
export type { AtmosphereShaderMaterialOptions } from './AtmosphereShaderMaterial'

// Pollution System
export { PollutionController } from './PollutionController'
export type { PollutionControllerOptions } from './PollutionController'

// Material (Legacy)
export { EarthMaterial } from './EarthMaterial'
export type { EarthMaterialOptions } from './EarthMaterial'

// Textures
export {
  EarthTextures,
  getSharedTextures,
  disposeSharedTextures,
} from './EarthTextures'
export type {
  EarthTextureSet,
  TextureLoadProgress,
  TextureLoadCallback,
} from './EarthTextures'

// Cloud Layer
export { CloudLayer } from './CloudLayer'
export type { CloudLayerOptions } from './CloudLayer'

// Atmosphere
export { Atmosphere } from './Atmosphere'
export type { AtmosphereOptions } from './Atmosphere'
