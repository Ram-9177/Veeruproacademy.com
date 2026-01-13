# Security & Realtime Deployment Guide

Complete guide for deploying security features and realtime functionality on Vercel with Neon PostgreSQL.

---

## 🔒 Part 1: Security Configuration

### Security Features Already Implemented ✅

Your application has comprehensive security measures in place:

1. **Rate Limiting** - Prevents abuse of API endpoints
2. **Password Hashing** - Uses bcrypt with 12 rounds
3. **Input Sanitization** - Prevents XSS and injection attacks
4. **CORS Protection** - Restricts cross-origin requests
5. **Authentication** - NextAuth with secure session handling
6. **Security Headers** - CSP, HSTS, X-Frame-Options configured

### Security Environment Variables

Add these to Vercel for production security:

```bash
# Authentication (REQUIRED)
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Database (REQUIRED)
DATABASE_URL="<neon-pooled-connection-string>"
DIRECT_URL="<neon-direct-connection-string>"

# OAuth (if using Google login)
GOOGLE_CLIENT_ID="<your-google-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-client-secret>"
```

### Generating Secure Secrets

```bash
# Generate NEXTAUTH_SECRET (32+ characters required)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🔴 Part 2: Realtime Deployment

Your application supports **two realtime implementations**:

### Option A: SSE (Server-Sent Events) - Simple, Built-in

**Best for**: Small-medium apps, single Vercel instance

**Already configured** ✅ No additional services needed!

#### How it works:
- Uses `/api/realtime/updates` endpoint
- Built-in event broadcasting
- In-memory connection management
- Perfect for single-instance deployments

#### Deploy Steps:

1. **Already deployed** - No extra configuration needed
2. Realtime works automatically with your Vercel deployment
3. Client components use `RealtimeUpdates` component

**Limitations**:
- ⚠️ Only works with single Vercel instance
- ⚠️ Connections lost on serverless cold starts
- ⚠️ Not suitable for horizontal scaling

---

### Option B: Supabase Realtime - Production-Grade

**Best for**: Production apps, multiple instances, high reliability

**Requires**: Supabase project (free tier available)

#### Step-by-Step Supabase Realtime Setup

### 1️⃣ Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Choose a name (e.g., "veeru-pro-academy")
4. Set a strong database password
5. Select region (choose closest to your Vercel region)
6. Click "Create Project"

### 2️⃣ Get Supabase Connection Details

Once created, go to **Settings** → **API**:

```bash
# Project URL (public)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"

# Anon/Public Key (public, safe for client)
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Service Role Key (secret, server-only)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3️⃣ Configure Supabase Realtime

In Supabase Dashboard → **Database** → **Replication**:

1. Enable replication for tables you want to monitor:
   - `lessons`
   - `courses`  
   - `projects`
2. Select "Insert", "Update", "Delete" events
3. Save changes

### 4️⃣ Set Vercel Environment Variables

In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**:

**Production Environment:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_MONITORED_TABLES=lessons,courses,projects
NEXT_PUBLIC_ENABLE_REALTIME=true
```

**Preview Environment:** (Same values)
```bash
# Use same Supabase project or create separate preview project
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# ... (rest same as production)
```

### 5️⃣ Deploy to Vercel

```bash
# Redeploy after setting environment variables
git push

# Or trigger manual redeploy in Vercel dashboard
```

### 6️⃣ Test Realtime Functionality

1. Open your deployed app: `https://your-domain.vercel.app`
2. Navigate to admin dashboard: `/admin/realtime`
3. Make changes (create/update content)
4. Watch realtime updates appear automatically

---

## 🎯 Realtime Architecture Comparison

| Feature | SSE (Built-in) | Supabase Realtime |
|---------|----------------|-------------------|
| **Setup** | ✅ Zero config | ⚠️ Requires Supabase account |
| **Cost** | ✅ Free | ✅ Free tier available |
| **Scalability** | ⚠️ Single instance | ✅ Multi-instance |
| **Reliability** | ⚠️ Medium | ✅ High |
| **Cold Starts** | ⚠️ Connections lost | ✅ Persistent |
| **Database** | Any | PostgreSQL only |
| **Best For** | MVP, demos | Production |

---

## 🔐 Security Checklist for Production

### Before Deploying

- [ ] **NEXTAUTH_SECRET** set to strong random value (32+ chars)
- [ ] **DATABASE_URL** uses Neon pooled connection (-pooler)
- [ ] **DIRECT_URL** uses Neon direct connection (for migrations)
- [ ] **GOOGLE_CLIENT_ID/SECRET** configured (if using OAuth)
- [ ] **SUPABASE_SERVICE_ROLE_KEY** never exposed to client
- [ ] All secrets stored in Vercel environment variables (not in code)
- [ ] `.env.local` in `.gitignore` (never commit secrets)

### Security Headers

Already configured in `next.config.mjs` ✅:
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy

### Rate Limiting

Already implemented in `lib/security.ts` ✅:
- Authentication: 5 attempts per 15 minutes
- Signup: 3 attempts per hour
- API: 100 requests per minute
- Admin: 30 requests per minute

⚠️ **Production Note**: Current rate limiting uses in-memory storage. For multi-instance deployments, consider:
- **Redis** for distributed rate limiting
- **Vercel Edge Config** for edge rate limiting
- **Upstash** for serverless Redis

---

## 🚀 Complete Deployment Steps

### 1. Security Setup (5 minutes)

```bash
# Generate secrets locally
openssl rand -base64 32  # NEXTAUTH_SECRET

# Add to Vercel
# Settings → Environment Variables → Add:
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
# - GOOGLE_CLIENT_ID (if OAuth)
# - GOOGLE_CLIENT_SECRET (if OAuth)
```

### 2. Database Setup (Already Done ✅)

See `NEON_VERCEL_DEPLOYMENT.md` for Neon setup.

### 3. Realtime Setup (Choose One)

**Option A: SSE (Simple)**
- No setup needed ✅
- Already works on Vercel

**Option B: Supabase (Production)**
```bash
# 1. Create Supabase project
# 2. Enable replication for tables
# 3. Add environment variables to Vercel:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_ENABLE_REALTIME=true

# 4. Redeploy
git push
```

### 4. Verify Deployment

```bash
# Test health endpoint
curl https://your-domain.vercel.app/api/health

# Test authentication
# Visit: https://your-domain.vercel.app/login

# Test realtime (if Supabase enabled)
# Visit: https://your-domain.vercel.app/admin/realtime
```

---

## 🔧 Troubleshooting

### Security Issues

**"NEXTAUTH_SECRET is not set"**
- Add `NEXTAUTH_SECRET` in Vercel environment variables
- Redeploy after adding

**"Database connection failed"**
- Verify `DATABASE_URL` is Neon pooled connection (-pooler)
- Check database is not paused (Neon free tier)

**"OAuth error"**
- Verify redirect URI in Google Console: `https://your-domain.vercel.app/api/auth/callback/google`
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set

### Realtime Issues

**SSE: "Connection keeps closing"**
- Expected with serverless cold starts
- Consider upgrading to Supabase Realtime

**Supabase: "Connection failed"**
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check Supabase project is not paused
- Verify replication is enabled for tables

**"Realtime updates not appearing"**
- Check `NEXT_PUBLIC_ENABLE_REALTIME=true` is set
- Verify table replication is enabled in Supabase
- Check browser console for WebSocket errors

---

## 📊 Monitoring & Debugging

### Health Check

```bash
# Check overall health
curl https://your-domain.vercel.app/api/health

# Response:
{
  "status": "healthy",
  "checks": {
    "database": { "connected": true, "latency": 45 },
    "application": { "version": "0.1.0" }
  }
}
```

### Realtime Monitoring

Admin dashboard provides realtime monitoring:
- Visit: `https://your-domain.vercel.app/admin/realtime`
- View active connections
- Monitor events
- Test broadcasts

### Logs

Check Vercel deployment logs:
1. Go to Vercel Dashboard
2. Select your project
3. Click "Logs" tab
4. Filter by deployment

---

## 🎯 Production Recommendations

### For Security:
1. ✅ Use strong NEXTAUTH_SECRET (32+ characters)
2. ✅ Enable HTTPS only (Vercel handles this)
3. ✅ Use environment variables for all secrets
4. ✅ Implement rate limiting (already done)
5. ⚠️ Consider Redis for distributed rate limiting
6. ⚠️ Set up monitoring (Sentry, LogRocket, etc.)

### For Realtime:
1. ✅ Use Supabase Realtime for production
2. ✅ Enable replication only for necessary tables
3. ✅ Monitor connection count
4. ⚠️ Consider WebSocket limits (Supabase free tier: 200 concurrent)
5. ⚠️ Implement reconnection logic (already done in components)

### For Performance:
1. ✅ Use Neon pooled connections (-pooler)
2. ✅ Enable connection pooling (Prisma handles this)
3. ✅ Use serverless-optimized configuration (already done)
4. ⚠️ Monitor database query performance
5. ⚠️ Consider caching for frequently accessed data

---

## 🎊 Quick Start Commands

```bash
# 1. Generate secrets
openssl rand -base64 32

# 2. Run setup script (creates .env.local)
bash scripts/setup-neon-env.sh

# 3. Deploy to Vercel
git push

# 4. Test deployment
curl https://your-domain.vercel.app/api/health

# 5. Monitor realtime
# Visit: https://your-domain.vercel.app/admin/realtime
```

---

## 📚 Additional Resources

- **Security**: See `lib/security.ts` for implementation details
- **Realtime**: See `lib/realtime.ts` and `lib/supabase.ts`
- **Deployment**: See `NEON_VERCEL_DEPLOYMENT.md`
- **Quick Start**: See `DEPLOY_QUICK_START.md`

---

## ✅ Deployment Checklist

### Security
- [ ] NEXTAUTH_SECRET generated and set in Vercel
- [ ] NEXTAUTH_URL set to production domain
- [ ] OAuth credentials configured (if using)
- [ ] All secrets in environment variables
- [ ] No secrets in code or .env files committed

### Database
- [ ] Neon project created
- [ ] DATABASE_URL (pooled) set in Vercel
- [ ] DIRECT_URL set in Vercel
- [ ] Migrations deployed

### Realtime (if using Supabase)
- [ ] Supabase project created
- [ ] Table replication enabled
- [ ] Supabase environment variables set in Vercel
- [ ] NEXT_PUBLIC_ENABLE_REALTIME=true

### Testing
- [ ] `/api/health` returns healthy
- [ ] Authentication works
- [ ] Realtime updates appear
- [ ] All core features functional

---

**You're ready for secure production deployment with realtime features! 🚀**
