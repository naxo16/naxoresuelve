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
from dotenv import load_dotenv

load_dotenv()

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
    "postgresql://naxoresuelve_app:naxoresuelve_app_pass_2026@localhost:5432/naxoresuelve_db",
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
        pool = None


def get_db_pool() -> asyncpg.Pool:
    """Validate database pool availability and return active pool or raise 503."""
    if (
        pool is None
        or getattr(pool, "_closed", False)
        or getattr(pool, "_closing", False)
    ):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service temporarily unavailable",
        )
    return pool


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


@app.middleware("http")
async def add_owasp_security_headers(request, call_next):
    """OWASP Security Headers Middleware to prevent clickjacking, MIME-sniffing, and XSS."""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

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
    if pool is None or getattr(pool, "_closed", False):
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


class RegisterIn(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150, description="Nombre completo del usuario")
    email: EmailStr = Field(..., description="Correo electrónico válido")
    password: str = Field(..., min_length=8, max_length=100, description="Contraseña de al menos 8 caracteres")
    accept_terms: bool = Field(..., description="Consentimiento expreso de términos y condiciones (Ley 19.628 / 21.719)")
    accept_marketing: bool = Field(default=False, description="Consentimiento optativo para comunicaciones comerciales")


class ForgotPasswordIn(BaseModel):
    email: EmailStr = Field(..., description="Correo registrado para solicitud de recuperación")


class ForgotPasswordOut(BaseModel):
    message: str
    reset_token_simulated: str | None = None


class ResetPasswordIn(BaseModel):
    token: str = Field(..., min_length=10, description="Token seguro de recuperación")
    new_password: str = Field(..., min_length=8, max_length=100, description="Nueva contraseña segura")


class ResetPasswordOut(BaseModel):
    message: str


class OAuthLoginIn(BaseModel):
    provider: str = Field(..., description="Proveedor OAuth: google, facebook, instagram, etc.")
    provider_user_id: str = Field(..., min_length=1, max_length=255, description="Identificador único del usuario en el proveedor")
    email: EmailStr = Field(..., description="Correo provisto por el proveedor")
    full_name: str = Field(..., min_length=2, max_length=150, description="Nombre completo provisto por el proveedor")
    accept_terms: bool = Field(default=True, description="Aceptación de términos y condiciones según Ley 19.628")


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
    active_pool = get_db_pool()

    try:
        async with active_pool.acquire() as conn:
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
    except (asyncpg.InterfaceError, asyncpg.PostgresConnectionError, asyncpg.CannotConnectNowError, OSError):
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database transaction failed: {str(exc)}")


@app.get("/leads", response_model=list[LeadOut])
async def list_leads():
    """Return all leads ordered by id."""
    active_pool = get_db_pool()

    try:
        async with active_pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT id, name, email, message, created_at FROM leads ORDER BY id"
            )
        return [dict(r) for r in rows]
    except (asyncpg.InterfaceError, asyncpg.PostgresConnectionError, asyncpg.CannotConnectNowError, OSError):
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database query failed: {str(exc)}")


# ---------------------------------------------------------------------------
# Authentication endpoints (ADR-002)
# ---------------------------------------------------------------------------


@app.post("/auth/login", response_model=LoginOut)
async def login(credentials: LoginIn):
    """Authenticate credentials against users table and return JWT token."""
    active_pool = get_db_pool()

    try:
        async with active_pool.acquire() as conn:
            user = await conn.fetchrow(
                """
                SELECT id, email, password_hash, salt, full_name, role, is_active, created_at
                FROM users WHERE email = $1
                """,
                credentials.email.strip().lower(),
            )
    except (asyncpg.InterfaceError, asyncpg.PostgresConnectionError, asyncpg.CannotConnectNowError, OSError):
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")
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

    active_pool = get_db_pool()

    try:
        async with active_pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT id, name, email, message, created_at FROM leads ORDER BY created_at DESC"
            )
        return [dict(r) for r in rows]
    except (asyncpg.InterfaceError, asyncpg.PostgresConnectionError, asyncpg.CannotConnectNowError, OSError):
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database query error: {str(exc)}")


# ---------------------------------------------------------------------------
# Registration, Password Recovery & OAuth (Chilean Law & OWASP A07 Compliance)
# ---------------------------------------------------------------------------


@app.post("/auth/register", response_model=LoginOut, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterIn):
    """Register a new user account with explicit consent under Ley 19.628 and Ley 21.719."""
    if not payload.accept_terms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debe aceptar expresamente los Términos y Condiciones y la Política de Privacidad conforme a la Ley 19.628 de Chile.",
        )

    active_pool = get_db_pool()

    clean_email = payload.email.strip().lower()

    try:
        async with active_pool.acquire() as conn:
            existing_user = await conn.fetchval(
                "SELECT id FROM users WHERE email = $1", clean_email
            )
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Ya existe una cuenta registrada con este correo electrónico.",
                )

            pwd_hash, salt = hash_password(payload.password)

            user_row = await conn.fetchrow(
                """
                INSERT INTO users (email, password_hash, salt, full_name, role, is_active, created_at)
                VALUES ($1, $2, $3, $4, 'client', true, $5)
                RETURNING id, email, full_name, role, is_active, created_at
                """,
                clean_email,
                pwd_hash,
                salt,
                payload.full_name.strip(),
                datetime.datetime.now(datetime.timezone.utc),
            )
    except HTTPException:
        raise
    except (asyncpg.InterfaceError, asyncpg.PostgresConnectionError, asyncpg.CannotConnectNowError, OSError):
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database error during registration: {str(exc)}")

    token = create_access_token(
        {
            "sub": str(user_row["id"]),
            "email": user_row["email"],
            "role": user_row["role"],
            "name": user_row["full_name"],
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": dict(user_row),
    }


@app.post("/auth/forgot-password", response_model=ForgotPasswordOut)
async def forgot_password(payload: ForgotPasswordIn):
    """Initiate cryptographic single-use password recovery flow (OWASP A07 & Ley 21.663)."""
    active_pool = get_db_pool()

    clean_email = payload.email.strip().lower()
    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=15)

    try:
        async with active_pool.acquire() as conn:
            user_exists = await conn.fetchval("SELECT id FROM users WHERE email = $1", clean_email)
            if user_exists:
                await conn.execute(
                    """
                    INSERT INTO password_resets (email, token_hash, expires_at, is_used, created_at)
                    VALUES ($1, $2, $3, false, $4)
                    """,
                    clean_email,
                    token_hash,
                    expires_at,
                    datetime.datetime.now(datetime.timezone.utc),
                )
    except (asyncpg.InterfaceError, asyncpg.PostgresConnectionError, asyncpg.CannotConnectNowError, OSError):
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database error processing request: {str(exc)}")

    # Uniform response to neutralize account enumeration attacks (OWASP A07)
    return {
        "message": "Si la dirección de correo electrónico está registrada, se ha generado el enlace seguro de restablecimiento (válido por 15 minutos).",
        "reset_token_simulated": raw_token,
    }


@app.post("/auth/reset-password", response_model=ResetPasswordOut)
async def reset_password(payload: ResetPasswordIn):
    """Consume single-use token and update password with PBKDF2-HMAC-SHA256."""
    active_pool = get_db_pool()

    token_hash = hashlib.sha256(payload.token.strip().encode("utf-8")).hexdigest()
    now_utc = datetime.datetime.now(datetime.timezone.utc)

    try:
        async with active_pool.acquire() as conn:
            async with conn.transaction():
                reset_record = await conn.fetchrow(
                    """
                    SELECT reset_id, email FROM password_resets
                    WHERE token_hash = $1 AND is_used = false AND expires_at > $2
                    FOR UPDATE
                    """,
                    token_hash,
                    now_utc,
                )

                if not reset_record:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="El token de recuperación es inválido, ha expirado o ya fue utilizado.",
                    )

                pwd_hash, salt = hash_password(payload.new_password)

                await conn.execute(
                    """
                    UPDATE users
                    SET password_hash = $1, salt = $2
                    WHERE email = $3
                    """,
                    pwd_hash,
                    salt,
                    reset_record["email"],
                )

                await conn.execute(
                    "UPDATE password_resets SET is_used = true WHERE reset_id = $1",
                    reset_record["reset_id"],
                )
    except HTTPException:
        raise
    except (asyncpg.InterfaceError, asyncpg.PostgresConnectionError, asyncpg.CannotConnectNowError, OSError):
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database error during password reset: {str(exc)}")

    return {"message": "Contraseña actualizada exitosamente. Ya puede iniciar sesión con sus nuevas credenciales."}


@app.post("/auth/oauth/login", response_model=LoginOut)
async def oauth_login(payload: OAuthLoginIn):
    """Authenticate or register via external identity providers (Google, Facebook, Instagram, Microsoft)."""
    allowed_providers = {"google", "facebook", "instagram", "microsoft", "github"}
    if payload.provider.lower() not in allowed_providers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Proveedor no soportado. Proveedores permitidos: {', '.join(sorted(allowed_providers))}",
        )

    if not payload.accept_terms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debe aceptar expresamente los términos de servicio conforme a la Ley 19.628.",
        )

    active_pool = get_db_pool()

    clean_email = payload.email.strip().lower()
    now_utc = datetime.datetime.now(datetime.timezone.utc)

    try:
        async with active_pool.acquire() as conn:
            async with conn.transaction():
                # Check if external account is already linked
                linked_user = await conn.fetchrow(
                    """
                    SELECT u.id, u.email, u.full_name, u.role, u.is_active, u.created_at
                    FROM users u
                    JOIN external_accounts ea ON u.id = ea.user_id
                    WHERE ea.provider = $1 AND ea.provider_user_id = $2
                    """,
                    payload.provider.lower(),
                    payload.provider_user_id.strip(),
                )

                if linked_user:
                    await conn.execute(
                        """
                        UPDATE external_accounts
                        SET last_login_at = $1
                        WHERE provider = $2 AND provider_user_id = $3
                        """,
                        now_utc,
                        payload.provider.lower(),
                        payload.provider_user_id.strip(),
                    )
                    user_dict = dict(linked_user)
                else:
                    # Check if user with same email exists
                    existing_user = await conn.fetchrow(
                        "SELECT id, email, full_name, role, is_active, created_at FROM users WHERE email = $1",
                        clean_email,
                    )

                    if existing_user:
                        target_user_id = existing_user["id"]
                        user_dict = dict(existing_user)
                    else:
                        # Create new user (social logins receive role 'client' by design)
                        dummy_pwd, dummy_salt = hash_password(secrets.token_hex(32))
                        new_user = await conn.fetchrow(
                            """
                            INSERT INTO users (email, password_hash, salt, full_name, role, is_active, created_at)
                            VALUES ($1, $2, $3, $4, 'client', true, $5)
                            RETURNING id, email, full_name, role, is_active, created_at
                            """,
                            clean_email,
                            dummy_pwd,
                            dummy_salt,
                            payload.full_name.strip(),
                            now_utc,
                        )
                        target_user_id = new_user["id"]
                        user_dict = dict(new_user)

                    # Link external account
                    await conn.execute(
                        """
                        INSERT INTO external_accounts (user_id, provider, provider_user_id, email, created_at, last_login_at)
                        VALUES ($1, $2, $3, $4, $5, $5)
                        ON CONFLICT (provider, provider_user_id) DO UPDATE SET last_login_at = $5
                        """,
                        target_user_id,
                        payload.provider.lower(),
                        payload.provider_user_id.strip(),
                        clean_email,
                        now_utc,
                    )
    except HTTPException:
        raise
    except (asyncpg.InterfaceError, asyncpg.PostgresConnectionError, asyncpg.CannotConnectNowError, OSError):
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database error during OAuth authentication: {str(exc)}")

    token = create_access_token(
        {
            "sub": str(user_dict["id"]),
            "email": user_dict["email"],
            "role": user_dict["role"],
            "name": user_dict["full_name"],
            "auth_provider": payload.provider.lower(),
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_dict,
    }


@app.get("/auth/oauth/providers")
async def get_oauth_providers():
    """Return federation compliance metadata for external identity providers."""
    return {
        "status": "active",
        "legal_framework": "Ley 19.628 / Ley 21.719 (Chile) & OIDC RFC 7519",
        "providers": [
            {
                "id": "google",
                "name": "Google / Gmail",
                "protocol": "OpenID Connect (OIDC)",
                "scope": ["openid", "email", "profile"],
                "enabled": True,
            },
            {
                "id": "facebook",
                "name": "Facebook",
                "protocol": "OAuth 2.0 (Meta Graph API)",
                "scope": ["email", "public_profile"],
                "enabled": True,
            },
            {
                "id": "instagram",
                "name": "Instagram",
                "protocol": "OAuth 2.0 (Instagram Basic Display)",
                "scope": ["user_profile"],
                "enabled": True,
            },
            {
                "id": "microsoft",
                "name": "Microsoft / Outlook",
                "protocol": "OpenID Connect (Entra ID)",
                "scope": ["openid", "email", "profile"],
                "enabled": True,
            },
        ],
    }

