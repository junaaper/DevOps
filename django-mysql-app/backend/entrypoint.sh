#!/bin/bash
echo "Waiting for MySQL..."
sleep 10

echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

echo "Starting server..."
python manage.py runserver 0.0.0.0:9000