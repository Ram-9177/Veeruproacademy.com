#!/usr/bin/env sh
set -e

# Apply database migrations
python manage.py migrate --noinput

# Collect static files (idempotent)
python manage.py collectstatic --noinput

# Start Daphne ASGI server
exec daphne -b 0.0.0.0 -p 8000 academy.asgi:application
