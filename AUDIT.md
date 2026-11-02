# 🔍 DIRECTIVA DE AUDITORÍA INTEGRAL: NAXO RESUELVE

> **Rol del Agente:** Actúa como Consultor Principal de Arquitectura de Software y Estratega de Producto.
> **Objetivo:** Inspeccionar el repositorio para diagnosticar inconsistencias entre el código actual, la propuesta de valor comercial y el mandato técnico establecido en `PROJECT.md` y `AGENTS.md`.

---

## 1. Alcance de la Inspección

### A. Semántica Comercial y Conversión (`apps/web/src/app/page.tsx`)
1. **Detección de Fricción Técnica:** Identifica textos, jerga de desarrollo o explicaciones internas (como menciones a Docker, APIs, PostgreSQL o arquitecturas complejas) que confundan a dueños de negocios o pymes.
2. **Alineación con el Catálogo Canónico:** Verifica que la portada exponga exclusivamente los 3 servicios troncales definidos en `PROJECT.md`:
   - *Digitalización de Procesos & Software a Medida* (Desde $150.000 CLP).
   - *Presencia Web & Conversión Digital* (Desde $80.000 CLP).
   - *Infraestructura & Optimización de Rendimiento* (Desde $50.000 CLP).
3. **Escudo Operativo:** Confirma la presencia visible de la insignia de servicio: `Modalidad 100% Remota a todo Chile`.
4. **Puntos de Conversión:** Revisa los botones de llamada a la acción (CTA) y valida si redirigen a WhatsApp con mensaje precargado o a formulario de admisión.

### B. Diseño, UI y Experiencia de Usuario (`apps/web`)
1. **Tokens Visuales y Accesibilidad:** Contrasta los estilos contra la paleta canónica de `PROJECT.md`:
   - Fondo Obsidian: `#0a0c10` / `#141822`.
   - Acento Vino Tinto: `#721828`.
   - Acento Champagne Gold: `#cba135`.
   - Texto: `#ffffff` (Contraste WCAG AAA).
2. **Sobrecarga de Renderizado:** Revisa si componentes interactivos pesados (como WebGL/Three.js o nodos 3D) ralentizan la carga inicial en dispositivos móviles.

### C. Arquitectura y Desacoplamiento (`apps/api` vs `apps/web`)
1. **Independencia de Servicios:** Verifica que el backend en FastAPI y el frontend en Next.js no mantengan dependencias de rutas locales absolutas (ej. `C:\Apache64\...`).
2. **Resiliencia ante Fallos de Conexión:** Inspecciona si los endpoints públicos de catálogo y portal devuelven `503 Service Unavailable` controlado cuando la base de datos no está disponible, según exige `AGENTS.md`.
3. **Contratos de API:** Comprueba que las interfaces de TypeScript en `apps/web` coincidan con los esquemas Pydantic v2 en `apps/api`.

### D. Seguridad y Normativa (`tests/` y `apps/api`)
1. **Consultas SQL:** Confirma que no existan sentencias construidas con interpolación de cadenas, verificando el uso exclusivo de parámetros `$1`, `$2` en `asyncpg`.
2. **Cumplimiento Legal (Chile):** Valida que no existan casillas de consentimiento pre-marcadas y que los tokens de recuperación expiren en 15 minutos almacenados como hash SHA-256.

---

## 2. Entregable Requerido

Genera un informe consolidado en `AUDIT_REPORT.md` con la siguiente estructura:

1. **Resumen Ejecutivo:** Diagnóstico de salud del proyecto (Semántica, Diseño, Arquitectura, Pruebas).
2. **Matriz de Inconsistencias:** Tabla detallando archivo, problema detectado, severidad (Alta/Media/Baja) e impacto en el negocio.
3. **Plan de Acción Refactorizado (Paso a Paso):**
   - Tareas inmediatas para simplificar `apps/web/src/app/page.tsx`.
   - Ajustes de integración con el botón flotante de WhatsApp.
   - Limpieza de dependencias innecesarias.
