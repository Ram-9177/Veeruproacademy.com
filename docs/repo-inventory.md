# Repo Inventory & Categorization
This repo is now a Django templates-first monolith. This document records what existed pre-clean and where that knowledge now lives.

## Domain knowledge (keep/extract)

- Legacy Prisma schema and route inventory (preserve as read-only reference in `docs/_legacy/`).
  - `docs/_legacy/PRISMA_MODEL_MAP.md`
  - `docs/_legacy/ROUTE_INVENTORY.md`
- Key legacy domain flows embedded in TS:
  - RBAC/roles: `lib/auth.ts`
  - Course progress & certificates: `lib/course-tracking.ts`
  - Payment proof + admin approval: `app/api/courses/[slug]/payment/route.ts`, `app/api/admin/payment-requests/route.ts`
  - CMS slug/version helpers: `lib/cms-pages.ts`
  - Upload gating: `app/api/uploadthing/core.ts`

Note: those TypeScript sources were removed; the canonical replacement is documented in `docs/migration/domain-notes.md`.

## Framework / runtime (delete)

- Next.js/React runtime and code:
  - `app/`, `components/`, `lib/`, `src/`, `styles/`, `sections/`, `schemas/`, `config/`
- Prisma runtime:
  - `prisma/`
- Node runtime/tooling:
  - `package.json`, `package-lock.json`, `node_modules/`, `.next/`

Status: deleted.

## Business logic (rewrite in Django)

- All API route handlers under `app/api/**`.
- All UI routes/pages under `app/**` and `src/components/**`.

## Docs / markdown (migrate knowledge; delete stale)

- Root `*.md` files were largely Next.js/Vercel/Neon deployment reports.
- Those root docs were deleted; canonical docs are in `docs/` and the root README is Django-only.

## Build artifacts (delete)

- `.next/`, `node_modules/`, `test-results/` were deleted.

## Mock/demo/test/sample (delete)

- `__tests__/`, `__mocks__/`, `tests/`, Node seed scripts.

## Config/tools (evaluate)

- Keep: `.editorconfig`, `.gitignore` (rewrite for Python baseline)
- Delete: ESLint/Prettier/Babel/Jest/Playwright/Tailwind/Next/Vercel configs

## Assets/media/fonts/public (evaluate for reuse)

- `public/` was migrated into `static/branding/` and then deleted.
