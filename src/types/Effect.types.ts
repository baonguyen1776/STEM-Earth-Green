/**
 * Effect Type Definitions
 * Định nghĩa type cho tất cả các visual effects (Starfied, Smoke, Trash, Particles, etc...)
 * 
 * @module types/Effect.types
 * 
 * Design principles:
 * - Reusable: Generic types cho particle systems
 * - Extensible: Easy to add new effect types
 * - Type-safe: Ênums for effect types
 */

import type { Vector3, MaterialProperties } from './Earth.types'

export const TrashType = {
    PLASTIC: 'plastic',
    METAL: 'metal',
    ORGANIC: 'organic',
    GLASS: 'glass',
    PAPER: 'paper',
}
export type TrashType = typeof TrashType[keyof typeof TrashType];

/**
 * Enum for different effect types
 */
export const EffectType = {
    STARFIELD: 'starfield',
    SMOKE: 'smoke',
    TRASH: 'trash',
    FIRE: 'fire',
    EXPLOSION: 'explosion',
    RAIN: 'rain',
    CUSTOM: 'custom',
} as const;

export type EffectType = typeof EffectType[keyof typeof EffectType];

/**
 * Effect Events Enum
 */
export const EffectEvent = {
    STARTED: 'started',
    STOPPED: 'stopped',
    INTENSITY_CHANGED: 'intensity_changed',
    PERFORMANCE_WARNING: 'performance_warning',
    DISPOSED: 'disposed',
} as const;

export type EffectEvent = typeof EffectEvent[keyof typeof EffectEvent];

/**
 * Particle Interface đại diện cho 1 particle đơn lẻ
 */
export interface Particle {
    id: string;
    position: Vector3;
    velocity: Vector3;
    acceleration: Vector3;
    size: number;
    opacity: number;
    color: string; // Hex color code
    lifetime: number; // in seconds
    age: number; // in seconds
    rotation: number;
    rotationSpeed: number; // in radians per second
    active: boolean;
}

/**
 * Particle System Interface đại diện cho hệ thống particle
 */
export interface ParticleSystemConfig {
    maxParticles: number;
    emissionRate: number;
    particleLifetime: number;
    particleSize: number;
    sizeVariation: number;
    starColor: string;
    startOpacity: number;
    endOpacity: number;
    gravity: Vector3;
    spawnPosition: Vector3;
    spawnRadius: number;
    velocityRange: {
        min: Vector3;
        max: Vector3;
    }
    recycle: boolean;
    texturePath?: string;
    blendMode?: 'normal' | 'additive' | 'multiply' | 'screen';
}

/**
 * Starfield Config Interface
 * Cấu hình riêng cho hiệu ứng Starfield
 */
export interface StarfieldConfig {
    startCount: number; // Số lượng sao ban đầu
    startSize: number; // Kích thước sao ban đầu
    startColor: string;
    opacity: number;
    distributionRadius: number; // Bán kính phân bố sao
    autoRotate: boolean;
    rotationSpeed: number; 
    twinkle: boolean; // Hiệu ứng nhấp nháy
    twinkleSpeed: number;
}

/**
 * Smoke Config Interface
 * Cấu hình riêng cho hiệu ứng Smoke
 */
export interface SmokeConfig {
    particleCount: number; // Số lượng hạt khói
    denisty: number; // Mật độ khói
    riseSpeed: number;
    spreadRate: number;
    color: string;
    opacity: number;
    motionBlur: boolean; // Hiệu ứng mờ chuyển động
    spawnPosition: Vector3;
    spawnRadius: number;
}

/**
 * Trash Config Interface
 * Cấu hình riêng cho hiệu ứng Trash
 */
export interface TrashConfig {
    trashCount: number;
    minSize: number;
    maxSize: number;
    types: TrashType[];
    floatOnWater: boolean;
    floatHeight: number;
    waveAmplitude: number; // Biên độ sóng ảnh hưởng đến rác
    waveFrequency: number; // Tần số sóng ảnh hưởng đến rác
    distributionArea: {
        center: Vector3;
        radius: number;
    }
}

/**
 * Trash Piece Interface
 * Đại diện cho 1 mảnh rác
 */
export interface TrashPiece {
    id: string;
    type: TrashType;
    position: Vector3;
    rotation: Vector3;
    size: number;
    color: string;
    floating: boolean;
    wavePhase: number;
}

/**
 * Effect State Interface
 * Trạng thái runtime của một effect
 */
export interface EffectState {
    type: EffectType;
    active: boolean;
    visible: boolean;
    intensity: number;
    activeParticleCount: number;
    performance: {
        frameTime: number;
        lagging: boolean;
    };
}

/**
 * Effect Update Data Interface
 * Data truyền vào khi update effect
 */
export interface EffectUpdateData {
    deltaTime: number;
    pollutionLevel: number;
    cameraPosition?: Vector3;
    forceUpdate?: boolean;
}

/**
 * Effect Event Data Interface
 */
export interface EffectEventData {
    type: EffectEvent;
    effectType: EffectType;
    timestamp: number;
    payload?: any;
}

/**
 * Animation Curve Interface
 * Định nghĩa animation curve cho particle properties
 */
export interface AnimationCurve {
    keyframes: Array<{
        time: number;
        value: number;
        easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
    }>;
}

/**
 * Effect Material Config Interface
 * Material config cho effects
 */
export interface EffectMaterialConfig extends MaterialProperties {
    pointSize?: number;
    sizeAttenuation?: boolean;
    depthWrite?: boolean;
    depthTest?: boolean;
    blending?: 'normal' | 'additive' | 'subtractive' | 'multiply';
}

/**
 * LOD Config Interface
 * Level of Detail configuration cho effects
 */
export interface EffectLODConfig {
    distances: number[];
    particleCounts: number[];
    updateRates: number[];
}

/**
 * Effect Pool Interface
 * Object pool cho reuse particles
 */
export interface EffectPool<T> {
    acquire(): T;
    release(obj: T): void;
    reset(): void;
    size: number;
    available: number;
}

/**
 * Type Guards
 */
export function isParticleSystemConfig(
    config: any
): config is ParticleSystemConfig {
    return (
        typeof config === 'object' &&
        config !== null &&
        typeof config.maxParticles === 'number' &&
        typeof config.emissionRate === 'number'
    );
}

export function isEffectActive(state: EffectState): boolean {
    return state.active && state.visible;
}

/**
 * Type Utilities
 */
export type PartialEffectConfig<T> = Partial<T>;
export type EffectCallback = (data: EffectEventData) => void;
export type EffectFactory<T> = (config: T) => any;

