// ---------------------------------------------------------
// Main Orchestrator for Fourier Transform Visualizer
// ---------------------------------------------------------
import { computeDFT } from './dft.js';
import { generateSamples } from './waveform.js';
import { drawWaveform, drawSpectrumFrame, drawSpectrum, drawWinding } from './drawing.js';
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
    // Reset samples and DFT so slider uses correct data
    samples = generateCurrentSamples(waveformSelect.value).samples;
    currentDFT = [];
    // Clear winding canvas — do NOT draw anything yet
    ctxWinding.clearRect(0, 0, canvasWinding.width, canvasWinding.height);

    // Optionally: also clear spectrum
    ctxSpectrum.clearRect(0, 0, canvasSpectrum.width, canvasSpectrum.height);
});

let spectrumAnim = 0;
function animateSpectrum(ctx, dft) {
    spectrumAnim += 0.01; // adjust speed here
    const t = Math.min(spectrumAnim, 1);

    drawSpectrumFrame(ctx, dft, currentK, t);

    if (t < 1) {
        requestAnimationFrame(() => animateSpectrum(ctx, dft));
    }
}

let windingT = 0;
let windingRunning = false;
let samples = [];
let currentK = 0;
let currentDFT = [];

function animateWinding() {
    if (!windingRunning) return;

    windingT = Math.min(windingT + 0.005, 1);
    drawWinding(ctxWinding, samples, currentK, currentDFT, windingT);

    if (windingT < 1) {
        requestAnimationFrame(animateWinding);
    } else {
        windingRunning = false;
    }
}


// Handle DFT computation on button click
const btnDFT = document.getElementById('computeBtn');
btnDFT.addEventListener('click', () => {
    console.log('Computing DFT...');

    // Only resize spectrum canvas, not all canvases
    canvasSpectrum.width = canvasSpectrum.clientWidth;
    canvasSpectrum.height = canvasSpectrum.clientHeight;

    samples = generateCurrentSamples(waveformSelect.value).samples;
    currentDFT = computeDFT(samples);
    console.log('DFT length:', currentDFT.length);
    console.log('First 5 bins:', currentDFT.slice(0, 5));

    spectrumAnim = 0;
    animateSpectrum(ctxSpectrum, currentDFT);

    // Start winding animation
    windingT = 0;
    windingRunning = true;
    animateWinding();
});

const sliderK = document.getElementById('freqSlider');
sliderK.addEventListener('input', () => {
    currentK = Number(sliderK.value);
    document.getElementById('kLabel').textContent = currentK;

    if (currentDFT.length) {
        drawSpectrum(ctxSpectrum, currentDFT, currentK);
        if (!windingRunning) {
            drawWinding(ctxWinding, samples, currentK, currentDFT, 1);
        }
    }
});
