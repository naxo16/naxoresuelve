-- ============================================================================
-- NAXORESUELVE — SQL MAESTRO / MODELO RELACIONAL CANÓNICO
-- Motor: PostgreSQL 16+ (SQL compatible con PostgreSQL moderno)
-- Versión del modelo: 1.0.0 | Fecha: 2026-10-17
-- Idioma funcional inicial: español (Chile)
--
-- OBJETIVO
--   Esquema base normalizado para contactos/leads, privacidad y consentimiento,
--   marketing por email/WhatsApp, cuentas/perfiles y futura tienda, carrito,
--   pedidos, pagos, promociones, juegos, webhooks y auditoría.
--
-- DECISIÓN DE DATOS
--   PostgreSQL relacional como fuente de verdad transaccional. El núcleo de
--   contactos, consentimiento, catálogo, inventario, carrito, pedidos, pagos y
--   canjes exige claves foráneas, restricciones, transacciones e integridad.
--   JSONB queda limitado a payloads opacos de integraciones/auditoría y estado
--   específico de partidas; no se usa para reemplazar tablas normalizadas.
--   No añadir MongoDB ni microservicios hasta demostrar una necesidad concreta.
--
-- ADVERTENCIAS DE EJECUCIÓN
--   1. Este archivo es una BASELINE de referencia para un entorno nuevo. No es
--      una migración idempotente: no volver a ejecutarlo sobre una BD poblada.
--   2. En el proyecto real, dividirlo en migraciones versionadas de Alembic y
--      probar upgrade/downgrade en CI; no editar migraciones ya desplegadas.
--   3. Ejecutar primero en desarrollo/staging con backup. Revisar roles, grants,
--      TLS, secretos, backups y políticas de retención antes de producción.
--   4. No se almacenan contraseñas, tokens de proveedor, credenciales de pago,
--      CVV ni números completos de tarjetas.
--   5. El SQL facilita controles; por sí solo NO garantiza cumplimiento legal.
--      La aplicación debe validar consentimiento vigente en el momento de envío,
--      verificar webhooks, autenticar/autorizar usuarios y procesar bajas.
--
-- PRIVACIDAD Y CUMPLIMIENTO
--   Diseñado para minimización de datos y para facilitar derechos de los titulares.
--   Revisar Ley 19.628 y Ley 21.719 de Chile (vigencia prevista: 2026-12-01),
--   Ley 19.496 art. 28 B, y normativa del país de cada destinatario. El RGPD puede
--   aplicar a ciertos tratamientos en la UE. Revisar fuentes oficiales actuales
--   y obtener asesoría legal antes de operar campañas comerciales.
--   Referencia legal Chile: https://www.bcn.cl/leychile/navegar?idNorma=1209272
--   Referencia PostgreSQL RLS: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 0. LÍMITES DE CONTEXTO (ADOO / diseño por dominios)
-- ---------------------------------------------------------------------------
-- core         catálogos técnicos compartidos (canales, monedas, orígenes)
-- crm          personas, medios de contacto y oportunidades comerciales
-- identity     usuarios y perfiles; las credenciales pueden delegarse a un IdP
-- privacy      finalidades, actividades, prueba de consentimiento, solicitudes
-- catalog      productos/servicios, categorías, variantes y precios
-- marketing    campañas, plantillas, destinatarios y entregas
-- commerce     carrito, pedidos, direcciones-snapshot, pagos y reembolsos
-- inventory    ubicaciones, existencias y movimientos
-- promotions   promociones, códigos y canjes
-- gamification juegos, sesiones, resultados y recompensas
-- integrations outbox transaccional y webhooks entrantes/salientes
-- governance   auditoría técnica de eventos, evitando registrar datos de más
--
-- Los esquemas representan límites lógicos dentro de un monolito modular. No
-- implican que cada dominio deba ser un microservicio independiente.

CREATE SCHEMA core;
CREATE SCHEMA crm;
CREATE SCHEMA identity;
CREATE SCHEMA privacy;
CREATE SCHEMA catalog;
CREATE SCHEMA marketing;
CREATE SCHEMA commerce;
CREATE SCHEMA inventory;
CREATE SCHEMA promotions;
CREATE SCHEMA gamification;
CREATE SCHEMA integrations;
CREATE SCHEMA governance;

-- ---------------------------------------------------------------------------
-- 1. CORE: catálogos comunes
-- ---------------------------------------------------------------------------
CREATE TABLE core.currencies (
    currency_code CHAR(3) PRIMARY KEY,
    currency_name VARCHAR(80) NOT NULL,
    minor_unit SMALLINT NOT NULL DEFAULT 2 CHECK (minor_unit BETWEEN 0 AND 2),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT currencies_code_uppercase CHECK (currency_code = UPPER(currency_code))
);
COMMENT ON TABLE core.currencies IS 'Montos financieros del baseline usan NUMERIC(...,2); monedas con más de 2 decimales requieren revisar/ampliar el modelo.';

CREATE TABLE core.channels (
    channel_id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    display_name VARCHAR(80) NOT NULL,
    is_addressable BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT channels_code_lowercase CHECK (code = LOWER(code))
);

CREATE TABLE core.lead_sources (
    lead_source_id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(40) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ---------------------------------------------------------------------------
-- 2. CATALOG: catálogo común de servicios/productos para la web y tienda
-- ---------------------------------------------------------------------------
CREATE TABLE catalog.categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_category_id UUID NULL REFERENCES catalog.categories(category_id) ON DELETE SET NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    description TEXT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT categories_not_self_parent CHECK (parent_category_id IS NULL OR parent_category_id <> category_id)
);
COMMENT ON TABLE catalog.categories IS 'Categorías jerárquicas; la aplicación debe impedir ciclos indirectos.';

CREATE TABLE catalog.products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_type VARCHAR(20) NOT NULL CHECK (product_type IN ('service', 'physical', 'digital')),
    slug VARCHAR(180) NOT NULL UNIQUE,
    name VARCHAR(180) NOT NULL,
    short_description VARCHAR(500) NULL,
    description TEXT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
    seo_title VARCHAR(180) NULL,
    seo_description VARCHAR(320) NULL,
    published_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT products_publish_state CHECK (status <> 'active' OR published_at IS NOT NULL)
);
COMMENT ON TABLE catalog.products IS 'Servicios y artículos comparten catálogo; las unidades vendibles son variantes/SKU.';

CREATE TABLE catalog.product_categories (
    product_id UUID NOT NULL REFERENCES catalog.products(product_id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES catalog.categories(category_id) ON DELETE RESTRICT,
    PRIMARY KEY (product_id, category_id)
);

CREATE TABLE catalog.product_media (
    product_media_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES catalog.products(product_id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    alt_text VARCHAR(300) NULL,
    media_type VARCHAR(20) NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video', 'document', 'model_3d')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE catalog.product_variants (
    variant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES catalog.products(product_id) ON DELETE RESTRICT,
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(180) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    requires_shipping BOOLEAN NOT NULL DEFAULT FALSE,
    weight_grams INTEGER NULL CHECK (weight_grams IS NULL OR weight_grams >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT product_variants_id_product_unique UNIQUE (variant_id, product_id)
);
COMMENT ON COLUMN catalog.product_variants.sku IS 'Código de unidad vendible; no reutilizar un SKU histórico.';

CREATE TABLE catalog.product_options (
    option_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES catalog.products(product_id) ON DELETE CASCADE,
    code VARCHAR(60) NOT NULL,
    name VARCHAR(100) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT product_options_product_code_unique UNIQUE (product_id, code),
    CONSTRAINT product_options_id_product_unique UNIQUE (option_id, product_id)
);

CREATE TABLE catalog.product_option_values (
    option_value_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    option_id UUID NOT NULL REFERENCES catalog.product_options(option_id) ON DELETE CASCADE,
    value VARCHAR(120) NOT NULL,
    display_label VARCHAR(120) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT product_option_values_option_value_unique UNIQUE (option_id, value),
    CONSTRAINT product_option_values_id_option_unique UNIQUE (option_value_id, option_id)
);

CREATE TABLE catalog.variant_option_values (
    variant_id UUID NOT NULL,
    product_id UUID NOT NULL,
    option_id UUID NOT NULL,
    option_value_id UUID NOT NULL,
    PRIMARY KEY (variant_id, option_id),
    CONSTRAINT variant_option_variant_fk FOREIGN KEY (variant_id, product_id)
        REFERENCES catalog.product_variants(variant_id, product_id) ON DELETE CASCADE,
    CONSTRAINT variant_option_option_fk FOREIGN KEY (option_id, product_id)
        REFERENCES catalog.product_options(option_id, product_id) ON DELETE CASCADE,
    CONSTRAINT variant_option_value_fk FOREIGN KEY (option_value_id, option_id)
        REFERENCES catalog.product_option_values(option_value_id, option_id) ON DELETE RESTRICT
);

CREATE TABLE catalog.variant_prices (
    variant_price_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES catalog.product_variants(variant_id) ON DELETE RESTRICT,
    currency_code CHAR(3) NOT NULL REFERENCES core.currencies(currency_code) ON DELETE RESTRICT,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_to TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT variant_prices_valid_period CHECK (valid_to IS NULL OR valid_to > valid_from)
);
CREATE UNIQUE INDEX ux_variant_prices_one_open_price
    ON catalog.variant_prices (variant_id, currency_code) WHERE valid_to IS NULL;
CREATE INDEX ix_variant_prices_lookup ON catalog.variant_prices (variant_id, currency_code, valid_from DESC);
COMMENT ON TABLE catalog.variant_prices IS 'Historial de precios; cerrar el precio previo al activar uno nuevo. Evitar solapamientos en la capa de dominio/servicio.';

-- ---------------------------------------------------------------------------
-- 3. CRM: persona, formas de contacto y oportunidades comerciales
-- ---------------------------------------------------------------------------
CREATE TABLE crm.people (
    person_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    given_name VARCHAR(100) NULL,
    family_name VARCHAR(120) NULL,
    display_name VARCHAR(180) NULL,
    preferred_locale VARCHAR(10) NOT NULL DEFAULT 'es-CL',
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'restricted', 'anonymized')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT people_has_a_name CHECK (
        NULLIF(BTRIM(COALESCE(given_name, '') || ' ' || COALESCE(family_name, '')), '') IS NOT NULL
        OR NULLIF(BTRIM(COALESCE(display_name, '')), '') IS NOT NULL
    )
);
COMMENT ON TABLE crm.people IS 'Identidad CRM mínima; no exige RUT, fecha de nacimiento ni dirección para captar un contacto.';

CREATE TABLE crm.contact_points (
    contact_point_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NOT NULL REFERENCES crm.people(person_id) ON DELETE RESTRICT,
    channel_id SMALLINT NOT NULL REFERENCES core.channels(channel_id) ON DELETE RESTRICT,
    value VARCHAR(320) NOT NULL,
    normalized_value VARCHAR(320) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMPTZ NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    -- HMAC-SHA-256 sobre el valor normalizado, calculado por la aplicación.
    -- La clave NO va en PostgreSQL ni en el repositorio. Permite comparar
    -- exclusiones sin conservar el endpoint en claro en la lista de supresión.
    endpoint_hmac BYTEA NOT NULL CHECK (OCTET_LENGTH(endpoint_hmac) = 32),
    hmac_key_version SMALLINT NOT NULL CHECK (hmac_key_version > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,
    CONSTRAINT contact_points_id_channel_unique UNIQUE (contact_point_id, channel_id),
    CONSTRAINT contact_points_verification_timestamp CHECK (
        (is_verified = FALSE AND verified_at IS NULL) OR (is_verified = TRUE AND verified_at IS NOT NULL)
    ),
    CONSTRAINT contact_points_normalized_not_blank CHECK (BTRIM(normalized_value) <> '')
);
CREATE UNIQUE INDEX ux_contact_points_live_value
    ON crm.contact_points (channel_id, normalized_value) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX ux_contact_points_live_hmac
    ON crm.contact_points (channel_id, hmac_key_version, endpoint_hmac) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX ux_contact_points_primary_per_channel
    ON crm.contact_points (person_id, channel_id) WHERE is_primary = TRUE AND deleted_at IS NULL;
CREATE INDEX ix_contact_points_person ON crm.contact_points (person_id) WHERE deleted_at IS NULL;
CREATE INDEX ix_contact_points_channel_verified ON crm.contact_points (channel_id, is_verified) WHERE deleted_at IS NULL;
COMMENT ON COLUMN crm.contact_points.normalized_value IS 'Email normalizado o teléfono E.164; la validación/normalización debe realizarse en backend.';
COMMENT ON COLUMN crm.contact_points.endpoint_hmac IS 'Pseudónimo determinista; sigue pudiendo constituir dato personal. Definir acceso, rotación de clave y retención.';

CREATE TABLE crm.leads (
    lead_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NOT NULL REFERENCES crm.people(person_id) ON DELETE RESTRICT,
    lead_source_id SMALLINT NOT NULL REFERENCES core.lead_sources(lead_source_id) ON DELETE RESTRICT,
    stage VARCHAR(24) NOT NULL DEFAULT 'new' CHECK (stage IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'disqualified')),
    summary VARCHAR(300) NULL,
    next_action_at TIMESTAMPTZ NULL,
    converted_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT leads_conversion_timestamp CHECK ((stage <> 'won') OR converted_at IS NOT NULL)
);
CREATE INDEX ix_leads_stage_created ON crm.leads (stage, created_at DESC);
CREATE INDEX ix_leads_person ON crm.leads (person_id);

CREATE TABLE crm.lead_interests (
    lead_id UUID NOT NULL REFERENCES crm.leads(lead_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES catalog.products(product_id) ON DELETE RESTRICT,
    interest_level SMALLINT NULL CHECK (interest_level IS NULL OR interest_level BETWEEN 1 AND 5),
    note VARCHAR(500) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (lead_id, product_id)
);

-- ---------------------------------------------------------------------------
-- 4. IDENTITY: cuentas y perfiles (sin credenciales locales por defecto)
-- ---------------------------------------------------------------------------
CREATE TABLE identity.users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NULL UNIQUE REFERENCES crm.people(person_id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'locked', 'disabled', 'deletion_pending')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ NULL
);
COMMENT ON TABLE identity.users IS 'Identidad interna. La autenticación puede delegarse a un proveedor OIDC; no almacenar contraseñas aquí por defecto.';

CREATE TABLE identity.external_identities (
    external_identity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES identity.users(user_id) ON DELETE CASCADE,
    provider_code VARCHAR(60) NOT NULL,
    provider_subject VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ NULL,
    CONSTRAINT external_identity_provider_subject_unique UNIQUE (provider_code, provider_subject)
);
CREATE INDEX ix_external_identities_user ON identity.external_identities (user_id);

CREATE TABLE identity.user_profiles (
    user_id UUID PRIMARY KEY REFERENCES identity.users(user_id) ON DELETE CASCADE,
    public_display_name VARCHAR(100) NULL,
    biography VARCHAR(500) NULL,
    avatar_url TEXT NULL,
    locale VARCHAR(10) NOT NULL DEFAULT 'es-CL',
    profile_visibility VARCHAR(20) NOT NULL DEFAULT 'private' CHECK (profile_visibility IN ('private', 'public')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 5. PRIVACY: finalidades, registro de tratamientos y consentimiento probado
-- ---------------------------------------------------------------------------
CREATE TABLE privacy.processing_purposes (
    purpose_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(60) NOT NULL UNIQUE,
    name VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    requires_consent BOOLEAN NOT NULL DEFAULT FALSE,
    is_marketing BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT marketing_purposes_require_consent CHECK (is_marketing = FALSE OR requires_consent = TRUE)
);

CREATE TABLE privacy.notice_versions (
    notice_version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notice_code VARCHAR(60) NOT NULL,
    version_label VARCHAR(40) NOT NULL,
    locale VARCHAR(10) NOT NULL DEFAULT 'es-CL',
    content_text TEXT NOT NULL,
    content_sha256 BYTEA NOT NULL CHECK (OCTET_LENGTH(content_sha256) = 32),
    published_at TIMESTAMPTZ NOT NULL,
    retired_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT notice_version_unique UNIQUE (notice_code, version_label, locale),
    CONSTRAINT notice_version_dates CHECK (retired_at IS NULL OR retired_at > published_at)
);
COMMENT ON TABLE privacy.notice_versions IS 'Conservar la versión exacta de texto/política que se mostró al recoger la autorización.';

CREATE TABLE privacy.processing_activities (
    processing_activity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(80) NOT NULL UNIQUE,
    purpose_id UUID NOT NULL REFERENCES privacy.processing_purposes(purpose_id) ON DELETE RESTRICT,
    lawful_basis_code VARCHAR(40) NOT NULL CHECK (lawful_basis_code IN (
        'consent', 'contract', 'legal_obligation', 'legitimate_interest', 'vital_interests', 'public_task'
    )),
    data_subject_categories TEXT NOT NULL,
    personal_data_categories TEXT NOT NULL,
    recipient_categories TEXT NULL,
    international_transfer BOOLEAN NOT NULL DEFAULT FALSE,
    retention_period_days INTEGER NULL CHECK (retention_period_days IS NULL OR retention_period_days > 0),
    retention_trigger VARCHAR(160) NULL,
    owner_role VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    reviewed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE privacy.processing_activities IS 'Registro de actividades de tratamiento; responsable debe definir base jurídica y retención por finalidad.';

CREATE TABLE privacy.consent_events (
    consent_event_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    contact_point_id UUID NULL REFERENCES crm.contact_points(contact_point_id) ON DELETE SET NULL,
    channel_id SMALLINT NOT NULL REFERENCES core.channels(channel_id) ON DELETE RESTRICT,
    purpose_id UUID NOT NULL REFERENCES privacy.processing_purposes(purpose_id) ON DELETE RESTRICT,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('granted', 'withdrawn')),
    notice_version_id UUID NOT NULL REFERENCES privacy.notice_versions(notice_version_id) ON DELETE RESTRICT,
    capture_method VARCHAR(40) NOT NULL CHECK (capture_method IN (
        'web_checkbox', 'double_opt_in', 'whatsapp_opt_in', 'preference_center',
        'email_reply', 'admin_recorded_with_proof', 'import_with_proof'
    )),
    capture_source VARCHAR(120) NOT NULL,
    -- HMAC-SHA-256 del endpoint normalizado, calculado por backend. Se conserva
    -- para probar/excluir el endpoint tras eliminar el dato identificador.
    endpoint_hmac BYTEA NOT NULL CHECK (OCTET_LENGTH(endpoint_hmac) = 32),
    hmac_key_version SMALLINT NOT NULL CHECK (hmac_key_version > 0),
    evidence_reference VARCHAR(200) NULL,
    request_id UUID NULL,
    network_fingerprint_hmac BYTEA NULL CHECK (network_fingerprint_hmac IS NULL OR OCTET_LENGTH(network_fingerprint_hmac) = 32),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT consent_event_id_contact_channel_unique UNIQUE (consent_event_id, contact_point_id, channel_id),
    CONSTRAINT consent_event_evidence_for_grant CHECK (event_type <> 'granted' OR evidence_reference IS NOT NULL OR capture_method IN ('web_checkbox', 'whatsapp_opt_in', 'double_opt_in', 'preference_center'))
);
CREATE INDEX ix_consent_events_current_by_point
    ON privacy.consent_events (contact_point_id, purpose_id, recorded_at DESC, consent_event_id DESC);
CREATE INDEX ix_consent_events_by_endpoint
    ON privacy.consent_events (channel_id, hmac_key_version, endpoint_hmac, purpose_id, recorded_at DESC);
COMMENT ON TABLE privacy.consent_events IS 'Registro cronológico. Aplicación debe tratarlo como append-only: no modificar ni borrar eventos ordinarios.';
COMMENT ON COLUMN privacy.consent_events.network_fingerprint_hmac IS 'Opcional; no guardar IP/user-agent en claro sin necesidad y retención definida.';

CREATE TABLE privacy.suppression_entries (
    suppression_entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id SMALLINT NOT NULL REFERENCES core.channels(channel_id) ON DELETE RESTRICT,
    hmac_key_version SMALLINT NOT NULL CHECK (hmac_key_version > 0),
    endpoint_hmac BYTEA NOT NULL CHECK (OCTET_LENGTH(endpoint_hmac) = 32),
    reason_code VARCHAR(40) NOT NULL CHECK (reason_code IN (
        'marketing_opt_out', 'complaint', 'hard_bounce', 'invalid_endpoint', 'legal_restriction', 'data_erasure'
    )),
    source_code VARCHAR(80) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT suppression_dates CHECK (expires_at IS NULL OR expires_at > created_at),
    CONSTRAINT suppression_unique_digest UNIQUE (channel_id, hmac_key_version, endpoint_hmac)
);
CREATE INDEX ix_suppression_active ON privacy.suppression_entries (channel_id, is_active, expires_at);
COMMENT ON TABLE privacy.suppression_entries IS 'Lista mínima de exclusión para evitar reimportar/contactar a quien se opuso. Guardar HMAC, nunca clave ni endpoint en claro.';

CREATE TABLE privacy.data_subject_requests (
    data_subject_request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NULL REFERENCES crm.people(person_id) ON DELETE SET NULL,
    request_type VARCHAR(30) NOT NULL CHECK (request_type IN (
        'access', 'rectification', 'deletion', 'objection', 'portability', 'restriction', 'consent_withdrawal'
    )),
    status VARCHAR(24) NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'identity_check', 'in_progress', 'fulfilled', 'partially_fulfilled', 'rejected', 'closed')),
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    identity_verified_at TIMESTAMPTZ NULL,
    due_at TIMESTAMPTZ NULL,
    completed_at TIMESTAMPTZ NULL,
    outcome_code VARCHAR(60) NULL,
    responsible_role VARCHAR(100) NOT NULL DEFAULT 'privacy_owner',
    case_reference VARCHAR(120) NULL UNIQUE,
    CONSTRAINT data_request_completed_timestamp CHECK (
        status NOT IN ('fulfilled', 'partially_fulfilled', 'rejected', 'closed') OR completed_at IS NOT NULL
    )
);
CREATE INDEX ix_data_subject_requests_queue ON privacy.data_subject_requests (status, received_at);

-- ---------------------------------------------------------------------------
-- 6. MARKETING: campañas, plantillas, destinatarios y trazabilidad de envíos
-- ---------------------------------------------------------------------------
CREATE TABLE marketing.message_templates (
    template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_code VARCHAR(80) NOT NULL,
    version_number INTEGER NOT NULL CHECK (version_number > 0),
    channel_id SMALLINT NOT NULL REFERENCES core.channels(channel_id) ON DELETE RESTRICT,
    purpose_id UUID NOT NULL REFERENCES privacy.processing_purposes(purpose_id) ON DELETE RESTRICT,
    locale VARCHAR(10) NOT NULL DEFAULT 'es-CL',
    subject_template VARCHAR(300) NULL,
    body_text TEXT NOT NULL,
    body_html TEXT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'retired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ NULL,
    CONSTRAINT message_template_version_unique UNIQUE (template_code, version_number, channel_id, locale),
    CONSTRAINT message_template_id_channel_purpose_unique UNIQUE (template_id, channel_id, purpose_id)
);
-- Si body_html se completa, el backend debe validar que el canal sea email;
-- esta regla depende de un catálogo externo a la fila y se valida en el dominio.

CREATE TABLE marketing.campaigns (
    campaign_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(180) NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'running', 'paused', 'completed', 'cancelled')),
    scheduled_at TIMESTAMPTZ NULL,
    started_at TIMESTAMPTZ NULL,
    completed_at TIMESTAMPTZ NULL,
    created_by_user_id UUID NULL REFERENCES identity.users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT campaign_lifecycle_timestamps CHECK (
        (started_at IS NULL OR scheduled_at IS NULL OR started_at >= scheduled_at)
        AND (completed_at IS NULL OR started_at IS NOT NULL)
    )
);

CREATE TABLE marketing.campaign_channels (
    campaign_id UUID NOT NULL REFERENCES marketing.campaigns(campaign_id) ON DELETE CASCADE,
    channel_id SMALLINT NOT NULL REFERENCES core.channels(channel_id) ON DELETE RESTRICT,
    purpose_id UUID NOT NULL REFERENCES privacy.processing_purposes(purpose_id) ON DELETE RESTRICT,
    template_id UUID NULL,
    PRIMARY KEY (campaign_id, channel_id),
    CONSTRAINT campaign_channel_template_fk FOREIGN KEY (template_id, channel_id, purpose_id)
        REFERENCES marketing.message_templates(template_id, channel_id, purpose_id) ON DELETE RESTRICT
);
COMMENT ON TABLE marketing.campaign_channels IS 'El permiso/finalidad y la plantilla se definen por canal; email y WhatsApp requieren autorizaciones separadas.';

CREATE TABLE marketing.campaign_recipients (
    campaign_recipient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL,
    contact_point_id UUID NOT NULL,
    channel_id SMALLINT NOT NULL,
    consent_event_id BIGINT NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'queued' CHECK (status IN (
        'queued', 'sending', 'submitted', 'delivered', 'failed', 'bounced',
        'suppressed', 'blocked_consent', 'cancelled', 'complained'
    )),
    queued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ NULL,
    completed_at TIMESTAMPTZ NULL,
    CONSTRAINT campaign_recipient_unique UNIQUE (campaign_id, contact_point_id),
    CONSTRAINT campaign_recipient_channel_fk FOREIGN KEY (campaign_id, channel_id)
        REFERENCES marketing.campaign_channels(campaign_id, channel_id) ON DELETE CASCADE,
    CONSTRAINT campaign_recipient_point_fk FOREIGN KEY (contact_point_id, channel_id)
        REFERENCES crm.contact_points(contact_point_id, channel_id) ON DELETE RESTRICT,
    CONSTRAINT campaign_recipient_consent_fk FOREIGN KEY (consent_event_id, contact_point_id, channel_id)
        REFERENCES privacy.consent_events(consent_event_id, contact_point_id, channel_id) ON DELETE RESTRICT
);
CREATE INDEX ix_campaign_recipients_dispatch ON marketing.campaign_recipients (status, queued_at);
CREATE INDEX ix_campaign_recipients_campaign ON marketing.campaign_recipients (campaign_id, status);
COMMENT ON TABLE marketing.campaign_recipients IS 'Conservar la evidencia usada para encolar. OBLIGATORIO revalidar permiso actual y supresión justo antes de llamar al proveedor.';

CREATE TABLE marketing.message_deliveries (
    message_delivery_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_recipient_id UUID NOT NULL UNIQUE REFERENCES marketing.campaign_recipients(campaign_recipient_id) ON DELETE RESTRICT,
    provider_code VARCHAR(60) NOT NULL,
    provider_message_id VARCHAR(255) NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'accepted', 'delivered', 'temporary_failure', 'permanent_failure', 'bounced', 'complained', 'unknown'
    )),
    accepted_at TIMESTAMPTZ NULL,
    delivered_at TIMESTAMPTZ NULL,
    last_status_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ux_message_delivery_provider_id
    ON marketing.message_deliveries (provider_code, provider_message_id) WHERE provider_message_id IS NOT NULL;

CREATE TABLE marketing.message_delivery_attempts (
    delivery_attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_delivery_id UUID NOT NULL REFERENCES marketing.message_deliveries(message_delivery_id) ON DELETE CASCADE,
    attempt_number SMALLINT NOT NULL CHECK (attempt_number > 0),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ NULL,
    outcome_code VARCHAR(80) NULL,
    provider_http_status SMALLINT NULL CHECK (provider_http_status IS NULL OR provider_http_status BETWEEN 100 AND 599),
    duration_ms INTEGER NULL CHECK (duration_ms IS NULL OR duration_ms >= 0),
    CONSTRAINT delivery_attempt_number_unique UNIQUE (message_delivery_id, attempt_number)
);

-- ---------------------------------------------------------------------------
-- 7. COMMERCE: carrito, pedido, snapshot de compra, pagos y reembolsos
-- ---------------------------------------------------------------------------
CREATE TABLE commerce.carts (
    cart_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL REFERENCES identity.users(user_id) ON DELETE CASCADE,
    -- HMAC del token de invitado; nunca guardar el token de sesión en claro.
    guest_token_hmac BYTEA NULL CHECK (guest_token_hmac IS NULL OR OCTET_LENGTH(guest_token_hmac) = 32),
    currency_code CHAR(3) NOT NULL REFERENCES core.currencies(currency_code) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'converted', 'abandoned', 'expired')),
    expires_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT cart_exactly_one_owner CHECK (
        (user_id IS NOT NULL AND guest_token_hmac IS NULL) OR
        (user_id IS NULL AND guest_token_hmac IS NOT NULL)
    )
);
CREATE UNIQUE INDEX ux_cart_one_open_user_currency ON commerce.carts (user_id, currency_code)
    WHERE user_id IS NOT NULL AND status = 'open';
CREATE UNIQUE INDEX ux_cart_one_open_guest ON commerce.carts (guest_token_hmac)
    WHERE guest_token_hmac IS NOT NULL AND status = 'open';

CREATE TABLE commerce.cart_items (
    cart_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES commerce.carts(cart_id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES catalog.product_variants(variant_id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_at_add NUMERIC(14, 2) NULL CHECK (unit_price_at_add IS NULL OR unit_price_at_add >= 0),
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT cart_item_variant_unique UNIQUE (cart_id, variant_id)
);
COMMENT ON COLUMN commerce.cart_items.unit_price_at_add IS 'Solo referencia visual; nunca confiar en este valor al confirmar la compra.';

CREATE TABLE commerce.orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(40) NOT NULL UNIQUE,
    customer_person_id UUID NOT NULL REFERENCES crm.people(person_id) ON DELETE RESTRICT,
    customer_user_id UUID NULL REFERENCES identity.users(user_id) ON DELETE SET NULL,
    currency_code CHAR(3) NOT NULL REFERENCES core.currencies(currency_code) ON DELETE RESTRICT,
    status VARCHAR(24) NOT NULL DEFAULT 'pending_payment' CHECK (status IN (
        'pending_payment', 'payment_authorized', 'paid', 'processing', 'fulfilled',
        'cancelled', 'partially_refunded', 'refunded', 'payment_failed'
    )),
    subtotal_amount NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (subtotal_amount >= 0),
    discount_amount NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    tax_amount NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    shipping_amount NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
    total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMPTZ NULL,
    cancelled_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT order_total_consistency CHECK (total_amount = subtotal_amount - discount_amount + tax_amount + shipping_amount),
    CONSTRAINT order_discount_not_over_subtotal CHECK (discount_amount <= subtotal_amount),
    CONSTRAINT order_id_currency_unique UNIQUE (order_id, currency_code)
);
CREATE INDEX ix_orders_customer_date ON commerce.orders (customer_person_id, placed_at DESC);
CREATE INDEX ix_orders_user_date ON commerce.orders (customer_user_id, placed_at DESC) WHERE customer_user_id IS NOT NULL;
CREATE INDEX ix_orders_status_date ON commerce.orders (status, placed_at DESC);

CREATE TABLE commerce.order_items (
    order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES commerce.orders(order_id) ON DELETE RESTRICT,
    variant_id UUID NULL REFERENCES catalog.product_variants(variant_id) ON DELETE SET NULL,
    -- Snapshots históricos intencionales: preservan lo comprado aunque cambie el catálogo.
    product_name_snapshot VARCHAR(180) NOT NULL,
    variant_name_snapshot VARCHAR(180) NOT NULL,
    sku_snapshot VARCHAR(100) NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_amount NUMERIC(14, 2) NOT NULL CHECK (unit_price_amount >= 0),
    line_subtotal_amount NUMERIC(14, 2) NOT NULL CHECK (line_subtotal_amount >= 0),
    discount_amount NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    tax_amount NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    line_total_amount NUMERIC(14, 2) NOT NULL CHECK (line_total_amount >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT order_item_subtotal_consistency CHECK (line_subtotal_amount = quantity * unit_price_amount),
    CONSTRAINT order_item_discount_limit CHECK (discount_amount <= line_subtotal_amount),
    CONSTRAINT order_item_total_consistency CHECK (line_total_amount = line_subtotal_amount - discount_amount + tax_amount)
);
CREATE INDEX ix_order_items_order ON commerce.order_items (order_id);

CREATE TABLE commerce.order_addresses (
    order_address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES commerce.orders(order_id) ON DELETE RESTRICT,
    address_type VARCHAR(20) NOT NULL CHECK (address_type IN ('billing', 'shipping')),
    recipient_name VARCHAR(180) NOT NULL,
    company_name VARCHAR(180) NULL,
    address_line_1 VARCHAR(180) NOT NULL,
    address_line_2 VARCHAR(180) NULL,
    locality VARCHAR(120) NOT NULL,
    administrative_area VARCHAR(120) NULL,
    postal_code VARCHAR(30) NULL,
    country_code CHAR(2) NOT NULL,
    phone_snapshot VARCHAR(32) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT order_address_type_unique UNIQUE (order_id, address_type),
    CONSTRAINT order_address_country_upper CHECK (country_code = UPPER(country_code))
);
COMMENT ON TABLE commerce.order_addresses IS 'Snapshot PII de dirección únicamente cuando la operación lo requiera; aplicar retención estricta.';

CREATE TABLE commerce.order_status_events (
    order_status_event_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES commerce.orders(order_id) ON DELETE RESTRICT,
    previous_status VARCHAR(24) NULL,
    new_status VARCHAR(24) NOT NULL,
    reason_code VARCHAR(80) NULL,
    actor_user_id UUID NULL REFERENCES identity.users(user_id) ON DELETE SET NULL,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    request_id UUID NULL
);
CREATE INDEX ix_order_status_events_order_date ON commerce.order_status_events (order_id, occurred_at DESC);

CREATE TABLE commerce.payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    currency_code CHAR(3) NOT NULL,
    provider_code VARCHAR(60) NOT NULL,
    provider_payment_id VARCHAR(255) NULL,
    idempotency_key VARCHAR(180) NOT NULL UNIQUE,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    status VARCHAR(24) NOT NULL CHECK (status IN (
        'created', 'requires_action', 'authorized', 'captured', 'failed', 'cancelled', 'partially_refunded', 'refunded'
    )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    captured_at TIMESTAMPTZ NULL,
    CONSTRAINT payment_order_currency_fk FOREIGN KEY (order_id, currency_code)
        REFERENCES commerce.orders(order_id, currency_code) ON DELETE RESTRICT,
    CONSTRAINT payment_id_currency_unique UNIQUE (payment_id, currency_code)
);
CREATE UNIQUE INDEX ux_payments_provider_id ON commerce.payments (provider_code, provider_payment_id)
    WHERE provider_payment_id IS NOT NULL;
CREATE INDEX ix_payments_order ON commerce.payments (order_id, created_at DESC);
COMMENT ON TABLE commerce.payments IS 'Guardar referencias del proveedor y estados; jamás PAN/CVV ni secretos de pago.';

CREATE TABLE commerce.refunds (
    refund_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL,
    currency_code CHAR(3) NOT NULL,
    provider_refund_id VARCHAR(255) NULL,
    idempotency_key VARCHAR(180) NOT NULL UNIQUE,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('requested', 'processing', 'succeeded', 'failed', 'cancelled')),
    reason_code VARCHAR(80) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ NULL,
    CONSTRAINT refund_payment_currency_fk FOREIGN KEY (payment_id, currency_code)
        REFERENCES commerce.payments(payment_id, currency_code) ON DELETE RESTRICT
);
CREATE UNIQUE INDEX ux_refunds_provider_id ON commerce.refunds (provider_refund_id) WHERE provider_refund_id IS NOT NULL;
CREATE INDEX ix_refunds_payment ON commerce.refunds (payment_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 8. INVENTORY: cantidades y libro de movimientos
-- ---------------------------------------------------------------------------
CREATE TABLE inventory.locations (
    location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(60) NOT NULL UNIQUE,
    name VARCHAR(140) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inventory.stock_balances (
    variant_id UUID NOT NULL REFERENCES catalog.product_variants(variant_id) ON DELETE RESTRICT,
    location_id UUID NOT NULL REFERENCES inventory.locations(location_id) ON DELETE RESTRICT,
    quantity_on_hand INTEGER NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0),
    quantity_reserved INTEGER NOT NULL DEFAULT 0 CHECK (quantity_reserved >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (variant_id, location_id),
    CONSTRAINT stock_reserved_not_over_on_hand CHECK (quantity_reserved <= quantity_on_hand)
);

CREATE TABLE inventory.stock_movements (
    stock_movement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES catalog.product_variants(variant_id) ON DELETE RESTRICT,
    location_id UUID NOT NULL REFERENCES inventory.locations(location_id) ON DELETE RESTRICT,
    movement_type VARCHAR(24) NOT NULL CHECK (movement_type IN (
        'receipt', 'sale', 'reservation', 'release', 'return', 'adjustment', 'transfer_in', 'transfer_out'
    )),
    quantity_delta INTEGER NOT NULL CHECK (quantity_delta <> 0),
    reference_type VARCHAR(40) NULL,
    reference_id UUID NULL,
    idempotency_key VARCHAR(180) NOT NULL UNIQUE,
    actor_user_id UUID NULL REFERENCES identity.users(user_id) ON DELETE SET NULL,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    note_code VARCHAR(80) NULL
);
CREATE INDEX ix_stock_movements_variant_date ON inventory.stock_movements (variant_id, occurred_at DESC);
COMMENT ON TABLE inventory.stock_movements IS 'Libro auditable e idempotente. Actualizar stock_balances y registrar movimiento en una misma transacción.';

-- ---------------------------------------------------------------------------
-- 9. PROMOTIONS: promociones y cupones; las reglas se validan transaccionalmente
-- ---------------------------------------------------------------------------
CREATE TABLE promotions.promotions (
    promotion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(80) NOT NULL UNIQUE,
    name VARCHAR(180) NOT NULL,
    description TEXT NULL,
    promotion_type VARCHAR(24) NOT NULL CHECK (promotion_type IN ('percentage', 'fixed_amount', 'free_shipping', 'points')),
    percent_value NUMERIC(5, 2) NULL CHECK (percent_value IS NULL OR percent_value BETWEEN 0.01 AND 100.00),
    fixed_amount NUMERIC(14, 2) NULL CHECK (fixed_amount IS NULL OR fixed_amount >= 0),
    currency_code CHAR(3) NULL REFERENCES core.currencies(currency_code) ON DELETE RESTRICT,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NULL,
    max_redemptions INTEGER NULL CHECK (max_redemptions IS NULL OR max_redemptions > 0),
    per_person_limit INTEGER NULL CHECK (per_person_limit IS NULL OR per_person_limit > 0),
    combinable BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'ended', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT promotion_dates CHECK (ends_at IS NULL OR ends_at > starts_at),
    CONSTRAINT promotion_amount_shape CHECK (
        (promotion_type = 'percentage' AND percent_value IS NOT NULL AND fixed_amount IS NULL)
        OR (promotion_type = 'fixed_amount' AND fixed_amount IS NOT NULL AND percent_value IS NULL AND currency_code IS NOT NULL)
        OR (promotion_type IN ('free_shipping', 'points') AND percent_value IS NULL AND fixed_amount IS NULL)
    )
);

CREATE TABLE promotions.promotion_codes (
    promotion_code_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id UUID NOT NULL REFERENCES promotions.promotions(promotion_id) ON DELETE RESTRICT,
    code VARCHAR(100) NOT NULL UNIQUE,
    max_redemptions INTEGER NULL CHECK (max_redemptions IS NULL OR max_redemptions > 0),
    valid_from TIMESTAMPTZ NULL,
    valid_to TIMESTAMPTZ NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT promotion_code_dates CHECK (valid_from IS NULL OR valid_to IS NULL OR valid_to > valid_from)
);

CREATE TABLE promotions.promotion_products (
    promotion_id UUID NOT NULL REFERENCES promotions.promotions(promotion_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES catalog.products(product_id) ON DELETE RESTRICT,
    PRIMARY KEY (promotion_id, product_id)
);

CREATE TABLE promotions.promotion_redemptions (
    promotion_redemption_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id UUID NOT NULL REFERENCES promotions.promotions(promotion_id) ON DELETE RESTRICT,
    promotion_code_id UUID NULL REFERENCES promotions.promotion_codes(promotion_code_id) ON DELETE RESTRICT,
    order_id UUID NOT NULL REFERENCES commerce.orders(order_id) ON DELETE RESTRICT,
    person_id UUID NOT NULL REFERENCES crm.people(person_id) ON DELETE RESTRICT,
    currency_code CHAR(3) NOT NULL REFERENCES core.currencies(currency_code) ON DELETE RESTRICT,
    discount_amount NUMERIC(14, 2) NOT NULL CHECK (discount_amount >= 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('reserved', 'redeemed', 'released', 'reversed')),
    redeemed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT promotion_redemption_order_code_unique UNIQUE (order_id, promotion_code_id)
);
CREATE INDEX ix_promotion_redemptions_person ON promotions.promotion_redemptions (promotion_id, person_id, status);
COMMENT ON TABLE promotions.promotion_redemptions IS 'Límites de uso/canje requieren transacción y bloqueo/constraint; validarlos antes de confirmar orden.';

-- ---------------------------------------------------------------------------
-- 10. GAMIFICATION: minijuegos, sesiones, resultados y recompensas
-- ---------------------------------------------------------------------------
CREATE TABLE gamification.games (
    game_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(120) NOT NULL UNIQUE,
    name VARCHAR(160) NOT NULL,
    description TEXT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'retired')),
    rules_version VARCHAR(40) NOT NULL DEFAULT '1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE gamification.game_sessions (
    game_session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES gamification.games(game_id) ON DELETE RESTRICT,
    user_id UUID NULL REFERENCES identity.users(user_id) ON DELETE CASCADE,
    guest_token_hmac BYTEA NULL CHECK (guest_token_hmac IS NULL OR OCTET_LENGTH(guest_token_hmac) = 32),
    state VARCHAR(20) NOT NULL DEFAULT 'started' CHECK (state IN ('started', 'completed', 'abandoned', 'invalidated')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ NULL,
    -- Estado opaco de partida, no datos de negocio/identidad. Validar tamaño/schema.
    game_state JSONB NOT NULL DEFAULT '{}'::JSONB CHECK (JSONB_TYPEOF(game_state) = 'object'),
    CONSTRAINT game_session_exactly_one_player CHECK (
        (user_id IS NOT NULL AND guest_token_hmac IS NULL) OR
        (user_id IS NULL AND guest_token_hmac IS NOT NULL)
    ),
    CONSTRAINT game_session_completion_time CHECK (state <> 'completed' OR completed_at IS NOT NULL)
);
CREATE INDEX ix_game_sessions_game_start ON gamification.game_sessions (game_id, started_at DESC);
CREATE INDEX ix_game_sessions_user_start ON gamification.game_sessions (user_id, started_at DESC) WHERE user_id IS NOT NULL;

CREATE TABLE gamification.game_results (
    game_result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_session_id UUID NOT NULL UNIQUE REFERENCES gamification.game_sessions(game_session_id) ON DELETE CASCADE,
    score BIGINT NOT NULL CHECK (score >= 0),
    duration_ms INTEGER NULL CHECK (duration_ms IS NULL OR duration_ms >= 0),
    eligible_for_leaderboard BOOLEAN NOT NULL DEFAULT FALSE,
    validated_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_game_results_leaderboard ON gamification.game_results (score DESC, created_at DESC) WHERE eligible_for_leaderboard = TRUE;

CREATE TABLE gamification.rewards (
    reward_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(80) NOT NULL UNIQUE,
    name VARCHAR(160) NOT NULL,
    reward_type VARCHAR(24) NOT NULL CHECK (reward_type IN ('badge', 'promotion', 'digital_content', 'points')),
    promotion_id UUID NULL REFERENCES promotions.promotions(promotion_id) ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT reward_promotion_relation CHECK ((reward_type = 'promotion') = (promotion_id IS NOT NULL))
);

CREATE TABLE gamification.game_rewards (
    game_id UUID NOT NULL REFERENCES gamification.games(game_id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES gamification.rewards(reward_id) ON DELETE RESTRICT,
    minimum_score BIGINT NULL CHECK (minimum_score IS NULL OR minimum_score >= 0),
    PRIMARY KEY (game_id, reward_id)
);

CREATE TABLE gamification.reward_redemptions (
    reward_redemption_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reward_id UUID NOT NULL REFERENCES gamification.rewards(reward_id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES identity.users(user_id) ON DELETE RESTRICT,
    promotion_redemption_id UUID NULL REFERENCES promotions.promotion_redemptions(promotion_redemption_id) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL DEFAULT 'granted' CHECK (status IN ('granted', 'redeemed', 'expired', 'revoked')),
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    redeemed_at TIMESTAMPTZ NULL,
    expires_at TIMESTAMPTZ NULL
);
CREATE INDEX ix_reward_redemptions_user ON gamification.reward_redemptions (user_id, granted_at DESC);

-- ---------------------------------------------------------------------------
-- 11. INTEGRATIONS: transactional outbox y webhooks idempotentes
-- ---------------------------------------------------------------------------
CREATE TABLE integrations.outbox_events (
    outbox_event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type VARCHAR(80) NOT NULL,
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(120) NOT NULL,
    schema_version INTEGER NOT NULL DEFAULT 1 CHECK (schema_version > 0),
    payload JSONB NOT NULL CHECK (JSONB_TYPEOF(payload) = 'object'),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ NULL,
    attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
    locked_at TIMESTAMPTZ NULL,
    last_error_code VARCHAR(100) NULL,
    idempotency_key VARCHAR(180) NOT NULL UNIQUE
);
CREATE INDEX ix_outbox_pending ON integrations.outbox_events (available_at, occurred_at) WHERE published_at IS NULL;
COMMENT ON TABLE integrations.outbox_events IS 'Insertar en la misma transacción del cambio de negocio; un worker publica con reintentos e idempotencia.';
COMMENT ON COLUMN integrations.outbox_events.payload IS 'No incluir secretos ni PII innecesaria; versionar el contrato del evento.';

CREATE TABLE integrations.webhook_subscriptions (
    webhook_subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(80) NOT NULL UNIQUE,
    destination_url TEXT NOT NULL,
    secret_reference VARCHAR(240) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'revoked')),
    timeout_seconds SMALLINT NOT NULL DEFAULT 10 CHECK (timeout_seconds BETWEEN 1 AND 60),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON COLUMN integrations.webhook_subscriptions.secret_reference IS 'Referencia a un gestor de secretos; nunca almacenar la clave HMAC en claro.';
COMMENT ON COLUMN integrations.webhook_subscriptions.destination_url IS 'Validar HTTPS y mitigar SSRF: lista permitida, DNS/IP checks y bloqueo de redes privadas/reservadas.';

CREATE TABLE integrations.webhook_subscription_events (
    webhook_subscription_id UUID NOT NULL REFERENCES integrations.webhook_subscriptions(webhook_subscription_id) ON DELETE CASCADE,
    event_type VARCHAR(120) NOT NULL,
    PRIMARY KEY (webhook_subscription_id, event_type)
);

CREATE TABLE integrations.outbox_deliveries (
    outbox_delivery_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outbox_event_id UUID NOT NULL REFERENCES integrations.outbox_events(outbox_event_id) ON DELETE RESTRICT,
    webhook_subscription_id UUID NOT NULL REFERENCES integrations.webhook_subscriptions(webhook_subscription_id) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivering', 'delivered', 'retry', 'dead_letter', 'cancelled')),
    attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
    next_retry_at TIMESTAMPTZ NULL,
    last_http_status SMALLINT NULL CHECK (last_http_status IS NULL OR last_http_status BETWEEN 100 AND 599),
    last_error_code VARCHAR(100) NULL,
    delivered_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT outbox_delivery_event_target_unique UNIQUE (outbox_event_id, webhook_subscription_id)
);
CREATE INDEX ix_outbox_deliveries_retry ON integrations.outbox_deliveries (status, next_retry_at);

CREATE TABLE integrations.webhook_delivery_attempts (
    webhook_delivery_attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outbox_delivery_id UUID NOT NULL REFERENCES integrations.outbox_deliveries(outbox_delivery_id) ON DELETE CASCADE,
    attempt_number SMALLINT NOT NULL CHECK (attempt_number > 0),
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ NULL,
    http_status SMALLINT NULL CHECK (http_status IS NULL OR http_status BETWEEN 100 AND 599),
    duration_ms INTEGER NULL CHECK (duration_ms IS NULL OR duration_ms >= 0),
    error_code VARCHAR(100) NULL,
    CONSTRAINT webhook_delivery_attempt_unique UNIQUE (outbox_delivery_id, attempt_number)
);

CREATE TABLE integrations.inbound_webhook_events (
    inbound_webhook_event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_code VARCHAR(80) NOT NULL,
    provider_event_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(120) NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
    payload_sha256 BYTEA NOT NULL CHECK (OCTET_LENGTH(payload_sha256) = 32),
    -- Guardar solamente JSON saneado/retención corta; el original puede contener PII.
    sanitized_payload JSONB NOT NULL DEFAULT '{}'::JSONB CHECK (JSONB_TYPEOF(sanitized_payload) = 'object'),
    processing_status VARCHAR(20) NOT NULL DEFAULT 'received' CHECK (processing_status IN ('received', 'processing', 'processed', 'rejected', 'failed')),
    processed_at TIMESTAMPTZ NULL,
    error_code VARCHAR(100) NULL,
    CONSTRAINT inbound_provider_event_unique UNIQUE (provider_code, provider_event_id)
);
CREATE INDEX ix_inbound_webhook_queue ON integrations.inbound_webhook_events (processing_status, received_at);
COMMENT ON TABLE integrations.inbound_webhook_events IS 'Verificar firma antes de efectos secundarios; unique(provider,event) evita procesamiento duplicado.';

-- ---------------------------------------------------------------------------
-- 12. GOVERNANCE: auditoría técnica minimizada
-- ---------------------------------------------------------------------------
CREATE TABLE governance.audit_events (
    audit_event_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor_user_id UUID NULL REFERENCES identity.users(user_id) ON DELETE SET NULL,
    actor_type VARCHAR(24) NOT NULL CHECK (actor_type IN ('user', 'system', 'provider', 'admin', 'anonymous')),
    action_code VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NULL,
    result_code VARCHAR(40) NOT NULL DEFAULT 'success',
    request_id UUID NULL,
    source_ip_hmac BYTEA NULL CHECK (source_ip_hmac IS NULL OR OCTET_LENGTH(source_ip_hmac) = 32),
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB CHECK (JSONB_TYPEOF(metadata) = 'object')
);
CREATE INDEX ix_audit_entity_time ON governance.audit_events (entity_type, entity_id, occurred_at DESC);
CREATE INDEX ix_audit_actor_time ON governance.audit_events (actor_user_id, occurred_at DESC) WHERE actor_user_id IS NOT NULL;
CREATE INDEX ix_audit_action_time ON governance.audit_events (action_code, occurred_at DESC);
COMMENT ON TABLE governance.audit_events IS 'No volcar request bodies, emails, teléfonos, tokens, contraseñas ni datos de pago en metadata.';

-- ---------------------------------------------------------------------------
-- 13. DATOS INICIALES DE CATÁLOGO (no contienen datos de personas reales)
-- ---------------------------------------------------------------------------
INSERT INTO core.currencies (currency_code, currency_name, minor_unit) VALUES
    ('CLP', 'Peso chileno', 0),
    ('USD', 'Dólar estadounidense', 2),
    ('EUR', 'Euro', 2);

INSERT INTO core.channels (code, display_name, is_addressable) VALUES
    ('email', 'Correo electrónico', TRUE),
    ('whatsapp', 'WhatsApp', TRUE),
    ('sms', 'SMS', TRUE),
    ('phone', 'Teléfono / llamada', TRUE),
    ('web_push', 'Notificación web', TRUE),
    ('web_form', 'Formulario web', FALSE);

INSERT INTO core.lead_sources (code, display_name) VALUES
    ('web_form', 'Formulario del sitio web'),
    ('whatsapp_inbound', 'Consulta entrante por WhatsApp'),
    ('referral', 'Recomendación'),
    ('event', 'Evento presencial'),
    ('organic_search', 'Búsqueda orgánica'),
    ('paid_campaign', 'Campaña pagada'),
    ('existing_client', 'Cliente existente'),
    ('unknown', 'Origen desconocido');

INSERT INTO privacy.processing_purposes (code, name, description, requires_consent, is_marketing) VALUES
    ('service_contact', 'Responder solicitudes', 'Responder una consulta que la persona inició voluntariamente.', FALSE, FALSE),
    ('email_marketing', 'Ofertas por correo electrónico', 'Enviar promociones y novedades por email; autorización separada y revocable.', TRUE, TRUE),
    ('whatsapp_marketing', 'Ofertas por WhatsApp', 'Enviar ofertas por WhatsApp; autorización independiente y revocable.', TRUE, TRUE),
    ('product_testing', 'Pruebas de aplicaciones', 'Invitar y gestionar pruebas de aplicaciones o betas; informar qué datos de uso se recogen.', TRUE, FALSE),
    ('account_management', 'Administración de cuenta', 'Crear, asegurar y administrar una cuenta solicitada por el titular.', FALSE, FALSE),
    ('order_fulfillment', 'Gestión de pedidos', 'Procesar pagos, entregar productos/servicios y administrar devoluciones.', FALSE, FALSE),
    ('security_operations', 'Seguridad y prevención de abuso', 'Detectar abuso, proteger servicios y preservar registros necesarios.', FALSE, FALSE),
    ('optional_analytics', 'Analítica opcional', 'Medir uso no esencial; activar solo tras definir base jurídica/consentimiento aplicable.', TRUE, FALSE),
    ('gameplay', 'Guardar progreso de juegos', 'Guardar sesiones/resultados cuando la persona use funciones que lo requieran.', FALSE, FALSE),
    ('personalization', 'Personalización de contenido', 'Personalizar ofertas o experiencia según preferencias expresas.', TRUE, FALSE);

-- ---------------------------------------------------------------------------
-- 14. VISTAS DE CONTROL PARA CONSENTIMIENTO Y SEGMENTACIÓN
-- ---------------------------------------------------------------------------
-- Última decisión registrada por punto de contacto + finalidad. El uso de
-- recorded_at y el identity sequence resuelve empates de registros concurrentes.
CREATE VIEW privacy.v_current_consent_state AS
SELECT DISTINCT ON (ce.contact_point_id, ce.purpose_id, ce.channel_id)
       ce.contact_point_id,
       ce.channel_id,
       ce.purpose_id,
       ce.event_type,
       ce.consent_event_id,
       ce.notice_version_id,
       ce.recorded_at,
       ce.endpoint_hmac,
       ce.hmac_key_version
FROM privacy.consent_events AS ce
WHERE ce.contact_point_id IS NOT NULL
ORDER BY ce.contact_point_id, ce.purpose_id, ce.channel_id, ce.recorded_at DESC, ce.consent_event_id DESC;

-- Fuente recomendada para preparar una audiencia de marketing. Esta vista no
-- envía mensajes. El backend debe volver a evaluarla justo antes del envío,
-- bloquear si falla el lookup de supresión, y comprobar las reglas del proveedor.
CREATE VIEW marketing.v_eligible_marketing_contact_points AS
SELECT cp.contact_point_id,
       cp.person_id,
       cp.channel_id,
       ch.code AS channel_code,
       cp.normalized_value,
       pp.code AS purpose_code,
       ccs.consent_event_id,
       ccs.notice_version_id,
       ccs.recorded_at AS consent_recorded_at
FROM crm.contact_points AS cp
JOIN core.channels AS ch ON ch.channel_id = cp.channel_id
JOIN privacy.v_current_consent_state AS ccs
  ON ccs.contact_point_id = cp.contact_point_id
 AND ccs.channel_id = cp.channel_id
JOIN privacy.processing_purposes AS pp ON pp.purpose_id = ccs.purpose_id
WHERE cp.deleted_at IS NULL
  AND cp.is_verified = TRUE
  AND ccs.event_type = 'granted'
  AND pp.requires_consent = TRUE
  AND pp.is_marketing = TRUE
  AND ((ch.code = 'email' AND pp.code = 'email_marketing')
       OR (ch.code = 'whatsapp' AND pp.code = 'whatsapp_marketing'))
  AND NOT EXISTS (
      SELECT 1
      FROM privacy.suppression_entries AS se
      WHERE se.channel_id = cp.channel_id
        AND se.hmac_key_version = cp.hmac_key_version
        AND se.endpoint_hmac = cp.endpoint_hmac
        AND se.is_active = TRUE
        AND (se.expires_at IS NULL OR se.expires_at > NOW())
  );

COMMENT ON VIEW marketing.v_eligible_marketing_contact_points IS 'No usar como garantía permanente: consultar de nuevo al momento de envío y respetar la baja inmediatamente.';

-- Impedir que una campaña de marketing use finalidades no publicitarias o mezcle
-- permisos: email_marketing solo para email y whatsapp_marketing solo WhatsApp.
CREATE FUNCTION marketing.validate_campaign_channel()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    channel_code TEXT;
    purpose_code TEXT;
    purpose_requires_consent BOOLEAN;
    purpose_is_marketing BOOLEAN;
BEGIN
    SELECT ch.code, pp.code, pp.requires_consent, pp.is_marketing
      INTO channel_code, purpose_code, purpose_requires_consent, purpose_is_marketing
    FROM core.channels AS ch
    CROSS JOIN privacy.processing_purposes AS pp
    WHERE ch.channel_id = NEW.channel_id
      AND pp.purpose_id = NEW.purpose_id;

    IF NOT FOUND OR purpose_requires_consent IS NOT TRUE OR purpose_is_marketing IS NOT TRUE THEN
        RAISE EXCEPTION 'A marketing campaign requires an explicit marketing-consent purpose';
    END IF;

    IF NOT ((channel_code = 'email' AND purpose_code = 'email_marketing')
         OR (channel_code = 'whatsapp' AND purpose_code = 'whatsapp_marketing')) THEN
        RAISE EXCEPTION 'Channel and marketing purpose do not match';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_campaign_channel
BEFORE INSERT OR UPDATE OF channel_id, purpose_id
ON marketing.campaign_channels
FOR EACH ROW EXECUTE FUNCTION marketing.validate_campaign_channel();

-- Integridad de cola: impide encolar con un evento que no corresponda al canal,
-- finalidad o punto de contacto, o que ya no sea el permiso vigente. La aplicación
-- debe repetir el chequeo inmediatamente antes del despacho al proveedor.
CREATE FUNCTION marketing.validate_campaign_recipient()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    expected_purpose UUID;
    expected_template UUID;
    campaign_status VARCHAR(24);
    template_status VARCHAR(20);
    cp_hmac BYTEA;
    cp_key_version SMALLINT;
    cp_verified BOOLEAN;
    cp_deleted_at TIMESTAMPTZ;
    consent_is_current BOOLEAN;
BEGIN
    SELECT cc.purpose_id, cc.template_id, c.status
      INTO expected_purpose, expected_template, campaign_status
    FROM marketing.campaign_channels AS cc
    JOIN marketing.campaigns AS c ON c.campaign_id = cc.campaign_id
    WHERE cc.campaign_id = NEW.campaign_id AND cc.channel_id = NEW.channel_id;

    IF NOT FOUND OR expected_purpose IS NULL THEN
        RAISE EXCEPTION 'Campaign/channel combination is not configured';
    END IF;

    IF campaign_status NOT IN ('scheduled', 'running') THEN
        RAISE EXCEPTION 'Recipients can only be queued for scheduled/running campaigns';
    END IF;

    IF expected_template IS NULL THEN
        RAISE EXCEPTION 'A published marketing message template is required';
    END IF;

    SELECT mt.status INTO template_status
    FROM marketing.message_templates AS mt
    WHERE mt.template_id = expected_template
      AND mt.channel_id = NEW.channel_id
      AND mt.purpose_id = expected_purpose;

    IF NOT FOUND OR template_status <> 'approved' THEN
        RAISE EXCEPTION 'Campaign requires an approved template for this channel and purpose';
    END IF;

    SELECT cp.endpoint_hmac, cp.hmac_key_version, cp.is_verified, cp.deleted_at
      INTO cp_hmac, cp_key_version, cp_verified, cp_deleted_at
    FROM crm.contact_points AS cp
    WHERE cp.contact_point_id = NEW.contact_point_id AND cp.channel_id = NEW.channel_id;

    IF NOT FOUND OR cp_deleted_at IS NOT NULL OR cp_verified IS NOT TRUE THEN
        RAISE EXCEPTION 'Contact point is missing, deleted, or not verified';
    END IF;

    SELECT EXISTS (
        SELECT 1
        FROM privacy.consent_events AS ce
        JOIN privacy.v_current_consent_state AS ccs
          ON ccs.consent_event_id = ce.consent_event_id
         AND ccs.contact_point_id = ce.contact_point_id
         AND ccs.channel_id = ce.channel_id
         AND ccs.purpose_id = ce.purpose_id
        WHERE ce.consent_event_id = NEW.consent_event_id
          AND ce.contact_point_id = NEW.contact_point_id
          AND ce.channel_id = NEW.channel_id
          AND ce.purpose_id = expected_purpose
          AND ce.event_type = 'granted'
          AND ccs.event_type = 'granted'
    ) INTO consent_is_current;

    IF consent_is_current IS NOT TRUE THEN
        RAISE EXCEPTION 'Cannot queue recipient without current consent for this exact channel and purpose';
    END IF;

    IF EXISTS (
        SELECT 1 FROM privacy.suppression_entries AS se
        WHERE se.channel_id = NEW.channel_id
          AND se.hmac_key_version = cp_key_version
          AND se.endpoint_hmac = cp_hmac
          AND se.is_active = TRUE
          AND (se.expires_at IS NULL OR se.expires_at > NOW())
    ) THEN
        RAISE EXCEPTION 'Cannot queue a suppressed contact point';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_campaign_recipient
BEFORE INSERT OR UPDATE OF campaign_id, contact_point_id, channel_id, consent_event_id
ON marketing.campaign_recipients
FOR EACH ROW EXECUTE FUNCTION marketing.validate_campaign_recipient();

-- ---------------------------------------------------------------------------
-- 15. updated_at AUTOMÁTICO EN TABLAS MUTABLES
-- ---------------------------------------------------------------------------
CREATE FUNCTION core.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

DO $$
DECLARE
    target_table TEXT;
BEGIN
    FOREACH target_table IN ARRAY ARRAY[
        'catalog.categories', 'catalog.products', 'catalog.product_variants',
        'crm.people', 'crm.contact_points', 'crm.leads',
        'identity.users', 'identity.user_profiles',
        'privacy.processing_activities',
        'marketing.campaigns',
        'commerce.carts', 'commerce.cart_items', 'commerce.orders', 'commerce.payments',
        'promotions.promotions', 'gamification.games',
        'integrations.webhook_subscriptions', 'inventory.stock_balances'
    ]
    LOOP
        EXECUTE FORMAT(
            'CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION core.set_updated_at()',
            target_table
        );
    END LOOP;
END;
$$;

-- ---------------------------------------------------------------------------
-- 16. ÍNDICES DE APOYO / integridad para consultas habituales
-- ---------------------------------------------------------------------------
CREATE INDEX ix_products_status_type ON catalog.products (status, product_type);
CREATE INDEX ix_product_variants_product_active ON catalog.product_variants (product_id, is_active);
CREATE INDEX ix_products_name_search ON catalog.products USING GIN (TO_TSVECTOR('spanish', COALESCE(name, '') || ' ' || COALESCE(description, '')));
CREATE INDEX ix_campaigns_schedule ON marketing.campaigns (status, scheduled_at) WHERE status IN ('scheduled', 'running');
CREATE INDEX ix_message_templates_purpose_channel ON marketing.message_templates (purpose_id, channel_id, status);
CREATE INDEX ix_cart_items_cart ON commerce.cart_items (cart_id);
CREATE INDEX ix_payments_status_created ON commerce.payments (status, created_at DESC);
CREATE INDEX ix_promotion_codes_promotion_active ON promotions.promotion_codes (promotion_id, is_active);
CREATE INDEX ix_people_status_created ON crm.people (status, created_at DESC);

-- ---------------------------------------------------------------------------
-- 17. GOBIERNO Y SEGURIDAD OPERATIVA: criterios que no deben omitirse
-- ---------------------------------------------------------------------------
-- El DBA/DevOps debe crear roles reales separados por entorno. Ejemplo conceptual
-- (no se ejecuta aquí porque nombres/credenciales/hosting dependen del despliegue):
--   CREATE ROLE naxoresuelve_owner NOLOGIN;
--   CREATE ROLE naxoresuelve_migrator LOGIN;   -- permisos DDL solo en migraciones
--   CREATE ROLE naxoresuelve_app LOGIN;        -- DML mínimo, sin DDL/TRUNCATE
--   CREATE ROLE naxoresuelve_readonly LOGIN;   -- lectura específica y aprobada
--   REVOKE ALL ON SCHEMA privacy, governance FROM PUBLIC;
--   REVOKE ALL ON ALL TABLES IN SCHEMA privacy, governance FROM PUBLIC;
-- Configurar ALTER DEFAULT PRIVILEGES para no conceder permisos nuevos por defecto.
-- La aplicación no debe conectarse como owner/superuser. Credenciales por Secret Manager.
--
-- RLS (Row-Level Security): activarlo en tablas de perfil/carrito/pedidos si se
-- requiere defensa en profundidad. Antes, definir el contexto autenticado de forma
-- segura, políticas por operación/rol y pruebas de aislamiento usuario A vs B.
-- No activar una política incompleta: RLS mal configurado puede filtrar datos o
-- bloquear operaciones legítimas. Referencia oficial en encabezado.
--
-- Consentimiento/marketing — obligaciones de la capa de aplicación:
--   1. Email y WhatsApp son permisos diferentes; no inferir consentimiento de uno
--      a partir del otro. Casillas desmarcadas por defecto y finalidades claras.
--   2. Guardar evento de grant con texto/version de aviso exactos, canal, finalidad,
--      timestamp y método verificable. Para email considerar double opt-in.
--   3. Probar propiedad del email/teléfono antes de habilitar campañas al endpoint.
--   4. Antes de cada despacho validar: permiso más reciente = granted, endpoint
--      verificado, no suprimido, canal correcto y reglas/plantillas del proveedor.
--   5. Procesar STOP/BAJA/reclamaciones/rebotes y bloquear futuros envíos sin demora.
--      Crear evento withdrawn y suppression entry en la misma transacción funcional.
--   6. No comprar ni importar listas sin prueba de origen/base jurídica/permiso.
--   7. Incluir mecanismo sencillo de baja e identidad del remitente en comunicaciones.
--   8. No condicionar una solicitud de servicio al marketing cuando no sea necesario.
--
-- Reglas de seguridad/operación:
--   * Hash HMAC: la clave vive fuera de la BD; documentar rotación y versiones.
--   * Webhooks entrantes: validar firma/ventana temporal antes de efectos, registrar
--     idempotency key y procesar en transacción; payload minimizado/redactado.
--   * Webhooks salientes: HTTPS, evitar SSRF, firmar body, timestamp, reintentos con
--     backoff, timeout, límites, dead-letter y posibilidad de replay auditado.
--   * Pagos: proveedor PCI-compatible/checkout alojado; almacenar IDs y estados,
--     no datos de tarjeta. Validar importes en servidor, no confiar en frontend.
--   * Mantener logs sin PII, tokens, contraseñas ni datos de pago. Retención definida.
--   * Backups cifrados, fuera de la cuenta de producción, política de retención y
--     pruebas de restauración. Monitorizar integridad, lag, disco y fallos de backup.
--   * Aplicar transacciones para checkout, reserva de stock, canjes y pagos; usar
--     claves de idempotencia ante reintentos. Definir máquina de estados explícita.
--   * No borrar pedidos/documentos legalmente necesarios de forma indiscriminada;
--     en solicitudes de eliminación evaluar obligaciones legales y anonimizar donde
--     proceda, conservando la mínima evidencia permitida por ley.
--   * Datos para analytics: preferir agregación/seudonimización; consentimiento/base
--     legal y controles de cookies antes de trackers no esenciales.
--
-- Normalización 3FN y excepciones intencionales:
--   * Catálogos, relaciones, consentimiento, productos, pedidos y pagos se separan
--     en entidades y relaciones con FK/UNIQUE/CHECK.
--   * Snapshots de nombre/SKU/precio/dirección en una orden son desnormalización
--     histórica intencional: preservar evidencia de lo comprado en ese momento.
--   * JSONB se reserva para payloads externos/estado opaco versionado; no guardar en
--     JSONB personas, consentimientos, pedidos, productos, pagos ni permisos.
--   * Montos usan NUMERIC, nunca FLOAT/REAL. La escala monetaria variable debe
--     validarse por moneda en dominio/servicio (p. ej., CLP no acepta fracciones);
--     este baseline soporta monedas de 0-2 decimales. Tiempo como TIMESTAMPTZ en UTC.
--   * Borrar/archivar productos activos no debe alterar órdenes previas.
--
-- PRUEBAS MÍNIMAS ANTES DE ACEPTAR ESTE MODELO:
--   A. Aplicar baseline en BD vacía y verificar tablas/constraints/indexes/views.
--   B. Crear persona + contacto, captar consentimiento email sin WhatsApp y verificar
--      que solo email aparece en marketing.v_eligible_marketing_contact_points.
--   C. Retirar consentimiento; verificar que deja de ser elegible antes del próximo
--      envío incluso si ya estaba encolado. Probar baja/STOP concurrente con worker.
--   D. Crear suppress entry usando HMAC idéntico; comprobar que la vista excluye la
--      dirección. Probar rotación de clave/versiones.
--   E. Probar duplicación de email/teléfono, doble contacto primario, SKU duplicado,
--      cantidades/precios inválidos, IDs de webhook repetidos y órdenes idempotentes.
--   F. Probar cierre/creación de precios históricos, estados de pedidos y pagos,
--      redención concurrente, stock insuficiente y compensación de fallos externos.
--   G. Pruebas de aislamiento, borrado/anonimización, permisos del rol de aplicación,
--      backups/restauración y migración upgrade desde una versión anterior.
--
-- IMPORTANTE: fijar en Alembic el mismo contrato del modelo; cualquier cambio al SQL
-- debe llegar con migración, pruebas, decisión documentada y plan de rollback.

COMMIT;

-- FIN DE BASELINE NAXORESUELVE
