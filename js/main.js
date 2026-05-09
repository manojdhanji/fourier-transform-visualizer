// ---------------------------------------------------------
// Main Orchestrator for Fourier Transform Visualizer
// ---------------------------------------------------------
import { computeDFT } from './dft.js';
import { generateSamples } from './waveform.js';
import { drawWaveform, drawSpectrumFrame, drawWinding } from './drawing.js';
import { N, TIME_WINDOW, WAVEFORM_TYPES } from './utils.js';


// Canvas references
const canvasWaveform = document.getElementById('waveform');
const canvasSpectrum = document.getElementById('spectrum');
const canvasWinding = document.getElementById('winding');

// 2D contexts
const ctxWaveform = canvasWaveform.getContext('2d');
const ctxSpectrum = canvasSpectrum.getContext('2d');
const ctxWinding = canvasWinding.getContext('2d');

const waveformSelect = document.getElementById('waveformSelect');


// Populate dropdown from WAVEFORM_TYPES
Object.entries(WAVEFORM_TYPES).forEach(([key, obj]) => {
    const opt = document.createElement('option');
    opt.value = key;          // "SUM_OF_SINES", "SUM_OF_COSINES", "SQUARE", etc.
    opt.textContent = obj.label;
    waveformSelect.appendChild(opt);
});


// Resize canvases to match CSS size
function resizeCanvases() {
    [canvasWaveform, canvasSpectrum, canvasWinding].forEach(canvas => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    });
}

function generateCurrentSamples(typeKey) {
    const type = WAVEFORM_TYPES[typeKey] || WAVEFORM_TYPES.SUM_OF_SINES;
    return {
        type,
        samples: generateSamples(N, TIME_WINDOW, type.type)
    };
}

const eqBox = document.getElementById('equationBox');
// Initial setup
function init(typeKey = "SUM_OF_SINES") {
    resizeCanvases();
    const { type, samples } = generateCurrentSamples(typeKey);

    // Draw the waveform in the top panel
    drawWaveform(ctxWaveform, samples);
    // Update equation box
    eqBox.textContent = type.ft;
}

document.addEventListener('DOMContentLoaded', () => {
    // Set default selection
    waveformSelect.value = "SUM_OF_SINES";
    init(); // initial call to set up the visualizer
});

// Handle window resize
window.addEventListener('resize', () => {
    init(waveformSelect.value);
});

waveformSelect.addEventListener("change", () => {
    init(waveformSelect.value);
});

let spectrumAnim = 0;
function animateSpectrum(ctx, dft) {
    spectrumAnim += 0.01; // adjust speed here
    const t = Math.min(spectrumAnim, 1);

    drawSpectrumFrame(ctx, dft, t);

    if (t < 1) {
        requestAnimationFrame(() => animateSpectrum(ctx, dft));
    }
}

let windingT = 0;
let windingRunning = false;
let samples = [];
let currentK = 0;
function animateWinding() {
    if (!windingRunning) return;

    windingT += 0.005;
    if (windingT > 1) windingT = 1;

    // Stop the animation once the full winding path is drawn
    if (windingT === 1) {
        windingRunning = false;
    }
    drawWinding(ctxWinding, samples, currentK, windingT);
    requestAnimationFrame(animateWinding);
}


// Handle DFT computation on button click
const btnDFT = document.getElementById('computeBtn');
btnDFT.addEventListener('click', () => {
    console.log("Computing DFT...");

    // Only resize spectrum canvas, not all canvases
    canvasSpectrum.width = canvasSpectrum.clientWidth;
    canvasSpectrum.height = canvasSpectrum.clientHeight;

    samples = generateCurrentSamples(waveformSelect.value).samples;
    const dft = computeDFT(samples);
    globalThis.currentDFT = dft;
    console.log("DFT length:", dft.length);
    console.log("First 5 bins:", dft.slice(0, 5));

    spectrumAnim = 0;
    animateSpectrum(ctxSpectrum, dft);

    // Start winding animation
    windingT = 0;
    windingRunning = true;
    animateWinding();
});

const sliderK = document.getElementById("freqSlider");
sliderK.addEventListener("input", () => {
    currentK = Number(sliderK.value);
    globalThis.currentK = currentK;  // make it globally accessible for drawing.js
    document.getElementById("kLabel").textContent = currentK;
});
