#!/usr/bin/env sh
set -e

echo "Entrypoint: Running migrations..."
python manage.py migrate --noinput

echo "Entrypoint: Collecting static files..."
python manage.py collectstatic --noinput

echo "Entrypoint: Starting Daphne..."
exec daphne -b 0.0.0.0 -p 8000 academy.asgi:application
