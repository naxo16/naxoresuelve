DO $$
DECLARE
    s TEXT;
BEGIN
    FOR s IN SELECT unnest(ARRAY['core', 'crm', 'identity', 'privacy', 'catalog', 'marketing', 'commerce', 'inventory', 'promotions', 'gamification', 'integrations', 'governance', 'public'])
    LOOP
        EXECUTE format('GRANT USAGE, CREATE ON SCHEMA %I TO naxoresuelve;', s);
        EXECUTE format('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA %I TO naxoresuelve;', s);
        EXECUTE format('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA %I TO naxoresuelve;', s);
        EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT ALL PRIVILEGES ON TABLES TO naxoresuelve;', s);
        EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT ALL PRIVILEGES ON SEQUENCES TO naxoresuelve;', s);
    END LOOP;
END
$$;
