/**
 * UI Module
 * 
 * Barrel export cho UI components
 * 
 * @module ui
 * 
 * Usage:
 * ```typescript
 * import { PollutionSlider, InfoPanel, IntroScreen, IntroController } from './ui'
 * 
 * const slider = new PollutionSlider({ onChange: (v) => earth.setPollutionLevel(v) })
 * const panel = new InfoPanel({ position: 'top-right' })
 * const intro = new IntroScreen({ onStart: () => introController.play() })
 * ```
 */

// Pollution Slider
export { PollutionSlider } from './PollutionSlider'
export type { PollutionSliderOptions } from './PollutionSlider'

// Info Panel
export { InfoPanel } from './InfoPanel'
export type { InfoPanelOptions } from './InfoPanel'

// Intro Screen
export { IntroScreen } from './IntroScreen'
export type { IntroScreenOptions } from './IntroScreen'

// Intro Controller
export { IntroController } from './IntroController'
export type { IntroControllerOptions } from './IntroController'
