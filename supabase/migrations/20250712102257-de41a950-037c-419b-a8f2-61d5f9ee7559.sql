-- Enable the pgcrypto extension for bcrypt support
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Verify the extension is working by testing the crypt function
-- This should return true for a simple test
DO $$
BEGIN
    PERFORM crypt('test', gen_salt('bf'));
    RAISE NOTICE 'pgcrypto extension is working correctly';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'pgcrypto extension failed: %', SQLERRM;
END
$$;