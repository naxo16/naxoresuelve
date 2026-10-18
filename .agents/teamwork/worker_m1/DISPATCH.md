## 2026-10-18T06:35:29Z
You are Worker M1 (Backend Security & Scalability Worker) for the 'naxoresuelve' platform overhaul.
Your working directory is: C:\Apache64\Apache24\htdocs\naxoresuelve\.agents\teamwork\worker_m1

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

You MUST read:
1. C:\Apache64\Apache24\htdocs\naxoresuelve\.agents\teamwork\ORIGINAL_REQUEST.md
2. C:\Apache64\Apache24\htdocs\naxoresuelve\PROJECT.md
3. C:\Apache64\Apache24\htdocs\naxoresuelve\AGENTS.md
4. C:\Apache64\Apache24\htdocs\naxoresuelve\GEMINI.md
5. C:\Apache64\Apache24\htdocs\naxoresuelve\.agents\teamwork\explorer_survey_1\handoff.md
6. C:\Apache64\Apache24\htdocs\naxoresuelve\.agents\teamwork\explorer_survey_1\analysis.md

WRITE OWNERSHIP:
You EXCLUSIVELY own: C:\Apache64\Apache24\htdocs\naxoresuelve\apps\api\main.py.
Do NOT modify any files in apps/web/ or tests/.

YOUR TASKS:
1. Fix OAuth Privilege Escalation in `POST /auth/oauth/login`:
   - If `clean_email` matches an existing user with `role == "admin"`, do NOT issue an admin session. Per GEMINI.md Fase 7.3 and AGENTS.md § 5.3: "Toda cuenta creada o autenticada vía OAuth social adquiere exclusivamente el rol client. Ningún proveedor externo puede otorgar privilegios de admin."
   - If an existing admin account is targeted, either reject with HTTP 403 Forbidden (`Acceso restringido: las cuentas de administrador no pueden autenticarse ni vincularse mediante proveedores OAuth sociales`), or strictly enforce `role = "client"` in the issued token and forbid elevating privileges.
2. Add GitHub OAuth Provider:
   - In `GET /auth/oauth/providers`, add `github` to the returned list (id: `github`, name: `GitHub`, icon: `github`, auth_url: `https://github.com/login/oauth/authorize`, scopes: `["read:user", "user:email"]`).
   - In `POST /auth/oauth/login`, ensure `github` is an allowed provider in `allowed_providers`.
3. Implement Catalog & Services Endpoints:
   - `GET /catalog/products`: Return list of active products from PostgreSQL `catalog.products` using asyncpg parameterized query. If `pool` is None/closed, raise controlled HTTP 503 Service Unavailable via `get_db_pool()`. If catalog table is empty, return structured default service catalog products.
   - `GET /catalog/services`: Return list of services matching the 15 services offered on the platform with pricing, category, and deliverables.
   - `GET /catalog/categories`: Return catalog categories with 503 fallback.
4. Implement Client Portal Endpoints:
   - `GET /client/dashboard`: Requires valid Bearer JWT. Checks user role. If pool is None, raises HTTP 503 via `get_db_pool()`. Returns client dashboard summary: user profile, active service requests, pending audits, and platform statistics.
   - `GET /client/requests`: Requires Bearer JWT. Returns client's service requests with status (`pendiente`, `en_proceso`, `completado`).
   - `GET /client/audits`: Requires Bearer JWT. Returns security and performance audit summaries.
5. Sanitize Internal Error Messages:
   - In HTTP 500 error handlers across `main.py`, remove `f"... {str(exc)}"` to prevent leaking database exception strings. Replace with generic error detail (e.g., `Error interno del servidor al procesar la solicitud`), logging the error internally with logger.error.

VERIFICATION:
Execute `pytest -v` from C:\Apache64\Apache24\htdocs\naxoresuelve to verify that all 79 tests pass with 0 regressions.
Deliver your completion report to `C:\Apache64\Apache24\htdocs\naxoresuelve\.agents\teamwork\worker_m1\handoff.md`.
Follow the Handoff Protocol (Observation, Logic Chain, Caveats, Conclusion, Verification Method).
When finished, send a message to parent with summary and file path.
