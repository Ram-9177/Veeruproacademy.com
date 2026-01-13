# Veeru's Pro Academy - Administrator Guide

Welcome to the Veeru's Pro Academy administration guide. This document outlines how to manage content, courses, and users on your platform.

## 1. Accessing the Admin Panel

To access the administrative features, you must be logged in with an account that has the `ADMIN` role.

- **URL**: `/admin`
- **Dashboard**: The main hub shows real-time stats of enrolled users, revenue, and active sessions.

## 2. Managing Courses

### Creating a New Course

1. Navigate to **Courses** in the admin sidebar.
2. Click **"New Course"**.
3. Fill in the basic details:
   - **Title**: The public name of the course.
   - **Slug**: URL-friendly identifier (auto-generated usually).
   - **Description**: A short summary for the course card.
   - **Price**: Set to `0` for free courses.
   - **Level**: Beginner, Intermediate, or Advanced.
4. Click **Create**.

### Adding Content (Modules & Lessons)

Once a course is created, you will be redirected to the Course Editor.

1. **Modules**: Click "Add Module" to create sections (e.g., "Introduction", "Advanced Concepts").
2. **Lessons**: Inside a module, click "Add Lesson".
   - **Title**: Lesson name.
   - **Video URL**: Link to your video content (YouTube, Vimeo, etc.).
   - **Content**: Use the rich text editor to add notes, code snippets, and reading material.
   - **Free Preview**: Check this if you want non-enrolled users to see this lesson.

### Publishing

- Courses are **DRAFT** by default.
- To make a course visible to students, you must change its status to **PUBLISHED**.
- You can do this from the Course Editor or the main Courses list.

## 3. Content Management System (CMS)

Use the CMS to manage static pages and marketing content.

- **URL**: `/admin/content`
- **Create Page**: Click "New Page" to create pages like "About Us", "Terms", "Privacy Policy".
- **Edit Content**: Use the Markdown/Rich Text editor.
- **Publishing**: Content must be published to be visible on the public site.

## 4. Analytics

View detailed platform performance at `/admin/analytics`.

- **Revenue**: Track income efficiently.
- **Enrollments**: See which courses are most popular.
- **User Growth**: Monitor new signups over time.

## 5. Development Tools & Scripts

We have included several utility scripts to help manage your data during development.

### Force Publish All Content

If you have seeded data or want to quickly publish everything:

```bash
node scripts/force-publish.cjs
```

This will set all Courses and Lessons to `PUBLISHED` status.

### Database Management

To view and edit raw database records:

```bash
npx prisma studio
```

This opens a visual editor for your PostgreSQL database in the browser.

## 6. Project Structure Overview

- **`app/admin`**: Administrative pages and components.
- **`app/courses`**: Public course catalog and learning interface.
- **`app/api`**: Backend API routes (secured with admin checks where necessary).
- **`prisma/schema.prisma`**: Database schema definition.

## Need Help?

If you encounter issues, check the server logs or use the "Feedback" section in the admin panel (if enabled).
