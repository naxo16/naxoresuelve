"""
naxoresuelve – FastAPI backend (monolito modular).

Endpoints:
  - GET  /health/live   → liveness check
  - GET  /health/ready  → readiness check (verifica conexión a DB)
  - POST /leads         → crear un lead de contacto con validación rigurosa
  - GET  /leads         → listar leads públicos
  - POST /auth/login    → autenticación de usuarios (JWT Bearer)
  - GET  /auth/me       → perfil de usuario autenticado
  - GET  /admin/leads   → listado administrativo de leads protegidos
"""

from contextlib import asynccontextmanager
import datetime
import hashlib
import hmac
import os
import secrets

from fastapi import FastAPI, HTTPException, Header, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
import asyncpg
import jwt

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://naxoresuelve:naxoresuelve@db:5432/naxoresuelve",
)
JWT_SECRET = os.getenv("JWT_SECRET", "naxoresuelve-crypto-secret-key-2026-chile")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

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
    version="0.3.0",
    description="Backend modular con autenticación JWT, validación rigurosa y pruebas rudas de integridad.",
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
# Security & Hashing Helpers
# ---------------------------------------------------------------------------


def hash_password(password: str, salt: str | None = None) -> tuple[str, str]:
    """Hash password using PBKDF2-HMAC-SHA256 with 100,000 rounds and random salt."""
    if salt is None:
        salt = secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000)
    return dk.hex(), salt


def verify_password(password: str, salt: str, password_hash: str) -> bool:
    """Verify password against stored salt and hash using timing-safe comparison."""
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000)
    return hmac.compare_digest(dk.hex(), password_hash)


def create_access_token(data: dict, expires_delta: datetime.timedelta | None = None) -> str:
    """Encode JWT access token with expiration timestamp."""
    to_encode = data.copy()
    expire = datetime.datetime.now(datetime.timezone.utc) + (
        expires_delta or datetime.timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(authorization: str | None = Header(None)) -> dict:
    """Extract and validate Bearer token from Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Header Authorization con token Bearer requerido",
        )
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El token de sesión ha expirado",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de sesión inválido",
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
# Schemas
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


class LoginIn(BaseModel):
    email: EmailStr = Field(..., description="Correo de usuario registrado")
    password: str = Field(..., min_length=6, max_length=100, description="Contraseña de acceso")


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime.datetime


class LoginOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


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


# ---------------------------------------------------------------------------
# Authentication endpoints (ADR-002)
# ---------------------------------------------------------------------------


@app.post("/auth/login", response_model=LoginOut)
async def login(credentials: LoginIn):
    """Authenticate credentials against users table and return JWT token."""
    if pool is None:
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")

    try:
        async with pool.acquire() as conn:
            user = await conn.fetchrow(
                """
                SELECT id, email, password_hash, salt, full_name, role, is_active, created_at
                FROM users WHERE email = $1
                """,
                credentials.email.strip().lower(),
            )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database query error: {str(exc)}")

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas (correo o contraseña no válidos)",
        )

    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Esta cuenta ha sido desactivada temporalmente",
        )

    if not verify_password(credentials.password, user["salt"], user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas (correo o contraseña no válidos)",
        )

    token = create_access_token(
        {
            "sub": str(user["id"]),
            "email": user["email"],
            "role": user["role"],
            "name": user["full_name"],
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "is_active": user["is_active"],
            "created_at": user["created_at"],
        },
    }


@app.get("/auth/me")
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """Return authenticated token claims."""
    return current_user


@app.get("/admin/leads")
async def admin_list_leads(current_user: dict = Depends(get_current_user)):
    """Return all leads for administrative review (requires admin role)."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso restringido: requiere privilegios de Administrador",
        )

    if pool is None:
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")

    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, name, email, message, created_at FROM leads ORDER BY created_at DESC"
        )
    return [dict(r) for r in rows]
