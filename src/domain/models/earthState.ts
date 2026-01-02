/**
 * Earth State Domain Model
 * 
 * Quản lý trạng thái của Earth (pollution, rotation, etc.)
 * 
 * @module domain/models/EarthState
 * 
 * Design principles:
 * - Encapsulation: State được protect, chỉ sửa qua methods
 * - Immutable: Không expose internal state trực tiếp
 * - Observable: Emit events khi state thay đổi
 * - Validation: Validate mọi input
 */

import { clamp } from '../../utils/math'
import {
  getPollutionInfo,
  getPollutionSeverity,
  isPollutionLevelChanged,
  validatePollutionValue,
  type PollutionLevelInfo,
} from './pollutionLevel'
import type { EarthState as IEarthState } from '../../types/Earth.types'

/**
 * Earth State Change Event
 */
export interface EarthStateChangeEvent {
    type: 'pollution_changed' | 'rotation_changed' | 'scale_changed' | 'state_reset'
    oldState: Readonly<IEarthState>
    newState: Readonly<IEarthState>
    timestamp: number
}

/**
 * Earth State Change Listener
 */
export type EarthStateChangeListener = (event: EarthStateChangeEvent) => void


/**
 * Earth State Class
 * 
 * Quản lý tất cả state của Earth
 * 
 * @example
 * ```typescript
 * const earthState = new EarthState()
 * 
 * // Listen to changes
 * earthState.addListener(event => {
 *   console.log('State changed:', event)
 * })
 * 
 * // Update pollution
 * earthState.setPollution(75)
 * 
 * // Get info
 * console.log(earthState.getPollutionInfo())
 * ```
 */
export class EarthState {
    // PRIVATE STATE
    private _pollutionLevel: number = 0
    private _rotation: number = 0
    private _scale: number = 1.0
    private _listeners: Set<EarthStateChangeListener> = new Set()
    private _pollutionHistory: number[] = []
    private readonly MAX_HISTORY_SIZE = 100

    // CONSTRUCTOR
    /** 
     * Create new Earth State
     * @param initialPollution - Initial pollution level (default: 0)
     */
    constructor(initialPollution: number = 0) {
        this.setPollution(initialPollution, { silent: true })
    }

    // POLLUTION GETTERS
    /**
     * Get current pollution value (0-100)
     */
    getPollutionLevel(): number {
        return this._pollutionLevel
    }

    /**
     * Get normalized pollution level (0-1)
     */
    getNormalizedPollution(): number {
        return this._pollutionLevel / 100
    }
    /**
     * Get pollution severity (0-1)
     */
    getPollutionSeverity(): number {
        return getPollutionSeverity(this._pollutionLevel)
    }

    /**
     * Get complete pollution info
     */
    getPollutionInfo(): PollutionLevelInfo {
        return getPollutionInfo(this._pollutionLevel)
    }

    /**
     * Get pollution history
     */
    getPollutionHistory(): readonly number[] {
        return [...this._pollutionHistory]
    }

    // POLLUTION SETTERS
    /**
     * Set pollution level
     * 
     * @param value - New pollution level (0-100)
     * @param options - Options
     *   - silent: Don't emit events (default: false)
     *   - skipValidation: Skip validation (default: false)
     * 
     * @throws Error if validation fails and skipValidation is false
     * 
     * @example
     * ```typescript
     * earthState.setPollution(75)
     * earthState.setPollution(75, { silent: true })  // No events
     * ```
     */
    setPollution(
        value: number,
        options: { silent?: boolean; skipValidator?: boolean } = {}
    ): void {
        const { silent = false, skipValidator = false } = options

        // Validate input
        if (!skipValidator) {
            const validation = validatePollutionValue(value)
            if (!validation.valid) {
                throw new Error(
                    `Invalid pollution value: ${validation.errors.join(', ')}`
                )
            }
        }

        const clampedValue = clamp(value, 0, 100)
        
        if (clampedValue === this._pollutionLevel) {
            return // No change
        }
        
        const oldState = this.getSnapshot()

        this._pollutionLevel = clampedValue

        // Add to history
        this._pollutionHistory.push(clampedValue)
        if (this._pollutionHistory.length > this.MAX_HISTORY_SIZE) {
            this._pollutionHistory.shift()
        }
        
        // Emit event
        if (!silent) {
            this.emitChange('pollution_changed', oldState)
        }
    }
    

    /**
     * Increment pollution
     * 
     * @param delta - Amount to increment (can be negative)
     * @returns New pollution level
     */
    incrementPollution(delta: number): number {
        const newValue = this._pollutionLevel + delta
        this.setPollution(newValue)
        return this._pollutionLevel
    }

    /**
     * Reset pollution to 0
     */
    resetPollution(): void {
        this.setPollution(0)
    }

    // ROTATION GETTERS/SETTERS
    /**
     * Get current rotation (radians)
     */
    getRotation(): number {
        return this._rotation
    }

    /**
     * Set rotation
     * 
     * @param radians - Rotation angle in radians
     * @param options - Options
     */
    setRotation(
        radians: number,
        options: { silent?: boolean } = {}
    ): void {
        const { silent = false } = options

        if (radians === this._rotation) {
        return
        }

        const oldState = this.getSnapshot()
        this._rotation = radians

        if (!silent) {
        this.emitChange('rotation_changed', oldState)
        }
    }

    /**
     * Increment rotation
     * 
     * @param delta - Angle to add (radians)
     * @returns New rotation
     */
    incrementRotation(delta: number): number {
        this.setRotation(this._rotation + delta)
        return this._rotation
    }

    /**
     * Reset rotation to 0
     */
    resetRotation(): void {
        this.setRotation(0)
    }

    // SCALE GETTERS/SETTERS
    /**
     * Get current scale
     */
    getScale(): number {
        return this._scale
    }

    /**
     * Set scale
     * 
     * @param scale - Scale multiplier (should be > 0)
     * @param options - Options
     */
    setScale(
        scale: number,
        options: { silent?: boolean } = {}
    ): void {
        const { silent = false } = options

        // Validate
        if (scale <= 0) {
        throw new Error('Scale must be greater than 0')
        }

        if (scale === this._scale) {
        return
        }

        const oldState = this.getSnapshot()
        this._scale = scale

        if (!silent) {
        this.emitChange('scale_changed', oldState)
        }
    }

    /**
     * Reset scale to 1.0
     */
    resetScale(): void {
        this.setScale(1.0)
    }

    // STATE SNAPSHOT
    /**
     * Get immutable snapshot of current state
     * 
     * @return Readonly state snapshot  
     */   
    getSnapshot(): Readonly<IEarthState> {
        return Object.freeze({
            pollutionLevel: this._pollutionLevel,
            rotation: this._rotation,
            scale: this._scale,
        })
    }

    /**
     * Restore state from snapshot
     * 
     * @param snapshot = State snapshot to restore
     * @param options - Options
     */
    restoreSnapshot(
        snapshot: IEarthState,
        options: { silent?: boolean } = {}
    ): void {
        const { silent = false } = options
        const oldState = this.getSnapshot()

        this._pollutionLevel = clamp(snapshot.pollutionLevel, 0, 100)
        this._rotation = snapshot.rotation
        this._scale = snapshot.scale

        if (!silent) {
            this.emitChange('state_reset', oldState)
        }
    }

    // EVENT LISTENERS
    /**
     * Add state change listener
     * 
     * @param listener - Listener function
     * @returns Unsubscribe function
     * 
     * @example
     * ```typescript
     * const unsubscribe = earthState.addListener(event => {
     *   console.log('Changed:', event.type)
     * })
     * 
     * // Later...
     * unsubscribe()
     * ```
     */
    addListener(listener: EarthStateChangeListener): () => void {
        this._listeners.add(listener)

        // Return unsubscribe function
        return () => {
        this._listeners.delete(listener)
        }
    }

    /**
     * Remove state change listener
     * 
     * @param listener - Listener to remove
     */
    removeListener(listener: EarthStateChangeListener): void {
        this._listeners.delete(listener)
    }

    /**
     * Remove all listeners
     */
    removeAllListeners(): void {
        this._listeners.clear()
    }

    /**
     * Emit change event to all listeners
     * @param type - Event type
     * @param oldState - Previous state snapshot
     */
    private emitChange(
        type: EarthStateChangeEvent['type'],
        oldState: Readonly<IEarthState>
    ): void {
        const event: EarthStateChangeEvent = {
            type,
            oldState,
            newState: this.getSnapshot(),
            timestamp: Date.now(),
        }

        // Notify all listeners
        this._listeners.forEach(listener => {
            try {
                listener(event)
            } catch (error) {
                console.error('Error in state change listener:', error)
            }
        })
    }

    // UTILITY METHODS
    /**
     * Check if pollution level has changed since last check
     * 
     * @return true if level changed
     */
    hasPollutionLevelChanged(): boolean {
        if (this._pollutionHistory.length < 2) {
            return false
        }

        const current = this._pollutionHistory[this._pollutionHistory.length - 1]
        const previous = this._pollutionHistory[this._pollutionHistory.length - 2]
        return isPollutionLevelChanged(previous, current)
    }

    /**
     * Export state to JSON
     * 
     * @returns JSON string
     */
    toJSON(): string {
        return JSON.stringify({
        pollutionLevel: this._pollutionLevel,
        rotation: this._rotation,
        scale: this._scale,
        history: this._pollutionHistory,
        timestamp: Date.now(),
        })
    }

    /**
     * Import state from JSON
     * 
     * @param json - JSON string
     * @param options - Options
     */
    fromJSON(json: string, options: { silent?: boolean } = {}): void {
        try {
        const data = JSON.parse(json)

        this.restoreSnapshot(
            {
            pollutionLevel: data.pollutionLevel ?? 0,
            rotation: data.rotation ?? 0,
            scale: data.scale ?? 1.0,
            },
            options
        )

        if (Array.isArray(data.history)) {
            this._pollutionHistory = data.history
        }
        } catch (error) {
        throw new Error(`Failed to parse state JSON: ${error}`)
        }
    }

    /**
     * Clone this state
     * 
     * @returns New EarthState instance with same values
     */
    clone(): EarthState {
        const cloned = new EarthState(this._pollutionLevel)
        cloned._rotation = this._rotation
        cloned._scale = this._scale
        cloned._pollutionHistory = [...this._pollutionHistory]
        return cloned
    }

    /**
     * Debug info
     */
    toString(): string {
        const info = this.getPollutionInfo()
        return `EarthState { pollution: ${this._pollutionLevel}% (${info.label}), rotation: ${this._rotation.toFixed(2)}, scale: ${this._scale.toFixed(2)} }`
    }
}