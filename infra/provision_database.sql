-- ============================================================================
-- NAXORESUELVE — PROVISIÓN SEGURA DE BASE DE DATOS Y GOBERNANZA DE ROLES
-- Motor: PostgreSQL 16+ (Compatible con PostgreSQL 18)
-- Objetivo: Configurar base de datos segura, roles con mínimo privilegio (OWASP A01)
--           y preparar el entorno para la ejecución del modelo maestro relacional.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. CREACIÓN DE BASE DE DATOS RESILIENTE Y SEGURA (Ejecutar como superusuario)
-- ---------------------------------------------------------------------------
-- Nota: La instrucción CREATE DATABASE debe ejecutarse fuera de un bloque transaccional.
-- En psql: 
--   CREATE DATABASE naxoresuelve_db 
--       WITH OWNER = postgres 
--       ENCODING = 'UTF8' 
--       LC_COLLATE = 'Spanish_Chile.utf8'  -- O 'en_US.UTF-8' / 'C.UTF-8' según el SO
--       LC_CTYPE = 'Spanish_Chile.utf8'
--       TEMPLATE = template0
--       CONNECTION LIMIT = 100;

-- ---------------------------------------------------------------------------
-- 2. GOBERNANZA DE ROLES Y PRINCIPIO DE MENOR PRIVILEGIO (Least Privilege)
-- ---------------------------------------------------------------------------

-- Rol 1: Owner / Migrador (solo usado en pipelines de CI/CD para migraciones DDL)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'naxoresuelve_owner') THEN
        CREATE ROLE naxoresuelve_owner WITH NOLOGIN CREATEDB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'naxoresuelve_migrator') THEN
        CREATE ROLE naxoresuelve_migrator WITH LOGIN PASSWORD 'CAMBIAR_EN_PROD_MIGRATOR_SECRET_2026!';
        GRANT naxoresuelve_owner TO naxoresuelve_migrator;
    END IF;
END
$$;

-- Rol 2: Aplicación Backend (DML estricto: SELECT, INSERT, UPDATE, DELETE)
-- NUNCA tiene permisos DDL (no puede DROP TABLE, ALTER TABLE ni TRUNCATE)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'naxoresuelve_app') THEN
        CREATE ROLE naxoresuelve_app WITH LOGIN PASSWORD 'naxoresuelve_app_pass_2026';
    END IF;
END
$$;

-- Rol 3: Reportes / Solo Lectura (Auditoría e Inteligencia de Negocios)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'naxoresuelve_readonly') THEN
        CREATE ROLE naxoresuelve_readonly WITH LOGIN PASSWORD 'naxoresuelve_ro_pass_2026';
    END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- 3. ENDURECIMIENTO DE SEGURIDAD EN EL ESQUEMA PUBLIC (OWASP A05)
-- ---------------------------------------------------------------------------
-- Revocar privilegios predeterminados inseguros otorgados a PUBLIC
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON DATABASE naxoresuelve_db FROM PUBLIC;

-- Otorgar conexión básica controlada
GRANT CONNECT ON DATABASE naxoresuelve_db TO naxoresuelve_app;
GRANT CONNECT ON DATABASE naxoresuelve_db TO naxoresuelve_readonly;
GRANT ALL PRIVILEGES ON DATABASE naxoresuelve_db TO naxoresuelve_migrator;

-- ---------------------------------------------------------------------------
-- 4. CONCESIÓN SEGURA DE PERMISOS SOBRE ESQUEMAS MODULARES
-- (Ejecutar conectado a naxoresuelve_db tras aplicar NAXORESUELVE_SQL_MAESTRO_POSTGRESQL.sql)
-- ---------------------------------------------------------------------------
/*
-- Asignar USAGE en los 12 esquemas modulares al rol de la aplicación:
GRANT USAGE ON SCHEMA core, crm, identity, privacy, catalog, marketing, commerce, inventory, promotions, gamification, integrations, governance TO naxoresuelve_app;
GRANT USAGE ON SCHEMA core, crm, identity, privacy, catalog, marketing, commerce, inventory, promotions, gamification, integrations, governance TO naxoresuelve_readonly;

-- DML selectivo para la aplicación:
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA core, crm, identity, privacy, catalog, marketing, commerce, inventory, promotions, gamification, integrations TO naxoresuelve_app;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA governance TO naxoresuelve_app; -- Governance es append-only, sin UPDATE ni DELETE
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA core, crm, identity, privacy, catalog, marketing, commerce, inventory, promotions, gamification, integrations, governance TO naxoresuelve_app;

-- Solo lectura para rol analítico:
GRANT SELECT ON ALL TABLES IN SCHEMA core, crm, catalog, marketing, commerce, inventory, promotions, gamification TO naxoresuelve_readonly;
REVOKE ALL ON SCHEMA privacy, governance FROM naxoresuelve_readonly; -- Blindaje de datos sensibles y auditoría

-- Configurar privilegios automáticos futuros para evitar filtraciones por defecto
ALTER DEFAULT PRIVILEGES IN SCHEMA core, crm, identity, privacy, catalog, marketing, commerce, inventory, promotions, gamification, integrations
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO naxoresuelve_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA governance
    GRANT SELECT, INSERT ON TABLES TO naxoresuelve_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA core, crm, identity, privacy, catalog, marketing, commerce, inventory, promotions, gamification, integrations, governance
    GRANT USAGE, SELECT ON SEQUENCES TO naxoresuelve_app;
*/
