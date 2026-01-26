# 🔄 Real-Time Course Sync Setup

## Overview

This guide enables **TRUE real-time synchronization** - admin CRUD operations instantly appear on all connected user browsers **without page refresh**.

## Current Status

### ✅ What Already Works (Without Real-Time)
- Admin adds course → Saves to database ✅
- User refreshes page → New course appears ✅
- API returns fresh data from database ✅

### 🚀 What Real-Time Adds
- Admin adds course → **All users see it instantly** (no refresh) ✅
- Admin updates course → **Live update on all browsers** ✅
- Admin deletes course → **Removed from all browsers immediately** ✅

---

## Implementation Steps

### Step 1: Enable Real-Time Signals

Add this to `academy_courses/apps.py`:

```python
class AcademyCoursesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'academy_courses'

    def ready(self):
        # Import signals for real-time updates
        import academy_courses.signals_realtime  # Enable real-time course sync
```

### Step 2: Add Frontend WebSocket Client

Add this JavaScript to `templates/academy_web/base.html` (before closing `</body>` tag):

```javascript
<script>
// Real-time course updates via WebSocket
(function() {
    // Determine WebSocket protocol based on page protocol
    const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${wsScheme}://${window.location.host}/ws/courses/`;
    
    let courseSocket = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000; // 3 seconds
    
    function connectCourseWebSocket() {
        try {
            courseSocket = new WebSocket(wsUrl);
            
            courseSocket.onopen = function(e) {
                console.log('✅ Real-time course sync connected');
                reconnectAttempts = 0; // Reset on successful connection
            };
            
            courseSocket.onmessage = function(e) {
                const data = JSON.parse(e.data);
                console.log('📢 Course update received:', data.type);
                
                switch(data.type) {
                    case 'course_created':
                        handleCourseCreated(data.course);
                        break;
                    case 'course_updated':
                        handleCourseUpdated(data.course);
                        break;
                    case 'course_deleted':
                        handleCourseDeleted(data.course);
                        break;
                }
            };
            
            courseSocket.onerror = function(e) {
                console.error('❌ WebSocket error:', e);
            };
            
            courseSocket.onclose = function(e) {
                console.warn('⚠️ WebSocket closed. Attempting reconnect...');
                
                // Attempt to reconnect with exponential backoff
                if (reconnectAttempts < maxReconnectAttempts) {
                    reconnectAttempts++;
                    const delay = reconnectDelay * Math.pow(2, reconnectAttempts - 1);
                    console.log(`Reconnecting in ${delay/1000}s... (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
                    setTimeout(connectCourseWebSocket, delay);
                } else {
                    console.error('Max reconnection attempts reached. Please refresh page.');
                }
            };
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
        }
    }
    
    function handleCourseCreated(course) {
        console.log('➕ New course added:', course.title);
        // Show notification
        showNotification(`New course available: ${course.title}`, 'success');
        // Reload courses in navbar dropdown
        if (typeof loadCoursesDropdown === 'function') {
            loadCoursesDropdown();
        }
        // Reload courses in sticky bar
        if (typeof loadCoursesBar === 'function') {
            loadCoursesBar();
        }
    }
    
    function handleCourseUpdated(course) {
        console.log('✏️ Course updated:', course.title);
        showNotification(`Course updated: ${course.title}`, 'info');
        // Reload courses to reflect changes
        if (typeof loadCoursesDropdown === 'function') {
            loadCoursesDropdown();
        }
        if (typeof loadCoursesBar === 'function') {
            loadCoursesBar();
        }
    }
    
    function handleCourseDeleted(course) {
        console.log('🗑️ Course deleted:', course.slug);
        showNotification(`Course removed: ${course.slug}`, 'warning');
        // Reload courses to remove deleted one
        if (typeof loadCoursesDropdown === 'function') {
            loadCoursesDropdown();
        }
        if (typeof loadCoursesBar === 'function') {
            loadCoursesBar();
        }
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-fade-in ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-white' :
            type === 'info' ? 'bg-blue-500 text-white' :
            'bg-gray-500 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas ${
                    type === 'success' ? 'fa-check-circle' :
                    type === 'warning' ? 'fa-exclamation-triangle' :
                    'fa-info-circle'
                }"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.transition = 'opacity 0.5s';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
    
    // Connect when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', connectCourseWebSocket);
    } else {
        connectCourseWebSocket();
    }
    
    // Clean up on page unload
    window.addEventListener('beforeunload', function() {
        if (courseSocket && courseSocket.readyState === WebSocket.OPEN) {
            courseSocket.close();
        }
    });
})();
</script>
```

### Step 3: Configure Redis (Required for WebSocket Broadcasting)

Update `academy/settings.py`:

```python
# Channel Layers - Required for WebSocket broadcasting
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [os.environ.get('REDIS_URL', 'redis://localhost:6379')],
        },
    },
}
```

### Step 4: Deploy to Production

1. **Add Redis to Render**:
   - Go to Render Dashboard
   - Click "New +" → "Redis"
   - Name: `veeruspro-redis`
   - Plan: Free (25MB, good for WebSocket)
   - Click "Create Redis"
   - Copy the **Internal Redis URL**

2. **Add Environment Variable**:
   - Go to your Web Service on Render
   - Click "Environment"
   - Add: `REDIS_URL` = `[paste Internal Redis URL]`
   - Click "Save Changes"

3. **Verify Dependencies** (should already be in `requirements.txt`):
   ```
   channels==4.0.0
   channels-redis==4.1.0
   daphne==4.0.0
   ```

4. **Push Changes**:
   ```bash
   git add .
   git commit -m "feat: add real-time course sync via WebSocket"
   git push origin main
   ```

---

## Testing Real-Time Sync

### Local Testing (Development)

1. **Install Redis** (if not already):
   ```bash
   brew install redis
   redis-server
   ```

2. **Run Django with Daphne** (supports WebSocket):
   ```bash
   daphne -b 0.0.0.0 -p 8000 academy.asgi:application
   ```

3. **Test the sync**:
   - Open browser: `http://localhost:8000`
   - Open second browser tab (same URL)
   - Go to admin: `http://localhost:8000/admin/academy_courses/course/`
   - **Add a new course** → Both tabs show notification + new course appears!
   - **Edit a course** → Both tabs update instantly!
   - **Delete a course** → Both tabs remove it immediately!

### Production Testing

1. **Open your production site** in 2 browser windows
2. **Open admin** in a third window
3. **Add/edit/delete courses** in admin
4. **Watch both browser windows** update in real-time! 🎉

---

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Real-Time Architecture                    │
└─────────────────────────────────────────────────────────────┘

   Admin Panel                 Django + Redis              User Browsers
   ┌───────────┐              ┌─────────────┐              ┌──────────┐
   │           │              │             │              │ Browser 1│
   │ Create    │─────────────▶│ Signal      │─────────────▶│ Updates  │
   │ Course    │              │ Triggered   │              │ Instantly│
   │           │              │             │              └──────────┘
   └───────────┘              │    ↓        │              ┌──────────┐
                              │             │              │ Browser 2│
                              │ Broadcast   │─────────────▶│ Updates  │
                              │ to Redis    │              │ Instantly│
                              │             │              └──────────┘
                              │    ↓        │              ┌──────────┐
                              │             │              │ Browser 3│
                              │ WebSocket   │─────────────▶│ Updates  │
                              │ Push        │              │ Instantly│
                              └─────────────┘              └──────────┘

   1. Admin saves course → Django signal fires
   2. Signal → Broadcast to Redis channel
   3. Redis → Push to all connected WebSocket clients
   4. WebSocket → JavaScript updates navbar/courses
   5. Users see changes instantly (no page refresh!)
```

---

## Comparison

### ❌ Without Real-Time (Current)
```
Admin adds course → Database saved → User must REFRESH PAGE → New course appears
```

### ✅ With Real-Time (After Setup)
```
Admin adds course → Database saved → INSTANT UPDATE on all browsers → No refresh needed!
```

---

## Troubleshooting

### WebSocket Connection Fails

**Check browser console**:
```javascript
// Should see:
✅ Real-time course sync connected
```

**If you see errors**:
- Verify Redis is running: `redis-cli ping` (should return `PONG`)
- Check `REDIS_URL` environment variable is set correctly
- Verify Daphne is running (not just `runserver`)

### Updates Not Appearing

**Check Django logs**:
```bash
# Should see when course is saved:
Broadcasting course update: course_created
```

**If not broadcasting**:
- Verify signals are imported in `apps.py` `ready()` method
- Check course status is `PUBLISHED` (draft courses don't broadcast)

### Connection Keeps Dropping

- Free Redis plans have connection limits
- Upgrade Redis plan if needed
- Check firewall/security group settings

---

## Benefits of Real-Time Sync

✅ **Better UX**: Users see new courses instantly  
✅ **Admin Confidence**: See changes reflected immediately  
✅ **Modern Feel**: No more "refresh to see updates"  
✅ **Scalable**: Redis handles thousands of connections  
✅ **Reliable**: Auto-reconnect on connection loss  

---

## Cost Considerations

- **Redis Free Tier**: 25MB, perfect for course updates
- **No additional cost** if already on Render
- **Upgrade only if** >1000 concurrent WebSocket connections

---

## Next Steps

1. ✅ Read this guide
2. ⬜ Add signals import to `apps.py`
3. ⬜ Add WebSocket JavaScript to `base.html`
4. ⬜ Create Redis instance on Render
5. ⬜ Set `REDIS_URL` environment variable
6. ⬜ Push changes to production
7. ⬜ Test with 2 browser windows!

---

**Questions?** Open an issue or check Django Channels docs: https://channels.readthedocs.io/
