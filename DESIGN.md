## Overview

Aesops is a warm, editorial data platform. The base atmosphere is a **tinted cream canvas** (`{colors.background}` — #F8F3ED) — unmistakably warm, never the cool gray-white of generic SaaS. The primary typeface is **Bricolage Grotesque** — a wide, characterful geometric-grotesque — used at all weights for headings through UI labels, paired with **Lora Variable** for long-form editorial contexts and **Geist Mono** for data and code.

Brand voltage comes from the **teal + terracotta** palette. Teal (`{colors.primary}` — #155f6b) is the structural accent — primary CTAs, active states, focus rings, data badges. Terracotta (`{colors.accent}` — #D4956A) is the warmth layer — used on callout moments, icon backgrounds, and chart highlights. In dark mode, these roles invert: terracotta becomes the primary interaction color and teal recedes to secondary.

The system has three surface modes:

1. **Cream canvas** (`{colors.background}`) — default page floor
2. **Off-white card surface** (`{colors.card}`) — component and data card backgrounds
3. **Deep teal dark surface** (`{colors.background-dark}` — #0A2533) — dark-mode default, used for product chrome, code blocks, hero sections, and footer treatments

The cream-to-card contrast is subtle and editorial. The light-to-dark mode inversion is holistic — not just a color flip but a role-swap of teal and terracotta.

**Key Characteristics:**

- Warm cream canvas (`{colors.background}` — #F8F3ED) with deep-teal ink (`{colors.foreground}` — #0A2533). The brand's defining color choice — never pure white, never cool gray.
- Teal primary (`{colors.primary}` — #155f6b) for all structural interactions (buttons, focus rings, active states). Terracotta accent (`{colors.accent}` — #D4956A) for warmth moments and data callouts.
- Bricolage Grotesque at all heading levels — wide, confident, geometric. No serif display face. The editorialness comes from whitespace and the warm palette, not from typeface contrast.
- Full dark mode where the primary role is held by terracotta (`{colors.primary-dark}` — #D4956A) and background becomes deep teal (`{colors.background-dark}` — #0A2533). The inversion is intentional: warm in dark.
- Border radius is hierarchical: `{rounded.md}` (8px) for buttons + inputs, `{rounded.lg}` (10px) for content cards, `{rounded.xl}` (14px) for elevated containers, `{rounded.full}` for pills and avatars.
- Data type badges use semantic color tokens — teal for numerics, sage for info, success-green for booleans, terracotta for datetime — never raw Tailwind hue classes.
- Section rhythm `{spacing.section}` (96px). Card padding generous at `{spacing.xl}` (32px), data-dense surfaces at `{spacing.lg}` (24px).

## Colors

### Brand & Accent

- **Teal / Primary** (`{colors.primary}` — #155f6b): The structural brand color. Used on every primary CTA, active states, focus rings, selected indicators, and teal data badges. Conveys trust and depth. This is `--brandprimary-700` on the extended scale.
- **Terracotta / Accent** (`{colors.accent}` — #D4956A): The warmth layer. Used on callout icon backgrounds, chart highlight series, warm badge fills, and full-bleed callout bands. Pairs with teal to create the brand's warm-cool tension.
- **Sienna / Deep Accent** (`{colors.sienna}` — #A67852): A richer, darker warm tone. Used on chart series 4 and deep-emphasis accent moments.
- **Brown / Darkest Warm** (`{colors.brown}` — #6B4A3A): The darkest warm palette entry. Used on chart series 5 and very occasional strong accent elements.
- **Teal Primary Dark** (`{colors.primary-dark}` — #D4956A): In dark mode, terracotta becomes the primary interaction color. Ring, focus, and active states use this tone over the deep-teal canvas.

### Surface

- **Background** (`{colors.background}` — #F8F3ED): The default page floor. Tinted cream — warm, never pure white.
- **Card** (`{colors.card}` — #FFFCF8): Component and data card surfaces. Barely lighter than background — the distinction is subtle and felt rather than seen.
- **Secondary** (`{colors.secondary}` — #EDE8E0): Section dividers, hover fills on outline buttons, light band backgrounds.
- **Muted** (`{colors.muted}` — #F0EBE4): Input backgrounds, tag surfaces, skeleton loaders, the edit-form tray in data lists.
- **Sand / Warning Surface** (`{colors.sand}` — #E8C9A0): Warning states and decorative warm fills.
- **Dark Background** (`{colors.background-dark}` — #0A2533): Dark-mode page floor, used as hero section background on marketing pages. Deep teal — warm dark, not generic near-black.
- **Dark Card** (`{colors.card-dark}` — #0F3040): Dark-mode card surface. One step lighter than the dark background.
- **Dark Muted** (`{colors.muted-dark}` — #153545): Dark-mode muted backgrounds. Input tray, edit surfaces in dark.
- **Border** (`{colors.border}` — #E5DED4): The 1px border tone on cream surfaces. Warm taupe — borders feel like a surface step, not ink lines.
- **Border Dark** (`{colors.border-dark}` — #1A4050): Dark-mode border tone.

### Text

- **Foreground** (`{colors.foreground}` — #0A2533): All headlines and primary text. Deep teal, not pure black — reads warm against the cream canvas.
- **Muted Foreground** (`{colors.muted-foreground}` — #5C6B6E): Secondary text, captions, metadata, breadcrumbs, placeholder text.
- **Sage / Dark Muted Foreground** (`{colors.sage}` — #9BB3AC): Dark-mode muted text. A desaturated mid-teal that reads legibly on #0A2533.
- **On Primary** (`{colors.primary-foreground}` — #F8F3ED): Text on teal buttons (light mode). The cream canvas tone echoed in labels.
- **On Accent** (`{colors.accent-foreground}` — #0A2533): Text over terracotta surfaces. Dark teal, never white on terracotta.
- **On Dark** (`{colors.foreground-dark}` — #F0EBE4): Primary text on dark surfaces. Warm off-white, never pure white.

### Semantic

- **Success** (`{colors.success}` — #5A8A7A): Status indicators, file-type icons for Excel/CSV, positive confirmations. Dark-mode variant: #6A9A8A.
- **Warning** (`{colors.warning}` — #E8C9A0): Warning callouts, high null-percent indicators in data tables.
- **Info** (`{colors.info}` — #6A8F96): Integer/int data type badges, informational indicators.
- **Destructive** (`{colors.destructive}` — #A65D4A): Delete actions, error states, form validation errors.

## Typography

### Font Family

The system runs **Bricolage Grotesque Variable** as the sole display and body typeface for all UI and editorial content. It is a wide-set geometric grotesque with strong optical weight — distinctive at large sizes without requiring a separate serif display face. **Lora Variable** is the serif companion for long-form article bodies or editorial features. **Geist Mono** handles all code, data values, and monospace contexts. The fallback stack walks `system-ui, sans-serif` for heading/body and `monospace` for code.

The type role split:

- Bricolage Grotesque (weight 600–900) → `.text-display`, `.text-headline`, `.text-title`, headings — use `font-black` (weight 900) for section hero headings
- Bricolage Grotesque (weight 400) → body, navigation, buttons, captions, labels
- Lora Variable → long-form editorial body (opt-in via `font-serif`)
- Geist Mono → code blocks, data type values, terminal output, overline labels (section eyebrows use `font-mono text-[10px] uppercase tracking-[0.22em]`)

### Hierarchy

| Token                    | Size     | Weight | Line Height | Letter Spacing | Use                                           |
| ------------------------ | -------- | ------ | ----------- | -------------- | --------------------------------------------- |
| `{typography.display}`   | 56px / 3.5rem | 900 | 1.0      | -0.02em        | Hero h1, major feature headlines — Bricolage `font-black` |
| `{typography.headline}`  | 36px / 2.25rem | 900 | 1.1      | -0.015em       | Section heads — Bricolage `font-black`         |
| `{typography.title}`     | 24px / 1.5rem | 600  | 1.25      | -0.01em        | Page titles, card headers — Bricolage         |
| `{typography.body-lg}`   | 18px / 1.125rem | 400 | 1.6      | —              | Feature intro paragraphs, lead text           |
| `{typography.body}`      | 16px / 1rem | 400    | 1.6      | —              | Default running text — Bricolage              |
| `{typography.body-sm}`   | 14px / 0.875rem | 400 | 1.5      | —              | Card metadata, form hints, footer body        |
| `{typography.caption}`   | 12px / 0.75rem | 400  | 1.4      | 0.01em         | Timestamps, file sizes, stat labels           |
| `{typography.overline}`  | 10–11px / ~0.625rem | 500 | 1.0 | 0.22em (uppercase) | Section eyebrows — always `font-mono`, uppercase, tracked wide. Preceded by a `h-px w-4/5 bg-primary` hairline rule. |

### Principles

Display and headline weights use `font-black` (900) with negative letter-spacing. The tracking is essential — Bricolage Grotesque without it reads as oversized body copy. Weight 900 is the correct heading weight — 600/700 is reserved for card titles and compact UI headings.

Body type stays at weight 400. The geometric character of Bricolage at small sizes is distinctive without competing with display sizes. Labels, buttons, and captions step to weight 500 for legibility at small sizes.

Line heights are generous (1.5–1.6) in body ranges to accommodate data-dense layouts without crowding.

### Note on Font Substitutes

If Bricolage Grotesque Variable is unavailable, **Plus Jakarta Sans** is the closest structural substitute — similarly wide, similarly geometric. **Inter** is a viable fallback for body/UI contexts but lacks the width and personality of Bricolage at display sizes. For the serif layer, **Lora** is a Google Font and always available; **Merriweather** is an acceptable body-serif alternative.

## Layout

### Spacing System

- **Base unit:** 4px.
- **Tokens:** `{spacing.1}` 4px · `{spacing.2}` 8px · `{spacing.3}` 12px · `{spacing.4}` 16px · `{spacing.6}` 24px · `{spacing.8}` 32px · `{spacing.12}` 48px · `{spacing.section}` 96px.
- **Section padding:** `py-16 lg:py-24` (64px / 96px) between major page bands.
- **Card internal padding:** `{spacing.6}` (24px) for data cards and compact components; `{spacing.8}` (32px) for feature cards and primary content containers.
- **Grid gap:** `{spacing.4}` (16px) — the standard gap for all data and feature grids. Use `gap-4 lg:gap-6` for card grids with variable member counts.

### Grid & Container

- **Max content width:** 1280px (`max-w-7xl`) for marketing sections, 1400px for platform chrome.
- **Body layout:** Single responsive column expanding to max-width; hero areas use 6/6 split at desktop (headline left, visual right).
- **Feature card grids:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for light feature cards; `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` for team cards.
- **Gap-px grid pattern:** For hairline inner-divider card grids, use `grid gap-px bg-border rounded-2xl overflow-hidden` with each cell having `bg-background` or `bg-[#0A2533]`. This only works when all grid cells are fully populated — use `gap-4` for variable-count grids (teams, community lists).
- **Dataset card grids:** 1-up at mobile, 2-up at `@md`, 3-up at `@3xl` (using container queries).
- **Profile / settings pages:** Single centered column, max-width 3xl (768px) or xl (576px).

### Whitespace Philosophy

The cream canvas and generous internal padding create editorial pacing — Aesops feels like a considered data publication, not a dense tool. Whitespace between bands is 64–96px; whitespace inside cards is generous (24–40px). Data tables and column grids are the exception — they can be denser with 8px gaps, as long as the surrounding chrome (card borders, header padding) provides the breathing room.

## Elevation & Depth

| Level             | Treatment                                       | Use                                                           |
| ----------------- | ----------------------------------------------- | ------------------------------------------------------------- |
| Flat              | No shadow, no border                            | Page bands, hero sections, background fills                   |
| Hairline          | 1px `{colors.border}` border                    | Cards, inputs, data lists, panels                             |
| Shadow XS         | `shadow-xs` — faint lift                        | Buttons, checkboxes, input groups                             |
| Shadow SM         | `shadow-sm` — standard card elevation           | Dataset cards, profile lists, upload zones                    |
| Shadow MD         | `shadow-md`                                     | Popovers, hover cards, context menus, date pickers            |
| Shadow LG         | `shadow-lg`                                     | Modals, dialogs, command palette, drawer panels               |
| Shadow XL         | `shadow-xl`                                     | Tooltips, floating chart labels                               |
| Floating viz      | `shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)]`| Floating UI panel cards in hero and showcase sections         |

The elevation philosophy is **surface-contrast first, shadow minimal**. Most depth comes from the `{colors.card}` vs `{colors.background}` tonal difference and the `{colors.border}` hairline. Shadows enter only when a layer truly floats above the page (popovers, modals). The dark surface (`{colors.background-dark}`) as a code block or side panel provides its own depth through contrast without needing a shadow.

### Decorative Depth

- File-type icons in data lists use a light-tinted background swatch (`bg-primary/10`, `bg-success/10`) to add visual anchoring without hard borders.
- Data type badges (DTypeBadge) use `bg-primary/10 text-primary` etc. — the tint is the depth signal, not a border.
- The dataset detail side panel is `position: sticky` with `overflow: hidden` + `shadow-sm` — elevation comes from the scroll behavior and the hairline border, not from shadows.
- Drag-drop upload zones use a subtle `bg-primary/5` tint on drag-over — the color shift IS the depth shift.

### Decorative Patterns

**Dot-grid texture** — Applied to section backgrounds to add tactile depth without visual clutter.
- On **dark surfaces** (`bg-primary`, `bg-[#0A2533]`): `radial-gradient(circle, white 1px, transparent 1px)` at `22px 22px` · opacity `0.05–0.12`. Higher opacity (0.12) for primary-green hero sections; lower (0.05) for deep navy sections.
- On **cream surfaces** (`bg-background`): `radial-gradient(circle, #155f6b 1px, transparent 1px)` at `22px 22px` · opacity `0.07`. The teal dot on cream reads as brand texture, not noise.
- Always rendered as `aria-hidden` with `absolute inset-0` positioning. Never on cards or compact components — section bands only.

**Vignette overlay** — Layered above the dot-grid on full-bleed dark sections to add cinematic depth.
- Standard: `bg-linear-to-b from-black/10 via-transparent to-black/15`
- Applied on: marketing hero, about page hero (`OurStoryBlock`), any section using `bg-primary` or `bg-[#0A2533]` as the band background.
- Not applied on cream sections — vignettes only on dark.

**Floating visualization panels** — Mock UI cards that animate with independent vertical float cycles to create a living, editorial right-column in split-layout sections. Each card: `rounded-2xl border border-border bg-card shadow-[0_22px_55px_...]`. Cards use CSS keyframe animations (`@keyframes floatA/B/C/D`) with `ease-in-out infinite`, each on a different duration (6–9s) to desynchronize. Applied only at `lg:` and above; mobile renders the cards stacked in a column. Used in: marketing Hero (AI chat visualization), AI Showcase section, About page origin story.

## Shapes

### Border Radius Scale

| Token            | Value     | Use                                                                  |
| ---------------- | --------- | -------------------------------------------------------------------- |
| `{rounded.sm}`   | 6px       | Small inline elements, edit-tray buttons, icon-only ghost buttons    |
| `{rounded.md}`   | 8px       | Standard buttons, text inputs, selects, checkboxes, textarea, badges |
| `{rounded.lg}`   | 10px      | Section containers, upload drop zones, alert boxes                   |
| `{rounded.xl}`   | 14px      | Dataset cards, detail panels, profile list containers                |
| `{rounded.2xl}`  | 16px      | Large feature cards, hero containers, visualization panels           |
| `{rounded.full}` | 9999px    | Pills, tags, avatar frames, license badges, count chips              |

The base variable is `--radius: 0.625rem` (10px). All tokens derive from it: `rounded-sm` = radius − 4px, `rounded-md` = radius − 2px, `rounded-lg` = radius, `rounded-xl` = radius + 4px.

### Photography & Illustrations

Aesops is data-first. Decorative illustration is minimal:

- User avatars crop to perfect circles (`rounded-full`) at 40px in navbars and 32px in compact contexts.
- Team member photos in cards use a fixed-height image section (`h-36`) with `object-cover object-top` — photo section is compact; info section below carries the name and role.
- File-type icons (FileText, FileSpreadsheet from Lucide) in tinted swatch containers replace thumbnail previews for data files.
- Empty states use a single centered icon (Search, Database) in a `bg-muted rounded-full` swatch with two lines of muted text — no illustrative spot art.
- Charts (Recharts) use a 6-slot categorical series, `{colors.aeschart-1}` through `{colors.aeschart-6}`, in fixed order: teal → peach → rust → sage → orange → brown. Slot 1 is the exact brand primary teal (`{colors.primary}` — #155f6b, `#238595` in dark mode) since teal is the default/leading series color — it is kept as-is rather than derived like the other 5 slots. It sits just under the categorical chroma-floor heuristic but clearly reads as teal (not gray) with strong contrast and no CVD collisions, so brand consistency wins there. The other 5 slots are derived from the brand's 9-stop logo-gradient palette (`packages/ui/src/components/logo.tsx`) — the 3 near-neutral stops of that gradient (navy `#001524`, pale sage `#C5CAB8`, cream `#FFECD1`) aren't used as series fills (too low-chroma/low-contrast to read as marks on the cream chart surface); they're already covered by `{colors.foreground}` and `{colors.background}`/`{colors.card}` for chart ink and surfaces. Each series color was nudged in OKLCH (hue held fixed, checked against the in-gamut chroma ceiling so hue doesn't drift toward blue/cyan) off its source swatch to clear the categorical lightness-band and chroma-floor checks — see the `dataviz` skill's `references/color-formula.md`. The older `{colors.chart-1}` through `{colors.chart-5}` tokens (teal → terracotta → sage → sienna → brown) still exist for any remaining call sites but new chart work should use `aeschart-*`.
- **Logo mark** (`/logo-mark.svg`): A gradient SVG circle mark used at mobile breakpoints where the full wordmark is too wide. Never apply `brightness-0 invert` to it — the gradient is intentional. On desktop, show the full wordmark with `brightness-0 invert` if on a dark background.

## Components

### Top Navigation

**`marketing-navbar`** — Marketing site navigation bar. Fixed to top (`sticky top-0 z-50`), 64px tall (`h-16`). Background: teal-to-dark vignette (`from-primary/90 to-primary/70 backdrop-blur-md`) over the hero image when at scroll position 0; transitions to a cream/card background on scroll down.

- **Desktop logo**: Full SVG wordmark (`<Logo variant='full'>`) with `brightness-0 invert` filter on the teal background; without invert on the cream scroll state. Max width `lg:`.
- **Mobile logo**: `logo-mark.svg` gradient circle mark (`h-8 w-8`), shown only at `< lg` breakpoints. Never inverted — preserve the gradient.
- **Auth nav colors**: Auth links (`Sign in`, `Get started`) adapt via `NavbarContext`. When `isGreen` (on hero): Sign in uses `text-primary-foreground/75`; Get started uses `bg-primary-foreground text-primary`. When scrolled (cream): original dark-bg button styles.
- **Mobile menu**: Rendered **outside** the `<header>` as a `fixed inset-x-0 top-16 z-40` overlay. Does not push page content down. Background: `bg-[#0A2533]` with dot-grid and `backdrop-blur-sm`. No border-top.

**`platform-top-nav`** — Platform (datasets) navigation bar. Cream card bar pinned to top, 56px tall (`h-14`), `{colors.card}` background, `{colors.border}` bottom border. Logo (SVG wordmark) at left; right cluster carries the Upload primary button + `{component.user-dropdown}` for authenticated sessions.

### Buttons

**`button-primary`** — The structural teal CTA. Background `{colors.primary}` (#155f6b), text `{colors.primary-foreground}` (#F8F3ED), type Bricolage Grotesque 14px / 500, padding `{spacing.3}` × `{spacing.4}` (12px × 16px), height 36px (h-9), rounded `{rounded.md}` (8px). Hover state fades to `{colors.primary}/90`.

**`button-outline`** — Hairline-bordered button on cream. Background `{colors.card}`, text `{colors.foreground}`, 1px `{colors.border}` border. Hover fills `{colors.muted}`. Dark mode: `dark:bg-input/30`. Used for secondary actions: Cancel, Create account.

**`button-secondary`** — Filled secondary. Background `{colors.secondary}` (#EDE8E0), text `{colors.foreground}`. Hover darkens to `{colors.secondary}/80`. Used for non-primary option choices.

**`button-ghost`** — No background or border. Hover fills `{colors.muted}`. Used for icon actions in data rows (edit pencil, close panel), nav-level contextual actions.

**`button-destructive`** — Subtle destructive fill. Background `{colors.destructive}/10`, text `{colors.destructive}`. Hover deepens to `{colors.destructive}/20`. Used exclusively for delete / remove actions in data rows.

**`button-link`** — Inline text link. Text `{colors.primary}`, underline on hover with `underline-offset-4`. Used for "Create one", "Sign in" inline anchors.

**`button-icon`** — Square icon-only button at 36px (size-9). Shares variant styles above. Used for close-panel X, edit pencil, trash in data list rows.

### Marketing Section Bands

Marketing sections are full-width bands that alternate surface modes for visual rhythm. The standard sequence on the homepage is: **dark hero → cream problem → dark platform → cream AI showcase → cream footer**.

**`hero-band`** — Full-bleed teal-dark hero. Background `bg-[#0A2533]` (deep navy). White dot-grid overlay at `opacity-[0.05]`. Vignette `from-black/10 via-transparent to-black/15`. Split layout: text left (heading + sub + CTAs), floating viz right. Mobile: centered text, `items-center text-center`, full-width CTAs (`w-full sm:w-auto`). CTA cluster: `flex-col sm:flex-row w-full sm:justify-center lg:justify-start`.

**`features-section-light`** — Problem / feature cards on cream. Section background `bg-background` with teal dot-grid at `opacity-[0.07]`. Card grid: `grid gap-px bg-border rounded-2xl overflow-hidden` — hairline dividers come from the `bg-border` showing through the `gap-px`, not from individual card borders. Each card:
- `bg-background` (no hover background change)
- Muted index top-right: `font-mono text-[10px] text-muted-foreground/40`
- Icon box: `bg-primary/8 text-primary rounded-xl`, transitions to `bg-primary/12` on group-hover
- Title shifts from `text-foreground` to `text-primary` on group-hover
- Bottom accent line: `absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary/60 to-primary/20 group-hover:scale-x-100`
- No outer border on the grid container

**`features-section-dark`** — Platform feature cards on deep navy. Section background `bg-[#0A2533]`. White dot-grid at `opacity-[0.05]`. Vignette overlay. Each card:
- `bg-[#0A2533] hover:bg-[#0d2d3e]`
- Top `h-px` highlight: `absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100`
- Icon transitions: `bg-white/[0.07] text-primary-foreground` → `group-hover:bg-accent/20 group-hover:text-accent`
- Title: `text-white/90`

**`ai-showcase-section`** — AI feature callout. Background `bg-background` with teal dot-grid at `opacity-[0.09]`. Split layout: text + feature callouts left, floating viz panel right. Floating panels show mock AI chat and discussion UIs with CSS keyframe float animations.

### About Page Sections

**`our-story-block`** — About page hero. Background `bg-primary` (teal). White dot-grid at `opacity-[0.12]` — intentionally more visible than other sections to emphasize the brand surface. Vignette overlay. Split layout: heading + description left, `AesopsOriginViz` right (floating cards showing the blog-to-platform origin story: article card + datasets card + discussions card + bridge pill).

**`mission-vision-block`** — Mission and vision panels. Background `bg-background` (cream). Teal dot-grid at `opacity-[0.07]`. Gap-px grid: `grid gap-px rounded-2xl overflow-hidden bg-border grid-cols-1 md:grid-cols-2`. Each panel:
- `bg-background` with no hover background
- Icon box: `bg-primary/10 text-primary` at `h-10 w-10 rounded-xl`
- Overline: `text-primary/70` with `h-px w-4 bg-primary/40` hairline prefix
- Heading: `font-black text-foreground`
- Bottom accent line (same scale-x pattern as `features-section-light`)

**`our-values-block`** — Values card grid. Background `bg-background`. Teal dot-grid at `opacity-[0.05]`. Gap-px grid with editorial stark cards: muted monospace index top-right, small `h-4 w-4` icon, title in foreground, description in muted-foreground, bottom accent line.

**`our-team-block`** — Team member grid. Background `bg-background`. Teal dot-grid. Grid: `grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6` — uses `gap-4` NOT `gap-px` because team member count is variable; empty cells would show the `bg-border` gap color with gap-px. Individual cards carry their own `border border-border rounded-2xl` treatment.

**`team-member-card`** — Individual team card. `bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40`. Image section: fixed `h-36` (not aspect-ratio) — controls vertical size regardless of photo dimensions. Info section: `p-4`, name `text-lg font-semibold`, role `text-sm text-muted-foreground`, social icons `size-10` with `size-5` Lucide icons. Stretched link covers the card at `z-0`; social links sit above at `z-20`.

### Cards & Containers

**`dataset-card`** — The primary data object card. Background `{colors.card}`, `{colors.border}` hairline border, rounded `{rounded.xl}` (14px), `shadow-sm`, padding `{spacing.4}` (16px). Carries a file-type icon swatch (primary or success tint), truncated filename, size · age metadata, row/column stats, and a column pill strip (up to 6, then "+N more"). Selected state: `{colors.primary}` border + `ring-1`.

**`dataset-panel`** — Side panel detail view for a selected dataset. Background `{colors.card}`, `{colors.border}` hairline border, rounded `{rounded.xl}`, `shadow-sm`. Fixed 420px width, sticky top, max-height calc. Header section with name + close button, summary stats strip, scrollable column metadata table.

**`sign-in-card`** — Centered auth card. Background `{colors.card}`, `{colors.border}` border, rounded `{rounded.lg}` (10px), `shadow-sm`, padding `{spacing.6}` (24px). Max-width sm (384px). Carries heading, sub-heading, the form or OAuth button.

**`settings-card`** — Settings form container. Same treatment as sign-in-card at max-width xl (576px).

**`profile-list`** — User's dataset list. Background `{colors.card}`, `{colors.border}` border, rounded `{rounded.xl}`, `divide-y divide-{colors.border}`. Each row: file-type swatch + name/stats + edit/delete actions. Edit state expands an inline `{component.edit-tray}`.

**`edit-tray`** — Inline form row expansion. Background `{colors.secondary}`, `{colors.border}` top border, padding `{spacing.4}` (16px). Carries description textarea, license select, save/cancel actions.

**`upload-zone`** — Drag-drop file drop target. `{colors.border}` dashed 2px border, rounded `{rounded.lg}`, padding `{spacing.10}` (40px) vertical. Drag-active state: `{colors.primary}` border + `bg-primary/5` tint. Carries UploadCloud icon + instruction text + file type note.

### Tables

**`data-table`** — Standard tabular data container, used for any `<table>` presenting rows of records (admin breakdowns, AI-chat markdown tables, column metadata). Wrapper: background `{colors.card}`, `{colors.border}` hairline border, rounded `{rounded.xl}` (14px), `shadow-sm`, `overflow-hidden` — the same card treatment as `dataset-card`, so a table reads as a card, not a bare HTML grid. Header row: `{colors.muted}/40` background, `{colors.border}` bottom border, `text-xs font-medium text-{colors.muted-foreground}`, left-aligned cells. Body rows: `divide-y divide-{colors.border}`, no per-row background (hover tint optional for interactive tables). Cell padding `16px × 10px` (`px-4 py-2.5`); numeric/metric columns use `tabular-nums` and align left with the rest (no right-alignment) unless the table is dense enough that scanning a column of numbers benefits from it. Empty state: centered muted-foreground message in place of the table, no empty header row.

Examples: `ai-usage-route-breakdown` (admin AI usage dashboard), `dataset-chat-table` (markdown tables rendered in AI chat responses — same wrapper, plus a copy/download/expand action row).

### Inputs & Forms

**`text-input`** — Standard text input. Background transparent, `{colors.border}` border, type `{typography.body-sm}` (14px), rounded `{rounded.md}` (8px), padding 8px × 12px, height 36px (h-9). Focus: `{colors.ring}` border + `ring-1 ring-{colors.ring}/50`. `dark:bg-input/30`.

**`text-input-invalid`** — Error state. Border shifts to `{colors.destructive}`, ring to `{colors.destructive}/20`. `aria-invalid` attribute drives this automatically via CSS.

**`textarea`** — Multiline input. Same border/focus/radius as text-input. Min-height 64px, `field-sizing-content`.

**`select`** — Styled native select. Same border/focus/radius/height as text-input. Background `{colors.card}` on filled contexts (license select in upload form).

**`username-input-group`** — Compound input with `@` prefix swatch. Outer wrapper: `{colors.border}` border, `shadow-sm`, `rounded-md`, focus-within ring. Left swatch: `{colors.muted}` background, `{colors.border}` right border, `{colors.muted-foreground}` `@` text.

**`rich-text-editor`** — TipTap-powered description field. Outer: `{colors.border}` border, focus-within ring. Toolbar: `{colors.muted}` background, `{colors.border}` bottom border, ghost toolbar buttons that fill `{colors.muted}` on hover/active.

**`auth-input`** — Email/name/username inputs on the sign-in, onboarding, and account-security forms. Same shape as `text-input` but height 44px (h-9 → h-11) and background `{colors.card}` instead of transparent — these forms sit directly on `{colors.background}` (cream), so `text-input`'s default transparent fill has no contrast against the page; `{colors.card}` matches the social sign-in buttons' surface and reads as a distinct field.

**`otp-input`** — 6-digit code entry (email sign-in code, TOTP challenge, TOTP enrollment), built on `input-otp` (`@repo/ui/components/input-otp`). Slots stretch full-width (`flex-1`, container `w-full`) rather than the library's fixed `size-8` default, since the code is the sole focus of the step. Same height/background as `auth-input` (h-11, `{colors.card}`). Empty slots show a faint `000000` placeholder (`text-muted-foreground/50`) via the slot's `placeholderChar` — added to the shared `InputOTPSlot` in `packages/ui`, since shadcn's default template doesn't render it.

### Tags / Badges

**`dtype-badge`** — Data type label in column tables. Rounded `{rounded.sm}` (6px), padding 2px × 6px, `text-xs font-medium`. Color by type: float → `text-primary bg-primary/10`; int → `text-info bg-info/10`; string → `text-muted-foreground bg-muted`; boolean → `text-success bg-success/10`; datetime → `text-accent-foreground bg-accent/20`; unknown → `text-warning-foreground bg-warning/40`.

**`license-badge`** — License string chip on a dataset row. Background `{colors.muted}`, text `{colors.muted-foreground}`, rounded `{rounded.full}`, padding 2px × 8px, `text-xs`.

**`file-icon-swatch`** — Square swatch housing a FileText or FileSpreadsheet icon. Rounded `{rounded.lg}` (10px), padding `{spacing.2}` (8px). CSV/JSON: `bg-primary/10 text-primary`. Excel: `bg-success/10 text-success`.

### Tab / Filter

The dataset browser uses a search input as its primary filter — no tab bar. Category filtering (if introduced) should use the outline button pattern: inactive `{component.button-outline}`, active `{component.button-secondary}` fill. Rounded `{rounded.md}`, compact padding.

### Footer

**`marketing-footer`** — Full-width dark footer. Background `bg-[#0A2533]`. No dot-grid. White/muted text.
- **Mobile logo**: `logo-mark.svg` gradient mark (`h-9 w-9`), hidden at `md:`. Never inverted.
- **Desktop logo**: Full SVG wordmark with `brightness-0 invert`, hidden below `md:`.
- Link columns in muted-foreground with hover-to-foreground transition.

## Do's and Don'ts

### Do

- Anchor every surface on `{colors.background}` (#F8F3ED) or `{colors.card}` (#FFFCF8). Pure white reads as generic SaaS; the warm tint is the brand's defining choice.
- Use `{colors.primary}` (#155f6b) for every structural CTA, focus ring, selected state, and active indicator.
- Reserve `{colors.accent}` (terracotta) for warmth moments: icon swatches, chart callouts, data highlights. Keep it scarce in UI chrome.
- Use semantic color tokens exclusively (`bg-primary`, `text-foreground`, `border-border`) — never raw Tailwind gray/blue/green classes.
- Use `{component.dtype-badge}` token colors for data type labels. The teal/sage/green/terracotta mapping is the brand's data vocabulary.
- Apply `{rounded.2xl}` (16px) to all marketing feature cards and visualization panels. Use `{rounded.xl}` (14px) for dataset cards and data panels. Use `{rounded.md}` (8px) for buttons and inputs.
- Let `{colors.muted-foreground}` (#5C6B6E) carry all secondary text — timestamps, metadata, captions. Don't use additional tones for secondary text.
- In dark mode, use `{colors.primary-dark}` (terracotta #D4956A) as the active/primary color. The warm-in-dark inversion is the brand's dark mode signature.
- Use the gap-px grid pattern (`grid gap-px bg-border rounded-2xl overflow-hidden`) only when all grid cells are guaranteed to be filled. For variable-count grids (teams, community lists), use `gap-4` with individual card borders instead.
- Use `logo-mark.svg` on mobile; the full wordmark on desktop. Never apply `brightness-0 invert` to the gradient SVG mark.
- Use `font-black` (weight 900) for all section hero headings (h2 in bands). Reserve `font-semibold` (600) for card titles and compact UI elements.

### Don't

- Don't use `gray-*`, `blue-*`, `green-*`, or any raw Tailwind color classes. All color must come through CSS variables.
- Don't use pure white (`bg-white`) anywhere. Use `{colors.card}` (#FFFCF8) for the lightest surface.
- Don't use teal and terracotta at equal weight in the same component. One leads; the other supports.
- Don't use `text-white` on teal buttons — use `text-primary-foreground` (#F8F3ED) so the label echoes the cream canvas.
- Don't add destructive styling (red borders, error fills) to delete actions at rest. Only the trash icon itself signals the action; the destructive styling enters on hover.
- Don't use generic `focus:ring-blue-500` or similar. All focus rings must use `ring-ring/50` + `border-ring`.
- Don't render raw hex values (`#F8F3ED`, `#155f6b`) in component code. All values flow through CSS variables or Tailwind token classes — exception: `bg-[#0A2533]` is acceptable for the deep-navy dark surface since it's a fixed platform chrome color.
- Don't put teal file icon swatches and success-green file icon swatches on the same card without distinction — CSV is primary/teal, Excel is success/green. The color encodes the file type.
- Don't use `aspect-[4/3]` for team member card images. Use `h-36` (fixed height) so the card size stays predictable regardless of photo dimensions.
- Don't apply the gap-px grid to team or community member lists where count is variable — empty cells render as `bg-border` rectangles. Use `gap-4 lg:gap-6` instead.
- Don't move the mobile nav menu inside the `<header>` element — it must render as a `fixed` sibling outside the header so it doesn't push page content down.

## Responsive Behavior

### Breakpoints

| Name    | Width       | Key Changes                                                                                                         |
| ------- | ----------- | ------------------------------------------------------------------------------------------------------------------- |
| Mobile  | < 640px     | Single-column layout; side panel hidden; dataset grid 1-up; auth cards full-width; hero text centered; CTAs full-width |
| Tablet  | 640–1024px  | Dataset grid 2-up (container query `@md`); side panel appears; nav stays horizontal; hero text left-aligned         |
| Desktop | 1024–1280px | Marketing sections go 2-col split; floating viz panels appear; team grid 4-col; full side-panel + grid layout       |
| Wide    | > 1280px    | Same as desktop; container max-width (`max-w-7xl`) caps outer breathing room                                        |

Container queries (`@container`) drive the dataset card grid breakpoints rather than viewport queries — allowing the grid to respond to the available panel width regardless of the viewport width when the detail panel is open.

### Touch Targets

- `{component.button-primary}` at minimum 36px height (h-9) — above the 32px minimum, approaching 44px WCAG target.
- `{component.button-icon}` at 36px square (size-9). Adequate for data row actions.
- `{component.text-input}` height 36px (h-9).
- Dataset card entire surface is tappable; effective tap area exceeds 44px vertically.
- Team member card social icon buttons: `size-10` (40px) — meeting the 44px WCAG touch target with surrounding padding.
- Edit/delete icon buttons in data rows are 32px (p-1.5) — acceptable in dense data contexts where surrounding spacing adds effective tap area.

### Collapsing Strategy

- **Marketing navbar**: Mobile logo collapses to `logo-mark.svg` mark (`h-8 w-8`). Mobile nav links render as a `fixed inset-x-0 top-16 z-40` overlay (does NOT push page content). Auth CTAs remain in the right slot at all breakpoints — not in the mobile drawer.
- **Platform navbar**: Stays horizontal at all breakpoints — no hamburger. Upload button collapses to icon-only if needed.
- Dataset detail panel hides at mobile (`< 640px`); the selected-card state navigates to a full-screen detail view.
- Profile dataset list rows stack their metadata below the filename at narrow widths.
- Auth cards (sign-in, settings) are single-column at all sizes — they simply get less horizontal padding on mobile.
- Marketing hero: switches from left-aligned split layout to centered single column at mobile. CTAs go full-width (`w-full`) and stack vertically.
- Floating viz panels (hero, AI showcase, about origin): render as stacked `flex-col gap-4` cards at mobile; switch to `lg:block lg:h-[480px]` absolute-positioned floating layout at desktop.

### Image Behavior

- User avatar photos crop to `rounded-full` circles at all breakpoints.
- Team member card photos use `h-36 object-cover object-top` — portrait-oriented photos show faces correctly. The fixed height keeps the card grid even.
- Floating viz panel cards stack vertically on mobile (`max-w-md mx-auto flex flex-col gap-4`) and switch to absolute-positioned floating layout at `lg:` with a fixed container height.
- File-type icon swatches (40px at desktop, 32px at compact) scale proportionally.
- Charts and table content inside dataset panels retain legibility via horizontal scroll on narrow viewports.

## Iteration Guide

1. Focus on ONE component at a time. Reference its name (`{component.dataset-card}`, `{component.dtype-badge}`).
2. Variants (`-selected`, `-hover`, `-disabled`, `-focused`) are states of a single component, not new components.
3. Use `{token.refs}` everywhere — never inline hex values or raw Tailwind color classes in components.
4. Never document hover in detail. Default and Active/Selected states only; hover is a transition, not a design decision.
5. Bricolage Grotesque is the only display face. Don't introduce a serif display for headlines — the brand warmth comes from color, not typeface contrast.
6. Warm cream + teal + terracotta is the trinity. Don't add a fourth tone as an accent (no purple, no coral, no blue). Use the semantic tokens (success/warning/info/destructive) for status-only contexts.
7. When in doubt about visual emphasis: `font-black` at larger size before heavier weight at same size.
8. The `@theme inline` keyword in `packages/ui/src/styles/globals.css` is mandatory — without it, CSS variable tokens don't resolve correctly at runtime.
9. All apps must include `@source` pointing to their own `src/**` directory in their local CSS entry, in addition to importing `@repo/ui/globals.css`.
10. The gap-px grid pattern works only when the grid is fully populated. Verify member/item count before using it — if count is variable, use `gap-4` with individual card borders.
11. Section overlines always use: `font-mono text-[10px] font-medium uppercase tracking-[0.22em]` preceded by a `h-px w-4/5 bg-primary` (or `bg-primary-foreground` on dark) hairline rule in a `flex items-center gap-3` wrapper.

## Known Gaps

- Bricolage Grotesque must be self-hosted or loaded via a font provider. The current implementation loads it via Next.js `localFont` or Google Fonts — confirm the variable font file path in `apps/web` layout before deploying new apps.
- Dark mode ThemeProvider is implemented in the design system source but not yet wired into `apps/datasets`. The CSS variables are correct; the toggle UI and `next-themes` wrapper need to be added.
- Chart components (`recharts` wrappers) use the `{colors.aeschart-1}` through `{colors.aeschart-6}` series (see `apps/web/src/lib/platform/chart-theme.ts`).
- Animation and transition timings (skeleton pulse, accordion open/close, toast slide-in) are handled by `tw-animate-css` and shadcn defaults. Custom easing or durations are not yet formalized as tokens. Floating viz panel animations use inline `<style>` keyframe blocks — these should be moved to `globals.css` when there are more than two animated sections.
- The `apps/datasets` upload page has no confirmation/success state after a successful upload — the empty-state and success-band patterns need to be defined.
- Form validation error styling (`aria-invalid` focus ring) is encoded in the CSS but not yet exercised by server-side validation in tRPC mutations — only client-side Zod errors are currently shown.
- The mobile nav overlay currently has no entry/exit animation — it appears/disappears instantly. A `translate-y` or `opacity` transition should be added.
- The `AesopsOriginViz` and `AiShowcaseViz` components contain hardcoded copy (article title, dataset names, discussion snippets). When the platform grows, these should pull from real Sanity/DB data or at least be editable via Sanity block fields.
