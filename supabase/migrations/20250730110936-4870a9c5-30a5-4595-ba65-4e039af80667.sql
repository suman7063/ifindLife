-- Create admin_accounts table for the admin authentication edge function
CREATE TABLE public.admin_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows the service role to access admin accounts
-- This is needed for the edge function to authenticate admins
CREATE POLICY "Service role can manage admin accounts" ON public.admin_accounts
FOR ALL USING (auth.role() = 'service_role');

-- Insert a test admin user with encrypted password
-- Username: admin, Password: admin123456
INSERT INTO public.admin_accounts (username, password_hash, role) 
VALUES ('admin', crypt('admin123456', gen_salt('bf')), 'admin');

-- Create function to authenticate admin (used by edge function)
CREATE OR REPLACE FUNCTION public.authenticate_admin(input_username TEXT, input_password TEXT)
RETURNS TABLE(id UUID, username TEXT, role TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.username, a.role
  FROM public.admin_accounts a
  WHERE a.username = input_username 
    AND a.password_hash = crypt(input_password, a.password_hash)
    AND a.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;