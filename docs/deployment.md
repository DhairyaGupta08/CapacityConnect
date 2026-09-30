# Deployment Runbook

## Architecture Overview
- **Frontend:** Next.js deployed on Vercel
- **Backend:** FastAPI deployed on Render (Web Service)
- **Database:** PostgreSQL (Neon / Supabase / Render Postgres)
- **Storage:** Cloudflare R2 / AWS S3 (S3-compatible)

## Environment Variables

### Backend (Render)
- `ENVIRONMENT=production`
- `DATABASE_URL=postgresql+psycopg://user:password@host/dbname?sslmode=require`
- `JWT_SECRET=<openssl rand -hex 32>`
- `CORS_ORIGINS=https://<your-project>.vercel.app`
- `STORAGE_BACKEND=s3`
- `S3_ENDPOINT_URL=https://<account>.r2.cloudflarestorage.com`
- `S3_BUCKET=capacity-connect`
- `S3_ACCESS_KEY_ID=...`
- `S3_SECRET_ACCESS_KEY=...`

### Frontend (Vercel)
- `BACKEND_URL=https://<your-service>.onrender.com`
- `NEXT_PUBLIC_APP_NAME=Capacity Connect`
- `NEXT_PUBLIC_ORG_NAME=Capacity Connect Demo`

## Render Setup
1. **Root Directory:** `backend`
2. **Build Command:** `pip install --upgrade pip && pip install -r requirements.txt`
3. **Start Command:** `alembic upgrade head && gunicorn app.main:app -k uvicorn.workers.UvicornWorker -w 2 --bind 0.0.0.0:$PORT --timeout 60`
4. **Health Check Path:** `/api/health`
