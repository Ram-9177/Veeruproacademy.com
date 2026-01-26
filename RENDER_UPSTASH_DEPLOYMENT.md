# 🚀 Render + Upstash Deployment Guide

## Overview
Deploy your Django app to **Render** with **Upstash Redis** for real-time sync.

---

## ✅ Step 1: Create Upstash Redis Instance

### 1.1 Go to Upstash
- Visit: https://upstash.com
- Click "Sign Up" (or Sign In if you have account)
- Create account with email/GitHub

### 1.2 Create Redis Database
1. Dashboard → "Create Database"
2. Configure:
   - **Database Name:** `veeruspro-redis`
   - **Region:** Select closest to your location (US East recommended)
   - **Eviction Policy:** `noeviction`
   - Click "Create"

### 1.3 Get Redis URL
After creation:
1. Click on your database name
2. Find "REST API" section
3. Copy the **Redis URL** (looks like):
   ```
   redis://:yourpassword@us1-example.upstash.io:12345
   ```
4. **Save this URL** - you'll need it for Render

---

## ✅ Step 2: Deploy to Render

### 2.1 Connect GitHub
1. Go to https://render.com
2. Sign up / Sign in with GitHub
3. Click "Connect GitHub Account"
4. Authorize Render to access your repos
5. Select repository: `Ram-9177/Veeruproacademy.com`

### 2.2 Create Web Service
1. Dashboard → "New +" → "Web Service"
2. Select your repository
3. Configure:
   - **Name:** `veeruspro-academy`
   - **Runtime:** `Python 3.11`
   - **Build Command:** 
     ```
     pip install -r requirements.txt && python manage.py collectstatic --noinput
     ```
   - **Start Command:**
     ```
     daphne -b 0.0.0.0 -p $PORT academy.asgi:application
     ```
   - **Plan:** Free (or Paid if you want more power)
   - Click "Create Web Service"

### 2.3 Add Environment Variables
While service is building:

1. Go to "Environment" tab
2. Add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `DJANGO_SECRET_KEY` | `your-long-random-string` | Generate: `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'` |
| `DJANGO_DEBUG` | `False` | Always False in production |
| `DJANGO_ALLOWED_HOSTS` | `veeruspro-academy.onrender.com` | Replace with your Render domain |
| `DATABASE_URL` | (auto-created by Render) | Skip if using PostgreSQL from Render |
| `REDIS_URL` | `redis://:yourpassword@us1-example.upstash.io:12345` | **From Upstash** ⭐ |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | `https://veeruspro-academy.onrender.com` | Your Render domain |

3. Click "Save Changes"

---

## ✅ Step 3: Set Up PostgreSQL (Optional but Recommended)

If you want to upgrade from SQLite to PostgreSQL:

### 3.1 Create PostgreSQL Database
1. Render Dashboard → "New +" → "PostgreSQL"
2. Configure:
   - **Name:** `veeruspro-db`
   - **Region:** Same as web service
   - **PostgreSQL Version:** 15
   - Click "Create Database"

### 3.2 Get Database URL
1. Go to your PostgreSQL service
2. Copy the "Internal Database URL"
3. In Web Service → Environment:
   - Set `DATABASE_URL` = the URL you copied
   - Save Changes

### 3.3 Run Migrations
1. In Web Service, go to "Shell"
2. Run:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

---

## ✅ Step 4: Wait for Deployment

The web service will:
1. **Build:** Install dependencies, collect static files
2. **Deploy:** Start daphne server
3. **Live:** Your app is live at https://veeruspro-academy.onrender.com

**Check Status:**
- Go to "Logs" tab
- Should see: `Uvicorn running on 0.0.0.0:10000` or similar
- No errors = ✅ Success

---

## ✅ Step 5: Verify Real-Time Working

### 5.1 Test on Live Site
1. Open: https://veeruspro-academy.onrender.com/projects/
2. Open admin in another tab: https://veeruspro-academy.onrender.com/admin/
3. Add a project with status=PUBLISHED
4. **Watch projects page** → New project appears within seconds ✅

### 5.2 Test in Browser Console
1. Open projects page
2. Press F12 → Console tab
3. Open Network tab, filter by "ws"
4. Should see WebSocket connection to `/ws/courses/` ✅

---

## 📊 Architecture After Deployment

```
┌─────────────────────────────────────────┐
│         Render Web Service              │
│  (daphne/ASGI - supports WebSocket)     │
│  https://veeruspro-academy.onrender.com │
└────────┬──────────────────────┬─────────┘
         │                      │
    ┌────▼────┐          ┌──────▼────────┐
    │PostgreSQL│          │ Upstash Redis │
    │  Database│          │ (Real-time)   │
    └──────────┘          └───────────────┘
```

**Flow:**
1. User adds course in admin
2. Django signal → Sends to Upstash Redis
3. Redis → Broadcasts to all WebSocket clients
4. Browser receives update → Displays instantly ✅

---

## 🔧 Environment Variables Reference

### Required
```
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=veeruspro-academy.onrender.com
REDIS_URL=redis://:password@us1-example.upstash.io:12345
```

### Optional
```
DJANGO_CSRF_TRUSTED_ORIGINS=https://veeruspro-academy.onrender.com
DJANGO_SECURE_SSL_REDIRECT=True
DJANGO_SECURE_HSTS_SECONDS=31536000
```

---

## ✅ Troubleshooting

### App crashes on deploy
**Check:** Logs tab for errors
**Common issues:**
- Missing `REDIS_URL` → Won't crash, just falls back to polling
- Wrong `DJANGO_ALLOWED_HOSTS` → Update with your domain
- Missing migrations → Run in Shell tab

### Real-time not working
1. Check if Redis URL is set
2. Check browser WebSocket (F12 → Network → WS)
3. If no WS connection, that's OK - polling still works (30s)

### Database migrations failed
1. Go to Web Service → Shell
2. Run:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

### Static files not loading (CSS/JS looks broken)
1. In Shell, run:
   ```bash
   python manage.py collectstatic --noinput
   ```
2. Redeploy service

---

## 📝 Quick Checklist

- [ ] Created Upstash Redis database
- [ ] Copied Redis URL
- [ ] Connected GitHub to Render
- [ ] Created Web Service on Render
- [ ] Set all environment variables
- [ ] Deployment finished (logs show success)
- [ ] Added REDIS_URL env var
- [ ] Service is live and responding
- [ ] Tested real-time (added course, saw it on frontend)
- [ ] Admin works at `/admin/`

---

## 🎉 Success Indicators

✅ Service running: https://veeruspro-academy.onrender.com works  
✅ Admin accessible: `/admin/` opens  
✅ API working: `/api/courses/` returns JSON  
✅ Real-time working: Add project → appears within 30s (or instantly with WebSocket)  
✅ No 500 errors in logs  

---

## 📞 Support

**Render Docs:** https://render.com/docs  
**Upstash Docs:** https://upstash.com/docs  
**Django:** https://docs.djangoproject.com

---

## Next: Custom Domain (Optional)

Once deployed and working:
1. Go to Web Service → Settings
2. Click "Add Custom Domain"
3. Enter your domain (e.g., veeruspro-academy.com)
4. Follow DNS instructions
5. Your app will be at your custom domain ✅

---

**Status: READY FOR PRODUCTION** 🚀
