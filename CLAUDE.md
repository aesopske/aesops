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
pnpm --filter @aesops/datasets dev     # http://localhost:3001

# Build / lint / typecheck (all)
pnpm build
pnpm lint
pnpm typecheck

# DB (run from packages/db)
pnpm --filter @repo/db db:generate     # generate migration from schema changes
pnpm --filter @repo/db db:migrate      # apply migrations to Neon
pnpm --filter @repo/db db:push         # push schema directly (dev only)
pnpm --filter @repo/db db:studio       # Drizzle Studio GUI
```

## Architecture

**Monorepo**: pnpm workspaces + Turborepo. Package names use `@repo/*` for shared packages and `@aesops/*` for apps.

### Apps

| App | Port | Purpose |
|-----|------|---------|
| `apps/web` | 3000 | Public marketing/content site — Next.js 15, Sanity CMS, embedded Studio |
| `apps/datasets` | 3001 | Authenticated dataset platform — Next.js 16, tRPC, Better Auth |

### Packages

| Package | Import | Purpose |
|---------|--------|---------|
| `packages/db` | `@repo/db` | Drizzle ORM + Neon serverless Postgres; exports `db` client and all schema tables |
| `packages/auth` | `@repo/auth` | Better Auth instance (server-only); exports `auth`, `Session`, `User` types |
| `packages/storage` | `@repo/storage` | UploadThing document storage abstraction; exports `documentService` singleton |
| `packages/env` | `@repo/env` | `@t3-oss/env-*` validated env modules by domain: `authEnv`, `databaseEnv`, `sanityEnv`, `storageEnv` |
| `packages/ui` | `@repo/ui` | Shared component library (shadcn/Radix UI); exports via `@repo/ui/components/*`, `@repo/ui/lib/*`, `@repo/ui/hooks/*` |
| `packages/config` | `@repo/config` | Shared ESLint and TypeScript configs |

### Data layer

**Database** (`packages/db/src/schema/`): Two schema files:
- `auth.ts` — `users`, `sessions`, `accounts`, `verifications` (Better Auth managed)
- `documents.ts` — `documents` table for uploaded dataset files; references `users`

**Content** (Sanity CMS): Schemas live in `apps/web/sanity/schemaTypes/`. Document types: `post`, `page`, `author`, `category`, `datasets`, `service`, `siteSettings`, `value`. The `page` document uses a `sections → pageSections` block array for flexible page building. Object types include `blockContent`, `codeBlock`, `youtubeEmbed`, `iframeEmbed`, `tableBlock`, etc.

**Auth** (`packages/auth`): Better Auth with email/password + GitHub OAuth. Users have additional fields: `username`, `bio`, `website`. The auth schema tables must stay in sync with the Better Auth config — run `db:generate` after changing `additionalFields`.

**Storage** (`packages/storage`): Provider-based abstraction; currently UploadThing. `documentService` is the singleton. To swap providers, instantiate `DocumentService` with a different `StorageProvider`.

### apps/web internals

- Sanity Studio embedded at `/studio` → `src/app/studio/[[...index]]`; config at `sanity.config.ts`, env at `sanity/env.ts`
- Server actions in `src/app/_actions/` (Resend for email)
- Providers (React Query, etc.) wrapped in `src/app/_providers/`
- Sanity preview mode via `src/app/api/preview/`
- Path aliases: `@/*` → `src/*`, `@components/*` → `src/components/*`, `~sanity/*` → `sanity/*`

### apps/datasets internals

- tRPC app router at `src/server/routers/`; HTTP handler at `src/app/api/trpc/[trpc]/`
- `publicProcedure` and `protectedProcedure` defined in `src/trpc/init.ts`; `protectedProcedure` validates `session` from Better Auth
- Server-side caller: `src/trpc/server.ts` exports `api` for RSC use
- File uploads via UploadThing at `src/app/api/uploadthing/`
- AI routes at `src/app/api/ai/` (Google Generative AI via Vercel AI SDK)

### Design system

Defined in `DESIGN.md` and implemented in `packages/ui/src/styles/globals.css`. Key tokens:
- **Primary**: teal `#2D6A73` (light) / terracotta `#D4956A` (dark — roles swap in dark mode)
- **Background**: cream `#F8F3ED` (light) / deep teal `#0A2533` (dark)
- **Typography**: Bricolage Grotesque (headings/UI), Lora Variable (editorial), Geist Mono (code/data)
- Use CSS variable tokens (`{colors.primary}`, `{colors.background}`, etc.) — never raw Tailwind hue classes for brand colors
- Data type badges use semantic tokens: teal=numeric, sage=info, success-green=boolean, terracotta=datetime

## Collaboration style

Push back when you have a stronger approach. If a proposed solution has a meaningful drawback — performance, correctness, maintainability, security — say so directly and explain why your alternative is better. Don't defer just to agree. Short, direct disagreement with a concrete reason is preferred over silent compliance.

## Coding conventions

- **Styling**: Tailwind utility classes always; inline `style` only when a value cannot be expressed as a utility (e.g. dynamic CSS custom properties).
- **Components**: One component per file — always. Never define a named component inside another component's file, even as a private helper. Follow atomic design — atoms → molecules → organisms → pages. Place shared components in `packages/ui/src/components/`; app-specific ones inside the app's `src/components/` tree.
- **shadcn**: Both `apps/web` and `apps/datasets` have `components.json`. Use shadcn components; add new ones via `pnpm dlx shadcn@latest add <component>` (they land in `@repo/ui/components/` per the aliases). Do not hand-roll primitives that shadcn provides.
- **Icons**: Use Lucide React (`lucide-react`) — it is the configured `iconLibrary` in both `components.json` files. `react-icons` is also available in `apps/web` as a fallback. Only create a custom SVG when the icon is genuinely absent from both libraries.
- **Comments**: Omit unless the logic is non-obvious. No block comments, no JSDoc on self-evident functions.

### File organisation (`apps/web/src/`)

Components are grouped by page/feature. Only extract to `shared/` when a component is genuinely used by more than one page/feature.

```
components/
  platform/
    auth/          ← auth page components (brand panel, github button)
    nav/           ← layout navigation (auth-nav-links, user-dropdown)
    dataset/       ← single dataset detail page components
    datasets/      ← datasets list/browse page components
    upload/        ← upload page components
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
```

In Next.js apps, `@t3-oss/env-nextjs` is used via `src/env.ts` for app-local vars.
