# MAZAT brand exports

Updated 2026-11-25 with the owner-supplied transparent `mazat_transport_logo.png` and favicon package. The supplied logo is copied unchanged to `public/images/mazat-logo.png`; responsive PNG/WebP variants preserve alpha. Supplied ICO, SVG, 96px PNG, Apple and web-app icons are preserved at the public root. The generator derives legacy favicon/Apple sizes from the supplied icons and maps web-app icons to existing manifest URLs. The existing French manifest settings are preserved. Maskable safe-zone variants and the sharing canvas are derived from the new logo.
Run `pnpm assets:brand` to regenerate with Sharp supplied by Astro. Exports are committed; production builds do not need to generate them.

| Asset                                         | Dimensions / purpose                                          |
| --------------------------------------------- | ------------------------------------------------------------- |
| `/favicon.ico`                                | 16, 32, 48px frames for browser compatibility                 |
| `favicon-*.png`                               | 16, 32, 48, 96px; stable URLs, square format                  |
| `apple-touch-icon*.png`                       | 152, 167, 180px; opaque black background                      |
| `/apple-touch-icon.png`                       | 180px conventional fallback location                          |
| `android-chrome-*.png`                        | 192, 512px, manifest `purpose: any`                           |
| `icon-maskable-*.png`                         | 192, 512px; entire source inside safe circle                  |
| `/images/mazat-logo-{128,256,512}.{png,webp}` | Logo exports; header/footer use small responsive variants     |
| `/images/mazat-social-1200x630.png`           | Resized 500px logo centered on a black sharing canvas |
| `/site.webmanifest`                           | French name, colors and separate any/maskable icons           |

The maskable source square is 55% of canvas width, so its diagonal fits within the central 80%-diameter circle. No text or logo content can be cut by a conforming mask. The favicon retains the original emblem; its small lettering is not expected to be readable at 16px. The page title and accessible link names communicate the business name independently.

The shared layout declares sizes, types, Apple icons, manifest, social image dimensions and image alternatives. The structured business logo is an ImageObject with dimensions when SITE_URL is configured. This version remains noindex until publication dependencies are closed. A manifest does not add offline support, service workers, or tracking.

SEO: stable square favicons and crawlable assets follow [Google's guidance](https://developers.google.com/search/docs/appearance/favicon-in-search). Manifest icons follow [MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons). Checked 2026-11-23.

GEO: consistent brand identity and machine-readable business information; no special “AI favicon”, crawler-policy change or promise of citation. Accessibility: decorative logo images within named links use empty alt to avoid repetition; share images have textual alternatives. This asset task is not a full accessibility audit.
