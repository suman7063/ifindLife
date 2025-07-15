-- Create a test admin account with a known password for testing
-- Password will be 'admin123' (hashed with bcrypt)
INSERT INTO public.admin_accounts (username, email, password_hash, role, is_active)
VALUES (
  'testadmin',
  'test@admin.com', 
  crypt('admin123', gen_salt('bf')),
  'superadmin',
  true
)
ON CONFLICT (username) DO UPDATE SET
  password_hash = crypt('admin123', gen_salt('bf')),
  is_active = true,
  failed_login_attempts = 0,
  locked_until = NULL;