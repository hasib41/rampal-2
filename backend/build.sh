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

echo "==> Build completed successfully!"
