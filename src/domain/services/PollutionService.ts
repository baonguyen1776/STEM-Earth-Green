/**
 * Pollution Calculator Service
 * 
 * Domain service để tính toán các giá trị dựa trên pollution level
 * 
 * @module domain/services/PollutionService
 * 
 * Design principles:
 * - Stateless: Chỉ tính toán, không lưu state
 * - Pure functions: Cùng input → cùng output
 * - Testable: Dễ dàng unit test
 * - Immutable: Không modify input
 */

import { mapRange, lerp, clamp } from '../../utils/math'
import { getPollutionInfo } from '../models/pollutionLevel'
import { COLORS } from '../../config/colors'

/**
 * Pollution Effects Values
 * 
 * Các giá trị effect đã tính toán từ pollution level
 */
export interface PollutionEffectsValues {
  /** Smoke opacity (0-1) */
  smokeOpacity: number

  /** Smoke particle count */
  smokeParticleCount: number

  /** Trash density (0-1) */
  trashDensity: number

  /** Trash piece count */
  trashPieceCount: number

  /** Ocean opacity (0-1) */
  oceanOpacity: number

  /** Atmosphere clarity (0-1, 1 = clear) */
  atmosphereClarity: number

  /** Color blend weight (0-1) */
  colorBlendWeight: number
}

/**
 * Pollution Service — Static service class
 * 
 * Cung cấp pure functions để tính toán effects dựa trên pollution level
 */
export class PollutionService {
  // =========================================================================
  // COLOR CALCULATIONS
  // =========================================================================

  /**
   * Tính trọng số blend màu Earth
   * 
   * @param pollutionLevel - Pollution level (0-100)
   * @returns Blend weight (0-1), 0 = clean, 1 = polluted
   * 
   * @example
   * ```typescript
   * const weight = PollutionService.calculateColorBlendWeight(50)
   * // 0.5 — nửa đường giữa xanh lành và xám ô nhiễm
   * 
   * earthMaterial.color.lerpColors(cleanColor, pollutedColor, weight)
   * ```
   */
  static calculateColorBlendWeight(pollutionLevel: number): number {
    const clamped = clamp(pollutionLevel, 0, 100)
    return clamped / 100
  }

  /**
   * Lấy màu hex nội suy giữa clean và polluted
   * 
   * @param pollutionLevel - Pollution level (0-100)
   * @returns Color hex string (e.g., "#8f8fa1")
   * 
   * @example
   * ```typescript
   * const color = PollutionService.getInterpolatedColor(50)
   * // "#8f8fa1" — giữa #1e90ff (clean) và #4a4a4a (polluted)
   * ```
   */
  static getInterpolatedColor(pollutionLevel: number): string {
    const weight = this.calculateColorBlendWeight(pollutionLevel)

    // Parse hex colors to RGB
    const cleanHex = COLORS.earth.clean.replace('#', '')
    const pollutedHex = COLORS.earth.polluted.replace('#', '')

    const cleanColor = parseInt(cleanHex, 16)
    const pollutedColor = parseInt(pollutedHex, 16)

    // Extract RGB components
    const cleanR = (cleanColor >> 16) & 255
    const cleanG = (cleanColor >> 8) & 255
    const cleanB = cleanColor & 255

    const pollutedR = (pollutedColor >> 16) & 255
    const pollutedG = (pollutedColor >> 8) & 255
    const pollutedB = pollutedColor & 255

    // Lerp each component
    const r = Math.round(lerp(cleanR, pollutedR, weight))
    const g = Math.round(lerp(cleanG, pollutedG, weight))
    const b = Math.round(lerp(cleanB, pollutedB, weight))

    // Convert back to hex
    const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
    return `#${hex}`
  }

  // =========================================================================
  // SMOKE CALCULATIONS
  // =========================================================================

  /**
   * Tính độ mờ khói ô nhiễm
   * 
   * Khói chỉ xuất hiện khi pollution > 50%
   * 
   * @param pollutionLevel - Pollution level (0-100)
   * @returns Opacity (0-1)
   * 
   * @example
   * ```typescript
   * PollutionService.calculateSmokeOpacity(30)   // 0 (chưa có khói)
   * PollutionService.calculateSmokeOpacity(75)   // ~0.5 (khói trung bình)
   * PollutionService.calculateSmokeOpacity(100)  // 0.8 (khói dày)
   * ```
   */
  static calculateSmokeOpacity(pollutionLevel: number): number {
    const clamped = clamp(pollutionLevel, 0, 100)

    // Smoke appears when pollution >= 50
    if (clamped < 50) {
      return 0
    }

    // Map 50-100 → 0-0.8
    return mapRange(clamped, 50, 100, 0, 0.8)
  }

  /**
   * Tính số lượng particle khói
   * 
   * @param pollutionLevel - Pollution level (0-100)
   * @param options - Cấu hình
   *   - maxParticles: Tối đa particles (default: 1000)
   * @returns Particle count
   * 
   * @example
   * ```typescript
   * PollutionService.calculateSmokeParticleCount(75)
   * // 500 (50% of 1000)
   * 
   * PollutionService.calculateSmokeParticleCount(75, { maxParticles: 2000 })
   * // 1000 (50% of 2000)
   * ```
   */
  static calculateSmokeParticleCount(
    pollutionLevel: number,
    options: { maxParticles?: number } = {}
  ): number {
    const { maxParticles = 1000 } = options
    const opacity = this.calculateSmokeOpacity(pollutionLevel)

    return Math.round(opacity * maxParticles)
  }

  // =========================================================================
  // TRASH CALCULATIONS
  // =========================================================================

  /**
   * Tính mật độ rác thải
   * 
   * @param pollutionLevel - Pollution level (0-100)
   * @returns Density (0-1)
   * 
   * @example
   * ```typescript
   * PollutionService.calculateTrashDensity(30)   // 0
   * PollutionService.calculateTrashDensity(65)   // 0.3
   * PollutionService.calculateTrashDensity(100)  // 1.0
   * ```
   */
  static calculateTrashDensity(pollutionLevel: number): number {
    const info = getPollutionInfo(pollutionLevel)
    const densityPercent = info.effects.trashDensity ?? 0
    return clamp(densityPercent / 100, 0, 1)
  }

  /**
   * Tính số lượng mảnh rác
   * 
   * @param pollutionLevel - Pollution level (0-100)
   * @param options - Cấu hình
   *   - maxPieces: Tối đa mảnh rác (default: 500)
   * @returns Trash piece count
   * 
   * @example
   * ```typescript
   * PollutionService.calculateTrashPieceCount(75)  // ~375
   * PollutionService.calculateTrashPieceCount(75, { maxPieces: 1000 })  // ~750
   * ```
   */
  static calculateTrashPieceCount(
    pollutionLevel: number,
    options: { maxPieces?: number } = {}
  ): number {
    const { maxPieces = 500 } = options
    const density = this.calculateTrashDensity(pollutionLevel)

    return Math.round(density * maxPieces)
  }

  // =========================================================================
  // OCEAN CALCULATIONS
  // =========================================================================

  /**
   * Tính độ mờ của đại dương
   * 
   * Đại dương càng mờ khi pollution càng cao
   * 
   * @param pollutionLevel - Pollution level (0-100)
   * @returns Opacity (0-1, 1 = clear)
   * 
   * @example
   * ```typescript
   * PollutionService.calculateOceanClarity(20)   // 0.8 (trong)
   * PollutionService.calculateOceanClarity(100)  // 0.0 (mờ hết)
   * ```
   */
  static calculateOceanClarity(pollutionLevel: number): number {
    const clamped = clamp(pollutionLevel, 0, 100)

    // Inverse của pollution: nếu pollution tăng → clarity giảm
    return 1 - (clamped / 100)
  }

  /**
   * Tính độ đục của đại dương
   * 
   * Ngược lại với clarity
   * 
   * @param pollutionLevel - Pollution level (0-100)
   * @returns Murkiness (0-1, 1 = very murky)
   * 
   * @example
   * ```typescript
   * PollutionService.calculateOceanMurkiness(100)  // 1.0 (đục hết)
   * ```
   */
  static calculateOceanMurkiness(pollutionLevel: number): number {
    return 1 - this.calculateOceanClarity(pollutionLevel)
  }

  // =========================================================================
  // ATMOSPHERE CALCULATIONS
  // =========================================================================

  /**
   * Tính độ trong của bầu khí quyển
   * 
   * Bầu khí quyển sạch khi pollution thấp, mờ khi pollution cao
   * 
   * @param pollutionLevel - Pollution level (0-100)
   * @returns Clarity (0-1, 1 = completely clear)
   * 
   * @example
   * ```typescript
   * PollutionService.calculateAtmosphereClarity(0)    // 1.0
   * PollutionService.calculateAtmosphereClarity(100)  // 0.0
   * ```
   */
  static calculateAtmosphereClarity(pollutionLevel: number): number {
    const clamped = clamp(pollutionLevel, 0, 100)
    return 1 - (clamped / 100)
  }

  /**
   * Tính cường độ sương mù (smog)
   * 
   * Cường độ sương mù = nghịch đảo của clarity
   * 
   * @param pollutionLevel - Pollution level (0-100)
   * @returns Intensity (0-1)
   * 
   * @example
   * ```typescript
   * PollutionService.calculateSmogIntensity(0)    // 0.0
   * PollutionService.calculateSmogIntensity(100)  // 1.0
   * ```
   */
  static calculateSmogIntensity(pollutionLevel: number): number {
    return 1 - this.calculateAtmosphereClarity(pollutionLevel)
  }

  // =========================================================================
  // COMPOSITE CALCULATIONS
  // =========================================================================

  /**
   * Tính toàn bộ effects dựa trên pollution level
   * 
   * Phương thức chính để lấy tất cả giá trị cần thiết một lần
   * 
   * @param pollutionLevel - Pollution level (0-100)
   * @param options - Cấu hình
   *   - maxSmokeParticles: Tối đa smoke particles (default: 1000)
   *   - maxTrashPieces: Tối đa trash pieces (default: 500)
   * @returns Object chứa tất cả calculated values
   * 
   * @example
   * ```typescript
   * const effects = PollutionService.calculateEffects(75)
   * 
   * // Use effects
   * smokeMaterial.opacity = effects.smokeOpacity
   * smokeSystem.setParticleCount(effects.smokeParticleCount)
   * trashSystem.setDensity(effects.trashDensity)
   * oceanMaterial.opacity = effects.oceanOpacity
   * ```
   */
  static calculateEffects(
    pollutionLevel: number,
    options: {
      maxSmokeParticles?: number
      maxTrashPieces?: number
    } = {}
  ): PollutionEffectsValues {
    const { maxSmokeParticles = 1000, maxTrashPieces = 500 } = options

    return {
      smokeOpacity: this.calculateSmokeOpacity(pollutionLevel),
      smokeParticleCount: this.calculateSmokeParticleCount(pollutionLevel, {
        maxParticles: maxSmokeParticles,
      }),
      trashDensity: this.calculateTrashDensity(pollutionLevel),
      trashPieceCount: this.calculateTrashPieceCount(pollutionLevel, {
        maxPieces: maxTrashPieces,
      }),
      oceanOpacity: this.calculateOceanClarity(pollutionLevel),
      atmosphereClarity: this.calculateAtmosphereClarity(pollutionLevel),
      colorBlendWeight: this.calculateColorBlendWeight(pollutionLevel),
    }
  }

  // =========================================================================
  // VALIDATION
  // =========================================================================

  /**
   * Validate và clamp pollution level
   * 
   * @param pollutionLevel - Input pollution level
   * @returns Clamped value (0-100)
   * 
   * @example
   * ```typescript
   * PollutionService.validatePollutionLevel(150)   // 100
   * PollutionService.validatePollutionLevel(-50)   // 0
   * PollutionService.validatePollutionLevel(NaN)   // 0 (invalid)
   * ```
   */
  static validatePollutionLevel(pollutionLevel: unknown): number {
    // Type check
    if (typeof pollutionLevel !== 'number' || isNaN(pollutionLevel)) {
      console.warn(
        `Invalid pollution level: ${pollutionLevel}, defaulting to 0`
      )
      return 0
    }

    // Check if finite
    if (!isFinite(pollutionLevel)) {
      console.warn('Pollution level is not finite, defaulting to 0')
      return 0
    }

    return clamp(pollutionLevel, 0, 100)
  }

  // =========================================================================
  // INTERPOLATION HELPERS
  // =========================================================================

  /**
   * Smooth step interpolation
   * 
   * Dùng để smooth transition xung quanh một threshold
   * 
   * @param pollutionLevel - Pollution level (0-100)
   * @param threshold - Threshold value (0-100)
   * @param range - Range xung quanh threshold (default: 10)
   * @returns Interpolated value (0-1)
   * 
   * @example
   * ```typescript
   * // Fade in smoke khi pollution vượt qua 50
   * const smokeOpacity = PollutionService.smoothStep(
   *   pollution,
   *   50,  // threshold
   *   10   // fade từ 45-55
   * )
   * ```
   */
  static smoothStep(
    pollutionLevel: number,
    threshold: number,
    range: number = 10
  ): number {
    const clamped = clamp(pollutionLevel, 0, 100)
    const min = threshold - range / 2
    const max = threshold + range / 2

    // Clamped interpolation
    if (clamped <= min) return 0
    if (clamped >= max) return 1

    // Smooth hermite interpolation: 3t² - 2t³
    const t = (clamped - min) / (max - min)
    return t * t * (3 - 2 * t)
  }

  // =========================================================================
  // PERFORMANCE HELPERS
  // =========================================================================

  /**
   * Lấy recommended quality level dựa trên pollution
   * 
   * Dùng để adjust performance (particle count, etc.)
   * 
   * @param pollutionLevel - Pollution level (0-100)
   * @returns Quality level: 'high' | 'medium' | 'low'
   * 
   * @example
   * ```typescript
   * const quality = PollutionService.getQualityLevel(pollution)
   * 
   * const particleCount =
   *   quality === 'high' ? 1000 :
   *   quality === 'medium' ? 500 : 250
   * ```
   */
  static getQualityLevel(
    pollutionLevel: number
  ): 'high' | 'medium' | 'low' {
    const clamped = clamp(pollutionLevel, 0, 100)

    if (clamped < 30) {
      // Clean Earth: ít effects, render nhiều particles
      return 'high'
    } else if (clamped < 70) {
      // Moderate pollution: balanced
      return 'medium'
    } else {
      // Severe pollution: nhiều effects, giảm particle count
      return 'low'
    }
  }

  // =========================================================================
  // DEBUG HELPERS
  // =========================================================================

  /**
   * Format pollution data thành readable string
   * 
   * @param pollutionLevel - Pollution level (0-100)
   * @returns Debug string
   * 
   * @example
   * ```typescript
   * console.log(PollutionService.debugInfo(75))
   * // "Pollution: 75% (MODERATE) | Smoke: 0.5 | Trash: 225 | Quality: medium"
   * ```
   */
  static debugInfo(pollutionLevel: number): string {
    const info = getPollutionInfo(pollutionLevel)
    const effects = this.calculateEffects(pollutionLevel)
    const quality = this.getQualityLevel(pollutionLevel)

    return (
      `Pollution: ${Math.round(pollutionLevel)}% (${info.label}) | ` +
      `Smoke: ${effects.smokeOpacity.toFixed(2)} | ` +
      `Trash: ${effects.trashPieceCount} | ` +
      `Quality: ${quality}`
    )
  }
}
