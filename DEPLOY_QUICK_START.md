# Production Deployment - Quick Reference

## ✅ Status: READY FOR DEPLOYMENT

This application is now production-ready with Neon + Vercel deployment configuration.

## 🚀 Quick Deploy (5 Minutes)

### Step 1: Local Setup
```bash
# Run interactive setup script
bash scripts/setup-neon-env.sh

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate
```

### Step 2: Create Neon Database
1. Go to [Neon Console](https://console.neon.tech/)
2. Create new project
3. Copy connection strings:
   - **Pooled** (ends with `-pooler`) → Use for `DATABASE_URL`
   - **Direct** → Use for `DIRECT_URL`

### Step 3: Configure Vercel
Set these environment variables in Vercel dashboard:

**Production Environment:**
- `DATABASE_URL` = Neon pooled connection
- `DIRECT_URL` = Neon direct connection  
- `NEXTAUTH_SECRET` = Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` = `https://your-domain.vercel.app`
- `NEXT_PUBLIC_SITE_URL` = `https://your-domain.vercel.app`

**Preview Environment:** (Same as production, or use separate Neon branch)
- Same variables as above
- Use preview-specific URLs

### Step 4: Run Migrations
```bash
# Set DATABASE_URL and DIRECT_URL in .env.local
npx prisma migrate deploy
```

### Step 5: Deploy
```bash
git push  # Vercel auto-deploys from connected GitHub repo
```

### Step 6: Verify
```bash
# Check health endpoint
curl https://your-app.vercel.app/api/health

# Should return:
# { "status": "healthy", "checks": { "database": { "connected": true } } }
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| **NEON_VERCEL_DEPLOYMENT.md** | Complete step-by-step deployment guide (10,000+ words) |
| **WORKFLOW_SETUP.md** | GitHub Actions workflow setup |
| **WORKFLOW_FIXES_SUMMARY.md** | CI/CD fixes summary |

## 🔧 Key Files

| File | Purpose |
|------|---------|
| `lib/neon-config.ts` | Environment detection and Neon configuration |
| `lib/db-neon.ts` | Production-optimized database client |
| `lib/db.ts` | Original database client (still works) |
| `app/api/health/route.ts` | Health monitoring endpoint |
| `scripts/setup-neon-env.sh` | Interactive environment setup |

## ✅ What's Already Configured

- ✅ Prisma with proper singleton pattern
- ✅ Node.js runtime for all database operations
- ✅ Environment-specific configuration
- ✅ Connection pooling optimized for serverless
- ✅ Health monitoring endpoint
- ✅ Build scripts for Vercel
- ✅ Error handling and logging

## 🎯 Environment Variables Checklist

### Required (Production)
- [ ] `DATABASE_URL` - Neon pooled connection string
- [ ] `DIRECT_URL` - Neon direct connection string
- [ ] `NEXTAUTH_SECRET` - Auth secret (min 32 characters)
- [ ] `NEXTAUTH_URL` - Your production domain
- [ ] `NEXT_PUBLIC_SITE_URL` - Your production domain

### Optional
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth
- [ ] `YOUTUBE_API_KEY` - YouTube integration
- [ ] `SUPABASE_*` - Realtime features

## 🧪 Testing Checklist

After deployment, verify:

- [ ] Homepage loads: `https://your-domain.vercel.app`
- [ ] Health check passes: `https://your-domain.vercel.app/api/health`
- [ ] Courses API works: `https://your-domain.vercel.app/api/courses`
- [ ] Login works (if configured)
- [ ] Database connectivity confirmed

## 🆘 Common Issues

### "DATABASE_URL is not set"
**Fix**: Ensure environment variables are set in Vercel dashboard, then redeploy.

### "Connection timeout"
**Fix**: 
1. Use Neon **pooled** connection (ends with `-pooler`)
2. Check database is not paused (Neon free tier auto-pauses)
3. Verify `runtime = 'nodejs'` in API routes (not 'edge')

### Build fails
**Fix**:
1. Ensure both `DATABASE_URL` and `DIRECT_URL` are set
2. Check build logs in Vercel dashboard
3. Run `npm run build` locally to test

### "Too many connections"
**Fix**:
1. Use Neon pooled connection string
2. Verify connection pool settings in `lib/neon-config.ts`

## 🎊 You're Ready!

Everything is configured and ready for production deployment. Follow the steps above or see the complete guide in **NEON_VERCEL_DEPLOYMENT.md**.

**Happy deploying! 🚀**
