// ---------------------------------------------------------
// Drawing Utilities for Fourier Transform Visualizer
// ---------------------------------------------------------

// Draw the time-domain waveform
export function drawWaveform(ctx, samples) {
    const { width, height } = ctx.canvas;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Style
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;

    ctx.beginPath();

    const midY = height / 2;
    const scaleY = height * 0.4; // amplitude scaling

    for (let i = 0; i < samples.length; i++) {
        const x = (i / (samples.length - 1)) * width;
        const y = midY - samples[i] * scaleY;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();
}

// ---------------------------------------------------------
// Internal helper: draws one spectrum frame (static or animated)
// ---------------------------------------------------------
const THRESHOLD = 1e-6;
function drawSpectrumInternal(ctx, dft, t = 1) {
    const selectedK = globalThis.currentK ?? 0;
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Compute magnitudes
    const magnitudes = dft.map(c => c.mag);

    // Only show first half (positive frequencies)
    const half = Math.floor(magnitudes.length / 2);
    const mags = magnitudes.slice(0, half);

    const PADDING = 10;
    const barWidth = Math.max(2, W / half);
    const GAP = 1;
    const maxMag = Math.max(...mags) || 1;


    const AXIS_HEIGHT = 16
    ctx.fillStyle = "#00ff88";
    for (let k = 0; k < half; k++) {
        const m = mags[k] / maxMag;
        const barHeight = (m * t) * (H - AXIS_HEIGHT);  // <-- t = 1 for static, <1 for animation

        const x = PADDING + k * barWidth;
        const y = (H - AXIS_HEIGHT) - barHeight;

        const isPresent = mags[k] > THRESHOLD;
        // Highlight selected frequency bin
        if (k === selectedK && isPresent) {
            ctx.fillStyle = "#ffff00";   // highlight only if present
        } else {
            ctx.fillStyle = "#00ff88";   // normal green
        }

        ctx.fillRect(x, y, barWidth - GAP, barHeight);
    }

    // Draw vertical marker line at selected frequency
    if (selectedK < half && mags[selectedK] > THRESHOLD) {
        const markerX = PADDING + selectedK * barWidth + (barWidth / 2);
        // Compute the top of the selected bar
        const selectedMag = mags[selectedK] / maxMag;
        const selectedBarHeight = selectedMag * (H - AXIS_HEIGHT);
        const selectedY = (H - AXIS_HEIGHT) - selectedBarHeight;
        ctx.strokeStyle = "#ffaa00";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(markerX, selectedY);
        ctx.lineTo(markerX, H - AXIS_HEIGHT);
        ctx.stroke();

        // Label above the bar
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`k=${selectedK}`, markerX, selectedY);
    }

    // ----- Legend -----
    ctx.fillStyle = "#888";
    ctx.font = "12px monospace";
    ctx.textAlign = "right";
    ctx.fillText("Magnitude Spectrum (0 → Max Frequency)", W - 10, 14);
    ctx.textAlign = "left";  // restore for other text

    ctx.fillStyle = "#aaa";
    ctx.font = "10px monospace";
    const tickEvery = Math.floor(half / 8); // 8 ticks across the width
    for (let k = 0; k < half; k += tickEvery) {
        const x = PADDING + k * barWidth;
        ctx.fillText(k.toString(), x, H - 6);
    }

}

// ---------------------------------------------------------
// Public API
// ---------------------------------------------------------

export function drawSpectrum(ctx, dft) {
    drawSpectrumInternal(ctx, dft, 1);   // static frame
}

export function drawSpectrumFrame(ctx, dft, t) {
    drawSpectrumInternal(ctx, dft, t);   // animated frame
}

export function drawWinding(ctx, samples, k, t = 1) {
    const N = samples.length;
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#aaa";
    ctx.font = "12px monospace";
    ctx.textAlign = "left";

    ctx.fillText("Yellow: Phasor trajectory", W - 180, 20);
    ctx.fillText("Cyan: Final vector", W - 180, 36);

    const cx = W / 2;
    const cy = H / 2;

    let re = 0;
    let im = 0;

    // ctx.strokeStyle = "#00ff88";
    // NEW: determine if this frequency is present
    const dft = globalThis.currentDFT;   // make sure DFT is globally accessible for this check
    const mags = dft.map(c => c.mag);
    const half = Math.floor(mags.length / 2);

    const isPresent = (k < half) && (mags[k] > THRESHOLD);

    // NEW: choose color based on presence
    const windingColor = isPresent ? "#ffff00" : "#00ff88";   // yellow or green

    ctx.strokeStyle = windingColor;

    ctx.lineWidth = isPresent ? 3 : 2;
    ctx.globalAlpha = isPresent ? 1.0 : 0.3;
    ctx.beginPath();
    const SCALE = Math.min(W, H) * 0.002; // scaling factor for visibility
    for (let n = 0; n < N * t; n++) {
        const angle = (-2 * Math.PI * k * n) / N;
        const xr = samples[n] * Math.cos(angle);
        const xi = samples[n] * Math.sin(angle);

        re += xr;
        im += xi;

        const x = cx + re * SCALE;  // scale factor
        const y = cy + im * SCALE;

        if (n === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.stroke();

    // Draw final vector
    // ctx.strokeStyle = "#ff4444";
    const finalVectorColor = isPresent ? "#00ccff" : "#ff4444";
    ctx.strokeStyle = finalVectorColor;
    ctx.shadowColor = finalVectorColor;
    ctx.shadowBlur = isPresent ? 10 : 0;;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + re * SCALE, cy + im * SCALE);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
}

