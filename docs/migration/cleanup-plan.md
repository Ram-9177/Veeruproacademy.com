# Cleanup Plan (Safe)
Goal: remove all Node/Next.js/React/Prisma legacy code and reset documentation, leaving a clean Django monolith baseline.

## Safety Steps

1. Ensure the extracted docs exist in `docs/`.
2. Ensure Django runs: `python3 manage.py check`.
3. Only then delete legacy folders and configs.

## Delete (Legacy Framework Stack)

- Next.js / React / App Router
  - `app/`
  - `components/`
  - `lib/` (TypeScript utilities)
  - `src/` (React/Vite-like modules)
  - `styles/`, `sections/`, `schemas/`, `config/`
  - `middleware.ts`, `next.config.js`, `next-env.d.ts`, `next-auth.d.ts`, `global.d.ts`
- Node build + tooling
  - `package.json`, `package-lock.json`, `.nvmrc`, `.eslintrc.cjs`, `.prettierrc`, `babel*`, `jest*`, `playwright.config.ts`, `postcss.config.js`, `tailwind.config.js`, `vercel.json`, `.vercelignore`
- Prisma
  - `prisma/` (schema + migrations + seed)
- JS scripts/tests
  - root `scripts/` (Node scripts)
  - `__tests__/`, `__mocks__/`, `tests/`, `test-results/`

## Delete (Build Artifacts / Local Artifacts)

- `.next/`
- `node_modules/`
- `.venv/` (repo-local env)
- SQLite dev DB: `backend/db.sqlite3` (or `db.sqlite3` after restructuring)

## Keep / Migrate

- Preserve static branding assets:
  - copy selected files from `public/` into Django `static/` and then delete `public/`.

## Post-clean Verification

- `python3 manage.py check`
- `python3 manage.py migrate`
- Grep ensures no Next/Prisma references remain.
