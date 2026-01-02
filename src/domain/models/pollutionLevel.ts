/**
 * Pollution Level Domain Model
 * 
 * Business logic cho pollution level classification
 * 
 * @module domain/models/PollutionLevel
 * 
 * Design principles:
 * - Pure business logic (không phụ thuộc UI/Three.js)
 * - Data-driven (logic từ config)
 * - Testable
 * - Immutable
 */

import {
  POLLUTION_EFFECTS,
  getPollutionLevelFromValue,
  getThresholdInfo,
  normalizePollutionValue,
  type PollutionLevel as PollutionLevelEnum,
} from '../../config/pollutionThresholds'

/**
 * Re-export PollutionLevel enum
 */
export { PollutionLevel } from '../../config/pollutionThresholds'
export type { PollutionLevel as PollutionLevelEnum } from '../../config/pollutionThresholds'

/**
 * Pollution Level Info Interface
 * 
 * Thông tin chi tiết về một pollution level
 */
export interface PollutionLevelInfo {
  level: PollutionLevelEnum
  value: number
  normalizedValue: number
  label: string
  description: string
  range: {
    min: number
    max: number
  }
  effects: {
    showSmoke: boolean
    trashDensity: number
    oceanOpacity: number
    showForests: boolean
  }
}

/**
 * Get Pollution Level Info
 * 
 * Lấy thông tin đầy đủ về pollution level từ giá trị
 * 
 * @param value - Pollution value (0-100)
 * @returns Complete pollution level info
 * 
 * @example
 * ```typescript
 * const info = getPollutionInfo(75)
 * console.log(info.level)        // PollutionLevel.MODERATE
 * console.log(info.label)        // "Ô nhiễm trung bình"
 * console.log(info.effects)      // { showSmoke: true, ... }
 * ```
 */
export function getPollutionInfo(value: number): PollutionLevelInfo {
  const level = getPollutionLevelFromValue(value)
  const threshold = getThresholdInfo(level)
  const effects = POLLUTION_EFFECTS[level]

  return {
    level,
    value,
    normalizedValue: normalizePollutionValue(value),
    label: threshold.label,
    description: threshold.description,
    range: {
      min: threshold.min,
      max: threshold.max,
    },
    effects: {
      showSmoke: effects.showSmoke,
      trashDensity: effects.trashDensity,
      oceanOpacity: effects.oceanOpacity,
      showForests: effects.showForests,
    },
  }
}

/**
 * Compare Pollution Levels
 * 
 * So sánh 2 pollution values
 * 
 * @param a - Pollution value A
 * @param b - Pollution value B
 * @returns -1 if a < b, 0 if equal, 1 if a > b
 * 
 * @example
 * ```typescript
 * comparePollution(30, 60)  // -1 (a nhỏ hơn)
 * comparePollution(50, 50)  // 0 (bằng nhau)
 * comparePollution(80, 40)  // 1 (a lớn hơn)
 * ```
 */
export function comparePollution(a: number, b: number): -1 | 0 | 1 {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

/**
 * Is Pollution Level Changed
 * 
 * Check xem pollution có thay đổi level hay không
 * 
 * @param oldValue - Old pollution value
 * @param newValue - New pollution value
 * @returns true nếu level thay đổi
 * 
 * @example
 * ```typescript
 * isPollutionLevelChanged(15, 18)  // false (cùng CLEAN)
 * isPollutionLevelChanged(18, 22)  // true (CLEAN → LIGHT)
 * ```
 */
export function isPollutionLevelChanged(
  oldValue: number,
  newValue: number
): boolean {
  const oldLevel = getPollutionLevelFromValue(oldValue)
  const newLevel = getPollutionLevelFromValue(newValue)

  return oldLevel !== newLevel
}

/**
 * Get Pollution Severity
 * 
 * Tính độ nghiêm trọng (0-1)
 * 
 * @param value - Pollution value (0-100)
 * @returns Severity (0 = không nghiêm trọng, 1 = rất nghiêm trọng)
 * 
 * @example
 * ```typescript
 * getPollutionSeverity(0)    // 0
 * getPollutionSeverity(50)   // 0.5
 * getPollutionSeverity(100)  // 1
 * ```
 */
export function getPollutionSeverity(value: number): number {
  return normalizePollutionValue(value)
}

/**
 * Get Pollution Color Weight
 * 
 * Tính trọng số để blend màu (0-1)
 * Có thể customize curve
 * 
 * @param value - Pollution value (0-100)
 * @param curve - Easing curve ('linear' | 'easeIn' | 'easeOut')
 * @returns Color blend weight (0-1)
 * 
 * @example
 * ```typescript
 * // Linear: 50 → 0.5
 * getPollutionColorWeight(50, 'linear')  // 0.5
 * 
 * // Ease in: Pollution tăng chậm lúc đầu
 * getPollutionColorWeight(50, 'easeIn')  // 0.25
 * 
 * // Ease out: Pollution tăng nhanh lúc đầu
 * getPollutionColorWeight(50, 'easeOut')  // 0.75
 * ```
 */
export function getPollutionColorWeight(
  value: number,
  curve: 'linear' | 'easeIn' | 'easeOut' = 'linear'
): number {
  const t = normalizePollutionValue(value)

  switch (curve) {
    case 'easeIn':
      return t * t

    case 'easeOut':
      return t * (2 - t)

    case 'linear':
    default:
      return t
  }
}

/**
 * Get Pollution Trend
 * 
 * Xác định xu hướng pollution (tăng/giảm/ổn định)
 * 
 * @param history - Array of pollution values (newest last)
 * @param threshold - Ngưỡng để coi là thay đổi (default: 5)
 * @returns 'increasing' | 'decreasing' | 'stable'
 * 
 * @example
 * ```typescript
 * getPollutionTrend([10, 20, 30, 40])  // 'increasing'
 * getPollutionTrend([80, 70, 60, 50])  // 'decreasing'
 * getPollutionTrend([50, 52, 49, 51])  // 'stable'
 * ```
 */
export function getPollutionTrend(
  history: number[],
  threshold: number = 5
): 'increasing' | 'decreasing' | 'stable' {
  if (history.length < 2) {
    return 'stable'
  }

  const first = history[0]
  const last = history[history.length - 1]
  const diff = last - first

  if (Math.abs(diff) < threshold) {
    return 'stable'
  }

  return diff > 0 ? 'increasing' : 'decreasing'
}

/**
 * Calculate Pollution Delta
 * 
 * Tính sự thay đổi pollution
 * 
 * @param oldValue - Old value
 * @param newValue - New value
 * @returns Delta object
 * 
 * @example
 * ```typescript
 * calculatePollutionDelta(30, 70)
 * // {
 * //   absolute: 40,
 * //   percentage: 40,
 * //   levelChanged: true,
 * //   direction: 'increase'
 * // }
 * ```
 */
export function calculatePollutionDelta(oldValue: number, newValue: number): {
  absolute: number
  percentage: number
  levelChanged: boolean
  direction: 'increase' | 'decrease' | 'none'
} {
  const absolute = newValue - oldValue
  const percentage = absolute
  const levelChanged = isPollutionLevelChanged(oldValue, newValue)

  let direction: 'increase' | 'decrease' | 'none'
  if (absolute > 0) {
    direction = 'increase'
  } else if (absolute < 0) {
    direction = 'decrease'
  } else {
    direction = 'none'
  }

  return {
    absolute,
    percentage,
    levelChanged,
    direction,
  }
}

/**
 * Format Pollution Value
 * 
 * Format pollution value cho display
 * 
 * @param value - Pollution value
 * @param format - Format type
 * @returns Formatted string
 * 
 * @example
 * ```typescript
 * formatPollutionValue(75, 'percentage')     // "75%"
 * formatPollutionValue(75, 'decimal')        // "0.75"
 * formatPollutionValue(75, 'label')          // "Ô nhiễm trung bình (75%)"
 * formatPollutionValue(75, 'description')    // "Ô nhiễm rõ rệt..."
 * ```
 */
export function formatPollutionValue(
  value: number,
  format: 'percentage' | 'decimal' | 'label' | 'description' = 'percentage'
): string {
  const info = getPollutionInfo(value)

  switch (format) {
    case 'percentage':
      return `${Math.round(value)}%`

    case 'decimal':
      return info.normalizedValue.toFixed(2)

    case 'label':
      return `${info.label} (${Math.round(value)}%)`

    case 'description':
      return info.description

    default:
      return `${Math.round(value)}%`
  }
}

/**
 * Validate Pollution Value
 * 
 * Kiểm tra tính hợp lệ của pollution value
 * 
 * @param value - Value to validate
 * @returns Validation result
 * 
 * @example
 * ```typescript
 * validatePollutionValue(50)
 * // { valid: true, value: 50, errors: [] }
 * 
 * validatePollutionValue(150)
 * // { valid: false, value: 150, errors: ['Value exceeds maximum (100)'] }
 * 
 * validatePollutionValue('abc')
 * // { valid: false, value: NaN, errors: ['Value is not a number'] }
 * ```
 */
export function validatePollutionValue(value: any): {
  valid: boolean
  value: number
  errors: string[]
} {
  const errors: string[] = []

  // Check if number
  if (typeof value !== 'number' || isNaN(value)) {
    errors.push('Value is not a number')
    return { valid: false, value: NaN, errors }
  }

  // Check range
  if (value < 0) {
    errors.push('Value is below minimum (0)')
  }

  if (value > 100) {
    errors.push('Value exceeds maximum (100)')
  }

  // Check if finite
  if (!isFinite(value)) {
    errors.push('Value must be finite')
  }

  return {
    valid: errors.length === 0,
    value,
    errors,
  }
}

/**
 * Get Recommended Actions
 * 
 * Gợi ý hành động dựa trên pollution level
 * 
 * @param value - Pollution value
 * @returns Array of recommended actions
 * 
 * @example
 * ```typescript
 * getRecommendedActions(85)
 * // [
 * //   "Giảm khí thải công nghiệp khẩn cấp",
 * //   "Hạn chế sử dụng phương tiện cá nhân",
 * //   "Tăng cường trồng cây xanh"
 * // ]
 * ```
 */
export function getRecommendedActions(value: number): string[] {
  const level = getPollutionLevelFromValue(value)

  const actions: Record<PollutionLevelEnum, string[]> = {
    clean: [
      'Duy trì các hoạt động thân thiện môi trường',
      'Tiếp tục trồng và bảo vệ rừng',
      'Khuyến khích sử dụng năng lượng tái tạo',
    ],
    light: [
      'Tăng cường giám sát chất lượng không khí',
      'Khuyến khích sử dụng phương tiện công cộng',
      'Giảm thiểu rác thải nhựa',
    ],
    moderate: [
      'Giảm khí thải từ nhà máy và phương tiện',
      'Tăng cường xử lý rác thải',
      'Trồng cây xanh quy mô lớn',
      'Giáo dục cộng đồng về môi trường',
    ],
    severe: [
      'Giảm khí thải công nghiệp khẩn cấp',
      'Hạn chế sử dụng phương tiện cá nhân',
      'Dừng các hoạt động gây ô nhiễm nghiêm trọng',
      'Triển khai công nghệ làm sạch không khí',
      'Ban bố tình trạng khẩn cấp môi trường',
    ],
  }

  return actions[level] || []
}