#!/bin/bash

echo "🧹 Cleaning up old processes..."
lsof -ti :3000 2>/dev/null | xargs kill -9 2>/dev/null
sleep 2

echo "🗑️  Clearing build cache..."
cd /Users/ram/Desktop/Veeru_New
rm -rf .next

echo "🚀 Starting dev server..."
npm run dev &
SERVER_PID=$!

echo "⏳ Waiting for server to start..."
sleep 8

echo ""
echo "✅ Server should be running at: http://localhost:3000"
echo "   Process ID: $SERVER_PID"
echo ""
echo "🔥 IMPORTANT: You MUST clear your browser cache!"
echo ""
echo "   Option 1: Use Incognito Mode"
echo "   - Press Cmd+Shift+N (Chrome) or Cmd+Shift+P (Firefox/Safari)"
echo "   - Go to http://localhost:3000"
echo ""
echo "   Option 2: Hard Refresh"
echo "   - Press and HOLD Cmd+Shift+R for 2-3 seconds"
echo ""
echo "   Option 3: Clear Cache"
echo "   - Chrome: Cmd+Shift+Delete → Clear cached images and files"
echo "   - Safari: Develop → Empty Caches (Cmd+Option+E)"
echo ""
echo "To stop the server, run: kill $SERVER_PID"
