---
name: Design System
description: Canonical design system source and documentation location for the Aesops monorepo
type: project
---

The design system source is `b_foazAyqGIPs/` at the repo root. It defines:
- CSS variables in `b_foazAyqGIPs/app/globals.css`
- All UI components in `b_foazAyqGIPs/components/ui/`
- Design system showcase sections in `b_foazAyqGIPs/components/design-system/`

**Why:** The user created this standalone design system app to define the canonical token set, component styles, and visual language.

**How to apply:** When working on UI, always check `design_system.md` at the repo root for the full token reference. The shared package at `packages/ui/src/styles/globals.css` mirrors these tokens and is imported by apps via `@repo/ui/globals.css`. Use CSS variables (`bg-primary`, `text-foreground`, etc.) — never hardcode hex values.

Key palette:
- Primary (light): `#2D6A73` (Teal) | Primary (dark): `#D4956A` (Terracotta)
- Accent: `#D4956A` (light) / `#E8C9A0` (dark)
- Background: `#F8F3ED` (light) / `#0A2533` (dark)
- Font: Bricolage Grotesque Variable (sans/heading), Lora Variable (serif), Geist Mono (mono)
- Base radius: `0.625rem` (10px)

Semantic extras beyond shadcn defaults: `--success`, `--warning`, `--info` and their foregrounds.
Typography scale utilities: `.text-display`, `.text-headline`, `.text-title`, `.text-body-lg`, `.text-body`, `.text-body-sm`, `.text-caption`, `.text-overline`
