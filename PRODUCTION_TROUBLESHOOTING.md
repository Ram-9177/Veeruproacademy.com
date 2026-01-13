# Production Troubleshooting Guide

This guide helps resolve common issues when deploying to production at https://www.veeruproacademy.com

## Common Issues and Solutions

### 1. Build Fails: "DATABASE_URL is required"

**Symptom:**
```
[vercel-build] ❌ ERROR: Neither DATABASE_URL nor DIRECT_URL is set!
```

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables for **Production**:
   ```
   DATABASE_URL=your-neon-pooled-connection-string
   DIRECT_URL=your-neon-direct-connection-string
   ```
3. Redeploy the project

**How to get connection strings from Neon:**
1. Go to https://console.neon.tech
2. Select your project
3. Click "Connection Details"
4. Copy both:
   - **Pooled connection** (ends with `-pooler`) → use for `DATABASE_URL`
   - **Direct connection** (no `-pooler`) → use for `DIRECT_URL`

---

### 2. Build Fails: "Prisma migrate failed"

**Symptom:**
```
Error: P1001: Can't reach database server
```

**Solution A - Database is paused:**
1. Go to Neon Console
2. Check if your database is in "Idle" or "Suspended" state
3. Wake it up by clicking "Resume" or making any query
4. Redeploy on Vercel

**Solution B - Wrong connection string:**
1. Verify `DIRECT_URL` is the **direct** connection (not pooled)
2. Make sure it includes `?sslmode=require`
3. Format should be: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`

**Solution C - Network/firewall issue:**
1. Check Neon dashboard for any connection restrictions
2. Neon should allow connections from anywhere by default
3. Verify your database credentials are correct

---

### 3. Site Loads but Database Errors

**Symptom:**
- Site loads but shows errors when accessing data
- "Connection pool exhausted" errors
- Timeout errors

**Solution:**
1. Make sure `DATABASE_URL` uses the **pooled** connection:
   ```
   postgresql://user:pass@host-pooler.neon.tech/db?sslmode=require
   ```
   Notice the `-pooler` suffix in the hostname

2. Check connection limits in Neon:
   - Go to Neon Console → Settings → Compute
   - Verify your plan's connection limit
   - Consider upgrading if you hit limits

3. Restart the Vercel deployment:
   - Go to Vercel Dashboard → Deployments
   - Click "Redeploy" on latest deployment

---

### 4. Authentication Not Working

**Symptom:**
- Can't login
- "Invalid callback URL" error
- Session issues

**Solution A - Wrong domain in environment variables:**
1. Check Vercel environment variables:
   ```
   NEXTAUTH_URL=https://www.veeruproacademy.com  ← Must match your actual domain
   AUTH_URL=https://www.veeruproacademy.com
   NEXT_PUBLIC_SITE_URL=https://www.veeruproacademy.com
   ```

2. **Important:** Use `https://` (not `http://`)

3. After changing, redeploy

**Solution B - Invalid NextAuth secret:**
1. Generate a new secret:
   ```bash
   openssl rand -base64 32
   ```
2. Set it in Vercel:
   ```
   NEXTAUTH_SECRET=your-generated-secret-here
   ```
3. Secret must be at least 32 characters

**Solution C - Google OAuth issues:**
1. Go to Google Cloud Console
2. OAuth 2.0 Client IDs → Your client
3. Add authorized redirect URI:
   ```
   https://www.veeruproacademy.com/api/auth/callback/google
   ```
4. Update Vercel environment variables:
   ```
   GOOGLE_CLIENT_ID=your-id
   GOOGLE_CLIENT_SECRET=your-secret
   ```

---

### 5. Environment Variables Not Taking Effect

**Symptom:**
- Updated environment variables but nothing changed
- Still seeing old values or errors

**Solution:**
1. After changing environment variables in Vercel, you MUST redeploy
2. Go to Vercel Dashboard → Deployments
3. Click "..." menu on latest deployment
4. Click "Redeploy"

**Note:** Vercel only applies new environment variables on new deployments, not automatically.

---

### 6. "NEXTAUTH_URL must be a valid URL" Error

**Symptom:**
```
Invalid environment configuration: NEXTAUTH_URL must be a valid URL
```

**Solution:**
1. Check your `NEXTAUTH_URL` includes the protocol:
   - ✅ Correct: `https://www.veeruproacademy.com`
   - ❌ Wrong: `www.veeruproacademy.com`
   - ❌ Wrong: `veeruproacademy.com`

2. No trailing slash:
   - ✅ Correct: `https://www.veeruproacademy.com`
   - ❌ Wrong: `https://www.veeruproacademy.com/`

---

### 7. Database Migration Failed During Build

**Symptom:**
```
Migration `xxxxx` failed to apply cleanly to the shadow database
```

**Solution A - Reset and apply migrations:**
1. From your local machine (with local .env.local):
   ```bash
   # Set your environment variables
   export DATABASE_URL="your-neon-pooled-url"
   export DIRECT_URL="your-neon-direct-url"
   
   # Reset the database (WARNING: This deletes all data!)
   npx prisma migrate reset --force
   
   # Or just deploy migrations
   npx prisma migrate deploy
   ```

2. Then redeploy on Vercel

**Solution B - Skip migration during build (not recommended for production):**
1. Temporarily modify `scripts/vercel-build.mjs` to skip migrations
2. Deploy
3. Run migrations manually
4. Restore the script

---

### 8. Build Succeeds But Site Shows 500 Error

**Symptom:**
- Build completes successfully
- Site shows "500 Internal Server Error"
- Function logs show database errors

**Solution:**
1. Check Vercel Function logs:
   - Go to Vercel Dashboard → Your Project
   - Click "Deployments" → Latest deployment
   - Click "Functions" tab
   - Look for error details

2. Common causes:
   - Missing environment variable at runtime
   - Database connection issue
   - Invalid NextAuth configuration

3. Verify all required env vars are set:
   ```bash
   DATABASE_URL ✓
   DIRECT_URL ✓
   NEXTAUTH_SECRET ✓
   NEXTAUTH_URL ✓
   NEXT_PUBLIC_SITE_URL ✓
   ```

---

### 9. CSS/Styles Not Loading

**Symptom:**
- Site loads but looks broken
- No styling applied

**Solution:**
1. Clear Vercel cache:
   - Redeploy with cache cleared
   - In deployment settings, enable "Clear cache"

2. Check build output:
   - Verify `.next` folder was generated
   - Check for CSS compilation errors in build logs

3. Check Content Security Policy:
   - Make sure CSP headers allow your styles
   - Check `next.config.js` headers configuration

---

### 10. Can't Access Admin Panel

**Symptom:**
- `/admin/*` routes return 404 or redirect to login
- Can't login with admin credentials

**Solution:**
1. Verify admin user exists in database:
   - Login to Neon Console
   - Run SQL query:
     ```sql
     SELECT email, status FROM "User" WHERE email = 'admin@veerupro.com';
     ```

2. If admin doesn't exist, create one:
   ```bash
   # Set ADMIN_SETUP_TOKEN in Vercel env vars first
   curl -X POST https://www.veeruproacademy.com/api/admin/create \
     -H "Content-Type: application/json" \
     -H "x-admin-setup-token: your-token" \
     -d '{
       "email": "admin@veerupro.com",
       "password": "YourSecurePassword123!",
       "name": "Admin User"
     }'
   ```

3. Verify role assignment:
   ```sql
   SELECT u.email, r.key 
   FROM "User" u
   JOIN "UserRole" ur ON u.id = ur."userId"
   JOIN "Role" r ON ur."roleId" = r.id
   WHERE u.email = 'admin@veerupro.com';
   ```

---

## Quick Diagnostics Checklist

Run through this checklist when troubleshooting:

- [ ] All environment variables are set in Vercel
- [ ] Environment variables are in **Production** scope (not just Preview)
- [ ] `DATABASE_URL` uses pooled connection (`-pooler` in hostname)
- [ ] `DIRECT_URL` uses direct connection (no `-pooler`)
- [ ] `NEXTAUTH_URL` includes `https://` and matches actual domain
- [ ] `NEXTAUTH_SECRET` is at least 32 characters
- [ ] Neon database is active (not paused/idle)
- [ ] Latest code is pushed to GitHub
- [ ] Redeployed after changing environment variables
- [ ] Build logs show no errors
- [ ] Function logs show no errors

---

## Getting More Help

### Check Logs

**Vercel Build Logs:**
1. Go to Vercel Dashboard → Deployments
2. Click on the deployment
3. View full build output

**Vercel Function Logs:**
1. Go to Vercel Dashboard → Deployments
2. Click on the deployment
3. Click "Functions" tab
4. Click on any function to see its logs

**Neon Query Logs:**
1. Go to Neon Console
2. Click "Monitoring" tab
3. View query history and performance

### Test Locally First

Before deploying, test locally:

```bash
# Set production-like environment
export NODE_ENV=production
export DATABASE_URL="your-neon-pooled-url"
export DIRECT_URL="your-neon-direct-url"
export NEXTAUTH_SECRET="$(openssl rand -base64 32)"
export NEXTAUTH_URL="http://localhost:3000"

# Build and run
npm run build
npm start
```

If it works locally but not on Vercel, the issue is likely:
- Environment variables not set correctly in Vercel
- Domain/URL configuration mismatch

---

## Contact Support

If you're still stuck after trying these solutions:

1. Check the Vercel Status Page: https://www.vercel-status.com
2. Check Neon Status: https://neon.tech/status
3. Review the deployment guide: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
4. Check GitHub Issues for similar problems

---

**Last Updated:** January 11, 2026
