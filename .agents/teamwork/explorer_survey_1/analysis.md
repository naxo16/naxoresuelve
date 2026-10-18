# Backend & Security Specification Mining Report — naxoresuelve Overhaul

**Investigator:** Backend & Security Spec Miner (Explorer Survey 1)  
**Date:** 2026-10-18  
**Scope:** Requirements R1, R2, R3 from `ORIGINAL_REQUEST.md` against `apps/api/main.py`, PostgreSQL 18, and `NAXORESUELVE_SQL_MAESTRO_POSTGRESQL.sql`.

---

## 1. Executive Summary

This specification mining and technical audit investigated the backend architecture, security controls, cryptographic primitives, database pooling, and identity federation of the **naxoresuelve** platform.

Key findings:
1. **Core Cryptographic & OWASP Primitives (R2) are solid but contain critical leakage gaps**: PBKDF2-HMAC-SHA256 (100k rounds), timing-safe comparisons (`hmac.compare_digest`), Pydantic v2 input sanitization, and security headers (HSTS, DENY, nosniff) are implemented and verified. However:
   - Several 500 error handlers leak raw database error details (`detail=f"Database error...: {str(exc)}"`) directly to clients.
   - Rate limiting (anti-brute-force) is completely absent.
   - Security auditing into `governance.audit_events` is not implemented.
2. **Database Pooling & Concurrency (R1)**: Connection pool management with `asyncpg` operates with `min_size=2, max_size=10`. 50 concurrent database queries execute in ~265ms (avg latency 51ms, well under the 350ms requirement). Controlled 503 degradation is implemented when `pool is None`. However:
   - **Catalog and services endpoints (`GET /catalog/products`, `GET /services`) are completely missing from the API**, despite tables existing in PostgreSQL.
   - Connection acquire timeouts are not configured, risking coroutine starvation under high load.
3. **Identity Federation OAuth 2.0 / OIDC (R3) has a CRITICAL Privilege Escalation Vulnerability**:
   - `POST /auth/oauth/login` currently accepts untrusted client-supplied JSON (mock payload) rather than performing an authorization code exchange with Google or GitHub.
   - **CRITICAL FLAW:** If an attacker calls `POST /auth/oauth/login` supplying the email of an existing admin (e.g. `pablovaldescontacto@gmail.com` or `admin@naxoresuelve.cl`), the system returns an active JWT with `role: "admin"`! This directly violates Requirement R3, AGENTS.md § 5.3, and GEMINI.md § Fase 7.3, which mandate strict `role: client` assignment and absolute prohibition of admin privilege escalation from social providers.
   - **GitHub Provider Omission:** GitHub is missing from `GET /auth/oauth/providers` metadata and the frontend login UI.

---

## 2. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | R1: Health & Diagnostics | `GET /health/live` | Liveness probe indicating Python worker process is running and event loop is active. Immune to DB/network outages. | None | `{"status": "live"}` (HTTP 200) | Always 200 while process is alive. | `apps/api/main.py:159`, `tests/test_health.py` |
| 2 | R1: Health & Diagnostics | `GET /health/ready` | Readiness probe executing `SELECT 1` through asyncpg pool. | None | `{"status": "ready"}` (HTTP 200) | HTTP 503 if pool is uninitialized, closed, or query fails. | `apps/api/main.py:165`, `tests/test_health.py` |
| 3 | R1: Resilient Data Access | `get_db_pool()` Dependency | Validates asyncpg connection pool state before servicing transactional requests. | Implicit application state | Active `asyncpg.Pool` instance | Raises HTTP 503 Service Unavailable if pool is `None`, closing, or closed. | `apps/api/main.py:58` |
| 4 | R1: CRM & Contacts | `POST /leads` | Atomic persistence of contact lead with RFC 5322 email validation, bounds checking, and parameterized query (`$1..$4`). | `LeadIn` JSON: `name` (2-150 chars), `email` (RFC 5322), `message` (5-5000 chars) | `LeadOut` JSON (HTTP 201) with generated `id`, normalized email, UTC `created_at` | HTTP 422 on invalid/SQLi inputs; HTTP 503 on DB disconnect; HTTP 500 on transaction error. | `apps/api/main.py:256`, `tests/test_pruebas_rudas.py` |
| 5 | R1: CRM & Contacts | `GET /leads` | Public listing of all submitted contact leads ordered by `id ASC`. | None | `list[LeadOut]` (HTTP 200) | HTTP 503 if database pool is unavailable. | `apps/api/main.py:281` |
| 6 | R1 / R4: Catalog & Services | `GET /catalog/products` | **MISSING**: Retrieval of published services and products from `catalog.products` with variants and prices. | Query filters (`category`, `product_type`, `limit`) | List of products, variants, and pricing (<350ms) | Should return HTTP 503 on DB unavailability. | `ORIGINAL_REQUEST.md` R1/R4, `catalog.products` SQL schema |
| 7 | R2: Security Headers | `add_owasp_security_headers` Middleware | HTTP middleware injecting defensive security headers into all responses. | Incoming HTTP request | Outgoing response with `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `Strict-Transport-Security`, `Referrer-Policy` | Clean passthrough without leaking stacktraces on 404/500. | `apps/api/main.py:91`, `tests/test_owasp_security.py` |
| 8 | R2: Cryptography | PBKDF2 Password Hashing (`hash_password`, `verify_password`) | Computes PBKDF2-HMAC-SHA256 with 100,000 iterations and unique 16-byte random salt (`secrets.token_hex(16)`). Verifies via `hmac.compare_digest`. | Plaintext password, optional salt | `(dk.hex(), salt)` tuple or `bool` verification | Timing-safe: constant-time digest comparison prevents side-channel timing attacks. | `apps/api/main.py:107`, `tests/test_owasp_security.py` |
| 9 | R2: Authentication | `POST /auth/login` | Authenticates credentials against `public.users` table and issues JWT Bearer token valid for 24 hours. | `LoginIn`: `email` (EmailStr), `password` (6-100 chars) | `LoginOut` (HTTP 200) containing `access_token`, `token_type: "bearer"`, and sanitized `UserOut` | HTTP 401 on incorrect email or password; HTTP 403 on deactivated account; HTTP 503 on DB failure. | `apps/api/main.py:303` |
| 10 | R2: Authorization | `GET /auth/me` | Validates JWT token from `Authorization: Bearer <token>` and returns current user claims. | Header `Authorization: Bearer <token>` | Token claims dictionary (HTTP 200) | HTTP 401 on missing, malformed, expired (`ExpiredSignatureError`), or falsified token. | `apps/api/main.py:363` |
| 11 | R2: RBAC | `GET /admin/leads` | Administrative listing of contact leads ordered by `created_at DESC`. Restricted to users with `role == 'admin'`. | Header `Authorization: Bearer <token>` with admin claim | `list[LeadOut]` (HTTP 200) | HTTP 401 if unauthenticated; HTTP 403 Forbidden if user role is `'client'`. | `apps/api/main.py:369`, `tests/test_owasp_security.py` |
| 12 | R2: Consent & Registration | `POST /auth/register` | Registers new user account with mandatory consent (`accept_terms: true`) under Chilean Law 19.628 & 21.719. | `RegisterIn`: `full_name`, `email`, `password` (>=8 chars), `accept_terms`, `accept_marketing` | `LoginOut` (HTTP 201) with newly created user with `role: 'client'` | HTTP 400 if `accept_terms` is false; HTTP 409 if email already registered; HTTP 422 if validation fails. | `apps/api/main.py:397`, `tests/test_auth_features.py` |
| 13 | R2: Password Recovery | `POST /auth/forgot-password` | Initiates cryptographic single-use password recovery. Generates CSPRNG token (`secrets.token_urlsafe(32)`), stores SHA-256 hash in `password_resets` with 15-minute expiration. | `ForgotPasswordIn`: `email` (EmailStr) | Uniform message (HTTP 200) neutralizing account enumeration. In test/dev, includes `reset_token_simulated`. | HTTP 422 on invalid email format; HTTP 503 on DB failure. Identical message whether email exists or not. | `apps/api/main.py:458`, `tests/test_auth_features.py` |
| 14 | R2: Password Recovery | `POST /auth/reset-password` | Consumes single-use recovery token using `FOR UPDATE` lock, sets `is_used = true`, and updates user password with PBKDF2 hash. | `ResetPasswordIn`: `token` (>=10 chars), `new_password` (>=8 chars) | Success confirmation message (HTTP 200) | HTTP 400 if token is invalid, expired, or already used; HTTP 503 on DB failure. | `apps/api/main.py:494`, `tests/test_auth_features.py` |
| 15 | R3: Identity Federation | `GET /auth/oauth/providers` | Exposes metadata of supported OAuth 2.0 / OIDC identity providers and legal framework reference. | None | JSON catalog of active providers with protocols and scopes | Always HTTP 200. (**Gap:** currently omits GitHub). | `apps/api/main.py:661`, `tests/test_auth_features.py` |
| 16 | R3: Identity Federation | `POST /auth/oauth/login` | Authenticates/registers federated user, linking record into `external_accounts` table. | `OAuthLoginIn`: `provider`, `provider_user_id`, `email`, `full_name`, `accept_terms` | `LoginOut` (HTTP 200) with JWT access token | HTTP 400 if provider unsupported or terms not accepted; HTTP 503 on DB outage. (**Critical gap:** role escalation flaw on existing admin email). | `apps/api/main.py:548`, `tests/test_auth_features.py` |
| 17 | R3: Identity Federation | Secure Code Exchange (`POST /auth/oauth/google`, `POST /auth/oauth/github`) | **MISSING**: Backend authorization code exchange with Google and GitHub OAuth endpoints. | Authorization `code`, `redirect_uri`, `state` | Verified JWT with client role and linked account | HTTP 400/401 on invalid authorization code or mismatched state. | `ORIGINAL_REQUEST.md` R3 |

---

## 3. Edge Cases & Empirical Observations

| # | Feature | Input / Condition | Observed Behavior | Status / Risk |
|---|---------|-------------------|-------------------|---------------|
| 1 | `get_db_pool()` | Pool uninitialized (`pool is None`) or connection refused | Immediately raises `HTTPException(503, "Database service temporarily unavailable")` without process crash. | PASSED — Resilient |
| 2 | `POST /leads` | Buffer overrun: 50,000 characters in `name` or 6,000 characters in `message` | FastAPI/Pydantic returns HTTP 422 Unprocessable Entity before database allocation. | PASSED — Anti-DoS |
| 3 | `POST /leads` | SQL injection: `' OR '1'='1`, `admin'--`, `'; DROP TABLE leads;--` in `email` | Blocked at boundary with HTTP 422 by Pydantic `EmailStr` (RFC 5322 compliance). | PASSED — Injection Immune |
| 4 | `POST /leads` | XSS payloads: `<script>alert('XSS')</script>`, `<img src=x onerror=...>` | Sanitized in JSON body, stored safely as plaintext without HTML interpretation or script execution. | PASSED |
| 5 | `GET /health/live` | Concurrency burst: 50 simultaneous requests | Completed in 57.04ms total; 100% responded with HTTP 200, zero event loop blockage. | PASSED |
| 6 | Database queries | Concurrency burst: 50 simultaneous `SELECT 1` through `asyncpg.create_pool` | Completed in 265.52ms (min: 4.1ms, avg: 51.3ms, max: 261.8ms); 100% under 350ms. | PASSED |
| 7 | `POST /auth/register` | Consent declined: `accept_terms: false` | Rejected with HTTP 400 Bad Request quoting Ley 19.628 de Chile. | PASSED — Legal Compliance |
| 8 | `POST /auth/register` | Duplicate registration: same email already in `users` | Rejected with HTTP 409 Conflict ("Ya existe una cuenta registrada..."). | PASSED |
| 9 | `POST /auth/forgot-password` | Non-existent email vs. existing email | Returns identical uniform message in both cases ("Si la dirección de correo electrónico está registrada..."). Prevents user enumeration. | PASSED — OWASP A07 |
| 10 | `POST /auth/reset-password` | Replay attack: submitting the same reset token twice | First submission succeeds (200); second submission is rejected with HTTP 400 ("inválido, ha expirado o ya fue utilizado"). | PASSED — Single-use enforced |
| 11 | `POST /auth/reset-password` | Expired token (>15 minutes old) | Rejected with HTTP 400 because query enforces `expires_at > NOW()`. | PASSED |
| 12 | `GET /auth/me` | JWT algorithm tampering: `alg: "none"` | PyJWT strictly verifies signature against configured secret, rejecting with HTTP 401. | PASSED |
| 13 | `GET /auth/me` | Expired JWT token | Rejected with HTTP 401 ("El token de sesión ha expirado"). | PASSED |
| 14 | `GET /admin/leads` | Vertical privilege escalation: token with `role: "client"` | Rejected with HTTP 403 Forbidden ("Acceso restringido: requiere privilegios de Administrador"). | PASSED |
| 15 | `POST /auth/oauth/login` | Existing admin email provided via OAuth payload (`pablovaldescontacto@gmail.com`) | **CRITICAL:** Backend links external account to existing admin user and issues JWT with `role: "admin"`. Allows unauthenticated takeover of administrator privileges. | **FAILED — High Severity Bug** |
| 16 | `GET /auth/oauth/providers` | Query supported provider metadata | Returns Google, Facebook, Instagram, Microsoft. **GitHub is omitted**, failing requirement R3. | **PARTIAL — Missing Provider** |
| 17 | Database error handling | Database query throws unhandled exception in `main.py:278, 320, 389, 440, 485, 543, 642` | Handler formats `str(exc)` into HTTP 500 response detail, leaking database internals to clients. | **FAILED — Info Leak (OWASP A05)** |
| 18 | `GET /catalog/products` | Client attempts to fetch services/catalog products | Returns HTTP 404 Not Found (endpoint does not exist in FastAPI backend). | **MISSING — R1 / R4 Gap** |

---

## 4. Comprehensive Audit Against Requirements R1, R2, R3

### Requirement R1: Scalability, Database Pooling, Controlled Degradation & Latency
- **Status:** **Partially Implemented (with missing Catalog endpoints)**
- **What is Implemented:**
  - `asyncpg.create_pool` with `min_size=2, max_size=10` initialized during FastAPI `lifespan`.
  - Controlled degradation helper `get_db_pool()` raises controlled HTTP 503 when the pool is unavailable.
  - Concurrency test (50 simultaneous requests) demonstrated no event loop blockage and response times well below 350ms (average DB latency: 51.32ms).
  - All existing queries (`leads`, `users`, `external_accounts`, `password_resets`) are strictly parameterized with `$1, $2, ...`.
- **Gaps & Defects:**
  1. **Missing Catalog & Services Endpoints:** Requirement R1 specifically demands: *"tiempos de respuesta <350ms en lectura de catálogo/servicios y cero bloqueos del event loop ante ráfagas simultáneas de peticiones"* and Acceptance Criteria: *"Los endpoints del catálogo y portal responden con degradación controlada (HTTP 503) cuando el pool de base de datos no está disponible"*. The API has no endpoints for `GET /catalog/products`, `GET /catalog/services`, or `GET /catalog/categories`.
  2. **Missing Acquire Timeout:** `pool.acquire()` is called without a timeout parameter. Under burst loads exceeding pool capacity (10 connections), requests can hang.
  3. **Error Leakage in Fallbacks:** Several endpoints format `str(exc)` into the 500 detail message instead of a generic error string.

### Requirement R2: OWASP Top 10, Cryptography & Password Recovery
- **Status:** **Largely Implemented (with auditing and leakage gaps)**
- **What is Implemented:**
  - **A01 (Access Control):** RBAC enforced for admin routes (`role == 'admin'`).
  - **A02 (Cryptography):** PBKDF2-HMAC-SHA256 with 100,000 rounds and random 16-byte salt. Timing-safe comparison with `hmac.compare_digest`. Hashes and salts never exposed in API outputs.
  - **A03 (Injection):** Pydantic v2 `EmailStr` and string length bounds block injection payloads.
  - **A04 (Insecure Design):** Input bounds on text fields.
  - **A05 (Security Misconfiguration):** OWASP security headers injected via middleware (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, `Strict-Transport-Security`).
  - **A07 (Auth Failures):** Password recovery flow uses CSPRNG `secrets.token_urlsafe(32)`, stores SHA-256 hash in DB, enforces 15-minute expiration, single-use via `FOR UPDATE`, and uniform anti-enumeration responses.
  - **A08 (Integrity):** Mass-assignment protection via strict Pydantic schemas.
  - **A10 (SSRF):** No outgoing requests triggered by user inputs.
- **Gaps & Defects:**
  1. **Information Leakage (A05):** `except Exception as exc: raise HTTPException(status_code=500, detail=f"Database ... error: {str(exc)}")` leaks internal database schema/driver messages.
  2. **Missing Rate Limiting (A04/A07):** Neither `slowapi` nor in-memory/Redis token-bucket rate limiting is configured for `/auth/login` or `/auth/forgot-password`.
  3. **Missing Audit Logging (A09):** The `governance.audit_events` table in PostgreSQL is unused by the API. Security events (logins, failed attempts, password resets) are not recorded.

### Requirement R3: Identity Federation (Google & GitHub)
- **Status:** **Partially Implemented with Critical Security Defect**
- **What is Implemented:**
  - Relational decoupling exists via `public.external_accounts` linked to `public.users(id)` with a `UNIQUE(provider, provider_user_id)` constraint.
  - New user creation via OAuth defaults to `role: 'client'`.
  - Providers catalog endpoint `GET /auth/oauth/providers` returns compliance metadata.
- **Gaps & Defects:**
  1. **CRITICAL DEFECT — Admin Privilege Escalation:** When an existing user has `role: 'admin'`, calling `POST /auth/oauth/login` with that user's email links the external account and issues a token with `role: "admin"`. This violates the strict requirement: *"Asignación estricta del rol client (prohibición absoluta de escalación de privilegios hacia admin desde proveedores sociales)"*.
  2. **Mock Payload instead of Authorization Code Exchange:** `POST /auth/oauth/login` accepts untrusted profile JSON (`provider_user_id`, `email`, `full_name`) from the client rather than exchanging an authorization `code` or verifying a cryptographic ID token signature.
  3. **GitHub Omission in Providers Catalog:** `GET /auth/oauth/providers` only lists `google`, `facebook`, `instagram`, `microsoft`. It omits `github`.
  4. **Frontend Integration Gap:** `apps/web/src/app/login/page.tsx` lacks a GitHub login button.

---

## 5. Architectural & Implementation Recommendations

1. **Fix OAuth Admin Escalation Immediately:**
   In `POST /auth/oauth/login` (and any new OAuth exchange endpoints):
   - Reject OAuth login if the matching existing account is an `admin` (`if existing_user["role"] == "admin": raise HTTPException(status_code=403, detail="Las cuentas de administrador no pueden autenticarse mediante proveedores sociales.")`), OR
   - Force session token role to `'client'` unconditionally: `"role": "client"`.
2. **Implement Catalog & Services Endpoints:**
   Add `GET /catalog/products` and `GET /catalog/services` in `main.py` querying `catalog.products`, `catalog.categories`, and `catalog.variant_prices` with indexed joins, `<350ms` response times, and controlled 503 fallback.
3. **Add GitHub to OAuth Providers:**
   Include GitHub in `GET /auth/oauth/providers` and add the GitHub button in `apps/web/src/app/login/page.tsx`.
4. **Implement Backend Code Exchange Routes:**
   Provide endpoints (e.g. `POST /auth/oauth/google` and `POST /auth/oauth/github`) that exchange an authorization `code` with the upstream provider or verify ID token integrity.
5. **Sanitize 500 Error Responses:**
   Replace `detail=f"...: {str(exc)}"` with a generic error message (e.g. `detail="Error interno del servidor al procesar la solicitud"`) to eliminate database error leakage.
6. **Add Audit Logging to `governance.audit_events`:**
   Insert audit records for login, password reset, and registration events into `governance.audit_events`.
