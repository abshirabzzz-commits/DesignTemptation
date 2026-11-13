#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

# Install production dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate --no-input

# Seed default content if not present
python manage.py seed_content

# Collect static files for WhiteNoise
python manage.py collectstatic --no-input
