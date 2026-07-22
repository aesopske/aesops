# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pnpm install

# Dev (all apps)
pnpm dev

# Dev (single app)
pnpm --filter @aesops/web dev          # http://localhost:3000

# Build / lint / typecheck (all)
pnpm build
pnpm lint
pnpm typecheck

# DB (run from packages/db)
pnpm --filter @repo/db db:generate     # generate migration from schema changes
pnpm --filter @repo/db db:migrate      # apply migrations to Neon
pnpm --filter @repo/db db:push         # push schema directly (dev only)
pnpm --filter @repo/db db:studio       # Drizzle Studio GUI

# Sanity content sync (development dataset → production dataset)
pnpm --filter @aesops/web sync-content -- <docId> [docId...]
```

## Architecture

**Monorepo**: pnpm workspaces + Turborepo. Package names use `@repo/*` for shared packages and `@aesops/*` for apps.

### Apps

| App | Port | Purpose |
|-----|------|---------|
| `apps/web` | 3000 | Next.js 16 app hosting **both** the public marketing/content site (Sanity CMS, embedded Studio) **and** the authenticated dataset platform (tRPC, Better Auth, uploads, AI routes) |
| `apps/duckdb-executor` | — | Python (Vercel) service running native DuckDB; queried by `apps/web` over a shared secret. See `apps/web/src/lib/platform/duckdb-executor-client.ts` |
| `apps/scrapers` | — | Python/`uv`-managed suite of dataset scrapers (~24 modules under `src/`, each with `main.py`/`parse.py`/`validate.py`/`NOTES.md`); scheduled via `.github/workflows/` (cron + `workflow_dispatch` with production/preview environment input) and uploads results through `apps/web`'s `src/app/api/scraper/upload/` endpoint. Entrypoints wrap logic in Sentry's `track_errors()` (`src/utils/error_tracking.py`). See `apps/scrapers/README.md` |

### Packages

| Package | Import | Purpose |
|---------|--------|---------|
| `packages/db` | `@repo/db` | Drizzle ORM + Neon serverless Postgres; exports `db` client and all schema tables |
| `packages/auth` | `@repo/auth` | Better Auth instance (server-only); exports `auth`, `Session`, `User` types |
| `packages/storage` | `@repo/storage` | Cloudflare R2 document storage abstraction; exports `documentService` singleton |
| `packages/env` | `@repo/env` | `@t3-oss/env-*` validated env modules by domain: `authEnv`, `databaseEnv`, `emailEnv`, `sanityEnv`, `storageEnv`, `zohoEnv` |
| `packages/ui` | `@repo/ui` | Shared component library (shadcn/Radix UI); exports via `@repo/ui/components/*`, `@repo/ui/lib/*`, `@repo/ui/hooks/*` |
| `packages/config` | `@repo/config` | Shared ESLint and TypeScript configs |
| `packages/zoho` | `@repo/zoho` | Zoho Bigin CRM sync — `syncLeadToZoho()` upserts a Contact and creates a Deal in the Software Consulting pipeline. See the **CRM sync** note below for the refresh-token setup |

### Data layer

**Database** (`packages/db/src/schema/`):
- `auth.ts` — `users`, `sessions`, `accounts`, `verifications`, `two_factors` (Better Auth managed). `users.two_factor_enabled` and `sessions.two_factor_verified` are layered on top of the stock Better Auth fields — see the `Auth` note below
- `documents.ts` — `documents` table for uploaded dataset files; references `users`
- `ai-usage.ts` — AI route usage tracking, backs the `admin-ai-usage` tRPC router
- `analytics.ts` — platform analytics tables
- `chat.ts` — AI chat conversation/message tables
- `community.ts` — discussion threads and related community-feature tables, backs the `community` tRPC router

**Content** (Sanity CMS): Schemas live in `apps/web/sanity/schemaTypes/`. Document types: `post`, `page`, `author`, `category`, `datasets`, `service`, `siteSettings`, `value`. The `page` document uses a `sections → pageSections` block array for flexible page building. Object types include `blockContent`, `codeBlock`, `youtubeEmbed`, `iframeEmbed`, `tableBlock`, etc. The `page` document also has a `pageType: 'legal'` variant (unhides `body`/`blockContent` instead of `sections`) for long-form legal content, rendered via `LegalPageDetail`.

Two datasets: `development` and `production` (same project, same `SANITY_API_TOKEN`/`NEXT_PUBLIC_SANITY_PROJECT_ID` since tokens are project-scoped). There is no paid dataset-sync/environments feature in use, so content created in `development` does **not** automatically appear in `production` — schema changes are fine (they're code, deployed with the app), but documents need `apps/web/scripts/sync-content.ts` (`pnpm --filter @aesops/web sync-content -- <docId>`) to copy them across via `createOrReplace`.

**Auth** (`packages/auth`): Better Auth, passwordless — no `emailAndPassword`. Primary sign-in is the `emailOTP` plugin (a 6-digit code emailed via Resend, `packages/auth/src/email.ts`); verifying it creates the user on first use, so there's no separate sign-up flow (`(auth)/sign-up` just redirects to `/sign-in`). GitHub & Google OAuth remain as alternatives. Optional TOTP two-factor is the `twoFactor` plugin (`allowPasswordless: true` — there's no password to confirm with; must be set top-level on the plugin options, not nested under `totpOptions`/`otpOptions`, or the enable/disable endpoints still demand one). The `apiKey` plugin (`@better-auth/api-key`) remains for programmatic access. Users have additional fields: `username`, `bio`, `website`, `twoFactorEnabled`.

Better Auth's `twoFactor` plugin only auto-intercepts `/sign-in/email`, `/sign-in/username`, `/sign-in/phone-number` — **not** our `/sign-in/email-otp` route — so a 2FA-enabled user would otherwise get a fully valid session before the second factor is ever checked. `packages/auth/src/index.ts` closes this with its own `databaseHooks.session.create.before` (stamps every new session `twoFactorVerified: false` when the user has 2FA on) and a `hooks.after` on the verify-* endpoints (flips it back to `true` — targets the user's most-recently-created session, since those endpoints create a session directly rather than through a path that populates `ctx.context.newSession`). Anything gating access to the platform **must** use `apps/web/src/lib/platform/session.ts`'s `getVerifiedSession()` instead of calling `auth.api.getSession()` directly, or it'll skip this check — it's already wired into every page/API-route session check and `trpc/init.ts`'s `protectedProcedure`.

The auth schema tables must stay in sync with the Better Auth config — run `db:generate` after changing `additionalFields`. **`db:migrate` doesn't apply cleanly against this project's Neon DB** — new auth-table migrations are applied via a matching idempotent `scripts/add-*.mjs` script instead (`db:add-api-key-table`, `db:add-two-factor-table`, `db:add-two-factor-verified-column` are the existing examples; follow that pattern for the next one).

**Storage** (`packages/storage`): Provider-based abstraction; currently Cloudflare R2 (`R2Provider`). `documentService` is the singleton. To swap providers, instantiate `DocumentService` with a different `StorageProvider`.

**CRM sync** (`packages/zoho`): every lead captured via `leadsRouter.submit` (`apps/web/src/server/routers/leads.ts`) is also pushed into Zoho Bigin — `syncLeadToZoho()` upserts a Contact by email, then creates a Deal in the "Software Consulting" pipeline at the "Qualification" stage, linked to that contact. This runs fire-and-forget in its own try/catch after the email notification (same pattern as that block) — a failed sync is logged and recorded on the row (`zoho_sync_error`), never blocking the form submission.

Auth is OAuth 2.0 via a **refresh token**, not the client id/secret alone — `ZOHO_CLIENT_ID`/`ZOHO_CLIENT_SECRET`/`ZOHO_REFRESH_TOKEN`/`ZOHO_DC` (`zohoEnv`, `@repo/env/zoho`). `packages/zoho/src/token.ts` exchanges the refresh token for a short-lived access token (per-instance in-memory cache, 5-min refresh buffer) via `POST https://accounts.zoho.{ZOHO_DC}/oauth/v2/token`. The account is on the **EU** data center (`ZOHO_DC=eu`).

To (re)generate `ZOHO_REFRESH_TOKEN` when it's rotated or needs a wider scope:
1. Zoho API Console → the app's **Self Client** → **Generate Code** tab.
2. Scope: `ZohoBigin.modules.contacts.ALL,ZohoBigin.modules.pipelines.ALL,ZohoBigin.settings.layouts.READ` (contacts + pipelines for the sync itself; `settings.layouts.READ` only needed if re-deriving `ZOHO_SOFTWARE_CONSULTING_LAYOUT_ID`, see below). Note Bigin's module is called **`Pipelines`** in the API, not `Deals` — a scope of `...modules.deals.ALL` looks plausible but 401s.
3. Expiry: 10 minutes (max). Copy the generated code immediately.
4. Exchange it before it expires:
   ```bash
   curl -X POST https://accounts.zoho.eu/oauth/v2/token \
     -d grant_type=authorization_code \
     -d client_id=$ZOHO_CLIENT_ID \
     -d client_secret=$ZOHO_CLIENT_SECRET \
     -d redirect_uri=https://www.zoho.com \
     -d code=<the generated code>
   ```
   (`redirect_uri` just has to match what's registered on the Self Client — nothing actually redirects here.)
5. The response's `refresh_token` is long-lived (doesn't expire until revoked) — that's what goes into `ZOHO_REFRESH_TOKEN` in `.env.local`.

Bigin API quirks worth knowing if this ever needs touching again (none of this is documented clearly by Zoho): creating a `Pipelines` record requires an explicit `Layout: { id }` — it will not infer the layout from a pipeline name field. `ZOHO_SOFTWARE_CONSULTING_LAYOUT_ID` (`packages/zoho/src/constants.ts`) was looked up via `GET /settings/layouts?module=Pipelines` (requires the `settings.layouts.READ` scope above) and is unlikely to change unless the pipeline is deleted/recreated in Bigin. `Sub_Pipeline` is a separate required string following a `"<Layout name> <Profile name>"` convention (`"Software Consulting Standard"`). `Closing_Date` is mandatory on create — defaulted to 30 days out since a fresh inbound lead has no real expected close date yet.

### apps/web internals

Everything below lives in the single `apps/web` app (marketing site + dataset platform).

Marketing/content site:
- Sanity Studio embedded at `/studio` → `src/app/studio/[[...index]]`; config at `sanity.config.ts`, env at `sanity/env.ts`
- Providers (React Query, etc.) wrapped in `src/app/_providers/`
- Sanity preview mode via `src/app/api/preview/`
- Path aliases: `@/*` → `src/*`, `@components/*` → `src/components/*`, `~sanity/*` → `sanity/*`

Auth flow — `src/app/(auth)/`: `sign-in/` (email-code entry, GitHub/Google buttons), `sign-up/` (redirects to `sign-in`), `onboarding/` (profile + optional TOTP setup, reuses the sign-in page's two-column shell with per-step brand-panel copy).

Dataset platform — route groups at `src/app/(platform)/`:
- `datasets/` — list/browse and `[slug]/` detail + `[slug]/edit/` pages
- `upload/` — upload flow
- `community/` — discussions list, thread view (`discussions/[threadId]/`), and a parallel/intercepting route for the new-discussion modal (`discussions/@modal/(.)new/`)
- `admin/` and `admin/api-keys/` — admin dashboard and API key management UI
- `profile/`, `profile/account/`, `profile/downloads/`

tRPC:
- App router at `src/server/routers/`: `admin-ai-usage.ts`, `admin-api-keys.ts`, `comments.ts`, `community.ts`, `documents.ts`; HTTP handler at `src/app/api/trpc/[trpc]/`
- `publicProcedure` and `protectedProcedure` defined in `src/trpc/init.ts`; `protectedProcedure` validates `session` from Better Auth and rejects a session with a pending 2FA challenge (`session.session.twoFactorVerified === false`)
- Server-side caller: `src/trpc/server.ts` exports `api` for RSC use

API routes (`src/app/api/`):
- Dataset REST routes at `datasets/[id]/{parquet,merge,diff}/` (derive/merge Parquet artifacts); shared pipeline logic in `src/lib/platform/dataset-pipeline.ts`
- `download/[id]/` — dataset file download
- `completion/` and `ai/` — AI routes (Google Generative AI via Vercel AI SDK)
- `revalidate/` — on-demand ISR revalidation
- Programmatic upload for scraper scripts at `scraper/upload/` (Better Auth API key auth, scope `datasets: ['write']`) — consumed by `apps/scrapers`' GitHub Actions workflows

**Observability**: Sentry (`@sentry/nextjs`, `@sentry/core`) is wired into `apps/web`; `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT` are declared in the root `turbo.json` `globalEnv`. `apps/scrapers` reports to the same Sentry project via `track_errors()`.

### Design system

Defined in `DESIGN.md` and implemented in `packages/ui/src/styles/globals.css`. Key tokens:
- **Primary**: teal `#155f6b` (light) / terracotta `#D4956A` (dark — roles swap in dark mode)
- **Background**: cream `#F8F3ED` (light) / deep teal `#0A2533` (dark)
- **Typography**: Bricolage Grotesque (headings/UI), Lora Variable (editorial), Geist Mono (code/data)
- Use CSS variable tokens (`{colors.primary}`, `{colors.background}`, etc.) — never raw Tailwind hue classes for brand colors
- Data type badges use semantic tokens: teal=numeric, sage=info, success-green=boolean, terracotta=datetime

## Collaboration style

Push back when you have a stronger approach. If a proposed solution has a meaningful drawback — performance, correctness, maintainability, security — say so directly and explain why your alternative is better. Don't defer just to agree. Short, direct disagreement with a concrete reason is preferred over silent compliance.

## Coding conventions

- **Styling**: Tailwind utility classes always; inline `style` only when a value cannot be expressed as a utility (e.g. dynamic CSS custom properties).
- **Components**: One component per file — always. Never define a named component inside another component's file, even as a private helper. Follow atomic design — atoms → molecules → organisms → pages. Place shared components in `packages/ui/src/components/`; app-specific ones inside the app's `src/components/` tree.
- **shadcn**: `apps/web` has a `components.json`. Use shadcn components; add new ones via `pnpm dlx shadcn@latest add <component>` (they land in `@repo/ui/components/` per the aliases). Do not hand-roll primitives that shadcn provides.
- **Icons**: Use Lucide React (`lucide-react`) — it is the configured `iconLibrary` in `components.json`. `react-icons` is also available in `apps/web` as a fallback. Only create a custom SVG when the icon is genuinely absent from both libraries.
- **Comments**: Omit unless the logic is non-obvious. No block comments, no JSDoc on self-evident functions.

### File organisation (`apps/web/src/`)

Components are grouped by page/feature. Only extract to `shared/` when a component is genuinely used by more than one page/feature.

```
components/
  platform/
    auth/          ← auth page components (email-OTP form, brand panel, github/google buttons, TOTP enrollment)
    nav/           ← layout navigation (auth-nav-links, user-dropdown)
    dataset/       ← single dataset detail page components
    datasets/      ← datasets list/browse page components
    upload/        ← upload page components
    community/     ← discussions/community page components
    admin/         ← admin dashboard components
  shared/          ← components used across multiple platform features
  common/          ← marketing/content site components

lib/
  constants/       ← app-wide constant values (e.g. LICENSES)
  schemas/         ← Zod validation schemas + inferred TS types
  platform/        ← platform-specific utilities (format, metadata, etc.)
```

Page-colocated components that are only used by one route live in the route's `_components/` folder (e.g. `app/(platform)/datasets/[id]/edit/_components/`). When a component outgrows a single page, move it to the appropriate `components/platform/<feature>/` folder.

When moving files, prefer `mv` over rewriting. Update imports with `sed` for bulk path changes.

### Env validation

Never read `process.env` directly in shared packages. Import from `@repo/env`:

```ts
import { databaseEnv } from '@repo/env/database'
import { sanityEnv } from '@repo/env/sanity'
import { authEnv } from '@repo/env/auth'
import { storageEnv } from '@repo/env/storage'
import { emailEnv } from '@repo/env/email'
```

In Next.js apps, `@t3-oss/env-nextjs` is used via `src/env.ts` for app-local vars.
