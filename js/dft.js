// ---------------------------------------------------------
// Discrete Fourier Transform (DFT) Module
// ---------------------------------------------------------
//
// Input:  samples[]  (array of real values)
// Output: array of complex frequency bins:
//         [
//            { re, im, mag, phase },
//            ...
//         ]
//
// This is the core engine for:
//   - Spectrum plot
//   - Winding diagram
//   - Phasor animation
// ---------------------------------------------------------

export function computeDFT(samples) {
    const N = samples.length;
    const result = new Array(N);

    for (let k = 0; k < N; k++) {
        let re = 0;
        let im = 0;

        for (let n = 0; n < N; n++) {
            const angle = (-2 * Math.PI * k * n) / N;
            re += samples[n] * Math.cos(angle);
            im += samples[n] * Math.sin(angle);
        }

        // Normalize
        re /= N;
        im /= N;

        const mag = Math.hypot(re, im);
        const phase = Math.atan2(im, re);

        result[k] = { re, im, mag, phase };
    }

    return result;
}
