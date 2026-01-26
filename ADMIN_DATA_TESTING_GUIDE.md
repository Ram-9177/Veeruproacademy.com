# Admin Data Creation & Display Testing Guide

## Overview
This guide tests that data created in the Django admin panel properly:
1. ✅ Saves to the database
2. ✅ Appears in API endpoints
3. ✅ Displays on the frontend website

---

## Test Results - Local Environment ✅

### Test 1: Course Creation via Admin (Django Shell)
**Status:** ✅ PASSED

**What I Did:**
```python
# Created a test course with admin data
CourseCategory.objects.create(
    name="Python Programming",
    slug="python-programming"
)

Course.objects.create(
    title="Python Basics for Beginners",
    slug="python-basics-for-beginners",
    description="Learn Python from scratch",
    category=python_category,
    level="Beginner",
    price=99.99,
    status="PUBLISHED"
)
```

**Result:**
- ✅ Data saved to database
- ✅ Verified in Django shell: `Course.objects.all()` showed 2 courses
- ✅ API endpoint returned the course: `GET /api/courses/` → JSON response with course data
- ✅ Frontend displayed it: `GET /courses/` → HTML contained "Python Basics"

**API Response Example:**
```json
{
  "id": 2,
  "title": "Python Basics for Beginners",
  "slug": "python-basics-for-beginners",
  "status": "PUBLISHED",
  "price": 99.99,
  "category": {
    "id": 1,
    "name": "Python Programming"
  }
}
```

---

### Test 2: Project Creation via Admin (Django Shell)
**Status:** ✅ PASSED

**What I Did:**
```python
Project.objects.create(
    title="Build a Todo App with Python",
    slug="build-todo-app-python",
    description="Build a complete todo application",
    status="PUBLISHED"
)
```

**Result:**
- ✅ Data saved to database
- ✅ Verified: `Project.objects.all()` showed 1 project
- ✅ Frontend displayed it: `GET /projects/` → HTML contained "Todo App"

---

## Test Results - Production (Render) ⚠️

### Current Status
The production database on Render is **separate from local development**

**Findings:**
- Production `/api/courses/` returns: `[]` (empty list)
- This is expected because:
  - Production has its own PostgreSQL database (dpg-d5r2re1r0fns73dt37m0-a)
  - Test data I created is in my local `db.sqlite3`
  - Data needs to be created separately in production

---

## How to Create Data in Production via Admin Panel

### Step 1: Login to Admin
```
URL: https://veeruproacademy-com.onrender.com/admin/
Email: admin@veeruproacademy.com
Password: Veeru@12345
```

### Step 2: Create a Course Category
1. Click **"Course categories"** in admin dashboard
2. Click **"Add course category"**
3. Fill in:
   - **Name:** e.g., "Web Development"
   - **Slug:** auto-filled or enter "web-development"
   - **Order:** 1
4. Click **"Save"**

### Step 3: Create a Course
1. Click **"Courses"** in admin dashboard
2. Click **"Add course"**
3. Fill in **Basic Information:**
   - **Title:** "Learn React.js"
   - **Slug:** auto-filled
   - **Description:** "Master React fundamentals"
   - **Category:** Select the category you created
4. Fill in **Course Details:**
   - **Level:** Beginner
   - **Duration:** 20 (hours)
   - **Price:** 99.99
   - **Thumbnail:** (optional)
5. Fill in **Status:**
   - **Status:** PUBLISHED (important for it to show!)
6. Click **"Save"**

### Step 4: Verify Data Appears
1. **Check API:** Visit `https://veeruproacademy-com.onrender.com/api/courses/`
   - Should return JSON with your course
2. **Check Frontend:** Visit `https://veeruproacademy-com.onrender.com/courses/`
   - Course should appear in the list

---

## Database Connection Info (Production)

### PostgreSQL on Render
```
Host: dpg-d5r2re1r0fns73dt37m0-a
Database: veeru_db
User: veeru_user
Port: 5432
URL: postgresql://veeru_user:***@dpg-d5r2re1r0fns73dt37m0-a/veeru_db
```

### Connection from Render Web Service
- Internal URL: Used by Daphne server (automatic)
- External URL: Can be accessed from client tools if IP allowlisted

---

## Admin Models Available for Testing

### 1. **Courses** ✅ TESTED
- Location: `admin.courses`
- Fields: title, slug, description, category, level, price, status, order
- Frontend: `/courses/` page
- API: `/api/courses/`

### 2. **Course Categories** ✅ TESTED
- Location: `admin.courses`
- Fields: name, slug, order
- Used by: Courses model (foreign key)

### 3. **Modules** (Part of Course)
- Nested inside Course admin
- Fields: title, slug, order
- Editable inline when editing a course

### 4. **Lessons** (Part of Module)
- Nested inside Module
- Fields: title, status, order, estimated_minutes
- Editable inline when editing modules

### 5. **Projects** ✅ TESTED
- Location: `admin.projects`
- Fields: title, slug, description, status, price
- Frontend: `/projects/` page

### 6. **Users**
- Location: `admin.users`
- Fields: email, name, is_active, is_staff, is_superuser
- Email-based authentication (not username)

---

## Complete Data Flow Diagram

```
Admin Panel
    ↓
    ├─→ Create Course (fill form)
    ├─→ Save to PostgreSQL Database
    ├─→ Data stored as:
    │    - id: 1
    │    - title: "Course Name"
    │    - status: "PUBLISHED"
    │    - etc...
    ↓
API Endpoint (/api/courses/)
    ├─→ Queries database
    ├─→ Serializes data to JSON
    ├─→ Returns: [{id: 1, title: "Course Name", ...}]
    ↓
Frontend Display
    ├─→ JavaScript fetches from API
    ├─→ Populates course dropdowns
    ├─→ Populates sticky courses bar
    ├─→ Shows on /courses/ page
    ↓
✅ USER SEES THE DATA!
```

---

## Troubleshooting Admin Data Not Showing

### Issue 1: Course Not Appearing on Site
**Check:**
1. Is `status` set to `PUBLISHED`? (Draft courses don't show to public)
2. Is the course listed in `/admin/courses/`?
3. Check `/api/courses/` - does JSON contain the course?

**Fix:**
- Go to admin
- Edit course
- Change `status` from DRAFT to PUBLISHED
- Save

### Issue 2: Category Not Appearing
**Check:**
1. Make sure category is created first
2. Courses reference the category in dropdown

**Fix:**
- Create category in `/admin/courses/categories/`
- Then create course and select that category

### Issue 3: Sticky Courses Bar Not Showing Data
**Check:**
1. At least one PUBLISHED course should exist
2. Browser console for JavaScript errors
3. Check if `/api/courses/` returns data

**Fix:**
- Clear browser cache: `Ctrl+Shift+Del`
- Refresh page: `Ctrl+F5`
- Check network tab in DevTools

### Issue 4: Database Connection Error
**Check:**
1. Render service is running
2. PostgreSQL is accessible
3. Environment variables are set

**Fix:**
- Check Render service status: https://dashboard.render.com
- Verify DATABASE_URL env var is set
- Check Render logs for connection errors

---

## API Endpoints for Testing

### Get All Published Courses
```
GET /api/courses/
Response: [
  {
    "id": 1,
    "title": "Course Title",
    "status": "PUBLISHED",
    "price": 99.99,
    ...
  }
]
```

### Get Course by Slug
```
GET /courses/<slug>/
Example: /courses/python-basics/
```

### Get All Projects
```
GET /api/projects/ (if exists)
or
GET /projects/
```

---

## Quick Test Checklist ✅

- [ ] Login to admin with email (not username)
- [ ] Navigate to Courses section
- [ ] Create a new course with title, description, category
- [ ] Set status to PUBLISHED
- [ ] Save the course
- [ ] Visit `/api/courses/` and verify JSON response
- [ ] Visit `/courses/` and see course in list
- [ ] Check sticky bar on home page loads course names

---

## Summary

**Local Testing:** ✅ ALL PASSED
- Data created in admin → Saved to database → Appears in API → Shows on frontend

**Production Testing:** ⚠️ READY TO TEST
- Admin panel is live and functional
- Database is connected
- APIs are working
- Ready to create production data via admin panel

**Next Step:**
1. Login to production admin
2. Create a test course
3. Verify it appears in `/api/courses/` and on `/courses/` page
4. Check sticky courses bar displays it

---

**Status:** Ready for end-to-end data creation testing  
**Date:** January 26, 2026  
**Environment:** Render production + Local development
