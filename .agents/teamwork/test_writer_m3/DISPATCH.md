## 2026-10-18T06:56:53Z
You are the E2E Test Writer for Milestone M3 of the 'naxoresuelve' platform overhaul.
Your working directory is: C:\Apache64\Apache24\htdocs\naxoresuelve\.agents\teamwork\test_writer_m3

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

You MUST read:
1. C:\Apache64\Apache24\htdocs\naxoresuelve\.agents\teamwork\ORIGINAL_REQUEST.md
2. C:\Apache64\Apache24\htdocs\naxoresuelve\PROJECT.md
3. C:\Apache64\Apache24\htdocs\naxoresuelve\AGENTS.md
4. C:\Apache64\Apache24\htdocs\naxoresuelve\GEMINI.md
5. C:\Apache64\Apache24\htdocs\naxoresuelve\apps\api\main.py
6. C:\Apache64\Apache24\htdocs\naxoresuelve\.agents\teamwork\explorer_survey_3\analysis.md
7. C:\Apache64\Apache24\htdocs\naxoresuelve\.agents\teamwork\worker_m1\handoff.md
8. C:\Apache64\Apache24\htdocs\naxoresuelve\.agents\teamwork\worker_m2\handoff.md

WRITE OWNERSHIP:
You EXCLUSIVELY write files in `C:\Apache64\Apache24\htdocs\naxoresuelve\tests\` and root metadata files `TEST_INFRA.md` and `TEST_READY.md`.
Do NOT modify production source code in `apps/api/` or `apps/web/`.

YOUR TASKS:
Design and implement a comprehensive test suite across Tiers 1-4 to achieve complete, rigorous verification of Requirements R1-R5:
1. `tests/test_async_concurrency_and_latency.py`:
   - True asynchronous concurrency test: 50+ concurrent requests using `asyncio.gather` and `httpx.AsyncClient` targeting `/health/live`, `/catalog/services`, `/catalog/products`.
   - Latency benchmark test: Assert each request elapsed time is < 350ms.
   - Resilience test: Controlled degradation HTTP 503 when pool is uninitialized.
   - Resource stability: Ensure zero socket leaks and zero unhandled exceptions under bursts.
2. `tests/test_oauth_security_and_federation.py`:
   - Anti-escalation test: Prove that `POST /auth/oauth/login` with an existing administrator email (`pablovaldescontacto@gmail.com` or `admin@naxoresuelve.cl`) returns HTTP 403 Forbidden.
   - Client role enforcement: Prove that any successful social OAuth login strictly issues a session with `role == 'client'`.
   - GitHub provider test: Verify `GET /auth/oauth/providers` returns `github` with icon, scopes, and auth URL.
   - GitHub login test: Verify `POST /auth/oauth/login` accepts `provider: "github"`.
   - Idempotency & edge cases: Verify duplicate OAuth logins, missing terms rejection (HTTP 422/400).
3. `tests/test_catalog_and_portal_api.py`:
   - Catalog reading: Verify `GET /catalog/products`, `GET /catalog/services` (15 services with pricing and deliverables), `GET /catalog/categories`.
   - Client portal auth: Verify `GET /client/dashboard` returns 401 without Bearer token, returns 200 with valid JWT containing user profile, active requests, and audits.
   - Role enforcement: Verify client and admin access rules.
   - Controlled degradation: Verify 503 fallback when DB pool is disconnected.
4. `tests/test_crypto_token_and_expiry.py`:
   - Expiry test: Verify password reset token created with expiration in the past (>15 mins ago) is rejected with HTTP 400.
   - Uniuso test: Verify token cannot be redeemed twice.
   - Database storage test: Verify in PostgreSQL that tokens are stored strictly as SHA-256 hashes (`token_hash`), never plaintext.
   - Anti-enumeration test: Verify `POST /auth/forgot-password` returns identical 200 response whether email exists or not.
   - OWASP headers & sanitization: Verify HSTS, nosniff, DENY headers, and verify HTTP 500 error responses contain zero `str(exc)` or driver leak strings.
5. Create `TEST_INFRA.md` at project root with methodology, feature inventory, and tier counts.
6. Create `TEST_READY.md` at project root with runner command (`pytest -v`), tier breakdown, and test readiness declaration.

VERIFICATION:
Execute `pytest -v` from project root. ALL tests (existing 79 tests + new tests) MUST PASS 100% in GREEN (0 failures, 0 errors, 0 skipped, 0 modified to hide failures).
Deliver your completion report to `C:\Apache64\Apache24\htdocs\naxoresuelve\.agents\teamwork\test_writer_m3\handoff.md`.
Follow the Handoff Protocol (Observation, Logic Chain, Caveats, Conclusion, Verification Method).
When finished, send a message to parent with summary and file path.
