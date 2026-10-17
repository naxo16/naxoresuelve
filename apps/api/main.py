"""
naxoresuelve – FastAPI backend (monolito modular).

Endpoints:
  - GET  /health/live   → liveness check
  - GET  /health/ready  → readiness check (verifica conexión a DB)
  - POST /leads         → crear un lead de contacto
  - GET  /leads         → listar todos los leads
"""

from contextlib import asynccontextmanager
import datetime
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
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
    await pool.close()


app = FastAPI(
    title="naxoresuelve API",
    version="0.1.0",
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
    try:
        async with pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        return {"status": "ready"}
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc))


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------


class LeadIn(BaseModel):
    name: str
    email: EmailStr
    message: str


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
    """Persist a new contact lead."""
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO leads (name, email, message, created_at)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, message, created_at
            """,
            lead.name,
            lead.email,
            lead.message,
            datetime.datetime.now(datetime.timezone.utc),
        )
    return dict(row)


@app.get("/leads", response_model=list[LeadOut])
async def list_leads():
    """Return all leads ordered by id."""
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, name, email, message, created_at FROM leads ORDER BY id"
        )
    return [dict(r) for r in rows]
