# API Contract & Conventions

## Conventions
- Base path: `/api`
- Content-Type: `application/json`
- Authentication: `Authorization: Bearer <access_token>`
- Primary Keys: UUIDv4 formatted strings
- Server-side pagination query params: `?page=1&page_size=20&q=&sort=`

### Error Response Envelope
```json
{
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human readable error description",
    "details": {}
  }
}
```

### Paginated List Envelope
```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "page_size": 20
}
```

## System Endpoints (Phase 1)

### `GET /api/health`
- **Auth:** Public
- **Description:** Uptime and health check for Render & monitoring services.
- **Response `200 OK`:**
```json
{
  "status": "ok",
  "app": "Capacity Connect",
  "version": "0.1.0",
  "database": "ok"
}
```
If DB is uninitialized / disconnected:
```json
{
  "status": "degraded",
  "app": "Capacity Connect",
  "version": "0.1.0",
  "database": "disconnected"
}
```
