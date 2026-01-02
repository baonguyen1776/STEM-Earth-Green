/**
 * Map Range Utility
 * 
 * Chuyển đổi giá trị từ range này sang range khác
 * 
 * @module utils/math/map
 * 
 * Design principles:
 * - Pure function
 * - Handle edge cases
 * - Composable with other math functions
 */
import { clamp } from './clamp';

/**
 * Map Range
 * 
 * Map giá trị từ input range sang output range
 * 
 * Công thức:
 * output = outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin)
 * 
 * @param value - Giá trị cần map
 * @param inMin - Input range min
 * @param inMax - Input range max
 * @param outMin - Output range min
 * @param outMax - Output range max
 * 
 * @returns Mapped value
 * 
 * @example
 * ```typescript
 * // Map 50 từ [0,100] sang [0,1]
 * mapRange(50, 0, 100, 0, 1)  // 0.5
 * 
 * // Map 75 từ [0,100] sang [0,255]
 * mapRange(75, 0, 100, 0, 255)  // 191.25
 * 
 * // Map temperature từ Celsius sang Fahrenheit
 * mapRange(0, 0, 100, 32, 212)  // 32°F
 * mapRange(100, 0, 100, 32, 212)  // 212°F
 * ```
 * 
 * @example Use case: Pollution to opacity
 * ```typescript
 * const pollution = 75  // 0-100
 * const opacity = mapRange(pollution, 0, 100, 0, 1)  // 0.75
 * ```
 */
export function mapRange(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    if (inMin === inMax) {
        console.warn(`mapRange: inMin (${inMin}) is equal to inMax (${inMax}). Returning outMin (${outMin}).`);
        return outMin;
    }

    return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}

/**
 * Map Range Clamped
 * 
 * Map range với clamp output về [outMin, outMax]
 * 
 * @param value - Giá trị cần map
 * @param inMin - Input range min
 * @param inMax - Input range max
 * @param outMin - Output range min
 * @param outMax - Output range max
 * 
 * @returns Clamped mapped value
 * 
 * @example
 * ```typescript
 * // Value ngoài input range sẽ bị clamp
 * mapRangeClamped(150, 0, 100, 0, 1)  // 1 (clamped)
 * mapRangeClamped(-50, 0, 100, 0, 1)  // 0 (clamped)
 * ```
 */
export function mapRangeClamped(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    const mapped = mapRange(value, inMin, inMax, outMin, outMax);
    return clamp(mapped, Math.min(outMin, outMax), Math.max(outMin, outMax));
}

/**
 * Normalize
 * 
 * Map giá trị về [0, 1]
 * Shorthand cho mapRange(value, min, max, 0, 1)
 * 
 * @param value - Giá trị cần normalize
 * @param min - Range min
 * @param max - Range max
 * 
 * @returns Normalized value (0-1)
 * 
 * @example
 * ```typescript
 * normalize(50, 0, 100)   // 0.5
 * normalize(75, 0, 100)   // 0.75
 * normalize(25, 0, 100)   // 0.25
 * ```
 */
export function normalize(value: number, min: number, max: number): number {
    return mapRange(value, min, max, 0, 1);
}

/**
 * Denormalize
 * 
 * Map giá trị từ [0, 1] về [min, max]
 * Ngược lại của normalize
 * 
 * @param normalizedValue - Normalized value (0-1)
 * @param min - Target range min
 * @param max - Target range max
 * 
 * @returns Denormalized value
 * 
 * @example
 * ```typescript
 * denormalize(0.5, 0, 100)   // 50
 * denormalize(0.75, 0, 100)  // 75
 * ```
 */
export function denormalize(
  normalizedValue: number,
  min: number,
  max: number
): number {
  return mapRange(normalizedValue, 0, 1, min, max)
}

/**
 * Map to Percentage
 * 
 * Map giá trị sang phần trăm (0-100)
 * 
 * @param value - Giá trị cần map
 * @param min - Range min
 * @param max - Range max
 * 
 * @returns Percentage (0-100)
 * 
 * @example
 * ```typescript
 * mapToPercentage(50, 0, 100)   // 50
 * mapToPercentage(0.5, 0, 1)    // 50
 * ```
 */
export function mapToPercentage(
  value: number,
  min: number,
  max: number
): number {
  return mapRange(value, min, max, 0, 100)
}

/**
 * Map from Percentage
 * 
 * Map từ phần trăm (0-100) sang range
 * 
 * @param percentage - Percentage (0-100)
 * @param min - Target range min
 * @param max - Target range max
 * 
 * @returns Mapped value
 * 
 * @example
 * ```typescript
 * mapFromPercentage(50, 0, 1)    // 0.5
 * mapFromPercentage(75, 0, 100)  // 75
 * ```
 */
export function mapFromPercentage(
  percentage: number,
  min: number,
  max: number
): number {
  return mapRange(percentage, 0, 100, min, max)
}

/**
 * Remap (chaining multiple maps)
 * 
 * Map qua nhiều ranges liên tiếp
 * 
 * @param value - Input value
 * @param ranges - Array of [inMin, inMax, outMin, outMax]
 * 
 * @returns Final mapped value
 * 
 * @example
 * ```typescript
 * // Map 50 từ [0,100] → [0,1] → [0,255]
 * remap(50, [
 *   [0, 100, 0, 1],
 *   [0, 1, 0, 255]
 * ])  // 127.5
 * ```
 */
export function remap(
    value: number,
    ranges: Array<[number, number, number, number]>
): number {
    let result = value;

    for (const [inMin, inMax, outMin, outMax] of ranges) {
        result = mapRange(result, inMin, inMax, outMin, outMax);
    }

    return result;
}

/**
 * Exponential Map
 * 
 * Map với exponential curve
 * Tạo non-linear mapping
 * 
 * @param value - Input value
 * @param inMin - Input range min
 * @param inMax - Input range max
 * @param outMin - Output range min
 * @param outMax - Output range max
 * @param exponent - Exponent (>1: ease in, <1: ease out)
 * 
 * @returns Exponentially mapped value
 * 
 * @example
 * ```typescript
 * // Linear: mapRange(50, 0, 100, 0, 1) = 0.5
 * // Exponential (^2): exponentialMap(50, 0, 100, 0, 1, 2) = 0.25
 * // Exponential (^0.5): exponentialMap(50, 0, 100, 0, 1, 0.5) = 0.707
 * ```
 */
export function exponentialMap(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
    exponent: number = 2
): number {
    const t = normalize(value, inMin, inMax);
    const tExp = Math.pow(t, exponent);
    return denormalize(tExp, outMin, outMax);
}

/**
 * Sigmoid Map
 * 
 * Map với sigmoid curve (S-curve)
 * Chậm ở 2 đầu, nhanh ở giữa
 * 
 * @param value - Input value
 * @param inMin - Input range min
 * @param inMax - Input range max
 * @param outMin - Output range min
 * @param outMax - Output range max
 * @param steepness - Độ dốc của curve (default: 1)
 * 
 * @returns Sigmoid mapped value
 * 
 * @example
 * ```typescript
 * sigmoidMap(50, 0, 100, 0, 1, 1)  // ~0.5 với smooth transition
 * ```
 */
export function sigmoidMap(
    value: number, 
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
    steepness: number = 1
): number {
    // Normalize ve [-1, 1]
    const t = mapRange(value, inMin, inMax, -1, 1);

    // Apply sigmoid: 1 / (1 + e^(-kx))
    const sigmoid = 1 / (1 + Math.exp(-steepness * t * 6));
    return mapRange(sigmoid, 0, 1, outMin, outMax);
}

/**
 * Map với custom curve
 * 
 * Map theo curve function tùy chỉnh
 * 
 * @param value - Input value
 * @param inMin - Input range min
 * @param inMax - Input range max
 * @param outMin - Output range min
 * @param outMax - Output range max
 * @param curveFn - Curve function (0-1) → (0-1)
 * 
 * @returns Mapped value theo curve
 * 
 * @example
 * ```typescript
 * // Ease in quad
 * mapWithCurve(50, 0, 100, 0, 1, t => t * t)  // 0.25
 * 
 * // Ease out quad
 * mapWithCurve(50, 0, 100, 0, 1, t => t * (2 - t))  // 0.75
 * ```
 */
export function mapWithCurve(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  curveFn: (t: number) => number
): number {
  // Normalize input
  const t = normalize(value, inMin, inMax)
  
  // Apply curve
  const curved = curveFn(t)
  
  // Denormalize output
  return denormalize(curved, outMin, outMax)
}

/**
 * Inverse Map
 * 
 * Map ngược: Cho output, tìm input
 * 
 * @param outputValue - Output value
 * @param inMin - Original input range min
 * @param inMax - Original input range max
 * @param outMin - Original output range min
 * @param outMax - Original output range max
 * 
 * @returns Input value tương ứng
 * 
 * @example
 * ```typescript
 * // Nếu mapRange(50, 0, 100, 0, 1) = 0.5
 * // Thì inverseMap(0.5, 0, 100, 0, 1) = 50
 * ```
 */
export function inverseMap(
  outputValue: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  // Swap input/output ranges
  return mapRange(outputValue, outMin, outMax, inMin, inMax)
}

/**
 * Multi-point Linear Map
 * 
 * Map theo nhiều điểm (piecewise linear)
 * 
 * @param value - Input value
 * @param points - Array of [input, output] points
 * 
 * @returns Mapped value
 * 
 * @example
 * ```typescript
 * // 0→0, 50→0.3, 100→1.0
 * multiPointMap(25, [
 *   [0, 0],
 *   [50, 0.3],
 *   [100, 1.0]
 * ])  // 0.15
 * ```
 */
export function multiPointMap(
  value: number,
  points: Array<[number, number]>
): number {
  // Sort points by input value
  const sorted = [...points].sort((a, b) => a[0] - b[0])
  
  // Find segment containing value
  for (let i = 0; i < sorted.length - 1; i++) {
    const [inMin, outMin] = sorted[i]
    const [inMax, outMax] = sorted[i + 1]
    
    if (value >= inMin && value <= inMax) {
      return mapRange(value, inMin, inMax, outMin, outMax)
    }
  }
  
  // Value outside all segments
  if (value < sorted[0][0]) {
    return sorted[0][1]
  }
  
  return sorted[sorted.length - 1][1]
}