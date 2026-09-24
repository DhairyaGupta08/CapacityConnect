#!/usr/bin/env bash
set -e

echo "Running database migrations..."
alembic upgrade head || echo "Migrations skipped or already at head"

echo "Starting Gunicorn with Uvicorn worker..."
exec gunicorn app.main:app -k uvicorn.workers.UvicornWorker -w 2 --bind 0.0.0.0:${PORT:-8000} --timeout 60
