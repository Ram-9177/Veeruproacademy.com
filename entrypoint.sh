#!/usr/bin/env sh
set -e

# Apply database migrations
python manage.py migrate --noinput

# Collect static files (idempotent)
python manage.py collectstatic --noinput

# Optionally create a superuser if vars are provided
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
	python manage.py createsuperuser \
		--noinput \
		--username "$DJANGO_SUPERUSER_USERNAME" \
		--email "$DJANGO_SUPERUSER_EMAIL" || true
fi

# Start Daphne ASGI server
exec daphne -b 0.0.0.0 -p 8000 academy.asgi:application
