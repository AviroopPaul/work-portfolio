<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Project: Aviroop Paul — Client Portfolio

## Purpose
Sales-focused single-page portfolio targeting early-stage founders for contract/POC/MVP work. Every section should move a founder from "interesting" to "I need to hire this person."

## Stack
- Next.js 16.2.3 (App Router), React 19, TypeScript
- Tailwind CSS v4 — `@import "tailwindcss"` in globals.css, `@theme inline {}` for tokens, no tailwind.config.js
- Framer Motion — all animations
- `react-fast-marquee` — clients logo strip
- `nodemailer` — contact form email sending

## Design System
- **Background**: `#09090B` (zinc-950)
- **Border**: `#3F3F46` (zinc-700), always `2px`
- **Accent**: `#DFE104` (acid yellow) — sole accent color, used for CTAs, highlights, hover inversions
- **Text primary**: `#FAFAFA`, **muted**: `#A1A1AA`
- **No border radius anywhere** — brutalist/editorial aesthetic
- **Hover pattern**: `hover:bg-[#DFE104] hover:text-black` — hard inversion, used consistently across interactive rows
- **Typography**: Space Grotesk (display), Geist Mono (mono accents). `font-bold uppercase tracking-tighter` for all headings
- **Heading size**: `text-[clamp(2.5rem,7vw,7rem)]` for sections, `text-[clamp(2.8rem,8.5vw,10rem)]` for hero
- **Animation ease**: `[0.16, 1, 0.3, 1]` used everywhere. Never animate `fontSize` — use `scale` instead to avoid reflow jitter

## Content
**Single source of truth**: `lib/content.ts` — all visible text lives here. Never hardcode strings in components.

## File Map
```
app/
  page.tsx              — composes all sections + noise texture overlay + footer
  layout.tsx            — Space Grotesk + Geist Mono fonts, favicon (ap-favicon.png), metadata
  globals.css           — design tokens, cursor:none on pointer devices
  api/contact/route.ts  — POST endpoint, sends email via nodemailer (SMTP in .env.local)
  admin/page.tsx        — content editor UI, localStorage persistence, exports content.ts

components/
  Navigation.tsx        — sticky top, uses ap-favicon.png as logo, CTA → #contact
  Hero.tsx              — line-reveal entrance animation, accent line cycles: "In Weeks." / "That Works." / "That's Tested." every 2200ms
  StatsMarquee.tsx      — yellow bar, 3 stats (3+ Years, 5 Enterprise, 100% Production Grade), active stat expands with flex+scale animation, cycles every 2500ms
  Clients.tsx           — slow marquee (speed=25), logos from public/, only Think41 gets white background
  Services.tsx          — hairline grid (gap-px bg-[#3F3F46]), 6 service cards, hard yellow hover inversion
  TechStack.tsx         — two opposing marquee rows, pill tags with hover inversion
  Contact.tsx           — horizontal link rows (LinkedIn, Portfolio site), email row expands inline form (nodemailer)
  CustomCursor.tsx      — 16×16 white square, mix-blend-difference, desktop only

public/
  ap-favicon.png        — used as nav logo AND decorative hero background element
  nokia.png, fenmo.avif, spotdraft.png, atomicwork.svg, think41.svg — client logos
```

## Key Decisions
- **SVG logos**: Use `<img>` not Next.js `<Image>` — Image component blocks SVGs
- **Lucide missing icons**: LinkedIn and GitHub are not in lucide-react — use inline SVG components
- **Contact email**: Do not use `mailto:` — replaced with inline form + `/api/contact` route (Dia browser doesn't open mail clients)
- **Footer + Contact**: Contact has `pb-0`, footer has `border-t-2` — they share the same border line, no gap
- **Hero decorative**: `ap-favicon.png` at `opacity-[0.08]`, `h-[clamp(16rem,40vw,36rem)]`, bottom-right absolute
- **SMTP credentials**: In `.env.local` (copied from `../system-design-daily/.env`)

## Sections Order
Hero → StatsMarquee → Clients → Services → TechStack → Contact → Footer
