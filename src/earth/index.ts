/**
 * Earth Module
 * 
 * Barrel export cho Earth visualization components
 * 
 * @module earth
 * 
 * Usage:
 * ```typescript
 * import { Earth, EarthTextures, EarthMaterial, CloudLayer, Atmosphere } from './earth'
 * 
 * const earth = new Earth({ pollutionLevel: 0 })
 * await earth.loadTextures()
 * scene.add(earth.group)
 * ```
 */

// Main Earth class
export { Earth } from './Earth'
export type { EarthOptions } from './Earth'

// Material
export { EarthMaterial } from './EarthMaterial'
export type { EarthMaterialOptions } from './EarthMaterial'

// Shader Material (day/night effect)
export { EarthShaderMaterial } from './EarthShaderMaterial'
export type { EarthShaderMaterialOptions } from './EarthShaderMaterial'

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
