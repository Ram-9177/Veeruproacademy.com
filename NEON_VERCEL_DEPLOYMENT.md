# Neon + Vercel Production Deployment Guide

Complete guide to deploy this Next.js application to Vercel with Neon serverless PostgreSQL database.

## Prerequisites

- [Vercel account](https://vercel.com/signup)
- [Neon account](https://neon.tech/signup)
- Git repository connected to Vercel
- Node.js 18+ installed locally

## Architecture Overview

```
┌─────────────────┐
│   Vercel        │
│  (App Router)   │
│                 │
│  ┌───────────┐  │      ┌──────────────────┐
│  │ Production│◄─┼──────►│ Neon Production │
│  │   (main)  │  │      │     Branch      │
│  └───────────┘  │      └──────────────────┘
│                 │
│  ┌───────────┐  │      ┌──────────────────┐
│  │  Preview  │◄─┼──────►│  Neon Preview   │
│  │(PR branch)│  │      │     Branch      │
│  └───────────┘  │      └──────────────────┘
└─────────────────┘

Local Dev → Uses local .env.local → Can connect to Neon dev branch or local Postgres
```

## Step 1: Set Up Neon Database

### 1.1 Create Neon Project

1. Go to [Neon Console](https://console.neon.tech/)
2. Click "New Project"
3. Choose a name (e.g., "veeru-pro-academy")
4. Select region closest to your Vercel deployment
5. Click "Create Project"

### 1.2 Get Connection Strings

Neon provides two types of connection strings:

**Pooled Connection** (for Vercel/serverless):
```
postgresql://user:pass@ep-xxx-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```
👆 **Use this for DATABASE_URL in Vercel**

**Direct Connection** (for migrations):
```
postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```
👆 **Use this for DIRECT_URL in Vercel**

### 1.3 Copy Your Connection Strings

In Neon Console:
1. Go to your project dashboard
2. Click "Connection Details"
3. Copy both "Pooled connection" and "Direct connection"
4. Save them securely (you'll need them in Step 3)

## Step 2: Prepare Your Repository

### 2.1 Update Database Client (Already Done ✅)

Your repository is already configured with the new Neon-optimized client. The key files are:
- `lib/db-neon.ts` - Enhanced database client with Neon configuration
- `lib/neon-config.ts` - Environment-specific configuration
- `lib/db.ts` - Original client (backward compatible)

### 2.2 Ensure Correct Runtime Settings

All API routes should use Node.js runtime (not Edge):
```typescript
// In your API routes: app/api/*/route.ts
export const runtime = 'nodejs' // ✅ Correct
export const dynamic = 'force-dynamic'
```

⚠️ **Never use Edge runtime with Prisma** - it won't work!

### 2.3 Verify Prisma Configuration

Your `prisma/schema.prisma` should have:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

This is already correct in your repository ✅

## Step 3: Configure Vercel Environment Variables

### 3.1 Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Select the repository
5. **Don't deploy yet** - configure environment variables first

### 3.2 Set Production Environment Variables

In Vercel project settings → Environment Variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `DATABASE_URL` | Neon **Pooled** connection string | Production |
| `DIRECT_URL` | Neon **Direct** connection string | Production |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` | Production |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | Production |

### 3.3 Set Preview Environment Variables

Same as production, but use Preview-specific values:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `DATABASE_URL` | Neon **Pooled** connection (can be same as prod or separate preview branch) | Preview |
| `DIRECT_URL` | Neon **Direct** connection | Preview |
| `NEXTAUTH_SECRET` | Same as production | Preview |
| `NEXTAUTH_URL` | `https://your-pr-url.vercel.app` | Preview |
| `NEXT_PUBLIC_SITE_URL` | `https://your-pr-url.vercel.app` | Preview |

**Tip**: You can use the same Neon database for preview, or create a separate Neon branch for preview deployments.

### 3.4 Optional: Set Development Environment Variables

These are only used if you connect to Vercel locally with `vercel dev`:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `DATABASE_URL` | Your local or Neon dev connection | Development |
| `NEXTAUTH_URL` | `http://localhost:3000` | Development |

## Step 4: Run Database Migrations

### 4.1 Locally (Recommended)

1. Create a `.env.local` file with your Neon DIRECT_URL:
```bash
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

2. Run migrations:
```bash
npm run db:generate
npx prisma migrate deploy
```

### 4.2 From Vercel (Alternative)

You can also run migrations as a Vercel build hook, but it's not recommended for initial setup.

## Step 5: Deploy to Vercel

### 5.1 Initial Deployment

1. In Vercel dashboard, click "Deploy"
2. Wait for build to complete
3. Vercel will automatically:
   - Install dependencies
   - Run `npm run vercel-build`
   - Generate Prisma client
   - Build Next.js app

### 5.2 Verify Deployment

1. Visit your deployed URL
2. Check logs in Vercel dashboard for any errors
3. Test database connectivity at `/api/health` (if you have a health check endpoint)

## Step 6: Enable Neon-Vercel Integration (Optional but Recommended)

### 6.1 Install Integration

1. Go to [Neon Vercel Integration](https://neon.tech/docs/guides/vercel)
2. Click "Add Integration"
3. Authorize Neon to access your Vercel project
4. Select your Vercel project
5. The integration will automatically:
   - Create a new Neon branch for each preview deployment
   - Set `DATABASE_URL` and `DIRECT_URL` for each environment
   - Clean up branches when PRs are closed

### 6.2 Benefits

- ✅ Automatic database branching for preview deployments
- ✅ No manual environment variable management
- ✅ Cost-efficient (preview branches auto-pause)
- ✅ Isolated testing environments

## Step 7: Test Your Deployment

### 7.1 Production Tests

Visit these URLs in production:
- Homepage: `https://your-domain.vercel.app`
- Courses: `https://your-domain.vercel.app/courses`
- API: `https://your-domain.vercel.app/api/courses`

### 7.2 Preview Deployment Tests

1. Create a new branch
2. Push to GitHub
3. Open a Pull Request
4. Vercel will automatically deploy a preview
5. Test the preview URL

## Troubleshooting

### Issue: "DATABASE_URL is not set"

**Solution**: 
1. Check Vercel environment variables are set correctly
2. Redeploy after adding environment variables
3. Ensure you're using the correct environment (Production/Preview)

### Issue: "Connection timeout"

**Solution**:
1. Verify you're using the **Pooled** connection string (ends with `-pooler`)
2. Check Neon database is not paused (free tier auto-pauses)
3. Ensure `runtime = 'nodejs'` in API routes (not 'edge')

### Issue: "Prisma client not generated"

**Solution**:
1. Ensure `postinstall` script runs: `"postinstall": "prisma generate"`
2. Check build logs for errors
3. Verify `DATABASE_URL` is available during build

### Issue: "Too many database connections"

**Solution**:
1. Verify using Neon **Pooled** connection string
2. Check connection pool settings in `lib/neon-config.ts`
3. Reduce `maxConnections` if needed

### Issue: Build fails with Prisma errors

**Solution**:
1. Ensure both `DATABASE_URL` and `DIRECT_URL` are set
2. Run `npx prisma generate` locally first
3. Commit `prisma/generated` if needed (not recommended, but can help debug)

## Advanced Configuration

### Custom Domain

1. In Vercel project settings → Domains
2. Add your custom domain
3. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to use custom domain
4. Update Vercel DNS or add CNAME record

### Monitoring

Set up monitoring with:
- Vercel Analytics (built-in)
- Neon Monitoring (in Neon console)
- Custom health check endpoints

### Scaling

Neon automatically scales:
- Compute scales to zero when idle (free tier)
- Storage scales automatically
- Connection pooling handled by Neon proxy

Vercel automatically scales:
- Serverless functions scale automatically
- No configuration needed

## Environment Variable Checklist

### Required for Production

- [ ] `DATABASE_URL` (Neon pooled)
- [ ] `DIRECT_URL` (Neon direct)
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXTAUTH_URL` (your production domain)
- [ ] `NEXT_PUBLIC_SITE_URL` (your production domain)

### Optional

- [ ] `GOOGLE_CLIENT_ID` (OAuth)
- [ ] `GOOGLE_CLIENT_SECRET` (OAuth)
- [ ] `YOUTUBE_API_KEY` (if using)
- [ ] `SUPABASE_*` (if using realtime)

## Migration Strategy

### From Local to Production

1. Export local database schema
2. Apply to Neon using migrations
3. Optionally seed data using `npm run db:seed`

### Zero-Downtime Updates

1. Create migration files locally
2. Test on Neon dev branch
3. Deploy migration to production
4. Vercel automatically redeploys

## Cost Optimization

### Neon Free Tier

- 512 MB storage
- 1 compute unit
- Auto-suspend after 5 minutes of inactivity
- Perfect for development and small projects

### Neon Pro Tier

- Unlimited storage
- Multiple compute units
- No auto-suspend
- Production-ready

### Vercel Free Tier

- 100 GB bandwidth
- Unlimited deployments
- Perfect for personal projects

## Support Resources

- [Neon Documentation](https://neon.tech/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## Summary

You're now ready to deploy! Follow these steps:

1. ✅ Create Neon project and get connection strings
2. ✅ Configure Vercel environment variables
3. ✅ Run database migrations
4. ✅ Deploy to Vercel
5. ✅ (Optional) Enable Neon-Vercel integration
6. ✅ Test your deployment

**Your app is production-ready with Neon + Vercel! 🚀**
