## Tailwind CSS — STRICT RULES

This project uses **Tailwind CSS 4** with strict conventions:

### ✅ ALWAYS: Use Native Tailwind Classes Only

```astro
<div class="flex items-center gap-4 px-6 py-4 text-gray-900">
<button class="rounded-lg bg-orange-armenian px-4 py-2 hover:brightness-95">
```

### ❌ NEVER: Use Arbitrary Values (Brackets)

```astro
<!-- FORBIDDEN -->
<div class="w-[347px] mt-[23px] text-[#1a2b3c] bg-[rgb(255,0,0)]">
```

### ❌ NEVER: Use Inline Styles (except existing full-bleed background images)

```astro
<!-- FORBIDDEN -->
<div style="margin-top: 23px;">
<div style={{ marginTop: '23px' }}>
```

The Quote CTA section may keep a single `background-image` inline style for a dynamic asset URL; do not add new inline layout or typography styles.

### Animation Priority Order

1. **First**: Use native Tailwind animations (`animate-pulse`, `animate-spin`, `animate-bounce`)
2. **Second**: Use Tailwind transitions (`transition-colors`, `transition-transform`, `duration-200`)
3. **Third**: Use existing project animations (`fade-in`, `services-reveal` defined in `global.css`)
4. **Last resort only**: Create new custom `@keyframes` in `global.css` (only if explicitly requested)

When adding keyframes, always include `prefers-reduced-motion` media query.

### If User Requests Non-Standard Styling

Only deviate from these rules if the user **explicitly requests**:

- Arbitrary values for a specific use case
- Custom utility layers or design tokens
- Complex animations requiring keyframes
