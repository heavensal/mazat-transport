---
name: faq-forge-local
description: >-
  Create or edit an optional Astro FAQ with contextual local questions and
  answers, Forge imports enabled by default, and per-language fallback when
  Forge has no published FAQs. Use for FAQ content, rendering or import changes.
---

# FAQ workflow

Read [FAQ.md](../../../FAQ.md), the canonical FAQ rule, and [MULTILANG.md](../../../MULTILANG.md) before implementation. Do not duplicate their policies here.

1. Determine whether a FAQ is requested from the prompt and project context. If not requested on a new site, do not build or fetch it.
2. Write complete local questions and answers suited to the activity and audience, using known facts. The placeholder is publishable content, not an empty-state message.
3. Reuse the shared Forge connection. For a requested FAQ, default `FORGE_FAQ_ENABLED` to `true` in the local and deployment setup.
4. Resolve each published language independently: a valid empty Forge list uses the full local list; a non-empty list replaces it entirely. Do not merge the sources.
5. Render both sources through the same native accordion component and use the selected visible list for any structured data.
6. Verify the cases in FAQ.md and report remaining limitations.

## MAZAT implementation references

- `src/components/Faq.astro`: shared local/remote renderer.
- `src/lib/forge.ts`: build-only transport.
- `src/content/faq.ts`: contextual French fallback.

Read reference.md for the current source selection policy. Forge provisioning is a separate task.
