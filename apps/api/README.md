# 🚀 naxoresuelve Backend API — Documentación Técnica Canónica

> **Runtime:** Python 3.12+ | **Framework:** FastAPI | **Driver DB:** `asyncpg` (PostgreSQL 16+)  
> **Servidor ASGI:** Uvicorn (Puerto `3006`) | **Entorno:** `C:\Apache64\Apache24\htdocs\naxoresuelve\apps\api`  
> **Filosofía:** *"No es un caso de éxito si no aprueba el testing riguroso."*

---

## 🏛️ 1. Arquitectura y Entorno de Ejecución

El backend de **naxoresuelve** está diseñado como un monolito modular de alto rendimiento y resiliencia transaccional, ubicado en el árbol de servidor local `C:\Apache64\Apache24\htdocs\naxoresuelve`:

- **Integración Apache HTTP Server (`htdocs`):** Apache 2.4 puede configurarse como Reverse Proxy y SSL Terminator hacia Uvicorn en el puerto `3006` (`ProxyPass /api http://localhost:3006/`).
- **Control de Acceso a Datos:** Uso de pool asíncrono con `asyncpg` (`min_size=2`, `max_size=10`), asegurando que ninguna consulta bloquee el event loop de asyncio.
- **Degradación Suave (Chaos Engineering):** Ante interrupciones de base de datos o red, los endpoints de negocio responden con un código **HTTP 503 controlado** sin crashear el worker de Uvicorn ni exponer trazas de depuración del servidor (`Traceback`).

---

## 🩺 2. Endpoints de Salud y Diagnóstico (`/health`)

Los probes de salud siguen el estándar de orquestación de producción (Docker / Kubernetes):

### `GET /health/live` — Liveness Probe
- **Propósito:** Certificar que el proceso del worker de Python/Uvicorn está vivo y procesando peticiones en el event loop.
- **Resiliencia Crítica:** Este endpoint es **inmune** a caídas externas (base de datos caída, red offline). Siempre responde `200 OK`.
- **Respuesta (200 OK):**
  ```json
  {
    "status": "live"
  }
  ```

### `GET /health/ready` — Readiness Probe
- **Propósito:** Verificar que el backend tiene conectividad activa contra la base de datos PostgreSQL (`SELECT 1`).
- **Comportamiento ante Caídas:** Si el pool no está inicializado o la base de datos no responde, degrada inmediatamente a `503 Service Unavailable` sin propagar excepciones no controladas.
- **Respuesta exitosa (200 OK):**
  ```json
  {
    "status": "ready"
  }
  ```
- **Respuesta degradada (503 Service Unavailable):**
  ```json
  {
    "detail": "Database connection pool is not initialized"
  }
  ```

---

## 🔒 3. Seguridad, Criptografía y Autenticación (ADR-002)

### A. Hashing de Contraseñas (OWASP A02)
- **Algoritmo:** PBKDF2-HMAC-SHA256 con **100.000 rondas** y salting criptográfico aleatorio único de 16 bytes (`secrets.token_hex(16)`).
- **Protección contra Timing Attacks:** Las comparaciones se ejecutan mediante `hmac.compare_digest` para evitar ataques de canal lateral por análisis de tiempo.

### B. Tokens JWT (RFC 7519)
- Firma simétrica HMAC-SHA256 (`HS256`) con clave secreta (`JWT_SECRET`) cargada por `.env`.
- Verificación estricta de tiempo de expiración (`exp`) y descarte automático de algoritmos nulos (`alg: "none"`).

---

## 📋 4. Catálogo Completo de Endpoints

### Autenticación e Identidad
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Público | Autentica credenciales y genera token Bearer JWT. |
| `GET` | `/auth/me` | Autenticado | Retorna las claims y datos del usuario logueado. |

#### `POST /auth/login`
- **Request Body:**
  ```json
  {
    "email": "admin@naxoresuelve.cl",
    "password": "PasswordSegura2026!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "email": "admin@naxoresuelve.cl",
      "full_name": "Pablo Valdés",
      "role": "admin",
      "is_active": true,
      "created_at": "2026-10-17T23:00:00Z"
    }
  }
  ```

---

### Captación de Clientes y Leads (CRM)
| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/leads` | Público | Registra un nuevo lead con validación Pydantic v2 estricta. |
| `GET` | `/leads` | Público / Monitoreo | Lista leads existentes. |
| `GET` | `/admin/leads` | Privado (`role: admin`) | Listado administrativo protegido contra escalación vertical (403). |

#### `POST /leads`
- **Validaciones Sanitizadas:**
  - `name`: `min_length=2`, `max_length=150`.
  - `email`: Formato RFC 5322 estricto (`EmailStr`). Rechaza inyecciones SQL (`' OR '1'='1`) y caracteres de control.
  - `message`: `min_length=5`, `max_length=5000` (blindaje contra Buffer Overrun).
- **Request Body:**
  ```json
  {
    "name": "Empresa Cliente",
    "email": "contacto@empresa.cl",
    "message": "Solicitud de consultoría en optimización de base de datos."
  }
  ```

---

## 🛡️ 5. Cabeceras de Seguridad OWASP Aplicadas

Todas las respuestas del API inyectan automáticamente las siguientes cabeceras HTTP de protección:
- `X-Content-Type-Options: nosniff` (previene MIME type sniffing).
- `X-Frame-Options: DENY` (inmunidad contra ataques de Clickjacking).
- `X-XSS-Protection: 1; mode=block` (filtro XSS reflectivo).
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (HSTS).

---

## 🗄️ 6. Configuración de Base de Datos (`.env`)

El backend consume los parámetros de conexión vía `python-dotenv`:

```env
DATABASE_URL=postgresql://Postgre:Postgre_naxo@localhost:5432/Naxo_85721
JWT_SECRET=naxoresuelve-crypto-jwt-secret-key-2026-chile
HMAC_SECRET_KEY=naxoresuelve-hmac-master-privacy-key-2026-chile
ENVIRONMENT=development
PORT=3006
HOST=localhost
```

---

## 🧪 7. Ejecución y Validación de Pruebas

Para validar la suite completa de 60 pruebas de testing rudo:

```powershell
# En la raíz del proyecto
pytest -v
```

**Resultado canónico garantizado:**
- `tests/test_health.py`: 2/2 tests aprobados.
- `tests/test_owasp_security.py`: 30/30 tests aprobados (OWASP Top 10 completo).
- `tests/test_pruebas_rudas.py`: 28/28 tests aprobados (Fuzzing, Concurrencia y Resiliencia).
- **Total: 60/60 aprobadas (100% verde).**
