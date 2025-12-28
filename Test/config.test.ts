import { COLORS, hexToRgb, rgbToHex, getColorWithAlpha } from '../src/config/colors';
import { EARTH_CONFIG } from '../src/config/earthConfig';
import {
    POLLUTION_THRESHOLDS,
    PollutionLevel,
    getPollutionLevelFromValue,
    getThresholdInfo
} from '../src/config/pollutionThresholds';
import {
    CAMERA_CONFIG,
    calculateCameraDistance
} from '../src/config/camera';

/**
 * STEM Earth Green - Config Test Suite
 * 
 * run: npx tsx Test/config.test.ts
 */

console.log('Starting STEM Earth Green Config Tests...\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`[PASS] ${message}`);
    } else {
        failedTests++;
        console.error(`[FAIL] ${message}`);
    }
}

function group(name: string) {
    console.log(`\nTesting Group: ${name}`);
}

// 1. COLORS CONFIG TESTS
group('Colors Config (colors.ts)');

// Check Hex Format matches #RRGGBB
const hexRegex = /^#[0-9A-Fa-f]{6}$/;
assert(hexRegex.test(COLORS.earth.clean), 'Earth clean color is valid hex');
assert(hexRegex.test(COLORS.ui.error), 'UI error color is valid hex');

// Test Helper: hexToRgb
const rgb = hexToRgb('#ff0000');
assert(rgb.r === 255 && rgb.g === 0 && rgb.b === 0, 'hexToRgb(#ff0000) returns correct RGB');

// Test Helper: rgbToHex
const hex = rgbToHex(0, 255, 0);
assert(hex === '#00ff00', 'rgbToHex(0, 255, 0) returns #00ff00');

// Test Helper: getColorWithAlpha
const rgba = getColorWithAlpha('#0000ff', 0.5);
assert(rgba === 'rgba(0, 0, 255, 0.5)', 'getColorWithAlpha returns correct RGBA string');

// 2. EARTH CONFIG TESTS
group('Earth Config (earthConfig.ts)');

assert(EARTH_CONFIG.geometry.radius > 0, 'Earth radius must be positive');
assert(EARTH_CONFIG.animation.rotationSpeed > 0, 'Rotation speed must be positive');

// 3. POLLUTION CONFIG TESTS
group('Pollution Thresholds (pollutionThresholds.ts)');

// Test Threshold Logic
assert(getPollutionLevelFromValue(10) === PollutionLevel.CLEAN, 'Value 10 is CLEAN');
assert(getPollutionLevelFromValue(30) === PollutionLevel.LIGHT, 'Value 30 is LIGHT');
assert(getPollutionLevelFromValue(60) === PollutionLevel.MODERATE, 'Value 60 is MODERATE');
assert(getPollutionLevelFromValue(90) === PollutionLevel.SEVERE, 'Value 90 is SEVERE');

// Test Color Integration
const severeInfo = getThresholdInfo(PollutionLevel.SEVERE);
assert(severeInfo.color === COLORS.ui.error, 'Severe pollution Level uses COLORS.ui.error');
assert(severeInfo.color !== undefined, 'Threshold info has color property');

// Test Range Validity
const cleanRange = POLLUTION_THRESHOLDS[PollutionLevel.CLEAN];
assert(cleanRange.min === 0 && cleanRange.max === 20, 'Clean range is 0-20');

// 4. CAMERA CONFIG TESTS
group('Camera Config (camera.ts)');

assert(CAMERA_CONFIG.perspective.fov === 75, 'Default FOV is 75');
assert(CAMERA_CONFIG.controls.enableDamping === true, 'Orbit controls damping is enabled');

// Test Calculation Helper
const camDist = calculateCameraDistance(5); // radius 5
assert(camDist > 5, 'Camera distance is always > Object radius');

// SUMMARY
console.log('\n==========================================');
console.log(`Tests Finished`);
console.log(`Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);

if (failedTests > 0) {
    console.error('[FAIL] SOME TESTS FAILED');
    process.exit(1);
} else {
    console.log('[PASS] ALL TESTS PASSED');
    process.exit(0);
}
