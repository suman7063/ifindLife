-- Create a proper admin account table structure
CREATE TABLE IF NOT EXISTS admin_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable pgcrypto extension for password hashing if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert a test admin account with encrypted password
INSERT INTO admin_accounts (username, email, password_hash, role) 
VALUES ('admin', 'admin@test.com', crypt('admin123', gen_salt('bf')), 'superadmin')
ON CONFLICT (username) DO NOTHING;

-- Create RLS policies for admin_accounts
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage admin accounts" ON admin_accounts
FOR ALL USING (auth.role() = 'service_role');

-- Update the authenticate_admin function to use admin_accounts table
DROP FUNCTION IF EXISTS authenticate_admin(text, text);

CREATE OR REPLACE FUNCTION authenticate_admin(p_username text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    admin_record RECORD;
    result JSON;
BEGIN
    -- Check if admin exists and is active
    SELECT id, username, email, role, password_hash, is_active, failed_login_attempts, locked_until
    INTO admin_record
    FROM admin_accounts
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
        UPDATE admin_accounts 
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
    UPDATE admin_accounts 
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
$$;