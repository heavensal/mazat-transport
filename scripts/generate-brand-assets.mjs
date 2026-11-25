// Deterministic format/size exports of the supplied logo; no generated artwork.
// Uses Sharp already bundled with Astro. No network or build-time generation required.
import { createRequire } from 'node:module';
import { mkdir, readFile, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const require = createRequire(import.meta.url);
const astroRequire = createRequire(require.resolve('astro/package.json'));
const sharp = astroRequire('sharp');
const root = fileURLToPath(new URL('../public/', import.meta.url));
const source = await readFile(join(root, 'images/mazat-logo.png'));
const icons = join(root, 'favicons');
await mkdir(icons, { recursive: true });
const resize = (size) =>
  sharp(source)
    .resize(size, size, { fit: 'contain', background: '#000000' })
    .flatten({ background: '#000000' })
    .removeAlpha();
const faviconSource = await readFile(join(root, 'favicon-96x96.png'));
const appleSource = await readFile(join(root, 'apple-touch-icon.png'));
for (const size of [16, 32, 48, 96]) {
  await sharp(faviconSource)
    .resize(size, size)
    .png()
    .toFile(join(icons, `favicon-${size}x${size}.png`));
}
for (const size of [152, 167, 180]) {
  await sharp(appleSource)
    .resize(size, size)
    .png()
    .toFile(
      join(
        icons,
        size === 180
          ? 'apple-touch-icon.png'
          : `apple-touch-icon-${size}x${size}.png`,
      ),
    );
}
for (const size of [192, 512]) {
  await copyFile(
    join(root, `web-app-manifest-${size}x${size}.png`),
    join(icons, `android-chrome-${size}x${size}.png`),
  );
  // Entire source square fits inside the 80%-diameter safe circle (0.55*sqrt(2) < 0.8).
  const artworkSize = Math.floor(size * 0.55);
  const artwork = await resize(artworkSize).png().toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 3, background: '#000000' },
  })
    .composite([{ input: artwork, gravity: 'centre' }])
    .flatten({ background: '#000000' })
    .removeAlpha()
    .png()
    .toFile(join(icons, `icon-maskable-${size}x${size}.png`));
}
// Supplied favicon.ico, favicon.svg and root Apple icon are preserved verbatim.
for (const size of [128, 256, 512]) {
  await sharp(source)
    .resize(size, size)
    .png()
    .toFile(join(root, `images/mazat-logo-${size}.png`));
  await sharp(source)
    .resize(size, size)
    .webp({ quality: 92 })
    .toFile(join(root, `images/mazat-logo-${size}.webp`));
}
// Keep the sharing canvas at its declared 1200×630 dimensions for any source size.
await sharp(source)
  .resize(500, 500)
  .flatten({ background: '#000000' })
  .extend({ top: 65, bottom: 65, left: 350, right: 350, background: '#000000' })
  .png()
  .toFile(join(root, 'images/mazat-social-1200x630.png'));
console.log(
  'Generated favicon, Apple, Android, maskable, logo and social exports. Original unchanged.',
);
