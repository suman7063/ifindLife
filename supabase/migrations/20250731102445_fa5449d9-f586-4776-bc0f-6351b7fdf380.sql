-- Fix the authenticate_admin function to use proper schema
CREATE OR REPLACE FUNCTION public.authenticate_admin(p_username text, p_password text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    admin_record RECORD;
    result JSON;
BEGIN
    -- Check if admin exists and is active
    SELECT id, username, email, role, password_hash, is_active, failed_login_attempts, locked_until
    INTO admin_record
    FROM public.admin_accounts
    WHERE username = p_username AND is_active = true;
    
    -- Check if admin exists
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid credentials'
        );
    END IF;
    
    -- Check if account is locked
    IF admin_record.locked_until IS NOT NULL AND admin_record.locked_until > NOW() THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Account is temporarily locked'
        );
    END IF;
    
    -- Verify password using crypt function
    IF NOT (admin_record.password_hash = crypt(p_password, admin_record.password_hash)) THEN
        -- Increment failed login attempts
        UPDATE public.admin_accounts 
        SET failed_login_attempts = failed_login_attempts + 1,
            locked_until = CASE 
                WHEN failed_login_attempts + 1 >= 5 THEN NOW() + INTERVAL '15 minutes'
                ELSE NULL
            END
        WHERE id = admin_record.id;
        
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid credentials'
        );
    END IF;
    
    -- Reset failed login attempts and update last login
    UPDATE public.admin_accounts 
    SET failed_login_attempts = 0,
        locked_until = NULL,
        last_login = NOW()
    WHERE id = admin_record.id;
    
    -- Return success with admin data
    RETURN json_build_object(
        'success', true,
        'admin', json_build_object(
            'id', admin_record.id,
            'username', admin_record.username,
            'email', admin_record.email,
            'role', admin_record.role
        )
    );
END;
$function$;