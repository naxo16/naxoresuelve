-- ============================================================================
-- NAXORESUELVE — PROVISIÓN SEGURA DE BASE DE DATOS Y GOBERNANZA DE ROLES
-- Motor: PostgreSQL 16+ (Compatible con PostgreSQL 18)
-- Objetivo: Configurar base de datos Naxo_85721 con usuario normal Postgre
--           (sin privilegios de superusuario) bajo OWASP Top 10 A01 (Least Privilege).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. CREACIÓN DE USUARIO NORMAL Y BASE DE DATOS
-- ---------------------------------------------------------------------------
-- Ejecutar en psql conectado a PostgreSQL:

-- A. Crear rol normal 'Postgre' sin superusuario (NOSUPERUSER, NOCREATEDB, NOCREATEROLE)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'Postgre') THEN
        CREATE ROLE "Postgre" WITH LOGIN PASSWORD 'Postgre_naxo' NOSUPERUSER NOCREATEDB NOCREATEROLE;
    ELSE
        ALTER ROLE "Postgre" WITH PASSWORD 'Postgre_naxo' NOSUPERUSER NOCREATEDB NOCREATEROLE;
    END IF;
END
$$;

-- B. Crear la base de datos Naxo_85721 asignando a 'Postgre' como propietario
-- (Nota: CREATE DATABASE se ejecuta fuera de bloque DO $$)
-- SELECT 'CREATE DATABASE "Naxo_85721" WITH OWNER = "Postgre" ENCODING = ''UTF8'' CONNECTION LIMIT = 100'
-- WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'Naxo_85721');

-- ---------------------------------------------------------------------------
-- 2. ENDURECIMIENTO DE SEGURIDAD EN EL ESQUEMA PUBLIC (OWASP A05)
-- ---------------------------------------------------------------------------
-- Revocar privilegios inseguros predeterminados otorgados a PUBLIC
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON DATABASE "Naxo_85721" FROM PUBLIC;

-- Otorgar conexión controlada a 'Postgre'
GRANT CONNECT ON DATABASE "Naxo_85721" TO "Postgre";

-- ---------------------------------------------------------------------------
-- 3. PERMISOS DML ESTRICTOS SOBRE LOS 12 ESQUEMAS MODULARES
-- (Ejecutar conectado a Naxo_85721 tras aplicar NAXORESUELVE_SQL_MAESTRO_POSTGRESQL.sql)
-- ---------------------------------------------------------------------------
GRANT USAGE ON SCHEMA core, crm, identity, privacy, catalog, marketing, commerce, inventory, promotions, gamification, integrations, governance TO "Postgre";

-- Otorgar DML (SELECT, INSERT, UPDATE, DELETE) en tablas operativas
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA core, crm, identity, privacy, catalog, marketing, commerce, inventory, promotions, gamification, integrations TO "Postgre";

-- Governance es append-only: solo SELECT e INSERT (nunca UPDATE ni DELETE)
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA governance TO "Postgre";

-- Otorgar permisos sobre secuencias de auto-incremento
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA core, crm, identity, privacy, catalog, marketing, commerce, inventory, promotions, gamification, integrations, governance TO "Postgre";

-- Configurar privilegios automáticos futuros para nuevas tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA core, crm, identity, privacy, catalog, marketing, commerce, inventory, promotions, gamification, integrations
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "Postgre";

ALTER DEFAULT PRIVILEGES IN SCHEMA governance
    GRANT SELECT, INSERT ON TABLES TO "Postgre";

ALTER DEFAULT PRIVILEGES IN SCHEMA core, crm, identity, privacy, catalog, marketing, commerce, inventory, promotions, gamification, integrations, governance
    GRANT USAGE, SELECT ON SEQUENCES TO "Postgre";
