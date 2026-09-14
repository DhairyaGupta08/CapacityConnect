# Capacity Connect

> **Digital Capacity Building and Learning Management Portal** (SIH26075)

Capacity Connect is a modular monolith platform designed for government and institutional capacity building. It connects trainees, trainers, and administrators with role-based learning workflows, deterministic competency matching, timed MCQ assessments, and automated certificate issuance with public verification.

---

## Architecture Stack

- **Frontend:** Next.js (App Router), React 19, TypeScript, Tailwind CSS, TanStack Query, Radix UI (Deployed to Vercel)
- **Backend:** FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic, Argon2id, PyJWT, ReportLab (Deployed to Render)
- **Database:** PostgreSQL 16 (Neon / Supabase / Render Postgres)
- **Storage:** S3-compatible Object Storage (Cloudflare R2 / AWS S3) with local driver for development

---

## Repository Structure

```
capacity-connect/
├── README.md
├── docker-compose.yml            # Local PostgreSQL 16
├── .github/workflows/ci.yml      # CI workflow for linting & tests
├── docs/                         # Architecture, API contract, and planning docs
├── backend/                      # FastAPI backend application
│   ├── app/
│   │   ├── core/                 # Config, security, errors, logging
│   │   ├── db/                   # Base models, session, migrations
│   │   ├── api/                  # Routers and dependencies
│   │   └── services/             # Business logic
│   ├── alembic/                  # Database migrations
│   ├── tests/                    # Pytest test suite
│   └── requirements.txt
└── frontend/                     # Next.js frontend application
    ├── src/
    │   ├── app/                  # App Router pages and layouts
    │   ├── components/           # UI and domain components
    │   ├── lib/                  # API client, query client, utils
    │   └── types/                # TypeScript DTO definitions
    └── package.json
```

---

## Getting Started Locally

### Prerequisites
- Python 3.12+
- Node.js 20+ & npm
- Docker (optional, for local Postgres)

### Quick Start (Windows)
Double-click or run the included starter script:
```cmd
start.bat
```
This automatically verifies dependencies and starts both the FastAPI backend (`http://127.0.0.1:8000`) and Next.js frontend (`http://localhost:3000`) in dedicated windows.

### Manual Setup
### 1. Start the Database (Docker)
```bash
docker compose up -d
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate | Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt
cp .env.example .env

# Run tests
pytest

# Start the server
uvicorn app.main:app --reload --port 8000
```
Backend API docs available at: `http://localhost:8000/api/docs` and Health at `http://localhost:8000/api/health`.

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local

# Run tests
npm run test:run

# Start the development server
npm run dev
```
Frontend available at: `http://localhost:3000`. Next.js automatically rewrites `/api/*` requests to `http://localhost:8000/api/*`.

---

## Documentation
- [Implementation Plan](docs/CAPACITY_CONNECT_IMPLEMENTATION_PLAN.md)
- [Architecture Details](docs/architecture.md)
- [API Specification & Contract](docs/api-contract.md)
- [Competency Matching Formula](docs/competency-matching.md)
- [Deployment Guide](docs/deployment.md)
- [Demo Script](docs/demo-script.md)
