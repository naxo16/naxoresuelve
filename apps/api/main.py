"""
naxoresuelve – FastAPI backend (monolito modular).

Endpoints:
  - GET  /health/live   → liveness check
  - GET  /health/ready  → readiness check (verifica conexión a DB)
  - POST /leads         → crear un lead de contacto con validación rigurosa
  - GET  /leads         → listar todos los leads
"""

from contextlib import asynccontextmanager
import datetime
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
import asyncpg

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://naxoresuelve:naxoresuelve@db:5432/naxoresuelve",
)

# ---------------------------------------------------------------------------
# DB connection pool (application-scoped)
# ---------------------------------------------------------------------------
pool: asyncpg.Pool | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage the asyncpg connection pool across the app lifespan."""
    global pool
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    yield
    if pool is not None:
        await pool.close()


app = FastAPI(
    title="naxoresuelve API",
    version="0.2.0",
    description="Backend modular con validación rigurosa y pruebas rudas de integridad.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Health endpoints
# ---------------------------------------------------------------------------


@app.get("/health/live")
async def health_live():
    """Liveness – the process is running."""
    return {"status": "live"}


@app.get("/health/ready")
async def health_ready():
    """Readiness – the process can reach the database."""
    if pool is None:
        raise HTTPException(status_code=503, detail="Database connection pool is not initialized")
    try:
        async with pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        return {"status": "ready"}
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc))


# ---------------------------------------------------------------------------
# Schemas con validación rigurosa contra fuzzing y datos corruptos
# ---------------------------------------------------------------------------


class LeadIn(BaseModel):
    name: str = Field(..., min_length=2, max_length=150, description="Nombre o empresa del contacto")
    email: EmailStr = Field(..., max_length=255, description="Correo electrónico válido")
    message: str = Field(..., min_length=5, max_length=5000, description="Detalle del requerimiento o dolor operativo")


class LeadOut(BaseModel):
    id: int
    name: str
    email: str
    message: str
    created_at: datetime.datetime


# ---------------------------------------------------------------------------
# Lead CRUD endpoints
# ---------------------------------------------------------------------------


@app.post("/leads", response_model=LeadOut, status_code=201)
async def create_lead(lead: LeadIn):
    """Persist a new contact lead with atomic transaction."""
    if pool is None:
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")

    try:
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                INSERT INTO leads (name, email, message, created_at)
                VALUES ($1, $2, $3, $4)
                RETURNING id, name, email, message, created_at
                """,
                lead.name.strip(),
                lead.email.strip().lower(),
                lead.message.strip(),
                datetime.datetime.now(datetime.timezone.utc),
            )
        return dict(row)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database transaction failed: {str(exc)}")


@app.get("/leads", response_model=list[LeadOut])
async def list_leads():
    """Return all leads ordered by id."""
    if pool is None:
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")

    try:
        async with pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT id, name, email, message, created_at FROM leads ORDER BY id"
            )
        return [dict(r) for r in rows]
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database query failed: {str(exc)}")
