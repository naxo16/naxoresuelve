# naxoresuelve

Este repositorio contiene la aplicación **naxoresuelve**, construida siguiendo la especificación maestra.

## Stack principal
- **Frontend:** Next.js (TypeScript) – estático/dinámico.
- **Backend:** FastAPI (Python) – monolito modular.
- **Base de datos:** PostgreSQL (Docker).
- **Orquestación:** Docker Compose.

## Cómo ejecutar en local
```bash
# Desde la raíz del proyecto
docker compose up -d   # levanta PostgreSQL y la API
# (el frontend es estático y se puede servir con `npm run dev` dentro de apps/web)
```

## Estructura del repositorio
```
na xoresuelve/
├─ apps/
│  ├─ api/            # FastAPI backend
│  └─ web/            # Next.js frontend
├─ docs/
│  └─ architecture/adr/ADR-001.md  # ADR inicial
├─ infra/
│  └─ docker-compose.yml
├─ .gitignore
├─ README.md
└─ ESPECIFICACION_MAESTRA_SOFTWARE.md   # Copia de la especificación
```

---
