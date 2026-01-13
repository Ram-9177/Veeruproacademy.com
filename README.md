# Veeru's Pro Academy

> **Live Deployment**: https://veeruproacademy.com

[![CI](https://github.com/KingVeerendra07/Veeru-s_Pro_Academy/workflows/CI/badge.svg)](https://github.com/KingVeerendra07/Veeru-s_Pro_Academy/actions/workflows/ci.yml)
[![Security](https://github.com/KingVeerendra07/Veeru-s_Pro_Academy/workflows/Security%20Scan/badge.svg)](https://github.com/KingVeerendra07/Veeru-s_Pro_Academy/actions/workflows/security.yml)
[![Deploy](https://github.com/KingVeerendra07/Veeru-s_Pro_Academy/workflows/Deploy%20to%20Production/badge.svg)](https://github.com/KingVeerendra07/Veeru-s_Pro_Academy/actions/workflows/deploy.yml)

## 🚀 Quick Deployment to Vercel + Neon

For complete step-by-step deployment instructions, see **[VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)**

## Quick Setup Summary

### 1) Create a new Neon database

1. Create a new Neon project/database at https://console.neon.tech
2. Copy both connection strings:
   - `DATABASE_URL` (pooled connection - for runtime)
   - `DIRECT_URL` (direct connection - for migrations)

### 2) Deploy to Vercel

1. In Vercel: **Add New → Project**
2. Import the GitHub repo: `KingVeerendra07/Veeru-s_Pro_Academy`
3. Framework preset: Next.js (auto-detected)

### 3) Configure Environment Variables

**Required variables in Vercel (Production):**

```bash
DATABASE_URL=postgresql://user:pass@host-pooler.neon.tech/db?sslmode=require
DIRECT_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
NEXTAUTH_SECRET=your-32-char-secret  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=https://www.veeruproacademy.com
NEXT_PUBLIC_SITE_URL=https://www.veeruproacademy.com
```

### 4) Deploy

Migrations run automatically via the `vercel-build` script. Just push to GitHub or click "Redeploy" in Vercel.

### 5) Create Admin User

Default credentials (change immediately):
- Email: `admin@veerupro.com`
- Password: `VeeruPro2024!`

---

## Fresh connect (GitHub → Vercel + Neon)

If you deleted your old Neon database and Vercel project, follow these steps to reconnect cleanly.

### 1) Create a new Neon database

1. Create a new Neon project/database.
2. Copy the connection strings:
   - `DATABASE_URL` (pooled / normal URL)
   - `DIRECT_URL` (direct / non-pooled URL used for migrations)

### 2) Create a new Vercel project from GitHub

1. In Vercel: **Add New → Project**.
2. Import the GitHub repo: `KingVeerendra07/Veeru-s_Pro_Academy`.
3. Framework preset: Next.js (auto-detected).

### 3) Configure required environment variables in Vercel

This app is configured to fail-fast in production if required env vars are missing.

Set these in Vercel (Production):

- `DATABASE_URL` = Neon pooled URL
- `DIRECT_URL` = Neon direct URL
- `NEXTAUTH_URL` = your production domain (example: `https://www.veeruproacademy.com`)
- `NEXTAUTH_SECRET` (or `AUTH_SECRET`) = a strong secret
  - Generate locally: `openssl rand -base64 32`

Optional (only if you use Google OAuth):

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### 4) Apply Prisma migrations to the new database

Migrations will run automatically during Vercel deployment. Alternatively, from your local machine:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
```

If the project has a seed script:

```bash
npx prisma db seed
```

### 5) Redeploy and create an admin user

After env vars + migrations are set, redeploy on Vercel.

To create/repair an admin user, use the admin setup endpoint:

- `POST /api/admin/create`
- Requires header `x-admin-setup-token: <ADMIN_SETUP_TOKEN>`

It will normalize email, set the user to `ACTIVE`, assign the `ADMIN` role, and set a bcrypt password hash.

## Local development

1. Copy `.env.example` → `.env.local` (if available) and fill values.
2. Run:

```bash
npm run dev
```
