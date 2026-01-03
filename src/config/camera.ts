/**
 * Camera Configuration
 * 
 * Cấu hình cho Three.js PerspectiveCamera và OrbitControls
 * 
 * @module config/camera
 * 
 * Design principles:
 * - Separation of concerns: Camera settings vs Controls settings
 * - Responsive: Aspect ratio tự động tính từ window
 * - Reusable: Có thể dùng cho nhiều camera khác nhau
 */

/**
 * Perspective Camera Configuration
 * 
 * Cấu hình cho Three.js PerspectiveCamera
 * 
 * @see https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
 */
export const CAMERA_PERSPECTIVE = {
    /**
     * Field of View (độ rộng góc nhìn)
     * 
     * - Giá trị nhỏ (< 50): Zoom in, giống telephoto lens
     * - Giá trị vừa (50-75): Tự nhiên, giống mắt người
     * - Giá trị lớn (> 75): Wide angle, fish-eye effect
     * 
     * @default 75 (sweet spot cho 3D scenes)
     * @unit degrees
     */
    fov: 75,

    /**
     * Aspect Ratio
     * 
     * Tỷ lệ width/height của viewport
     * Thường được tính động: window.innerWidth / window.innerHeight
     * 
     * @default 16/9 (placeholder, sẽ được override)
     */
    aspect: 16 / 9,

    /**
     * Near Clipping Plane
     * 
     * Khoảng cách gần nhất mà camera có thể "nhìn thấy"
     * Object gần hơn near sẽ bị clip (không render)
     * 
     * Lưu ý: Không set quá nhỏ (< 0.01) vì gây z-fighting
     * 
     * @default 0.1
     * @unit Three.js units
     */
    near: 0.1,

    /**
     * Far Clipping Plane
     * 
     * Khoảng cách xa nhất mà camera có thể "nhìn thấy"
     * Object xa hơn far sẽ không được render
     * 
     * Lưu ý: Không set quá lớn vì giảm precision của depth buffer
     * 
     * @default 1000
     * @unit Three.js units
     */
    far: 1000,
} as const

/**
 * Camera Position Configuration
 * 
 * Vị trí ban đầu của camera trong không gian 3D
 */
export const CAMERA_POSITION = {
    x: 0,
    y: 0,

    /**
     * Vị trí Z (khoảng cách từ camera đến origin)
     * Công thức tham khảo:
     * - z = radius * 3: Nhìn gần, thấy chi tiết
     * - z = radius * 5: Sweet spot, cân bằng
     * - z = radius * 10: Nhìn xa, thấy tổng thể
     * 
     * z=12: Earth fills screen nicely, comfortable cinematic view on load
     */
    z: 10,
} as const

/**
 * Camera Position for Intro
 * 
 * Vị trí camera khi bắt đầu intro animation
 */
export const CAMERA_INTRO_POSITION = {
    x: 0,
    y: 0,
    z: 50,
} as const

/**
 * OrbitControls Configuration
 * 
 * Cấu hình cho Three.js OrbitControls
 * 
 * @see https://threejs.org/docs/#examples/en/controls/OrbitControls
 */
export const ORBIT_CONTROLS = {
    enableDamping: true,
    dampingFactor: 0.05,
    enableZoom: true,
    zoomSpeed: 1.0,
    minDistance: 8,  // User can zoom in to this distance
    maxDistance: 25,  // User can zoom out to this distance - keeps Earth prominent
    enableRotate: true,
    rotateSpeed: 1.0,
    enablePan: false,
    autoRotate: false,
    autoRotateSpeed: 2.0,

    /**
     * Min polar angle
     * 
     * Góc nhỏ nhất từ trục Y (giới hạn xoay lên)
     * 
     * - 0: Có thể nhìn từ trên đỉnh Trái Đất
     * - Math.PI / 4: Giới hạn ở 45 độ
     * 
     * @default 0 (không giới hạn)
     * @unit radians
     */
    minPolarAngle: 0,

    /**
     * Max polar angle
     * 
     * Góc lớn nhất từ trục Y (giới hạn xoay xuống)
     * 
     * - Math.PI: Có thể nhìn từ dưới đáy Trái Đất
     * - Math.PI / 2: Giới hạn ở horizon
     * 
     * @default Math.PI (không giới hạn)
     * @unit radians
     */
    maxPolarAngle: Math.PI,

    /**
     * Screen space panning
     * 
     * Pan theo screen space thay vì world space
     * 
     * @default true
     */
    screenSpacePanning: true,
} as const

/**
 * Animation Configuration
 * 
 * Cấu hình cho camera animations (intro, transitions)
 */
export const CAMERA_ANIMATION = {
    /**
     * Thời gian animation zoom in khi intro
     * 
     * @default 3.0
     * @unit seconds
     */
    introDuration: 3.0,

    /**
     * Intro easing
     * 
     * Easing function cho intro animation
     * 
     * @default "power2.inOut"
     * @see https://greensock.com/docs/v3/Eases
     */
    introEasing: 'power2.inOut',

    /**
     * Thời gian chuyển đổi giữa các view
     * @default 1.5
     * @unit seconds
     */
    transitionDuration: 1.5,

    /**
     * Transition easing
     * @default "power1.inOut"
     */
    transitionEasing: 'power1.inOut',
} as const

/**
 * Combined Camera Config
 * 
 * Export tất cả camera config vào 1 object
 */
export const CAMERA_CONFIG = {
    perspective: CAMERA_PERSPECTIVE,
    position: CAMERA_POSITION,
    introPosition: CAMERA_INTRO_POSITION,
    controls: ORBIT_CONTROLS,
    animation: CAMERA_ANIMATION,
} as const

/**
 * Helper: Calculate optimal camera distance
 * 
 * Tính toán khoảng cách camera tối ưu dựa trên object radius
 * 
 * @param objectRadius - Bán kính object cần nhìn
 * @param fov - Field of view của camera (degrees)
 * @returns Optimal camera z position
 * 
 * @example
 * ```typescript
 * const distance = calculateCameraDistance(5, 75) // ~7.5
 * camera.position.z = distance
 * ```
 */
export function calculateCameraDistance(
    objectRadius: number,
    fov: number = CAMERA_PERSPECTIVE.fov
): number {
    const fovRadians = (fov * Math.PI) / 180
    const distance = objectRadius / Math.tan(fovRadians / 2)
    return distance * 1.5 // Thêm 50% để có khoảng trống xung quanh
}

/**
 * Helper: Get responsive aspect ratio
 * 
 * Tính aspect ratio từ window size
 * 
 * @returns Current window aspect ratio
 */
export function getAspectRatio(): number {
    return window.innerWidth / window.innerHeight
}

/**
 * Type exports
 */
export type CameraPerspective = typeof CAMERA_PERSPECTIVE
export type CameraPosition = typeof CAMERA_POSITION
export type OrbitControlsConfig = typeof ORBIT_CONTROLS
export type CameraAnimation = typeof CAMERA_ANIMATION
export type CameraConfig = typeof CAMERA_CONFIG