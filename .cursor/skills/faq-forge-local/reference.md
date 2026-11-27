# MAZAT Transport FAQ integration

Read [FAQ.md](../../../FAQ.md) and [MULTILANG.md](../../../MULTILANG.md). French only; no translation runtime.

The shared transport in src/lib/forge.ts requests faqs?locale=fr at build time. Imports default to enabled; any explicit flag other than the string true disables them. Missing credentials, request failures and invalid payloads are reported as warnings and select local content. A valid empty list selects all local questions. A nonempty valid list replaces the local list entirely, sorted by position, rendered as escaped plain text.

Use src/components/Faq.astro and src/content/faq.ts as the implementation references. Never copy provider credentials into browser code. Configure the website-specific token before testing real imports.
