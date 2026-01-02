/**
 * Math Utilities
 * 
 * Barrel export file cho tất cả math utilities
 * 
 * @module utils/math
 * 
 * Usage:
 * ```typescript
 * // Import tất cả
 * import * as MathUtils from './utils/math'
 * MathUtils.lerp(0, 100, 0.5)
 * 
 * // Import selective
 * import { lerp, clamp, mapRange } from './utils/math'
 * ```
 */

export {
    lerp,
    lerpClamped,
    inverseLerp,
    smoothStep,
    smootherStep,
    lerpAngle,
    multiLerp,
    easeInQuad,
    easeOutQuad,
    easeInOutQuad
} from './lerp'

export {
    clamp,
    clamp01,
    clampAngle,
    clampMagnitude,
    clampVector,
    clampWithDeadzone,
    softClamp,
    wrap,
    snapToGrid,
    safeDivide
} from './clamp'

export {
  mapRange,
  mapRangeClamped,
  normalize,
  denormalize,
  mapToPercentage,
  mapFromPercentage,
  remap,
  exponentialMap,
  sigmoidMap,
  mapWithCurve,
  inverseMap,
  multiPointMap,
} from './map'

export {
  add,
  subtract,
  multiplyScalar,
  divideScalar,
  dot,
  cross,
  length,
  lengthSquared,
  distance,
  distanceSquared,
  normalize as normalizeVector,
  lerpVectors,
  angleBetween,
  project,
  reflect,
  clampMagnitude as clampVectorMagnitude,
  randomInSphere,
  randomOnSphere,
  zero,
  one,
  up,
  down,
  forward,
  back,
  clone,
  equals,
} from './vector'

export type { Vector3 } from '../../types/Earth.types'

/**
 * Mathematical constants
 */
export const MATH_CONSTANTS = {
  PI: Math.PI,
  TWO_PI: Math.PI * 2,
  HALF_PI: Math.PI / 2,
  QUARTER_PI: Math.PI / 4,

  /** Degrees to Radians multiplier */
  DEG_TO_RAD: Math.PI / 180,

  /** Radians to Degrees multiplier */
  RAD_TO_DEG: 180 / Math.PI,

  /** Euler's number */
  E: Math.E,

  /** Golden ratio */
  GOLDEN_RATIO: (1 + Math.sqrt(5)) / 2,
  
  SQRT2: Math.SQRT2,
  EPSILON: 0.0001,
} as const

// HELPER FUNCTIONS

/**
 * Convert degrees to radians
 * 
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 * 
 * @example
 * ```typescript
 * degToRad(180)  // Math.PI
 * degToRad(90)   // Math.PI / 2
 * ```
 */
export function degToRad(degrees: number): number {
  return degrees * MATH_CONSTANTS.DEG_TO_RAD
}

/**
 * Convert radians to degrees
 * 
 * @param radians - Angle in radians
 * @returns Angle in degrees
 * 
 * @example
 * ```typescript
 * radToDeg(Math.PI)      // 180
 * radToDeg(Math.PI / 2)  // 90
 * ```
 */
export function radToDeg(radians: number): number {
  return radians * MATH_CONSTANTS.RAD_TO_DEG
}

/**
 * Check if number is approximately equal to another
 * 
 * @param a - Number A
 * @param b - Number B
 * @param epsilon - Tolerance
 * @returns true if approximately equal
 * 
 * @example
 * ```typescript
 * approximately(0.1 + 0.2, 0.3)  // true (handles floating point errors)
 * ```
 */
export function approximately(
  a: number,
  b: number,
  epsilon: number = MATH_CONSTANTS.EPSILON
): boolean {
  return Math.abs(a - b) < epsilon
}

/**
 * Check if number is power of 2
 * 
 * @param value - Number to check
 * @returns true if power of 2
 * 
 * @example
 * ```typescript
 * isPowerOfTwo(8)   // true
 * isPowerOfTwo(10)  // false
 * ```
 */
export function isPowerOfTwo(value: number): boolean {
  return value > 0 && (value & (value - 1)) === 0
}

/**
 * Round to nearest multiple
 * 
 * @param value - Value to round
 * @param multiple - Multiple to round to
 * @returns Rounded value
 * 
 * @example
 * ```typescript
 * roundToNearest(37, 5)  // 35
 * roundToNearest(38, 5)  // 40
 * ```
 */
export function roundToNearest(value: number, multiple: number): number {
  return Math.round(value / multiple) * multiple
}

/**
 * Sign function (-1, 0, or 1)
 * 
 * @param value - Number
 * @returns -1 if negative, 1 if positive, 0 if zero
 */
export function sign(value: number): number {
  return value > 0 ? 1 : value < 0 ? -1 : 0
}

/**
 * Pingpong between 0 and length
 * 
 * Bounces value back and forth between 0 and length
 * 
 * @param t - Time value
 * @param length - Length to pingpong
 * @returns Pingpong value (0 to length)
 * 
 * @example
 * ```typescript
 * pingPong(0.5, 1)   // 0.5
 * pingPong(1.5, 1)   // 0.5
 * pingPong(2.5, 1)   // 0.5
 * ```
 */
export function pingPong(t: number, length: number): number {
  t = ((t % (length * 2)) + length * 2) % (length * 2)
  return t > length ? length * 2 - t : t
}

/**
 * Repeat value in range
 * 
 * @param t - Value
 * @param length - Range length
 * @returns Value wrapped in [0, length]
 * 
 * @example
 * ```typescript
 * repeat(3.5, 3)   // 0.5
 * repeat(-0.5, 3)  // 2.5
 * ```
 */
export function repeat(t: number, length: number): number {
  return ((t % length) + length) % length
}

/**
 * Random in range
 * 
 * @param min - Min value
 * @param max - Max value
 * @returns Random value in [min, max]
 * 
 * @example
 * ```typescript
 * randomRange(0, 100)  // Random between 0 and 100
 * ```
 */
export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

/**
 * Random int in range
 * 
 * @param min - Min value (inclusive)
 * @param max - Max value (inclusive)
 * @returns Random integer in [min, max]
 * 
 * @example
 * ```typescript
 * randomInt(1, 6)  // Dice roll (1-6)
 * ```
 */
export function randomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Seed-based random (simple LCG)
 * 
 * Deterministic random number generator
 * 
 * @param seed - Seed value
 * @returns Random function that uses seed
 * 
 * @example
 * ```typescript
 * const rand = seededRandom(12345)
 * rand()  // Always same sequence for same seed
 * ```
 */
export function seededRandom(seed: number): () => number {
  let state = seed
  
  return function () {
    // LCG parameters (Numerical Recipes)
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}
