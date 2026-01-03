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
    rotationSpeed: 0.1,        // radians per second (tăng từ 0.001)
    idleRotationSpeed: 0.05,   // radians per second when idle
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
 * Cấu hình Material Trái Đất - PBR settings for realistic rendering
 */
export const EARTH_MATERIAL = {
    roughness: 0.6,     // Base roughness - ocean will be shinier via specular map
    metalness: 0,       // Earth surface is not metallic
    castShadow: true,
    receiveShadow: true,
    normalScale: 0.8,   // Strong normal map for mountain/terrain shadows
} as const;

/**
 * Cấu hình Texture
 * Đường dẫn tới các texture trong public/textures
 * Vite sẽ copy files từ public/ vào dist/ khi build
 * Import.meta.env.BASE_URL sẽ tự động thêm base path khi deploy lên GitHub Pages
 */
export const EARTH_ASSETS = {
    dayMap: `${import.meta.env.BASE_URL}textures/2k_earth_day_new.png`,
    nightMap: `${import.meta.env.BASE_URL}textures/2k_earth_nightmap.jpg`,
    normalMap: `${import.meta.env.BASE_URL}textures/2k_earth_normal_map.tif`,
    specularMap: `${import.meta.env.BASE_URL}textures/2k_earth_specular_map.tif`,
    cloudMap: `${import.meta.env.BASE_URL}textures/2k_earth_clouds.jpg`,
    // Pollution textures
    pollutedDayMap: `${import.meta.env.BASE_URL}textures/earth-polluted.jpg`,
    pollutedCloudMap: `${import.meta.env.BASE_URL}textures/clouds-polluted.jpg`,
} as const;

/**
 * Cấu hình lớp mây
 */
export const EARTH_CLOUDS = {
    radius: 5.05, // Lớn hơn bán kính trái đất một chút
    rotationSpeed: 0.12, // Mây xoay nhanh hơn Trái Đất một chút
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