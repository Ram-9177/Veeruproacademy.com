# Quick Environment Variables Setup for Vercel

This is a quick reference for setting up environment variables in Vercel for https://www.veeruproacademy.com

## How to Set Environment Variables in Vercel

1. Go to https://vercel.com
2. Select your project: `Veeru-s_Pro_Academy`
3. Click **Settings** → **Environment Variables**
4. Add each variable below
5. Make sure to select **Production** environment
6. Click **Save**
7. **Redeploy** your project after adding all variables

---

## Required Environment Variables

### Database (Neon PostgreSQL)

Get these from your Neon Console: https://console.neon.tech

**DATABASE_URL** (Required)
```
postgresql://username:password@ep-xyz-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```
- ⚠️ MUST use the **pooled** connection (with `-pooler` in hostname)
- Used for all runtime database queries
- Better performance in serverless environment

**DIRECT_URL** (Required for migrations)
```
postgresql://username:password@ep-xyz.us-east-2.aws.neon.tech/dbname?sslmode=require
```
- ⚠️ MUST use the **direct** connection (NO `-pooler` in hostname)
- Used for database migrations during build
- Required for Prisma migrate deploy to work

---

### Authentication (NextAuth.js)

**NEXTAUTH_SECRET** (Required)
```bash
# Generate with this command:
openssl rand -base64 32

# Example output:
K7Xh9mZ2pQwR8tN5vL3yU6bC1aD4fG7jM0sE9xI2oP5k=
```
- Must be at least 32 characters
- Keep this secret - never commit to git
- Used to encrypt session tokens

**NEXTAUTH_URL** (Required)
```
https://www.veeruproacademy.com
```
- Your production domain
- Must start with `https://`
- No trailing slash

**AUTH_URL** (Required)
```
https://www.veeruproacademy.com
```
- Same as NEXTAUTH_URL
- Compatibility for Auth.js v5

---

### Site Configuration

**NEXT_PUBLIC_SITE_URL** (Required)
```
https://www.veeruproacademy.com
```
- Your public-facing domain
- Must start with `https://`
- No trailing slash
- Used in client-side code

**NODE_ENV** (Recommended)
```
production
```
- Usually set automatically by Vercel
- Can explicitly set to ensure production mode

---

## Optional Environment Variables

Only set these if you're using these features:

### Google OAuth (for "Sign in with Google")

**GOOGLE_CLIENT_ID**
```
1234567890-abc123xyz.apps.googleusercontent.com
```
- Get from Google Cloud Console
- OAuth 2.0 Client ID

**GOOGLE_CLIENT_SECRET**
```
GOCSPX-1234567890abcdefghijk
```
- Get from Google Cloud Console
- Keep secret

**Setup:**
1. Go to https://console.cloud.google.com
2. Create OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URI:
   ```
   https://www.veeruproacademy.com/api/auth/callback/google
   ```

---

### Supabase (for realtime features)

**NEXT_PUBLIC_SUPABASE_URL**
```
https://abcdefghijklmnop.supabase.co
```

**NEXT_PUBLIC_SUPABASE_ANON_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**SUPABASE_SERVICE_ROLE_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- Only if you need server-side Supabase access

---

### YouTube API (for video metadata)

**YOUTUBE_API_KEY**
```
AIzaSyAbc123Def456Ghi789Jkl012Mno345Pqr678
```
- Get from Google Cloud Console
- YouTube Data API v3

---

### Payment Integration

**NEXT_PUBLIC_MERCHANT_UPI**
```
merchant@ybl
```
- Your UPI ID for payments

**NEXT_PUBLIC_MERCHANT_NAME**
```
Veeru's Pro Academy
```
- Business name for payment receipts

---

## Environment Variable Checklist

Before deploying, make sure these are set:

**Critical (Must Have):**
- [ ] DATABASE_URL (with -pooler)
- [ ] DIRECT_URL (without -pooler)
- [ ] NEXTAUTH_SECRET (32+ characters)
- [ ] NEXTAUTH_URL (https://www.veeruproacademy.com)
- [ ] AUTH_URL (https://www.veeruproacademy.com)
- [ ] NEXT_PUBLIC_SITE_URL (https://www.veeruproacademy.com)

**Optional (If Using Feature):**
- [ ] GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (OAuth)
- [ ] SUPABASE_* variables (Realtime)
- [ ] YOUTUBE_API_KEY (Video features)
- [ ] Payment variables (UPI payments)

---

## Common Mistakes to Avoid

❌ **Wrong:** Using the same string for DATABASE_URL and DIRECT_URL
✅ **Right:** DATABASE_URL has `-pooler`, DIRECT_URL doesn't

❌ **Wrong:** `NEXTAUTH_URL=www.veeruproacademy.com`
✅ **Right:** `NEXTAUTH_URL=https://www.veeruproacademy.com`

❌ **Wrong:** Trailing slash: `https://www.veeruproacademy.com/`
✅ **Right:** No trailing slash: `https://www.veeruproacademy.com`

❌ **Wrong:** Using localhost in production
✅ **Right:** Using actual production domain

❌ **Wrong:** NEXTAUTH_SECRET less than 32 characters
✅ **Right:** Generated with `openssl rand -base64 32`

---

## After Setting Variables

1. ✅ **Save** all variables in Vercel
2. ✅ **Verify** all required variables are set
3. ✅ **Redeploy** your project (variables only apply to new deployments)
4. ✅ **Monitor** build logs for any errors
5. ✅ **Test** your production site

---

## Vercel CLI Alternative

You can also set environment variables using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Set environment variables
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add AUTH_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
```

---

## Verification

After deployment, verify variables are working:

```bash
# This should return your site without errors
curl https://www.veeruproacademy.com

# This should work if database is connected
curl https://www.veeruproacademy.com/api/courses
```

---

## Need Help?

- See full deployment guide: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
- See troubleshooting: [PRODUCTION_TROUBLESHOOTING.md](./PRODUCTION_TROUBLESHOOTING.md)
- Check Vercel logs for specific errors

---

**Last Updated:** January 11, 2026
