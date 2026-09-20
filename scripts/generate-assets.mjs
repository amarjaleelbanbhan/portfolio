/**
 * Regenerates the derived static assets in /public from the master portrait.
 *
 *   node scripts/generate-assets.mjs
 *
 * Outputs are committed, so this only needs re-running when the source image or
 * the social-card copy changes. sharp ships with Next, so there is no extra
 * dependency to install.
 */
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const p = (...parts) => resolve(root, ...parts);

// Archival master, kept outside /public so it is never served to visitors.
const SOURCE = p('assets/hero-portrait-master.jpg');

const BG = '#07111f';
const ACCENT = '#14b8a6';
const FONTS = "'Segoe UI', Inter, Arial, Helvetica, sans-serif";

async function heroPortrait() {
  // Rendered at most 384px CSS wide (md:w-96), so 900px covers 2x DPR and
  // leaves next/image room to derive smaller responsive variants.
  const out = p('public/images/hero-portrait.jpg');
  await sharp(SOURCE)
    .resize({ width: 900, height: 1200, fit: 'cover', position: 'top' })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(out);
  return out;
}

/** Square, circularly masked portrait used inside the social card. */
async function circularPortrait(size) {
  const face = await sharp(SOURCE)
    .resize({ width: size, height: size, fit: 'cover', position: 'top' })
    .toBuffer();

  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
  );

  return sharp(face)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function ogImage() {
  const W = 1200;
  const H = 630;
  const AVATAR = 340;

  const backdrop = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="g1" cx="12%" cy="0%" r="70%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="95%" cy="100%" r="60%">
      <stop offset="0%" stop-color="#d946ef" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#d946ef" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${ACCENT}"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#g1)"/>
  <rect width="${W}" height="${H}" fill="url(#g2)"/>
  <rect x="0" y="0" width="${W}" height="6" fill="url(#rule)"/>

  <text x="80" y="212" font-family="${FONTS}" font-size="26" font-weight="600"
        letter-spacing="6" fill="${ACCENT}">AMARJALEEL.ME</text>
  <text x="80" y="310" font-family="${FONTS}" font-size="78" font-weight="700"
        fill="#f8fafc">Amar Jaleel</text>
  <text x="80" y="374" font-family="${FONTS}" font-size="36" font-weight="500"
        fill="#cbd5e1">AI Product Engineer</text>
  <text x="80" y="446" font-family="${FONTS}" font-size="27" fill="#8ea0b4" xml:space="preserve">AI<tspan fill="${ACCENT}">&#160;&#160;·&#160;&#160;</tspan>Cybersecurity<tspan fill="${ACCENT}">&#160;&#160;·&#160;&#160;</tspan>Full-Stack</text>
  <rect x="80" y="492" width="132" height="4" rx="2" fill="${ACCENT}" opacity="0.7"/>
</svg>`);

  const avatar = await circularPortrait(AVATAR);
  const out = p('public/images/og-image.png');

  await sharp(backdrop)
    .composite([
      // Soft halo behind the portrait so it does not float on flat navy.
      {
        input: Buffer.from(
          `<svg width="${AVATAR + 40}" height="${AVATAR + 40}"><circle cx="${(AVATAR + 40) / 2}" cy="${(AVATAR + 40) / 2}" r="${(AVATAR + 40) / 2 - 2}" fill="${ACCENT}" opacity="0.18"/></svg>`
        ),
        left: W - AVATAR - 120,
        top: (H - AVATAR) / 2 - 20,
      },
      { input: avatar, left: W - AVATAR - 100, top: (H - AVATAR) / 2 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(out);

  return out;
}

/** Minimal ICO container wrapping a single PNG (supported since Windows Vista). */
function pngToIco(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  header.writeUInt8(size >= 256 ? 0 : size, 6); // width  (0 means 256)
  header.writeUInt8(size >= 256 ? 0 : size, 7); // height
  header.writeUInt8(0, 8); // palette size
  header.writeUInt8(0, 9); // reserved
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14); // payload size
  header.writeUInt32LE(22, 18); // payload offset
  return Buffer.concat([header, png]);
}

async function icons() {
  const svg = p('public/favicon.svg');
  const written = [];

  for (const [size, file] of [
    [180, 'public/apple-touch-icon.png'],
    [192, 'public/icon-192.png'],
    [512, 'public/icon-512.png'],
  ]) {
    await sharp(svg, { density: 384 }).resize(size, size).png().toFile(p(file));
    written.push(p(file));
  }

  const ico32 = await sharp(svg, { density: 384 }).resize(32, 32).png().toBuffer();
  await writeFile(p('public/favicon.ico'), pngToIco(ico32, 32));
  written.push(p('public/favicon.ico'));

  return written;
}

await mkdir(p('public/images'), { recursive: true });

const results = [await heroPortrait(), await ogImage(), ...(await icons())];

const { statSync } = await import('node:fs');
for (const file of results) {
  console.log(`${(statSync(file).size / 1024).toFixed(1).padStart(8)} KB  ${file.replace(root, '.')}`);
}
