# Vercel + Neon Deployment Guide for Veeru's Pro Academy

This guide provides step-by-step instructions for deploying Veeru's Pro Academy to Vercel with a Neon PostgreSQL database.

## Prerequisites

- GitHub repository: `KingVeerendra07/Veeru-s_Pro_Academy`
- Neon account (https://neon.tech)
- Vercel account (https://vercel.com)

## Step 1: Set Up Neon Database

1. **Create a new Neon project:**
   - Go to https://console.neon.tech
   - Click "Create Project"
   - Choose a project name (e.g., "veeru-pro-academy")
   - Select your region (choose closest to your users)

2. **Get your connection strings:**
   
   After creating the project, you'll see two connection strings:
   
   - **Pooled Connection** (for runtime queries):
     ```
     postgresql://user:password@host.neon.tech/dbname?sslmode=require
     ```
     Or with pooler:
     ```
     postgresql://user:password@host-pooler.neon.tech/dbname?sslmode=require
     ```
   
   - **Direct Connection** (for migrations):
     ```
     postgresql://user:password@host.neon.tech/dbname?sslmode=require
     ```

   **Important:** Copy both connection strings. You'll need them for Vercel environment variables.

## Step 2: Set Up Vercel Project

1. **Import your GitHub repository:**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import `KingVeerendra07/Veeru-s_Pro_Academy`
   - Framework Preset: Next.js (auto-detected)

2. **Configure Build Settings:**
   - Root Directory: `./` (default)
   - Build Command: Leave default or use `npm run vercel-build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

3. **DO NOT deploy yet!** First, we need to set environment variables.

## Step 3: Configure Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables

### Required Variables (Production)

Set these for **Production** environment:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@host-pooler.neon.tech/dbname?sslmode=require
DIRECT_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Authentication (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-32-character-secret-here
NEXTAUTH_URL=https://www.veeruproacademy.com
AUTH_URL=https://www.veeruproacademy.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://www.veeruproacademy.com
SITE_URL=https://www.veeruproacademy.com
NODE_ENV=production
```

### Optional Variables (if using these features)

```bash
# Google OAuth (Optional - for social login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase (Optional - for realtime features)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key

# YouTube API (Optional - for video features)
YOUTUBE_API_KEY=your-youtube-api-key

# Payment (Optional - for UPI payments)
NEXT_PUBLIC_MERCHANT_UPI=merchant@yourbank
NEXT_PUBLIC_MERCHANT_NAME=Veeru's Pro Academy
```

### Important Notes:

1. **DATABASE_URL**: Use the **pooled** connection (with `-pooler` suffix) for better performance
2. **DIRECT_URL**: Use the **direct** connection (without `-pooler`) for migrations
3. **NEXTAUTH_SECRET**: Generate a secure secret with `openssl rand -base64 32`
4. **Domain URLs**: Use your actual production domain (https://www.veeruproacademy.com)

## Step 4: Run Database Migrations

You have two options:

### Option A: Automatic (Recommended)

Migrations will run automatically during Vercel deployment because of the `vercel-build` script.

Just trigger a deployment:
1. Go to Vercel Dashboard → Your Project
2. Click "Deployments" tab
3. Click "Redeploy" on the latest deployment

### Option B: Manual (From Local Machine)

```bash
# Install dependencies
npm install

# Set environment variables locally
export DATABASE_URL="your-neon-pooled-url"
export DIRECT_URL="your-neon-direct-url"

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data (optional)
npm run db:seed
```

## Step 5: Deploy to Vercel

1. **Trigger deployment:**
   - Push any commit to your GitHub repository, OR
   - In Vercel dashboard, click "Redeploy"

2. **Monitor the build:**
   - Watch the build logs in Vercel
   - Look for these success messages:
     ```
     [vercel-build] Environment check:
       - DATABASE_URL: ✓ Set
       - DIRECT_URL: ✓ Set
     [vercel-build] ✓ Prisma client generated
     [vercel-build] ✓ Database migrations deployed
     ```

3. **Build should complete successfully**

## Step 6: Verify Deployment

1. **Check your site:**
   - Visit https://www.veeruproacademy.com
   - You should see the homepage

2. **Test authentication:**
   - Try to register a new account
   - Try to login

3. **Check admin access:**
   - Visit https://www.veeruproacademy.com/admin/login
   - Default credentials:
     ```
     Email: admin@veerupro.com
     Password: VeeruPro2024!
     ```
   - **IMPORTANT:** Change this password immediately!

## Step 7: Create Admin User (If Needed)

If the admin user wasn't created automatically, use the admin setup endpoint:

```bash
# Generate a setup token (any random string)
SETUP_TOKEN=$(openssl rand -hex 32)

# Add this to Vercel environment variables temporarily:
ADMIN_SETUP_TOKEN=your-random-token-here

# Then call the setup endpoint:
curl -X POST https://www.veeruproacademy.com/api/admin/create \
  -H "Content-Type: application/json" \
  -H "x-admin-setup-token: your-random-token-here" \
  -d '{
    "email": "admin@veerupro.com",
    "password": "YourSecurePassword123!",
    "name": "Admin User"
  }'

# Remove the ADMIN_SETUP_TOKEN after use for security
```

## Troubleshooting

### Build fails with "DATABASE_URL is required"

**Solution:** Make sure you've set both `DATABASE_URL` and `DIRECT_URL` in Vercel environment variables.

### Build fails with "Prisma migrate failed"

**Solution:** 
1. Check that `DIRECT_URL` is set correctly (direct connection, not pooled)
2. Verify your Neon database is active (not paused)
3. Check that your database credentials are correct

### Site loads but shows "Database connection failed"

**Solution:**
1. Verify `DATABASE_URL` is using the pooled connection string
2. Check that your Neon project is not paused
3. Verify the database allows connections from Vercel IPs

### Authentication doesn't work

**Solution:**
1. Check that `NEXTAUTH_URL` matches your actual domain
2. Verify `NEXTAUTH_SECRET` is set and at least 32 characters
3. Make sure you're using HTTPS (not HTTP) in production

### "Invalid OAuth callback" error

**Solution:**
1. In Google Cloud Console, add your callback URL:
   - Authorized redirect URIs: `https://www.veeruproacademy.com/api/auth/callback/google`
2. Make sure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly

## Performance Optimization

1. **Database Pooling:**
   - Always use the pooled connection for `DATABASE_URL`
   - This prevents connection exhaustion in serverless environments

2. **Connection Management:**
   - Prisma automatically manages connections
   - No need for manual connection pooling

3. **Caching:**
   - Enable Vercel Edge Caching for static content
   - Consider using Redis for session storage (optional)

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Use HTTPS for all URLs
- [ ] Enable Vercel's security headers
- [ ] Rotate database credentials regularly
- [ ] Keep dependencies updated
- [ ] Monitor error logs regularly
- [ ] Set up database backups in Neon

## Monitoring

1. **Vercel Analytics:**
   - Enabled automatically
   - View in Vercel Dashboard → Analytics

2. **Error Tracking:**
   - Check Vercel Functions logs
   - Monitor database query performance in Neon dashboard

3. **Database Health:**
   - Monitor connection usage in Neon dashboard
   - Set up alerts for high connection usage

## Updating the Application

1. **Code changes:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
   - Vercel will automatically deploy

2. **Database changes:**
   ```bash
   # Create migration locally
   npx prisma migrate dev --name your_migration_name
   
   # Push to GitHub
   git add prisma/migrations
   git commit -m "Add database migration"
   git push
   ```
   - Vercel will automatically run migrations during deployment

## Support

If you encounter issues:

1. Check Vercel build logs
2. Check Neon database dashboard
3. Review this guide's troubleshooting section
4. Check the application's error logs

## Additional Resources

- [Neon Documentation](https://neon.tech/docs/introduction)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)

---

**Deployment Status:** ✅ Ready for Production

**Last Updated:** January 11, 2026

**Live URL:** https://www.veeruproacademy.com
