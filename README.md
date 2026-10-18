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
- **Backend:** FastAPI (Python 3.12+), Pydantic v2 con validación estricta, PostgreSQL 15 (`asyncpg`).
- **Pruebas Automatizadas:** `pytest`, `httpx` (suite de pruebas rudas con fuzzing y resiliencia).

---

## Cómo ejecutar en local

### 1. Backend & Base de Datos (Docker)
```bash
# Levantar PostgreSQL y la API en segundo plano
docker compose up -d
```

### 2. Frontend (Next.js)
```bash
# Desde la carpeta apps/web
cd apps/web
npm install
npm run dev

# O desde la raíz del proyecto
npm --prefix apps/web run dev
```
La aplicación web estará disponible en `http://localhost:3000`.

### 3. Ejecutar la Suite de Pruebas Rudas
```bash
# En la raíz del repositorio
pytest -v
```

---

## Estructura del Repositorio
```
naxoresuelve/
├─ apps/
│  ├─ api/             # Backend FastAPI modular y blindado
│  └─ web/             # Frontend Next.js 16 con UX/UI formal y telemetría de casos
├─ docs/
│  └─ architecture/adr/ADR-001.md
├─ infra/
│  └─ migrations/      # Migraciones SQL de PostgreSQL
├─ tests/
│  ├─ test_health.py
│  └─ test_pruebas_rudas.py  # Suite de fuzzing, estrés y resiliencia
├─ docker-compose.yml
├─ context.md          # Documento de continuidad y arquitectura
└─ README.md
```
