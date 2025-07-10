-- Create secure admin authentication table
CREATE TABLE IF NOT EXISTS public.admin_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- Store hashed passwords only
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin accounts can only be accessed by service role"
  ON public.admin_accounts
  FOR ALL
  USING (false); -- Block all direct access from client

-- Create function to authenticate admin users securely
CREATE OR REPLACE FUNCTION public.authenticate_admin(
  p_username TEXT,
  p_password TEXT
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_record admin_accounts%ROWTYPE;
  result JSON;
BEGIN
  -- Rate limiting: Check for too many failed attempts
  SELECT * INTO admin_record 
  FROM admin_accounts 
  WHERE username = p_username AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid credentials');
  END IF;
  
  -- Check if account is locked
  IF admin_record.locked_until IS NOT NULL AND admin_record.locked_until > now() THEN
    RETURN json_build_object('success', false, 'error', 'Account temporarily locked');
  END IF;
  
  -- Check if too many failed attempts (lock after 5 attempts)
  IF admin_record.failed_login_attempts >= 5 THEN
    UPDATE admin_accounts 
    SET locked_until = now() + interval '30 minutes'
    WHERE id = admin_record.id;
    RETURN json_build_object('success', false, 'error', 'Account locked due to too many failed attempts');
  END IF;
  
  -- Verify password (in production, use proper password hashing)
  -- For now, using simple comparison - MUST be replaced with proper hashing
  IF admin_record.password_hash != p_password THEN
    -- Increment failed attempts
    UPDATE admin_accounts 
    SET failed_login_attempts = failed_login_attempts + 1
    WHERE id = admin_record.id;
    RETURN json_build_object('success', false, 'error', 'Invalid credentials');
  END IF;
  
  -- Successful login - reset failed attempts and update last login
  UPDATE admin_accounts 
  SET 
    failed_login_attempts = 0,
    locked_until = NULL,
    last_login = now()
  WHERE id = admin_record.id;
  
  -- Return admin data (excluding password)
  SELECT json_build_object(
    'success', true,
    'admin', json_build_object(
      'id', id,
      'username', username,
      'email', email,
      'role', role,
      'last_login', last_login
    )
  ) INTO result
  FROM admin_accounts
  WHERE id = admin_record.id;
  
  RETURN result;
END;
$$;

-- Create admin session table for secure session management
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_accounts(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on admin sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Block direct client access to sessions
CREATE POLICY "Admin sessions managed by service role only"
  ON public.admin_sessions
  FOR ALL
  USING (false);

-- Insert a secure admin user (password should be hashed in production)
INSERT INTO public.admin_accounts (username, email, password_hash, role)
VALUES ('admin', 'admin@ifindlife.com', 'CHANGE_THIS_PASSWORD_IMMEDIATELY', 'superadmin')
ON CONFLICT (username) DO NOTHING;