# Informe de Auditoría Integral — Naxo Resuelve

**Fecha:** 31 de octubre de 2026  
**Rol:** Consultor Principal de Arquitectura de Software y Estrategia de Producto  
**Alcance:** `apps/web`, `apps/api`, `tests/`, `infra/`, `PROJECT.md`, `AGENTS.md`  
**Referencia comercial:** catálogo canónico descrito en `AUDIT.md` (3 servicios troncales y modalidad 100% remota).  
**Naturaleza:** auditoría de solo lectura. No se modificó código de producto ni se ejecutó `git push`.

---

## 1. Resumen Ejecutivo

### 1.1 Veredicto global

**Salud global: 3.5 / 10 — No apto para producción sin remediación.**

El proyecto tiene una base técnica valiosa: SQL parametrizado, hashing PBKDF2, tokens de recuperación con SHA-256 y expiración de 15 minutos, respuestas 503 controladas en endpoints y una compilación de Next.js limpia. Sin embargo, la capa de identidad es suplantable, existen credenciales de administrador expuestas en el frontend y en scripts, el token de recuperación se devuelve por API, los leads con datos personales son públicos y la portada no comunica el catálogo comercial canónico.

La prioridad no es agregar funcionalidades: es **cerrar las brechas de seguridad y legales, restaurar la fuente de verdad comercial y reducir la fricción de conversión**.

### 1.2 Scorecard por dimensión

| Dimensión | Nota | Diagnóstico |
| :--- | :---: | :--- |
| Semántica comercial y conversión | 2 / 10 | La portada vende 15 servicios técnicos, no los 3 servicios troncales. H1 centrado en jerga de ingeniería. Falta la insignia 100% remota. |
| Diseño, UI y accesibilidad | 5 / 10 | Buena intención visual y accesibilidad declarada, pero paleta fuera de norma, contraste inferior a AAA y carga móvil dominada por un video de 44,8 MB y Three.js. |
| Arquitectura y contratos | 4 / 10 | Endpoints resilientes en teoría, pero la API no arranca si la base de datos está caída; CORS y URL de API solo apuntan a localhost; contratos TypeScript y Pydantic no coinciden; migraciones incompletas. |
| Seguridad, privacidad y normativa | 2 / 10 | Credenciales de admin expuestas, OAuth simulado, token de recuperación en la respuesta, `GET /leads` público, secretos por defecto y consentimiento de marketing pre-marcado. |
| Pruebas y CI | 6 / 10 | `pytest` pasa 110 pruebas y `next build` compila, pero `npm run lint` falla con 5 errores. Varias pruebas validan comportamientos inseguros o aceptan 503 como éxito. |
| **Global** | **3.5 / 10** | **Producto técnicamente prometedor, comercialmente desalineado y con bloqueantes de seguridad/legales.** |

### 1.3 Bloqueantes que impiden producción

1. **Credenciales de administrador visibles en el frontend** y en `infra/seed_admin.py`.
2. **Bypass de identidad OAuth:** el backend confía en `email` y `provider_user_id` enviados por el cliente, sin canje de código ni verificación del proveedor.
3. **Fuga del token de recuperación:** `POST /auth/forgot-password` devuelve el token en texto claro y el frontend lo autocarga.
4. **Datos personales públicos:** `GET /leads` devuelve nombre, correo y mensaje sin autenticación.
5. **Secretos por defecto:** URL de PostgreSQL con contraseña y `JWT_SECRET` con valor fijo de respaldo.
6. **Migraciones incompletas:** un despliegue limpio no crea `password_resets` ni `external_accounts`; además, el esquema maestro usa `identity.users`/`crm.leads` con UUID, mientras la app consulta tablas públicas con enteros.
7. **Oferta comercial desalineada:** no existen los 3 servicios canónicos ni la insignia 100% remota en la portada; en su lugar hay 15 servicios y una tienda en preventa.
8. **Consentimiento inválido:** la casilla de marketing de la sección de promociones está pre-marcada y los formularios de lead no exigen aceptación de términos y privacidad.

### 1.4 Fortalezas verificadas

- Todas las consultas SQL revisadas usan parámetros `$1`, `$2`; no se detectaron f-strings, `.format()` ni concatenación para construir SQL.
- Passwords con PBKDF2-HMAC-SHA256, 100.000 iteraciones, salt aleatorio de 16 bytes y verificación con `hmac.compare_digest`.
- Tokens de recuperación generados con `secrets.token_urlsafe(32)`, almacenados como SHA-256, con expiración de 15 minutos y uso único.
- `get_db_pool()` y los endpoints dependientes de base de datos devuelven 503 controlado cuando el pool no está disponible.
- No se encontraron rutas absolutas locales tipo `C:\Apache64\...` en el código de producto.
- Cabeceras `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection` y HSTS presentes.
- `pytest -q`: **110 passed** en 4,83 s.
- `npm run build`: compilación exitosa, 4 rutas estáticas.
- Botón flotante de WhatsApp con mensaje precargado, `target="_blank"` y `rel="noopener noreferrer"`.
- Enlaces de salto, foco visible, trampa de foco en modales y preferencia de movimiento reducido a nivel CSS.

### 1.5 Evidencia de verificación

| Verificación | Resultado |
| :--- | :--- |
| `pytest -q` | 110 passed, 2 warnings, 4,83 s |
| `npm run lint` | **5 errores, 10 advertencias** |
| `npm run build` | Éxito; rutas `/`, `/_not-found`, `/login`, `/portal` |
| Tamaño de `apps/web/src/app/page.tsx` | 1.916 líneas, ~96 KB |
| Catálogo web | 15 servicios en `SERVICES_DATA`; 9 servicios destacados en `ServicesQuickModal` |
| Catálogo API | 15 servicios en `PLATFORM_SERVICES` |
| Videos de demostración | 44,82 MB + 29,93 MB; ambos versionados en Git |
| Chunk principal de Three.js | 533,5 KB |
| Artefacto estático `apps/web/out` | 76,7 MB |
| Contraste `#ff6b85` sobre `#3a3640` | 4,32:1 (no alcanza AA para texto normal) |
| Contraste `#c29da5` sobre `#423943` | 4,56:1 (no alcanza AAA) |
| Base local | `leads`, `users`, `password_resets`, `external_accounts` existen localmente, pero las migraciones del repositorio no las crean todas |

> Nota de gobernanza: el `PROJECT.md` actual del árbol de trabajo no contiene el catálogo de 3 servicios ni la insignia 100% remota que exige la directiva. La única fuente que los menciona es `AUDIT.md`. Esto ya es una inconsistencia de fuente de verdad y debe corregirse antes de refactorizar la portada.

---

## 2. Matriz de Inconsistencias

### 2.1 Semántica comercial y conversión

| ID | Archivo / referencia | Problema detectado | Severidad | Impacto en el negocio |
| :--- | :--- | :--- | :---: | :--- |
| S1 | `apps/web/src/app/page.tsx:559`, `:568` | El badge y el H1 hablan de “código limpio, arquitectura robusta y testing rudo”, no del resultado para el negocio. | Alta | Un dueño de pyme no entiende en 5 segundos qué gana. Aumenta el rebote en el primer scroll. |
| S2 | `apps/web/src/app/page.tsx:575` | Copy con error gramatical y contradicción: “ahorra tiempo, perder dinero”. | Alta | El mensaje principal se vuelve confuso y resta credibilidad profesional. |
| S3 | `apps/web/src/app/page.tsx:210-361`, `apps/api/main.py:754-1010` | Se exponen 15 servicios, no los 3 troncales. Los precios no coinciden con el catálogo canónico: no aparecen $80.000 ni $50.000, y $150.000 se usa para Excel, no para digitalización. | Alta | La oferta es difusa, difícil de comparar y no transmite el posicionamiento definido. |
| S4 | `PROJECT.md` (archivo completo) | El catálogo canónico de 3 servicios y la insignia remota no existen en la fuente de verdad. | Alta | No hay una referencia única para ventas, marketing, API y frontend. Cada canal puede evolucionar a su antojo. |
| S5 | `apps/web/src/app/page.tsx:1590` | El footer dice “Chile (Remoto / Presencial)” y no existe la insignia “Modalidad 100% Remota a todo Chile”. | Alta | Contradice la promesa de cobertura nacional y el escudo operativo solicitado. |
| S6 | `apps/web/src/app/page.tsx:525-531`, `:583-606`, `:944-952`; `FloatingWhatsApp.tsx` | Los CTA principales abren un modal o un formulario; el WhatsApp flotante solo existe en la portada y usa un mensaje genérico. | Media | Se pierden conversaciones directas, especialmente en móvil, donde el usuario prefiere WhatsApp antes que un formulario. |
| S7 | `apps/web/src/app/layout.tsx:19-46`; `apps/web/src/app/page.tsx:473`, `:1584` | Metadata y title cargados de jerga técnica; el correo oficial de la web (`contacto@naxoresuelve.cl`) no coincide con el de `PROJECT.md`; el enlace “LinkedIn” del sidebar apunta a GitHub. | Media | Menor confianza, SEO desalineado y confusión en el contacto directo. |

### 2.2 Diseño, UI y rendimiento

| ID | Archivo / referencia | Problema detectado | Severidad | Impacto en el negocio |
| :--- | :--- | :--- | :---: | :--- |
| D1 | `apps/web/src/app/globals.css:5-9`; `apps/web/src/app/page.tsx:383`, `:477`, `:573` | La paleta real usa `#3a3640`, `#423943`, `#362f37`, `#45404d`; la paleta canónica exige `#0a0c10` y `#141822`. | Media | Inconsistencia de marca y pérdida del contraste “obsidian” definido en `PROJECT.md`. |
| D2 | `tests/test_media_and_navbar_integrity.py:174-176` | Una prueba exige explícitamente `--bg-dark: #3a3640`, lo que bloquea el retorno a la paleta canónica. | Media | La deuda de diseño queda institucionalizada en la suite; corregirla exige actualizar la prueba. |
| D3 | `apps/web/src/app/page.tsx:616`, `:678`, `:732`, `:916` | Textos `#ff6b85` sobre `#3a3640` rinden 4,32:1 y `#c29da5` sobre `#423943` rinden 4,56:1. No se cumple WCAG AAA. | Media | La declaración de accesibilidad AAA es incorrecta; riesgo de exclusión y de reclamos. |
| D4 | `apps/web/src/app/page.tsx:92-102`, `:742`; `ModernCanvasVideoPlayer.tsx:727-736`; `apps/web/public/videos` | Dos videos de 44,82 MB y 29,93 MB, con `preload="auto"`, montados en la carga inicial. El artefacto `out` pesa 76,7 MB. | Alta | Carga inicial móvil muy pesada, malos Core Web Vitals y abandono antes de ver la oferta. |
| D5 | `apps/web/src/app/page.tsx:52-63`; `ThreeArchitectureNode.tsx:120`, `:135-156` | Three.js aporta un chunk de 533,5 KB, un `requestAnimationFrame` continuo y un listener global de `mousemove`; no se pausa fuera de pantalla ni respeta `prefers-reduced-motion` en JS. | Media | Consumo de CPU y batería en móvil, jank en el hero y accesibilidad reducida. |
| D6 | `AccessibilityToolbar.tsx:85-86`, `:188`; `page.tsx:1657`; `AuditModal.tsx:83` | Errores de lint por `setState` dentro de efectos y acceso a funciones antes de su declaración. | Media | `npm run lint` falla y se incumple el Definition of Done de `AGENTS.md`. |
| D7 | `page.tsx:27`, `:772`; `AccessibilityToolbar.tsx:14`, `:73`; `CyberLateralSidebar.tsx:15`, `:270` | Imports y variables sin uso (`Download`, `idx`, `RotateCcw`, `currentStepIndex`, `cvUrl`). | Baja | Ruido, deuda menor y advertencias permanentes en CI. |

### 2.3 Arquitectura y contratos

| ID | Archivo / referencia | Problema detectado | Severidad | Impacto en el negocio |
| :--- | :--- | :--- | :---: | :--- |
| A1 | `apps/api/main.py:53-61` | `asyncpg.create_pool()` se ejecuta sin `try/except` en el lifespan. Si la base de datos está caída al arrancar, la API no inicia. | Alta | El “503 controlado” no se alcanza en el escenario más realista: caída de base de datos al desplegar o reiniciar. |
| A2 | `apps/api/main.py:85-94`; `page.tsx:120`; `AuditModal.tsx:12`; `login/page.tsx:23`; `portal/page.tsx:211`; `apps/web/.env.example` | CORS solo permite `localhost:3000` y el frontend cae a `http://localhost:8000` si falta la variable. | Alta | En producción, el frontend estático llama a localhost y el backend rechaza el dominio real. Formularios, login y portal fallan. |
| A3 | `infra/migrations/001_create_leads.sql`, `002_create_users.sql`; `docker-compose.yml:12`; `main.py:486`, `:520`, `:591` | Las migraciones crean `leads` y `users`, pero no `password_resets` ni `external_accounts`. El esquema maestro define `identity.users` (UUID) y `crm.leads`, no las tablas públicas que usa la app. | Alta | Un despliegue limpio rompe recuperación de contraseña y OAuth con error 500. Los tests pasan porque la base local ya tiene tablas creadas fuera del repositorio. |
| A4 | `apps/web/src/app/portal/page.tsx:43-53` vs `apps/api/main.py:1189-1198` | El contrato TypeScript espera `id: string`, `status: "En Proceso"`, `category`, `priority`, `createdAt`, `updatedAt`, `slaTarget`. La API devuelve `id` numérico, `status: "en_proceso"`, `service_name`, `created_at`. | Alta | El portal puede romperse al recibir datos reales (`req.id.toLowerCase()` sobre un número) y muestra estados o categorías incorrectas. |
| A5 | `apps/api/main.py:1026-1096` vs `PROJECT.md:44-46` | Los endpoints de catálogo devuelven diccionarios sin modelos Pydantic `ProductItem`/`ServiceItem`. El frontend no consume el catálogo y no existen interfaces TypeScript equivalentes. | Media | El contrato de API no es verificable y la oferta se duplica en tres lugares: API, portada y modal. |
| A6 | `apps/api/main.py:1200-1260`, `:1310-1328`, `:1350-1378` | Si no hay datos, el dashboard y las auditorías devuelven solicitudes y hallazgos ficticios como si fueran reales. | Media | Datos de mentira presentados como telemetría erosionan la confianza y pueden inducir decisiones erróneas. |
| A7 | `apps/web/src/app/page.tsx` (1.916 líneas) | Página monolítica con datos, secciones, formularios, promociones y lógica de normalización en un solo archivo. | Media | Alta probabilidad de regresión, difícil de testear y de iterar comercialmente. |
| A8 | `apps/api/main.py:263-304`, `:312-686` | Sin rate limiting, captcha ni límites por IP en `/leads` y endpoints de autenticación. | Media | Spam de leads, fuerza bruta y agotamiento de recursos a bajo costo. |

### 2.4 Seguridad, privacidad y normativa

| ID | Archivo / referencia | Problema detectado | Severidad | Impacto en el negocio |
| :--- | :--- | :--- | :---: | :--- |
| P1 | `apps/web/src/app/login/page.tsx:244-253`, `:855-861`; `infra/seed_admin.py:16`, `:32` | Credenciales de administrador hardcodeadas en el frontend y en el script de seed. | Alta | Cualquier visitante puede obtener acceso administrativo. Riesgo de toma de control total, pérdida de datos y responsabilidad legal. |
| P2 | `apps/api/main.py:470-504`; `login/page.tsx:154-158` | `forgot-password` devuelve `reset_token_simulated` en la respuesta y el frontend lo usa para saltar al formulario de reseteo. | Alta | Toma de control de cualquier cuenta registrada sin acceso al correo. Viola `AGENTS.md` (solo hash en BD) y el espíritu de la Ley 21.663. |
| P3 | `apps/api/main.py:562-686`; `login/page.tsx:208-222` | El login OAuth es una simulación: el frontend inventa `provider_user_id` y el backend confía en el `email` recibido. Además, `OAuthLoginIn.accept_terms` tiene `default=True`. | Alta | Suplantación de cualquier cuenta cliente. El bloqueo de admin solo aplica si la fila existe; el bypass de identidad permanece. Consentimiento no explícito. |
| P4 | `apps/api/main.py:289-304` | `GET /leads` es público y devuelve nombre, correo y mensaje de todos los leads. | Alta | Fuga masiva de datos personales. Incumplimiento directo de la Ley 19.628 y de la política de privacidad declarada. |
| P5 | `apps/api/main.py:39-43`; `infra/provision_database.sql:33`, `:44`, `:53`; `docker-compose.yml:6`; `infra/seed_admin.py:8` | URL de PostgreSQL con contraseña y `JWT_SECRET` con valor fijo de respaldo; contraseñas de roles y de base de datos hardcodeadas; el seed imprime la URL con credenciales en consola. | Alta | Tokens forjables, acceso a base de datos y filtración de credenciales en logs si falta configuración. |
| P6 | `apps/web/src/app/page.tsx:971`, `:1351`; `page.tsx:1241-1375`, `:1753-1851` | La casilla de marketing está pre-marcada (`useState(true)`) y los formularios de lead no exigen aceptar términos y privacidad. El backend `LeadIn` tampoco recibe esos campos. | Alta | Consentimiento inválido bajo Ley 19.628/21.719. Riesgo de sanción, reclamos y pérdida de confianza. |
| P7 | `apps/api/main.py:270-280`; `NAXORESUELVE_SQL_MAESTRO_POSTGRESQL.sql:249` | Los leads se guardan con nombre, email y mensaje en claro en `public.leads`, sin `endpoint_hmac` ni cifrado. El esquema maestro sí define HMAC para `crm.contact_points`. | Alta | La promesa de privacidad y el mandato de `AGENTS.md` no se cumplen en el flujo real de contacto. |
| P8 | `login/page.tsx:73`, `:230`; `apps/api/main.py:97-106` | El JWT se guarda en `localStorage` y no existe cabecera CSP, aunque la auditoría ficticia del dashboard afirma que CSP está activa. | Media | Un XSS puede exfiltrar el token. La superficie de ataque es mayor por la cantidad de HTML y enlaces externos. |
| P9 | `apps/api/main.py:1239`, `:1357` | Los hallazgos de auditoría devueltos por la API afirman “Cabeceras HSTS, CSP y denegación de clickjacking activas”, pero CSP no está implementada. | Media | Información de cumplimiento falsa; puede inducir a clientes a confiar en una postura de seguridad que no existe. |

### 2.5 Pruebas y CI

| ID | Archivo / referencia | Problema detectado | Severidad | Impacto en el negocio |
| :--- | :--- | :--- | :---: | :--- |
| T1 | `tests/test_auth_features.py:104-106`, `:112-113` | La suite valida que el token de recuperación venga en la respuesta y lo usa para resetear la clave. | Media | La prueba institucionaliza la vulnerabilidad P2. Un test verde no significa un sistema seguro. |
| T2 | `tests/test_auth_features.py:60`; `tests/test_m3_e2e_concurrency_oauth.py:148`, `:340`, `:353` | Varias aserciones aceptan 503 o estados alternativos como éxito, lo que permite que un fallo de integración pase desapercibido. | Media | Falsa sensación de cobertura; los 110 tests no garantizan que el flujo real funcione. |
| T3 | `tests/test_media_and_navbar_integrity.py:44-45`, `:174-176` | La suite exige videos mayores a 10 MB y fija el fondo no canónico `#3a3640`. | Media | Bloquea la optimización de rendimiento y el retorno a la paleta oficial. |
| T4 | `npm run lint` | 5 errores y 10 advertencias en `page.tsx`, `AccessibilityToolbar.tsx` y `AuditModal.tsx`. | Alta | Incumple el mandato de `AGENTS.md` (“build sin advertencias” y lint limpio) y bloquea un pipeline de calidad serio. |
| T5 | `tests/` | No hay pruebas E2E de navegador ni pruebas negativas para OAuth falso, token de recuperación en respuesta, `GET /leads` público o consentimiento pre-marcado. | Alta | Los riesgos más graves del producto no están cubiertos por la suite. |

---

## 3. Plan de Acción Refactorizado (Paso a Paso)

### 3.1 Fase 0 — Contención inmediata (0 a 24 horas)

| # | Acción | Archivos principales | Criterio de aceptación |
| :---: | :--- | :--- | :--- |
| 0.1 | Rotar `JWT_SECRET`, contraseña de base de datos y claves de roles. Eliminar todos los valores por defecto. | `apps/api/main.py`, `.env.example`, `infra/provision_database.sql`, `docker-compose.yml` | La API falla al arrancar si falta una variable obligatoria; no existe ningún secreto en el repositorio. |
| 0.2 | Eliminar credenciales demo del frontend y del seed. Reemplazar por variables de entorno o un flujo de invitación. | `login/page.tsx`, `infra/seed_admin.py` | Ninguna contraseña real aparece en el bundle ni en el código. |
| 0.3 | Eliminar `reset_token_simulated` del esquema y de la respuesta. Implementar envío por correo y mantener respuesta uniforme. | `apps/api/main.py`, `login/page.tsx`, `tests/test_auth_features.py` | El token nunca viaja en la respuesta HTTP; el test verifica su ausencia. |
| 0.4 | Deshabilitar los botones OAuth simulados o implementar el flujo real de autorización con canje de código y verificación del ID token. | `login/page.tsx`, `apps/api/main.py` | Un payload arbitrario con email ajeno no puede emitir un JWT. |
| 0.5 | Proteger `GET /leads` con rol admin y agregar paginación. | `apps/api/main.py` | Sin token admin responde 401/403; no se expone PII. |
| 0.6 | Exigir consentimiento explícito en todos los formularios de lead y desmarcar marketing por defecto. | `page.tsx`, `AuditModal.tsx`, `apps/api/main.py` | `accept_terms=false` se rechaza con 400; marketing inicia en `false`. |
| 0.7 | Completar migraciones para `password_resets` y `external_accounts`; unificar el esquema maestro con las tablas que usa la app. | `infra/migrations/`, `docker-compose.yml`, `apps/api/NAXORESUELVE_SQL_MAESTRO_POSTGRESQL.sql` | Un contenedor limpio permite registro, login, recuperación y OAuth sin errores 500. |
| 0.8 | Hacer resiliente el arranque: capturar el fallo de `create_pool`, dejar `pool=None` y permitir que la app responda 503. | `apps/api/main.py` | La API inicia con la base caída y `/health/ready` devuelve 503. |
| 0.9 | Configurar CORS y `NEXT_PUBLIC_API_URL` por entorno, sin fallback a localhost. | `apps/api/main.py`, `apps/web/.env.example`, páginas que consumen la API | El dominio de producción está permitido y el build falla si falta la URL. |
| 0.10 | Agregar rate limiting y límite de tamaño en `/leads` y `/auth/*`. | `apps/api/main.py` | Ráfagas anómalas reciben 429; no se agota el pool. |

### 3.2 Simplificación inmediata de `apps/web/src/app/page.tsx`

**Objetivo:** pasar de 1.916 líneas a una composición de menos de 200 líneas, con datos y secciones desacoplados.

1. **Crear la fuente de verdad comercial**
   - `apps/web/src/data/services.ts`: exactamente los 3 servicios canónicos, con `id`, `name`, `promise`, `priceFrom`, `deliverables`, `whatsappMessage`.
   - `apps/web/src/data/specialties.ts`: los 12 servicios secundarios (hardware, domótica, CCTV, soporte, etc.) como catálogo opcional, no como oferta principal.
   - `apps/web/src/data/caseStudies.ts`, `promotions.ts`, `products.ts`.
   - Replicar la misma estructura en `apps/api` o, mejor, generar un `services.json` compartido para API y frontend.

2. **Dividir la página en componentes**
   - `components/home/HeroSection.tsx`
   - `components/home/CanonicalServicesSection.tsx`
   - `components/home/SpecialtiesSection.tsx`
   - `components/home/CaseStudiesSection.tsx`
   - `components/home/VideoDemoSection.tsx`
   - `components/home/PromotionsSection.tsx`
   - `components/home/ContactSection.tsx`
   - `components/home/Footer.tsx`
   - `components/home/Navbar.tsx`
   - `page.tsx` solo compone y pasa callbacks.

3. **Reescribir el hero para pymes**
   - H1 propuesto: “Digitaliza tus procesos, vende más y mantén tu operación rápida y segura”.
   - Subtítulo: “Software a medida, presencia web y optimización de infraestructura para pymes chilenas. 100% remoto a todo Chile.”
   - Insignia visible: “Modalidad 100% Remota a todo Chile”.
   - CTA primario: “Cotizar por WhatsApp”; CTA secundario: “Diagnóstico gratis”.
   - Eliminar del primer scroll: Three.js, “3FN / GIN”, “testing rudo”, “código limpio”.

4. **Exponer solo los 3 servicios troncales**
   - Digitalización de Procesos & Software a Medida — Desde $150.000 CLP.
   - Presencia Web & Conversión Digital — Desde $80.000 CLP.
   - Infraestructura & Optimización de Rendimiento — Desde $50.000 CLP.
   - Cada tarjeta debe incluir: problema del cliente, resultado esperado, precio desde, entregable y CTA a WhatsApp contextual.
   - Mover hardware, domótica, CCTV, soporte técnico y Excel a una sección secundaria “Especialidades complementarias” con acordeón.

5. **Corregir el copy**
   - “ahorra tiempo, perder dinero” → “ahorra tiempo y evita perder dinero”.
   - Reemplazar “No vendo líneas de código” por un beneficio medible.
   - Eliminar “Docker”, “FastAPI”, “PostgreSQL”, “Pydantic”, “MFA TOTP”, “3FN”, “GIN”, “SDLC”, “CI/CD” y “memory leaks” del texto orientado a clientes; dejarlos solo en el expediente técnico opcional.

6. **Reducir la carga cognitiva**
   - Mover promociones, preventa y tienda multi-SaaS debajo de los casos de estudio, o a una página `/promociones`.
   - Reducir de 15 tarjetas a 3 tarjetas principales + acordeón de especialidades.
   - Eliminar la duplicación entre `SERVICES_DATA`, `ServicesQuickModal` y `PLATFORM_SERVICES`.

7. **Alinear metadata**
   - Title: “Naxo Resuelve | Software a medida, web y rendimiento para pymes”.
   - Description: los 3 servicios y “100% remoto a todo Chile”.
   - Corregir el correo oficial y el enlace de LinkedIn del sidebar.

### 3.3 Ajustes de integración del botón flotante de WhatsApp

1. **Centralizar configuración**
   - Crear `apps/web/src/lib/whatsapp.ts`:
     - `WHATSAPP_PHONE = "56957286145"`.
     - `buildWhatsAppUrl({ service, source, message })`.
   - Eliminar las constantes duplicadas de `page.tsx`, `login/page.tsx` y `FloatingWhatsApp.tsx`.

2. **Hacerlo global**
   - Mover `<FloatingWhatsApp />` a `apps/web/src/app/layout.tsx`, después de `{children}`, para que aparezca en `/`, `/login` y `/portal`.
   - Coordinar `z-index`: los modales usan `z-50`; el botón también. Subir modales a `z-[60]` o bajar el botón cuando haya un modal abierto.

3. **Mensaje contextual**
   - Cada servicio debe generar un mensaje distinto:
     - “Hola Naxo Resuelve, vengo de la sección de Digitalización. Necesito automatizar un proceso.”
     - “Hola Naxo Resuelve, quiero cotizar Presencia Web & Conversión Digital.”
     - “Hola Naxo Resuelve, necesito optimizar la infraestructura de mi empresa.”
   - Incluir un tag de origen (`[origen: hero]`, `[origen: servicio-presencia-web]`) para medir conversión sin incluir datos personales.

4. **Fallback de formularios**
   - En error de `POST /leads`, mostrar un botón “Continuar por WhatsApp” con el mensaje ya redactado.
   - En éxito, ofrecer “Confirmar por WhatsApp” para acelerar la respuesta comercial.

5. **Mobile y accesibilidad**
   - Aplicar `bottom: calc(1.5rem + env(safe-area-inset-bottom))`.
   - Persistir el cierre del tooltip en `sessionStorage`.
   - Ocultar el tooltip automáticamente después de unos segundos.
   - Mantener `aria-label`, foco visible y área táctil mínima de 44 × 44 px.

6. **Pruebas**
   - Agregar un test unitario para `buildWhatsAppUrl` que valide codificación, teléfono y mensaje.
   - Agregar un test E2E que verifique que el botón aparece en `/`, `/login` y `/portal` y que el enlace contiene `wa.me/56957286145?text=`.

### 3.4 Diseño, accesibilidad y rendimiento

1. **Restaurar tokens canónicos**
   - `--bg-dark: #0a0c10`, `--bg-surface: #141822`, `--bg-card: #141822`, `--bg-inner: #10141d`.
   - Acento vino `#721828`; dorado `#cba135`; texto principal `#ffffff`.
   - Actualizar `globals.css`, `layout.tsx` y las clases inline de `page.tsx`.
   - Actualizar `test_media_and_navbar_integrity.py:174-176` para que valide la paleta canónica, no `#3a3640`.

2. **Corregir contraste**
   - No usar `#ff6b85` para texto normal sobre fondos claros; reservarlo para títulos grandes o reemplazarlo por `#ffffff`/`#f2cf6b`.
   - Revisar todos los pares texto/fondo con una herramienta de contraste y apuntar a 7:1 en cuerpo de texto.
   - No declarar WCAG AAA hasta que la medición lo confirme.

3. **Three.js**
   - Opción recomendada: reemplazar el nodo 3D por un SVG/CSS estático o una animación ligera; elimina 533 KB y el rAF continuo.
   - Si se conserva: cargarlo solo al entrar en viewport con `IntersectionObserver`, pausar el rAF cuando la pestaña no esté visible, respetar `prefers-reduced-motion` en JS y limitar el `mousemove` al canvas.
   - Añadir una descripción textual accesible del nodo para lectores de pantalla.

4. **Videos**
   - Reemplazar los MP4 por versiones comprimidas de menos de 5 MB, 720p, `faststart`, con póster WebP.
   - Usar `preload="none"` o `metadata` y cargar el video solo al hacer clic.
   - Eliminar el segundo video si no aporta a la conversión.
   - Mover los videos fuera de Git (CDN, Cloudflare R2 o Git LFS) para no inflar el repositorio.

5. **Lazy loading**
   - Cargar `FiscalisCarousel`, `ModernCanvasVideoPlayer`, `SdlcLifecycleCarousel` y modales solo cuando el usuario interactúe o cuando estén cerca del viewport.
   - Medir LCP, INP y CLS en móvil antes y después.

### 3.5 Arquitectura, contratos y base de datos

1. **Una sola fuente de esquema**
   - Aplicar el esquema maestro o crear migraciones idempotentes para `password_resets`, `external_accounts`, `users` y `leads`.
   - Decidir si la app usará `identity.users`/`crm.leads` (UUID) o tablas públicas (enteros). No mezclar ambos modelos.
   - Agregar un test de integración que levante una base vacía, aplique migraciones y ejecute registro, login, recuperación y OAuth.

2. **Contratos tipados**
   - Crear modelos Pydantic v2 de salida: `ProductItem`, `ServiceItem`, `CategoryItem`, `RequestItem`, `DashboardOut`, `AuditItem`.
   - Crear `apps/web/src/types/api.ts` con las mismas estructuras y una función de mapeo `snake_case → camelCase`.
   - Corregir el portal para mapear `id` numérico, `status: "en_proceso"` y `service_name`.
   - Agregar un test de contrato contra el OpenAPI de FastAPI.

3. **Resiliencia**
   - Envolver `create_pool` en `try/except`, registrar el error y continuar con `pool=None`.
   - Mantener el 503 en todos los endpoints dependientes de base de datos.
   - Añadir `TrustedHostMiddleware` y límites de tamaño de request.

4. **Datos reales**
   - Eliminar los fallbacks ficticios del dashboard o etiquetarlos explícitamente como “datos de demostración”.
   - Si se mantienen para demos, separarlos en un endpoint `/demo/dashboard` y no mezclarlos con datos de clientes.

5. **Seguridad de sesión**
   - Evaluar cookies `HttpOnly`, `Secure` y `SameSite=Strict` en lugar de `localStorage`.
   - Implementar CSP con nonce o hash y agregar `Permissions-Policy`.
   - Agregar rate limiting en autenticación y leads.

### 3.6 Limpieza de dependencias y activos innecesarios

| Elemento | Acción | Motivo |
| :--- | :--- | :--- |
| `three` y `@types/three` | Mover `@types/three` a `devDependencies`. Si se reemplaza el nodo 3D, eliminar ambos. | 533,5 KB de chunk y rAF continuo. |
| `@types/three` en `dependencies` | Mover a `devDependencies` | Los tipos no deben viajar al runtime de producción. |
| `Download` en `page.tsx` y `CyberLateralSidebar.tsx` | Eliminar el import | No se usa. |
| `idx` en `page.tsx:772` | Eliminar o usar en la key/aria | Advertencia de lint. |
| `RotateCcw` y `currentStepIndex` en `AccessibilityToolbar.tsx` | Eliminar o implementar | Advertencias de lint. |
| `cvUrl` en `CyberLateralSidebar.tsx` | Eliminar la prop o implementar el CV | Prop sin uso y enlace muerto potencial. |
| `ModernCanvasVideoPlayer.tsx` (1.001 líneas) | Evaluar reemplazo por `<video controls>` nativo | Complejidad alta para el valor que aporta. |
| Segundo video MP4 | Eliminar o comprimir | 29,93 MB adicionales. |
| Constantes de teléfono duplicadas | Centralizar en `lib/whatsapp.ts` | Evitar deriva de datos. |
| `normalizeContactService` y `normalizeAuditTopic` | Mover a `lib/taxonomy.ts` | Lógica duplicada y acoplada a la página. |
| `apps/web/out` | Mantener fuera de Git; ya está ignorado | Artefacto de build de 76,7 MB. |
| Videos versionados en Git | Migrar a CDN/Git LFS | 75 MB en el historial. |

> No se recomienda eliminar `@tailwindcss/turbopack`, `lucide-react` ni `eslint-config-next` sin verificar primero el build; actualmente son necesarios o están en uso.

### 3.7 Pruebas y CI — Definition of Done

1. **Corregir lint**
   - Resolver los 5 errores de `react-hooks/set-state-in-effect` y `react-hooks/immutability`.
   - Eliminar las 10 advertencias de imports/variables sin uso y dependencias de hooks.
   - Ejecutar `npm run lint` y exigir 0 errores.

2. **Pruebas negativas de seguridad**
   - `forgot-password` no debe incluir el token en la respuesta.
   - Un payload OAuth con email ajeno debe ser rechazado.
   - `GET /leads` sin token admin debe devolver 401/403.
   - `accept_terms=false` debe devolver 400 en todos los formularios.
   - Marketing debe iniciar en `false` y no enviarse sin acción explícita.
   - `GET /leads` no debe exponer `password_hash`, `salt` ni datos de otros usuarios.

3. **Pruebas de integración reales**
   - Levantar PostgreSQL efímero, aplicar migraciones y ejecutar el flujo completo.
   - Dejar de aceptar 503 como éxito en pruebas que deberían tener base de datos.
   - Separar pruebas unitarias de pruebas de integración.

4. **Pruebas E2E de frontend**
   - Playwright o similar para `/`, `/login`, `/portal`.
   - Verificar CTAs de WhatsApp, formularios, consentimiento y navegación.
   - Verificar que el botón flotante aparece en todas las rutas.

5. **Presupuesto de rendimiento**
   - LCP < 2,5 s en 4G móvil.
   - JS inicial < 200 KB gzip.
   - Video inicial < 5 MB o carga bajo demanda.
   - Three.js eliminado o cargado solo por interacción.

6. **Pipeline mínimo**
   - `pytest -q`
   - `npm run lint`
   - `npm run build`
   - `npx tsc --noEmit` si se agrega script de typecheck.
   - Fallar el pipeline si cualquiera devuelve error.

### 3.8 Orden de ejecución recomendado

- [ ] **Día 1:** Fase 0 completa (seguridad, secretos, OAuth, reset token, consentimiento, migraciones).
- [ ] **Día 2:** Restaurar catálogo canónico en `PROJECT.md` y crear `services.ts`.
- [ ] **Día 3:** Refactorizar `page.tsx` en componentes y reescribir el hero.
- [ ] **Día 4:** Integrar WhatsApp contextual y global; corregir CTAs.
- [ ] **Día 5:** Paleta canónica, contraste y limpieza de dependencias.
- [ ] **Día 6:** Compresión de videos, lazy loading y eliminación de Three.js o carga condicional.
- [ ] **Día 7:** Contratos Pydantic/TS, portal, CORS y resiliencia de arranque.
- [ ] **Día 8:** Pruebas negativas, E2E, presupuesto de rendimiento y CI.
- [ ] **Día 9:** Auditoría de cierre y verificación de `AGENTS.md`.

---

## Anexo A — Evidencia técnica

### A.1 Comandos ejecutados

```powershell
pytest -q
# 110 passed, 2 warnings in 4.83s

npm run lint
# 5 errors, 10 warnings

npm run build
# ✓ Compiled successfully
# Route (app): /, /_not-found, /login, /portal
```

### A.2 Búsquedas de verificación

- `rg "150\.000|80\.000|50\.000|100% Remota|Digitalización de Procesos|Presencia Web|Infraestructura"` → solo aparecen en `AUDIT.md`; no en `PROJECT.md`, `page.tsx` ni `main.py` como catálogo canónico.
- `rg "C:\\\\|C:/"` → sin rutas absolutas locales en código de producto; solo en pruebas de seguridad y documentación.
- `rg "execute\(f|fetch\(f|fetchrow\(f|fetchval\(f|\.format\("` en `apps/api/main.py` → sin coincidencias de SQL interpolado.
- `rg "password_resets|external_accounts"` en `infra/migrations` → sin definiciones; solo se usan en `main.py`.
- `rg "accept_terms|accept_marketing|checked="` → marketing pre-marcado en `page.tsx:971`, `:1351`; OAuth con `accept_terms: true` en `login/page.tsx:215`.

### A.3 Contraste calculado

| Combinación | Ratio | Evaluación |
| :--- | :---: | :--- |
| `#ffffff` sobre `#3a3640` | 11,79:1 | AAA |
| `#f5dade` sobre `#3a3640` | 8,96:1 | AAA |
| `#f2cf6b` sobre `#3a3640` | 7,81:1 | AAA |
| `#c29da5` sobre `#3a3640` | 4,86:1 | AA normal, no AAA |
| `#ff6b85` sobre `#3a3640` | 4,32:1 | No alcanza AA normal |
| `#c29da5` sobre `#423943` | 4,56:1 | AA normal, no AAA |
| `#ffffff` sobre `#141822` | 17,74:1 | AAA |

### A.4 Tamaños de activos

| Activo | Tamaño |
| :--- | :---: |
| `dashboard-excel-agricola-contratistas.mp4` | 44,82 MB |
| `dashboard-excel-agricola-contratistas2.mp4` | 29,93 MB |
| Chunk principal de Three.js | 533,5 KB |
| `apps/web/out` completo | 76,7 MB |

---

**Conclusión:** Naxo Resuelve tiene los fundamentos de ingeniería para convertirse en una plataforma sólida, pero hoy vende una cosa, muestra otra y expone riesgos críticos de identidad y privacidad. La secuencia correcta es: **cerrar seguridad y consentimiento, restaurar la oferta canónica, simplificar la portada y recién después optimizar la experiencia visual**.
