#!/bin/bash
set -euo pipefail

PORT=${PORT:-3000}

echo "Killing anything on port $PORT..."
lsof -ti :$PORT 2>/dev/null | xargs kill -9 2>/dev/null || true

echo "Building app..."
npm run build >/dev/null

echo "Starting server..."
PORT=$PORT npm run start &
PID=$!

echo "Waiting for server ($PID) to be ready..."
for i in {1..15}; do
  sleep 1
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT | grep -q "200"; then
    echo "Server is up on port $PORT (PID $PID)"
    exit 0
  fi
done

echo "Server failed to respond on port $PORT" >&2
kill $PID 2>/dev/null || true
exit 1
