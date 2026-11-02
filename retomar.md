# Retomar — Landing Page Naxo Resuelve

## Estado actual

- Rama activa: `main`.
- Rama de respaldo creada: `archive/fullstack-portal-v1` (apunta al commit `9b0aaf1`).
- Portada antigua respaldada en: `apps/web/src/app/page.fullstack.backup.tsx` (1.916 líneas).
- `apps/web/src/app/page.tsx` está **incompleto**: tiene imports, metadata, datos, helpers, header y hero; falta el resto y no cierra correctamente `main`.
- Imagen local placeholder creada: `apps/web/public/images/pablo-profile.jpg`.
- `apps/api/`, `infra/` y `docker-compose.yml` permanecen intactos.
- No se ha ejecutado build ni lint sobre la landing nueva.

## Pendiente inmediato

1. Completar `apps/web/src/app/page.tsx`:
   - Reemplazar el marcador `{/* CATALOG_CONTENT */}` por el catálogo.
   - Cerrar correctamente `</main>` y el contenedor principal.
   - Agregar metodología, proyectos, autor, footer y WhatsApp flotante.

2. Catálogo con 4 `<details>`:
   - Software, Automatización & Control de Gestión — Desde $150.000 CLP.
   - Presencia Web & Captación Digital — Desde $80.000 CLP.
   - Infraestructura, Soporte Técnico & Rendimiento — Desde $50.000 CLP.
   - Proyectos Especiales & Consultoría Técnica, con los 4 bloques exactos:
     - Análisis de Datos & Dashboards.
     - Ciberseguridad & Auditoría.
     - Integraciones a Medida.
     - Hardware & Redes Locales.
   - Texto final: “Si tu negocio tiene un cuello de botella específico, evaluamos la viabilidad técnica en 15 minutos.”

3. Metodología:
   - Diagnóstico Breve (15 min).
   - Alcance Cerrado y Anticipo 50% (Propuesta formal).
   - Pruebas en Servidor Staging (Entorno privado).
   - Entrega Definitiva y Código Transferible.

4. Autor:
   - Pablo Valdés Sandoval — Analista Programador (Técnico de Nivel Superior, CFT San Agustín).
   - Incluir textualmente: “Como Analista Programador, garantizo código propio y revisado bajo buenas prácticas de ingeniería. Cero automatizaciones de Inteligencia Artificial a ciegas o código inestable.”
   - Usar `src="/images/pablo-profile.jpg"`.

5. Reglas de contenido:
   - Paleta: base `#0a0c10`, superficies `#141822`, hover `#1e2638`, vino `#721828`, dorado `#cba135`, WhatsApp `#25D366`.
   - Ocultar el teléfono en botones; mantener `href="https://wa.me/56957286145"`.
   - Eliminar “Factura SII”, “Facturación Electrónica” y “SII Inmediata”; reemplazar por “Propuesta Formal y Presupuesto Cerrado”.
   - Footer con “© 2026”.
   - Sin enlaces de imágenes de Google; solo ruta local.

## Verificación al terminar

```powershell
cd apps\web
npm run build
npx eslint src/app/page.tsx
```

- `npm run build` debe compilar sin errores de TypeScript.
- `npx eslint src/app/page.tsx` debe pasar sin errores.
- Nota: `npm run lint` global seguirá fallando por errores preexistentes en `page.fullstack.backup.tsx`, `AccessibilityToolbar.tsx` y `AuditModal.tsx`; no son de la landing nueva.

## Estado Git pendiente

Cambios sin commit que no están congelados en la rama de respaldo:

- `PROJECT.md`
- `agents.md`
- `gemini.md` eliminado
- `AUDIT.md`
- `AUDIT_REPORT.md`
- `apps/web/public/images/`
- `apps/web/src/app/page.tsx`

No hacer commit ni push sin autorización explícita.

## Siguiente paso

Leer este archivo (`retomar.md`), completar `page.tsx` y ejecutar las verificaciones indicadas.
