# 🚀 Real-Time Features Setup Guide

This guide will help you set up and run the real-time features in Veeru's Pro Academy.

## 📋 Prerequisites

- Python 3.10+
- Redis Server
- PostgreSQL (recommended for production)

## 🔧 Installation Steps

### 1. Install Redis

**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

**Windows:**
Download from https://redis.io/download or use WSL

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy the real-time environment example:
```bash
cp .env.realtime.example .env
```

Edit `.env` and set your configuration:
- `DJANGO_SECRET_KEY`: Generate a secure key
- `DATABASE_URL`: Your database connection string
- `REDIS_URL`: Redis connection (default: redis://localhost:6379/0)
- Email settings for notifications

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

## 🏃 Running the Application

You need to run **3 separate processes** for full real-time functionality:

### Terminal 1: Django/Daphne Server (WebSocket + HTTP)

```bash
daphne -b 0.0.0.0 -p 8000 academy.asgi:application
```

Or for development with auto-reload:
```bash
python manage.py runserver
```

### Terminal 2: Celery Worker (Background Tasks)

```bash
celery -A academy worker --loglevel=info
```

For development with auto-reload:
```bash
celery -A academy worker --loglevel=info --pool=solo
```

### Terminal 3: Celery Beat (Scheduled Tasks - Optional)

```bash
celery -A academy beat --loglevel=info
```

## 🎯 Real-Time Features Implemented

### 1. **Live Progress Tracking**
- Real-time course progress updates
- Instant lesson completion feedback
- Live progress bars on dashboard

**WebSocket Endpoint:** `/ws/progress/<course_id>/`

**Usage:**
```javascript
// Connect to progress updates
wsManager.connect('progress_123', '/ws/progress/123/', {
    onMessage: (data) => {
        console.log('Progress update:', data);
    }
});

// Mark lesson complete
wsManager.send('progress_123', {
    action: 'mark_complete',
    lesson_id: 456
});
```

### 2. **Real-Time Notifications**
- Instant enrollment confirmations
- Payment approval notifications
- Certificate issuance alerts

**WebSocket Endpoint:** `/ws/notifications/`

**Usage:**
```javascript
wsManager.connect('notifications', '/ws/notifications/', {
    onMessage: (data) => {
        if (data.type === 'payment_approved') {
            showNotification('Payment approved!');
        }
    }
});
```

### 3. **Live Course Updates**
- Broadcast new lessons to enrolled students
- Real-time content updates
- Instructor announcements

**WebSocket Endpoint:** `/ws/course-updates/<course_id>/`

### 4. **Background Email Processing**
- Async enrollment emails
- Payment confirmation emails
- Certificate delivery

**Celery Tasks:**
- `send_enrollment_email`
- `send_payment_approval_email`
- `generate_certificate`

### 5. **Redis Caching**
- Course data caching
- User enrollment caching
- Progress data caching
- Session storage

**Cache Keys:**
- `user_enrollments_{user_id}`
- `course_progress_{user_id}_{course_id}`
- `course_enrollments_{course_id}`

## 🧪 Testing Real-Time Features

### Test WebSocket Connection

```bash
# Install wscat
npm install -g wscat

# Test notifications
wscat -c ws://localhost:8000/ws/notifications/

# Test progress (replace 1 with actual course ID)
wscat -c ws://localhost:8000/ws/progress/1/
```

### Test Celery Tasks

```python
# In Django shell
python manage.py shell

from academy_learning.tasks import send_enrollment_email
result = send_enrollment_email.delay(user_id=1, course_id=1)
print(result.get())
```

### Test Redis Cache

```python
from django.core.cache import cache

# Set cache
cache.set('test_key', 'test_value', timeout=60)

# Get cache
value = cache.get('test_key')
print(value)  # Should print: test_value
```

## 📊 Monitoring

### Redis Monitoring

```bash
# Connect to Redis CLI
redis-cli

# Monitor all commands
MONITOR

# Check memory usage
INFO memory

# List all keys
KEYS *
```

### Celery Monitoring

```bash
# Check active tasks
celery -A academy inspect active

# Check registered tasks
celery -A academy inspect registered

# Check worker stats
celery -A academy inspect stats
```

## 🐛 Troubleshooting

### WebSocket Connection Failed

1. Check if Daphne is running
2. Verify ALLOWED_HOSTS includes your domain
3. Check browser console for errors
4. Ensure Redis is running: `redis-cli ping` (should return PONG)

### Celery Tasks Not Running

1. Check if Celery worker is running
2. Verify Redis connection: `redis-cli ping`
3. Check Celery logs for errors
4. Ensure CELERY_BROKER_URL is correct in .env

### Redis Connection Error

1. Start Redis: `redis-server`
2. Check Redis is listening: `redis-cli ping`
3. Verify REDIS_URL in .env
4. Check firewall settings

### Performance Issues

1. **Enable Redis persistence:**
   ```bash
   # In redis.conf
   save 900 1
   save 300 10
   save 60 10000
   ```

2. **Optimize Celery workers:**
   ```bash
   # Increase worker concurrency
   celery -A academy worker --concurrency=4
   ```

3. **Monitor memory usage:**
   ```bash
   # Check Redis memory
   redis-cli INFO memory
   
   # Check Python memory
   pip install memory_profiler
   ```

## 🚀 Production Deployment

### 1. Use Supervisor for Process Management

Create `/etc/supervisor/conf.d/academy.conf`:

```ini
[program:academy_daphne]
command=/path/to/venv/bin/daphne -b 0.0.0.0 -p 8000 academy.asgi:application
directory=/path/to/project
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/academy/daphne.log

[program:academy_celery]
command=/path/to/venv/bin/celery -A academy worker --loglevel=info
directory=/path/to/project
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/academy/celery.log

[program:academy_celery_beat]
command=/path/to/venv/bin/celery -A academy beat --loglevel=info
directory=/path/to/project
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/academy/celery_beat.log
```

### 2. Use Nginx for WebSocket Proxy

Add to Nginx config:

```nginx
upstream academy_backend {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://academy_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /ws/ {
        proxy_pass http://academy_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }
}
```

### 3. Environment Variables for Production

```bash
DJANGO_DEBUG=False
DJANGO_STRICT_PRODUCTION=True
DJANGO_SECURE_SSL_REDIRECT=True
DJANGO_SESSION_COOKIE_SECURE=True
DJANGO_CSRF_COOKIE_SECURE=True
REDIS_URL=redis://your-redis-host:6379/0
SENTRY_DSN=your-sentry-dsn
```

## 📈 Performance Optimization

### 1. Redis Configuration

```bash
# /etc/redis/redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
tcp-backlog 511
timeout 300
```

### 2. Database Connection Pooling

Already configured in settings.py:
- `CONN_MAX_AGE=60`
- `CONN_HEALTH_CHECKS=True`

### 3. Celery Optimization

```python
# In settings.py
CELERY_WORKER_PREFETCH_MULTIPLIER = 4
CELERY_WORKER_MAX_TASKS_PER_CHILD = 1000
CELERY_TASK_TIME_LIMIT = 30 * 60
```

## 🔒 Security Considerations

1. **WebSocket Authentication:** Already implemented via `AuthMiddlewareStack`
2. **CORS Configuration:** Set `DJANGO_CORS_ALLOWED_ORIGINS` in production
3. **Rate Limiting:** Implemented in middleware
4. **Redis Security:** Use password authentication in production
5. **SSL/TLS:** Always use WSS (WebSocket Secure) in production

## 📚 Additional Resources

- [Django Channels Documentation](https://channels.readthedocs.io/)
- [Celery Documentation](https://docs.celeryproject.org/)
- [Redis Documentation](https://redis.io/documentation)
- [Daphne Documentation](https://github.com/django/daphne)

## 🆘 Support

If you encounter issues:
1. Check logs in `/var/log/academy/`
2. Review Redis logs: `redis-cli MONITOR`
3. Check Celery worker logs
4. Enable DEBUG mode temporarily to see detailed errors

## 🎉 Success!

Your real-time features should now be working! Test by:
1. Enrolling in a course
2. Marking lessons complete
3. Watching progress update in real-time
4. Checking email notifications
