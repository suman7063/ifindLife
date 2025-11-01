-- Move pgcrypto extension to extensions schema for security best practices
-- This addresses the security warning about pgcrypto being in public schema

-- Step 1: Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Step 2: Drop pgcrypto from public schema (if it exists there)
DROP EXTENSION IF EXISTS pgcrypto CASCADE;

-- Step 3: Create pgcrypto in extensions schema
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Step 4: Update the authenticate_admin function to use extensions.crypt
CREATE OR REPLACE FUNCTION public.authenticate_admin(p_username text, p_password text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    admin_record RECORD;
    is_valid BOOLEAN := FALSE;
BEGIN
    -- Get admin account
    SELECT * INTO admin_record 
    FROM admin_accounts 
    WHERE username = p_username AND is_active = true;
    
    -- Check if admin exists and account is not locked
    IF admin_record.id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Invalid credentials');
    END IF;
    
    -- Check if account is locked
    IF admin_record.locked_until IS NOT NULL AND admin_record.locked_until > NOW() THEN
        RETURN json_build_object('success', false, 'error', 'Account is temporarily locked');
    END IF;
    
    -- Verify password using extensions.crypt function for bcrypt comparison
    SELECT (admin_record.password_hash = extensions.crypt(p_password, admin_record.password_hash)) INTO is_valid;
    
    IF is_valid THEN
        -- Update last login and reset failed attempts
        UPDATE admin_accounts 
        SET 
            last_login = NOW(),
            failed_login_attempts = 0,
            locked_until = NULL,
            updated_at = NOW()
        WHERE id = admin_record.id;
        
        -- Return success with admin info
        RETURN json_build_object(
            'success', true,
            'admin', json_build_object(
                'id', admin_record.id,
                'username', admin_record.username,
                'email', admin_record.email,
                'role', admin_record.role,
                'lastLogin', NOW()
            )
        );
    ELSE
        -- Increment failed login attempts
        UPDATE admin_accounts 
        SET 
            failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1,
            locked_until = CASE 
                WHEN COALESCE(failed_login_attempts, 0) + 1 >= 5 
                THEN NOW() + INTERVAL '15 minutes'
                ELSE locked_until
            END,
            updated_at = NOW()
        WHERE id = admin_record.id;
        
        RETURN json_build_object('success', false, 'error', 'Invalid credentials');
    END IF;
END;
$function$;

-- Step 5: Grant necessary permissions to public role for UUID generation
-- Note: gen_random_uuid() will still be available via the public schema default function search path
GRANT USAGE ON SCHEMA extensions TO public;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA extensions TO public;