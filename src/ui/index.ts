/**
 * UI Module
 * 
 * Barrel export cho UI components
 * 
 * @module ui
 * 
 * Usage:
 * ```typescript
 * import { PollutionSlider, InfoPanel, SimpleOverlay, IntroController } from './ui'
 * 
 * const slider = new PollutionSlider({ onChange: (v) => earth.setPollutionLevel(v) })
 * const panel = new InfoPanel({ position: 'top-right' })
 * const overlay = new SimpleOverlay({ onStart: () => introController.play() })
 * ```
 */

// Pollution Slider
export { PollutionSlider } from './PollutionSlider'
export type { PollutionSliderOptions } from './PollutionSlider'

// Info Panel
export { InfoPanel } from './InfoPanel'
export type { InfoPanelOptions } from './InfoPanel'

// Simple Overlay (intro screen with text + button, main Earth visible behind)
export { SimpleOverlay } from './SimpleOverlay'
export type { SimpleOverlayOptions } from './SimpleOverlay'

// Intro Controller (camera animation)
export { IntroController } from './IntroController'
export type { IntroControllerOptions } from './IntroController'
