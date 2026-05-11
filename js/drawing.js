// ---------------------------------------------------------
// Drawing Utilities for Fourier Transform Visualizer
// ---------------------------------------------------------

const THRESHOLD = 1e-6;
export const DRAWING_SPACE = 0.9; // 90% of canvas height for drawing, rest for labels
const SPECTRUM_CONFIG = {
    padding: 10,
    gap: 3,
    axisHeight: 16,
    normalColor: '#00ff88',
    selectedColor: '#ffff00',
    labelColor: '#888',
    tickColor: '#aaa',
    labelFont: '12px monospace',
    tickFont: '10px monospace',
    strokeColor: '#003322'
};

const WINDING_CONFIG = {
    presentPath: '#ffff00',
    absentPath: '#888888',
    presentVector: '#00ccff',
    absentVector: '#ff4444',
    neutralPath: '#666666',     // darker gray
    neutralVector: '#999999',   // soft gray

    legendColor: '#aaa',
    legendFont: '12px monospace'
};

function clearCanvas(ctx) {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);
    return { width, height };
}

function drawPath(ctx, points, { strokeStyle, lineWidth = 1, globalAlpha = 1 } = {}) {
    if (!points.length) {
        return;
    }

    ctx.save();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.globalAlpha = globalAlpha;
    ctx.beginPath();

    points.forEach((point, index) => {
        if (index === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });

    ctx.stroke();
    ctx.restore();
}

function drawLine(ctx, from, to, { strokeStyle, lineWidth = 1, shadowColor = 'transparent', shadowBlur = 0 } = {}) {
    ctx.save();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
}

function drawText(ctx, text, x, y, { fillStyle = '#ffffff', font = '12px monospace', textAlign = 'left' } = {}) {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.font = font;
    ctx.textAlign = textAlign;
    ctx.fillText(text, x, y);
    ctx.restore();
}

function buildWaveformPoints(samples, width, height) {
    const midY = height / 2;

    // dynamic amplitude scaling
    const maxAmp = Math.max(...samples.map(v => Math.abs(v)), 1);
    const scaleY = (height * (DRAWING_SPACE / 2)) / maxAmp;

    return samples.map((value, index) => ({
        x: (index / (samples.length - 1)) * width,
        y: midY - value * scaleY
    }));
}

export function drawWaveform(ctx, samples) {
    const { width, height } = clearCanvas(ctx);
    const points = buildWaveformPoints(samples, width, height);

    drawPath(ctx, points, {
        strokeStyle: SPECTRUM_CONFIG.normalColor,
        lineWidth: 2
    });
}

function getSpectrumData(dft) {
    const magnitudes = dft.map(bin => bin.mag);
    const half = Math.floor(magnitudes.length / 2);
    const bars = magnitudes.slice(0, half);
    const maxMag = Math.max(...bars, 1);

    return { bars, half, maxMag };
}

function buildSpectrumBars(spectrum, width, height, progress) {
    const { bars, half, maxMag } = spectrum;
    const usableWidth = Math.max(0, width - 2 * SPECTRUM_CONFIG.padding);
    const barWidth = Math.max(2, usableWidth / Math.max(1, half));
    const usableHeight = height - SPECTRUM_CONFIG.axisHeight;

    return bars.map((mag, index) => {
        const normalized = mag / maxMag;
        const barHeight = normalized * progress * usableHeight;
        const x = SPECTRUM_CONFIG.padding + index * barWidth;
        const y = usableHeight - barHeight;

        return {
            k: index,
            mag,
            x,
            y,
            width: barWidth - SPECTRUM_CONFIG.gap,
            height: barHeight
        };
    });
}

function drawSpectrumBars(ctx, barData, selectedK) {
    barData.forEach(bar => {
        ctx.fillStyle = bar.k === selectedK && bar.mag > THRESHOLD
            ? SPECTRUM_CONFIG.selectedColor
            : SPECTRUM_CONFIG.normalColor;

        ctx.strokeStyle = SPECTRUM_CONFIG.strokeColor;
        ctx.strokeRect(bar.x, bar.y, bar.width, bar.height);
        ctx.fillRect(bar.x, bar.y, bar.width, bar.height);
    });
}

function drawSpectrumLabels(ctx, width, height, half, barWidth) {
    drawText(ctx, 'Magnitude Spectrum (0 → Max Frequency)', width - 10, 14, {
        fillStyle: SPECTRUM_CONFIG.labelColor,
        font: SPECTRUM_CONFIG.labelFont,
        textAlign: 'right'
    });

    const tickEvery = Math.max(1, Math.floor(half / 8));
    for (let k = 0; k < half; k += tickEvery) {
        const x = SPECTRUM_CONFIG.padding + k * barWidth;
        drawText(ctx, k.toString(), x, height - 6, {
            fillStyle: SPECTRUM_CONFIG.tickColor,
            font: SPECTRUM_CONFIG.tickFont,
            textAlign: 'left'
        });
    }
}

function drawSpectrumInternal(ctx, dft, selectedK, progress = 1) {
    const { width, height } = clearCanvas(ctx);
    const spectrum = getSpectrumData(dft);
    const barData = buildSpectrumBars(spectrum, width, height, progress);
    const barWidth = barData.length ? barData[0].width + SPECTRUM_CONFIG.gap : 0;

    drawSpectrumBars(ctx, barData, selectedK);
    drawSpectrumLabels(ctx, width, height, spectrum.half, barWidth);
}

export function drawSpectrum(ctx, dft, selectedK = 0) {
    drawSpectrumInternal(ctx, dft, selectedK, 1);
}

export function drawSpectrumFrame(ctx, dft, selectedK = 0, t = 1) {
    drawSpectrumInternal(ctx, dft, selectedK, t);
}

function isFrequencyPresent(dft, k) {
    const half = Math.floor(dft.length / 2);
    return k >= 0 && k < half && dft[k].mag > THRESHOLD;
}

function computeWindingTrajectory(samples, k, progress) {
    const N = samples.length;
    const steps = Math.max(1, Math.floor(N * progress));
    const points = [];
    let re = 0;
    let im = 0;

    for (let n = 0; n < steps; n++) {
        const angle = (-2 * Math.PI * k * n) / N;
        re += samples[n] * Math.cos(angle);
        im += samples[n] * Math.sin(angle);
        points.push({ re, im });
    }

    return { points, final: { re, im } };
}

function toCanvasPoint(point, centerX, centerY, scale) {
    return {
        x: centerX + point.re * scale,
        y: centerY + point.im * scale
    };
}

function drawWindingLegend(ctx, width) {
    const x = width - 180;
    let y = 12;

    // Present frequency legend
    drawSwatch(ctx, x, y, WINDING_CONFIG.presentPath);
    drawText(ctx, 'Trajectory (present)', x + 20, y + 10, {
        fillStyle: WINDING_CONFIG.legendColor,
        font: WINDING_CONFIG.legendFont
    });

    y += 18;
    drawSwatch(ctx, x, y, WINDING_CONFIG.presentVector);
    drawText(ctx, 'Final vector', x + 20, y + 10, {
        fillStyle: WINDING_CONFIG.legendColor,
        font: WINDING_CONFIG.legendFont
    });

    // Absent frequency legend
    y += 25;
    drawSwatch(ctx, x, y, WINDING_CONFIG.absentPath);
    drawText(ctx, 'Trajectory (absent)', x + 20, y + 10, {
        fillStyle: WINDING_CONFIG.legendColor,
        font: WINDING_CONFIG.legendFont
    });

    y += 18;
    drawSwatch(ctx, x, y, WINDING_CONFIG.absentVector);
    drawText(ctx, 'Vanishing vector', x + 20, y + 10, {
        fillStyle: WINDING_CONFIG.legendColor,
        font: WINDING_CONFIG.legendFont
    });

    // Neutral legend
    y += 25;
    drawSwatch(ctx, x, y, WINDING_CONFIG.neutralPath);
    drawText(ctx, 'Trajectory (no DFT)', x + 20, y + 10, {
        fillStyle: WINDING_CONFIG.legendColor,
        font: WINDING_CONFIG.legendFont
    });
    y += 18;
    drawSwatch(ctx, x, y, WINDING_CONFIG.neutralVector);
    drawText(ctx, 'Vector (no DFT)', x + 20, y + 10, {
        fillStyle: WINDING_CONFIG.legendColor,
        font: WINDING_CONFIG.legendFont
    });
}


function drawSwatch(ctx, x, y, color, size = 10) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.restore();
}

export function drawWinding(ctx, samples, k, dft, t = 1) {
    const { width, height } = clearCanvas(ctx);
    drawWindingLegend(ctx, width);

    let present = false;  // default

    let trajectoryColor, vectorColor;

    if (!dft || dft.length === 0) {
        // No DFT computed yet → neutral placeholder
        trajectoryColor = WINDING_CONFIG.neutralPath;
        vectorColor = WINDING_CONFIG.neutralVector;
    } else {
        present = isFrequencyPresent(dft, k);
        trajectoryColor = present ? WINDING_CONFIG.presentPath : WINDING_CONFIG.absentPath;
        vectorColor = present ? WINDING_CONFIG.presentVector : WINDING_CONFIG.absentVector;
    }

    const centerX = width / 2;
    const centerY = height / 2;

    // Compute trajectory first
    const { points, final } = computeWindingTrajectory(samples, k, t);

    // Compute max radius for dynamic scaling
    const radii = points.map(p => Math.hypot(p.re, p.im));
    const maxRadius = Math.max(...radii, 1);

    // Scale so the trajectory fills ~90% of the canvas
    const scale = (Math.min(width, height) * (DRAWING_SPACE / 2)) / maxRadius;

    // Convert to canvas coordinates
    const canvasPoints = points.map(p => toCanvasPoint(p, centerX, centerY, scale));


    drawPath(ctx, canvasPoints, {
        strokeStyle: trajectoryColor,
        lineWidth: present ? 3 : 2,
        globalAlpha: present ? 1 : 0.3
    });

    drawLine(ctx, { x: centerX, y: centerY }, toCanvasPoint(final, centerX, centerY, scale), {
        strokeStyle: vectorColor,
        lineWidth: 2,
        shadowColor: present ? vectorColor : 'transparent',
        shadowBlur: present ? 10 : 0
    });
}

