/**
 * Average flags by continent into combined images, plus a hue histogram.
 *
 * For each continent, three outputs are produced:
 *   - {continent}-square.png    Every flag is stretched/squished (ignoring
 *                                its original aspect ratio) to exactly fill
 *                                a CANVAS_SIZE x CANVAS_SIZE square, then
 *                                averaged pixel-for-pixel.
 *   - {continent}-sized.png     Every flag is resized to fit inside a
 *                                CANVAS_SIZE x CANVAS_SIZE box, preserving
 *                                its own aspect ratio, and centered. Pixels
 *                                outside a flag's resized bounds don't count
 *                                toward that pixel's average (so the result
 *                                can have a transparent/partial-coverage
 *                                border depending on how "wide" the flags
 *                                in that continent are on average).
 *   - {continent}-histogram.png A bar chart of hue (X, degrees 0-360) vs.
 *                                weighted pixel count (Y), built from every
 *                                pixel of every flag (using the "square"
 *                                resize, since every pixel counts equally
 *                                there). Each bar is tinted with its own hue.
 *
 * Uses `sharp` for all image decode/resize/encode work (ships prebuilt
 * binaries for Windows/Mac/Linux, no native compiler / Cairo needed).
 *
 * Usage:
 *   npm install
 *   node average-flags.js
 *
 * Output: europe-square.png, europe-sized.png, europe-histogram.png,
 *          asia-square.png, asia-sized.png, asia-histogram.png,
 *          americas-square.png, americas-sized.png, americas-histogram.png
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const sharp = require('sharp');

// ---- Config -----------------------------------------------------------

const CANVAS_SIZE = 1200;       // every output image is CANVAS_SIZE x CANVAS_SIZE
const FLAG_WIDTH = 'w640';      // flagcdn width bucket to download (w320, w640, w1280, w2560...)
const CACHE_DIR = './flag-cache';
const OUT_DIR = './out';
const HUE_BUCKETS = 360;        // one bucket per degree of hue (0-359)

// ISO 3166-1 alpha-2 codes per continent (flagcdn uses lowercase codes).
// Transcontinental countries are placed in the continent they're most
// commonly associated with; edit these lists to taste.
const CONTINENTS = {
  europe: [
    'al', 'ad', 'am', 'at', 'az', 'by', 'be', 'ba', 'bg', 'hr',
    'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 'ge', 'de', 'gr', 'hu',
    'is', 'ie', 'it', 'xk', 'lv', 'li', 'lt', 'lu', 'mt', 'md',
    'mc', 'me', 'nl', 'mk', 'no', 'pl', 'pt', 'ro', 'ru', 'sm',
    'rs', 'sk', 'si', 'es', 'se', 'ch', 'tr', 'ua', 'gb', 'va',
  ],
  asia: [
    'af', 'am', 'az', 'bh', 'bd', 'bt', 'bn', 'kh', 'cn', 'cy',
    'ge', 'in', 'id', 'ir', 'iq', 'il', 'jp', 'jo', 'kz', 'kw',
    'kg', 'la', 'lb', 'my', 'mv', 'mn', 'mm', 'np', 'kp', 'om',
    'pk', 'ps', 'ph', 'qa', 'sa', 'sg', 'kr', 'lk', 'sy', 'tw',
    'tj', 'th', 'tl', 'tr', 'tm', 'ae', 'uz', 'vn', 'ye',
  ],
  americas: [
    // North America
    'ca', 'us', 'mx',
    // Central America
    'bz', 'cr', 'sv', 'gt', 'hn', 'ni', 'pa',
    // Caribbean
    'ag', 'bs', 'bb', 'cu', 'dm', 'do', 'gd', 'ht', 'jm', 'kn',
    'lc', 'vc', 'tt',
    // South America
    'ar', 'bo', 'br', 'cl', 'co', 'ec', 'gy', 'py', 'pe', 'sr',
    'uy', 've',
  ],
  africa: [
    'dz', 'ao', 'bj', 'bw', 'bf', 'bi', 'cv', 'cm', 'cf', 'td',
    'km', 'cd', 'cg', 'ci', 'dj', 'eg', 'gq', 'er', 'sz', 'et',
    'ga', 'gm', 'gh', 'gn', 'gw', 'ke', 'ls', 'lr', 'ly', 'mg',
    'mw', 'ml', 'mr', 'mu', 'ma', 'mz', 'na', 'ne', 'ng', 'rw',
    'st', 'sn', 'sl', 'so', 'za', 'ss', 'sd', 'tz', 'tg', 'tn',
    'ug', 'zm', 'zw',
  ],
  oceania: [
    'au', 'fj', 'ki', 'mh', 'fm', 'nr', 'nz', 'pw', 'pg', 'ws',
    'sb', 'to', 'tv', 'vu',
  ],
  arabia: [
    'bh', 'iq', 'jo', 'kw', 'lb', 'ly', 'mr', 'ma', 'om', 'ps',
    'qa', 'sa', 'so', 'sd', 'sy', 'tn', 'ae', 'ye', 'dz', 'eg',
  ],
};

// ---- Helpers ------------------------------------------------------------

function flagUrl(code) {
  return `https://flagcdn.com/${FLAG_WIDTH}/${code}.png`;
}

async function downloadFlag(code) {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  const cachePath = path.join(CACHE_DIR, `${code}.png`);

  if (fs.existsSync(cachePath) && fs.statSync(cachePath).size > 0) {
    return cachePath;
  }

  const url = flagUrl(code);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${code}: ${res.status} ${res.statusText}`);
  }
  const buffer = await res.buffer();
  fs.writeFileSync(cachePath, buffer);
  return cachePath;
}

/**
 * Load a flag image and return a raw RGBA buffer (Buffer, 4 bytes/pixel)
 * of the flag stretched/squished to exactly CANVAS_SIZE x CANVAS_SIZE,
 * ignoring its original aspect ratio.
 */
async function loadSquishedFlag(filePath) {
  const { data } = await sharp(filePath)
    .resize(CANVAS_SIZE, CANVAS_SIZE, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return data;
}

/**
 * Load a flag image and return { data, width, height } where data is a
 * raw RGBA buffer (Buffer, 4 bytes/pixel) of the flag resized to fit
 * inside CANVAS_SIZE x CANVAS_SIZE, preserving aspect ratio (no padding —
 * caller is responsible for placement/offset).
 */
async function loadSizedFlag(filePath) {
  const { data, info } = await sharp(filePath)
    .resize(CANVAS_SIZE, CANVAS_SIZE, { fit: 'inside', withoutEnlargement: false })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return { data, width: info.width, height: info.height };
}

/**
 * Convert an RGB triple to a hue value in degrees [0, 360).
 * Returns null for achromatic pixels (pure gray/white/black), since hue
 * is undefined when there's no color saturation — these are excluded
 * from the hue histogram rather than incorrectly binned at 0 (red).
 * Also returns the saturation (0-1) for weighting.
 */
function rgbToHue(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  const saturation = max === 0 ? 0 : delta / max;

  if (delta === 0) {
    return { hue: null, saturation: 0 };
  }

  let hue;
  if (max === r) {
    hue = ((g - b) / delta) % 6;
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }
  hue *= 60;
  if (hue < 0) hue += 360;

  return { hue, saturation };
}

/**
 * Render a simple bar-chart histogram (hue in degrees on X, weighted pixel
 * count on Y) to a PNG using sharp + a generated SVG overlay. Each bar is
 * tinted with its own hue at full saturation so the chart doubles as a
 * legend.
 */
async function renderHueHistogram(histogram, outputFile, title) {
  const width = 1200;
  const height = 500;
  const marginLeft = 60;
  const marginBottom = 40;
  const marginTop = 40;
  const marginRight = 20;
  const plotWidth = width - marginLeft - marginRight;
  const plotHeight = height - marginTop - marginBottom;

  const maxVal = Math.max(...histogram, 1);
  const barWidth = plotWidth / histogram.length;

  let bars = '';
  for (let h = 0; h < histogram.length; h++) {
    const val = histogram[h];
    const barHeight = (val / maxVal) * plotHeight;
    const x = marginLeft + h * barWidth;
    const y = marginTop + (plotHeight - barHeight);
    // Full-saturation, mid-lightness color for this hue bucket.
    bars += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(barWidth + 0.5).toFixed(2)}" height="${barHeight.toFixed(2)}" fill="hsl(${h}, 100%, 50%)" />`;
  }

  // Axis ticks every 30 degrees.
  let xTicks = '';
  for (let h = 0; h <= 360; h += 30) {
    const x = marginLeft + (h / 360) * plotWidth;
    xTicks += `<line x1="${x.toFixed(2)}" y1="${marginTop + plotHeight}" x2="${x.toFixed(2)}" y2="${marginTop + plotHeight + 6}" stroke="#888" stroke-width="1" />`;
    xTicks += `<text x="${x.toFixed(2)}" y="${marginTop + plotHeight + 22}" font-size="12" text-anchor="middle" fill="#444">${h}</text>`;
  }

  const titleText = title
    ? `<text x="${width / 2}" y="22" font-size="16" text-anchor="middle" fill="#222" font-weight="bold">${title}</text>`
    : '';

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${width}" height="${height}" fill="#fafafa" />
      ${titleText}
      <line x1="${marginLeft}" y1="${marginTop}" x2="${marginLeft}" y2="${marginTop + plotHeight}" stroke="#888" stroke-width="1" />
      <line x1="${marginLeft}" y1="${marginTop + plotHeight}" x2="${marginLeft + plotWidth}" y2="${marginTop + plotHeight}" stroke="#888" stroke-width="1" />
      ${bars}
      ${xTicks}
      <text x="${marginLeft + plotWidth / 2}" y="${height - 4}" font-size="14" text-anchor="middle" fill="#222">Hue (degrees)</text>
      <text x="14" y="${marginTop + plotHeight / 2}" font-size="14" text-anchor="middle" fill="#222" transform="rotate(-90 14 ${marginTop + plotHeight / 2})">Weighted pixel count</text>
    </svg>
  `;

  await sharp(Buffer.from(svg)).png().toFile(outputFile);
}

// ---- Per-continent processing --------------------------------------------

/**
 * Download and process every flag for one continent, producing the square
 * average, sized average, and hue histogram PNGs.
 */
async function processContinent(name, codes) {
  console.log(`\n=== ${name} (${codes.length} flags) ===`);

  // Square accumulators (every flag covers every pixel).
  const squareSumR = new Float64Array(CANVAS_SIZE * CANVAS_SIZE);
  const squareSumG = new Float64Array(CANVAS_SIZE * CANVAS_SIZE);
  const squareSumB = new Float64Array(CANVAS_SIZE * CANVAS_SIZE);

  // Sized accumulators (aspect-preserving, centered; coverage varies by pixel).
  const sizedSumR = new Float64Array(CANVAS_SIZE * CANVAS_SIZE);
  const sizedSumG = new Float64Array(CANVAS_SIZE * CANVAS_SIZE);
  const sizedSumB = new Float64Array(CANVAS_SIZE * CANVAS_SIZE);
  const sizedCount = new Uint16Array(CANVAS_SIZE * CANVAS_SIZE);

  const hueHistogram = new Float64Array(HUE_BUCKETS);

  let processed = 0;

  for (const code of codes) {
    let filePath;
    try {
      filePath = await downloadFlag(code);
    } catch (err) {
      console.warn(`Skipping ${code}: ${err.message}`);
      continue;
    }

    let squished, sized;
    try {
      squished = await loadSquishedFlag(filePath);
      sized = await loadSizedFlag(filePath);
    } catch (err) {
      console.warn(`Skipping ${code} (image load failed): ${err.message}`);
      continue;
    }

    // --- Square pass + hue histogram (every pixel of every flag counts) ---
    for (let i = 0, p = 0; i < CANVAS_SIZE * CANVAS_SIZE; i++, p += 4) {
      const r = squished[p];
      const g = squished[p + 1];
      const b = squished[p + 2];

      squareSumR[i] += r;
      squareSumG[i] += g;
      squareSumB[i] += b;

      // Weight by saturation so near-gray/white/black pixels (common in
      // flags as background or borders) don't dominate the hue histogram
      // with noisy/arbitrary hue values.
      const { hue, saturation } = rgbToHue(r, g, b);
      if (hue !== null && saturation > 0) {
        const bucket = Math.min(HUE_BUCKETS - 1, Math.floor(hue));
        hueHistogram[bucket] += saturation;
      }
    }

    // --- Sized pass (aspect-preserving, centered, alpha-aware) ---
    const { data, width: fw, height: fh } = sized;
    const offsetX = Math.floor((CANVAS_SIZE - fw) / 2);
    const offsetY = Math.floor((CANVAS_SIZE - fh) / 2);

    for (let y = 0; y < fh; y++) {
      const destY = y + offsetY;
      const srcRowBase = y * fw * 4;
      const destRowBase = destY * CANVAS_SIZE;

      for (let x = 0; x < fw; x++) {
        const srcIdx = srcRowBase + x * 4;
        const alpha = data[srcIdx + 3];
        if (alpha === 0) continue; // outside the flag -> transparent, skip

        const destX = x + offsetX;
        const pIdx = destRowBase + destX;

        sizedSumR[pIdx] += data[srcIdx];
        sizedSumG[pIdx] += data[srcIdx + 1];
        sizedSumB[pIdx] += data[srcIdx + 2];
        sizedCount[pIdx] += 1;
      }
    }

    processed++;
    console.log(`[${processed}/${codes.length}] averaged ${code}`);
  }

  if (processed === 0) {
    throw new Error(`No flags were successfully processed for ${name} — check network access / flag-cache for corrupted files.`);
  }

  // --- Write square output ---
  const squareBuffer = Buffer.alloc(CANVAS_SIZE * CANVAS_SIZE * 4);
  for (let i = 0; i < CANVAS_SIZE * CANVAS_SIZE; i++) {
    const idx = i * 4;
    squareBuffer[idx] = Math.round(squareSumR[i] / processed);
    squareBuffer[idx + 1] = Math.round(squareSumG[i] / processed);
    squareBuffer[idx + 2] = Math.round(squareSumB[i] / processed);
    squareBuffer[idx + 3] = 255;
  }
  const squareFile = path.join(OUT_DIR, `${name}-square.png`);
  await sharp(squareBuffer, { raw: { width: CANVAS_SIZE, height: CANVAS_SIZE, channels: 4 } })
    .png()
    .toFile(squareFile);
  console.log(`-> ${squareFile}`);

  // --- Write sized output ---
  const sizedBuffer = Buffer.alloc(CANVAS_SIZE * CANVAS_SIZE * 4);
  for (let i = 0; i < CANVAS_SIZE * CANVAS_SIZE; i++) {
    const idx = i * 4;
    const c = sizedCount[i];
    if (c === 0) {
      sizedBuffer[idx] = 0;
      sizedBuffer[idx + 1] = 0;
      sizedBuffer[idx + 2] = 0;
      sizedBuffer[idx + 3] = 0; // no flag ever covered this pixel -> transparent
    } else {
      sizedBuffer[idx] = Math.round(sizedSumR[i] / c);
      sizedBuffer[idx + 1] = Math.round(sizedSumG[i] / c);
      sizedBuffer[idx + 2] = Math.round(sizedSumB[i] / c);
      sizedBuffer[idx + 3] = 255;
    }
  }
  const sizedFile = path.join(OUT_DIR, `${name}-sized.png`);
  await sharp(sizedBuffer, { raw: { width: CANVAS_SIZE, height: CANVAS_SIZE, channels: 4 } })
    .png()
    .toFile(sizedFile);
  console.log(`-> ${sizedFile}`);

  // --- Write histogram output ---
  const histogramFile = path.join(OUT_DIR, `${name}-histogram.png`);
  const title = `${name.charAt(0).toUpperCase()}${name.slice(1)} flag hue distribution`;
  await renderHueHistogram(hueHistogram, histogramFile, title);
  console.log(`-> ${histogramFile}`);

  console.log(`Done with ${name}: averaged ${processed}/${codes.length} flags.`);
}

// ---- Main ---------------------------------------------------------------

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const [name, codes] of Object.entries(CONTINENTS)) {
    await processContinent(name, codes);
  }

  // Write per-region country code listing.
  const jsonFile = path.join(OUT_DIR, 'region-countries.json');
  fs.writeFileSync(jsonFile, JSON.stringify(CONTINENTS, null, 2));
  console.log(`-> ${jsonFile}`);

  console.log('\nAll continents processed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});