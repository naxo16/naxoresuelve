# Project: naxoresuelve Platform

**Desarrollador Principal:** Pablo Valdés  
**Contacto Oficial:** `+56 9 5728 6145` | `pablovaldescontacto@gmail.com`  
**Propósito:** Plataforma digital de ingeniería de software para digitalización de procesos, automatización, optimización de infraestructura y servicios de TI bajo modalidad 100% remota.

---

## 1. Arquitectura del Sistema
- **Backend (`apps/api`):** Python 3.12+, FastAPI (monolito modular), driver `asyncpg` con consultas SQL parametrizadas puras (`$1`, `$2`), validación con Pydantic v2, PBKDF2-HMAC-SHA256 (100k rondas) con `hmac.compare_digest`, tokens CSPRNG de 15 minutos, autenticación JWT con control de roles estricto (RBAC: `client` vs `admin`).
- **Base de Datos (PostgreSQL 16/18):** 12 esquemas modulares (`core`, `crm`, `identity`, `privacy`, `catalog`, `marketing`, `commerce`, `inventory`, `promotions`, `gamification`, `integrations`, `governance`) más tablas públicas (`users`, `external_accounts`, `password_resets`, `leads`). Índices GIN sobre datos JSONB y HMAC-SHA256 determinista para endpoints de contacto.
- **Frontend (`apps/web`):** Next.js 16 (App Router, Turbopack), TypeScript 5 strict, Tailwind CSS, navegación responsiva (`CyberLateralSidebar`).
- **Pruebas (`tests/`):** Suite automatizada con `pytest`, `httpx.AsyncClient` / `TestClient`, benchmarks de concurrencia (<350ms), verificación OWASP Top 10 y fuzzing de payloads.

---

## 2. Sistema de Diseño & UI Tokens (Accesibilidad WCAG AAA)
- **Paleta Canónica:**
  - **Fondo Base (Dark Obsidian):** `#0a0c10`, `#10141d`, `#141822` (con cyber-grid sutil).
  - **Acento Primario (Vino Tinto / Borgoña):** `#721828`, `#4d0c17`, `#9e233b`.
  - **Acento Secundario (Champagne Gold):** `#cba135`, `#f2cf6b`, `#96741f`.
  - **Texto Principal:** `#ffffff` (alto contraste absoluto sobre fondos oscuros).
- **Componentes Visuales:**
  - `ThreeArchitectureNode.tsx`: Nodo interactivo WebGL (Three.js).
  - `FiscalisCarousel.tsx`: Carrusel interactivo para mostrar casos de estudio de ingeniería.
  - Botón flotante oficial de WhatsApp con enlace directo al canal de atención.

---

## 3. Casos de Estudio & Arquitectura Insignia: Fiscalis
Sistema de fiscalización municipal auditado con resiliencia de misión crítica:
- **Resistencia a Caídas de SO:** Mitigación de Activity Death / Camera Crash mediante `android:largeHeap="true"`, persistencia en tiempo real en `SharedPreferences` y recuperación con `retrieveLostData`.
- **Soft Lock Criptográfico:** Congelamiento seguro en RAM tras 5 intentos fallidos de PIN mediante SQLCipher y reactivación mediante hash SHA-256 de supervisor.
- **Auditoría GIN de Alto Rendimiento:** Índices GIN sobre `auditoria_jsonb` en PostgreSQL con respuestas en <15ms vía FastAPI.

---

## 4. Contratos de Interfaz (API Contracts)

### Portal de Clientes
- `GET /client/dashboard`: Requiere `Authorization: Bearer <token>`. Retorna `{ user: { id, email, full_name, role }, active_requests: [...], pending_audits: [...], stats: { total_requests, completed, in_progress } }`. Retorna 401 si no está autenticado, 503 controlado si el pool de base de datos está offline.
- `GET /client/requests`: Requiere `Authorization: Bearer <token>`. Retorna `list[RequestItem]`.

### Catálogo de Servicios
- `GET /catalog/products`: Endpoint público. Retorna `list[ProductItem]`. Fallback 503.
- `GET /catalog/services`: Endpoint público. Retorna `list[ServiceItem]`. Fallback 503.

### Autenticación y OAuth
- `POST /auth/oauth/login`: Input: `{ provider, provider_user_id, email, full_name, accept_terms }`. Retorna sesión con rol `client`.
- **Regla Anti-Escalación:** Si el email coincide con un usuario con `role == 'admin'`, el endpoint debe retornar HTTP 403 Forbidden o restringir la sesión forzosamente a `client`. Queda vetado emitir tokens de `admin` vía login social.

---

## 5. Inventario de Funcionalidades & Hitos
| Hito | Nombre | Alcance Principal | Estado |
| :--- | :--- | :--- | :--- |
| **M1** | Seguridad Backend & Auth | Anti-escalación OAuth, proveedor GitHub, catálogo y sanitización de errores 500 | COMPLETADO |
| **M2** | Frontend & Portal Clientes | Corrección ESLint React 19, página `/portal`, botón GitHub OAuth y sidebar | COMPLETADO |
| **M3** | Suite E2E & Concurrencia | Concurrencia async (<350ms), expiración de tokens (15m), tests de portal y catálogo | EN PROGRESO |
| **M4** | Auditoría & Hardening | 100% pytest suite, compilación limpia en Next.js y auditoría forense | PLANIFICADO |

---

## 6. Distribución del Código (Layout)
- Rutas Backend: `apps/api/main.py`
- Esquema SQL Maestro: `apps/api/NAXORESUELVE_SQL_MAESTRO_POSTGRESQL.sql`
- Componentes Frontend: `apps/web/src/components/`
- Páginas Next.js: `apps/web/src/app/`
- Portal Clientes: `apps/web/src/app/portal/page.tsx`
- Suite de Pruebas: `tests/`