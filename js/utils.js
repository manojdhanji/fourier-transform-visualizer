
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
    "HALF_RECTIFIED_SINE": {
        type: 'halfRectifiedSine',
        label: 'Half-Rectified Sine',
        ft: "f(t) = max(0, sin(2πt))"
    }
};
export const N = 2048; // number of samples to generate
export const TIME_WINDOW = 1; // seconds

