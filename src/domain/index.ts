/**
 * Domain Module
 * 
 * Barrel export cho business logic (models và services)
 * 
 * @module domain
 * 
 * Usage:
 * ```typescript
 * import { EarthState, PollutionService, getPollutionInfo } from './domain'
 * ```
 */

// Models
export { EarthState } from './models/earthState'
export type { EarthStateChangeEvent, EarthStateChangeListener } from './models/earthState'

export {
  getPollutionInfo,
  comparePollution,
  isPollutionLevelChanged,
  getPollutionSeverity,
  getPollutionColorWeight,
  getPollutionTrend,
  calculatePollutionDelta,
  formatPollutionValue,
  validatePollutionValue,
  getRecommendedActions,
  PollutionLevel,
} from './models/pollutionLevel'
export type { PollutionLevelInfo, PollutionLevelEnum } from './models/pollutionLevel'

// Services
export { PollutionService } from './services/pollutionService'
export type { PollutionEffectsValues } from './services/pollutionService'
