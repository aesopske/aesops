## Overview

Aesops is a warm, editorial data platform. The base atmosphere is a **tinted cream canvas** (`{colors.background}` — #F8F3ED) — unmistakably warm, never the cool gray-white of generic SaaS. The primary typeface is **Bricolage Grotesque** — a wide, characterful geometric-grotesque — used at all weights for headings through UI labels, paired with **Lora Variable** for long-form editorial contexts and **Geist Mono** for data and code.

Brand voltage comes from the **teal + terracotta** palette. Teal (`{colors.primary}` — #2D6A73) is the structural accent — primary CTAs, active states, focus rings, data badges. Terracotta (`{colors.accent}` — #D4956A) is the warmth layer — used on callout moments, icon backgrounds, and chart highlights. In dark mode, these roles invert: terracotta becomes the primary interaction color and teal recedes to secondary.

The system has three surface modes:

1. **Cream canvas** (`{colors.background}`) — default page floor
2. **Off-white card surface** (`{colors.card}`) — component and data card backgrounds
3. **Deep teal dark surface** (`{colors.background-dark}` — #0A2533) — dark-mode default, used for product chrome, code blocks, and footer treatments

The cream-to-card contrast is subtle and editorial. The light-to-dark mode inversion is holistic — not just a color flip but a role-swap of teal and terracotta.

**Key Characteristics:**

- Warm cream canvas (`{colors.background}` — #F8F3ED) with deep-teal ink (`{colors.foreground}` — #0A2533). The brand's defining color choice — never pure white, never cool gray.
- Teal primary (`{colors.primary}` — #2D6A73) for all structural interactions (buttons, focus rings, active states). Terracotta accent (`{colors.accent}` — #D4956A) for warmth moments and data callouts.
- Bricolage Grotesque at all heading levels — wide, confident, geometric. No serif display face. The editorialness comes from whitespace and the warm palette, not from typeface contrast.
- Full dark mode where the primary role is held by terracotta (`{colors.primary-dark}` — #D4956A) and background becomes deep teal (`{colors.background-dark}` — #0A2533). The inversion is intentional: warm in dark.
- Border radius is hierarchical: `{rounded.md}` (8px) for buttons + inputs, `{rounded.lg}` (10px) for content cards, `{rounded.xl}` (14px) for elevated containers, `{rounded.full}` for pills and avatars.
- Data type badges use semantic color tokens — teal for numerics, sage for info, success-green for booleans, terracotta for datetime — never raw Tailwind hue classes.
- Section rhythm `{spacing.section}` (96px). Card padding generous at `{spacing.xl}` (32px), data-dense surfaces at `{spacing.lg}` (24px).

## Colors

### Brand & Accent

- **Teal / Primary** (`{colors.primary}` — #2D6A73): The structural brand color. Used on every primary CTA, active states, focus rings, selected indicators, and teal data badges. Conveys trust and depth.
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
- **Dark Background** (`{colors.background-dark}` — #0A2533): Dark-mode page floor. Deep teal — warm dark, not generic near-black.
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

- Bricolage Grotesque (weight 600–700) → `.text-display`, `.text-headline`, `.text-title`, headings
- Bricolage Grotesque (weight 400) → body, navigation, buttons, captions, labels
- Lora Variable → long-form editorial body (opt-in via `font-serif`)
- Geist Mono → code blocks, data type values, terminal output

### Hierarchy

| Token                    | Size     | Weight | Line Height | Letter Spacing | Use                                           |
| ------------------------ | -------- | ------ | ----------- | -------------- | --------------------------------------------- |
| `{typography.display}`   | 56px / 3.5rem | 700 | 1.0      | -0.02em        | Hero h1, major feature headlines — Bricolage  |
| `{typography.headline}`  | 36px / 2.25rem | 600 | 1.1      | -0.015em       | Section heads — Bricolage                     |
| `{typography.title}`     | 24px / 1.5rem | 600  | 1.25      | -0.01em        | Page titles, card headers — Bricolage         |
| `{typography.body-lg}`   | 18px / 1.125rem | 400 | 1.6      | —              | Feature intro paragraphs, lead text           |
| `{typography.body}`      | 16px / 1rem | 400    | 1.6      | —              | Default running text — Bricolage              |
| `{typography.body-sm}`   | 14px / 0.875rem | 400 | 1.5      | —              | Card metadata, form hints, footer body        |
| `{typography.caption}`   | 12px / 0.75rem | 400  | 1.4      | 0.01em         | Timestamps, file sizes, stat labels           |
| `{typography.overline}`  | 11px / 0.6875rem | 500 | 1.0      | 0.1em (uppercase) | Section labels, category overlines        |

### Principles

Display and headline weights use 600–700 with negative letter-spacing. The tracking is essential — Bricolage Grotesque without it reads as oversized body copy. The weight variation creates hierarchy without requiring a serif contrast face.

Body type stays at weight 400. The geometric character of Bricolage at small sizes is distinctive without competing with display sizes. Labels, buttons, and captions step to weight 500 for legibility at small sizes.

Line heights are generous (1.5–1.6) in body ranges to accommodate data-dense layouts without crowding.

### Note on Font Substitutes

If Bricolage Grotesque Variable is unavailable, **Plus Jakarta Sans** is the closest structural substitute — similarly wide, similarly geometric. **Inter** is a viable fallback for body/UI contexts but lacks the width and personality of Bricolage at display sizes. For the serif layer, **Lora** is a Google Font and always available; **Merriweather** is an acceptable body-serif alternative.

## Layout

### Spacing System

- **Base unit:** 4px.
- **Tokens:** `{spacing.1}` 4px · `{spacing.2}` 8px · `{spacing.3}` 12px · `{spacing.4}` 16px · `{spacing.6}` 24px · `{spacing.8}` 32px · `{spacing.12}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) between major page bands.
- **Card internal padding:** `{spacing.6}` (24px) for data cards and compact components; `{spacing.8}` (32px) for feature cards and primary content containers.
- **Grid gap:** `{spacing.4}` (16px) — the standard gap for all data and feature grids.

### Grid & Container

- **Max content width:** 1400px centered (via `@utility container`).
- **Body layout:** Single responsive column expanding to max-width; hero areas use 6/6 split at desktop (headline left, visual right).
- **Dataset card grids:** 1-up at mobile, 2-up at `@md`, 3-up at `@3xl` (using container queries).
- **Profile / settings pages:** Single centered column, max-width 3xl (768px) or xl (576px).
- **Side panel pattern:** Primary grid shrinks to flex-1; detail panel fixed at 420px, sticky top, max-height calc.

### Whitespace Philosophy

The cream canvas and generous internal padding create editorial pacing — Aesops feels like a considered data publication, not a dense tool. Whitespace between bands is 96px; whitespace inside cards is generous (24–32px). Data tables and column grids are the exception — they can be denser with 8px gaps, as long as the surrounding chrome (card borders, header padding) provides the breathing room.

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

The elevation philosophy is **surface-contrast first, shadow minimal**. Most depth comes from the `{colors.card}` vs `{colors.background}` tonal difference and the `{colors.border}` hairline. Shadows enter only when a layer truly floats above the page (popovers, modals). The dark surface (`{colors.background-dark}`) as a code block or side panel provides its own depth through contrast without needing a shadow.

### Decorative Depth

- File-type icons in data lists use a light-tinted background swatch (`bg-primary/10`, `bg-success/10`) to add visual anchoring without hard borders.
- Data type badges (DTypeBadge) use `bg-primary/10 text-primary` etc. — the tint is the depth signal, not a border.
- The dataset detail side panel is `position: sticky` with `overflow: hidden` + `shadow-sm` — elevation comes from the scroll behavior and the hairline border, not from shadows.
- Drag-drop upload zones use a subtle `bg-primary/5` tint on drag-over — the color shift IS the depth shift.

## Shapes

### Border Radius Scale

| Token            | Value     | Use                                                                  |
| ---------------- | --------- | -------------------------------------------------------------------- |
| `{rounded.sm}`   | 6px       | Small inline elements, edit-tray buttons, icon-only ghost buttons    |
| `{rounded.md}`   | 8px       | Standard buttons, text inputs, selects, checkboxes, textarea, badges |
| `{rounded.lg}`   | 10px      | Section containers, upload drop zones, alert boxes                   |
| `{rounded.xl}`   | 14px      | Dataset cards, detail panels, profile list containers                |
| `{rounded.2xl}`  | 16px      | Large feature cards, hero containers                                 |
| `{rounded.full}` | 9999px    | Pills, tags, avatar frames, license badges, count chips              |

The base variable is `--radius: 0.625rem` (10px). All tokens derive from it: `rounded-sm` = radius − 4px, `rounded-md` = radius − 2px, `rounded-lg` = radius, `rounded-xl` = radius + 4px.

### Photography & Illustrations

Aesops is data-first. Decorative illustration is minimal:

- User avatars crop to perfect circles (`rounded-full`) at 40px in navbars and 32px in compact contexts.
- File-type icons (FileText, FileSpreadsheet from Lucide) in tinted swatch containers replace thumbnail previews for data files.
- Empty states use a single centered icon (Search, Database) in a `bg-muted rounded-full` swatch with two lines of muted text — no illustrative spot art.
- Charts (Recharts) use the `{colors.chart-1}` through `{colors.chart-5}` series: teal → terracotta → sage → sienna → brown.

## Components

### Top Navigation

**`top-nav`** — Cream card bar pinned to the top of every page. 56px tall (`h-14`), `{colors.card}` background, `{colors.border}` bottom border. Logo (SVG wordmark) at left; right cluster carries the Upload primary button + `{component.user-dropdown}` for authenticated sessions, or a single "Sign in" text link for anonymous. Nav padding `{spacing.4}` (16px) horizontal. The Upload button is `{component.button-primary}` at small size.

### Buttons

**`button-primary`** — The structural teal CTA. Background `{colors.primary}` (#2D6A73), text `{colors.primary-foreground}` (#F8F3ED), type Bricolage Grotesque 14px / 500, padding `{spacing.3}` × `{spacing.4}` (12px × 16px), height 36px (h-9), rounded `{rounded.md}` (8px). Hover state `button-primary-hover` fades to `{colors.primary}/90`.

**`button-outline`** — Hairline-bordered button on cream. Background `{colors.card}`, text `{colors.foreground}`, 1px `{colors.border}` border. Hover fills `{colors.muted}`. Dark mode: `dark:bg-input/30`. Used for secondary actions: Cancel, Create account.

**`button-secondary`** — Filled secondary. Background `{colors.secondary}` (#EDE8E0), text `{colors.foreground}`. Hover darkens to `{colors.secondary}/80`. Used for non-primary option choices.

**`button-ghost`** — No background or border. Hover fills `{colors.muted}`. Used for icon actions in data rows (edit pencil, close panel), nav-level contextual actions.

**`button-destructive`** — Subtle destructive fill. Background `{colors.destructive}/10`, text `{colors.destructive}`. Hover deepens to `{colors.destructive}/20`. Used exclusively for delete / remove actions in data rows.

**`button-link`** — Inline text link. Text `{colors.primary}`, underline on hover with `underline-offset-4`. Used for "Create one", "Sign in" inline anchors.

**`button-icon`** — Square icon-only button at 36px (size-9). Shares variant styles above. Used for close-panel X, edit pencil, trash in data list rows.

### Cards & Containers

**`dataset-card`** — The primary data object card. Background `{colors.card}`, `{colors.border}` hairline border, rounded `{rounded.xl}` (14px), `shadow-sm`, padding `{spacing.4}` (16px). Carries a file-type icon swatch (primary or success tint), truncated filename, size · age metadata, row/column stats, and a column pill strip (up to 6, then "+N more"). Selected state: `{colors.primary}` border + `ring-1`.

**`dataset-panel`** — Side panel detail view for a selected dataset. Background `{colors.card}`, `{colors.border}` hairline border, rounded `{rounded.xl}`, `shadow-sm`. Fixed 420px width, sticky top, max-height calc. Header section with name + close button, summary stats strip, scrollable column metadata table.

**`sign-in-card`** — Centered auth card. Background `{colors.card}`, `{colors.border}` border, rounded `{rounded.lg}` (10px), `shadow-sm`, padding `{spacing.6}` (24px). Max-width sm (384px). Carries heading, sub-heading, the form or OAuth button.

**`settings-card`** — Settings form container. Same treatment as sign-in-card at max-width xl (576px).

**`profile-list`** — User's dataset list. Background `{colors.card}`, `{colors.border}` border, rounded `{rounded.xl}`, `divide-y divide-{colors.border}`. Each row: file-type swatch + name/stats + edit/delete actions. Edit state expands an inline `{component.edit-tray}`.

**`edit-tray`** — Inline form row expansion. Background `{colors.secondary}`, `{colors.border}` top border, padding `{spacing.4}` (16px). Carries description textarea, license select, save/cancel actions.

**`upload-zone`** — Drag-drop file drop target. `{colors.border}` dashed 2px border, rounded `{rounded.lg}`, padding `{spacing.10}` (40px) vertical. Drag-active state: `{colors.primary}` border + `bg-primary/5` tint. Carries UploadCloud icon + instruction text + file type note.

**`hero-band`** — Page hero section. `bg-gradient-to-b from-{colors.secondary} to-{colors.card}`, `{colors.border}` bottom border, 56px vertical padding. Centered icon swatch + h1 + sub-headline.

### Inputs & Forms

**`text-input`** — Standard text input. Background transparent, `{colors.border}` border, type `{typography.body-sm}` (14px), rounded `{rounded.md}` (8px), padding 8px × 12px, height 36px (h-9). Focus: `{colors.ring}` border + `ring-1 ring-{colors.ring}/50`. `dark:bg-input/30`.

**`text-input-invalid`** — Error state. Border shifts to `{colors.destructive}`, ring to `{colors.destructive}/20`. `aria-invalid` attribute drives this automatically via CSS.

**`textarea`** — Multiline input. Same border/focus/radius as text-input. Min-height 64px, `field-sizing-content`.

**`select`** — Styled native select. Same border/focus/radius/height as text-input. Background `{colors.card}` on filled contexts (license select in upload form).

**`username-input-group`** — Compound input with `@` prefix swatch. Outer wrapper: `{colors.border}` border, `shadow-sm`, `rounded-md`, focus-within ring. Left swatch: `{colors.muted}` background, `{colors.border}` right border, `{colors.muted-foreground}` `@` text.

**`rich-text-editor`** — TipTap-powered description field. Outer: `{colors.border}` border, focus-within ring. Toolbar: `{colors.muted}` background, `{colors.border}` bottom border, ghost toolbar buttons that fill `{colors.muted}` on hover/active.

### Tags / Badges

**`dtype-badge`** — Data type label in column tables. Rounded `{rounded.sm}` (6px), padding 2px × 6px, `text-xs font-medium`. Color by type: float → `text-primary bg-primary/10`; int → `text-info bg-info/10`; string → `text-muted-foreground bg-muted`; boolean → `text-success bg-success/10`; datetime → `text-accent-foreground bg-accent/20`; unknown → `text-warning-foreground bg-warning/40`.

**`license-badge`** — License string chip on a dataset row. Background `{colors.muted}`, text `{colors.muted-foreground}`, rounded `{rounded.full}`, padding 2px × 8px, `text-xs`.

**`file-icon-swatch`** — Square swatch housing a FileText or FileSpreadsheet icon. Rounded `{rounded.lg}` (10px), padding `{spacing.2}` (8px). CSV/JSON: `bg-primary/10 text-primary`. Excel: `bg-success/10 text-success`.

### Tab / Filter

The dataset browser uses a search input as its primary filter — no tab bar. Category filtering (if introduced) should use the outline button pattern: inactive `{component.button-outline}`, active `{component.button-secondary}` fill. Rounded `{rounded.md}`, compact padding.

### CTA / Footer

**`cta-band`** — Not yet implemented. When introduced: full-width teal band (`{colors.primary}` background), white-ish text (`{colors.primary-foreground}`), rounded `{rounded.lg}`, padding 64px. Carries an h2 in `{typography.headline}`, a sub-line, and a cream-outlined CTA button.

**`upload-page-band`** — The upload flow header band. Cream background, centered heading + sub-heading, max-width 2xl. Upload zone below.

**`empty-state`** — Centered empty placeholder. `{colors.muted}` circle icon swatch (`rounded-full`, 48px), `{typography.body}` label in `{colors.foreground}`, `{typography.body-sm}` sub-line in `{colors.muted-foreground}`.

## Do's and Don'ts

### Do

- Anchor every surface on `{colors.background}` (#F8F3ED) or `{colors.card}` (#FFFCF8). Pure white reads as generic SaaS; the warm tint is the brand's defining choice.
- Use `{colors.primary}` (teal) for every structural CTA, focus ring, selected state, and active indicator.
- Reserve `{colors.accent}` (terracotta) for warmth moments: icon swatches, chart callouts, data highlights. Keep it scarce in UI chrome.
- Use semantic color tokens exclusively (`bg-primary`, `text-foreground`, `border-border`) — never raw Tailwind gray/blue/green classes.
- Use `{component.dtype-badge}` token colors for data type labels. The teal/sage/green/terracotta mapping is the brand's data vocabulary.
- Apply `{rounded.xl}` (14px) to all data cards and panels. Use `{rounded.md}` (8px) for buttons and inputs.
- Let `{colors.muted-foreground}` (#5C6B6E) carry all secondary text — timestamps, metadata, captions. Don't use additional tones for secondary text.
- In dark mode, use `{colors.primary-dark}` (terracotta #D4956A) as the active/primary color. The warm-in-dark inversion is the brand's dark mode signature.

### Don't

- Don't use `gray-*`, `blue-*`, `green-*`, or any raw Tailwind color classes. All color must come through CSS variables.
- Don't use pure white (`bg-white`) anywhere. Use `{colors.card}` (#FFFCF8) for the lightest surface.
- Don't use teal and terracotta at equal weight in the same component. One leads; the other supports.
- Don't use `text-white` on teal buttons — use `text-primary-foreground` (#F8F3ED) so the label echoes the cream canvas.
- Don't add destructive styling (red borders, error fills) to delete actions at rest. Only the trash icon itself signals the action; the destructive styling enters on hover.
- Don't use generic `focus:ring-blue-500` or similar. All focus rings must use `ring-ring/50` + `border-ring`.
- Don't render raw `#F8F3ED` or other hex values in component code. All values flow through CSS variables.
- Don't put teal file icon swatches and success-green file icon swatches on the same card without distinction — CSV is primary/teal, Excel is success/green. The color encodes the file type.

## Responsive Behavior

### Breakpoints

| Name    | Width       | Key Changes                                                                                                         |
| ------- | ----------- | ------------------------------------------------------------------------------------------------------------------- |
| Mobile  | < 640px     | Single-column layout; side panel hidden; dataset grid 1-up; auth cards full-width with horizontal padding only      |
| Tablet  | 640–1024px  | Dataset grid 2-up (container query `@md`); side panel appears; nav stays horizontal                                 |
| Desktop | 1024–1280px | Dataset grid 3-up (container query `@3xl`); full side-panel + grid layout; profile/settings page max-width applies  |
| Wide    | > 1280px    | Same as desktop; container max-width 1400px caps outer breathing room                                               |

Container queries (`@container`) drive the dataset card grid breakpoints rather than viewport queries — allowing the grid to respond to the available panel width regardless of the viewport width when the detail panel is open.

### Touch Targets

- `{component.button-primary}` at minimum 36px height (h-9) — above the 32px minimum, approaching 44px WCAG target.
- `{component.button-icon}` at 36px square (size-9). Adequate for data row actions.
- `{component.text-input}` height 36px (h-9).
- Dataset card entire surface is tappable; effective tap area exceeds 44px vertically.
- Edit/delete icon buttons in data rows are 32px (p-1.5) — acceptable in dense data contexts where surrounding spacing adds effective tap area.

### Collapsing Strategy

- Top nav stays horizontal at all breakpoints — no hamburger. At mobile, the Upload button collapses to icon-only if needed.
- Dataset detail panel hides at mobile (`< 640px`); the selected-card state should instead navigate to a full-screen detail view (not yet implemented).
- Profile dataset list rows stack their metadata below the filename at narrow widths.
- Auth cards (sign-in, settings) are single-column at all sizes — they simply get less horizontal padding on mobile.
- Upload zone retains its height and dashed border at all breakpoints; the internal icon + text stacks vertically naturally.

### Image Behavior

- User avatar photos crop to `rounded-full` circles at all breakpoints.
- File-type icon swatches (40px at desktop, 32px at compact) scale proportionally.
- No photography or illustration assets currently in the system — only Lucide icons and data chrome.
- Chart/table content inside dataset panels retains legibility via horizontal scroll on narrow viewports rather than reflowing.

## Iteration Guide

1. Focus on ONE component at a time. Reference its name (`{component.dataset-card}`, `{component.dtype-badge}`).
2. Variants (`-selected`, `-hover`, `-disabled`, `-focused`) are states of a single component, not new components.
3. Use `{token.refs}` everywhere — never inline hex values or raw Tailwind color classes in components.
4. Never document hover in detail. Default and Active/Selected states only; hover is a transition, not a design decision.
5. Bricolage Grotesque is the only display face. Don't introduce a serif display for headlines — the brand warmth comes from color, not typeface contrast.
6. Warm cream + teal + terracotta is the trinity. Don't add a fourth tone as an accent (no purple, no coral, no blue). Use the semantic tokens (success/warning/info/destructive) for status-only contexts.
7. When in doubt about visual emphasis: larger Bricolage Grotesque before heavier weight.
8. The `@theme inline` keyword in `packages/ui/src/styles/globals.css` is mandatory — without it, CSS variable tokens don't resolve correctly at runtime.
9. All apps must include `@source` pointing to their own `src/**` directory in their local CSS entry, in addition to importing `@repo/ui/globals.css`.

## Known Gaps

- Bricolage Grotesque must be self-hosted or loaded via a font provider. The current implementation loads it via Next.js `localFont` or Google Fonts — confirm the variable font file path in `apps/web` layout before deploying new apps.
- Dark mode ThemeProvider is implemented in `b_foazAyqGIPs` (design system source) but not yet wired into `apps/datasets`. The CSS variables are correct; the toggle UI and `next-themes` wrapper need to be added.
- The `{component.cta-band}` (teal full-bleed CTA section) is designed but not yet built. When introduced, it should use `{colors.primary}` background with a cream-outlined secondary button — not a white button.
- Chart components (`recharts` wrappers in `b_foazAyqGIPs/components/ui/chart.tsx`) use the `{colors.chart-1}` through `{colors.chart-5}` series but are not yet imported into `apps/datasets`.
- Animation and transition timings (skeleton pulse, accordion open/close, toast slide-in) are handled by `tw-animate-css` and shadcn defaults. Custom easing or durations are not yet formalized as tokens.
- The `apps/datasets` upload page has no confirmation/success state after a successful upload — the empty-state and success-band patterns need to be defined.
- Form validation error styling (`aria-invalid` focus ring) is encoded in the CSS but not yet exercised by server-side validation in tRPC mutations — only client-side Zod errors are currently shown.
