# What's In My Water — drop-in feature

A ZIP-code water quality report page powered by the EPA ECHO Safe Drinking Water API.

## Files (keep this folder structure)

- `app/whats-in-my-water/page.tsx` — the route/page
- `app/api/water/route.ts` — backend: ZIP → county → EPA ECHO lookup
- `components/water-check/*.tsx` — all UI (search, risk meter, contaminant grid, report)
- `lib/water-risk.ts` — derives risk scores, hard-water, regional contaminants
- `lib/water-data.ts` — types + EPA contaminant knowledge base

## Install dependencies

```bash
npm i swr lucide-react
```

## Requirements

- Tailwind CSS + shadcn/ui (uses standard tokens: `bg-card`, `text-muted-foreground`, `bg-accent`, `border`, etc.)
- A shadcn `Button` component at `@/components/ui/button` (uses the standard `asChild` prop)
- The `cn` helper at `@/lib/utils`
- Next.js App Router

All severity colors are inlined with stock Tailwind classes (`red-600` / `amber-500` / `emerald-600`), so no extra CSS/theme setup is needed.

## Two things to swap for your project

1. **Header** — `page.tsx` imports `SiteHeader` from this demo. Replace it with your own site header.
2. **Fonts** — headings use `font-sans`. Change to `font-serif` or a display font if you prefer.

## Notes

- EPA data reflects the whole public water system's reported violations, not lab-measured levels at a specific home tap. The UI states this clearly.
- The page supports shareable deep links via `?zip=48201`.
