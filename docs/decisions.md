# Architecture Decision Records (ADR)

## ADR 001: Monolithic Repository with Next.js and FastAPI
- **Context:** Fast development cycle, strictly separated frontend and backend responsibilities, simple CI/CD.
- **Decision:** Use a single monorepo with `frontend/` (Next.js App Router) and `backend/` (FastAPI + SQLAlchemy 2.0).
- **Consequences:** Easy coordination, independent builds and deployments on Vercel and Render.

## ADR 002: Same-Origin API Proxy via Next.js Rewrites
- **Context:** Cross-site cookie restrictions and CORS issues can cause authentication friction in production.
- **Decision:** Frontend rewrites `/api/:path*` directly to the backend Render URL.
- **Consequences:** `httpOnly` refresh tokens can use `SameSite=Lax`, avoiding third-party cookie blocking.

## ADR 003: Deterministic Explainable Competency Matching
- **Context:** Government and institutional capacity building requires auditable trainer recommendations.
- **Decision:** Implement a deterministic weighted formula with five normalized components and an explanation payload instead of a black-box AI model.
- **Consequences:** Fully explainable, zero external AI dependencies, instant execution and reproducibility.
