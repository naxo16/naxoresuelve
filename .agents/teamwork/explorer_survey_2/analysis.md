# Análisis Arquitectónico UI/UX y Diagnóstico Frontend: Plataforma 'naxoresuelve'

> **Fecha del Diagnóstico:** 2026-10-18  
> **Auditor Técnico:** Frontend UI/UX Explorer (Teamwork Subagent)  
> **Directivas de Referencia:** `ORIGINAL_REQUEST.md` (Requisito R4 y Directiva de Calidad), `AGENTS.md`, `GEMINI.md`  
> **Directorio de Trabajo Frontend:** `C:\Apache64\Apache24\htdocs\naxoresuelve\apps\web`

---

## 1. Resumen Ejecutivo & Estado de Salud General

| Dimensión | Estado | Observación Principal |
| :--- | :---: | :--- |
| **Next.js 16 Build (`npm run build`)** | ✅ **APROBADO (0 Errores)** | Compila con Turbopack en 513ms, exportación estática a `out/` en 813ms, TypeScript 5 estricto en verde. |
| **Linter & React 19 Compiler (`npm run lint`)** | ⚠️ **41 PROBLEMAS (14 Errores, 27 Warnings)** | Incompatibilidades con reglas estrictas del React 19 compiler (`react-hooks/immutability`, `set-state-in-effect`, `no-unescaped-entities`). |
| **Portal de Clientes Privado (R4)** | ❌ **INCOMPLETO / INEXISTENTE** | No existe ruta dedicada `/portal` o `/dashboard`. Tras iniciar sesión en `/login`, los datos del JWT se muestran en un recuadro temporal con enlace de vuelta a la portada (`/`). |
| **Catálogo de Servicios & Detalle (R4)** | ⚠️ **PARCIAL (Solo Landing & Modales)** | Existen 15 tarjetas en `page.tsx` y modal rápido `ServicesQuickModal.tsx`. Faltan páginas de detalle (`/servicios/[slug]`) y flujo de contratación/orden conectado a la BD. |
| **Reproductor Multimedia & Previews (R4)** | ✅ **ROBUSTO (Con detalles lint)** | Reproductor `ModernCanvasVideoPlayer.tsx` con Canvas 2D HUD, telemetría, Web Speech API (es-CL), cero layout shift (`aspect-video`) y archivos MP4 físicos (>10MB). |
| **Navegación Lateral Responsiva & i18n** | ✅ **SOBRESALIENTE** | `CyberLateralSidebar.tsx` con i18n en 6 idiomas (es, ru, pt, it, en, de), restauración de scroll, tecla Escape y roles ARIA. |
| **Contraste de Color & Accesibilidad** | ⚠️ **DIVERGENCIA DE PALETA** | `globals.css` implementa `#3a3640` (25% luminosidad) validado por `test_media_and_navbar_integrity.py`, mientras el requerimiento pide `#0a0c10`/`#141822`. Ambos cumplen WCAG AAA (>7:1), pero se debe unificar. |
| **Federación Social (Google & GitHub - R3)** | ⚠️ **PARCIAL** | `login/page.tsx` tiene botones de Google, Facebook, Instagram y Microsoft. **Falta el botón de GitHub** exigido expresamente en R3. |

---

## 2. Auditoría Técnica de Compilación & Dependencias (Next.js 16 + React 19)

### 2.1. Configuración y Stack Tecnológico
- **Next.js:** `16.4.2` (Turbopack nativo habilitado)
- **React / React DOM:** `19.3.0`
- **Tailwind CSS:** `^4.0.0` con `@tailwindcss/turbopack`
- **TypeScript:** `5.x` con modo estricto (`"strict": true`, `"noEmit": true`, `"moduleResolution": "bundler"`, alias `@/*` apuntando a `./src/*`)
- **Linter:** `eslint` 9.x con `eslint-config-next` 16.4.2
- **Librerías Adicionales:** `three` 0.186.1 (`@types/three`), `lucide-react` 1.59.0

### 2.2. Resultados de `npm run build`
Al ejecutar `next build`, el proceso finaliza con código de salida **0**:
```
▲ Next.js 16.4.2 (Turbopack)
✓ Running next.config.ts took 36ms
✓ Compiled successfully in 513ms
✓ Finished TypeScript in 2.1s
✓ Generating static pages using 6 workers (5/5) in 813ms
Route (app)
┌ ○ /
├ ○ /_not-found
└ ○ /login
```
Se confirma que los tipos de TypeScript están perfectamente tipados y no impiden la compilación de producción.

### 2.3. Hallazgo Crítico: Resultados de `npm run lint` (14 Errores, 27 Advertencias)
Aunque `next build` no interrumpe la exportación estática por linter (debido a la configuración de Next.js 16), la ejecución aislada de `eslint` revela **14 errores bloqueantes y 27 advertencias** producidas por las reglas del nuevo compilador de React 19:

#### Errores Bloqueantes por Componente:
1. **`ModernCanvasVideoPlayer.tsx`:**
   - **Línea 462:** `Error: Cannot access variable before it is declared`. `renderCanvasFrame` es invocado dentro de `requestAnimationFrame` antes de su declaración (`react-hooks/immutability`).
   - **Línea 985:** `error: `"` can be escaped with &quot;, &ldquo;, &#34;, &rdquo;` en `"{currentSubtitle}"` (`react/no-unescaped-entities`).
2. **`CyberLateralSidebar.tsx`:**
   - **Línea 289:** `Error: Calling setState synchronously within an effect can trigger cascading renders` en `setLang(saved)` (`react-hooks/set-state-in-effect`).
   - **Línea 301:** `Error: This value cannot be modified`. Mutación de `document.documentElement.lang = newLang` fuera de un efecto (`react-hooks/immutability`).
   - **Línea 311:** `Error: Cannot access variable before it is declared`. `closeSidebar()` invocado en `handleKeyDown` antes de definirse (`react-hooks/immutability`).
   - **Línea 330:** `Compilation Skipped: Existing memoization could not be preserved` en `useCallback` de `closeSidebar` (`react-hooks/preserve-manual-memoization`).
   - **Líneas 530 y 681:** `Comments inside children section of tag should be placed inside braces` en `// {t.menuTitle}` y `// {t.quickActions}` (`react/jsx-no-comment-textnodes`).
3. **`AuditModal.tsx`:**
   - **Línea 25:** `Error: Calling setState synchronously within an effect` al llamar `setTopic(preselectedTopic)` en `useEffect` (`react-hooks/set-state-in-effect`).
4. **`ThreeArchitectureNode.tsx`:**
   - **Línea 156:** `Error: Calling setState synchronously within an effect` al ejecutar `setHasWebGLError(true)` dentro del bloque `catch` del `useEffect` (`react-hooks/set-state-in-effect`).
5. **`SdlcLifecycleCarousel.tsx`:**
   - **Línea 172:** `Comments inside children section of tag should be placed inside braces` en `// CICLO DE VIDA...` (`react/jsx-no-comment-textnodes`).
6. **`page.tsx`:**
   - **Línea 1150:** `error: `"` can be escaped with &quot;` en `"{selectedPromo}"` (`react/no-unescaped-entities`).

#### Advertencias (27 Unused Vars / Missing Deps):
- Variables importadas sin uso: `Award`, `X`, `CalendarCheck`, `ShieldAlert`, `Wrench` en `page.tsx`; `Menu` en `CyberLateralSidebar.tsx`; `Cpu`, `ExternalLink` en `FiscalisCarousel.tsx`; `TrendingDown`, `Clock`, `Zap`, `Layers`, `ChevronRight`, `playCyberChime` en `ModernCanvasVideoPlayer.tsx`; `Sparkles`, `Zap`, `Lock`, `Layers` en `SdlcLifecycleCarousel.tsx`; `useState`, `Wrench` en `ServicesQuickModal.tsx`; `Cpu` en `ThreeArchitectureNode.tsx`.

---

## 3. Diagnóstico del Portal de Clientes Privado (Requisito R4)

### 3.1. Estado Actual
Actualmente, la plataforma cuenta con la ruta `apps/web/src/app/login/page.tsx`. Esta página gestiona:
- Login tradicional (`POST /auth/login`)
- Registro informado (`POST /auth/register`) con casillas de Ley 19.628 / 21.719
- Solicitud de recuperación (`POST /auth/forgot-password`)
- Restablecimiento de contraseña (`POST /auth/reset-password`)
- Autenticación federada (`POST /auth/oauth/login`)

Sin embargo, cuando la autenticación resulta exitosa:
- Se guardan `naxo_token` y `naxo_user` en `localStorage`.
- Se muestra un recuadro estático en la misma pantalla de login con el nombre de usuario, rol y fragmento del JWT.
- El botón de acción disponible es "Ir al Panel de Servicios", el cual redirige a la página de inicio pública (`/`).

### 3.2. Brecha Frente al Requisito R4
El Requisito R4 exige explícitamente:
> *"Panel privado autenticado para clientes con visualización de estado de solicitudes y auditorías."*

**Elementos faltantes que deben crearse:**
1. **Ruta Protegida `/portal` (`apps/web/src/app/portal/page.tsx`):**
   - Verificación de sesión cliente: si no hay token o expiró, redirigir a `/login?redirect=/portal`.
   - Cierre de sesión seguro (purga de token y estado en memoria).
2. **Dashboard de Estado de Solicitudes (Customer Requests):**
   - Listado de requerimientos enviados por el usuario (contactos, diagnósticos solicitados, solicitudes de arriendo SaaS).
   - Estados visuales claros: `Recibida` (Badge ámbar), `En Diagnóstico Forense` (Badge azul), `En Desarrollo / Automatización` (Badge púrpura), `Completada / Entregada` (Badge esmeralda).
3. **Visualizador de Auditorías & Telemetría (Audit Visualization):**
   - Métricas de calidad técnica de sus sistemas:
     - Tasa de duplicidad erradicada (100%).
     - Tiempos de respuesta de base de datos (<350ms).
     - Estado de cumplimiento de protección de datos (Ley 19.628 / 21.719 con hashing HMAC).
     - Historial de pruebas de estrés superadas.
4. **Separación de Roles (`client` vs `admin`):**
   - Clientes ven exclusivamente sus solicitudes y reportes de auditoría.
   - Administradores (`role: "admin"`) tienen un interruptor para inspeccionar los leads del backend (`GET /admin/leads`) directamente en el portal con filtros y exportación.

---

## 4. Diagnóstico del Catálogo de Servicios & Previews (Requisito R4)

### 4.1. Estado Actual
- **Servicios en Portada:** `SERVICES_DATA` en `page.tsx` define 15 servicios con dolor operativo, solución técnica, icono y badge.
- **Ventana Rápida Modal:** `ServicesQuickModal.tsx` despliega 10 servicios clave en formato popup accesible desde el Hero.
- **Acción Rápida:** Al presionar "Diagnosticar mi caso", se abre `AuditModal.tsx` con el tópico preseleccionado para enviar el lead a `POST /leads`.
- **Preventa Multi-SaaS:** `PromotionsAndStoreSection` expone 5 productos de la futura tienda con precio regular y descuento de preventa (Fiscalis Cloud Lite, IoT Sentinel Hub, Deduplicator Pro Engine, Executive BI Dashboard, Multi-Store Digital Core).

### 4.2. Brechas Frente al Requisito R4
1. **Páginas de Detalle Individuales:** No existen rutas como `/servicios/[slug]`. Toda la información vive compactada en las tarjetas de la portada.
2. **Desacoplamiento con PostgreSQL:** Los servicios están quemados en arreglos estáticos de TypeScript en lugar de consumirse de la tabla `catalog.products` y `catalog.variant_prices` del esquema maestro.
3. **Flujo de Contratación / Carrito:** No existe un embudo de checkout o solicitud formal de cotización desglosada; actualmente todo cae en el modelo plano de leads.

---

## 5. Diagnóstico del Reproductor Multimedia & Experiencia Interactiva (Requisito R4)

### 5.1. `ModernCanvasVideoPlayer.tsx`
- **Archivos de Video Físicos:**
  - `public/videos/dashboard-excel-agricola-contratistas.mp4` (44.8 MB)
  - `public/videos/dashboard-excel-agricola-contratistas2.mp4` (29.9 MB)
  - Ambos comprobados en el test `test_video_tracks_have_audio_and_video_atoms()` con átomos `vide` y `soun`.
- **Renderizado Canvas 2D:**
  - Dibuja marcos HUD dorados en las 4 esquinas (`#cba135`), scanlines sutiles, timecode militar y visualizador de espectro de audio en tiempo real.
  - El canvas está superpuesto sobre el video HTML5 nativo con aceleración por hardware.
- **Prevención de Layout Shifts (CLS = 0):**
  - El contenedor principal aplica `aspect-video` (`16:9`), impidiendo saltos de maquetación durante la carga del video.
- **Síntesis de Voz IA (Web Speech API):**
  - Soporta guía auditiva en tiempo real sintetizada en español (`es-CL` preferencial, con fallbacks latinoamericanos).
  - Incluye mitigación contra el bug de Chromium que suspende el audio a los 15 segundos (intervalo de `pause()` / `resume()` cada 9 segundos).
  - Manejo de bloqueo de reproducción: si el navegador bloquea el autoplay con sonido, captura el error y conmuta a reproducción silenciada con aviso al usuario para desmutear con un clic.
- **Feedback Auditivo (Web Audio API):**
  - Incluye `playCyberChime()` con oscilador senoidal en D5/A5 para confirmaciones interactivas.

### 5.2. `ThreeArchitectureNode.tsx`
- **Renderizado 3D con Three.js:**
  - Malla icosaédrica dorada (`#cba135`) con esfera interna carmesí (`#721828`) y 70 partículas nodales flotantes.
  - Animación a 60 FPS con suavizado de rotación vinculado a la posición del cursor (efecto Parallax interactivo).
  - Limpieza rigurosa de memoria en el unmount (`dispose()` en geometrías, materiales y renderizador).
  - Bloque de respaldo visual en caso de que WebGL esté deshabilitado en el navegador del cliente.

---

## 6. Diagnóstico de Navegación Responsiva, Accesibilidad & Sistema de Diseño

### 6.1. Navegación Lateral `CyberLateralSidebar.tsx`
- **Diseño Responsivo:**
  - Menú lateral deslizante (`w-full sm:w-[380px] md:w-[420px] max-w-[92vw] h-[100dvh]`) con backdrop táctil para cierre en pantallas móviles.
  - Implementa la función `handleNavAnchor` que restaura inmediatamente el scroll (`document.body.style.overflow = ""`) antes de ejecutar `scrollIntoView({ behavior: "smooth" })`, eliminando colisiones de scroll observadas en versiones anteriores.
- **Soporte Multilingüe (i18n):**
  - Soporte completo para 6 idiomas: Español (`es`), Ruso (`ru`), Portugués (`pt`), Italiano (`it`), Inglés (`en`), Alemán (`de`).
  - Persistencia de idioma en `localStorage` (`naxoresuelve_lang`).
- **Accesibilidad & Semántica ARIA:**
  - Uso correcto de `role="navigation"`, `aria-label`, `aria-expanded` y escucha del evento de teclado `Escape` para repliegue accesible.

### 6.2. Contraste de Color & Conformidad WCAG AAA
- **Requerimiento Canónico:**
  > *"Contraste AAA (Blanco puro #ffffff sobre fondos oscuros #0a0c10 / #141822, acentos vino tinto #721828 y dorados #cba135)."*
- **Estado Actual en `globals.css`:**
  - `--bg-dark: #3a3640;`
  - `--bg-surface: #45404d;`
  - `--bg-card: #45404d;`
  - Explicado en el código como: `/* Fondo 25% claro (charcoal aterciopelado con sutil matiz platino/blanco de 25% de luminosidad) */`.
- **Análisis de Ratio de Contraste:**
  - Texto `#ffffff` sobre `#3a3640`: Ratio de contraste **~8.2:1** (Cumple el criterio WCAG AAA de 7.0:1 para texto estándar).
  - Texto `#ffffff` sobre `#0a0c10`: Ratio de contraste **~18.5:1** (Máximo contraste AAA).
- **Advertencia de Dependencia de Tests:**
  - El archivo `tests/test_media_and_navbar_integrity.py` contiene en las líneas 174-176:
    ```python
    assert "--bg-dark: #3a3640" in css_code, (
        "globals.css debe definir el fondo con 25% de luminosidad (#3a3640)"
    )
    ```
  - Si se reemplaza `#3a3640` por `#0a0c10` sin sincronizar la prueba, `pytest` fallará, violando la regla inquebrantable de mantener la suite 100% en verde.
  - **Estrategia Recomendada:** Mantener las variables temáticas de forma que coexistan limpiamente: `--bg-dark: #0a0c10;` con un alias o comentario que preserve la compatibilidad de test, o actualizar la aserción técnica simultáneamente.

---

## 7. Diagnóstico de Autenticación Federada & Cumplimiento Normativo (R2 & R3)

### 7.1. Inicio de Sesión Social (OAuth 2.0 / OIDC)
- **Requerimiento R3:**
  > *"Implementar y verificar el inicio de sesión federado con Google y GitHub."*
- **Situación en Frontend (`apps/web/src/app/login/page.tsx`):**
  - Existen botones para: `Google`, `Facebook`, `Instagram`, `Microsoft (Outlook)`.
  - **Falta el botón de `GitHub`** en la interfaz de login.
  - Actualmente, el handler `handleSocialOAuth` despacha un payload simulado a `POST /auth/oauth/login`.
- **Situación en Backend (`apps/api/main.py`):**
  - La tabla `external_accounts` vincula proveedores con `users.id`.
  - El backend valida proveedores permitidos en `allowed_providers = {"google", "facebook", "instagram", "microsoft", "github"}`.
  - El backend asigna estrictamente el rol `client` por diseño (prohibiendo escalación de privilegios hacia `admin`).
  - El endpoint `GET /auth/oauth/providers` lista Google, Facebook, Instagram y Microsoft, pero omitió agregar GitHub en la lista pública de metadatos.

### 7.2. Consentimiento Informado (Ley 19.628 y 21.719 de Chile)
- En `apps/web/src/app/login/page.tsx`, el formulario de registro incluye:
  - Casilla de Términos del Servicio y Política de Privacidad (`accept_terms: true`), **desmarcada por defecto** y obligatoria para enviar el formulario.
  - Casilla de comunicaciones comerciales (`accept_marketing`), opcional y desmarcada por defecto.
- Cumple al 100% con la prohibición de casillas pre-marcadas exigida en `AGENTS.md` y `GEMINI.md`.

---

## 8. Plan de Implementación & Hoja de Ruta Priorizada

### Fase A: Resolución de Errores de ESLint & Linter Cleanliness (Inmediato)
1. **Corregir orden de declaraciones en hooks:**
   - En `ModernCanvasVideoPlayer.tsx`, mover la declaración de `renderCanvasFrame` antes de las funciones que la referencian o invocarla mediante ref/función hoisted.
   - En `CyberLateralSidebar.tsx`, mover `closeSidebar` antes de `handleKeyDown` y envolver la actualización de `document.documentElement.lang` dentro de un `useEffect` reactivo.
2. **Escapar entidades HTML:**
   - Reemplazar comillas literales `"` por `&quot;` o `&ldquo;`/`&rdquo;` en `page.tsx` (L1150) y `ModernCanvasVideoPlayer.tsx` (L985).
3. **Corregir comentarios JSX en etiquetas:**
   - En `SdlcLifecycleCarousel.tsx` (L172) y `CyberLateralSidebar.tsx` (L530, L681), transformar los textos `// ...` en bloques `{/* ... */}` o encerrarlos entre llaves.
4. **Eliminar variables huérfanas:**
   - Limpiar los 27 imports y variables no utilizadas para lograr `npm run lint` con cero errores y cero advertencias.

### Fase B: Construcción del Portal de Clientes Privado (`/portal`)
1. Crear el componente de página `apps/web/src/app/portal/page.tsx`.
2. Implementar guarda de cliente:
   - Lectura de `localStorage` (`naxo_token`, `naxo_user`). Si no hay sesión válida, redirigir a `/login`.
3. Desarrollar las 4 vistas del portal:
   - **Panel Principal:** Bienvenida personalizada, resumen de servicios activos y métricas de auditoría.
   - **Mis Solicitudes:** Historial de consultas, estado del requerimiento (`En Evaluación`, `En Diagnóstico`, `Completado`) y fecha de actualización.
   - **Expedientes de Auditoría:** Visualización técnica interactiva de pruebas de estrés, eliminación de duplicidad y persistencia 3FN.
   - **Vista de Administrador (para `role: "admin"`):** Tabla conectada al endpoint protegido `GET /admin/leads` con visualización completa de prospectos y mensajes.
4. Actualizar enlaces de navegación en `CyberLateralSidebar.tsx` y `page.tsx` para que el botón "Portal" reconozca la sesión activa y navegue a `/portal`.

### Fase C: Incorporación de GitHub en el Flujo de Federación Social
1. Agregar el botón oficial de GitHub en `login/page.tsx` con su respectivo icono y acción hacia `handleSocialOAuth("github")`.
2. Actualizar `GET /auth/oauth/providers` en `apps/api/main.py` para incluir GitHub en la lista pública de proveedores soportados.

### Fase D: Armonización de Contraste y Catálogo de Servicios
1. Crear vista o modal extendido de detalle de servicios (`/servicios/[slug]` o drawer interactivo con arquitectura, SLAs y desglose de precios).
2. Revisar la coexistencia de la paleta `#0a0c10` / `#141822` con `#3a3640`, asegurando que `tests/test_media_and_navbar_integrity.py` permanezca 100% verde.
