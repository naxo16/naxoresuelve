"""
Suite de Pruebas de Identidad, Registro, Recuperación de Clave y OAuth.
Cumplimiento normativo de la República de Chile (Ley 19.628, 21.719 y 21.663) y OWASP Top 10.
"""

import pytest
from starlette.testclient import TestClient

from apps.api.main import app

client = TestClient(app)


class TestAuthRegistration:
    """Pruebas de registro de usuarios y consentimiento informado (Ley 19.628)."""

    def test_registro_rechaza_sin_aceptar_terminos_400(self):
        """El registro debe exigir consentimiento expreso; si accept_terms es False se bloquea con 400."""
        payload = {
            "full_name": "Usuario Sin Consentimiento",
            "email": "sin.consentimiento@empresa.cl",
            "password": "PasswordSegura2026!",
            "accept_terms": False,
        }
        res = client.post("/auth/register", json=payload)
        assert res.status_code == 400
        assert "Ley 19.628" in res.json().get("detail", "")

    def test_registro_rechaza_password_corta_422(self):
        """Contraseñas menores a 8 caracteres son bloqueadas por Pydantic v2."""
        payload = {
            "full_name": "Usuario Clave Corta",
            "email": "clave.corta@empresa.cl",
            "password": "123",
            "accept_terms": True,
        }
        res = client.post("/auth/register", json=payload)
        assert res.status_code == 422

    def test_registro_rechaza_email_invalido_422(self):
        """Emails no válidos según RFC 5322 son rechazados."""
        payload = {
            "full_name": "Usuario Email Invalido",
            "email": "correo-sin-arroba",
            "password": "PasswordSegura2026!",
            "accept_terms": True,
        }
        res = client.post("/auth/register", json=payload)
        assert res.status_code == 422

    def test_registro_controla_503_sin_db(self):
        """Registro sin pool activo responde 503 controlado sin caídas."""
        payload = {
            "full_name": "Cliente Resiliencia",
            "email": "resiliencia@empresa.cl",
            "password": "PasswordSegura2026!",
            "accept_terms": True,
        }
        res = client.post("/auth/register", json=payload)
        assert res.status_code in (201, 503)

    def test_registro_exitoso_y_duplicado_con_db(self):
        """Con pool activo, un usuario nuevo se registra (201) y reintentar con mismo correo da 409."""
        email_test = "cliente.nuevo.2026@naxoresuelve.cl"
        payload = {
            "full_name": "Cliente Nuevo Formal",
            "email": email_test,
            "password": "MiPasswordRobusta2026!",
            "accept_terms": True,
            "accept_marketing": False,
        }
        with TestClient(app) as live_client:
            res = live_client.post("/auth/register", json=payload)
            assert res.status_code in (201, 409)
            if res.status_code == 201:
                assert "access_token" in res.json()
                assert res.json()["user"]["role"] == "client"

            # Reintento
            res_dup = live_client.post("/auth/register", json=payload)
            assert res_dup.status_code == 409
            assert "Ya existe una cuenta" in res_dup.json().get("detail", "")


class TestPasswordRecovery:
    """Pruebas de recuperación criptográfica de contraseñas (OWASP A07 & Ley 21.663)."""

    def test_solicitud_recuperacion_controla_503_sin_db(self):
        """Solicitud de recuperación sin DB responde 503 sin crashear."""
        res = client.post("/auth/forgot-password", json={"email": "alguien@correo.cl"})
        assert res.status_code in (200, 503)

    def test_solicitud_recuperacion_respuesta_uniforme_con_db(self):
        """Tanto correos existentes como inexistentes retornan respuesta homogénea para evitar enumeración."""
        with TestClient(app) as live_client:
            # Correo que no existe
            res_fake = live_client.post("/auth/forgot-password", json={"email": "nadie.fantasma.2026@correo.cl"})
            assert res_fake.status_code == 200
            assert "Si la dirección de correo electrónico está registrada" in res_fake.json().get("message", "")

            # Correo que sí existe
            res_real = live_client.post("/auth/forgot-password", json={"email": "admin@naxoresuelve.cl"})
            assert res_real.status_code == 200
            token_sim = res_real.json().get("reset_token_simulated")
            assert token_sim is not None
            assert len(token_sim) > 20

    def test_flujo_completo_reset_password_y_uniuso_con_db(self):
        """Flujo de canje de token: exitoso la primera vez, bloqueado al segundo intento (uniuso)."""
        email_target = "admin@naxoresuelve.cl"
        with TestClient(app) as live_client:
            req_token = live_client.post("/auth/forgot-password", json={"email": email_target})
            raw_token = req_token.json().get("reset_token_simulated")

            nueva_clave = "NuevaAdminPassword2026!"
            payload_reset = {
                "token": raw_token,
                "new_password": nueva_clave,
            }

            # 1. Canje exitoso
            res_reset = live_client.post("/auth/reset-password", json=payload_reset)
            assert res_reset.status_code == 200
            assert "Contraseña actualizada exitosamente" in res_reset.json().get("message", "")

            # 2. Reintento con mismo token (debe fallar con 400 por uniuso)
            res_reuse = live_client.post("/auth/reset-password", json=payload_reset)
            assert res_reuse.status_code == 400
            assert "inválido, ha expirado o ya fue utilizado" in res_reuse.json().get("detail", "")

            # 3. Comprobar que el usuario puede hacer login con la nueva contraseña
            res_login = live_client.post("/auth/login", json={"email": email_target, "password": nueva_clave})
            assert res_login.status_code == 200
            assert "access_token" in res_login.json()


class TestOAuthFederation:
    """Pruebas de federación de identidad social (Google, Facebook, Instagram, Microsoft)."""

    def test_catalogo_proveedores_oauth_activos(self):
        """El endpoint público /auth/oauth/providers lista los proveedores soportados y su marco normativo."""
        res = client.get("/auth/oauth/providers")
        assert res.status_code == 200
        data = res.json()
        assert "Ley 19.628" in data["legal_framework"]
        ids = [p["id"] for p in data["providers"]]
        assert "google" in ids
        assert "facebook" in ids
        assert "instagram" in ids
        assert "microsoft" in ids

    def test_oauth_login_rechaza_proveedor_no_soportado_400(self):
        """Proveedores desconocidos son rechazados con 400."""
        payload = {
            "provider": "proveedor_inseguro",
            "provider_user_id": "123456",
            "email": "test@oauth.cl",
            "full_name": "Usuario Test",
            "accept_terms": True,
        }
        res = client.post("/auth/oauth/login", json=payload)
        assert res.status_code == 400
        assert "Proveedor no soportado" in res.json().get("detail", "")

    def test_oauth_login_crea_cuenta_con_rol_client(self):
        """Autenticación vía Google/Gmail crea cuenta asociada y emite JWT con rol 'client'."""
        payload = {
            "provider": "google",
            "provider_user_id": "google-uid-99887766",
            "email": "usuario.gmail@gmail.com",
            "full_name": "Usuario Google Valdés",
            "accept_terms": True,
        }
        with TestClient(app) as live_client:
            res = live_client.post("/auth/oauth/login", json=payload)
            assert res.status_code == 200
            data = res.json()
            assert "access_token" in data
            assert data["user"]["role"] == "client"
            assert data["user"]["email"] == "usuario.gmail@gmail.com"

            # Re-login con la misma cuenta externa debe ser idempotente
            res_relogin = live_client.post("/auth/oauth/login", json=payload)
            assert res_relogin.status_code == 200
            assert res_relogin.json()["user"]["id"] == data["user"]["id"]
