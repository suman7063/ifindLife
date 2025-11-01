-- Create the authenticate_admin function
CREATE OR REPLACE FUNCTION authenticate_admin(p_username TEXT, p_password TEXT)
RETURNS JSON AS $$
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
    
    -- Verify password (using crypt function for bcrypt)
    SELECT (admin_record.password_hash = crypt(p_password, admin_record.password_hash)) INTO is_valid;
    
    IF is_valid THEN
        -- Update last login and reset failed attempts
        UPDATE admin_accounts 
        SET 
            last_login = NOW(),
            failed_login_attempts = 0,
            locked_until = NULL
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
            END
        WHERE id = admin_record.id;
        
        RETURN json_build_object('success', false, 'error', 'Invalid credentials');
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;