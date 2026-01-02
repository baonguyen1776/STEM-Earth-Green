/**
 * Clamp Utility
 * 
 * Giới hạn giá trị trong khoảng [min, max]
 * 
 * @module utils/math/clamp
 * 
 * Design principles:
 * - Pure function
 * - Handle edge cases (min > max, NaN, Infinity)
 * - Performance optimized
 */

/**
 * Clamp
 * 
 * Giới hạn value trong khoảng [min, max]
 * 
 * @param value - Giá trị cần clamp
 * @param min - Giá trị tối thiểu
 * @param max - Giá trị tối đa
 * 
 * @returns Giá trị đã được clamp
 * 
 * @example
 * ```typescript
 * clamp(50, 0, 100)    // 50 (trong range)
 * clamp(-10, 0, 100)   // 0 (dưới min)
 * clamp(150, 0, 100)   // 100 (trên max)
 * clamp(50, 100, 0)    // 50 (min > max, return value)
 * ```
 * 
 * @example Use case: Pollution level validation
 * ```typescript
 * const userInput = 150
 * const validPollution = clamp(userInput, 0, 100)  // 100
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
    if (min > max) {
        console.warn(`clamp: min (${min}) is greater than max (${max}). Returning original value (${value}).`);
        return value;
    }

    return Math.max(min, Math.min(max, value));
}

/**
 * Clamp 0-1
 * 
 * Clamp giá trị về [0, 1] (thường dùng cho normalized values)
 * 
 * @param value - Giá trị cần clamp
 * @returns Giá trị trong khoảng [0, 1]
 * 
 * @example
 * ```typescript
 * clamp01(0.5)   // 0.5
 * clamp01(-0.5)  // 0
 * clamp01(1.5)   // 1
 * ```
 */
export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

/**
 * Clamp Angle
 * 
 * Clamp góc về khoảng [0, 2π] hoặc [-π, π]
 * 
 * @param angle - Góc (radians)
 * @param mode - '0-2pi' hoặc '-pi-pi'
 * @returns Góc đã clamp
 * 
 * @example
 * ```typescript
 * clampAngle(Math.PI * 3, '0-2pi')     // Math.PI
 * clampAngle(Math.PI * 3, '-pi-pi')    // -Math.PI
 * ```
 */
export function clampAngle(
    angle: number, 
    mode: '0-2pi' | '-pi-pi' = '0-2pi'
): number {
    const TWO_PI = Math.PI * 2
    const PI = Math.PI

    let normalizedAngle = angle % TWO_PI
    if (normalizedAngle < 0) {
        normalizedAngle += TWO_PI
    }

    if (mode == '-pi-pi') {
        if (normalizedAngle > PI) {
            normalizedAngle -= TWO_PI
        }
    }
    
    return normalizedAngle
}

/**
 * Clamp Vector (component-wise)
 * 
 * Clamp từng component của vector
 * 
 * @param vec - Vector [x, y, z]
 * @param min - Min value cho tất cả components
 * @param max - Max value cho tất cả components
 * @returns Clamped vector
 * 
 * @example
 * ```typescript
 * clampVector([150, -10, 50], 0, 100)  // [100, 0, 50]
 * ```
 */
export function clampVector(
  vec: number[],
  min: number,
  max: number
): number[] {
  return vec.map(component => clamp(component, min, max))
}

/**
 * Clamp Magnitude
 * 
 * Clamp độ dài (magnitude) của vector, giữ nguyên hướng
 * 
 * @param vec - Vector [x, y, z]
 * @param maxMagnitude - Độ dài tối đa
 * @returns Vector với magnitude đã clamp
 * 
 * @example
 * ```typescript
 * const vec = [3, 4, 0]  // magnitude = 5
 * clampMagnitude(vec, 3)  // [1.8, 2.4, 0] (magnitude = 3)
 * ```
 */
export function clampMagnitude(vec: number[], maxMagnitude: number): number[] {
  const magnitude = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0))
  
  if (magnitude <= maxMagnitude) {
    return vec
  }
  
  const scale = maxMagnitude / magnitude
  return vec.map(v => v * scale)
}

/**
 * Soft Clamp
 * 
 * "Mềm" clamp: giá trị gần min/max sẽ bị giảm tốc độ thay đổi
 * Tạo transition mượt mà hơn hard clamp
 * 
 * @param value - Giá trị cần clamp
 * @param min - Min value
 * @param max - Max value
 * @param softness - Độ "mềm" (0-1)
 *   - 0: Hard clamp (giống clamp thông thường)
 *   - 1: Rất mềm (smooth transition)
 * 
 * @returns Soft clamped value
 * 
 * @example
 * ```typescript
 * softClamp(110, 0, 100, 0.2)  // ~105 (thay vì 100)
 * ```
 */
export function softClamp(
  value: number,
  min: number,
  max: number,
  softness: number = 0.1
): number {
  if (value < min) {
    const diff = min - value
    return min - diff / (1 + diff * softness)
  }
  
  if (value > max) {
    const diff = value - max
    return max + diff / (1 + diff * softness)
  }
  
  return value
}

/**
 * Wrap
 * 
 * "Quấn" giá trị về khoảng [min, max]
 * Khác clamp: giá trị vượt quá sẽ loop về đầu
 * 
 * @param value - Giá trị cần wrap
 * @param min - Min value
 * @param max - Max value
 * @returns Wrapped value
 * 
 * @example
 * ```typescript
 * wrap(5, 0, 10)    // 5
 * wrap(15, 0, 10)   // 5 (15 - 10)
 * wrap(-5, 0, 10)   // 5 (0 + 5)
 * ```
 * 
 * @example Use case: Angle wrapping
 * ```typescript
 * const angle = wrap(Math.PI * 3, 0, Math.PI * 2)  // Math.PI
 * ```
 */
export function wrap(value: number, min: number, max: number): number {
  const range = max - min
  
  if (range === 0) {
    return min
  }
  
  let wrapped = value - min
  wrapped = ((wrapped % range) + range) % range
  return wrapped + min
}

/**
 * Snap to Grid
 * 
 * "Snap" giá trị về grid gần nhất
 * 
 * @param value - Giá trị cần snap
 * @param gridSize - Kích thước grid
 * @returns Snapped value
 * 
 * @example
 * ```typescript
 * snapToGrid(37, 10)   // 40
 * snapToGrid(32, 10)   // 30
 * snapToGrid(35, 10)   // 40 (round up từ 35)
 * ```
 */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize
}

/**
 * Clamp with Deadzone
 * 
 * Clamp với vùng chết (deadzone) ở giữa
 * Giá trị trong deadzone = 0
 * 
 * @param value - Input value
 * @param deadzone - Deadzone size (0-1)
 * @param min - Min value
 * @param max - Max value
 * @returns Clamped value với deadzone
 * 
 * @example
 * ```typescript
 * clampWithDeadzone(0.05, 0.1, -1, 1)  // 0 (trong deadzone)
 * clampWithDeadzone(0.5, 0.1, -1, 1)   // ~0.44 (scaled)
 * ```
 * 
 * @example Use case: Gamepad input
 * ```typescript
 * const joystickX = 0.05  // Drift nhẹ
 * const x = clampWithDeadzone(joystickX, 0.1, -1, 1)  // 0 (ignore drift)
 * ```
 */
export function clampWithDeadzone(
  value: number,
  deadzone: number,
  min: number,
  max: number
): number {
  // Clamp deadzone về [0, 1]
  const clampedDeadzone = clamp01(deadzone)
  
  if (Math.abs(value) < clampedDeadzone) {
    return 0
  }
  
  // Scale value bên ngoài deadzone
  const sign = Math.sign(value)
  const absValue = Math.abs(value)
  const scaledValue = (absValue - clampedDeadzone) / (1 - clampedDeadzone)
  
  return clamp(sign * scaledValue * max, min, max)
}

/**
 * Safe Divide with Clamp
 * 
 * Chia an toàn với clamp kết quả
 * Tránh divide by zero và Infinity
 * 
 * @param numerator - Tử số
 * @param denominator - Mẫu số
 * @param min - Min result
 * @param max - Max result
 * @param defaultValue - Giá trị trả về nếu denominator = 0
 * @returns Clamped division result
 * 
 * @example
 * ```typescript
 * safeDivide(10, 2, 0, 100, 0)   // 5
 * safeDivide(10, 0, 0, 100, 0)   // 0 (default)
 * safeDivide(200, 2, 0, 100, 0)  // 100 (clamped)
 * ```
 */
export function safeDivide(
  numerator: number,
  denominator: number,
  min: number,
  max: number,
  defaultValue: number = 0
): number {
  if (denominator === 0 || !isFinite(denominator)) {
    return clamp(defaultValue, min, max)
  }
  
  const result = numerator / denominator
  
  if (!isFinite(result)) {
    return clamp(defaultValue, min, max)
  }
  
  return clamp(result, min, max)
}