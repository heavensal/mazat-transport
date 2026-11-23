// Deterministic format/size exports of the supplied logo; no generated artwork.
// Uses Sharp already bundled with Astro. No network or build-time generation required.
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const require = createRequire(import.meta.url);
const astroRequire = createRequire(require.resolve('astro/package.json'));
const sharp = astroRequire('sharp');
const root = fileURLToPath(new URL('../public/', import.meta.url));
const source = await readFile(join(root, 'images/mazat-logo.png'));
const icons = join(root, 'favicons');
await mkdir(icons, { recursive: true });
const resize = size => sharp(source).resize(size, size, { fit: 'contain', background: '#000000' }).flatten({ background: '#000000' }).removeAlpha();
for (const size of [16, 32, 48, 96]) {
  await resize(size).png().toFile(join(icons, `favicon-${size}x${size}.png`));
}
for (const size of [152, 167, 180]) {
  await resize(size).png().toFile(join(icons, size === 180 ? 'apple-touch-icon.png' : `apple-touch-icon-${size}x${size}.png`));
}
for (const size of [192, 512]) {
  await resize(size).png().toFile(join(icons, `android-chrome-${size}x${size}.png`));
  // Entire source square fits inside the 80%-diameter safe circle (0.55*sqrt(2) < 0.8).
  const artworkSize = Math.floor(size * 0.55);
  const artwork = await resize(artworkSize).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 3, background: '#000000' } })
    .composite([{ input: artwork, gravity: 'centre' }]).flatten({ background: '#000000' }).removeAlpha().png().toFile(join(icons, `icon-maskable-${size}x${size}.png`));
}
// ICO directory with PNG frames (supported by modern browsers and OS icon consumers).
const frames = await Promise.all([16, 32, 48].map(size => resize(size).png().toBuffer()));
const directory = Buffer.alloc(6 + 16 * frames.length);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(frames.length, 4);
let offset = directory.length;
for (const [index, size] of [16, 32, 48].entries()) {
  const entry = 6 + index * 16;
  directory[entry] = size;
  directory[entry + 1] = size;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(frames[index].length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += frames[index].length;
}
await writeFile(join(root, 'favicon.ico'), Buffer.concat([directory, ...frames]));
await resize(180).png().toFile(join(root, 'apple-touch-icon.png'));
for (const size of [128, 256, 512]) {
  await resize(size).png().toFile(join(root, `images/mazat-logo-${size}.png`));
  await resize(size).webp({ quality: 92 }).toFile(join(root, `images/mazat-logo-${size}.webp`));
}
// A share canvas, not a new logo: source stays at its native 500px resolution.
await sharp(source).extend({ top: 65, bottom: 65, left: 350, right: 350, background: '#000000' })
  .png().toFile(join(root, 'images/mazat-social-1200x630.png'));
console.log('Generated favicon, Apple, Android, maskable, logo and social exports. Original unchanged.');
