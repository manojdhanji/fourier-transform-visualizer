
export const WAVEFORM_TYPES = {
    "SUM_OF_SINES": {
        type: 'sumOfSines',
        label: 'Sum of Sines',
        ft: "f(t) = sin(2π·1t) + 0.5·sin(2π·3t) + 0.20·sin(2π·5t)"
    },
    "SUM_OF_COSINES": {
        type: 'sumOfCosines',
        label: 'Sum of Cosines',
        ft: "f(t) = cos(2π·2t) + 0.5·cos(2π·4t) + 0.20·cos(2π·6t)"
    },
    "BEATING_SINE": {
        type: 'beatingSine',
        label: 'Beating Sine',
        ft: "f(t) = sin(2π·5t) + sin(2π·5.2t)"
    },
    "HALF_RECTIFIED_SINE": {
        type: 'halfRectifiedSine',
        label: 'Half-Rectified Sine',
        ft: "f(t) = max(0, sin(2πt))"
    },
    "AM_WAVE": {
        type: 'amWave',
        label: 'Amplitude Modulated Wave',
        ft: "f(t) = (1 + 0.5·sin(2π·1t))·sin(2π·10t)"
    },
    "FM_WAVE": {
        type: 'fmWave',
        label: 'Frequency Modulated Wave',
        ft: "f(t) = sin(2π·(10t + 2·sin(2π·1t)))"
    },
    "CHIRP_WAVE": {
        type: 'chirpWave',
        label: 'Chirp Wave',
        ft: "f(t) = sin(2π·((1 + 19t)·t))"
    },
    "IRRATIONAL_MIX": {
        type: 'irrationalMix',
        label: 'Irrational Frequency Mix',
        ft: "f(t) = sin(2π·√2·t) + 0.7·sin(2π·√3·t)"
    },
    "SQUARE": {
        type: 'square',
        label: 'Square Wave',
        ft: "f(t) = sign(sin(2πt))"
    },
    "SAWTOOTH": {
        type: 'sawtooth',
        label: 'Sawtooth Wave',
        ft: "f(t) = 2·(t mod 1) − 1"
    },
    "TRIANGLE": {
        type: 'triangle',
        label: 'Triangle Wave',
        ft: "f(t) = 2·|2·(t mod 1) − 1| − 1"
    },
    "PULSE_TRAIN": {
        type: 'pulseWave',
        label: 'Pulse Train',
        ft: "f(t) = 1 if (t mod 1) < 0.1 else -1"
    },
    "DECAYING_SINE": {
        type: 'decayingSine',
        label: 'Decaying Sine',
        ft: "f(t) = e^(-2t)·sin(2π·8t)"
    }
};
export const N = 2048; // number of samples to generate
export const TIME_WINDOW = 1; // seconds

