# 🤖 AGENTS.md — Protocolo Canónico para Agentes Autónomos y Pair Programming de IA

> **Mandato Supremo del Proyecto naxoresuelve:**  
> *"Ningún cambio se considera concluido sin validación automatizada al 100%. Las pruebas no son negociables: si un test falla, la tarea está incompleta. Si no existen pruebas para la nueva funcionalidad, la tarea no ha comenzado."*

---

## 📌 1. Directivas Operativas Obligatorias

Todo agente de IA (Antigravity, Gemini, Copilot o subagentes autónomos) que opere en este repositorio debe acatar estrictamente las siguientes reglas:

1. **Suite de Pruebas Siempre en Verde:**
   - Antes de dar por finalizada cualquier intervención en el backend, se DEBE ejecutar `pytest` y obtener un resultado **100% aprobado** (cero fallos).
   - **Prohibición absoluta:** Jamás comentes, desactives, modifiques aserciones ni degrades pruebas existentes para disimular un fallo de implementación. Si una prueba falla, la solución reside en corregir el código o ajustar el contrato previa explicación técnica al usuario.

2. **Gobernanza de Git y Control de Versiones:**
   - **PROHIBICIÓN ESTRICTA:** **NUNCA ejecutes `git push` hacia repositorios remotos sin la confirmación y solicitud explícita del usuario.** Todos los commits deben permanecer en el repositorio local hasta que el usuario ordene su publicación.
   - Todo commit debe seguir el estándar *Conventional Commits*:
     - `feat: ...` (nuevas características)
     - `fix: ...` (corrección de errores)
     - `test: ...` (adición o mejora de pruebas)
     - `refactor: ...` (cambios de diseño sin alterar comportamiento externo)
     - `docs: ...` (documentación o arquitectura)

3. **Preservación de Documentación y Comentarios:**
   - Conserva la integridad de todos los comentarios, docstrings y explicaciones arquitectónicas existentes en el código base.

4. **Transparencia en Decisiones Arquitectónicas:**
   - Cuando debas elegir entre dos enfoques, prioriza la **solidez transaccional**, la **simplicidad determinista** y el **estándar abierto** por encima de dependencias pesadas o magia de frameworks.

---

## 🛠️ 2. Stack Tecnológico & Reglas de Implementación

### Backend (`apps/api`)
- **Runtime:** Python 3.12+
- **Framework:** FastAPI con arquitectura modular (monolito modular con dominios explícitos).
- **Validación:** **Pydantic v2** estricto:
  - Uso obligatorio de anotaciones de tipo modernas (`int | None`, `list[str]`).
  - Validación de campos con `Field(min_length=..., max_length=...)`.
  - Sanitización en fronteras: uso de `EmailStr` para validar correos contra RFC 5322.
- **Acceso a Datos:** **`asyncpg`** con consultas SQL puras y parametrizadas (`$1`, `$2`).
  - **REGLA DE SEGURIDAD CRÍTICA (OWASP A03):** Queda estrictamente vetado el uso de concatenación de cadenas, `.format()` o f-strings para construir sentencias SQL. Todas las variables deben transmitirse como argumentos del driver.
- **Criptografía:**
  - Contraseñas: PBKDF2-HMAC-SHA256 con 100.000 iteraciones y salting aleatorio criptográfico de 16 bytes.
  - Verificación de passwords: `hmac.compare_digest` para neutralizar ataques de canal lateral / timing attacks.
  - Tokens: JWT firmado con HMAC-SHA256 y expiración obligatoria (`exp`).
- **Resiliencia Operativa:**
  - Los endpoints que dependan de la base de datos deben comprobar la existencia del pool de conexiones (`if pool is None: raise HTTPException(status_code=503, ...)`).
  - Nunca permitir que una falla de conexión a base de datos provoque un crasheo del proceso o una respuesta `500 Internal Server Error` sin formato.

### Frontend (`apps/web`)
- **Framework:** Next.js 16 (App Router, Turbopack, Server/Client Components explícitos).
- **Lenguaje:** TypeScript 5 en modo estricto (`strict: true`).
- **Estilos:** Tailwind CSS con variables de diseño personalizadas.
- **Accesibilidad & UI:** Contraste AAA (Blanco puro `#ffffff` sobre fondos oscuros `#0a0c10` / `#141822`, acentos vino tinto `#721828` y dorados `#cba135`).

### Base de Datos (`PostgreSQL 16+`)
- **Esquema Maestro:** [NAXORESUELVE_SQL_MAESTRO_POSTGRESQL.sql](file:///C:/Apache64/Apache24/htdocs/naxoresuelve/apps/api/NAXORESUELVE_SQL_MAESTRO_POSTGRESQL.sql).
- **12 Esquemas Lógicos:** `core`, `crm`, `identity`, `privacy`, `catalog`, `marketing`, `commerce`, `inventory`, `promotions`, `gamification`, `integrations`, `governance`.
- **Privacidad por Diseño:** Los endpoints de contacto personales se indexan con hash HMAC determinista (`endpoint_hmac BYTEA NOT NULL CHECK (OCTET_LENGTH(endpoint_hmac) = 32)`). La clave secreta vive en variables de entorno fuera de PostgreSQL.
- **Principio de Menor Privilegio:** Separar roles entre `naxoresuelve_owner` (DDL), `naxoresuelve_app` (DML) y `naxoresuelve_readonly` (solo SELECT).

---

## 🧪 3. Protocolo de Pruebas Rudas y Verificación de Calidad

Antes de presentar un entregable, el agente debe ejecutar localmente y verificar:

### 1. Pruebas Unitarias, de Fuzzing y de Concurrencia
```powershell
pytest -v
```
- Cobertura mínima obligatoria:
  - Fuzzing de cargas corruptas (HTTP 422 en payloads vacíos, cadenas gigantes, inyecciones SQL y tipos mutados).
  - Resiliencia y tolerancia a fallos (HTTP 503 controlado sin pool de base de datos).
  - Liveness inmune a caídas externas (HTTP 200).
  - Concurrencia (ráfagas de consultas simultáneas sin degradación de memoria).
  - Batería OWASP Top 10 completa (`tests/test_owasp_security.py`).

### 2. Verificación de Compilación Frontend
```powershell
cd apps\web
npm run build
```
- Debe compilar sin errores de TypeScript ni advertencias bloqueantes de ESLint.

---

## 📋 4. Lista de Autoverificación para el Agente (Definition of Done)

Antes de reportar a Pablo Valdés (usuario) que una tarea está completada, el agente debe verificar mentalmente cada punto:

- [ ] ¿El cambio satisface con precisión el requerimiento expresado por el usuario?
- [ ] ¿Se ejecutó `pytest` y pasaron **el 100%** de las pruebas sin advertencias no controladas?
- [ ] ¿Se mantuvieron las cabeceras de seguridad OWASP (HSTS, nosniff, DENY frame options)?
- [ ] ¿Las consultas SQL están 100% parametrizadas sin interpolación de strings?
- [ ] ¿Se mantuvieron los principios de diseño transaccional y normalización relacional?
- [ ] ¿Se protegió la privacidad del usuario según la normativa de protección de datos personales?
- [ ] ¿Se conservaron los comentarios y docstrings existentes?
- [ ] ¿Se evitó realizar `git push` al servidor remoto?

---

*Documento de Gobernanza Canónica para Agentes de IA — naxoresuelve 2026.*
