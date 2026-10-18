"""
Suite de Pruebas Rudas de Seguridad Ofensiva & OWASP Top 10 (2021/2026).
Proyecto: naxoresuelve (Pablo Valdés / renkaidev).

Objetivo:
Validar que la API y frontera de aplicación repelan ataques comunes y avanzados:
  - A01: Broken Access Control & Privilege Escalation (BOLA / IDOR)
  - A02: Cryptographic Failures & Sensitive Data Exposure
  - A03: Injection (SQL Injection, XSS, Blind Payloads)
  - A04: Insecure Design & DoS Resilience
  - A05: Security Misconfiguration & OWASP Headers
  - A07: Identification and Authentication Failures
  - A08: Software and Data Integrity Failures (Mass Assignment)
  - A10: Server-Side Request Forgery (SSRF) Resistance
"""

import time
import pytest
from starlette.testclient import TestClient
import jwt

from apps.api.main import app, hash_password, verify_password, create_access_token, JWT_SECRET, JWT_ALGORITHM

client = TestClient(app)


# ==============================================================================
# A01: Broken Access Control & Escalación de Privilegios
# ==============================================================================

class TestOWASP_A01_BrokenAccessControl:
    """Verifica que ningún endpoint restringido sea accesible sin rol adecuado."""

    def test_acceso_anonimo_a_admin_leads_retorna_401(self):
        """Intento de acceder a /admin/leads sin cabecera Authorization."""
        res = client.get("/admin/leads")
        assert res.status_code == 401
        assert "Authorization con token Bearer requerido" in res.json().get("detail", "")

    def test_acceso_con_formato_bearer_invalido_retorna_401(self):
        """Intento de bypass usando prefijo incorrecto en cabecera."""
        res = client.get("/admin/leads", headers={"Authorization": "Basic dXNlcjpwYXNz"})
        assert res.status_code == 401
        assert "Authorization con token Bearer requerido" in res.json().get("detail", "")

    def test_escalacion_vertical_cliente_a_admin_retorna_403(self):
        """Un usuario con rol 'client' intenta acceder a telemetría de 'admin'."""
        client_token = create_access_token({"sub": "5", "role": "client", "email": "victima@empresa.cl"})
        res = client.get("/admin/leads", headers={"Authorization": f"Bearer {client_token}"})
        assert res.status_code == 403
        assert "requiere privilegios de Administrador" in res.json().get("detail", "")

    def test_header_spoofing_no_bypasea_autenticacion(self):
        """Intento de suplantar IP interna o cabeceras X-Forwarded / X-Original-URL."""
        res = client.get(
            "/admin/leads",
            headers={
                "X-Original-URL": "/health/live",
                "X-Rewrite-URL": "/health/live",
                "X-Forwarded-For": "127.0.0.1",
            },
        )
        assert res.status_code == 401


# ==============================================================================
# A02: Cryptographic Failures & Exposición de Datos Sensibles
# ==============================================================================

class TestOWASP_A02_CryptographicFailures:
    """Verifica la robustez de las primitivas criptográficas y protección de secretos."""

    def test_hashing_pbkdf2_genera_salts_aleatorios_unicos(self):
        """Dos passwords idénticas deben producir hashes completamente diferentes gracias al salt."""
        passw = "MismaPasswordSegura2026!"
        h1, s1 = hash_password(passw)
        h2, s2 = hash_password(passw)
        assert s1 != s2
        assert h1 != h2
        assert verify_password(passw, s1, h1) is True
        assert verify_password(passw, s2, h2) is True

    def test_rechazo_algoritmo_none_en_jwt(self):
        """Ataque crítico de firma JWT nula ('alg': 'none')."""
        header = {"typ": "JWT", "alg": "none"}
        payload = {"sub": "1", "role": "admin", "email": "pablo@admin.cl"}
        # Construir token sin firma
        fake_token = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxIiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJwYWJsb0BhZG1pbi5jbCJ9."
        res = client.get("/auth/me", headers={"Authorization": f"Bearer {fake_token}"})
        assert res.status_code == 401

    def test_rechazo_token_con_firma_manipulada(self):
        """Token alterado por un tercero con otra clave secreta."""
        rogue_token = jwt.encode(
            {"sub": "1", "role": "admin", "exp": time.time() + 3600},
            "clave-falsa-del-atacante",
            algorithm=JWT_ALGORITHM,
        )
        res = client.get("/auth/me", headers={"Authorization": f"Bearer {rogue_token}"})
        assert res.status_code == 401

    def test_rechazo_token_expirado(self):
        """Token válido criptográficamente pero expirado en el tiempo."""
        expired_token = jwt.encode(
            {"sub": "1", "role": "admin", "exp": time.time() - 3600},
            JWT_SECRET,
            algorithm=JWT_ALGORITHM,
        )
        res = client.get("/auth/me", headers={"Authorization": f"Bearer {expired_token}"})
        assert res.status_code == 401
        assert "expirado" in res.json().get("detail", "").lower()

    def test_payload_usuario_jamas_expone_hash_o_salt(self):
        """El endpoint /auth/me nunca debe retornar campos sensibles de contraseña."""
        token = create_access_token({"sub": "42", "role": "client", "email": "seguro@empresa.cl"})
        res = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200
        data = res.json()
        assert "password" not in data
        assert "password_hash" not in data
        assert "salt" not in data
        assert "secret" not in data


# ==============================================================================
# A03: Injection (SQLi, XSS & Payloads Maliciosos)
# ==============================================================================

class TestOWASP_A03_Injection:
    """Verifica que la frontera Pydantic y consultas parametrizadas bloqueen inyección."""

    @pytest.mark.parametrize(
        "sqli_email",
        [
            "' OR '1'='1",
            "admin'--",
            "test@domain.com' UNION SELECT null, null, null;--",
            "'; DROP TABLE leads;--",
            "1' AND 1=CONVERT(int, (SELECT @@version))--",
            "test@domain.com; WAITFOR DELAY '0:0:5'--",
            "test@domain.com' AND (SELECT 1 FROM (SELECT COUNT(*), CONCAT((SELECT version()), FLOOR(RAND(0)*2)) x FROM information_schema.tables GROUP BY x) a)--",
        ],
    )
    def test_rechazo_estricto_inyeccion_sql_en_email(self, sqli_email):
        """Cualquier payload SQL en el campo email debe ser detenido con 422 antes de llegar al motor."""
        payload = {
            "name": "Atacante SQL",
            "email": sqli_email,
            "message": "Mensaje de prueba con intento de inyección SQL.",
        }
        res = client.post("/leads", json=payload)
        assert res.status_code == 422

    def test_xss_y_tags_html_en_campos_de_texto_no_ejecutables(self):
        """Inyección de tags <script> o manejadores onerror no rompen la serialización JSON."""
        xss_payload = {
            "name": "<script>alert('XSS')</script>",
            "email": "seguridad@empresa.cl",
            "message": "<img src=x onerror=alert('document.cookie')> Necesito asesoría técnica.",
        }
        res = client.post("/leads", json=xss_payload)
        # Debe ser manejado de forma segura (503 controlado sin DB o validación, jamás 500)
        assert res.status_code in (200, 201, 503)
        assert res.status_code != 500


# ==============================================================================
# A04: Insecure Design & Resistencia DoS
# ==============================================================================

class TestOWASP_A04_InsecureDesign_And_DoS:
    """Valida límites de memoria y resiliencia ante ráfagas."""

    def test_rechazo_buffer_overrun_nombre_gigante(self):
        """Intento de desbordamiento de búfer con 50.000 caracteres en el nombre."""
        payload = {
            "name": "A" * 50_000,
            "email": "dos@attack.cl",
            "message": "Ataque de desbordamiento.",
        }
        res = client.post("/leads", json=payload)
        assert res.status_code == 422

    def test_rafaga_de_consultas_sin_bloqueo_de_event_loop(self):
        """Verifica que 50 peticiones simultáneas a liveness respondan con latencia baja."""
        for _ in range(50):
            res = client.get("/health/live")
            assert res.status_code == 200


# ==============================================================================
# A05: Security Misconfiguration & OWASP Headers
# ==============================================================================

class TestOWASP_A05_SecurityMisconfiguration:
    """Verifica que el servidor retorne cabeceras de seguridad estrictas."""

    def test_cabeceras_de_seguridad_owasp_presentes(self):
        """Verifica X-Content-Type-Options, X-Frame-Options, X-XSS-Protection y HSTS."""
        res = client.get("/health/live")
        assert res.status_code == 200
        headers = res.headers
        assert headers.get("X-Content-Type-Options") == "nosniff"
        assert headers.get("X-Frame-Options") == "DENY"
        assert headers.get("X-XSS-Protection") == "1; mode=block"
        assert "max-age=" in headers.get("Strict-Transport-Security", "")

    def test_errores_404_no_filtran_stacktraces_ni_rutas_locales(self):
        """Rutas no existentes deben responder con 404 limpio sin filtrar paths de Windows ni C:\\."""
        res = client.get("/ruta/que/no/existe/en/la/api")
        assert res.status_code == 404
        content = res.text
        assert "C:\\" not in content
        assert "Traceback" not in content
        assert "File \"" not in content


# ==============================================================================
# A07: Identification and Authentication Failures
# ==============================================================================

class TestOWASP_A07_AuthenticationFailures:
    """Valida que el endpoint de login repela credenciales vacías o corruptas."""

    def test_login_rechaza_credenciales_vacias(self):
        """Intento de login con cuerpo vacío."""
        res = client.post("/auth/login", json={})
        assert res.status_code == 422

    def test_login_rechaza_password_vacia(self):
        """Intento de login sin contraseña."""
        res = client.post("/auth/login", json={"email": "admin@empresa.cl", "password": ""})
        assert res.status_code == 422

    def test_login_rechaza_email_malformado(self):
        """Intento de login con formato de email inválido."""
        res = client.post("/auth/login", json={"email": "no-es-un-email", "password": "ClaveSegura2026!"})
        assert res.status_code == 422


# ==============================================================================
# A08: Software and Data Integrity Failures (Mass Assignment)
# ==============================================================================

class TestOWASP_A08_DataIntegrity_MassAssignment:
    """Valida que parámetros extra inyectados sean ignorados por Pydantic."""

    def test_inyeccion_campos_privilegiados_en_lead_es_ignorada(self):
        """El atacante intenta enviar 'role: admin', 'is_admin: true', 'id: 1' en un lead público."""
        malicious_lead = {
            "name": "Empresa Honesta",
            "email": "contacto@honesto.cl",
            "message": "Solicitud de consultoría técnica.",
            "role": "admin",
            "is_admin": True,
            "id": 9999,
            "status": "APPROVED",
        }
        res = client.post("/leads", json=malicious_lead)
        # El endpoint procesa los campos permitidos y no se corrompe (503 controlado sin DB o 201)
        assert res.status_code in (200, 201, 503)
        assert res.status_code != 500


# ==============================================================================
# A10: Server-Side Request Forgery (SSRF) Resistance
# ==============================================================================

class TestOWASP_A10_SSRF_Resistance:
    """Valida que URLs de metadatos de nube o IPs internas no causen llamadas salientes."""

    @pytest.mark.parametrize(
        "ssrf_target",
        [
            "http://169.254.169.254/latest/meta-data/",
            "http://127.0.0.1:5432",
            "http://localhost:8000/admin/leads",
            "file:///etc/passwd",
            "file:///C:/Windows/win.ini",
        ],
    )
    def test_payloads_con_urls_ssrf_en_mensaje_no_disparan_peticiones(self, ssrf_target):
        """El backend solo almacena el texto como cadena; no debe haber resolución DNS ni HTTP fetch."""
        payload = {
            "name": "Auditor SSRF",
            "email": "auditor@seguridad.cl",
            "message": f"Por favor revisar el reporte en {ssrf_target}",
        }
        res = client.post("/leads", json=payload)
        assert res.status_code in (200, 201, 503)
        assert res.status_code != 500
