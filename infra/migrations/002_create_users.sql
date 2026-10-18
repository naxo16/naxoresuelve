-- Migration 002: Create users table with roles and indices
-- For backoffice administration and client portal.

CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt          VARCHAR(64)  NOT NULL,
    full_name     VARCHAR(150) NOT NULL,
    role          VARCHAR(50)  NOT NULL DEFAULT 'client',
    is_active     BOOLEAN      NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
