# 🚀 Free Deployment Guide - Veeru's Pro Academy
This guide covers deploying the Veeru's Pro Academy Django application on **free hosting platforms**.

---

## 📋 Prerequisites

- GitHub account (to push your code)
- Account on one of the free hosting platforms (Render, Railway, or Vercel)

---

## Option 1: Deploy to Render.com (Recommended - FREE)

Render offers a free tier with:
- ✅ Free web service (spins down after 15 mins of inactivity)
- ✅ Free PostgreSQL database (90 days)
- ✅ Automatic HTTPS
- ✅ Auto-deploy from GitHub

### Steps:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/veeru-pro-academy.git
   git push -u origin main
   ```

2. **Create a Render Account**
   - Go to [render.com](https://render.com) and sign up with GitHub

3. **Deploy using Blueprint (Automatic)**
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml` and set everything up automatically

4. **OR Deploy Manually:**
   
   a. **Create PostgreSQL Database:**
   - Dashboard → New → PostgreSQL
   - Name: `veeru-academy-db`
   - Plan: Free
   - Copy the "Internal Database URL"

   b. **Create Web Service:**
   - Dashboard → New → Web Service
   - Connect your GitHub repo
   - Settings:
     - Name: `veeru-pro-academy`
     - Environment: `Python 3`
     - Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate --noinput`
     - Start Command: `gunicorn academy.wsgi:application --bind 0.0.0.0:$PORT --workers 2`

   c. **Add Environment Variables:**
   ```
   DJANGO_DEBUG=false
   DJANGO_SECRET_KEY=<generate-a-random-key>
   DATABASE_URL=<paste-internal-database-url>
   DJANGO_ALLOWED_HOSTS=your-app-name.onrender.com
   DJANGO_CSRF_TRUSTED_ORIGINS=https://your-app-name.onrender.com
   DJANGO_CORS_ALLOWED_ORIGINS=https://your-app-name.onrender.com
   DJANGO_SECURE_SSL_REDIRECT=true
   DJANGO_SESSION_COOKIE_SECURE=true
   DJANGO_CSRF_COOKIE_SECURE=true
   ```

5. **Create Admin User** (via Render Shell)
   ```bash
   python manage.py createsuperuser
   ```

6. **Seed Demo Data** (optional)
   ```bash
   python manage.py seed_demo
   ```

---

## Option 2: Deploy to Railway.app (FREE $5/month credit)

Railway offers:
- ✅ $5 free credit monthly
- ✅ PostgreSQL included
- ✅ Faster cold starts than Render
- ✅ Auto-deploy from GitHub

### Steps:

1. **Push code to GitHub** (same as above)

2. **Create Railway Account**
   - Go to [railway.app](https://railway.app) and sign up with GitHub

3. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

4. **Add PostgreSQL**
   - In your project, click "New" → "Database" → "PostgreSQL"
   - Railway auto-injects `DATABASE_URL`

5. **Configure Environment Variables**
   - Click on your service → Variables tab
   - Add:
   ```
   DJANGO_DEBUG=false
   DJANGO_SECRET_KEY=your-secret-key-here
   DJANGO_ALLOWED_HOSTS=.railway.app
   DJANGO_CSRF_TRUSTED_ORIGINS=https://*.railway.app
   DJANGO_CORS_ALLOWED_ORIGINS=https://*.railway.app
   DJANGO_SECURE_SSL_REDIRECT=true
   DJANGO_SESSION_COOKIE_SECURE=true
   DJANGO_CSRF_COOKIE_SECURE=true
   ```

6. **Deploy**
   - Railway will automatically detect the `railway.json` and deploy

7. **Run Migrations** (via Railway CLI or console)
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py seed_demo
   ```

---

## Option 3: Deploy to Vercel (with Serverless PostgreSQL)

Vercel is great for serverless, but requires some setup.

### Steps:

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Create `vercel.json`** (already included if needed)

3. **Use Vercel Postgres or Neon**
   - Sign up at [neon.tech](https://neon.tech) for free PostgreSQL
   - Get your connection string

4. **Deploy**
   ```bash
   vercel --prod
   ```

---

## 🔐 Generate Secret Key

Always generate a new secret key for production:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

## 📊 Post-Deployment Checklist

After deployment, verify:

- [ ] Homepage loads correctly: `https://your-app.onrender.com`
- [ ] Signup works: Create a test account
- [ ] Login works: Login with the test account
- [ ] Courses page loads: `/courses/`
- [ ] Dashboard loads: `/dashboard/`
- [ ] Admin panel works: `/admin/`
- [ ] Static files (CSS/JS) load properly
- [ ] Dark mode toggle works
- [ ] Mobile menu works

---

## 🔧 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DJANGO_SECRET_KEY` | ✅ | Secret key for cryptographic signing |
| `DJANGO_DEBUG` | ✅ | Set to `false` in production |
| `DATABASE_URL` | ✅ | PostgreSQL connection URL |
| `DJANGO_ALLOWED_HOSTS` | ✅ | Your domain(s), comma-separated |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | ✅ | Full URLs with https:// |
| `DJANGO_CORS_ALLOWED_ORIGINS` | ✅ | Full URLs with https:// |
| `DJANGO_SECURE_SSL_REDIRECT` | ⚡ | `true` for HTTPS redirect |
| `DJANGO_SESSION_COOKIE_SECURE` | ⚡ | `true` for secure cookies |
| `DJANGO_CSRF_COOKIE_SECURE` | ⚡ | `true` for CSRF security |

---

## 🆘 Troubleshooting

### Static files not loading?
```bash
python manage.py collectstatic --noinput
```

### Database errors?
```bash
python manage.py migrate --noinput
```

### 500 errors?
- Check `DJANGO_ALLOWED_HOSTS` includes your domain
- Check `DJANGO_CSRF_TRUSTED_ORIGINS` has full URL with `https://`
- View logs in your hosting platform dashboard

### Can't create superuser?
Use the platform's shell/console:
```bash
python manage.py createsuperuser --email admin@example.com --noinput
```
Then set password via Django admin "Forgot Password" or shell.

---

## 🌐 Custom Domain (Optional)

After deployment, you can add a custom domain:

1. **Render**: Settings → Custom Domains
2. **Railway**: Settings → Domains
3. Update `DJANGO_ALLOWED_HOSTS` and `DJANGO_CSRF_TRUSTED_ORIGINS`

---

## 📧 Contact Support

If you face any issues:
- Email: support@veeruproacademy.com
- GitHub Issues: Open an issue in the repository

Happy Deploying! 🎉
