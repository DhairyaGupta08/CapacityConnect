# Capacity Connect — Implementation Architecture & Execution Plan
**SIH26075 · Digital Capacity Building and Learning Management Portal**
**Stack:** Next.js + TypeScript + Tailwind (Vercel) · FastAPI + SQLAlchemy + Alembic (Render) · PostgreSQL · S3-compatible object storage

---

## 1. Executive Architecture Overview
Capacity Connect is a modular monolith: one Next.js web app (UI only), one FastAPI service (all business logic), one PostgreSQL database, one object-storage bucket. No microservices, no message brokers, no AI/ML dependency.

### Design Principles
- **Working end-to-end demo first:** MVP list in §17 is fixed; anything else is Phase 2.
- **Server is the source of truth:** Grading, progress, certificate issuance, RBAC all enforced in FastAPI; frontend only renders.
- **Explainable logic:** Competency matching is a deterministic weighted formula returning a per-criterion breakdown.
- **Cheap, deployable-throughout:** Every phase ends with a deployable build; free tiers are sufficient.
- **Government-portal look:** Sober palette, high-contrast, WCAG 2.1 AA, table/form-centric, minimal animation.

### Key Architectural Decisions
1. **Same-origin API via Next.js rewrites:** Browser calls `https://<app>.vercel.app/api/*`; Next rewrites to the Render URL. This removes CORS and third-party-cookie issues and lets refresh tokens live in `httpOnly` cookies.
2. **Direct-to-storage uploads with presigned URLs:** Large files go browser → object storage; FastAPI only issues presigned URLs and records metadata.
3. **Managed Postgres:** Neon, Supabase, or Render PostgreSQL.
4. **Storage abstraction:** `StorageService` interface with `LocalStorage` (dev) and `S3Storage` (prod).
5. **Certificates:** Database records + generated PDFs with public verification code.
6. **In-app notifications:** TanStack Query polling (`refetchInterval`).

---

## 2. Recommended Tech Stack

### Frontend (Deploy: Vercel)
- **Framework:** Next.js (App Router) + React 19 + TypeScript (strict)
- **Styling:** Tailwind CSS + Radix UI / custom accessible primitives
- **Server State:** TanStack Query
- **Forms/Validation:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** lucide-react
- **Tests:** Vitest + React Testing Library

### Backend (Deploy: Render Web Service)
- **Framework:** FastAPI, Pydantic v2, pydantic-settings
- **ORM / Migrations:** SQLAlchemy 2.x (typed, `Mapped[]`), Alembic
- **DB Driver:** `psycopg[binary]` (v3)
- **Password Hashing:** Argon2id (`argon2-cffi`)
- **JWT:** PyJWT
- **Rate Limiting:** `slowapi`
- **File Storage:** `boto3` (S3-compatible presigned URLs)
- **PDF Certificates:** `reportlab`
- **Server:** `gunicorn` with `uvicorn.workers.UvicornWorker`
- **Tests:** `pytest`, `httpx`, `ruff`

### Data & Infrastructure
- **Database:** PostgreSQL 15/16
- **Object Storage:** Cloudflare R2 / S3-compatible / Local storage for dev
- **CI:** GitHub Actions

---

## 3. Implementation Phases Summary
- **Phase 1: Project Setup** (Walking Skeleton, Health check, CI, initial deployment scaffolding)
- **Phase 2: Database & Models** (SQLAlchemy 2.0 models, Alembic migrations, base taxonomy seed)
- **Phase 3: Authentication** (Argon2, JWT, refresh rotation, RBAC, approval gating)
- **Phase 4: Trainee Module (Profile)** (Qualifications, experience, skills, interests, document upload)
- **Phase 5: Trainer Module (Profile)** (Expertise subjects, skills, qualifications, availability)
- **Phase 6: Admin Module (Governance)** (Approvals, user/role management, master data, settings, audit)
- **Phase 7: Courses & Learning Resources** (Course CRUD, modules, storage presigning, library, catalog, enroll, player, progress)
- **Phase 8: Assessments** (MCQ authoring, deadlines, timed attempts, server-side grading, results)
- **Phase 9: Certificates** (Completion rule evaluation, ReportLab PDF, public verification)
- **Phase 10: Competency Mapping** (Deterministic weighted formula, breakdown, explainability, coverage)
- **Phase 11: Notifications & Announcements** (Audience targeting, unread count polling, triggers)
- **Phase 12: Analytics** (Real aggregates, KPI cards, trend charts)
- **Phase 13: UI/UX Polish** (Accessibility, responsive 360px–desktop, PWA manifest, sober theme)
- **Phase 14: Testing** (E2E flows, RBAC matrix, security checks)
- **Phase 15: Deployment** (Render + Vercel setup, production rehearsal)
