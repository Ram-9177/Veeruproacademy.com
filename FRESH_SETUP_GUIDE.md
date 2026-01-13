FRESH_SETUP_GUIDE.md# Fresh Setup Guide: Production-Ready Next.js + NextAuth + Prisma

This guide covers setting up a clean production environment with proper authentication, admin management, and deployment configuration.

## Prerequisites

- GitHub repository cloned
- Neon PostgreSQL account  
- Vercel account
- Node 20+ locally

## Part 1: Database Setup (Neon)

### 1.1 Create New Neon Database

1. Visit [console.neon.tech](https://console.neon.tech)
2. Create new project
3. Copy DATABASE_URL and DIRECT_URL from connection string
4. Save both URLs securely

### 1.2 Environment Variables for Local Development

Create `.env.local`:

```bash
DATABASE_URL="postgresql://user:password@endpoint/database"
DIRECT_URL="postgresql://user:password@endpoint/database"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"  # Generate unique secret
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

## Part 2: Auth Configuration (NextAuth)

### 2.1 Sign-Up Requirements

Ensure `app/api/auth/signup` route:
- Hashes passwords with bcrypt before storing
- Sets user status to **ACTIVE** by default
- Validates email format
- Prevents duplicate emails

**Verification Code:**
```typescript
// In signup route
const hashedPassword = await bcrypt.hash(password, 12);
const user = await prisma.user.create({
  data: {
    email,
    name,
    passwordHash: hashedPassword,
    status: 'ACTIVE',  // CRITICAL: Default to ACTIVE
  },
});
```

### 2.2 Sign-In Requirements

Ensure `app/api/auth/[...nextauth]` credentials provider:
- Performs **case-insensitive email lookup**
- Rejects PENDING/INACTIVE users
- Validates bcrypt password hash
- Returns session only for ACTIVE users

**Verification Code:**
```typescript
// In credentials provider
const user = await prisma.user.findUnique({
  where: { email: email.toLowerCase() },  // Case-insensitive
});

if (!user || user.status !== 'ACTIVE') {
  throw new CredentialsSigninError();
}

const isValid = await bcrypt.compare(password, user.passwordHash);
if (!isValid) throw new CredentialsSigninError();
```

### 2.3 Admin Bootstrap Endpoint

Create `app/api/admin/bootstrap` (token-protected) route:
- Accept admin setup token from env
- Create/repair admin user with ADMIN role
- Set user status to ACTIVE
- Set defaultRole to ADMIN

**Example Implementation:**
```typescript
// app/api/admin/bootstrap/route.ts
export async function POST(req: Request) {
  const { token } = await req.json();
  
  if (token !== process.env.ADMIN_BOOTSTRAP_TOKEN) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      status: 'ACTIVE',
      role: 'ADMIN',
      defaultRole: 'ADMIN',
    },
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      passwordHash: await bcrypt.hash('temporary', 12),
      status: 'ACTIVE',
      role: 'ADMIN',
      defaultRole: 'ADMIN',
    },
  });
  
  return Response.json({ success: true, admin });
}
```

Set environment variable:
```bash
ADMIN_BOOTSTRAP_TOKEN="your-secure-token"
```

## Part 3: CMS & Client Setup

### 3.1 Prisma Client on Server Only

- Never import Prisma client into client components
- Use Server Components for database queries
- Create API routes for client → server data fetching

**Bad (DO NOT DO):**
```typescript
// components/UserList.tsx (client component)
import { prisma } from '@/lib/prisma'; // ❌ WRONG
```

**Good:**
```typescript
// app/api/users/route.ts
export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}

// components/UserList.tsx (client component)  
'use client';
const users = await fetch('/api/users').then(r => r.json());
```

### 3.2 CMS Pages

- Build CMS routes without client-side Prisma imports
- Use getStaticProps/getServerSideProps or Server Components
- Verify no Prisma code in `components/` folder

## Part 4: Production Deployment

### 4.1 Vercel Project Setup

1. Connect GitHub repo to Vercel
2. Auto-deploy on push to main
3. **Do NOT set Vercel deployment secrets yet**

### 4.2 Environment Variables in Vercel

Set in Vercel Project Settings → Environment Variables:

```
DATABASE_URL = [Your Neon DATABASE_URL]
DIRECT_URL = [Your Neon DIRECT_URL]
NEXTAUTH_SECRET = [Generate: openssl rand -base64 32]
NEXTAUTH_URL = https://your-domain.vercel.app
ADMIN_BOOTSTRAP_TOKEN = [Your secure token]
NODE_ENV = production
```

### 4.3 Run Migrations

After first deploy, trigger migration:

```bash
# Via Vercel CLI
vercel env pull  # Get env vars locally
npm run db:migrate:deploy  # Run migrations
```

Or use Vercel deployment hooks to auto-run migrations.

### 4.4 Bootstrap Admin User

Call your bootstrap endpoint once:

```bash
curl -X POST https://your-domain.vercel.app/api/admin/bootstrap \
  -H 'Content-Type: application/json' \
  -d '{"token":"YOUR_ADMIN_BOOTSTRAP_TOKEN"}'
```

Then delete ADMIN_BOOTSTRAP_TOKEN from environment for security.

## Part 5: CI/CD Pipeline

### 5.1 GitHub Actions

Minimal CI workflow (`.github/workflows/ci.yml`) runs:
- `npm ci` - install dependencies
- `npm run lint` - check code quality
- `npm test` - run tests (if present)
- `npm run build` - verify Next.js build succeeds

Vercel Git Integration handles deployment automatically.

### 5.2 Build Verification

Before merging PRs, ensure:

```bash
npm run build  # Next.js build must pass
npm run lint   # No linting errors
```

## Part 6: Verification Checklist

- [ ] Database created in Neon
- [ ] DATABASE_URL + DIRECT_URL copied
- [ ] NEXTAUTH_SECRET generated (32+ chars)
- [ ] Prisma migrations applied: `npx prisma migrate deploy`
- [ ] Sign-up creates ACTIVE users with bcrypt-hashed passwords
- [ ] Sign-in validates case-insensitive email + active status
- [ ] Admin bootstrap endpoint working (token-protected)
- [ ] No Prisma imports in client components
- [ ] CMS routes build without client-side DB access
- [ ] Vercel connected to GitHub
- [ ] All env vars set in Vercel
- [ ] First deploy successful
- [ ] Admin user created via bootstrap endpoint
- [ ] Admin can sign in
- [ ] CI workflow runs on PR/push to main
- [ ] `npm run build` passes locally

## Troubleshooting

### "CredentialsSignin" Error on Login
- Check user status is ACTIVE (not PENDING)
- Verify email lookup is case-insensitive
- Confirm bcrypt password validation logic

### Build Fails on Deploy
- Ensure no Prisma imports in client components
- Check all required env vars are set in Vercel
- Run `npm run build` locally to reproduce

### Migrations Not Running
- Verify DATABASE_URL is set in Vercel
- Check Neon database connection
- Manually trigger: `vercel env pull && npm run db:migrate:deploy`

## Security Checklist

- [ ] Passwords always hashed (bcrypt)
- [ ] Admin bootstrap token used once, then removed
- [ ] NEXTAUTH_SECRET is random + 32+ characters  
- [ ] NEXTAUTH_URL matches production domain
- [ ] No hardcoded secrets in code
- [ ] Env vars only set in Vercel (not in repo)
- [ ] User status validated on sign-in
- [ ] Prisma client never exposed to client code
