# 🚀 Complete Setup & Testing Guide

## ✅ All Pages & Features Working

This guide ensures **every page, button, and feature** works perfectly.

## 📋 Step-by-Step Setup

### 1. Install Redis

**macOS:**
```bash
brew install redis
brew services start redis
redis-cli ping  # Should return PONG
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis
sudo systemctl enable redis
redis-cli ping  # Should return PONG
```

### 2. Install Dependencies

```bash
# Activate virtual environment
source .venv/bin/activate  # macOS/Linux
# or
.venv\Scripts\activate  # Windows

# Install all packages
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.realtime.example .env

# Edit .env with your settings
nano .env  # or use your preferred editor
```

**Minimum required settings in `.env`:**
```bash
DJANGO_SECRET_KEY=your-super-secret-key-change-this
DJANGO_DEBUG=True
REDIS_URL=redis://localhost:6379/0
DATABASE_URL=sqlite:///db.sqlite3
```

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
# Enter email, name, and password
```

### 6. Create Demo Data (Optional)

```bash
python manage.py shell
```

Then run:
```python
from academy_courses.models import Course, Module, Lesson, CourseCategory, ContentStatus
from academy_users.models import User

# Create category
category = CourseCategory.objects.create(
    slug='web-development',
    name='Web Development',
    description='Learn web development',
    order=1
)

# Create course
course = Course.objects.create(
    slug='python-basics',
    title='Python Basics',
    description='Learn Python programming from scratch',
    level='Beginner',
    duration='4 weeks',
    price=0,
    status=ContentStatus.PUBLISHED,
    category=category
)

# Create module
module = Module.objects.create(
    course=course,
    slug='introduction',
    title='Introduction to Python',
    description='Get started with Python',
    order=1
)

# Create lessons
Lesson.objects.create(
    module=module,
    slug='what-is-python',
    title='What is Python?',
    description='Learn about Python programming language',
    body='<h2>Welcome to Python!</h2><p>Python is a powerful programming language...</p>',
    estimated_minutes=15,
    difficulty='Beginner',
    order=1,
    status=ContentStatus.PUBLISHED
)

Lesson.objects.create(
    module=module,
    slug='installing-python',
    title='Installing Python',
    description='How to install Python on your computer',
    body='<h2>Installation Guide</h2><p>Follow these steps to install Python...</p>',
    youtube_url='https://www.youtube.com/embed/YYXdXT2l-Gg',
    estimated_minutes=20,
    difficulty='Beginner',
    order=2,
    status=ContentStatus.PUBLISHED
)

print("✅ Demo data created!")
exit()
```

### 7. Start All Services

**Option A: Use the startup script (Recommended)**
```bash
chmod +x start_realtime.sh
./start_realtime.sh
```

**Option B: Manual start (3 separate terminals)**

Terminal 1 - Django/Daphne:
```bash
source .venv/bin/activate
daphne -b 0.0.0.0 -p 8000 academy.asgi:application
```

Terminal 2 - Celery Worker:
```bash
source .venv/bin/activate
celery -A academy worker --loglevel=info
```

Terminal 3 - Celery Beat (optional):
```bash
source .venv/bin/activate
celery -A academy beat --loglevel=info
```

## 🧪 Testing All Pages

### Public Pages (No Login Required)

1. **Homepage** - http://localhost:8000/
   - [ ] Page loads
   - [ ] Navigation works
   - [ ] Dark mode toggle works
   - [ ] Language selector works

2. **Course List** - http://localhost:8000/courses/
   - [ ] Shows all published courses
   - [ ] Course cards display correctly
   - [ ] Click on course goes to detail page

3. **Course Detail** - http://localhost:8000/courses/python-basics/
   - [ ] Course information displays
   - [ ] Modules and lessons listed
   - [ ] Enroll button visible
   - [ ] Price shown correctly

4. **Projects List** - http://localhost:8000/projects/
   - [ ] Page loads
   - [ ] Projects display (if any)

5. **About** - http://localhost:8000/about/
   - [ ] Page loads
   - [ ] Content displays

6. **Contact** - http://localhost:8000/contact/
   - [ ] Form displays
   - [ ] Can submit form
   - [ ] Success message shows

7. **FAQ** - http://localhost:8000/faq/
   - [ ] Page loads

8. **Blog** - http://localhost:8000/blog/
   - [ ] Page loads

9. **Careers** - http://localhost:8000/careers/
   - [ ] Page loads

10. **Privacy Policy** - http://localhost:8000/privacy/
    - [ ] Page loads

11. **Terms of Service** - http://localhost:8000/terms/
    - [ ] Page loads

12. **Refund Policy** - http://localhost:8000/refund-policy/
    - [ ] Page loads

### Authentication Pages

13. **Signup** - http://localhost:8000/signup/
    - [ ] Form displays
    - [ ] Can create account
    - [ ] Redirects to dashboard after signup
    - [ ] Validation works

14. **Login** - http://localhost:8000/login/
    - [ ] Form displays
    - [ ] Can login with credentials
    - [ ] "Remember me" checkbox works
    - [ ] Redirects to dashboard
    - [ ] Error messages for wrong credentials

15. **Password Reset Request** - http://localhost:8000/password-reset/
    - [ ] Form displays
    - [ ] Can submit email
    - [ ] Success message shows
    - [ ] Email sent (check console if using console backend)

16. **Logout** - http://localhost:8000/logout/
    - [ ] Logs out user
    - [ ] Redirects to login
    - [ ] Success message shows

### Authenticated Pages (Login Required)

17. **Dashboard** - http://localhost:8000/dashboard/
    - [ ] Page loads
    - [ ] Real-time indicator visible
    - [ ] Stats display correctly
    - [ ] Enrolled courses show
    - [ ] WebSocket connects (check browser console)
    - [ ] No JavaScript errors

18. **Course Enrollment**
    - [ ] Go to course detail page
    - [ ] Click "Enroll" button
    - [ ] Enrollment succeeds
    - [ ] Redirects to dashboard
    - [ ] Course appears in "My Courses"
    - [ ] Real-time notification appears

19. **Lesson View** - http://localhost:8000/courses/python-basics/lesson/what-is-python/
    - [ ] Lesson content displays
    - [ ] Video player works (if YouTube URL)
    - [ ] Lesson body renders correctly
    - [ ] Navigation sidebar shows all lessons
    - [ ] Current lesson highlighted
    - [ ] "Mark Complete" button visible

20. **Mark Lesson Complete**
    - [ ] Click "Mark Complete" button
    - [ ] Success message shows
    - [ ] Lesson marked as complete
    - [ ] Progress bar updates in real-time
    - [ ] Dashboard progress updates without refresh
    - [ ] WebSocket sends update

21. **Lesson Navigation**
    - [ ] "Previous Lesson" button works
    - [ ] "Next Lesson" button works
    - [ ] Sidebar navigation works
    - [ ] Completed lessons show checkmark

22. **Payment Proof Submission** (for paid courses)
    - [ ] Go to paid course
    - [ ] Click "Enroll Now"
    - [ ] Redirects to payment proof page
    - [ ] Form displays
    - [ ] Can upload file or enter URL
    - [ ] Submission succeeds
    - [ ] Shows pending status

23. **Feedback** - http://localhost:8000/feedback/
    - [ ] Form displays
    - [ ] Can submit feedback
    - [ ] Success message shows

### Admin Panel

24. **Admin Login** - http://localhost:8000/admin/
    - [ ] Login with superuser
    - [ ] Dashboard loads
    - [ ] All models visible

25. **Admin - Courses**
    - [ ] Can view courses
    - [ ] Can add course
    - [ ] Can edit course
    - [ ] Can delete course

26. **Admin - Modules**
    - [ ] Can view modules
    - [ ] Can add module
    - [ ] Can edit module

27. **Admin - Lessons**
    - [ ] Can view lessons
    - [ ] Can add lesson
    - [ ] Can edit lesson

28. **Admin - Users**
    - [ ] Can view users
    - [ ] Can edit user
    - [ ] Can change permissions

29. **Admin - Enrollments**
    - [ ] Can view enrollments
    - [ ] Can add enrollment
    - [ ] Can change status

30. **Admin - Payment Proofs**
    - [ ] Can view submissions
    - [ ] Can approve/reject
    - [ ] User gets notification on approval

## 🔌 Testing Real-Time Features

### WebSocket Connection Test

Open browser console (F12) and run:

```javascript
// Test notifications WebSocket
const ws = new WebSocket('ws://localhost:8000/ws/notifications/');
ws.onopen = () => console.log('✅ Notifications connected');
ws.onmessage = (e) => console.log('📨 Message:', JSON.parse(e.data));
ws.onerror = (e) => console.error('❌ Error:', e);

// Should see: ✅ Notifications connected
// Should receive: unread_count message
```

### Progress Update Test

1. Enroll in a course
2. Open a lesson
3. Open browser console
4. Mark lesson complete
5. Watch for WebSocket message in console
6. Check dashboard - progress should update without refresh

### Background Task Test

```bash
# Open Django shell
python manage.py shell
```

```python
from academy_learning.tasks import send_enrollment_email
from academy_users.models import User
from academy_courses.models import Course

user = User.objects.first()
course = Course.objects.first()

# Send test email
result = send_enrollment_email.delay(user.id, course.id)
print(f"Task ID: {result.id}")
print(f"Result: {result.get(timeout=10)}")

# Check Celery worker terminal - should see task execution
# Check email console - should see email output
```

### Cache Test

```python
# In Django shell
from django.core.cache import cache

# Test set/get
cache.set('test_key', 'Hello Redis!', timeout=60)
value = cache.get('test_key')
print(f"Cached value: {value}")  # Should print: Hello Redis!

# Test delete
cache.delete('test_key')
value = cache.get('test_key')
print(f"After delete: {value}")  # Should print: None
```

## 🐛 Common Issues & Solutions

### Issue: Redis Connection Error

**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# If not running, start it
brew services start redis  # macOS
sudo systemctl start redis  # Linux
```

### Issue: WebSocket Connection Failed

**Solution:**
1. Make sure you're using Daphne, not runserver
2. Check browser console for errors
3. Verify ALLOWED_HOSTS in settings
4. Check if Redis is running

### Issue: Celery Tasks Not Running

**Solution:**
1. Check if Celery worker is running
2. Verify Redis connection
3. Check CELERY_BROKER_URL in .env
4. Look at Celery worker logs for errors

### Issue: Import Errors

**Solution:**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete
```

### Issue: Migration Errors

**Solution:**
```bash
# Reset migrations (development only!)
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete

# Recreate migrations
python manage.py makemigrations
python manage.py migrate
```

### Issue: Static Files Not Loading

**Solution:**
```bash
# Collect static files
python manage.py collectstatic --noinput

# In development, make sure DEBUG=True
```

## ✅ Final Checklist

- [ ] Redis is running
- [ ] All 3 services started (Daphne, Celery Worker, Celery Beat)
- [ ] Can access homepage
- [ ] Can signup/login
- [ ] Can view courses
- [ ] Can enroll in course
- [ ] Can view lessons
- [ ] Can mark lessons complete
- [ ] Progress updates in real-time
- [ ] WebSocket connects successfully
- [ ] Background tasks execute
- [ ] Cache is working
- [ ] Admin panel accessible
- [ ] All pages load without errors
- [ ] No JavaScript errors in console
- [ ] Dark mode works
- [ ] Language selector works
- [ ] Mobile responsive

## 🎉 Success!

If all checks pass, your platform is **fully functional** with:
- ✅ All pages working
- ✅ All buttons functional
- ✅ Real-time updates
- ✅ Background processing
- ✅ Caching enabled
- ✅ Production-ready

## 📚 Next Steps

1. **Customize Content:**
   - Add your courses via admin panel
   - Upload course thumbnails
   - Add YouTube video URLs
   - Write lesson content

2. **Configure Email:**
   - Set up SMTP settings in .env
   - Test email delivery
   - Customize email templates

3. **Deploy to Production:**
   - See DEPLOYMENT.md
   - Set up domain and SSL
   - Configure production database
   - Set up monitoring

4. **Add More Features:**
   - Quizzes and assessments
   - Discussion forums
   - Live chat support
   - Mobile app

Happy teaching! 🎓
