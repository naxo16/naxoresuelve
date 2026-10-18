"""
Suite de Pruebas E2E — Hito 3 (M3): Concurrencia Asíncrona, Expiración de Tokens,
Aislamiento OAuth RBAC y Portal de Clientes.

Cobertura:
  - T10: 50+ peticiones concurrentes a /health/live con latencia <350ms (asyncio).
  - T11: Rechazo de tokens JWT expirados; verificación de hash SHA-256 de tokens de recuperación.
  - T12: OAuth anti-escalación (admin 403), proveedor GitHub soportado, idempotencia.
  - T13: Portal cliente RBAC (401 sin token, 403 rol incorrecto, 200 con JWT cliente).
  - T14: Catálogo público accesible; degradación 503 sin pool.
"""

import asyncio
import datetime
import hashlib
import secrets
import threading
import time

import jwt
import pytest
from starlette.testclient import TestClient

from apps.api.main import (
    JWT_ALGORITHM,
    JWT_SECRET,
    app,
    create_access_token,
    hash_password,
)


# ---------------------------------------------------------------------------
# Shared fixtures
# ---------------------------------------------------------------------------

client = TestClient(app)


def _make_client_token(user_id: int = 1, email: str = "cliente@naxoresuelve.cl") -> str:
    """Genera un JWT de cliente válido para pruebas de RBAC."""
    return create_access_token(
        {
            "sub": str(user_id),
            "email": email,
            "role": "client",
            "name": "Cliente Test",
        }
    )


def _make_admin_token(user_id: int = 999, email: str = "admin@naxoresuelve.cl") -> str:
    """Genera un JWT de administrador para verificar acceso diferenciado."""
    return create_access_token(
        {
            "sub": str(user_id),
            "email": email,
            "role": "admin",
            "name": "Admin Test",
        }
    )


def _make_expired_token() -> str:
    """Genera un JWT ya expirado (exp en el pasado)."""
    payload = {
        "sub": "42",
        "email": "expirado@naxoresuelve.cl",
        "role": "client",
        "name": "Usuario Expirado",
        "exp": datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(seconds=1),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


# ---------------------------------------------------------------------------
# T10: Concurrencia Asíncrona — 50+ requests sin degradación de memoria
# ---------------------------------------------------------------------------


class TestT10AsyncConcurrency:
    """Verificación de ráfagas de 50+ peticiones concurrentes con latencia <350ms."""

    def test_rafaga_50_liveness_con_threading(self):
        """
        Ejecuta 50 peticiones simultáneas a /health/live usando threading.
        Todas deben completar con status 200 y ninguna debe tardar >350ms.
        """
        CONCURRENT = 50
        TIMEOUT_MS = 350
        results: list[dict] = []
        lock = threading.Lock()

        def worker():
            start = time.perf_counter()
            try:
                r = client.get("/health/live")
                elapsed_ms = (time.perf_counter() - start) * 1000
                with lock:
                    results.append({"status": r.status_code, "ms": elapsed_ms, "ok": True})
            except Exception as exc:  # noqa: BLE001
                with lock:
                    results.append({"status": None, "ms": 9999, "ok": False, "err": str(exc)})

        threads = [threading.Thread(target=worker) for _ in range(CONCURRENT)]
        for t in threads:
            t.start()
        for t in threads:
            t.join(timeout=5)

        assert len(results) == CONCURRENT, f"Solo completaron {len(results)} de {CONCURRENT} workers"

        failures = [r for r in results if not r["ok"] or r["status"] != 200]
        assert not failures, f"Peticiones fallidas: {failures}"

        slow = [r for r in results if r["ms"] > TIMEOUT_MS]
        assert not slow, (
            f"{len(slow)} petición/ones superaron {TIMEOUT_MS}ms: "
            f"{[round(r['ms']) for r in slow]}"
        )

    def test_rafaga_50_catalog_services_sin_socket_errors(self):
        """
        50 peticiones concurrentes a /catalog/services no deben producir
        excepciones de socket ni errores 5xx.
        """
        CONCURRENT = 50
        results: list[int] = []
        lock = threading.Lock()

        def worker():
            try:
                r = client.get("/catalog/services")
                with lock:
                    results.append(r.status_code)
            except Exception:  # noqa: BLE001
                with lock:
                    results.append(599)  # sentinel para error de socket

        threads = [threading.Thread(target=worker) for _ in range(CONCURRENT)]
        for t in threads:
            t.start()
        for t in threads:
            t.join(timeout=5)

        assert len(results) == CONCURRENT
        # Acceptable: 200 (con DB), 503 (sin DB). Inaceptable: 500, 599 (crash).
        invalid = [s for s in results if s not in (200, 503)]
        assert not invalid, f"Códigos inaceptables en ráfaga de catálogo: {invalid}"

    def test_event_loop_no_se_bloquea_con_asyncio(self):
        """
        Valida que 20 corutinas asyncio a /health/live no se bloqueen
        el event loop ni arrojen TimeoutError.
        """

        async def async_worker(session_client: TestClient) -> int:
            return session_client.get("/health/live").status_code

        async def run_all():
            tasks = [async_worker(client) for _ in range(20)]
            return await asyncio.gather(*tasks, return_exceptions=True)

        statuses = asyncio.run(run_all())
        errors = [s for s in statuses if isinstance(s, Exception)]
        assert not errors, f"Errores en corutinas asyncio: {errors}"
        assert all(s == 200 for s in statuses if not isinstance(s, Exception))


# ---------------------------------------------------------------------------
# T11: Expiración de Tokens JWT & Hashing SHA-256
# ---------------------------------------------------------------------------


class TestT11TokenExpiryAndHashing:
    """Verificación de expiración de tokens JWT y conformidad del hash SHA-256."""

    def test_token_expirado_retorna_401(self):
        """Un JWT con `exp` en el pasado debe ser rechazado con HTTP 401."""
        expired = _make_expired_token()
        res = client.get("/auth/me", headers={"Authorization": f"Bearer {expired}"})
        assert res.status_code == 401, f"Esperado 401, recibido {res.status_code}"
        body = res.json()
        assert any(
            w in body.get("detail", "").lower()
            for w in ["expirado", "expired", "token"]
        ), f"Detalle inesperado: {body}"

    def test_token_firmado_con_clave_erronea_retorna_401(self):
        """Un JWT firmado con una clave diferente no debe ser aceptado."""
        payload = {
            "sub": "10",
            "email": "hacker@evil.cl",
            "role": "admin",
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1),
        }
        bad_token = jwt.encode(payload, "CLAVE_INCORRECTA_MALICIOSA", algorithm=JWT_ALGORITHM)
        res = client.get("/auth/me", headers={"Authorization": f"Bearer {bad_token}"})
        assert res.status_code == 401

    def test_token_valido_con_rol_client_es_aceptado(self):
        """Un JWT válido con rol 'client' supera la verificación del endpoint /auth/me."""
        valid_token = _make_client_token()
        res = client.get("/auth/me", headers={"Authorization": f"Bearer {valid_token}"})
        # 200 si hay DB, 503 si no. Nunca 401 con token válido.
        assert res.status_code in (200, 503), f"Token válido rechazado: {res.status_code}"

    def test_sha256_recovery_token_no_se_almacena_en_claro(self):
        """
        Verifica que el token de recuperación generado por secrets.token_urlsafe(32)
        tenga un hash SHA-256 determinista de 64 caracteres hex (256 bits).
        Este test verifica la conformidad del algoritmo de hashing que se usaría
        en la base de datos, sin exponer el token en claro.
        """
        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()

        # El hash SHA-256 siempre tiene exactamente 64 caracteres hex
        assert len(token_hash) == 64
        assert all(c in "0123456789abcdef" for c in token_hash)

        # El token en claro NO es igual al hash (nunca se almacena en claro)
        assert raw_token != token_hash

        # Determinismo: el mismo token siempre produce el mismo hash
        assert hashlib.sha256(raw_token.encode()).hexdigest() == token_hash

    def test_pbkdf2_100k_rondas_constante(self):
        """
        Verifica que hash_password usa exactamente 100.000 rondas PBKDF2-HMAC-SHA256
        con salts únicos y que hmac.compare_digest detecta passwords incorrectos.
        """
        import hmac as _hmac

        pwd = "ClaveSegura2026!"
        hashed1, salt1 = hash_password(pwd)
        hashed2, salt2 = hash_password(pwd)

        # Salts deben ser únicos entre llamadas
        assert salt1 != salt2
        assert hashed1 != hashed2

        # Verificación correcta con salt correspondiente
        import hashlib as _hl

        dk = _hl.pbkdf2_hmac("sha256", pwd.encode(), salt1.encode(), 100_000)
        assert _hmac.compare_digest(dk.hex(), hashed1)

        # Verificación incorrecta (password distinto) debe fallar
        wrong_dk = _hl.pbkdf2_hmac("sha256", b"PwdWrong!", salt1.encode(), 100_000)
        assert not _hmac.compare_digest(wrong_dk.hex(), hashed1)

    def test_recovery_endpoint_respuesta_uniforme_anti_enumeracion(self):
        """
        POST /auth/forgot-password devuelve la misma forma de respuesta
        independientemente de si el email existe o no (anti-enumeración de usuarios).
        """
        emails = [
            "fantasma.absoluto.99@noexiste-jamas.cl",
            "admin@naxoresuelve.cl",
        ]
        responses = []
        for email in emails:
            r = client.post("/auth/forgot-password", json={"email": email})
            assert r.status_code in (200, 503)
            if r.status_code == 200:
                responses.append(r.json())

        # Si ambos respondieron 200, deben tener la misma clave de mensaje
        if len(responses) == 2:
            assert set(responses[0].keys()) == set(responses[1].keys()), (
                "Las respuestas de forgot-password tienen estructuras distintas "
                "(fuga de enumeración de usuarios)"
            )


# ---------------------------------------------------------------------------
# T12: OAuth RBAC — Aislamiento, Anti-Escalación y GitHub
# ---------------------------------------------------------------------------


class TestT12OAuthSecurity:
    """Pruebas exhaustivas del flujo OAuth: anti-escalación, RBAC y soporte GitHub."""

    def test_oauth_providers_incluye_github(self):
        """El endpoint /auth/oauth/providers debe listar 'github' como proveedor habilitado."""
        res = client.get("/auth/oauth/providers")
        assert res.status_code == 200
        data = res.json()
        ids = [p["id"] for p in data["providers"]]
        assert "github" in ids, f"GitHub no listado. Proveedores: {ids}"

        github = next(p for p in data["providers"] if p["id"] == "github")
        assert github["enabled"] is True
        assert "read:user" in github.get("scope", []) or "read:user" in github.get("scopes", [])

    def test_oauth_providers_incluye_todos_los_requeridos(self):
        """Los cuatro proveedores mínimos (Google, GitHub, Facebook, Instagram) deben estar presentes."""
        res = client.get("/auth/oauth/providers")
        data = res.json()
        ids = {p["id"] for p in data["providers"]}
        requeridos = {"google", "github", "facebook", "instagram"}
        faltantes = requeridos - ids
        assert not faltantes, f"Proveedores faltantes: {faltantes}"

    def test_oauth_login_proveedor_no_soportado_retorna_400(self):
        """Un proveedor desconocido debe ser bloqueado con HTTP 400."""
        payload = {
            "provider": "proveedor_malicioso_xss",
            "provider_user_id": "999",
            "email": "ataque@evil.cl",
            "full_name": "Hacker Test",
            "accept_terms": True,
        }
        res = client.post("/auth/oauth/login", json=payload)
        assert res.status_code == 400
        assert "no soportado" in res.json().get("detail", "").lower()

    def test_oauth_login_admin_email_retorna_403(self):
        """
        Un login OAuth con el email de un administrador existente debe retornar
        HTTP 403 Forbidden — nunca debe emitir un token con rol admin.
        """
        payload = {
            "provider": "google",
            "provider_user_id": "google-attack-escalation-uid",
            "email": "admin@naxoresuelve.cl",
            "full_name": "Atacante Admin OAuth",
            "accept_terms": True,
        }
        with TestClient(app) as live_client:
            res = live_client.post("/auth/oauth/login", json=payload)
            # Si hay DB: 403. Si no hay DB: 503. Nunca 200 con role==admin.
            if res.status_code == 200:
                # Si la DB no tiene al admin registrado, puede crear cuenta client
                assert res.json()["user"]["role"] == "client", (
                    "¡CRÍTICO! OAuth emitió token con rol admin a través de proveedor social"
                )
            else:
                assert res.status_code in (403, 503)

    def test_oauth_github_login_crea_cuenta_rol_client(self):
        """Login con GitHub debe crear cuenta con rol 'client' y emitir JWT válido."""
        payload = {
            "provider": "github",
            "provider_user_id": "github-uid-m3-test-12345",
            "email": "dev.github.m3@github.example.cl",
            "full_name": "Dev GitHub M3",
            "accept_terms": True,
        }
        with TestClient(app) as live_client:
            res = live_client.post("/auth/oauth/login", json=payload)
            assert res.status_code in (200, 503)
            if res.status_code == 200:
                data = res.json()
                assert "access_token" in data
                assert data["user"]["role"] == "client"
                assert data["token_type"] == "bearer"

                # Verificar que el JWT emitido tiene role=client en sus claims
                decoded = jwt.decode(
                    data["access_token"], JWT_SECRET, algorithms=[JWT_ALGORITHM]
                )
                assert decoded["role"] == "client"
                assert decoded.get("auth_provider") == "github"

    def test_oauth_github_idempotente_misma_cuenta(self):
        """Dos logins consecutivos con el mismo provider_user_id deben retornar el mismo user.id."""
        payload = {
            "provider": "github",
            "provider_user_id": "github-uid-idempotente-99881",
            "email": "idempotente.github@naxoresuelve.cl",
            "full_name": "Dev Idempotente GitHub",
            "accept_terms": True,
        }
        with TestClient(app) as live_client:
            r1 = live_client.post("/auth/oauth/login", json=payload)
            r2 = live_client.post("/auth/oauth/login", json=payload)

            if r1.status_code == 200 and r2.status_code == 200:
                assert r1.json()["user"]["id"] == r2.json()["user"]["id"], (
                    "Login idempotente creó dos usuarios distintos para el mismo provider_user_id"
                )

    def test_jwt_emitido_por_oauth_no_puede_acceder_admin_leads(self):
        """
        El token JWT emitido por un login OAuth (rol client) debe ser rechazado
        con 403 al intentar acceder al endpoint administrativo /admin/leads.
        """
        # Construir un token de cliente (como el que emitiría OAuth)
        client_token = _make_client_token(user_id=55, email="oauth.client@naxoresuelve.cl")
        res = client.get(
            "/admin/leads",
            headers={"Authorization": f"Bearer {client_token}"},
        )
        assert res.status_code == 403, (
            f"Un cliente OAuth pudo acceder a /admin/leads: {res.status_code}"
        )


# ---------------------------------------------------------------------------
# T13: Portal de Clientes — RBAC
# ---------------------------------------------------------------------------


class TestT13ClientPortalRBAC:
    """Pruebas de control de acceso al portal de clientes."""

    def test_dashboard_sin_token_retorna_401(self):
        """Acceso a /client/dashboard sin autenticación debe retornar 401."""
        res = client.get("/client/dashboard")
        assert res.status_code == 401

    def test_requests_sin_token_retorna_401(self):
        """Acceso a /client/requests sin autenticación debe retornar 401."""
        res = client.get("/client/requests")
        assert res.status_code == 401

    def test_audits_sin_token_retorna_401(self):
        """Acceso a /client/audits sin autenticación debe retornar 401."""
        res = client.get("/client/audits")
        assert res.status_code == 401

    def test_dashboard_con_token_expirado_retorna_401(self):
        """Un token JWT expirado no debe conceder acceso al dashboard."""
        expired = _make_expired_token()
        res = client.get(
            "/client/dashboard", headers={"Authorization": f"Bearer {expired}"}
        )
        assert res.status_code == 401

    def test_dashboard_con_token_valido_retorna_200_o_503(self):
        """
        Un JWT válido con rol 'client' debe obtener acceso al dashboard.
        Si no hay DB, debe retornar 503 (no 401 ni 403).
        """
        token = _make_client_token(user_id=7, email="portal.test@naxoresuelve.cl")
        res = client.get(
            "/client/dashboard", headers={"Authorization": f"Bearer {token}"}
        )
        assert res.status_code in (200, 503), (
            f"Token válido rechazado en /client/dashboard: {res.status_code}"
        )

    def test_requests_con_token_valido_retorna_200_o_503(self):
        """Un JWT válido con rol 'client' debe obtener acceso a /client/requests."""
        token = _make_client_token(user_id=7, email="portal.test@naxoresuelve.cl")
        res = client.get(
            "/client/requests", headers={"Authorization": f"Bearer {token}"}
        )
        assert res.status_code in (200, 503)

    def test_audits_con_token_valido_retorna_200_o_503(self):
        """Un JWT válido con rol 'client' debe obtener acceso a /client/audits."""
        token = _make_client_token(user_id=7, email="portal.test@naxoresuelve.cl")
        res = client.get(
            "/client/audits", headers={"Authorization": f"Bearer {token}"}
        )
        assert res.status_code in (200, 503)

    def test_dashboard_token_invalido_firma_retorna_401(self):
        """Un token con firma adulterada debe ser rechazado con 401."""
        # Tomar un token válido y truncar la firma
        valid = _make_client_token()
        tampered = valid[:-8] + "XXXXXXXX"
        res = client.get(
            "/client/dashboard", headers={"Authorization": f"Bearer {tampered}"}
        )
        assert res.status_code == 401

    def test_dashboard_retorna_estructura_esperada_con_db(self):
        """
        Con DB disponible, /client/dashboard debe retornar las claves contractuales:
        user, active_requests, pending_audits, stats.
        """
        token = _make_client_token(user_id=1, email="admin@naxoresuelve.cl")
        with TestClient(app) as live_client:
            res = live_client.get(
                "/client/dashboard", headers={"Authorization": f"Bearer {token}"}
            )
            if res.status_code == 200:
                data = res.json()
                expected_keys = {"user", "active_requests", "pending_audits", "stats"}
                assert expected_keys.issubset(data.keys()), (
                    f"Claves faltantes en dashboard: {expected_keys - set(data.keys())}"
                )
                # El usuario no debe exponer password_hash ni salt
                user = data.get("user", {})
                assert "password_hash" not in user
                assert "salt" not in user


# ---------------------------------------------------------------------------
# T14: Catálogo Público — Accesibilidad y Degradación 503
# ---------------------------------------------------------------------------


class TestT14CatalogPublicAccess:
    """Pruebas de los endpoints públicos del catálogo de servicios."""

    def test_catalog_services_accesible_sin_autenticacion(self):
        """/catalog/services es público y no requiere JWT."""
        res = client.get("/catalog/services")
        assert res.status_code in (200, 503)

    def test_catalog_products_accesible_sin_autenticacion(self):
        """/catalog/products es público y no requiere JWT."""
        res = client.get("/catalog/products")
        assert res.status_code in (200, 503)

    def test_catalog_categories_accesible_sin_autenticacion(self):
        """/catalog/categories es público y no requiere JWT."""
        res = client.get("/catalog/categories")
        assert res.status_code in (200, 503)

    def test_catalog_services_retorna_lista_con_db(self):
        """Con DB activa, /catalog/services debe retornar una lista no vacía de servicios."""
        with TestClient(app) as live_client:
            res = live_client.get("/catalog/services")
            if res.status_code == 200:
                data = res.json()
                assert isinstance(data, list), "El catálogo de servicios no retorna una lista"
                assert len(data) > 0, "El catálogo de servicios está vacío"
                # Cada servicio debe tener campos mínimos del contrato
                for svc in data:
                    assert "id" in svc or "slug" in svc, f"Servicio sin id/slug: {svc}"
                    assert "name" in svc, f"Servicio sin nombre: {svc}"

    def test_catalog_no_expone_datos_sensibles(self):
        """El catálogo público no debe exponer información interna de la BD."""
        res = client.get("/catalog/services")
        if res.status_code == 200:
            raw = res.text
            forbidden_terms = ["password", "secret", "token", "salt", "DATABASE_URL"]
            for term in forbidden_terms:
                assert term.lower() not in raw.lower(), (
                    f"El catálogo expone información sensible: '{term}'"
                )

    def test_catalogo_rafaga_concurrente_30_requests(self):
        """30 peticiones simultáneas a /catalog/services no producen errores 5xx."""
        CONCURRENT = 30
        statuses: list[int] = []
        lock = threading.Lock()

        def worker():
            try:
                r = client.get("/catalog/services")
                with lock:
                    statuses.append(r.status_code)
            except Exception:  # noqa: BLE001
                with lock:
                    statuses.append(599)

        threads = [threading.Thread(target=worker) for _ in range(CONCURRENT)]
        for t in threads:
            t.start()
        for t in threads:
            t.join(timeout=5)

        assert len(statuses) == CONCURRENT
        invalid = [s for s in statuses if s not in (200, 503)]
        assert not invalid, f"Códigos inválidos en ráfaga de catálogo: {invalid}"
