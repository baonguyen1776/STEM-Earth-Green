/**
 * Vector Math Utility
 * 
 * Các hàm toán học vector 3D cơ bản
 * 
 * @module utils/math/vector
 * 
 * Design principles:
 * - Immutable: Không modify input vectors
 * - Pure functions: Không side effects
 * - Lightweight: Không dùng Three.js Vector3 để tránh dependency
 */

import type { Vector3 } from '../../types/Earth.types'

/**
 * Add Vectors
 * 
 * Cộng 2 vectors
 * 
 * @param a - Vector A
 * @param b - Vector B
 * @returns a + b
 * 
 * @example
 * ```typescript
 * add({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 })
 * // { x: 5, y: 7, z: 9 }
 * ```
 */
export function add(a: Vector3, b: Vector3): Vector3 {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  }
}

/**
 * Subtract Vectors
 * 
 * Trừ 2 vectors
 * 
 * @param a - Vector A
 * @param b - Vector B
 * @returns a - b
 * 
 * @example
 * ```typescript
 * subtract({ x: 5, y: 7, z: 9 }, { x: 1, y: 2, z: 3 })
 * // { x: 4, y: 5, z: 6 }
 * ```
 */
export function subtract(a: Vector3, b: Vector3): Vector3 {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  }
}

/**
 * Multiply Vector by Scalar
 * 
 * Nhân vector với số
 * 
 * @param vec - Vector
 * @param scalar - Số nhân
 * @returns vec * scalar
 * 
 * @example
 * ```typescript
 * multiplyScalar({ x: 1, y: 2, z: 3 }, 2)
 * // { x: 2, y: 4, z: 6 }
 * ```
 */
export function multiplyScalar(vec: Vector3, scalar: number): Vector3 {
  return {
    x: vec.x * scalar,
    y: vec.y * scalar,
    z: vec.z * scalar,
  }
}

/**
 * Divide Vector by Scalar
 * 
 * Chia vector cho số
 * 
 * @param vec - Vector
 * @param scalar - Số chia
 * @returns vec / scalar
 * 
 * @example
 * ```typescript
 * divideScalar({ x: 2, y: 4, z: 6 }, 2)
 * // { x: 1, y: 2, z: 3 }
 * ```
 */
export function divideScalar(vec: Vector3, scalar: number): Vector3 {
  if (scalar === 0) {
    console.warn('divideScalar: division by zero, returning zero vector')
    return { x: 0, y: 0, z: 0 }
  }
  
  return {
    x: vec.x / scalar,
    y: vec.y / scalar,
    z: vec.z / scalar,
  }
}

/**
 * Dot Product
 * 
 * Tích vô hướng của 2 vectors
 * 
 * @param a - Vector A
 * @param b - Vector B
 * @returns a · b
 * 
 * @example
 * ```typescript
 * dot({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })  // 0 (perpendicular)
 * dot({ x: 1, y: 0, z: 0 }, { x: 1, y: 0, z: 0 })  // 1 (parallel)
 * ```
 */
export function dot(a: Vector3, b: Vector3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

/**
 * Cross Product
 * 
 * Tích có hướng của 2 vectors
 * Trả về vector vuông góc với cả a và b
 * 
 * @param a - Vector A
 * @param b - Vector B
 * @returns a × b
 * 
 * @example
 * ```typescript
 * cross({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })
 * // { x: 0, y: 0, z: 1 }
 * ```
 */
export function cross(a: Vector3, b: Vector3): Vector3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }
}

/**
 * Length (Magnitude)
 * 
 * Độ dài của vector
 * 
 * @param vec - Vector
 * @returns ||vec||
 * 
 * @example
 * ```typescript
 * length({ x: 3, y: 4, z: 0 })  // 5
 * length({ x: 1, y: 1, z: 1 })  // ~1.732
 * ```
 */
export function length(vec: Vector3): number {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z)
}

/**
 * Length Squared
 * 
 * Bình phương độ dài (nhanh hơn length vì không cần sqrt)
 * 
 * @param vec - Vector
 * @returns ||vec||^2
 * 
 * @example
 * ```typescript
 * lengthSquared({ x: 3, y: 4, z: 0 })  // 25
 * ```
 */
export function lengthSquared(vec: Vector3): number {
  return vec.x * vec.x + vec.y * vec.y + vec.z * vec.z
}

/**
 * Distance
 * 
 * Khoảng cách giữa 2 điểm
 * 
 * @param a - Point A
 * @param b - Point B
 * @returns ||b - a||
 * 
 * @example
 * ```typescript
 * distance({ x: 0, y: 0, z: 0 }, { x: 3, y: 4, z: 0 })  // 5
 * ```
 */
export function distance(a: Vector3, b: Vector3): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const dz = b.z - a.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * Distance Squared
 * 
 * Bình phương khoảng cách (nhanh hơn distance)
 * 
 * @param a - Point A
 * @param b - Point B
 * @returns ||b - a||^2
 */
export function distanceSquared(a: Vector3, b: Vector3): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const dz = b.z - a.z
  return dx * dx + dy * dy + dz * dz
}

/**
 * Normalize
 * 
 * Chuẩn hóa vector về độ dài 1
 * 
 * @param vec - Vector
 * @returns Normalized vector
 * 
 * @example
 * ```typescript
 * normalize({ x: 3, y: 4, z: 0 })
 * // { x: 0.6, y: 0.8, z: 0 }
 * ```
 */
export function normalize(vec: Vector3): Vector3 {
  const len = length(vec)
  
  if (len === 0) {
    console.warn('normalize: zero vector, returning zero vector')
    return { x: 0, y: 0, z: 0 }
  }
  
  return {
    x: vec.x / len,
    y: vec.y / len,
    z: vec.z / len,
  }
}

/**
 * Lerp Vectors
 * 
 * Linear interpolation giữa 2 vectors
 * 
 * @param a - Start vector
 * @param b - End vector
 * @param t - Time (0-1)
 * @returns Interpolated vector
 * 
 * @example
 * ```typescript
 * lerpVectors({ x: 0, y: 0, z: 0 }, { x: 10, y: 10, z: 10 }, 0.5)
 * // { x: 5, y: 5, z: 5 }
 * ```
 */
export function lerpVectors(a: Vector3, b: Vector3, t: number): Vector3 {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  }
}

/**
 * Angle Between Vectors
 * 
 * Góc giữa 2 vectors (radians)
 * 
 * @param a - Vector A
 * @param b - Vector B
 * @returns Angle in radians (0 to π)
 * 
 * @example
 * ```typescript
 * angleBetween({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })
 * // Math.PI / 2 (90 degrees)
 * ```
 */
export function angleBetween(a: Vector3, b: Vector3): number {
  const dotProduct = dot(a, b)
  const lengthA = length(a)
  const lengthB = length(b)
  
  if (lengthA === 0 || lengthB === 0) {
    return 0
  }
  
  const cosAngle = dotProduct / (lengthA * lengthB)
  // Clamp to [-1, 1] để tránh NaN do floating point errors
  const clampedCos = Math.max(-1, Math.min(1, cosAngle))
  
  return Math.acos(clampedCos)
}

/**
 * Project Vector onto Another
 * 
 * Chiếu vector a lên vector b
 * 
 * @param a - Vector to project
 * @param b - Vector to project onto
 * @returns Projected vector
 * 
 * @example
 * ```typescript
 * project({ x: 3, y: 4, z: 0 }, { x: 1, y: 0, z: 0 })
 * // { x: 3, y: 0, z: 0 }
 * ```
 */
export function project(a: Vector3, b: Vector3): Vector3 {
  const bLengthSq = lengthSquared(b)
  
  if (bLengthSq === 0) {
    return { x: 0, y: 0, z: 0 }
  }
  
  const scalar = dot(a, b) / bLengthSq
  return multiplyScalar(b, scalar)
}

/**
 * Reflect Vector
 * 
 * Phản chiếu vector qua normal
 * 
 * @param vec - Vector to reflect
 * @param normal - Normal vector (should be normalized)
 * @returns Reflected vector
 * 
 * @example
 * ```typescript
 * // Reflect downward vector off horizontal surface
 * reflect({ x: 1, y: -1, z: 0 }, { x: 0, y: 1, z: 0 })
 * // { x: 1, y: 1, z: 0 }
 * ```
 */
export function reflect(vec: Vector3, normal: Vector3): Vector3 {
  const dotProduct = dot(vec, normal)
  return {
    x: vec.x - 2 * dotProduct * normal.x,
    y: vec.y - 2 * dotProduct * normal.y,
    z: vec.z - 2 * dotProduct * normal.z,
  }
}

/**
 * Clamp Vector Magnitude
 * 
 * Giới hạn độ dài vector
 * 
 * @param vec - Vector
 * @param maxLength - Max length
 * @returns Clamped vector
 * 
 * @example
 * ```typescript
 * clampMagnitude({ x: 3, y: 4, z: 0 }, 3)
 * // { x: 1.8, y: 2.4, z: 0 } (length = 3)
 * ```
 */
export function clampMagnitude(vec: Vector3, maxLength: number): Vector3 {
  const len = length(vec)
  
  if (len <= maxLength) {
    return vec
  }
  
  const scale = maxLength / len
  return multiplyScalar(vec, scale)
}

/**
 * Random Vector in Sphere
 * 
 * Tạo random vector trong hình cầu
 * 
 * @param radius - Sphere radius
 * @returns Random vector
 * 
 * @example
 * ```typescript
 * const randomPos = randomInSphere(5)  // Vector trong sphere bán kính 5
 * ```
 */
export function randomInSphere(radius: number): Vector3 {
  // Generate uniform random point in sphere
  const u = Math.random()
  const v = Math.random()
  const theta = 2 * Math.PI * u
  const phi = Math.acos(2 * v - 1)
  const r = Math.cbrt(Math.random()) * radius
  
  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.sin(phi) * Math.sin(theta),
    z: r * Math.cos(phi),
  }
}

/**
 * Random Vector on Sphere Surface
 * 
 * Tạo random vector trên bề mặt hình cầu
 * 
 * @param radius - Sphere radius
 * @returns Random vector on surface
 */
export function randomOnSphere(radius: number): Vector3 {
  const theta = Math.random() * 2 * Math.PI
  const phi = Math.acos(2 * Math.random() - 1)
  
  return {
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.sin(phi) * Math.sin(theta),
    z: radius * Math.cos(phi),
  }
}

/**
 * Zero Vector
 * 
 * @returns { x: 0, y: 0, z: 0 }
 */
export function zero(): Vector3 {
  return { x: 0, y: 0, z: 0 }
}

/**
 * One Vector
 * 
 * @returns { x: 1, y: 1, z: 1 }
 */
export function one(): Vector3 {
  return { x: 1, y: 1, z: 1 }
}

/**
 * Up Vector
 * 
 * @returns { x: 0, y: 1, z: 0 }
 */
export function up(): Vector3 {
  return { x: 0, y: 1, z: 0 }
}

/**
 * Down Vector
 * 
 * @returns { x: 0, y: -1, z: 0 }
 */
export function down(): Vector3 {
  return { x: 0, y: -1, z: 0 }
}

/**
 * Forward Vector
 * 
 * @returns { x: 0, y: 0, z: -1 }
 */
export function forward(): Vector3 {
  return { x: 0, y: 0, z: -1 }
}

/**
 * Back Vector
 * 
 * @returns { x: 0, y: 0, z: 1 }
 */
export function back(): Vector3 {
  return { x: 0, y: 0, z: 1 }
}

/**
 * Clone Vector
 * 
 * Tạo bản copy của vector
 * 
 * @param vec - Vector to clone
 * @returns Cloned vector
 */
export function clone(vec: Vector3): Vector3 {
  return { x: vec.x, y: vec.y, z: vec.z }
}

/**
 * Equals
 * 
 * So sánh 2 vectors
 * 
 * @param a - Vector A
 * @param b - Vector B
 * @param epsilon - Tolerance (default: 0.0001)
 * @returns true if equal
 */
export function equals(a: Vector3, b: Vector3, epsilon: number = 0.0001): boolean {
  return (
    Math.abs(a.x - b.x) < epsilon &&
    Math.abs(a.y - b.y) < epsilon &&
    Math.abs(a.z - b.z) < epsilon
  )
}