/**
 * Linear Interpolation Utility
 * 
 * Hàm nội suy tuyến tính giữa 2 giá trị
 * 
 * @module utils/math/lerp
 * 
 * Design principles:
 * - Pure function: Không side effects
 * - Predictable: Cùng input → cùng output
 * - Fast: Toán học đơn giản, không allocation
 */

/**
 * Linear Interpolation (lerp)
 * 
 * Tính toán giá trị trung gian giữa start và end theo tỷ lệ t
 * 
 * Công thức: result = start + (end - start) * t
 * 
 * @param start - Giá trị bắt đầu
 * @param end - Giá trị kết thúc
 * @param t - Hệ số nội suy (0-1)
 *   - t = 0: Trả về start
 *   - t = 0.5: Trả về giá trị giữa start và end
 *   - t = 1: Trả về end
 * 
 * @returns Giá trị đã nội suy
 * 
 * @example
 * ```typescript
 * lerp(0, 100, 0)    // 0
 * lerp(0, 100, 0.5)  // 50
 * lerp(0, 100, 1)    // 100
 * lerp(10, 20, 0.3)  // 13
 * ```
 * 
 * @example Use case: Smooth color transition
 * ```typescript
 * const startColor = 0xff0000 // Red
 * const endColor = 0x0000ff   // Blue
 * const t = pollutionLevel / 100
 * const color = lerp(startColor, endColor, t)
 * ```
 */
export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}

/**
 * Clamped Linear Interpolation
 * 
 * Giống lerp nhưng t luôn bị giới hạn trong [0, 1]
 * 
 * @param start - Giá trị bắt đầu
 * @param end - Giá trị kết thúc
 * @param t - Hệ số nội suy (sẽ được clamp về 0-1)
 * 
 * @returns Giá trị đã nội suy (luôn trong khoảng [start, end])
 * 
 * @example
 * ```typescript
 * lerpClamped(0, 100, -0.5)  // 0 (clamped)
 * lerpClamped(0, 100, 0.5)   // 50
 * lerpClamped(0, 100, 1.5)   // 100 (clamped)
 * ```
 */
export function lerpClamped(start: number, end: number, t: number): number {
    const clampedT = Math.max(0, Math.min(1, t));
    return lerp(start, end, clampedT);
}

/**
 * Inverse Lerp
 * 
 * Tính ngược: Cho giá trị value, tìm t
 * 
 * Công thức: t = (value - start) / (end - start)
 * 
 * @param start - Giá trị bắt đầu
 * @param end - Giá trị kết thúc
 * @param value - Giá trị cần tìm t
 * 
 * @returns Hệ số t (0-1 nếu value nằm trong [start, end])
 * 
 * @example
 * ```typescript
 * inverseLerp(0, 100, 0)    // 0
 * inverseLerp(0, 100, 50)   // 0.5
 * inverseLerp(0, 100, 100)  // 1
 * inverseLerp(0, 100, 25)   // 0.25
 * ```
 * 
 * @example Use case: Normalize pollution value
 * ```typescript
 * const pollutionValue = 75
 * const t = inverseLerp(0, 100, pollutionValue) // 0.75
 * ```
 */
export function inverseLerp(start: number, end: number, value: number): number {
    if (start === end) return 0; // Tránh chia cho 0
    return (value - start) / (end - start);
}

/**
 * Smooth Step (Hermite interpolation)
 * 
 * Nội suy với smooth curve (S-curve)
 * Chậm ở đầu và cuối, nhanh ở giữa
 * 
 * @param start - Giá trị bắt đầu
 * @param end - Giá trị kết thúc
 * @param t - Hệ số nội suy (0-1)
 * 
 * @returns Giá trị đã nội suy với smooth curve
 * 
 * @example
 * ```typescript
 * smoothStep(0, 100, 0.5)  // ~50 (nhưng với smooth transition)
 * ```
 */
export function smoothStep(start: number, end: number, t: number): number {
    const clampedT = Math.max(0, Math.min(1, t));
    // Hermite polynomial: 3t^2 - 2t^3
    const smoothT = clampedT * clampedT * (3 - 2 * clampedT);
    return lerp(start, end, smoothT);
}

/**
 * Smoother Step (Ken Perlin's improved version)
 * 
 * Smooth hơn smoothStep
 * 
 * @param start - Giá trị bắt đầu
 * @param end - Giá trị kết thúc
 * @param t - Hệ số nội suy (0-1)
 * 
 * @returns Giá trị đã nội suy với smoother curve
 */
export function smootherStep(start: number, end: number, t: number): number {
    const clampedT = Math.max(0, Math.min(1, t));
    // Ken Perlin's smootherstep: 6t^5 - 15t^4 + 10t^3
    const smoothT = clampedT * clampedT * clampedT * (clampedT * (clampedT * 6 - 15) + 10);
    return lerp(start, end, smoothT);
}

/**
 * Lerp Angle (for rotations)
 * 
 * Nội suy góc (radians) theo đường đi ngắn nhất
 * 
 * @param start - Góc bắt đầu (radians)
 * @param end - Góc kết thúc (radians)
 * @param t - Hệ số nội suy (0-1)
 * 
 * @returns Góc đã nội suy (radians)
 * 
 * @example
 * ```typescript
 * // Quay từ 0° đến 350° sẽ đi theo chiều ngắn (-10°)
 * lerpAngle(0, Math.PI * 2 * 350/360, 0.5)
 * ```
 */
export function lerpAngle(start: number, end: number, t: number): number {
    const TWO_PI = Math.PI * 2;
    const normalizedAngle = (angle: number) => {
        let normalized = angle % TWO_PI;
        if (normalized < 0) normalized += TWO_PI;
        return normalized;
    }

    const normalizedStart = normalizedAngle(start);
    const normalizedEnd = normalizedAngle(end);
    let delta = normalizedEnd - normalizedStart;

    // Chọn đường đi ngắn nhất
    if (delta > Math.PI) {
        delta -= TWO_PI;
    } else if (delta < -Math.PI) {
        delta += TWO_PI;
    }

    return normalizedAngle(normalizedStart + delta * t);
}

/**
 * Multi Lerp
 * 
 * Nội suy nhiều giá trị cùng lúc
 * 
 * @param values - Mảng các giá trị cần nội suy
 * @param t - Hệ số nội suy (0-1)
 * 
 * @returns Mảng các giá trị đã nội suy
 * 
 * @example
 * ```typescript
 * const start = [0, 0, 0]
 * const end = [100, 200, 300]
 * multiLerp([start, end], 0.5)  // [50, 100, 150]
 * ```
 */
export function multiLerp(values: number[][], t: number): number[] {
    if (values.length < 2) {
        throw new Error("Multilerp requires at least two value arrays.");
    }

    const start = values[0];
    const end = values[values.length - 1];

    if (start.length !== end.length) {
        throw new Error("All value arrays must have the same length.");
    }

    const result: number[] = [];
    for (let i = 0; i < start.length; i++) {
        result.push(lerp(start[i], end[i], t));
    }

    return result;
}

/**
 * Ease In Quad
 * 
 * Easing function: Bắt đầu chậm, tăng tốc dần
 * 
 * @param t - Time (0-1)
 * @returns Eased value
 */
export function easeInQuad(t: number): number {
  return t * t
}

/**
 * Ease Out Quad
 * 
 * Easing function: Bắt đầu nhanh, chậm dần
 * 
 * @param t - Time (0-1)
 * @returns Eased value
 */
export function easeOutQuad(t: number): number {
  return t * (2 - t)
}

/**
 * Ease In Out Quad
 * 
 * Easing function: Chậm ở đầu và cuối, nhanh ở giữa
 * 
 * @param t - Time (0-1)
 * @returns Eased value
 */
export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}