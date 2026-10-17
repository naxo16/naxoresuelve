-- Migration 001: Create leads table
-- Applied manually or via an init script mounted in Docker.

CREATE TABLE IF NOT EXISTS leads (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    message    TEXT         NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);
