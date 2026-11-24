# MAZAT Transport Déménagement

French Astro brochure website based on the client brief of 5 November 2026. Original MAZAT logo, five moving packages, maritime export, services, quote preparation and shared assistant workflows.

## Run locally

Requires Node >= 22.23.4 and pnpm. Install with `pnpm install --frozen-lockfile`.

```sh
pnpm exec astro dev --background
pnpm exec astro dev status
pnpm exec astro dev logs
pnpm exec astro dev stop
pnpm build
```

## Structure

- `src/site/`: French publication, page registry and confirmed business contacts.
- `src/content/`: offer definitions and local FAQ.
- `src/components/`: offer cards, FAQ/review rendering and quote questionnaire.
- `src/lib/`: browser quote preparation and build-only Forge transport.
- `src/pages/`: one Astro route entrypoint per public page, plus 404, robots and sitemap.
- `src/views/`: one content folder per visible page, with page-specific components.
- `public/images/mazat-logo.png`: unchanged client logo.
- `.agents/skills`, `.codex/agents`, `.cursor`, `.github/agents`: reusable skills and adapters copied from Laure Corrao and adapted to this implementation.

Read [AGENTS.md](AGENTS.md), [fast_commands.md](fast_commands.md), [client-brief.md](docs/client-brief.md) and [todo.md](todo.md).

## Quote form

The form validates project, departure/destination access, volume or inventory, export-specific details and contact information. The review can be downloaded as a text file before the request is sent.

After confirmation, the browser posts the request directly to Forge's `send_form` API. A successful response means Forge accepted the request for sending; it does not prove delivery to MAZAT's mailbox. Form data remains in browser memory until submission, is not stored locally by the site, and is cleared by refreshing. Photos and other files are not uploaded. The six-step export flow includes a seventh review screen.

Configure `FORGE_FORM_TOKEN` locally in `.env` and as the GitHub Actions repository secret of the same name. **This must be a public, form-scoped Forge token:** its value is embedded in the generated HTML and visible to every site visitor. Never use a private account or administrative token. The production request-reception workflow still lacks server-side storage, anti-spam, automatic acknowledgement, admin dashboard and attachment retention; see EXT-001 in todo.md. Contractual quotes, signature and payment remain out of scope (EXT-002).

## Environment and publication

Copy `.env.example` to `.env` when configuring local settings. Set `SITE_URL` to the confirmed public origin. `PUBLICATION_READY` defaults to false: all pages emit noindex and the sitemap is empty until launch prerequisites are closed. Legal/privacy/conditions pages retain noindex while they contain preparation text. This repository/PR does not deploy a website.

FAQ/review imports default to enabled. Explicit flag values are enabled only for the string `true`; the documented default applies if omitted. `FORGE_API_TOKEN` is build-only. Missing credentials or invalid responses produce warnings and use local FAQ / omit reviews. Valid nonempty remote lists fully replace fallback. Rich HTML is rendered as escaped text. Blog disabled; no article routes.

No copied credentials, internal price grid, fabricated reviews, generated job photos, analytics or automatically loaded third-party embeds. Logo is the only supplied visual asset; approved photos remain a client dependency.

## Verification

`pnpm build` produces static HTML. `pnpm test` checks generated links/anchors, metadata, French language, preview noindex, JSON-LD and exclusion of internal rates/starter assets. Browser acceptance and remaining limits are recorded in [validation.md](docs/validation.md).

## Brand asset set

Favicons, Apple/Android/maskable icons, manifest, PNG/WebP logo sizes and a 1200×630 sharing image are included. Regenerate deterministically with `pnpm assets:brand` using the unchanged original logo. See [asset inventory](public/favicons/README.md) for sizes, metadata, safe-zone details and scope.

## Address autocomplete

`src/components/AddressAutocomplete.astro` is reused for departure and arrival in the quote form. It uses Google Places Autocomplete Data API, loads once when an address reaches three characters, and fills editable street, postcode, city and country fields. Missing key, blocked network or API failure leave manual entry available. No map or geolocation is requested; international searches are unrestricted.

Configure `GOOGLE_MAPS_API_KEY` in `.env` locally and the GitHub Actions repository secret of the same name for builds. Rebuild/restart after changing it. This key is intentionally exposed to the browser: enable Maps JavaScript API and Places API (New), configure billing, restrict the key to those APIs and authorised HTTP referrers (`https://mazat-transport.fr/*`, authorised www/preview origins if used, and a separate development key for `http://localhost:4321/*`). Do not commit the key. The sample key from the supplied HTML is not copied.

References: [Google Places widget](https://developers.google.com/maps/documentation/javascript/place-autocomplete-new), [API key restrictions](https://developers.google.com/maps/api-security-best-practices). Live suggestions require a configured Google project; the build alone does not verify authorisation, quotas or billing.

## Google reviews (client-side)

The owner requested Google instead of Forge for the public reviews component. `Reviews.astro` uses `src/lib/google-reviews.ts` on the homepage only, sharing `src/lib/google-maps.ts` with address autocomplete. Place ID: `ChIJ7WvR7za_yRIRddVA_CCPQcE` (`business.googlePlaceId`). Uses the existing `GOOGLE_MAPS_API_KEY`, Maps JavaScript API and Places API (New); the reviews field has its own Google billing tier. No Business Profile OAuth token belongs in the browser.

Each page load fetches current Google results without a rebuild or local storage. Google returns at most five relevance-selected reviews; the client keeps only five-star entries and sorts that subset by publication date descending. This cannot guarantee the latest review appears, nor provide real-time push updates while a page stays open. Original text, author profile, publication/visit dates when supplied, review/report links and Google attribution are rendered. No subset-derived average or review JSON-LD is added. Errors, missing key or no matching entries retain a link to all Google reviews. Forge FAQ behaviour is unchanged; the old generic Forge reviews transport remains unused by this component.

References: https://developers.google.com/maps/documentation/javascript/place-reviews ; https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places ; https://developers.google.com/maps/documentation/places/web-service/policies .
