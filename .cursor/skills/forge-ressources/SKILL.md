---
name: forge-ressources
description: >-
  Integrates Forge blog articles, reviews, and FAQs into an Astro brochure
  site at build time. Each resource is static and depends on its .env flag
  (FORGE_FAQ_ENABLED, FORGE_REVIEWS_ENABLED, FORGE_ARTICLES_ENABLED). Use when
  fetching Forge content, editing the blog, FAQs, reviews, or those flags.
---

# Forge resources

Blog articles, reviews, and FAQs are integrated through the build. They are static, not dynamic. A built resource depends on its variable in `.env`.

## FAQ

Read [FAQ.md](../../../FAQ.md) for FAQ behavior: build the section only when requested, write contextual local questions and answers, enable its Forge import by default, and resolve each published locale independently. An empty published list uses the full local list; a non-empty list replaces it without merging. Reuse this shared integration.

## Reviews

Read [REVIEWS.md](../../../REVIEWS.md) for review behavior: an optional section, imports enabled by default when requested, and independent per-locale replacement of authentic local reviews by published Forge reviews. Do not merge sources or invent production testimonials/ratings. Fictional examples are labelled development fixtures excluded from production. Reuse the shared Forge connection; recording the rule does not implement or enable reviews on this site.

## Flags

Read a flag only as the string `true` (`import.meta.env.FORGE_*_ENABLED === 'true'`). Any other value is off. Declare each flag in `.env`, `.env.example`, and `src/env.d.ts`.

| Flag                     | `true`                              | not `true`                        |
| ------------------------ | ----------------------------------- | --------------------------------- |
| `FORGE_FAQ_ENABLED`      | FAQs come from Forge                | FAQs are not provided by Forge    |
| `FORGE_REVIEWS_ENABLED`  | Reviews come from Forge             | Reviews are not provided by Forge |
| `FORGE_ARTICLES_ENABLED` | Blog articles are pages of the site | `/blog` is not generated          |

`FORGE_FAQ_ENABLED=false` means FAQs are not provided by Forge. The same rule applies to reviews. The existing FAQ resolver uses local copy when its import is off or unusable. Review helpers also support local content, but a visible review section must be explicitly implemented; apply REVIEWS.md before publishing any local testimonials.

## Build

The fetch runs while Astro generates the site. The HTML is written then. Do not request these resources from the browser.

`fetchForge` calls `{FORGE_URL}/{path}?locale=` with `Authorization: Bearer ${FORGE_API_TOKEN}` and `Accept: application/json`. `FORGE_URL` defaults to `https://forge.1344.fr/api/v1`. A list response is `{ updated_at, data }`. An empty token or a failed response is a failed fetch.

## MAZAT implementation

The build-only transport is src/lib/forge.ts. Faq.astro selects src/content/faq.ts on a valid empty list or a reported failure. Reviews.astro omits testimonials when there are no valid approved remote entries; no fictional local reviews are supplied. Both render plain text safely.

Blog routes are not implemented: articles and English export are P2 extensions. Read BLOG.md before implementing them. There is no existing forge-blog.ts or i18n layer to reuse in this repository.
