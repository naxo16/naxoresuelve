# Original User Request

## Initial Request — 2026-10-18T06:21:02Z

Diagnosticar de forma integral la escalabilidad, seguridad criptográfica, funcionalidad y cumplimiento normativo de la plataforma web 'naxoresuelve', implementando un portal de clientes robusto, previsualización de servicios, inicio de sesión federado con Google y GitHub, flujo seguro de recuperación de cuentas y una batería completa de pruebas automatizadas bajo estándares de la industria. Se exige explícitamente que la UI y UX cumpla con los estándares más rigurosos de código limpio, modular, mantenible y accesible.

Working directory: C:\Apache64\Apache24\htdocs\naxoresuelve
Integrity mode: development

## Directiva de Calidad Obligatoria
La arquitectura UI/UX y el código frontend deben acatar principios estrictos de código limpio (Clean Code, DRY, SOLID en componentes), modularidad desacoplada, tipado estricto en TypeScript 5, semántica HTML accesible (ARIA), contraste de colores AAA y rendimiento responsivo fluido en cualquier resolución sin dependencias redundantes ni estilos forzados.

## Requirements

### R1. Diagnóstico y Optimización de Escalabilidad & Rendimiento
Auditar el comportamiento concurrente de la API en FastAPI y la capa de base de datos relacional PostgreSQL. Garantizar consultas parametrizadas óptimas (3FN e índices especializados), tiempos de respuesta <350ms en lectura de catálogo/servicios y cero bloqueos del event loop ante ráfagas simultáneas de peticiones.

### R2. Seguridad Criptográfica, OWASP Top 10 & Recuperación de Cuentas
Consolidar la infraestructura de seguridad:
- Mitigación integral del OWASP Top 10 (A01 a A10).
- Hashing de contraseñas con PBKDF2-HMAC-SHA256 (100.000 rondas) o Argon2id con comparación de tiempo constante (hmac.compare_digest).
- Flujo de recuperación de contraseñas con tokens CSPRNG de alta entropía almacenados exclusivamente como hash SHA-256 en base de datos, con caducidad estricta de 15 minutos, uniuso forzado y respuestas neutrales anti-enumeración de usuarios.
- Cabeceras de seguridad HTTP completas (HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff).

### R3. Federación de Identidad OAuth 2.0 / OpenID Connect (Google & GitHub)
Implementar y verificar el inicio de sesión federado con Google y GitHub:
- Intercambio seguro de código de autorización por token en el backend sin exponer secretos de cliente.
- Desacoplamiento relacional en la tabla external_accounts vinculada a la identidad canónica del usuario.
- Asignación estricta del rol client (prohibición absoluta de escalación de privilegios hacia admin desde proveedores sociales).

### R4. Portal de Clientes, Catálogo de Servicios & Previews Interactivas
Verificar la operatividad del portal de clientes y catálogo/tienda de servicios:
- Panel privado autenticado para clientes con visualización de estado de solicitudes y auditorías.
- Previews interactivas de demostración de software sin fallos de reproducción en múltiples navegadores.
- Navegación lateral responsiva fluida, sin bloqueos de scroll ni colisiones de interfaz en dispositivos móviles y de escritorio.

### R5. Suite de Pruebas Automatizadas & Aseguramiento de Calidad (QA)
Diseñar y ejecutar pruebas automatizadas completas que verifiquen el 100% de los nuevos endpoints, flujos de autenticación, control de accesos por roles (RBAC) y resiliencia ante contingencias de red o base de datos.

## Verification Resources

- Suite de pruebas backend: pytest -v (con cobertura de tests/test_owasp_security.py, tests/test_pruebas_rudas.py, tests/test_media_and_navbar_integrity.py).
- Verificación frontend: npm run build en apps/web (compilación estricta Next.js con cero errores de TypeScript y cero advertencias bloqueantes).
- Esquema de base de datos: apps/api/NAXORESUELVE_SQL_MAESTRO_POSTGRESQL.sql.

## Acceptance Criteria

### Seguridad & Autenticación
- [ ] El endpoint POST /auth/forgot-password emite tokens SHA-256 de 15 minutos con uniuso y respuesta neutral anti-enumeración.
- [ ] El flujo de autenticación con Google y GitHub genera sesiones JWT válidas asignando exclusivamente el rol client.
- [ ] No se exponen contraseñas, hashes, sales ni rutas internas del servidor en ninguna respuesta JSON ni en logs.
- [ ] Todas las cabeceras de seguridad OWASP están presentes en las respuestas HTTP.

### Escalabilidad & Rendimiento
- [ ] Los endpoints del catálogo y portal responden con degradación controlada (HTTP 503) cuando el pool de base de datos no está disponible, sin crashear el proceso.
- [ ] Ráfagas de 50+ consultas concurrentes no generan degradación de memoria ni excepciones de sockets no capturadas.

### Funcionalidad & UI/UX
- [ ] El portal de clientes permite acceso autenticado, visualización de servicios y navegación sin errores.
- [ ] La reproducción de video y previews multimedia opera de forma reactiva y con fallback de audio en todos los navegadores principales.
- [ ] El frontend compila de forma limpia con npm run build sin advertencias de tipos ni errores de hidratación.
- [ ] El código frontend es limpio, modular, sin antipatrones y altamente mantenible.

### Gobernanza & Testing
- [ ] El 100% de la suite pytest pasa en verde (cero pruebas omitidas, modificadas para disimular fallos o fallidas).
- [ ] Todos los cambios se mantienen en el repositorio local sin realizar git push a servidores remotos.
