/**
 * Pollution Thresholds Configuration
 * 
 * Định nghĩa các ngưỡng ô nhiễm và mapping với pollution levels
 * 
 * @module config/pollutionThresholds
 * 
 * Design principles:
 * - Data-driven: Logic phân loại dựa hoàn toàn trên data
 * - Easy to modify: Thay đổi ngưỡng không cần sửa code logic
 * - Type-safe: Enum + const để đảm bảo type safety
 */
import { COLORS } from './colors';


export const PollutionLevel = {
    CLEAN: 'clean',
    LIGHT: 'light',
    MODERATE: 'moderate',
    SEVERE: 'severe',
} as const;

// Create a type from the const object values
export type PollutionLevel = typeof PollutionLevel[keyof typeof PollutionLevel];

export interface PollutionThresholds {
    readonly min: number;
    readonly max: number;
    readonly label: string;
    readonly description: string;
    readonly color: string;
}

/**
 * Pollution Thresholds Map
 * 
 * Map mỗi PollutionLevel với range cụ thể
 * 
 * Quy tắc thiết kế ngưỡng:
 * - 0-20: Môi trường tốt, có thể duy trì lâu dài
 * - 21-50: Bắt đầu có dấu hiệu xấu đi
 * - 51-80: Cần hành động khẩn cấp
 * - 81-100: Nguy hiểm, không thể đảo ngược
 */

export const POLLUTION_THRESHOLDS: Record<PollutionLevel, PollutionThresholds> = {
    [PollutionLevel.CLEAN]: {
        min: 0,
        max: 20,
        label: 'clean',
        description: 'Trái Đất trong lành, không khí sạch',
        color: COLORS.ui.success,
    },
    [PollutionLevel.LIGHT]: {
        min: 21,
        max: 50,
        label: 'light',
        description: 'Bắt đầu xuất hiện ô nhiễm nhẹ',
        color: COLORS.ui.accent,
    },
    [PollutionLevel.MODERATE]: {
        min: 51,
        max: 80,
        label: 'moderate',
        description: 'Ô nhiễm trung bình, cần hành động',
        color: COLORS.ui.warning,
    },
    [PollutionLevel.SEVERE]: {
        min: 81,
        max: 100,
        label: 'severe',
        description: 'Ô nhiễm nghiêm trọng, nguy hiểm',
        color: COLORS.ui.error,
    },
} as const;

/**
 * Pollution Effects Configuration
 * Định nghĩa các hiệu ứng visual theo pollution level
 */
export const POLLUTION_EFFECTS = {
    [PollutionLevel.CLEAN]: {
        showSmoke: false,
        trashDensity: 0,
        oceanOpacity: 1.0,
        showForests: true,
    },

    [PollutionLevel.LIGHT]: {
        showSmoke: false,
        trashDensity: 10,
        oceanOpacity: 0.9,
        showForests: true,
    },

    [PollutionLevel.MODERATE]: {
        showSmoke: true,
        trashDensity: 40,
        oceanOpacity: 0.7,
        showForests: true,
    },

    [PollutionLevel.SEVERE]: {
        showSmoke: true,
        trashDensity: 80,
        oceanOpacity: 0.4,
        showForests: false,
    },
} as const;

export const POLLUTION_SLIDER_CONFIG = {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 0,
    marks: {
        0: 'Sạch',
        20: 'Nhẹ',
        50: 'Trung bình',
        80: 'Nghiêm trọng',
        100: 'Tối đa',
    },
} as const;

/**
 * Helper function: Get pollution level from value
 * 
 * Pure function để xác định pollution level từ giá trị số
 * 
 * @param value - Pollution value (0-100)
 * @returns Corresponding PollutionLevel enum
 * 
 * @example
 * ```typescript
 * getPollutionLevelFromValue(15)  // PollutionLevel.CLEAN
 * getPollutionLevelFromValue(75)  // PollutionLevel.MODERATE
 * ```
 */
export function getPollutionLevelFromValue(value: number): PollutionLevel {
    // Clamp value trong range 0-100
    const clampedValue = Math.max(0, Math.min(100, value))

    // Iterate qua các thresholds
    for (const [level, range] of Object.entries(POLLUTION_THRESHOLDS)) {
        if (clampedValue >= range.min && clampedValue <= range.max) {
            return level as PollutionLevel
        }
    }

    // Fallback (không bao giờ xảy ra nếu thresholds cover đủ 0-100)
    return PollutionLevel.CLEAN
}

/**
 * Helper function: Get threshold info
 * 
 * Lấy thông tin chi tiết về một pollution level
 * 
 * @param level - PollutionLevel enum
 * @returns ThresholdRange object
 * 
 * @example
 * ```typescript
 * const info = getThresholdInfo(PollutionLevel.MODERATE)
 * console.log(info.description) // "Ô nhiễm trung bình..."
 * ```
 */
export function getThresholdInfo(level: PollutionLevel): PollutionThresholds {
    return POLLUTION_THRESHOLDS[level]
}

/**
 * Helper function: Normalize pollution value
 * 
 * Chuyển đổi giá trị 0-100 thành 0-1 (để dùng cho lerp)
 * 
 * @param value - Pollution value (0-100)
 * @returns Normalized value (0-1)
 * 
 * @example
 * ```typescript
 * normalizePollutionValue(50)  // 0.5
 * normalizePollutionValue(100) // 1.0
 * ```
 */
export function normalizePollutionValue(value: number): number {
    const clampedValue = Math.max(0, Math.min(100, value))
    return clampedValue / 100
}

/**
 * Type exports
 */
export type PollutionThresholdsConfig = typeof POLLUTION_THRESHOLDS
export type PollutionEffectsConfig = typeof POLLUTION_EFFECTS
export type PollutionSliderConfig = typeof POLLUTION_SLIDER_CONFIG