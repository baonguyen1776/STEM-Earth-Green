/**
 * Core Module
 * 
 * Barrel export cho Three.js infrastructure
 * 
 * @module core
 * 
 * Usage:
 * ```typescript
 * import { Renderer, SceneManager, CameraManager, AnimationLoop } from './core'
 * 
 * // Initialize
 * const renderer = new Renderer({ container: '#app' })
 * const sceneManager = new SceneManager()
 * const cameraManager = new CameraManager({ domElement: renderer.domElement })
 * const loop = new AnimationLoop()
 * 
 * // Setup render loop
 * loop.add('render', () => {
 *   cameraManager.update()
 *   renderer.render(sceneManager.scene, cameraManager.camera)
 * })
 * 
 * loop.start()
 * ```
 */

// Classes
export { Renderer } from './Renderer'
export { SceneManager } from './SceneManager'
export { CameraManager } from './CameraManager'
export { AnimationLoop } from './AnimationLoop'

// Types
export type { RendererOptions } from './Renderer'
export type { SceneManagerOptions, LightConfig } from './SceneManager'
export type { CameraManagerOptions } from './CameraManager'
export type { AnimationLoopOptions, AnimationCallback } from './AnimationLoop'
