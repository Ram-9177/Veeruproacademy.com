#!/usr/bin/env bash
# Build script for production deployment
# Used by Render, Railway, and other platforms

set -o errexit  # Exit on error

echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo "📊 Running database migrations..."
python manage.py migrate --noinput

echo "🎨 Collecting static files..."
python manage.py collectstatic --noinput

echo "✅ Build completed successfully!"
