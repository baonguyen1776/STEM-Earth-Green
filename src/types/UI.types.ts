/**
 * UI Type Definitions
 * 
 * Định nghĩa types cho tất cả UI components
 * (Slider, Panel, Button, etc.)
 * 
 * @module types/UI.types
 * 
 * Design principles:
 * - Separation: UI types không phụ thuộc Three.js
 * - Generic: Reusable cho nhiều components
 * - Event-driven: Clear event handler types
 */

import type React from 'react';

/**
 * UI Events Enum
 */
export const UIEvent = {
    SLIDER_CHANGE: 'slider_change',
    BUTTON_CLICK: 'button_click',
    PANEL_OPEN: 'panel_open',
    PANEL_CLOSE: 'panel_close',
    MODAL_OPEN: 'modal_open',
    MODAL_CLOSE: 'modal_close',
    INTRO_START: 'intro_start',
    INTRO_COMPLETE: 'intro_complete',
    INTRO_SKIP: 'intro_skip',
}
export type UIEvent = typeof UIEvent[keyof typeof UIEvent];

/** 
 * UI component base interface
 * Đại diện cho một UI component chung
 */
export interface UIComponent {
    id: string
    visible: boolean
    enabled: boolean
    show(): void
    hide(): void
    enable(): void
    disable(): void
    destroy(): void
}

/**
 * Slider Config Interface
 * Cấu hình cho Slider component
 */
export interface SliderConfig {
    min: number
    max: number
    step: number
    defaultValue: number
    label: string // Nhãn hiển thị bên cạnh slider
    showValue: boolean
    valueFormatter?: (value: number) => string // Hàm định dạng giá trị hiển thị
    orientation: 'horizontal' | 'vertical'
    width?: string // CSS width
    height?: string // CSS height
    className?: string // CSS class
    container?: HTMLElement // Phần tử DOM chứa slider
}

/**
 * Slider State Interface
 */
export interface SliderState {
    value: number
    isDragging: boolean // Trạng thái kéo thả
    isFocused: boolean // Trạng thái focus
    isDisabled: boolean // Trạng thái disabled
}

/** 
 * Slider Event Handlers
 */
export interface SliderEventHandlers {
    onChange?: SliderChangeHandler
    onDragStart?: SliderDragHandler
    onDrag?: SliderDragHandler
    onDragEnd?: SliderDragHandler
    onFocus?: SliderFocusHandler
    onBlur?: SliderFocusHandler
}

export type SliderChangeHandler = (value: number) => void;
export type SliderDragHandler = (value: number, isDragging: boolean) => void;
export type SliderFocusHandler = (isFocused: boolean) => void;

/**
 * Button config interface
 */
export interface ButtonConfig {
    text: string
    icon?: string // URL hoặc class icon
    type: 'primary' | 'secondary' | 'danger' | 'success'
    size: 'small' | 'medium' | 'large'
    fullWidth?: boolean
    disabled?: boolean
    className?: string // CSS class
    container?: HTMLElement // Phần tử DOM chứa button
}

/**
 * Button Event Handlers
 */
export interface ButtonEventHandlers {
    onClick?: ButtonClickHandler
    onHover?: ButtonHoverHandler // Hover vào button
    onLeave?: ButtonHoverHandler // Rời khỏi button
}

export type ButtonClickHandler = (event: MouseEvent) => void;
export type ButtonHoverHandler = () => void;

/**
 * Panel Config Interface
 */
export interface PanelConfig {
    title?: string
    content?: string | HTMLElement // Nội dung có thể là text hoặc phần tử DOM
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
    width?: string
    height?: string
    closeable?: boolean
    draggable?: boolean
    resizable?: boolean
    backgroundOpacity?: number // Độ mờ nền
    className?: string // CSS class
    container?: HTMLElement // Phần tử DOM chứa panel
}

/**
 * Panel State Interface
 */
export interface PanelState {
    isOpen: boolean
    isDragging: boolean
    isResizing: boolean
    position: { x: number; y: number; }
    size: { width: number; height: number; }
}

/**
 * Panel Event Handlers
 */
export interface PanelEventHandlers {
    onOpen?: PanelEventHandler
    onClose?: PanelEventHandler
    onDrag?: PanelDragHandler
    onResize?: PanelResizeHandler
}

export type PanelEventHandler = () => void;
export type PanelDragHandler = (position: { x: number; y: number; }) => void;
export type PanelResizeHandler = (size: { width: number; height: number; }) => void;

/**
 * Info display config interface
 */
export interface InfoDisplayConfig {
    label: string
    value: string | number
    icon?: string
    formatter?: (value: any) => string
    updateInterval?: number // Khoảng thời gian tự động cập nhật (ms)
    className?: string
    container?: HTMLElement
}

/**
 * Toast Notification Config Interface
 */
export interface ToastConfig {
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    duration?: number
    position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    closeable?: boolean
    icon?: string
}

/**
 * Modal Config Interface
 */
export interface ModalConfig {
    title: string
    content: string | HTMLElement
    buttons?: ModalButton[]
    closeOnBackdrop?: boolean
    closeOnEsc?: boolean
    width?: string
    height?: string
    className?: string
}

export interface ModalButton {
    text: string
    type: 'primary' | 'secondary' | 'danger' | 'success'
    onClick: () => void
}

export interface IntroScreenConfig {
    title: string
    subtitle?: string
    backgroundColor?: string
    textColor?: string
    duration?: number
    skippable?: boolean
    skipKey?: string
    animation?: IntroAnimationConfig
}

/**
 * Intro Animation Config Interface
 */
export interface IntroAnimationConfig {
    fadeInDuration: number;
    holdDuration: number;
    fadeOutDuration: number;
    easing: string;
}

/**
 * UI Theme Interface
 */
export interface UITheme {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    fontFamily: string;
    borderRadius: string;
    shadow: string;
}

/**
 * Layout Config Interface
 */
export interface LayoutConfig {
    container: HTMLElement;
    type: 'fixed' | 'fluid' | 'responsive';
    columns?: number;
    spacing?: number;
    padding?: number;
}

/**
 * UI Event Data Interface
 */
export interface UIEventData {
    type: UIEvent;
    componentId: string;
    timestamp: number;
    payload?: any;
}

/**
 * Form Field Interface
 */
export interface FormField {
    name: string;
    type: 'text' | 'number' | 'select' | 'checkbox' | 'radio';
    label: string;
    value: any;
    placeholder?: string;
    required?: boolean;
    validation?: FormValidation;
    options?: Array<{ label: string; value: any }>;
}

/**
 * Form Validation Interface
 */
export interface FormValidation {
    validator: (value: any) => boolean;
    message: string;
}

/**
 * Responsive Breakpoints Interface
 */
export interface ResponsiveBreakpoints {
    mobile: number;
    tablet: number;
    desktop: number;
}

/**
 * UI Animation Config Interface
 */
export interface UIAnimationConfig {
    duration: number;
    easing: string;
    delay?: number;
}

/**
 * Type Guards
 */
export function isHTMLElement(element: any): element is HTMLElement {
    return element instanceof HTMLElement;
}

export function isValidSliderValue(
    value: any,
    config: SliderConfig
): value is number {
    return (
        typeof value === 'number' &&
        value >= config.min &&
        value <= config.max
    );
}

/**
 * Type Utilities
 */
export type UICallback<T = void> = (data: T) => void;
export type UIComponentProps<T> = T & {
    id?: string;
    className?: string;
    style?: React.CSSProperties | Record<string, string | number>;
};
export type UIEventListener = (event: UIEventData) => void;

