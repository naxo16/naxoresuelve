"""
Suite de Pruebas Rudas (Stress, Fuzzing & Resilience Testing) para naxoresuelve API.

Filosofía:
'No es un caso de éxito si no aprueba el testing riguroso.'
"""

import pytest
from fastapi.testclient import TestClient

from apps.api.main import app

client = TestClient(app)


class TestPruebasRudasFuzzing:
    """Batería de pruebas de inyección de datos corruptos, límites y sanitización."""

    def test_rechazo_payload_completamente_vacio(self):
        """Un payload vacío debe ser rechazado atómicamente con 422."""
        res = client.post("/leads", json={})
        assert res.status_code == 422

    @pytest.mark.parametrize(
        "invalid_email",
        [
            "not-an-email",
            "@missinguser.com",
            "user@",
            "user@domain..com",
            "   ",
            "user name@domain.com",
            "DROP TABLE leads;--",
            "null",
            "",
        ],
    )
    def test_fuzzing_emails_corruptos(self, invalid_email):
        """Garantiza que ningún email malformado o vector de inyección pase el validador."""
        payload = {
            "name": "Cliente Prueba Ruda",
            "email": invalid_email,
            "message": "Mensaje de prueba con longitud suficiente para superar el mínimo.",
        }
        res = client.post("/leads", json=payload)
        assert res.status_code == 422, f"Falló en rechazar email corrupto: {invalid_email}"

    @pytest.mark.parametrize(
        "short_name",
        ["", "a", " "],
    )
    def test_rechazo_nombre_demasiado_corto(self, short_name):
        """Nombres de menos de 2 caracteres deben ser bloqueados."""
        payload = {
            "name": short_name,
            "email": "test@empresa.cl",
            "message": "Mensaje válido para el test de nombres.",
        }
        res = client.post("/leads", json=payload)
        assert res.status_code == 422

    def test_rechazo_mensaje_demasiado_corto(self):
        """Mensajes vacíos o de menos de 5 caracteres no deben ingresar a la base."""
        payload = {
            "name": "Pablo Valdés",
            "email": "pablo@test.cl",
            "message": "hola",  # solo 4 chars
        }
        res = client.post("/leads", json=payload)
        assert res.status_code == 422

    def test_rechazo_buffer_overrun_mensaje_gigante(self):
        """Cargas excesivas (>5000 chars) deben ser rechazadas antes de agotar memoria."""
        payload = {
            "name": "Ataque de Buffer",
            "email": "buffer@test.cl",
            "message": "X" * 6000,
        }
        res = client.post("/leads", json=payload)
        assert res.status_code == 422

    def test_inyeccion_tipos_erroneos(self):
        """Inyección de arrays, diccionarios y números en campos de texto."""
        payload = {
            "name": {"objeto": "malicioso"},
            "email": 12345678,
            "message": ["lista", "no", "permitida"],
        }
        res = client.post("/leads", json=payload)
        assert res.status_code == 422


class TestPruebasRudasResiliencia:
    """Batería de pruebas de tolerancia a fallos y degradación controlada."""

    def test_liveness_inmune_a_caidas_de_red(self):
        """Liveness debe responder 200 en cualquier circunstancia operativa del proceso."""
        res = client.get("/health/live")
        assert res.status_code == 200
        assert res.json() == {"status": "live"}

    def test_readiness_reporta_503_sin_crashear_proceso(self):
        """Si la BD no está levantada, readiness no debe arrojar una excepción no capturada."""
        res = client.get("/health/ready")
        assert res.status_code == 503
        data = res.json()
        assert "detail" in data

    def test_creacion_leads_retorna_503_controlado_sin_db(self):
        """Si la BD no está disponible, /leads debe responder 503 controlado en vez de crashear."""
        valid_payload = {
            "name": "Auditoría Operativa",
            "email": "auditoria@empresa.com",
            "message": "Solicitud legítima de revisión de infraestructura y duplicidad.",
        }
        res = client.post("/leads", json=valid_payload)
        assert res.status_code == 503
        assert "Database service temporarily unavailable" in res.json().get("detail", "")

    def test_listado_leads_retorna_503_controlado_sin_db(self):
        """Listar leads sin pool activo responde 503 controlado."""
        res = client.get("/leads")
        assert res.status_code == 503


class TestPruebasRudasConcurrencia:
    """Simulación de ráfaga de peticiones para verificar no-bloqueo."""

    def test_rafaga_de_consultas_liveness(self):
        """Ejecuta 100 consultas consecutivas al endpoint de salud sin degradación."""
        for _ in range(100):
            res = client.get("/health/live")
            assert res.status_code == 200
