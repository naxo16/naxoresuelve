# naxoresuelve — Pablo Valdés

Plataforma de ingeniería de software, automatización masiva, optimización de bases de datos y desarrollo de soluciones tecnológicas de alto impacto.

**Desarrollado por:** Pablo Valdés · Analista Programador & Consultor de Software  
**Perfil Profesional:** [LinkedIn](https://www.linkedin.com/in/pablo-vald%C3%A9s-7a4445430/)

---

## Filosofía del Proyecto
> *"No es un caso de éxito si no aprueba el testing riguroso."*

Cada solución (scripts en Excel, carga masiva de archivos, deduplicación de registros, modelado SQL o plataformas SaaS en arriendo) es sometida a pruebas rudas de estrés, fuzzing, concurrencia y resiliencia ACID antes de su entrega.

---

## Stack Tecnológico
- **Frontend:** Next.js 16 (App Router, Turbopack, TypeScript, Tailwind CSS v4, Lucide Icons).
  - Paleta: Blanco, Vino Tinto (`#721828`), Negro Suave (`#0d0f14`), Dorado (`#cba135`).
  - Animaciones y micro-glitch por CSS keyframes seguros, objetos flotantes, modales pop-up interactivos y botón flotante de WhatsApp.
- **Backend:** FastAPI (Python 3.12+), Pydantic v2 con validación estricta, PostgreSQL 16/18 (`asyncpg` pool).
- **Entorno de Despliegue:** Apache HTTP Server 2.4 (`htdocs`) como Reverse Proxy hacia Uvicorn (puerto `3006`).
- **Pruebas Automatizadas:** `pytest` con batería de 60 pruebas (Fuzzing, Concurrencia, Resiliencia y OWASP Top 10 al 100% verde).
- **Documentación Canónica:**
  - [GEMINI.md](file:///C:/Apache64/Apache24/htdocs/naxoresuelve/GEMINI.md): La Biblia del Buen Desarrollador, Ingeniero de Software y Analista Programador (SDLC con herramientas Open Source).
  - [AGENTS.md](file:///C:/Apache64/Apache24/htdocs/naxoresuelve/AGENTS.md): Protocolo Canónico para Agentes Autónomos y Pair Programming de IA.
  - [apps/api/README.md](file:///C:/Apache64/Apache24/htdocs/naxoresuelve/apps/api/README.md): Documentación técnica detallada del Backend API.

---

## Cómo ejecutar en local

### 1. Backend & Base de Datos
```powershell
# Iniciar Uvicorn en el puerto 3006
cd apps\api
uvicorn main:app --host localhost --port 3006 --reload
```
Endpoints de salud y diagnóstico:
- `GET http://localhost:3006/health/live` → Liveness probe (inmune a caídas de red o BD).
- `GET http://localhost:3006/health/ready` → Readiness probe (verifica pool de PostgreSQL).

### 2. Frontend (Next.js 16 App Router)
```powershell
cd apps\web
npm run dev
```
La aplicación web estará disponible en `http://localhost:3000`.

### 3. Ejecutar la Suite de Pruebas Rudas (60 tests)
```powershell
pytest -v
```

---

## Estructura del Repositorio
```
naxoresuelve/
├─ apps/
│  ├─ api/             # Backend FastAPI modular, endpoints /health, /leads, /auth
│  │  ├─ NAXORESUELVE_SQL_MAESTRO_POSTGRESQL.sql # Modelo canónico PostgreSQL
│  │  └─ README.md      # Documentación técnica del Backend API
│  └─ web/             # Frontend Next.js 16 con UX/UI formal y telemetría de casos
├─ docs/
│  └─ architecture/adr/ # Architecture Decision Records (ADR-001, ADR-002)
├─ infra/
│  ├─ provision_database.sql # Creación segura de base de datos Naxo_85721 y roles
│  └─ migrations/      # Migraciones SQL de PostgreSQL
├─ tests/
│  ├─ test_health.py   # Probes de liveness y readiness
│  ├─ test_owasp_security.py # Batería OWASP Top 10 completa
│  └─ test_pruebas_rudas.py  # Fuzzing, buffer overflow, estrés y resiliencia
├─ AGENTS.md           # Protocolo operativo de gobernanza para IA
├─ GEMINI.md           # La Biblia del Buen Desarrollador y SDLC Open Source
├─ docker-compose.yml  # Configuración reproducible de contenedores
├─ context.md          # Bitácora de continuidad del proyecto
└─ README.md           # Este archivo
```
