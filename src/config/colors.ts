/**
 * Colors Configuration
 * 
 * Central color palette cho toàn bộ application
 * 
 * @module config/colors
 * 
 * Design principles:
 * - Single Source of Truth: Tất cả màu sắc ở đây
 * - Semantic naming: Tên màu theo ý nghĩa, không phải giá trị hex
 * - Easy theming: Dễ dàng thay đổi theme tối/sáng
 * - Type-safe: TypeScript infer types từ const
 * 
 * Color format: Hex string (Three.js compatible)
 * Tất cả màu đều là hex 6 ký tự: #RRGGBB
 */

/**
 * Earth Colors
 * 
 * Màu sắc cho mô hình Trái Đất ở các trạng thái khác nhau
 */
export const EARTH_COLORS = {
    clean: '#4a9eff',      // Xanh dương tươi sáng
    polluted: '#3d3228',   // Nâu xám chết chóc
    land: '#2d5016',       // Xanh lá đất
    landPolluted: '#8b4513', // Nâu khô cằn
    desert: '#c2b280',
} as const

/**
 * Ocean Colors
 * 
 * Màu sắc đại dương
 */
export const OCEAN_COLORS = {
    clean: '#48c6f8ff',      // Xanh nhạt sáng hơn (light ocean blue)
    polluted: '#1a1a1a',   // Đen đục ngầu
    foam: '#ffffff',
} as const

/**
 * Atmosphere Colors
 * 
 * Màu sắc bầu khí quyển - CRITICAL cho visual impact
 */
export const ATMOSPHERE_COLORS = {
    clean: '#60b6ff',      // Xanh lam sáng hơn (brighter sky blue)
    polluted: '#4a4a4a',   // Xám nâu chì đục ngầu
    smog: '#2d2418',       // Màu khói bụi nặng
    clouds: '#f0f0f0',
    cloudsPolluted: '#3a3a3a', // Mây biến thành smog
} as const

/**
 * Effect Colors
 * 
 * Màu sắc cho các hiệu ứng (khói, rác, v.v.)
 */
export const EFFECT_COLORS = {
    smoke: '#808080',
    smokeDense: '#1a1a1a',  // Khói đen đặc
    plasticTrash: '#ff6b6b',
    metalTrash: '#a8a8a8',
    organicTrash: '#8b4513',
    fire: '#ff4500',
} as const

/**
 * Starfield Colors
 * 
 * Màu sắc cho background starfield
 */
export const STARFIELD_COLORS = {
    stars: '#ffffff',
    distantStars: '#b0e0e6',
    space: '#000000',
} as const

/**
 * UI Colors
 * 
 * Màu sắc cho giao diện người dùng
 */
export const UI_COLORS = {
    overlayBg: '#000000',
    textPrimary: '#ffffff',
    textSecondary: '#cccccc',
    accent: '#1e90ff',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
} as const

/**
 * Light System Colors
 * 
 * Màu sắc cho hệ thống ánh sáng Three.js
 */
export const LIGHT_COLORS = {
    ambient: '#ffffff',
    directional: '#ffffff',
    back: '#8888ff',
    point: '#ffaa00',
} as const

/**
 * Combined Colors Config
 * 
 * Export tất cả colors vào 1 object
 */
export const COLORS = {
    earth: EARTH_COLORS,
    ocean: OCEAN_COLORS,
    atmosphere: ATMOSPHERE_COLORS,
    effects: EFFECT_COLORS,
    starfield: STARFIELD_COLORS,
    ui: UI_COLORS,
    lights: LIGHT_COLORS,
} as const

/**
 * Helper: Convert hex to RGB
 * 
 * Chuyển đổi hex string sang RGB object (nếu cần)
 * 
 * @param hex - Hex color string (e.g., "#1e90ff")
 * @returns RGB object { r, g, b } với giá trị 0-255
 * 
 * @example
 * ```typescript
 * hexToRgb("#1e90ff") // { r: 30, g: 144, b: 255 }
 * ```
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
    // Remove # if present
    const cleanHex = hex.replace('#', '')

    // Parse hex
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)

    return { r, g, b }
}

/**
 * Helper: Convert RGB to hex
 * 
 * Chuyển đổi RGB sang hex string
 * 
 * @param r - Red (0-255)
 * @param g - Green (0-255)
 * @param b - Blue (0-255)
 * @returns Hex color string (e.g., "#1e90ff")
 * 
 * @example
 * ```typescript
 * rgbToHex(30, 144, 255) // "#1e90ff"
 * ```
 */
export function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => {
        const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Helper: Get color with alpha
 * 
 * Convert hex color sang rgba string (for CSS)
 * 
 * @param hex - Hex color
 * @param alpha - Alpha value (0-1)
 * @returns RGBA string (e.g., "rgba(30, 144, 255, 0.7)")
 * 
 * @example
 * ```typescript
 * getColorWithAlpha("#1e90ff", 0.7) // "rgba(30, 144, 255, 0.7)"
 * ```
 */
export function getColorWithAlpha(hex: string, alpha: number): string {
    const { r, g, b } = hexToRgb(hex)
    const clampedAlpha = Math.max(0, Math.min(1, alpha))
    return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`
}

/**
 * Helper: Lerp Color (Nội suy màu sắc)
 * Giúp chuyển đổi mượt mà giữa 2 màu hex dựa trên một tỉ lệ (0-1)
 * * @param color1 - Màu bắt đầu (Hex)
 * @param color2 - Màu kết thúc (Hex)
 * @param factor - Tỉ lệ (0.0 - 1.0)
 */
export function lerpColor(color1: string, color2: string, factor: number): string {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);

    return rgbToHex(r, g, b);
}

/**
 * Type exports
 */
export type EarthColors = typeof EARTH_COLORS
export type OceanColors = typeof OCEAN_COLORS
export type AtmosphereColors = typeof ATMOSPHERE_COLORS
export type EffectColors = typeof EFFECT_COLORS
export type StarfieldColors = typeof STARFIELD_COLORS
export type UIColors = typeof UI_COLORS
export type LightColors = typeof LIGHT_COLORS
export type ColorsConfig = typeof COLORS