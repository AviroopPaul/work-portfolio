# Design System — Aviroop Paul Portfolio

## Philosophy

This portfolio is a sales tool, not a showcase. Every design decision prioritizes **conversion over decoration**. The visual language communicates three things simultaneously: technical credibility, speed of execution, and trustworthiness. It should feel like something a senior engineer who cares about design would build — not like a template.

---

## Color

### Palette

| Token | Hex | Usage |
|---|---|---|
| `--base` | `#080810` | Page background — near-black with a subtle cool tint |
| `--surface` | `#0F0F1A` | Card backgrounds, elevated surfaces |
| `--surface-hover` | `rgba(108, 99, 255, 0.05)` | Card hover state background |
| `--border` | `rgba(255, 255, 255, 0.07)` | Dividers, card outlines |
| `--border-hover` | `rgba(108, 99, 255, 0.30)` | Card hover border |
| `--accent` | `#6C63FF` | Primary CTA, icons, highlights |
| `--accent-dim` | `rgba(108, 99, 255, 0.10)` | Icon backgrounds, subtle highlights |
| `--text` | `#F0EFF8` | Primary text — white with warmth |
| `--muted` | `#6B6B80` | Secondary text, labels, captions |
| `--muted-dim` | `rgba(107, 107, 128, 0.40)` | Tertiary text, decorative elements |

### Usage Rules
- **Never use pure black or pure white** — always use the defined tokens
- **Accent is precious** — use sparingly on the most important element per section
- The accent `#6C63FF` is electric violet, not purple. It reads as modern and premium at dark backgrounds.
- Background sections alternate between `--base` and `--surface` to create depth without borders

---

## Typography

### Font Stack
- **Display & UI**: Geist Sans — self-hosted via `next/font/google`, zero CLS
- **Code & Tags**: Geist Mono — used for section labels, tech pills, nav monogram

### Scale

| Role | Size | Weight | Tracking | Line Height |
|---|---|---|---|---|
| Hero headline | 64–72px (fluid) | 700 | `-0.03em` | 1.05 |
| Section heading | 40–48px | 700 | `-0.02em` | 1.1 |
| Card title | 16px | 600 | `0` | 1.3 |
| Body | 16–18px | 400 | `0` | 1.7 |
| Caption / label | 12px | 400–500 | `0.2em` | 1.5 |
| Code / pill | 13–14px | 400 | `0.02em` | — |

### Rules
- **Headlines always track tight** (`-0.03em`) — loose tracking is for captions and labels
- Section labels use `letter-spacing: 0.2em` in ALL CAPS, font-mono — creates visual hierarchy without a heading tag
- Never center body text beyond 65 characters wide
- Max line width: `max-w-2xl` (672px) for body copy

---

## Motion

### Principles
1. **Enter once, stay** — `whileInView` animations use `{ once: true }` — nothing re-animates on scroll back
2. **Ease, not linear** — all transitions use `[0.16, 1, 0.3, 1]` (expo-out cubic bezier) for snappy-but-controlled feel
3. **Stagger is subtle** — 80ms between siblings, not 200ms — fast stagger reads as designed, slow stagger reads as cheap
4. **Hover lifts** — interactive cards lift `y: -4px` on hover, giving a satisfying push-up feel
5. **Duration ceiling** — no animation exceeds 700ms. Users are here to learn about a service, not watch a show.

### Motion Tokens

| Token | Value |
|---|---|
| Entrance duration | `0.6s` |
| Ease | `[0.16, 1, 0.3, 1]` |
| Stagger delay | `80ms` per child |
| Hover lift | `y: -4px` |
| Hover duration | `200ms` |
| Marquee speed | `40s` per loop |

### Keyframes

| Name | Description |
|---|---|
| `marquee` | Infinite horizontal scroll: `translateX(0) → translateX(-50%)` |
| `mesh-drift` | Hero background gradient slow drift |
| `fade-in` | Simple opacity 0→1 for non-Motion fallbacks |

### Accessibility
All animations respect `prefers-reduced-motion`. Framer Motion handles this automatically. Marquee pauses on hover.

---

## Spacing

| Token | Value | Usage |
|---|---|---|
| Section vertical | `py-24` (96px) | Between major sections |
| Section horizontal | `px-6` (24px) | Page margin on mobile |
| Max content width | `max-w-6xl` (1152px) | Content container |
| Card padding | `p-6` (24px) | Interior card spacing |
| Grid gap | `gap-6` (24px) | Between cards |
| Stack gap | `gap-3` or `gap-4` | Between text elements within a card |

---

## Components

### Card

```
bg: --surface
border: 1px solid rgba(255,255,255,0.07)
border-radius: 16px (rounded-2xl)
padding: 24px

:hover
  border: 1px solid rgba(108,99,255,0.30)
  bg: rgba(108,99,255,0.05)
  transform: translateY(-4px)
  transition: all 300ms ease
```

### Primary Button

```
bg: #6C63FF
color: white
padding: 16px 32px
border-radius: 12px
font-weight: 500

:hover
  bg: #5B52EE
  transform: scale(1.02)
  transition: all 200ms ease
```

### Ghost Button

```
border: 1px solid rgba(255,255,255,0.12)
color: #F0EFF8
padding: 16px 32px
border-radius: 12px
font-weight: 500

:hover
  bg: rgba(255,255,255,0.04)
  transition: all 200ms ease
```

### Navigation Bar

```
position: fixed, top-0, z-50
height: 64px
On scroll: backdrop-blur-md + bg #080810/90 + border-b rgba(255,255,255,0.06)
Transition: all 300ms
```

### Tech Pill

```
border: 1px solid rgba(255,255,255,0.08)
border-radius: 999px
padding: 8px 20px
font-family: Geist Mono
font-size: 13px
color: #6B6B80
bg: #0F0F1A
```

---

## Grid System

- **Base**: 12-column fluid grid within `max-w-6xl`
- **Nav**: Always full-width, `max-w-6xl mx-auto` content inset
- **Services**: `lg:grid-cols-3 md:grid-cols-2 grid-cols-1`
- **Contact**: `md:grid-cols-3 grid-cols-1`
- **Clients logos**: `flex flex-wrap justify-center`

---

## Do / Don't

| Do | Don't |
|---|---|
| Use `--accent` for the single most important element per section | Use accent on more than 2 elements per section |
| Track display headings tight (`-0.03em`) | Use default letter-spacing on large headlines |
| Use `once: true` in viewport animations | Let elements re-animate on scroll |
| Write short, punchy card descriptions (1–2 sentences) | Write long card copy |
| Use `backdrop-blur` for overlaid UI | Use opaque overlays |
| Test on iPhone Safari before shipping | Trust browser DevTools |
