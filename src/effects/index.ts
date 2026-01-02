/**
 * Effects Module
 * 
 * Barrel export cho visual effects
 * 
 * @module effects
 * 
 * Usage:
 * ```typescript
 * import { Starfield, SmokeSystem, TrashSystem } from './effects'
 * 
 * const stars = new Starfield({ count: 5000 })
 * const smoke = new SmokeSystem({ pollutionLevel: 0 })
 * const trash = new TrashSystem({ pollutionLevel: 0 })
 * ```
 */

// Starfield
export { Starfield } from './Starfield'
export type { StarfieldOptions } from './Starfield'

// Smoke System
export { SmokeSystem } from './SmokeSystem'
export type { SmokeSystemOptions } from './SmokeSystem'

// Trash System
export { TrashSystem } from './TrashSystem'
export type { TrashSystemOptions } from './TrashSystem'
