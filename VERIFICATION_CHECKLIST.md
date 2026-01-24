# ✅ Verification Checklist

Use this checklist to verify all real-time features are working correctly.

## 📋 Pre-Installation Checks

- [ ] Python 3.10+ installed (`python --version`)
- [ ] pip installed and updated (`pip --version`)
- [ ] Virtual environment created (`.venv` folder exists)
- [ ] Git repository is clean (no uncommitted changes)

## 🔧 Installation Checks

### Redis Installation
- [ ] Redis installed
- [ ] Redis service running (`redis-cli ping` returns `PONG`)
- [ ] Redis accessible on port 6379
- [ ] Can connect to Redis (`redis-cli` works)

### Python Dependencies
- [ ] All packages installed (`pip install -r requirements.txt`)
- [ ] No installation errors
- [ ] Django Channels installed (`python -c "import channels"`)
- [ ] Celery installed (`python -c "import celery"`)
- [ ] Redis client installed (`python -c "import redis"`)

### Environment Configuration
- [ ] `.env` file created
- [ ] `DJANGO_SECRET_KEY` set
- [ ] `REDIS_URL` configured
- [ ] `DATABASE_URL` configured (if using PostgreSQL)
- [ ] Email settings configured (optional)

### Database Setup
- [ ] Migrations created (`python manage.py makemigrations`)
- [ ] Migrations applied (`python manage.py migrate`)
- [ ] No migration errors
- [ ] Superuser created (`python manage.py createsuperuser`)

## 🚀 Service Startup Checks

### Daphne (WebSocket Server)
- [ ] Daphne starts without errors
- [ ] Accessible at http://localhost:8000
- [ ] No import errors in console
- [ ] Can access admin panel
- [ ] Can login with superuser

### Celery Worker
- [ ] Celery worker starts without errors
- [ ] Connects to Redis successfully
- [ ] Shows registered tasks
- [ ] No connection errors
- [ ] Worker is ready to accept tasks

### Celery Beat (Optional)
- [ ] Celery beat starts without errors
- [ ] Connects to Redis successfully
- [ ] Shows scheduled tasks
- [ ] No connection errors

## 🧪 Functionality Tests

### WebSocket Connection Tests

#### Test 1: Notifications WebSocket
```javascript
// Open browser console (F12) and run:
const ws = new WebSocket('ws://localhost:8000/ws/notifications/');
ws.onopen = () => console.log('✅ Notifications connected');
ws.onmessage = (e) => console.log('📨 Message:', JSON.parse(e.data));
ws.onerror = (e) => console.error('❌ Error:', e);
ws.onclose = () => console.log('🔌 Disconnected');
```

**Expected Results:**
- [ ] Connection opens successfully
- [ ] Receives initial unread count message
- [ ] No errors in console
- [ ] Connection stays open

#### Test 2: Progress WebSocket
```javascript
// Replace 1 with actual course ID
const ws = new WebSocket('ws://localhost:8000/ws/progress/1/');
ws.onopen = () => console.log('✅ Progress connected');
ws.onmessage = (e) => console.log('📊 Progress:', JSON.parse(e.data));
```

**Expected Results:**
- [ ] Connection opens successfully
- [ ] Receives current progress data
- [ ] No authentication errors
- [ ] Connection stays open

### Celery Task Tests

#### Test 1: Email Task
```python
# In Django shell: python manage.py shell
from academy_learning.tasks import send_enrollment_email
result = send_enrollment_email.delay(1, 1)
print(f"Task ID: {result.id}")
print(f"Result: {result.get(timeout=10)}")
```

**Expected Results:**
- [ ] Task is queued successfully
- [ ] Task executes without errors
- [ ] Returns success message
- [ ] Email appears in console (if using console backend)

#### Test 2: Cache Update Task
```python
from academy_learning.tasks import update_course_progress_cache
result = update_course_progress_cache.delay(1, 1)
print(result.get(timeout=10))
```

**Expected Results:**
- [ ] Task executes successfully
- [ ] Returns success message
- [ ] No errors

### Redis Cache Tests

#### Test 1: Basic Cache Operations
```python
# In Django shell
from django.core.cache import cache

# Set value
cache.set('test_key', 'test_value', timeout=60)

# Get value
value = cache.get('test_key')
print(f"Cached value: {value}")

# Delete value
cache.delete('test_key')

# Verify deletion
value = cache.get('test_key')
print(f"After delete: {value}")  # Should be None
```

**Expected Results:**
- [ ] Can set cache values
- [ ] Can retrieve cache values
- [ ] Can delete cache values
- [ ] No connection errors

#### Test 2: Cache with Compression
```python
from django.core.cache import cache

# Set large value
large_data = {'data': 'x' * 10000}
cache.set('large_key', large_data, timeout=60)

# Retrieve
retrieved = cache.get('large_key')
print(f"Data matches: {retrieved == large_data}")
```

**Expected Results:**
- [ ] Can cache large data
- [ ] Data is compressed
- [ ] Retrieved data matches original
- [ ] No errors

### Database Query Optimization Tests

#### Test 1: Check N+1 Queries
```python
# In Django shell
from django.db import connection
from django.test.utils import override_settings
from academy_learning.models import Enrollment

# Reset query counter
connection.queries_log.clear()

# Fetch enrollments with optimization
enrollments = list(
    Enrollment.objects
    .select_related('course', 'course__instructor')
    .all()[:10]
)

# Access related objects
for e in enrollments:
    _ = e.course.title
    _ = e.course.instructor.name if e.course.instructor else None

# Check query count
print(f"Total queries: {len(connection.queries)}")
```

**Expected Results:**
- [ ] Total queries ≤ 3 (should be 1-2)
- [ ] No N+1 query pattern
- [ ] Fast execution

### Real-Time Dashboard Tests

#### Test 1: Dashboard Load
- [ ] Navigate to `/dashboard/`
- [ ] Page loads in < 500ms
- [ ] No JavaScript errors in console
- [ ] Real-time indicator visible
- [ ] WebSocket connections established

#### Test 2: Progress Update
- [ ] Enroll in a course
- [ ] Mark a lesson complete
- [ ] Progress bar updates without refresh
- [ ] Percentage updates in real-time
- [ ] No page reload needed

#### Test 3: Notifications
- [ ] Perform an action (enroll, submit payment)
- [ ] Notification appears instantly
- [ ] Toast notification shows
- [ ] Notification is dismissible
- [ ] No page reload needed

## 🔒 Security Tests

### Authentication Tests
- [ ] Cannot access WebSocket without login
- [ ] WebSocket closes for unauthenticated users
- [ ] API requires authentication
- [ ] Rate limiting works

### Rate Limiting Tests
```bash
# Test API rate limiting
for i in {1..110}; do
  curl -s http://localhost:8000/api/ > /dev/null
  echo "Request $i"
done
```

**Expected Results:**
- [ ] First 100 requests succeed
- [ ] Requests 101+ return 429 (Too Many Requests)
- [ ] Rate limit resets after 1 hour

### CORS Tests
```javascript
// From different origin
fetch('http://localhost:8000/api/')
  .then(r => console.log('Status:', r.status))
  .catch(e => console.error('CORS error:', e));
```

**Expected Results:**
- [ ] CORS headers present
- [ ] Allowed origins work
- [ ] Blocked origins fail

## 📊 Performance Tests

### Load Time Tests
- [ ] Homepage loads in < 300ms
- [ ] Dashboard loads in < 500ms
- [ ] Course list loads in < 400ms
- [ ] Course detail loads in < 500ms

### Cache Hit Rate Test
```python
# In Django shell
from django.core.cache import cache
from academy_learning.services import get_user_enrollments
from academy_users.models import User

user = User.objects.first()

# First call (cache miss)
import time
start = time.time()
enrollments1 = get_user_enrollments(user, use_cache=True)
time1 = time.time() - start

# Second call (cache hit)
start = time.time()
enrollments2 = get_user_enrollments(user, use_cache=True)
time2 = time.time() - start

print(f"First call: {time1:.4f}s")
print(f"Second call: {time2:.4f}s")
print(f"Speedup: {time1/time2:.1f}x")
```

**Expected Results:**
- [ ] Second call is 5-10x faster
- [ ] Cache hit rate > 80%
- [ ] No cache errors

### Concurrent Connection Test
```bash
# Install Apache Bench
# macOS: brew install httpd
# Ubuntu: sudo apt install apache2-utils

# Test 100 concurrent requests
ab -n 1000 -c 100 http://localhost:8000/
```

**Expected Results:**
- [ ] All requests succeed
- [ ] No connection errors
- [ ] Average response time < 500ms
- [ ] No server crashes

## 🐛 Error Handling Tests

### WebSocket Reconnection Test
1. [ ] Connect to WebSocket
2. [ ] Stop Redis (`brew services stop redis`)
3. [ ] Verify connection closes
4. [ ] Start Redis (`brew services start redis`)
5. [ ] Verify automatic reconnection
6. [ ] Connection works again

### Celery Retry Test
```python
# In Django shell
from academy_learning.tasks import send_enrollment_email

# This should retry on failure
result = send_enrollment_email.delay(99999, 99999)  # Invalid IDs
try:
    print(result.get(timeout=30))
except Exception as e:
    print(f"Failed after retries: {e}")
```

**Expected Results:**
- [ ] Task retries on failure
- [ ] Retries 3 times
- [ ] Eventually fails gracefully
- [ ] Error is logged

### Database Connection Test
```python
# In Django shell
from django.db import connection

# Test connection pooling
for i in range(10):
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
        print(f"Query {i+1}: OK")
```

**Expected Results:**
- [ ] All queries succeed
- [ ] Connection is reused
- [ ] No connection errors
- [ ] Fast execution

## 📈 Monitoring Tests

### Sentry Test (if configured)
```python
# In Django shell
import sentry_sdk
sentry_sdk.capture_message("Test message from Django")

# Trigger an error
try:
    1 / 0
except Exception as e:
    sentry_sdk.capture_exception(e)
```

**Expected Results:**
- [ ] Messages appear in Sentry dashboard
- [ ] Errors are tracked
- [ ] Stack traces are captured
- [ ] User context is included

### Debug Toolbar Test (DEBUG=True only)
- [ ] Debug toolbar appears on pages
- [ ] Shows SQL queries
- [ ] Shows cache hits/misses
- [ ] Shows request/response data

### Logging Test
```python
# In Django shell
import logging
logger = logging.getLogger(__name__)

logger.debug("Debug message")
logger.info("Info message")
logger.warning("Warning message")
logger.error("Error message")
```

**Expected Results:**
- [ ] Messages appear in console
- [ ] Correct log levels
- [ ] Timestamps included
- [ ] No logging errors

## 🚀 Production Readiness

### Configuration Checks
- [ ] `DEBUG=False` in production
- [ ] `DJANGO_STRICT_PRODUCTION=True` set
- [ ] Strong `SECRET_KEY` configured
- [ ] `ALLOWED_HOSTS` properly set
- [ ] `CSRF_TRUSTED_ORIGINS` configured
- [ ] SSL/TLS enabled
- [ ] Redis password set
- [ ] Database backups configured

### Security Checks
- [ ] No sensitive data in logs
- [ ] No debug info exposed
- [ ] HTTPS enforced
- [ ] Secure cookies enabled
- [ ] HSTS enabled
- [ ] CSP headers present

### Performance Checks
- [ ] Static files collected
- [ ] Static files compressed
- [ ] Database indexes present
- [ ] Connection pooling enabled
- [ ] Cache configured
- [ ] CDN configured (optional)

### Monitoring Checks
- [ ] Sentry configured
- [ ] Error alerts set up
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Log aggregation set up

## ✅ Final Verification

### Smoke Test
1. [ ] Start all services
2. [ ] Access homepage
3. [ ] Login as superuser
4. [ ] Navigate to dashboard
5. [ ] Enroll in a course
6. [ ] Mark lesson complete
7. [ ] Verify real-time update
8. [ ] Check notification
9. [ ] Logout
10. [ ] All features work

### Load Test
```bash
# Run for 5 minutes
ab -t 300 -c 50 http://localhost:8000/
```

**Expected Results:**
- [ ] No errors
- [ ] Consistent response times
- [ ] No memory leaks
- [ ] No crashes

### Stress Test
```bash
# Gradually increase load
for c in 10 50 100 200; do
  echo "Testing with $c concurrent users..."
  ab -n 1000 -c $c http://localhost:8000/
  sleep 10
done
```

**Expected Results:**
- [ ] Handles increasing load
- [ ] Graceful degradation
- [ ] No crashes
- [ ] Recovers after load

## 🎉 Completion

If all checks pass:
- ✅ Real-time features working
- ✅ Performance optimized
- ✅ Security configured
- ✅ Monitoring enabled
- ✅ Production ready

**Congratulations! Your platform is ready for real-world use! 🚀**

## 📝 Notes

Record any issues found:

```
Issue: _______________________________________________
Solution: _____________________________________________
Date: _________________________________________________

Issue: _______________________________________________
Solution: _____________________________________________
Date: _________________________________________________
```

## 🆘 If Tests Fail

1. Check service logs
2. Verify Redis is running
3. Check environment variables
4. Review error messages
5. Consult documentation:
   - `QUICK_START.md`
   - `REALTIME_SETUP.md`
   - `CRITICAL_ANALYSIS.md`

## 📞 Support

If you're stuck:
1. Enable DEBUG mode
2. Check all logs
3. Verify Redis connection
4. Test each service individually
5. Review documentation

Good luck! 🍀
