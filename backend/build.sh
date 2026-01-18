#!/usr/bin/env bash
# Build script for Render deployment
# Exit immediately on error
set -o errexit

echo "==> Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "==> Collecting static files..."
python manage.py collectstatic --no-input --clear

echo "==> Running database migrations..."
python manage.py migrate --no-input

echo "==> Creating superuser..."
python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
username = '$DJANGO_SUPERUSER_USERNAME';
email = '$DJANGO_SUPERUSER_EMAIL';
password = '$DJANGO_SUPERUSER_PASSWORD';
if username and password:
    if not User.objects.filter(username=username).exists():
        print(f'Creating superuser {username}...');
        User.objects.create_superuser(username, email, password);
    else:
        print(f'Superuser {username} already exists.');
"

echo "==> Build completed successfully!"
