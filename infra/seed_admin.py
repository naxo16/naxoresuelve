import asyncio
import os
import asyncpg
from dotenv import load_dotenv

load_dotenv("apps/api/.env")

from apps.api.main import hash_password

async def main():
    db_url = os.getenv("DATABASE_URL")
    print(f"Connecting to: {db_url}")
    conn = await asyncpg.connect(db_url)
    
    # 1. Admin institucional
    pwd_hash, salt = hash_password("NaxoAdmin2026!")
    await conn.execute(
        """
        INSERT INTO users (email, password_hash, salt, full_name, role, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO UPDATE SET password_hash = $2, salt = $3, role = $5, full_name = $4
        """,
        "admin@naxoresuelve.cl",
        pwd_hash,
        salt,
        "Pablo Valdés",
        "admin",
        True,
    )
    
    # 2. Admin personal de Pablo Valdés
    pwd_hash2, salt2 = hash_password("PabloAdminSecure2026!")
    await conn.execute(
        """
        INSERT INTO users (email, password_hash, salt, full_name, role, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO UPDATE SET password_hash = $2, salt = $3, role = $5, full_name = $4
        """,
        "pablovaldescontacto@gmail.com",
        pwd_hash2,
        salt2,
        "Pablo Valdés",
        "admin",
        True,
    )
    
    users = await conn.fetch("SELECT id, email, role, full_name FROM users ORDER BY id")
    for u in users:
        print(f"User: {dict(u)}")
    await conn.close()

if __name__ == "__main__":
    asyncio.run(main())
