/**
 * Config Module
 * 
 * Barrel export cho tất cả configuration
 * 
 * @module config
 * 
 * Usage:
 * ```typescript
 * import { CAMERA_CONFIG, EARTH_CONFIG, COLORS, POLLUTION_THRESHOLDS } from './config'
 * ```
 */

// Camera configuration
export {
  CAMERA_CONFIG,
  CAMERA_PERSPECTIVE,
  CAMERA_POSITION,
  CAMERA_INTRO_POSITION,
  ORBIT_CONTROLS,
  CAMERA_ANIMATION,
  calculateCameraDistance,
  getAspectRatio,
} from './camera'

// Color palette
export {
  COLORS,
  EARTH_COLORS,
  OCEAN_COLORS,
  ATMOSPHERE_COLORS,
  EFFECT_COLORS,
  STARFIELD_COLORS,
  UI_COLORS,
  LIGHT_COLORS,
} from './colors'

// Earth configuration
export {
  EARTH_CONFIG,
  EARTH_GEOMETRY,
  EARTH_ANIMATION,
  EARTH_POSITION,
  EARTH_MATERIAL,
  EARTH_ASSETS,
  EARTH_CLOUDS,
} from './earthConfig'

// Pollution thresholds
export {
  PollutionLevel,
  POLLUTION_THRESHOLDS,
  POLLUTION_EFFECTS,
  getPollutionLevelFromValue,
  getThresholdInfo,
  normalizePollutionValue,
} from './pollutionThresholds'

// Types
export type { PollutionLevel as PollutionLevelType } from './pollutionThresholds'
export type { PollutionThresholds } from './pollutionThresholds'
