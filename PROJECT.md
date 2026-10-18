# Project: naxoresuelve Platform Overhaul

## Architecture
- **Backend (`apps/api`)**: Python 3.12+, FastAPI modular monolith, asyncpg with pure parameterized SQL queries ($1, $2), Pydantic v2 validation, PBKDF2-HMAC-SHA256 (100k rounds) / constant-time comparison (`hmac.compare_digest`), CSPRNG 15-minute single-use password recovery tokens, JWT auth with strict RBAC (`client` vs `admin`).
- **Database (PostgreSQL 16/18)**: 12 modular domain schemas (`catalog`, `commerce`, `core`, `crm`, `gamification`, `governance`, `identity`, `integrations`, `inventory`, `marketing`, `privacy`, `promotions`) plus `public` tables (`users`, `external_accounts`, `password_resets`, `leads`).
- **Frontend (`apps/web`)**: Next.js 16 (App Router, Turbopack), TypeScript 5 strict, Tailwind CSS, WCAG AAA color contrast, ARIA accessibility, Canvas 2D / Three.js interactive visualizers, responsive CyberLateralSidebar navigation.
- **Testing (`tests/`)**: Automated test suite with pytest, HTTPX / Starlette TestClient, async concurrency benchmarks, OWASP Top 10 mitigation verification, and media/AST integrity contracts.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | OAuth Anti-Escalation | Block privilege escalation to `admin` via social login; force `client` role or return 403 on admin email collision | M1 | Survey Explorer 1 / R3 |
| 2 | GitHub OAuth Provider | Add GitHub to `GET /auth/oauth/providers` and support GitHub login in backend | M1 | Survey Explorer 1 & 3 / R3 |
| 3 | Catalog & Services Endpoints | Implement `GET /catalog/products`, `GET /catalog/services`, and `GET /catalog/categories` with 503 fallback | M1 | Survey Explorer 1 / R1 |
| 4 | Client Portal Backend Endpoints | Implement `GET /client/dashboard`, `GET /client/requests`, `GET /client/audits` with client JWT authentication | M1 | Survey Explorer 1 & 3 / R4 |
| 5 | Database Error Sanitization | Replace `str(exc)` in HTTP 500 error handlers with generic, sanitized messages | M1 | Survey Explorer 1 / R2 |
| 6 | React 19 ESLint Fixes | Resolve all 14 blocking ESLint errors and warnings in frontend components to pass `npm run lint` | M2 | Survey Explorer 2 / Quality Directive |
| 7 | Customer Portal Page (`/portal`) | Create authenticated client dashboard displaying request status (`solicitudes`) and audit visualizers | M2 | Survey Explorer 2 / R4 |
| 8 | GitHub Social Button & OAuth Link | Add GitHub button to `login/page.tsx` and integrate callback redirect to `/portal` | M2 | Survey Explorer 2 / R3 |
| 9 | Navigation & Portal Integration | Add Portal link to CyberLateralSidebar and verify responsive mobile/desktop layout | M2 | Survey Explorer 2 / R4 |
| 10 | True Async Concurrency Tests | Test 50+ concurrent async requests with `httpx.AsyncClient` asserting latency <350ms and zero socket errors | M3 | Survey Explorer 3 / R1 |
| 11 | Password Token Expiry & DB Tests | Verify rejection of expired (>15 min) password tokens and verify SHA-256 token hashing in DB | M3 | Survey Explorer 3 / R2 |
| 12 | OAuth Security & GitHub Tests | Comprehensive test suite for OAuth role isolation (no admin escalation) and GitHub provider support | M3 | Survey Explorer 3 / R3 |
| 13 | Client Portal & Catalog Tests | Automated unit & integration tests for catalog reading, client portal RBAC, and 503 fallback | M3 | Survey Explorer 3 / R4 & R5 |
| 14 | 4-Tier E2E Test Suite | Structured E2E test suite published with `TEST_READY.md` covering Tiers 1-4 | M3 | Survey Explorer 3 / R5 |
| 15 | Adversarial Hardening & Audit | Final integration verification, Tier 5 adversarial stress testing, and Forensic Integrity Audit | M4 | Project Pattern |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Backend Security, Auth & Scalability | Fix OAuth escalation, add GitHub provider, implement catalog & client portal endpoints, sanitize 500 errors | Survey | DONE |
| M2 | Frontend UI/UX & Customer Portal | Fix 14 ESLint errors, build `/portal` customer dashboard, add GitHub login button, link sidebar | Survey | DONE |
| M3 | E2E Testing Suite Track | Implement async concurrency tests (<350ms), token expiry tests, OAuth escalation tests, client portal tests, publish TEST_READY.md | M1, M2 | IN_PROGRESS |
| M4 | Final Integration, Adversarial Hardening & Audit | Pass 100% pytest suite, verify clean `npm run build` and `npm run lint`, execute Challenger and Forensic Auditor checks | M1, M2, M3 | PLANNED |

## Interface Contracts
### Client Portal Backend ↔ Frontend
- `GET /client/dashboard`: Headers: `Authorization: Bearer <token>`. Response: `{ user: { id, email, full_name, role }, active_requests: [...], pending_audits: [...], stats: { total_requests, completed, in_progress } }`. 401 if unauthenticated, 503 if DB pool offline.
- `GET /client/requests`: Headers: `Authorization: Bearer <token>`. Response: `list[RequestItem]`.
- `GET /catalog/products`: Public endpoint. Response: `list[ProductItem]`. 503 if DB pool offline.
- `GET /catalog/services`: Public endpoint. Response: `list[ServiceItem]`. 503 if DB pool offline.

### Authentication & OAuth
- `POST /auth/oauth/login`: Input: `{ provider: "google"|"github"|..., provider_user_id, email, full_name, accept_terms }`. Response: `{ access_token, token_type: "bearer", user: { id, email, full_name, role: "client" } }`.
- Rule: If `email` matches an existing user with `role == 'admin'`, the endpoint MUST return HTTP 403 Forbidden or issue a session strictly restricted to `role: 'client'`. Under NO circumstance may it issue `role: 'admin'`.

## Code Layout
- Backend routes: `apps/api/main.py`
- Database schema: `apps/api/NAXORESUELVE_SQL_MAESTRO_POSTGRESQL.sql`
- Frontend components: `apps/web/src/components/`
- Frontend pages: `apps/web/src/app/`
- Frontend portal: `apps/web/src/app/portal/page.tsx`
- Automated tests: `tests/`
