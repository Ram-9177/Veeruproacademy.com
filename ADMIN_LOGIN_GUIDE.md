# Admin Login Guide - Complete Fix

## Problem Identified & Fixed ✅

### Root Cause
The custom User model in this project uses **EMAIL** as the login field, not username. The error message "Please enter the correct email and password for a staff account" was trying to tell you to use **email**, not username.

**User Model Configuration:**
```python
USERNAME_FIELD = 'email'  # Email is used for login, not username
```

### What Was Fixed
1. ✅ Updated `entrypoint.sh` to create admin users with **email-based** credentials
2. ✅ Deployed to Render with proper admin account creation
3. ✅ Verified both admin accounts are now active and working

---

## Admin Credentials

### Account #1: Primary Admin
- **Email:** `admin@veeruproacademy.com`
- **Password:** `Veeru@12345`
- **Name:** Admin
- **Permissions:** Superuser (Full Access)

### Account #2: Backup Admin  
- **Email:** `adminveeru@veeruproacademy.com`
- **Password:** `Admin@12345`
- **Name:** Adminveeru
- **Permissions:** Superuser (Full Access)

---

## How to Login

### Step 1: Visit Admin Panel
Go to: **https://veeruproacademy-com.onrender.com/admin/**

### Step 2: Enter Email (Not Username!)
In the "Email:" field, enter either:
- `admin@veeruproacademy.com` OR
- `adminveeru@veeruproacademy.com`

### Step 3: Enter Password
- For admin@veeruproacademy.com: `Veeru@12345`
- For adminveeru@veeruproacademy.com: `Admin@12345`

### Step 4: Click "Log In"
You should now have full admin access ✅

---

## Technical Details

### User Model Implementation
Location: [academy_users/models.py](academy_users/models.py)

```python
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'  # THIS IS KEY!
    REQUIRED_FIELDS = []
```

### Admin Creation Process
Location: [entrypoint.sh](entrypoint.sh)

The startup script automatically:
1. Runs database migrations
2. Collects static files
3. Creates two superuser admin accounts with email-based credentials
4. Updates credentials if accounts already exist
5. Starts Daphne ASGI server

---

## Database Information

### Render PostgreSQL
- **Host:** dpg-d5r2re1r0fns73dt37m0-a.onrender.com
- **Database:** veeru_db
- **User:** veeru_user

### Admin Accounts in Database
```
Email: admin@veeruproacademy.com
Email: adminveeru@veeruproacademy.com
Email: admin@example.com (legacy, ignore)
```

---

## Deployment Information

### Current Live Deployment
- **Service:** Render Web Service
- **Service ID:** srv-d5qsec4oud1c73eclhp0
- **URL:** https://veeruproacademy-com.onrender.com
- **Status:** ✅ Live (HTTP 200)
- **Server:** Daphne 4.2.1 (ASGI)

### Latest Deployment
- **Commit:** 968ccb2 (fix(admin): create email-based admin accounts)
- **Status:** ✅ LIVE
- **Features:**
  - Sticky courses bar below navbar
  - Courses dropdown menu
  - Dark mode toggle
  - WebSocket support for real-time features
  - Dual admin accounts

---

## Features Available

### Admin Dashboard Features
- ✅ User management
- ✅ Course management
- ✅ Course content editor
- ✅ Payment management
- ✅ Audit logs
- ✅ RBAC (Role-Based Access Control)
- ✅ WebSocket monitoring for real-time features

### Frontend Features
- ✅ Navbar with courses dropdown (loads from API)
- ✅ Sticky courses bar showing all available courses
- ✅ Dark mode / Light mode toggle
- ✅ Responsive mobile menu
- ✅ Tailwind CSS styling

---

## Troubleshooting

### "Incorrect email or password" Error
- ✅ Make sure you're using EMAIL, not username
- ✅ Double-check capitalization and spelling
- ✅ Copy-paste credentials to avoid typos

### Admin Panel Not Accessible
- ✅ Verify site is loading: https://veeruproacademy-com.onrender.com (should show HTTP 200)
- ✅ Clear browser cache and cookies
- ✅ Try incognito/private browsing mode

### Database Connection Issues
- ✅ Check Render service status
- ✅ Verify PostgreSQL is running
- ✅ Check network connectivity

---

## Key Environment Variables (Render)

```
DATABASE_URL=postgresql://veeru_user:***@dpg-d5r2re1r0fns73dt37m0-a/veeru_db
REDIS_URL=rediss://default:***@immense-wallaby-6128.upstash.io:6379
SECRET_KEY=***
DJANGO_DEBUG=False
ALLOWED_HOSTS=veeruproacademy-com.onrender.com,veeruproacademy.com
DJANGO_SUPERUSER_EMAIL=admin@veeruproacademy.com
DJANGO_SUPERUSER_PASSWORD=Veeru@12345
```

---

## Support

For issues with:
- **Admin login:** Check this guide first
- **Sticky courses bar:** Refresh the page or clear cache
- **Dark mode:** Works in navbar, check JavaScript console for errors
- **Real-time features:** WebSocket endpoints at:
  - `/ws/progress/<course_id>/`
  - `/ws/notifications/`
  - `/ws/course-updates/<course_id>/`

---

**Last Updated:** January 26, 2026  
**Deployment Status:** ✅ LIVE  
**Admin Accounts:** ✅ ACTIVE (Both working)
