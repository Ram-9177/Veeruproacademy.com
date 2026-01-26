#!/usr/bin/env sh
set -e

echo "Entrypoint: Running migrations..."
python manage.py migrate --noinput

echo "Entrypoint: Collecting static files..."
python manage.py collectstatic --noinput

echo "Entrypoint: Creating admin users..."
python manage.py shell << 'PYEOF'
from django.contrib.auth import get_user_model
import os

User = get_user_model()

# Create primary admin user from environment variables
admin_email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@veeruproacademy.com')
admin_password = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'Veeru@12345')
admin_name = os.getenv('DJANGO_SUPERUSER_NAME', 'Admin')

if not User.objects.filter(email=admin_email).exists():
    User.objects.create_superuser(
        email=admin_email,
        password=admin_password,
        name=admin_name
    )
    print(f"✓ Primary admin created: {admin_email}")
else:
    # Update existing admin with current password
    admin_user = User.objects.get(email=admin_email)
    admin_user.set_password(admin_password)
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.save()
    print(f"✓ Primary admin updated: {admin_email}")

# Create backup admin user
backup_email = 'adminveeru@veeruproacademy.com'
backup_password = 'Admin@12345'

if not User.objects.filter(email=backup_email).exists():
    User.objects.create_superuser(
        email=backup_email,
        password=backup_password,
        name='Adminveeru'
    )
    print(f"✓ Backup admin created: {backup_email}")
else:
    # Update existing backup admin with current password
    backup_user = User.objects.get(email=backup_email)
    backup_user.set_password(backup_password)
    backup_user.is_staff = True
    backup_user.is_superuser = True
    backup_user.save()
    print(f"✓ Backup admin updated: {backup_email}")

# List all admins
all_admins = User.objects.filter(is_staff=True)
print(f"\n✓ Total admin accounts: {all_admins.count()}")
for admin in all_admins:
    print(f"  - Email: {admin.email} (Name: {admin.name})")
PYEOF

echo "Entrypoint: Starting Daphne..."
exec daphne -b 0.0.0.0 -p 8000 academy.asgi:application
