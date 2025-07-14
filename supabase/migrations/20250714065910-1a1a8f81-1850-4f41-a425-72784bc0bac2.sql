-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Grant necessary permissions on extensions schema
GRANT USAGE ON SCHEMA extensions TO authenticator;
GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;

-- Move pgcrypto extension from public to extensions schema
-- Note: This is a careful operation to avoid breaking existing functionality
DO $$
BEGIN
    -- Check if pgcrypto exists in public schema
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        -- Drop the extension from public schema
        DROP EXTENSION IF EXISTS pgcrypto CASCADE;
        
        -- Recreate it in extensions schema
        CREATE EXTENSION pgcrypto SCHEMA extensions;
        
        -- Update search_path for functions that use pgcrypto
        -- This ensures they can find the functions in the new location
        ALTER DATABASE postgres SET search_path TO public, extensions;
        
        RAISE NOTICE 'Successfully moved pgcrypto extension to extensions schema';
    ELSE
        -- If it's not in public, just ensure it exists in extensions
        CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;
        RAISE NOTICE 'pgcrypto extension verified in extensions schema';
    END IF;
    
    -- Grant execute permissions on pgcrypto functions to necessary roles
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO authenticator;
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO service_role;
    
EXCEPTION
    WHEN OTHERS THEN
        -- If there's an error, ensure basic functionality
        RAISE NOTICE 'Error moving extension, ensuring pgcrypto is available: %', SQLERRM;
        CREATE EXTENSION IF NOT EXISTS pgcrypto;
END;
$$;