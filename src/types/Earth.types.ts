/**
 * Earth Type Definitions
 * 
 * Định nghĩa tất cả types liên quan đến Earth model và 3D objects
 * 
 * @module types/Earth.types
 * 
 * Design principles:
 * - Interface over Type: Dùng interface khi có thể extend
 * - Readonly: Properties không nên thay đổi từ bên ngoài
 * - Semantic naming: Tên type phải rõ ràng, không gây nhầm lẫn
 * - Self-documenting: JSDoc cho mọi type export
 */

/**
 * Vector3 Interface
 * 
 * Đại diện cho một điểm hoặc vector trong không gian 3D
 * 
 * @example
 * ```typescript
 * const position: Vector3 = { x: 0, y: 5, z: 10 }
 * const velocity: Vector3 = { x: 1, y: 0, z: -1 }
 * ```
 */
export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

/**
 * Readonly Vector3
 * 
 * Vector3 không thể thay đổi sau khi tạo
 * Dùng cho config, constants   
 */
export type ReadonlyVector3 = Readonly<Vector3>;

export interface Rotation extends Vector3 { }
export interface Scale extends Vector3 { }

export interface Transform {
    position: Vector3
    rotation: Rotation
    scale: Scale
}

/**
 * Earth State Interface
 * 
 * Trạng thái hiện tại của Earth model
 * 
 * @example
 * ```typescript
 * const state: EarthState = {
 *   pollutionLevel: 50,
 *   rotation: 0,
 *   scale: 1.0
 * }
 * ```
 */
export interface EarthState {
    pollutionLevel: number;
    rotation: number;
    scale: number;
}

/**
 * Earth Properties Interface
 * 
 * Properties cơ bản của Earth model nói cách khác là thông số kĩ thuật của mô hình Trái Đất
 * Immutable sau khi khởi tạo
 */
export interface EarthProperties {
    readonly radius: number;
    readonly segment: number; // Độ chi tiết của bề mặt Trái Đất
    readonly rotationSpeed: number;
    readonly initialPosition: ReadonlyVector3
    readonly castShadow: boolean; // Mô hình Trái Đất có thể chiếu bóng không
    readonly receiveShadow: boolean; // Mô hình Trái Đất có nhận bóng không
}

/** Cấu hình vật liệu tương thích với MeshStandardMaterial của Three.js */
export interface MaterialProperties {
    color?: string;
    roughness: number;
    metalness: number;
    opacity?: number;
    transparent?: boolean;
    emissive?: string;
    emissiveIntensity?: number;
    bumpScale?: number;
}

/** Texture information */
export interface TextureInfo {
    path: string; // Đường dẫn đến file texture
    loaded: boolean; // Texture đã được tải chưa
    error?: string; // Error message nếu có
}

/** Quản lý tập hợp texture cần thiết để render Trái Đất */
export interface EarthTextures {
    day: TextureInfo;
    night: TextureInfo;
    clouds: TextureInfo;
    normal?: TextureInfo;
    specular?: TextureInfo;
}

// ENUMS, EVENTS AND UPDATE
export const EarthEvent = {
    POLLUTION_CHANGED: 'pollution_changed',
    ROTATION_COMPLETE: 'rotation_complete',
    TEXTURE_LOADED: 'texture_loaded',
    READY: 'ready',
    ERROR: 'error'
}

export type EarthEventType = typeof EarthEvent[keyof typeof EarthEvent];

export interface EarthEventData {
    type: EarthEventType;
    timestamp: number;
    payload?: any;
}

/** Dữ liệu dùng để cập nhật Trái Đất mỗi frame */
export interface EarthUpdateData {
    pollutionLevel?: number;
    deltaTime: number;
}

// --- 5. TYPE UTILITIES & GUARDS ---

/** * Deep Readonly Utility
 * Đảm bảo tính bất biến tuyệt đối cho các object lồng nhau (như Transform)
 */
export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
};

/** Type Guard để kiểm tra tính hợp lệ của chỉ số ô nhiễm */
export function isValidPollutionLevel(value: any): value is number {
    return typeof value === 'number' && value >= 0 && value <= 100;
}

export type ReadonlyTransform = DeepReadonly<Transform>;
export type ReadonlyEarthProperties = DeepReadonly<EarthProperties>;