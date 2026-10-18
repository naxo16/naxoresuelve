# Comprehensive QA & Test Suite Audit Report: naxoresuelve

**Agent**: Testing & QA Explorer (`explorer_survey_3`)  
**Timestamp**: 2026-10-18T06:35:00Z  
**Target Repository**: `C:\Apache64\Apache24\htdocs\naxoresuelve`  
**Execution Environment**: Python 3.12.10, pytest-9.1.1, PostgreSQL 18.4 x64, Next.js 16.4.2 (React 19)

---

## 1. Executive Summary

An exhaustive technical investigation was conducted on the automated test suite, execution environment, and architectural coverage across requirements **R1 through R5** as specified in `ORIGINAL_REQUEST.md`, `AGENTS.md`, and `GEMINI.md`.

### Core Findings:
1. **Current Test Suite Status**: `pytest -v` currently runs **79 automated tests** with **100% passing** (79 passed, 0 failed, 2 deprecation warnings in 2.69s).
2. **Environment & Database State**: Local PostgreSQL 18.4 is active as a Windows Service (`postgresql-x64-18`, PID 15080) on `127.0.0.1:5432`. All 12 modular schemas and 4 public tables (`leads`, `users`, `password_resets`, `external_accounts`) are present in `naxoresuelve_db`. Active credentials in `apps/api/.env` are `postgresql://naxoresuelve:Naxo_85721@127.0.0.1:5432/naxoresuelve_db`.
3. **Frontend Compilation vs Linting**: `npm run build` in `apps/web` succeeds cleanly with Turbopack (static output generated). However, `npm run lint` fails with **41 problems (14 errors, 27 warnings)** across `ModernCanvasVideoPlayer.tsx`, `SdlcLifecycleCarousel.tsx`, `ServicesQuickModal.tsx`, and `ThreeArchitectureNode.tsx`.
4. **Critical Coverage Gaps vs R1-R5**:
   - **R1 (Scalability & Concurrency)**: Concurrency tests in `test_owasp_security.py` and `test_pruebas_rudas.py` are purely *sequential loops* (`for _ in range(50):`), not true asynchronous concurrent bursts (`asyncio.gather` / multi-worker). No test asserts the required latency threshold (<350ms).
   - **R2 (OWASP & Password Reset)**: Token expiration (>15m) rejection is not asserted; token SHA-256 database storage immutability is not verified at the database layer; OWASP A06 (dependency auditing) and A09 (audit event logging) lack automated tests.
   - **R3 (OAuth Google & GitHub)**: **GitHub is missing** from `GET /auth/oauth/providers` metadata and has zero automated test coverage. Cross-provider account linking edge cases and OAuth token role confinement are not comprehensively tested.
   - **R4 (Client Portal & Services)**: Backend endpoints for client portal (`/client/dashboard`, `/client/requests`, `/client/audits`) and service catalog do not exist in `apps/api/main.py`, resulting in **0% test coverage** for the client portal.
   - **R5 (4-Tier E2E Architecture)**: Significant imbalances exist: Lead intake has >15 tests, whereas Password Recovery (3 tests), OAuth (3 tests), and Client Portal (0 tests) fail the Tier 1 requirement (>=5 tests per feature). Tier 2 (corner cases), Tier 3 (cross-feature pairwise), and Tier 4 (full real-world user journeys) are largely missing.

---

## 2. Test Suite Execution & Baseline Metrics

### 2.1 Pytest Execution Summary
- **Command**: `pytest -v`
- **Root Directory**: `C:\Apache64\Apache24\htdocs\naxoresuelve`
- **Config**: `pyproject.toml` (`testpaths = ["tests"]`)
- **Total Tests Collected**: 79
- **Results**: 79 passed, 0 failed, 0 skipped, 2 warnings
- **Execution Time**: 2.69s

### 2.2 Inventory of Existing Test Modules

| Test File | Total Tests | Primary Purpose | Dominant Verifications |
| :--- | :---: | :--- | :--- |
| `tests/test_owasp_security.py` | 27 | OWASP Top 10 (A01-A05, A07, A08, A10) | RBAC 403, PBKDF2 uniqueness, JWT tampering, SQLi parameterized email rejection, SSRF payload neutralization, security headers. |
| `tests/test_pruebas_rudas.py` | 33 | Fuzzing, Resilience & Concurrency | Corrupt payloads, length limits, 503 without DB, 100-request liveness loop, basic auth/JWT checks. |
| `tests/test_auth_features.py` | 11 | Identity, Registration, Reset & OAuth | Ley 19.628 consent, password length, anti-enumeration, token uniuso, Google OAuth role confinement. |
| `tests/test_media_and_navbar_integrity.py` | 8 | Multimedia & UI/UX DOM Contract | MP4 atoms (`vide`/`soun`), file sizes (>10MB), `.gitignore` compliance, sidebar i18n (6 languages), anchor target resolution. |
| `tests/test_health.py` | 2 | Basic Health & Readiness | Liveness 200, Readiness 503 without DB. |

### 2.3 Existing Warnings & Deprecations
1. `starlette/formparsers.py:12: PendingDeprecationWarning: Please use python_multipart instead. import multipart`
2. `starlette/testclient.py:41: DeprecationWarning: The anyio.abc.BlockingPortal alias is deprecated, use anyio.from_thread.BlockingPortal instead.`

---

## 3. Requirement-by-Requirement Gap Analysis

### 3.1 Requirement R1: Scalability, Concurrency & Database Resilience

| Criterion | Mandate in ORIGINAL_REQUEST.md / AGENTS.md | Current Test State | Gap Severity | Details & Code Reference |
| :--- | :--- | :--- | :---: | :--- |
| **Simultaneous Bursts** | Ráfagas de 50+ consultas concurrentes simultáneas sin degradación de memoria ni bloqueos. | `test_owasp_security.py:184` & `test_pruebas_rudas.py:129` use sequential `for _ in range(50): client.get(...)`. | **HIGH** | Sequential execution tests neither thread safety, connection pool contention, nor asynchronous socket multiplexing. Needs `httpx.AsyncClient` + `asyncio.gather(*[client.get(...) for _ in range(50)])`. |
| **Response Latency** | Tiempos de respuesta <350ms en lectura de catálogo/servicios y leads. | Zero tests measure latency or assert response time. | **HIGH** | No benchmark fixture or assertion `assert elapsed_time < 0.350`. |
| **Controlled 503 Degradation** | Endpoints de catálogo, portal y leads responden 503 controlado sin crashear cuando la DB está caída. | Covered for `/leads`, `/health/ready`, `/auth/login`, `/auth/register`. | **MEDIUM** | Missing for Catalog and Client Portal endpoints (because those endpoints are not yet implemented in `main.py`). |
| **Pool Leaks / Exhaustion** | Manejo de saturación del pool `min_size=2, max_size=10`. | No tests attempt to exhaust or monitor pool connections under sustained load. | **MEDIUM** | No test validates that acquiring 11+ connections behaves with proper queuing or deterministic timeout. |

### 3.2 Requirement R2: Cryptographic Security, OWASP Top 10 & Password Reset

| Criterion | Mandate | Current Test State | Gap Severity | Details & Code Reference |
| :--- | :--- | :--- | :---: | :--- |
| **Token Expiry (15 min)** | Caducidad estricta de 15 minutos en tokens de recuperación. | Token generation sets `expires_at = now + 15m`, but tests only verify immediate uniuso. | **HIGH** | No test mocks or manipulates `expires_at` into the past to confirm that an expired token is rejected with HTTP 400. |
| **Token Zero-Cleartext in DB** | Cero tokens en texto claro en base de datos; solo hash SHA-256 (`OCTET_LENGTH` / 64-char hex). | Tests verify that the API consumes `raw_token`, but no test inspects `password_resets.token_hash` directly in DB. | **MEDIUM** | Need direct DB query in test to confirm `token_hash == sha256(raw_token)` and that `raw_token` is never persisted in any column. |
| **Anti-Enumeration Response** | Respuesta uniforme e idéntica tanto si el correo existe como si no existe. | `test_auth_features.py:93` asserts `status_code == 200` and generic message for both existing and non-existing emails. | **PASS** | Well implemented in `test_solicitud_recuperacion_respuesta_uniforme_con_db`. |
| **OWASP A06 & A09** | Cobertura integral de A01 a A10. | A01-A05, A07, A08, A10 covered. A06 (Vulnerable Components) and A09 (Security Logging) have **0 tests**. | **HIGH** | Missing automated test verifying dependencies against vulnerabilities (`pip-audit` integration test) and missing test verifying audit log emission in `governance.audit_events` without logging sensitive data. |
| **SQLi in Auth Endpoints** | Cero inyecciones SQL en toda frontera. | Parametric SQL injection is only tested on `POST /leads` (email field). | **MEDIUM** | Must extend parameterized SQL injection attacks to `POST /auth/login`, `POST /auth/register`, `POST /auth/forgot-password`, `POST /auth/reset-password`. |
| **Security Headers on Errors** | OWASP headers presentes en toda respuesta HTTP. | Tested only on `GET /health/live`. | **LOW** | Security middleware headers must be verified on 401, 403, 404, 422, and 503 error responses. |

### 3.3 Requirement R3: Identity Federation (Google & GitHub)

| Criterion | Mandate | Current Test State | Gap Severity | Details & Code Reference |
| :--- | :--- | :--- | :---: | :--- |
| **GitHub Support** | Soporte explícito para inicio de sesión con Google y GitHub. | `GET /auth/oauth/providers` returns Google, Facebook, Instagram, Microsoft. **GitHub is omitted** from provider listing (`main.py:667-696`). | **CRITICAL** | `main.py:551` accepts `github` in `allowed_providers`, but metadata endpoint omits it, and `test_catalogo_proveedores_oauth_activos` does not assert `github`. |
| **GitHub OAuth Test** | Flujo federado de GitHub emite JWT con rol `client`. | Zero tests execute `provider: "github"`. Only `google` is tested in `test_oauth_login_crea_cuenta_con_rol_client`. | **CRITICAL** | Missing dedicated test `test_oauth_login_github_crea_cuenta_con_rol_client`. |
| **Role Escalation Defense** | Prohibición absoluta de escalación hacia admin desde OAuth. | Tested implicitly via default `role = 'client'`. | **MEDIUM** | Needs explicit adversarial test: attacker injects `"role": "admin"` in `OAuthLoginIn` payload and asserts that returned role is strictly `client`. |
| **Account Linking Deduplication** | Desacoplamiento relacional en `external_accounts` enlazado a `users.id`. | Re-login with same provider is tested (`test_auth_features.py:183`). Cross-provider linking (same email with Google AND GitHub) is not tested. | **MEDIUM** | Needs test verifying that logging in via Google and then GitHub with same email attaches both to the same `users.id` without creating duplicate users. |

### 3.4 Requirement R4: Client Portal, Service Previews & Multimedia Integrity

| Criterion | Mandate | Current Test State | Gap Severity | Details & Code Reference |
| :--- | :--- | :--- | :---: | :--- |
| **Client Portal API** | Panel privado autenticado con estado de solicitudes y auditorías. | **Zero endpoints and zero tests** exist in backend for client portal. | **CRITICAL** | `apps/api/main.py` only has `/admin/leads`, no `/client/portal`, `/client/requests`, or `/client/services`. |
| **Client Portal UI** | Portal interactivo para visualización de servicios y estado. | `apps/web/src/app/login/page.tsx` renders a basic success card with user info; no dedicated portal page (`/portal` or `/dashboard`) exists. | **CRITICAL** | No E2E or component tests verifying client dashboard views, service status tracking, or audit review. |
| **Media & Audio Player** | Previews interactivas con Web Audio API, volume slider, video/sound tracks. | 8 robust tests in `test_media_and_navbar_integrity.py` inspecting MP4 atoms, file sizes, unmuted player, volume slider, i18n navigation. | **PASS** | Exceptionally well covered by AST/file analysis tests. |
| **Frontend Code Quality** | Compilación limpia, cero errores TypeScript, cero advertencias bloqueantes de ESLint. | `npm run build` succeeds cleanly. `npm run lint` fails with 14 errors and 27 warnings. | **HIGH** | Linting errors in `ModernCanvasVideoPlayer.tsx` (`renderCanvasFrame` immutability, unescaped quotes) and `ThreeArchitectureNode.tsx` (`setState` in effect) must be addressed. |

---

## 4. Evaluation of the 4-Tier E2E Testing Architecture

The project specification mandates a 4-tier testing hierarchy. Below is an audit of current compliance and required additions:

```
========================================================================================
                          4-TIER E2E TESTING ARCHITECTURE MATRIX
========================================================================================
 Tier 1: Feature Coverage (>=5 per feature)
   ├── Feature 1: Registration & Ley 19.628 Consent    -->  5 tests  [COMPLIANT]
   ├── Feature 2: Core Auth, JWT & Session Management  -->  7 tests  [COMPLIANT]
   ├── Feature 3: Password Recovery (CSPRNG, SHA-256)   -->  3 tests  [DEFICIENT - needs +2]
   ├── Feature 4: OAuth Federation (Google & GitHub)   -->  3 tests  [DEFICIENT - needs +2]
   ├── Feature 5: Lead / Contact Intake Architecture   --> 15 tests  [COMPLIANT]
   └── Feature 6: Client Portal & Service Catalog      -->  0 tests  [CRITICAL DEFICIENT - needs +5]

 Tier 2: Boundary & Corner Cases (>=5 per feature)
   ├── Feature 1: Registration boundaries (max length, whitespace, Unicode)  --> 2/5 [DEFICIENT]
   ├── Feature 2: Password strength, special chars, brute-force limits        --> 2/5 [DEFICIENT]
   ├── Feature 3: Token expiry boundary (14m59s vs 15m01s, truncated tokens) --> 0/5 [CRITICAL DEFICIENT]
   ├── Feature 4: OAuth payload boundaries (missing claims, malformed uids)   --> 1/5 [DEFICIENT]
   ├── Feature 5: Contact intake boundaries (length bounds, emojis, bytes)     --> 5/5 [COMPLIANT]
   └── Feature 6: Client portal boundaries (unauth, expired token, 503)       --> 0/5 [CRITICAL DEFICIENT]

 Tier 3: Pairwise Cross-Feature Combinations
   ├── Scenario A: Register -> Forgot Password -> Reset -> Login with New Password [PARTIALLY COVERED]
   ├── Scenario B: Register with Email -> Link Google -> Link GitHub -> Check Identity [UNCOVERED]
   ├── Scenario C: Login via OAuth -> Attempt Access to Admin Endpoints (RBAC confinement) [UNCOVERED]
   ├── Scenario D: Request Reset -> Login with Old Password before Reset -> Verify Invalidation [UNCOVERED]
   └── Scenario E: Active Client Session -> DB Connection Failure -> Controlled 503 -> Reconnect [UNCOVERED]

 Tier 4: Real-World Application User Journeys
   ├── Journey 1: New Enterprise Prospect (Home -> i18n Sidebar -> Video Demo -> Lead Submit) [UNCOVERED]
   ├── Journey 2: Self-Service Password Recovery (Forgot -> Token -> Reset -> Portal Login) [UNCOVERED]
   ├── Journey 3: Client Portal Operations (Login -> View Requests -> Check Audit Log -> Download Report) [UNCOVERED]
   └── Journey 4: Disaster Recovery & Chaos Engineering (DB cut mid-operation -> Clean 503) [UNCOVERED]
========================================================================================
```

---

## 5. Summary of Recommended Test Suite Additions

To achieve **100% test coverage and satisfy the 4-tier E2E testing architecture**, the following concrete test modules must be implemented:

### Module 1: `tests/test_oauth_github_and_federation.py` (Tier 1 & Tier 2)
1. `test_oauth_providers_includes_github_and_metadata`: Verify `/auth/oauth/providers` includes GitHub with correct scopes (`read:user`, `user:email`).
2. `test_oauth_login_github_crea_cuenta_con_rol_client`: Test full GitHub OAuth payload, session token creation, and `client` role enforcement.
3. `test_oauth_login_rechaza_escalacion_admin_inyectada`: Attacker sends `"role": "admin"` in OAuth payload; backend ignores it and confirms `user.role == "client"`.
4. `test_oauth_login_vinculacion_cruzada_google_y_github`: User authenticates with Google, then with GitHub with the same email; confirms single `users.id` and 2 entries in `external_accounts`.
5. `test_oauth_login_boundaries_payload_incompleto`: Boundary tests with missing `provider_user_id`, empty email, and unaccepted terms.

### Module 2: `tests/test_password_recovery_boundaries.py` (Tier 1 & Tier 2)
1. `test_recuperacion_rechaza_token_expirado_mayor_15_minutos`: Simulates expired token (`expires_at < now`) and asserts HTTP 400 rejection.
2. `test_recuperacion_almacena_unicamente_hash_sha256_en_db`: Directly queries `password_resets` table to verify `token_hash == sha256(raw_token)` and that `raw_token` is nowhere in the DB.
3. `test_recuperacion_token_malformado_o_truncado`: Boundary test with truncated token, invalid hex, and whitespace-padded tokens.
4. `test_recuperacion_clave_anterior_funciona_hasta_ser_canjeada`: Verifies old password remains functional while token is pending, and becomes invalid immediately after reset.
5. `test_recuperacion_rechaza_nueva_password_corta`: Asserts 422 on `new_password` with <8 characters during reset.

### Module 3: `tests/test_concurrency_and_performance.py` (Tier 1 & Tier 2)
1. `test_rafaga_asincrona_concurrente_50_peticiones_simultaneas`: Uses `httpx.AsyncClient` with `asyncio.gather` to fire 50 truly simultaneous requests against FastAPI.
2. `test_latencia_lectura_leads_menor_350ms`: Asserts that `res.elapsed.total_seconds() < 0.350` across multiple benchmark executions.
3. `test_resiliencia_pool_concurrente_sin_leaks`: Verifies that concurrent DB acquisitions properly return connections to the pool without leaking.
4. `test_degradacion_controlada_503_todos_los_endpoints_sin_db`: Parametrically tests all endpoints (`/leads`, `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/oauth/login`, `/admin/leads`) without DB to confirm uniform HTTP 503.

### Module 4: `tests/test_client_portal_and_services.py` (Tier 1, Tier 2 & Tier 4)
1. `test_client_portal_endpoint_protegido_requiere_auth`: `GET /client/dashboard` without token returns 401.
2. `test_client_portal_retorna_solicitudes_y_auditorias_de_usuario`: Client token returns only their own leads/requests (Row-Level Security / IDOR defense).
3. `test_client_portal_rechaza_usuario_desactivado_403`: Inactive account (`is_active = false`) is barred from accessing the client portal.
4. `test_catalogo_servicios_publico_responde_con_latencia_baja`: `GET /services` returns catalog data with cached or indexed response <100ms.
5. `test_client_portal_controla_503_sin_db`: Portal degrades gracefully to 503 when PostgreSQL pool is unavailable.

### Module 5: `tests/test_cross_feature_e2e_journeys.py` (Tier 3 & Tier 4)
1. `test_journey_registro_recuperacion_login_y_portal`: Full lifecycle from registration -> password forgot -> reset -> login -> client portal access.
2. `test_journey_federacion_doble_proveedor_y_confinamiento_rbac`: Google login -> GitHub login -> verify single identity -> attempt access to `/admin/leads` -> verified 403.
3. `test_journey_caos_y_recuperacion_en_caliente`: Client operations during simulated database outage and subsequent reconnection.

---

## 6. Actionable Implementation Plan for Development Agents

1. **Backend (`apps/api/main.py`)**:
   - Update `GET /auth/oauth/providers` to include `github` with proper protocol (`OAuth 2.0`) and scopes (`read:user`, `user:email`).
   - Implement client portal endpoints:
     * `GET /client/portal/dashboard`: Returns user profile, active project requests, and audit logs.
     * `GET /services/catalog`: Returns public service catalog with interactive demo metadata.
2. **Frontend (`apps/web`)**:
   - Fix 14 ESLint errors:
     * `ModernCanvasVideoPlayer.tsx`: Reorder `renderCanvasFrame` definition before its usage in `useCallback` / `useEffect`; replace unescaped quotes with HTML entities (`&quot;`).
     * `ThreeArchitectureNode.tsx`: Move synchronous `setState` out of the direct `useEffect` body into a proper asynchronous handler or state initializer.
     * Remove unused imports in `SdlcLifecycleCarousel.tsx` and `ServicesQuickModal.tsx`.
   - Add GitHub button and OAuth callback flow in `apps/web/src/app/login/page.tsx`.
   - Implement dedicated Client Portal view/page (`/portal`) displaying request statuses and audits.
3. **Automated Testing Suite (`tests/`)**:
   - Add the 5 test modules detailed in Section 5.
   - Run `pytest -v` to ensure 100% green execution across the expanded test suite (projected ~110-120 tests).
