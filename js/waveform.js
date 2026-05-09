import { WAVEFORM_TYPES } from './utils.js';

// Strategy pattern for waveform generation
const waveformCache = new Map(); // cache for waveform samples
waveformCache.set(WAVEFORM_TYPES.SUM_OF_SINES.type, sumOfSines);
waveformCache.set(WAVEFORM_TYPES.SUM_OF_COSINES.type, sumOfCosines);
waveformCache.set(WAVEFORM_TYPES.SQUARE.type, squareWave);
waveformCache.set(WAVEFORM_TYPES.SAWTOOTH.type, sawtoothWave);
waveformCache.set(WAVEFORM_TYPES.TRIANGLE.type, triangleWave);
waveformCache.set(WAVEFORM_TYPES.HALF_RECTIFIED_SINE.type, halfRectifiedSineWave);

// ---------------------------------------------------------
// Waveform Generator Module
// ---------------------------------------------------------

// Generate N samples over time range [0, tMax]
export function generateSamples(N, tMax, type) {
    const samples = [];
    const dt = tMax / N;

    for (let n = 0; n < N; n++) {
        const t = n * dt;
        samples.push(waveformCache.get(type)(t));
    }

    return samples;
}

// ---------------------------------------------------------
// Waveform implementations
// ---------------------------------------------------------

// A nice default: 1 Hz + 3 Hz + 5 Hz
function sumOfSines(t) {
    return (
        1.0 * Math.sin(2 * Math.PI * 1 * t) +
        0.5 * Math.sin(2 * Math.PI * 3 * t) +
        0.2 * Math.sin(2 * Math.PI * 5 * t)
    );
}

// A nice default: 2 Hz + 4 Hz + 6 Hz
function sumOfCosines(t) {
    return (
        1.0 * Math.cos(2 * Math.PI * 2 * t) +
        0.5 * Math.cos(2 * Math.PI * 4 * t) +
        0.2 * Math.cos(2 * Math.PI * 6 * t)
    );
}
function squareWave(t) {
    return Math.sign(Math.sin(2 * Math.PI * t));
}

function sawtoothWave(t) {
    return 2 * (t % 1) - 1; // ramp from -1 to 1
}

function triangleWave(t) {
    return 2 * Math.abs(2 * (t % 1) - 1) - 1;
}

function halfRectifiedSineWave(t) {
    const s = Math.sin(2 * Math.PI * t);
    return Math.max(s, 0);
}
