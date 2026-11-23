---
name: language
description: >-
  Apply the website language rule when creating an Astro site, adding languages,
  editing localized copy or public URLs. Choose no i18n for new monolingual
  sites and page-scoped dictionaries for multilingual sites.
---

# Website language workflow

Read [MULTILANG.md](../../../MULTILANG.md) before language-related work. It is the canonical rule; do not duplicate it here.

1. Determine requested languages and the default language from the prompt and project context. Ask only for missing decisions.
2. Identify whether this is new-site creation, a scoped edit, or an explicitly requested migration.
3. Apply the corresponding monolingual or multilingual architecture from the rule.
4. Validate routes, content, switching, Forge locale behavior and SEO as relevant to the change.

MAZAT is a new French-only site using src/site/publication.ts, src/site/pages.ts and ordinary local content. No i18next runtime or unpublished English dictionaries are present.
