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
- `src/pages/`: homepage, data-driven static routes, 404, robots and sitemap.
- `public/images/mazat-logo.png`: unchanged client logo.
- `.agents/skills`, `.codex/agents`, `.cursor`, `.github/agents`: reusable skills and adapters copied from Laure Corrao and adapted to this implementation.

Read [AGENTS.md](AGENTS.md), [fast_commands.md](fast_commands.md), [client-brief.md](docs/client-brief.md) and [todo.md](todo.md).

## What the quote form does

The form validates project, departure/destination access, volume or inventory, export-specific details and contact information. The review can be downloaded as a text file or opened in a mail draft. Long requests use a short mail body and explicitly instruct the user to attach the downloaded full summary. Data stays in browser memory until the visitor uses their own mail client. Nothing is stored automatically; refreshing clears the draft.

This is **not yet a request receiver**: no backend, automatic acknowledgement, admin dashboard, photo uploader, contractual PDF, signature or payment. The six-step export flow includes a seventh review screen. See EXT-001/002 in todo.md for the remaining service dependencies.

## Environment and publication

Copy `.env.example` to `.env` when configuring local settings. Set `SITE_URL` to the confirmed public origin. `PUBLICATION_READY` defaults to false: all pages emit noindex and the sitemap is empty until launch prerequisites are closed. Legal/privacy/conditions pages retain noindex while they contain preparation text. This repository/PR does not deploy a website.

FAQ/review imports default to enabled. Explicit flag values are enabled only for the string `true`; the documented default applies if omitted. `FORGE_API_TOKEN` is build-only. Missing credentials or invalid responses produce warnings and use local FAQ / omit reviews. Valid nonempty remote lists fully replace fallback. Rich HTML is rendered as escaped text. Blog disabled; no article routes.

No copied credentials, internal price grid, fabricated reviews, generated job photos, analytics or third-party embeds. Logo is the only supplied visual asset; approved photos remain a client dependency.

## Verification

`pnpm build` produces static HTML. `pnpm test` checks generated links/anchors, metadata, French language, preview noindex, JSON-LD and exclusion of internal rates/starter assets. Browser acceptance and remaining limits are recorded in [validation.md](docs/validation.md).
