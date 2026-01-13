# 🚀 Deploy to Vercel + Neon - Quick Start

**Platform:** Veeru's Pro Academy  
**Production URL:** https://www.veeruproacademy.com  
**Status:** Ready for Deployment

---

## ⚡ Quick Deploy (5 Minutes)

### 1. Neon Database Setup

**Create Project:** https://console.neon.tech
```
Project Name: veeru-pro-academy
Region: Choose closest to users
```

**Copy Connection Strings:**
- Pooled: `postgresql://user:pass@host-pooler.neon.tech/db?sslmode=require`
- Direct: `postgresql://user:pass@host.neon.tech/db?sslmode=require`

---

### 2. Vercel Project Setup

**Import Repository:** https://vercel.com/new
```
Repository: KingVeerendra07/Veeru-s_Pro_Academy
Framework: Next.js (auto-detected)
```

**⚠️ STOP - Add Environment Variables First!**

---

### 3. Environment Variables (Vercel Settings)

**Required Variables:**
```bash
# Database
DATABASE_URL="postgresql://user:pass@host-pooler.neon.tech/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require"

# Auth (generate: openssl rand -base64 32)
NEXTAUTH_SECRET="your-32-char-secret-here"
NEXTAUTH_URL="https://www.veeruproacademy.com"
AUTH_URL="https://www.veeruproacademy.com"

# Site
NEXT_PUBLIC_SITE_URL="https://www.veeruproacademy.com"
SITE_URL="https://www.veeruproacademy.com"
NODE_ENV="production"
```

**Optional Variables:**
```bash
# Real-time Features
NEXT_PUBLIC_ENABLE_REALTIME="true"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

---

### 4. Deploy

Click **"Deploy"** in Vercel

Wait 2-3 minutes for build to complete.

---

### 5. Database Migration

**After first deployment:**

1. Go to Vercel Dashboard → Your Project → Settings → General
2. Copy the deployment URL (e.g., `veeru-pro-academy.vercel.app`)
3. Run migration from your local terminal:

```bash
# Set environment variables locally
export DATABASE_URL="your-pooled-connection-string"
export DIRECT_URL="your-direct-connection-string"

# Run migration
npx prisma migrate deploy

# Seed initial data (creates admin user)
npx prisma db seed
```

**Default Admin Credentials:**
```
Email: admin@veerupro.com
Password: VeeruPro2024!
```

⚠️ **Change password immediately after first login!**

---

### 6. Custom Domain (Optional)

**Vercel Dashboard → Settings → Domains**
```
Add domain: www.veeruproacademy.com
Follow DNS configuration instructions
```

**DNS Records:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

### 7. Verify Deployment

Visit your site and test:
- [ ] Homepage loads
- [ ] Login works (`/login`)
- [ ] Admin login works (`/admin/login`)
- [ ] Admin can access `/admin/hub`
- [ ] Students can access `/dashboard`
- [ ] Courses page loads (`/courses`)

---

## ✅ Production Checklist

**Before Going Live:**
- [ ] Environment variables set in Vercel
- [ ] Database migrated and seeded
- [ ] Admin account created and tested
- [ ] Change default admin password
- [ ] Custom domain configured (if using)
- [ ] Test user registration flow
- [ ] Test course enrollment
- [ ] Verify all pages load correctly

**Post-Deployment:**
- [ ] Enable real-time features (set `NEXT_PUBLIC_ENABLE_REALTIME=true`)
- [ ] Configure Google OAuth (optional)
- [ ] Set up custom email templates
- [ ] Configure payment methods
- [ ] Add initial course content

---

## 🔧 Troubleshooting

### Build Fails
```bash
# Check Vercel build logs
# Common issues:
- Missing DATABASE_URL → Add in environment variables
- Missing NEXTAUTH_SECRET → Generate and add
```

### Database Connection Fails
```bash
# Verify connection strings
- Check Neon project is active
- Ensure ?sslmode=require is in connection string
- Use pooled connection for DATABASE_URL
- Use direct connection for DIRECT_URL
```

### Authentication Not Working
```bash
# Check environment variables:
- NEXTAUTH_SECRET is set
- NEXTAUTH_URL matches your domain
- AUTH_URL matches your domain
```

### Admin Login Issues
```bash
# Ensure admin user exists:
npx prisma db seed

# Or create manually in Neon console:
# Run in Neon SQL Editor:
# (See VERCEL_DEPLOYMENT_GUIDE.md for SQL commands)
```

---

## 📊 Post-Deployment Monitoring

**Vercel Dashboard:**
- Monitor function logs
- Check build times
- View bandwidth usage

**Neon Dashboard:**
- Monitor database connections
- Check query performance
- View storage usage

---

## 🆘 Need Help?

**Documentation:**
- Full Guide: `VERCEL_DEPLOYMENT_GUIDE.md`
- Troubleshooting: `PRODUCTION_TROUBLESHOOTING.md`
- Features: `COMPREHENSIVE_FEATURES_GUIDE.md`

**Support:**
- GitHub Issues: [Create Issue](https://github.com/KingVeerendra07/Veeru-s_Pro_Academy/issues)
- Neon Docs: https://neon.tech/docs
- Vercel Docs: https://vercel.com/docs

---

**Deployment Time:** ~5 minutes  
**Build Time:** ~2-3 minutes  
**Total Time to Live:** ~10 minutes  

**✨ Your platform will be live at https://www.veeruproacademy.com ✨**
