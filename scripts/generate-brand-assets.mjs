#!/usr/bin/env node
/**
 * Generates the favicon set, web manifest, and Open Graph image from the same "FM" monogram
 * used by components/logo.tsx and the same brand hex values defined in app/globals.css
 * (dark palette — favicons/OG images need concrete colors, not CSS custom properties).
 *
 * Re-run with `node scripts/generate-brand-assets.mjs` any time the monogram or palette
 * changes. Outputs go straight to public/ since this is a static-export site with no
 * server-side image generation at request time.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const RESUME_PATH = path.join(ROOT, 'doc', 'resume.json');

// Dark palette from app/globals.css — the site's default theme, and the one the monogram
// itself is designed against.
const COLORS = {
  bgPrimary: '#0b1120',
  bgSurface: '#111827',
  accent: '#22d3ee',
  textPrimary: '#e5e7eb',
};

function monogramSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="8" fill="${COLORS.bgSurface}" stroke="${COLORS.accent}" stroke-width="1.5"/>
  <text x="16" y="21.5" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="13" letter-spacing="-0.5" fill="${COLORS.textPrimary}">FM</text>
</svg>`;
}

function ogImageSvg({ name, title }) {
  const width = 1200;
  const height = 630;
  const monogramSize = 140;
  const monogramX = 100;
  const monogramY = (height - monogramSize) / 2;
  const textX = monogramX + monogramSize + 56;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${COLORS.bgPrimary}"/>
  <g transform="translate(${monogramX}, ${monogramY})">
    <rect x="3.28" y="3.28" width="133.4" height="133.4" rx="35" fill="${COLORS.bgSurface}" stroke="${COLORS.accent}" stroke-width="6.5"/>
    <text x="70" y="94" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="57" letter-spacing="-2" fill="${COLORS.textPrimary}">FM</text>
  </g>
  <text x="${textX}" y="${height / 2 - 12}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="58" fill="${COLORS.textPrimary}">${escapeXml(name)}</text>
  <text x="${textX}" y="${height / 2 + 44}" font-family="'Courier New', monospace" font-weight="600" font-size="26" letter-spacing="1" fill="${COLORS.accent}">${escapeXml(title)}</text>
</svg>`;
}

function escapeXml(value) {
  return value.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]
  );
}

/**
 * Packs one or more PNG buffers into a minimal, valid multi-resolution ICO container.
 * Modern ICO readers (browsers, Windows Vista+, macOS) accept PNG-compressed image data
 * directly inside the ICO directory entries — no BMP re-encoding needed.
 */
function buildIco(images) {
  const HEADER_SIZE = 6;
  const ENTRY_SIZE = 16;
  const header = Buffer.alloc(HEADER_SIZE + ENTRY_SIZE * images.length);

  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = header.length;
  images.forEach(({ size, buffer }, index) => {
    const entryOffset = HEADER_SIZE + index * ENTRY_SIZE;
    header.writeUInt8(size >= 256 ? 0 : size, entryOffset + 0);
    header.writeUInt8(size >= 256 ? 0 : size, entryOffset + 1);
    header.writeUInt8(0, entryOffset + 2); // color palette
    header.writeUInt8(0, entryOffset + 3); // reserved
    header.writeUInt16LE(1, entryOffset + 4); // color planes
    header.writeUInt16LE(32, entryOffset + 6); // bits per pixel
    header.writeUInt32LE(buffer.length, entryOffset + 8);
    header.writeUInt32LE(offset, entryOffset + 12);
    offset += buffer.length;
  });

  return Buffer.concat([header, ...images.map((image) => image.buffer)]);
}

async function rasterize(svg, size) {
  return sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toBuffer();
}

async function main() {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const resume = JSON.parse(fs.readFileSync(RESUME_PATH, 'utf-8'));

  // Favicon PNGs at every size the manifest/HTML metadata reference.
  const [png16, png32, png48, png180, png192, png512] = await Promise.all(
    [16, 32, 48, 180, 192, 512].map((size) => rasterize(monogramSvg(size), size))
  );

  fs.writeFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-192.png'), png192);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-512.png'), png512);

  const ico = buildIco([
    { size: 16, buffer: png16 },
    { size: 32, buffer: png32 },
    { size: 48, buffer: png48 },
  ]);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), ico);

  // Open Graph image — monogram + name + title on the dark-slate background.
  const ogSvg = ogImageSvg({ name: resume.name, title: resume.title });
  const ogPng = await sharp(Buffer.from(ogSvg), { density: 300 })
    .resize(1200, 630)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'og-image.png'), ogPng);

  // Web manifest — mirrors the same name/palette rather than inventing new copy or colors.
  const manifest = {
    name: resume.name,
    short_name: resume.name,
    icons: [
      { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    theme_color: COLORS.bgPrimary,
    background_color: COLORS.bgPrimary,
    display: 'standalone',
  };
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2) + '\n'
  );

  console.log('Generated: favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png,');
  console.log('           og-image.png, site.webmanifest');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
