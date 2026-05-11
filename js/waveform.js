import { WAVEFORM_TYPES } from './utils.js';

// Strategy pattern for waveform generation
const waveformCache = new Map(); // cache for waveform samples
waveformCache.set(WAVEFORM_TYPES.SUM_OF_SINES.type, sumOfSines);
waveformCache.set(WAVEFORM_TYPES.SUM_OF_COSINES.type, sumOfCosines);
waveformCache.set(WAVEFORM_TYPES.BEATING_SINE.type, beatingSine);
waveformCache.set(WAVEFORM_TYPES.AM_WAVE.type, amWave);
waveformCache.set(WAVEFORM_TYPES.FM_WAVE.type, fmWave);
waveformCache.set(WAVEFORM_TYPES.CHIRP_WAVE.type, chirpWave);
waveformCache.set(WAVEFORM_TYPES.IRRATIONAL_MIX.type, irrationalMix);
waveformCache.set(WAVEFORM_TYPES.SQUARE.type, squareWave);
waveformCache.set(WAVEFORM_TYPES.SAWTOOTH.type, sawtoothWave);
waveformCache.set(WAVEFORM_TYPES.TRIANGLE.type, triangleWave);
waveformCache.set(WAVEFORM_TYPES.HALF_RECTIFIED_SINE.type, halfRectifiedSineWave);
waveformCache.set(WAVEFORM_TYPES.PULSE_TRAIN.type, pulseWave);
waveformCache.set(WAVEFORM_TYPES.DECAYING_SINE.type, decayingSine);

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
        1 * Math.sin(2 * Math.PI * 1 * t) +
        0.5 * Math.sin(2 * Math.PI * 3 * t) +
        0.2 * Math.sin(2 * Math.PI * 5 * t)
    );
}

// A nice default: 2 Hz + 4 Hz + 6 Hz
function sumOfCosines(t) {
    return (
        1 * Math.cos(2 * Math.PI * 2 * t) +
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

function beatingSine(t) {
    return Math.sin(2 * Math.PI * 5 * t) + Math.sin(2 * Math.PI * 5.2 * t);
}

function amWave(t) {
    return (1 + 0.5 * Math.sin(2 * Math.PI * 1 * t)) * Math.sin(2 * Math.PI * 10 * t);
}

function fmWave(t) {
    return Math.sin(2 * Math.PI * (10 * t + 2 * Math.sin(2 * Math.PI * 1 * t)));
}

function chirpWave(t) {
    const f0 = 1;
    const f1 = 20;
    const ft = f0 + (f1 - f0) * t;
    return Math.sin(2 * Math.PI * ft * t);
}

function irrationalMix(t) {
    return (
        Math.sin(2 * Math.PI * Math.sqrt(2) * t) +
        0.7 * Math.sin(2 * Math.PI * Math.sqrt(3) * t)
    );
}

function pulseWave(t) {
    const duty = 0.1; // 10% duty cycle
    return (t % 1) < duty ? 1 : -1;
}

function decayingSine(t) {
    return Math.exp(-2 * t) * Math.sin(2 * Math.PI * 8 * t);
}

