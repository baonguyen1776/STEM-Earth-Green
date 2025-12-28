/**
 * Earth configuration 
 * 
 * Chứa tất cả các thông số liên quan đến Trái Đất 3D
 * 
 * @module config/earthConfig
 * Design principles:
 * - Single Source of Truth: Mọi thông số Earth đều ở đây
 * - Type-safe: Dùng 'as const' để TypeScript infer literal types
 * - Immutable: Không ai được phép sửa config sau khi khởi tạo
 */

/** 
 * Cấu hình Trái Đất
 */
export const EARTH_GEOMETRY = {
    radius: 5,
    widthSegments: 64,
    heightSegments: 64,

} as const;

/**
 * Cấu hình Animation Trái Đất
 */
export const EARTH_ANIMATION = {
    rotationSpeed: 0.001,
    idleRotationSpeed: 0.0005,
} as const;

/**
 * Cấu hình Position Trái Đất
 */
export const EARTH_POSITION = {
    x: 0,
    y: 0,
    z: 0,
} as const;

/**
 * Cấu hình Material Trái Đất
 */
export const EARTH_MATERIAL = {
    roughness: 1,
    metalness: 0,
    castShadow: true,
    receiveShadow: true,
    normalScale: 0.05,
} as const;

/**
 * Cấu hình Texture
 * Đường dẫn tới các texture trong src/assets/textures
 */
export const EARTH_ASSETS = {
    dayMap: '/src/assets/textures/2k_earth_daymap.jpg',
    nightMap: '/src/assets/textures/2k_earth_nightmap.jpg',
    normalMap: '/src/assets/textures/2k_earth_normal_map.tif',
    specularMap: '/src/assets/textures/2k_earth_specular_map.tif',
    cloudMap: '/src/assets/textures/2k_earth_clouds.jpg',
} as const;

/**
 * Cấu hình lớp mây
 */
export const EARTH_CLOUDS = {
    radius: 5.05, // Lớn hơn bán kính trái đất một chút
    rotationSpeed: 0.0012,
} as const;

export const EARTH_CONFIG = {
    geometry: EARTH_GEOMETRY,
    animation: EARTH_ANIMATION,
    position: EARTH_POSITION,
    material: EARTH_MATERIAL,
    assets: EARTH_ASSETS,
    clouds: EARTH_CLOUDS,
} as const;

export type EarthConfig = typeof EARTH_CONFIG
export type EarthGeometry = typeof EARTH_GEOMETRY
export type EarthAnimation = typeof EARTH_ANIMATION
export type EarthPosition = typeof EARTH_POSITION
export type EarthMaterial = typeof EARTH_MATERIAL
export type EarthAssets = typeof EARTH_ASSETS
export type EarthClouds = typeof EARTH_CLOUDS