#!/usr/bin/env sh
set -e

# Apply database migrations
python manage.py migrate --noinput

# Collect static files (idempotent)
python manage.py collectstatic --noinput

# Create superuser if vars are provided
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
username = "$DJANGO_SUPERUSER_USERNAME"
email = "$DJANGO_SUPERUSER_EMAIL"
password = "$DJANGO_SUPERUSER_PASSWORD"

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"Superuser '{username}' created successfully")
else:
    user = User.objects.get(username=username)
    user.set_password(password)
    user.is_superuser = True
    user.is_staff = True
    user.email = email
    user.save()
    print(f"Superuser '{username}' password updated")
EOF
fi

# Also create the backup admin user
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()

if not User.objects.filter(username='Adminveeru').exists():
    User.objects.create_superuser(username='Adminveeru', email='admin@veeruproacademy.com', password='Admin@12345')
    print("Backup admin user 'Adminveeru' created successfully")
else:
    user = User.objects.get(username='Adminveeru')
    user.set_password('Admin@12345')
    user.is_superuser = True
    user.is_staff = True
    user.save()
    print("Backup admin user 'Adminveeru' password updated")
EOF

# Start Daphne ASGI server
exec daphne -b 0.0.0.0 -p 8000 academy.asgi:application
