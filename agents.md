# 🤖 AGENTS.md — Protocolo Operativo y Canónico de Ingeniería para Agentes de IA

> **Mandato Supremo:**  
> *"Ninguna tarea se considera finalizada sin validación automatizada al 100%. Las pruebas no son negociables: si un test falla, la tarea está incompleta. Si no existen pruebas para el cambio, la tarea no ha comenzado."*

---

## 1. Directivas Operativas Obligatorias

Todo agente de IA (Antigravity, OpenCode, Aider, Gemini CLI o subagentes autónomos) debe acatar estrictamente:

1. **Gobernanza Git (Regla Inquebrantable):**
   - **PROHIBIDO ejecutar `git push` a repositorios remotos.** Todo commit debe permanecer localmente hasta que el usuario lo ordene explícitamente.
   - Usar *Conventional Commits*: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`.
2. **Suite de Pruebas Intacta:**
   - Prohibido comentar, debilitar o saltarse pruebas existentes para disimular un fallo. El código debe arreglarse hasta que `pytest` pase al 100%.
3. **Preservación de Documentación:**
   - Mantener intactos los comentarios, docstrings y explicaciones arquitectónicas en el código.

---

## 2. Reglas de Implementación Técnica

### Backend (`apps/api`)
- **FastAPI + Python 3.12+:** Arquitectura modular desacoplada.
- **Pydantic v2 Estricto:** Anotaciones modernas (`int | None`, `list[str]`), validación con `Field(min_length=..., max_length=...)` y tipos estrictos como `EmailStr`.
- **Persistencia con `asyncpg`:** Consultas SQL puras y parametrizadas (`$1`, `$2`).
  - **OWASP A03 (Veto Absoluto):** Queda terminantemente prohibido usar f-strings, `.format()` o concatenación para armar sentencias SQL.
- **Criptografía:**
  - Passwords: PBKDF2-HMAC-SHA256 (100.000 iteraciones) con salt aleatorio de 16 bytes.
  - Verificación: `hmac.compare_digest` obligatorio para neutralizar timing attacks.
  - JWT: Expiración obligatoria (`exp`), algoritmo simétrico seguro.
- **Resiliencia Operativa:** Endpoints dependientes de base de datos deben validar la existencia del pool (`if pool is None: raise HTTPException(status_code=503, detail="...")`). Nunca exponer trazas de error 500 no controladas.

### Frontend (`apps/web`)
- **Next.js 16 (App Router) + TypeScript 5:** Tipado estricto (`strict: true`), componentes de servidor y cliente explícitos.
- **Tailwind CSS:** Respetar la paleta canónica (fondos `#0a0c10` / `#141822`, textos `#ffffff`, acentos `#721828` y dorados `#cba135`).
- **Build sin Advertencias:** `npm run build` y `npm run lint` deben pasar con cero errores bloqueantes.

### Base de Datos (`PostgreSQL 16+`)
- Esquema referencial: `apps/api/NAXORESUELVE_SQL_MAESTRO_POSTGRESQL.sql`.
- **Valores Monetarios:** Uso estricto de `NUMERIC(14,2)` o enteros en centavos. Prohibido usar `FLOAT` o `REAL`.
- **Privacidad:** Datos de contacto personales indexados exclusivamente mediante HMAC-SHA256 (`endpoint_hmac BYTEA CHECK (OCTET_LENGTH(endpoint_hmac) = 32)`). La clave secreta vive fuera de la base de datos.

---

## 3. Mitigación de Seguridad OWASP Top 10

1. **A01: Broken Access Control:** Validación RBAC explícita en endpoints protegidos. Bloquear escalaciones de privilegios hacia `admin` desde proveedores externos.
2. **A02: Cryptographic Failures:** Prohibido almacenar hashes débiles (MD5, SHA1). Prohibido devolver hashes o sales en esquemas Pydantic de salida (`UserOut`).
3. **A03: Injection:** Toda entrada validada con Pydantic; toda consulta SQL parametrizada con `$1`, `$2`.
4. **A04: Insecure Design & Anti-DoS:** Limitar el tamaño de buffers en payloads (`max_length=5000` en mensajes de contacto).
5. **A05: Security Misconfiguration:** Cabeceras de seguridad activas en middleware (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `HSTS`, `X-XSS-Protection`).
6. **A07: Identification Failures:** Invalidar tokens nulos y rechazar algoritmos `none` en JWT.
7. **A08: Software Integrity:** Proteger contra *Mass Assignment*; Pydantic debe descartar campos inyectados como `role`, `id` o `is_admin`.
8. **A10: SSRF:** Rechazar peticiones dirigidas a rangos RFC 1918 y direcciones locales (`127.0.0.1`, `localhost`, `169.254.169.254`).

---

## 4. Marco Legal Chileno (Ley 19.628, Ley 21.719 y Ley 21.663)

1. **Consentimiento Informado:**
   - La casilla de Términos y Condiciones y Privacidad es obligatoria (`accept_terms: true`).
   - **PROHIBIDO pre-marcar casillas de consentimiento en el frontend.**
   - La casilla de comunicaciones de marketing debe ser independiente y estar desmarcada por defecto.
2. **Recuperación de Contraseñas:**
   - Tokens generados exclusivamente con `secrets.token_urlsafe(32)`.
   - En base de datos (`password_resets`), almacenar únicamente el hash SHA-256 (`token_hash`), jamás el token en texto claro.
   - Expiración estricta de 15 minutos (`expires_at = NOW() + INTERVAL '15 minutes'`) y de un único uso (`is_used = TRUE`).
   - `POST /auth/forgot-password` debe retornar una respuesta uniforme para evitar la enumeración de correos.

---

## 5. Protocolo de Testing y Verificación de Calidad

Antes de considerar una tarea completada, el agente debe ejecutar:

1. **Testing Backend:**
   ```powershell
   pytest -v

    Debe pasar el 100% de las pruebas (fuzzing, inyecciones SQL simuladas, resiliencia 503 y concurrencia).

    Compilación Frontend:
    PowerShell

    cd apps\web
    npm run build

        Debe compilar sin errores de TypeScript ni fallos de ESLint.

6. Checklist de Definición de Terminado (Definition of Done)

    [ ] ¿El requerimiento del usuario está completamente implementado?

    [ ] ¿pytest se ejecutó y pasó el 100% de las pruebas?

    [ ] ¿Se respetó el principio de consultas SQL parametrizadas ($1, $2) sin concatenación?

    [ ] ¿Las cabeceras de seguridad OWASP están presentes?

    [ ] ¿Los flujos de autenticación cumplen con la normativa chilena (tokens SHA-256 de 15 min, casillas sin pre-marcar)?

    [ ] ¿npm run build en apps/web compila de forma limpia?

    [ ] ¿Se evitó realizar git push al repositorio remoto?