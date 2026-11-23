# MAZAT delivery tracking

Updated 2026-11-23. This is a preparation branch, not a deployed production service.

## Implemented

- [x] Copy shared skills, agent profiles, rules and command catalog from Laure Corrao; adapt runtime references for French-only MAZAT.
- [x] Original logo and supplied commercial contacts integrated; internal rates excluded from source/browser output.
- [x] Home, five offers and comparison, maritime export, services, business transfers, review source, Marseille and Nice pages.
- [x] Conditional quote questionnaire, native validation, review, text download and explicit email-draft handoff. No receipt claim.
- [x] FAQ local fallback and shared Forge build transport; remote credentials absent, warnings explicit.
- [x] Preview noindex; robots/sitemap endpoints and shared metadata; no fabricated canonical domain.

- [x] Complete brand asset set (2026-11-23): ICO, 16/32/48/96px PNGs, Apple 152/167/180px, Android and maskable 192/512px, PNG/WebP logo exports, 1200×630 share image and manifest. Dimensions, ICO frames, opaque mask safe zones and unchanged original verified; build and 536 internal links/assets pass.

## Client and infrastructure dependencies

- [ ] **EXT-001 · P0 · Reception infrastructure · blocked.** Owner chooses backend/email/storage/admin authentication. Files: `src/components/QuoteForm.astro`, `src/lib/quote-form.ts`, `src/pages/[...slug].astro`. Acceptance: stored request with server timestamp/ID, anti-spam, structured company email, prospect acknowledgement, admin statuses and attachment retention; local/national/export submissions received in a test environment. Current mail draft is an explicit interim delivery.
- [ ] **EXT-002 · P0 · Contractual quote PDF · blocked.** MAZAT supplies original “Devis parfait (5).pdf”, approved business identity, CGV, insurance, declaration of value, VAT/payment rules, mediation and signature workflow. Acceptance: approved template and tax/total calculations, manual business validation, inventory annex, signature and test PDF. No automatic contractual PDF implemented.
- [ ] **EXT-003 · P0 · Publication/legal · blocked.** Confirm domain, hosting identity, publication director, current Kbis/RNE, mediator, privacy bases/retention/processors and export authorisations. Locations: `src/site/config.ts`, `src/site/pages.ts`, legal/privacy/terms branches in `src/pages/[...slug].astro`, `.env.example`. Acceptance: validated legal pages and configured canonical origin before enabling PUBLICATION_READY.
- [ ] **EXT-004 · P1 · Photos/reviews · blocked.** MAZAT supplies authorised team/job/transport/export photos, photo rights, approved testimonials and Google review URL. Locations: `public/images`, `src/pages/index.astro`, reviews route and `src/components/Reviews.astro`. Acceptance: real optimised gallery and hero without identifying unauthorised clients. External Déménagement24 link already present; no rating copied.
- [ ] **EXT-005 · P1 · Forge · blocked.** Configure MAZAT website token and verify current published FAQ/review contract. Locations: `src/lib/forge.ts`, `.env.example`. Acceptance: 0 and N live items, French locale, no merge with fallback, rebuild trigger. No secret from Laure is reused.
- [ ] **EXT-006 · P1 · Analytics/Search Console · to do.** Choose tools and consent approach, verify domain ownership, configure relevant call/email/export/form events after a real receiver exists. No trackers currently installed.

## SEO / GEO / Accessibilité — Corrections dans le dépôt

- [ ] **SGA-001 · P1 · SEO/legal · blocked by EXT-003.** Replace preparation legal text, configure SITE_URL, verify canonical/OG/sitemap and remove appropriate noindex only after approval of facts. Owner: developer. Acceptance: correct domain and verified legal pages in generated HTML and production.
- [ ] **SGA-002 · P1 · Accessibility · to verify.** Complete screen-reader, 200% zoom and actual iOS/Android acceptance after final content. Owner: developer/QA. Acceptance: critical navigation/form journeys usable, no hidden focus or content loss. Partial browser tests do not establish WCAG conformity.

## SEO / GEO / Accessibilité — Intervention du propriétaire

External evidence and approvals are tracked once in EXT-001 through EXT-006 above; do not duplicate them here. No Search Console, analytics, legal review, deployment or real email delivery is claimed.

## Later phases

- [ ] Optional English export and blog/conseils (P2, not enabled).
- [ ] Additional city pages only when original useful content and real photos are available.
