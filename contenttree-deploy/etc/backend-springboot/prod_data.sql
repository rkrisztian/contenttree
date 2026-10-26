-- Prod-like data initialization script (used for E2E testing)
DO
'
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE name = ''admin'') THEN
        -- Password for admin user: secret
        INSERT INTO users (id, name, password_hash, role) VALUES
            (1, ''admin'', ''$2a$10$YWShFGZJKsaq.sZki6hjQO37v84bDorEpqyzcmqNC4qJSbwt54.dK'', ''ADMIN'');

        PERFORM setval(''public.users_seq'', (SELECT COALESCE(MAX(id), 1) FROM users));
    END IF;
END;
'  LANGUAGE PLPGSQL;
