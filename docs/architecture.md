# System Architecture

## Architecture Diagram

```mermaid
graph TD
  subgraph Browser
    PWA[Next.js PWA - Trainee / Trainer / Admin UIs]
  end
  subgraph Vercel
    NX[Next.js App Router<br/>SSR shell + rewrites /api/* -> Render]
  end
  subgraph Render
    API[FastAPI Modular Monolith<br/>routers -> services -> repositories]
  end
  DB[(PostgreSQL)]
  OBJ[(Object Storage<br/>R2 / S3-compatible)]

  PWA --> NX
  NX -->|HTTPS REST proxy| API
  API --> DB
  API -->|presign / delete| OBJ
  PWA -->|PUT presigned URL: files| OBJ
  PWA -->|GET signed URL: view/download| OBJ
```

## Backend Layering
```
HTTP router (thin) -> service (business rules, transactions) -> models (SQLAlchemy)
                    -> schemas (Pydantic in/out) -> dependencies (auth, RBAC, DB session, pagination)
```

## State Machines
- **User.status:** `pending` -> `active` | `rejected` ; `active` -> `suspended` -> `active`
- **Course.status:** `draft` -> `pending_review` (optional) -> `published` -> `archived`
- **Enrollment.status:** `enrolled` -> `in_progress` -> `completed` | `dropped`
- **Attempt.status:** `in_progress` -> `submitted` (auto-submit at deadline/time limit)
- **Certificate.status:** `issued` -> `revoked`
