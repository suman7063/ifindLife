-- Drop and recreate the extension with proper permissions
DROP EXTENSION IF EXISTS pgcrypto CASCADE;
CREATE EXTENSION pgcrypto;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticator;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Test the crypt function to ensure it works
DO $$
DECLARE
    test_result boolean;
BEGIN
    -- Test bcrypt password hashing
    SELECT crypt('test', gen_salt('bf')) IS NOT NULL INTO test_result;
    
    IF NOT test_result THEN
        RAISE EXCEPTION 'pgcrypto crypt function is not working properly';
    END IF;
    
    RAISE NOTICE 'pgcrypto extension is working correctly with crypt function';
END;
$$;