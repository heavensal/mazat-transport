# Validation — 23 November 2026

## Passed

- `pnpm build`: 14 generated HTML pages, plus robots.txt and sitemap.xml.
- `pnpm test`: 424 internal links/assets/anchors resolve; exactly one h1 per page; unique page titles; French document language; descriptions; parseable MovingCompany JSON-LD; preview noindex; empty unconfigured sitemap; no starter branding or internal price grid in HTML.
- Local Astro server started with the required `astro dev --background` command.
- Browser: home document width/scrollWidth both 1440 at desktop viewport and both 390 at mobile viewport; export recap width/scrollWidth both 390.
- Browser: mobile menu opens; Escape handler is present, but the closed state was not separately asserted.
- Browser: export query parameter selects the export project and shows seven screens including review.
- Browser: missing project flexibility blocks progression.
- Browser: elevator=yes reveals and requires dimensions/capacity; filling that field allows progression.
- Browser: missing volume and inventory blocks progression with a descriptive native validation message; filling inventory alone allows progression.
- Browser: export-specific mode and contact fields lead to a complete recap containing departure, arrival, inventory, selected export mode and contact details. No email was sent.

## Limits / not passed off as complete

- The browser automation session expired while waiting for the download event. File download, mail-client launch, back-navigation, domestic/B2B end-to-end and subsequent browser checks are not verified. Recovery also timed out.
- Screenshots from the viewport override were clipped/scaled incorrectly by the capture environment, so visual desktop/mobile QA is incomplete despite successful DOM width checks. Real iPhone/Android, 320px, 200% zoom and screen reader checks remain open.
- Build success is not a separate TypeScript/Astro diagnostic run or WCAG conformance audit.
- Forge credentials are absent. Warnings and local fallback are observed; real remote 0/N/replacement/error cases remain unverified.
- Real submissions, email receipts, photo upload, admin persistence, signed PDF quotes, hosting statuses and production analytics do not exist in this delivery.
- Domain and legal validation remain outstanding. No production deployment performed.
