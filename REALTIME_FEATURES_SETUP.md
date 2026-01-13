# 🔴 Real-Time Features Setup Guide for veeruproacademy.com

## Overview

This guide explains how to set up and use the real-time features on your live production site at **veeruproacademy.com**.

---

## 🎯 What Real-Time Features Are Available

Your platform includes several real-time features:

### 1. **Real-Time Monitoring Dashboard** (`/admin/realtime`)
- Live user activity tracking
- Real-time statistics updates
- Active users monitoring
- Course enrollments in real-time
- Lesson completion tracking
- Auto-refresh every 5 seconds

### 2. **Real-Time Updates Component**
- Live notifications for admins
- Content change broadcasting
- Server-sent events (SSE) support
- Automatic reconnection on disconnect

### 3. **Real-Time Status Indicator**
- Shows connection status
- Displays active connections
- Updates automatically

---

## 🚀 Quick Setup for Production

### Step 1: Enable Real-Time Features

Add this environment variable to your Vercel deployment:

```bash
NEXT_PUBLIC_ENABLE_REALTIME=true
```

**How to add in Vercel:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `Veeru-s_Pro_Academy`
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - Name: `NEXT_PUBLIC_ENABLE_REALTIME`
   - Value: `true`
   - Environment: Production, Preview, Development (select all)
5. Click **Save**
6. Redeploy your application

### Step 2: (Optional) Enhanced Real-Time with Supabase

For more robust real-time features with database change notifications:

**Add Supabase Environment Variables:**

```bash
# Supabase Configuration (Optional but recommended for production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_MONITORED_TABLES=lessons,courses,projects
```

**To get Supabase credentials:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use existing one
3. Go to **Settings** → **API**
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon/Public Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Verify Real-Time Features

After deployment, test these URLs:

1. **Real-Time Monitoring Dashboard:**
   ```
   https://www.veeruproacademy.com/admin/realtime
   ```
   - Login as admin
   - Should see live statistics
   - Stats refresh every 5 seconds

2. **Real-Time API Endpoint:**
   ```
   https://www.veeruproacademy.com/api/admin/realtime-monitoring
   ```
   - Returns JSON with current stats
   - Should respond quickly

3. **Real-Time Events Stream:**
   ```
   https://www.veeruproacademy.com/api/realtime/updates
   ```
   - Server-sent events endpoint
   - Keeps connection alive
   - Broadcasts updates in real-time

---

## 📊 How Real-Time Features Work

### Architecture

```
┌─────────────────┐
│  User Actions   │
│  (Enrollment,   │
│   Completion)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Routes     │
│  (Broadcast     │
│   Updates)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌─────────────────┐
│  Real-Time      │◄─────┤  SSE Stream     │
│  Broadcast      │      │  /api/realtime/ │
│  System         │      │  updates        │
└────────┬────────┘      └─────────────────┘
         │
         ▼
┌─────────────────┐
│  Connected      │
│  Clients        │
│  (Admin Panel)  │
└─────────────────┘
```

### Event Types Supported

1. **UPDATE** - Content updated
2. **CREATE** - New content created
3. **DELETE** - Content deleted
4. **NOTIFICATION** - System notifications
5. **SYNC** - Data synchronization events

---

## 🎮 Using Real-Time Features

### For Admins

#### 1. Access Real-Time Dashboard

**URL:** `https://www.veeruproacademy.com/admin/realtime`

**What you'll see:**
- Total users count (updates live)
- Active users currently online
- Total courses available
- Total projects
- Recent activities feed
- Live activity indicator (green pulse)

**Features:**
- Auto-refresh every 5 seconds
- Last update timestamp
- Activity feed with timestamps
- User actions (login, enrollment, completion)

#### 2. Monitor from Admin Hub

**URL:** `https://www.veeruproacademy.com/admin/hub`

Look for the **Real-Time Status** component in the top right:
- Shows connection status
- Displays number of active connections
- Green indicator when connected

#### 3. Quick Action Link

From any admin page, click:
- **"Realtime Monitor"** quick action
- Located in Admin Hub dashboard

### For Developers

#### Using the Real-Time API

**Endpoint:** `GET /api/admin/realtime-monitoring`

**Response:**
```json
{
  "totalUsers": 150,
  "activeUsers": 12,
  "totalCourses": 8,
  "totalProjects": 25,
  "recentActivities": [
    {
      "id": "evt_123",
      "channel": "user_activity",
      "type": "user_login",
      "entity": "user",
      "payload": {
        "userName": "John Doe",
        "userId": "user_456"
      },
      "createdAt": "2026-01-12T13:15:00Z"
    }
  ]
}
```

#### Subscribe to Real-Time Events

```javascript
// Client-side code example
const eventSource = new EventSource('/api/realtime/updates');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Real-time update:', data);
  
  // Handle different event types
  switch(data.type) {
    case 'CREATE':
      console.log('New content created:', data.data);
      break;
    case 'UPDATE':
      console.log('Content updated:', data.data);
      break;
    case 'DELETE':
      console.log('Content deleted:', data.data);
      break;
  }
};

eventSource.onerror = (error) => {
  console.error('Connection error:', error);
  // Automatically reconnects
};
```

---

## 🔧 Configuration Options

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_ENABLE_REALTIME` | No | `false` | Enable/disable real-time features |
| `NEXT_PUBLIC_SUPABASE_URL` | No | - | Supabase project URL for enhanced real-time |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | - | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | No | - | Supabase service role key (server-side) |
| `SUPABASE_MONITORED_TABLES` | No | `lessons,courses,projects` | Tables to monitor for changes |

### Feature Flags

Real-time features can be toggled without code changes:

1. **Enable for testing:**
   ```bash
   NEXT_PUBLIC_ENABLE_REALTIME=true
   ```

2. **Disable if not needed:**
   ```bash
   NEXT_PUBLIC_ENABLE_REALTIME=false
   ```

---

## 🎨 Real-Time Components

### 1. RealtimeStatus Component

**Location:** Used in Admin Hub header

**Features:**
- Connection status indicator
- Active connections count
- Auto-reconnect on disconnect
- Color-coded status (green/yellow/red)

### 2. RealtimeUpdates Component

**Usage:** Subscribe to live updates

```tsx
import { RealtimeUpdates } from '@/components/RealtimeUpdates'

function MyComponent() {
  return (
    <RealtimeUpdates 
      onUpdate={(event) => {
        console.log('Update received:', event)
      }}
    />
  )
}
```

### 3. RealtimeSandbox Component

**Location:** `/sandbox` page

**Features:**
- Live code editing
- Real-time preview
- Collaborative features (if enabled)

---

## 📈 Performance Considerations

### For Production (veeruproacademy.com)

1. **Connection Limits:**
   - Server-sent events work well for 100-1000 concurrent connections
   - For more scale, consider Redis pub/sub (noted in code)

2. **Auto-Cleanup:**
   - Dead connections automatically removed
   - No memory leaks
   - Efficient resource usage

3. **Refresh Intervals:**
   - Dashboard: 5 seconds (configurable)
   - SSE: Real-time (no polling)
   - Connection keepalive: 30 seconds

4. **Vercel Limitations:**
   - Serverless functions have 10s execution limit
   - SSE connections maintained via streaming
   - Consider upgrading plan for heavy real-time usage

---

## 🐛 Troubleshooting

### Real-Time Dashboard Not Updating

**Symptoms:**
- Dashboard shows stale data
- "Last updated" timestamp not changing

**Solutions:**
1. Check environment variable is set:
   ```bash
   NEXT_PUBLIC_ENABLE_REALTIME=true
   ```

2. Verify API endpoint works:
   ```bash
   curl https://www.veeruproacademy.com/api/admin/realtime-monitoring
   ```

3. Check browser console for errors

4. Clear browser cache and reload

### Connection Status Shows Disconnected

**Symptoms:**
- Red or yellow status indicator
- "Disconnected" message

**Solutions:**
1. Check internet connection
2. Verify Vercel deployment is healthy
3. Check for browser ad-blockers blocking SSE
4. Try different browser
5. Check Vercel function logs for errors

### No Recent Activities Showing

**Symptoms:**
- Activity feed is empty
- "No recent activities" message

**Solutions:**
1. This is normal if no users are active
2. Perform test actions:
   - Login as student
   - Enroll in a course
   - Complete a lesson
3. Wait 5 seconds for refresh
4. Check database has activity records

---

## 🔒 Security Considerations

### Access Control

Real-time features are secured:

1. **Admin-Only Access:**
   - `/admin/realtime` requires ADMIN role
   - Middleware enforces authentication
   - Unauthorized users redirected to login

2. **API Protection:**
   - All real-time APIs check authentication
   - Role verification on each request
   - No public access to sensitive data

3. **Data Filtering:**
   - Only relevant data exposed
   - Personal information redacted
   - Activity logs sanitized

---

## 📊 Monitoring Real-Time Health

### Check Real-Time System Status

**Dashboard Indicators:**
- ✅ Green dot = Connected and working
- ⚠️ Yellow dot = Connecting or slow
- ❌ Red dot = Disconnected or error

**Health Check:**
```bash
# Check if real-time endpoint responds
curl -I https://www.veeruproacademy.com/api/admin/realtime-monitoring

# Should return 200 OK
```

### View Active Connections

Login to admin panel and check:
- Real-Time Status component shows connection count
- Should show at least 1 (your connection)

---

## 🚀 Advanced Features

### Future Enhancements (Optional)

If you need more robust real-time features:

1. **Redis Pub/Sub Integration:**
   - For multi-instance deployments
   - Better scalability
   - Persistent message queue

2. **WebSocket Support:**
   - Bidirectional communication
   - Lower latency
   - Better for chat features

3. **Push Notifications:**
   - Browser notifications
   - Mobile app notifications
   - Email digests

4. **Analytics Integration:**
   - Track real-time metrics
   - User behavior analysis
   - Performance monitoring

---

## 📚 Related Documentation

- **Admin Guide:** `ADMIN_GUIDE.md`
- **Features Guide:** `COMPREHENSIVE_FEATURES_GUIDE.md`
- **Deployment Guide:** `VERCEL_DEPLOYMENT_GUIDE.md`
- **Troubleshooting:** `PRODUCTION_TROUBLESHOOTING.md`

---

## ✅ Quick Checklist for Production

Use this checklist to verify real-time features are working:

- [ ] Environment variable set: `NEXT_PUBLIC_ENABLE_REALTIME=true`
- [ ] Redeployed after adding environment variable
- [ ] Can access `/admin/realtime` as admin
- [ ] Dashboard shows current statistics
- [ ] Stats update every 5 seconds
- [ ] Real-time status indicator shows green
- [ ] API endpoint responds: `/api/admin/realtime-monitoring`
- [ ] Recent activities appear when users are active
- [ ] No console errors in browser
- [ ] Connection status remains stable

---

## 🎉 Summary

Your platform at **veeruproacademy.com** includes full real-time features:

✅ **Real-Time Monitoring Dashboard** - Live admin dashboard  
✅ **Auto-Refresh** - Updates every 5 seconds  
✅ **Activity Feed** - Recent user actions  
✅ **Connection Status** - Live connection indicator  
✅ **Server-Sent Events** - Real-time broadcasting  
✅ **Secure Access** - Admin-only, role-protected  

**To enable:** Just set `NEXT_PUBLIC_ENABLE_REALTIME=true` in Vercel!

---

**Last Updated:** January 12, 2026  
**Platform:** veeruproacademy.com  
**Status:** ✅ Production Ready
