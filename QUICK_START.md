# ⚡ Quick Start Guide - Real-Time Features

## 🚀 Get Started in 5 Minutes

### Step 1: Install Redis

**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

**Verify Redis is running:**
```bash
redis-cli ping
# Should return: PONG
```

### Step 2: Install Dependencies

```bash
# Activate virtual environment
source .venv/bin/activate  # macOS/Linux
# or
.venv\Scripts\activate  # Windows

# Install packages
pip install -r requirements.txt
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.realtime.example .env

# Edit .env and set at minimum:
# DJANGO_SECRET_KEY=your-secret-key-here
# REDIS_URL=redis://localhost:6379/0
```

### Step 4: Run Migrations

```bash
python manage.py migrate
python manage.py createsuperuser
```

### Step 5: Start Services

**Option A: Use the startup script (macOS/Linux)**
```bash
chmod +x start_realtime.sh
./start_realtime.sh
```

**Option B: Manual start (3 terminals)**

Terminal 1 - Django/Daphne:
```bash
daphne -b 0.0.0.0 -p 8000 academy.asgi:application
```

Terminal 2 - Celery Worker:
```bash
celery -A academy worker --loglevel=info
```

Terminal 3 - Celery Beat (optional):
```bash
celery -A academy beat --loglevel=info
```

### Step 6: Access the Application

- **Main Site:** http://localhost:8000
- **Admin Panel:** http://localhost:8000/admin
- **API:** http://localhost:8000/api/

## 🧪 Test Real-Time Features

### 1. Test WebSocket Connection

Open browser console (F12) and run:

```javascript
// Connect to notifications
const ws = new WebSocket('ws://localhost:8000/ws/notifications/');

ws.onopen = () => console.log('✅ Connected!');
ws.onmessage = (e) => console.log('📨 Message:', JSON.parse(e.data));
ws.onerror = (e) => console.error('❌ Error:', e);
```

### 2. Test Background Tasks

```bash
# Open Django shell
python manage.py shell

# Test email task
from academy_learning.tasks import send_enrollment_email
result = send_enrollment_email.delay(1, 1)
print(result.get())
```

### 3. Test Redis Cache

```bash
# Open Django shell
python manage.py shell

from django.core.cache import cache

# Set value
cache.set('test', 'Hello Redis!', timeout=60)

# Get value
print(cache.get('test'))  # Should print: Hello Redis!
```

## 🎯 Common Commands

### Development

```bash
# Run development server (without WebSocket)
python manage.py runserver

# Run with WebSocket support
daphne academy.asgi:application

# Run Celery worker (development mode)
celery -A academy worker --loglevel=info --pool=solo

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

### Monitoring

```bash
# Check Redis
redis-cli ping
redis-cli INFO
redis-cli KEYS '*'

# Check Celery tasks
celery -A academy inspect active
celery -A academy inspect registered
celery -A academy inspect stats

# Check database
python manage.py dbshell
```

### Debugging

```bash
# Django shell
python manage.py shell

# Django shell with IPython
python manage.py shell_plus

# Show URLs
python manage.py show_urls

# Check deployment
python manage.py check --deploy
```

## 🔧 Troubleshooting

### Redis Connection Error

```bash
# Check if Redis is running
redis-cli ping

# If not running, start it
brew services start redis  # macOS
sudo systemctl start redis  # Linux
```

### WebSocket Connection Failed

1. Make sure Daphne is running (not runserver)
2. Check browser console for errors
3. Verify ALLOWED_HOSTS in settings
4. Check if Redis is running

### Celery Tasks Not Running

1. Check if Celery worker is running
2. Verify Redis connection
3. Check Celery logs for errors
4. Ensure CELERY_BROKER_URL is correct

### Import Errors

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete
```

## 📚 Next Steps

1. **Read Full Documentation:**
   - `REALTIME_SETUP.md` - Detailed setup guide
   - `IMPROVEMENTS_SUMMARY.md` - What was improved
   - `CRITICAL_ANALYSIS.md` - Issues found and fixed

2. **Customize Your Setup:**
   - Configure email settings in `.env`
   - Set up Sentry for error monitoring
   - Configure S3 for media storage

3. **Deploy to Production:**
   - See `DEPLOYMENT.md` for deployment guide
   - Use Supervisor for process management
   - Set up Nginx for reverse proxy
   - Enable SSL/TLS

## 🎉 You're Ready!

Your real-time learning platform is now running with:
- ✅ WebSocket support for live updates
- ✅ Background task processing
- ✅ Redis caching for performance
- ✅ Error monitoring
- ✅ Modern architecture

Start building amazing learning experiences! 🚀

## 💡 Pro Tips

1. **Use Redis Commander for GUI:**
   ```bash
   npm install -g redis-commander
   redis-commander
   # Open http://localhost:8081
   ```

2. **Use Flower for Celery monitoring:**
   ```bash
   pip install flower
   celery -A academy flower
   # Open http://localhost:5555
   ```

3. **Enable Debug Toolbar (development only):**
   - Already enabled when DEBUG=True
   - Access at http://localhost:8000 (look for sidebar)

4. **Use Django Extensions:**
   ```bash
   # Better shell
   python manage.py shell_plus
   
   # Show all URLs
   python manage.py show_urls
   
   # Generate ER diagram
   python manage.py graph_models -a -o models.png
   ```

## 🆘 Need Help?

- Check logs in terminal windows
- Review `REALTIME_SETUP.md` for detailed info
- Check `CRITICAL_ANALYSIS.md` for common issues
- Enable DEBUG=True for detailed errors (dev only!)

Happy coding! 🎓
