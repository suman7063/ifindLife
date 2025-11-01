-- First check if there are any existing admin users
DO $$
BEGIN
  -- If the table is empty, insert a default admin user with a proper UUID
  IF NOT EXISTS (SELECT 1 FROM public.admin_users LIMIT 1) THEN
    INSERT INTO public.admin_users (id, role) 
    VALUES (gen_random_uuid(), 'superadmin');
  END IF;
END $$;

-- Also create a mapping table for text-based admin IDs
CREATE TABLE IF NOT EXISTS public.admin_credentials (
  admin_id TEXT PRIMARY KEY,
  user_uuid UUID REFERENCES public.admin_users(id),
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert mapping for the text-based admin ID
INSERT INTO public.admin_credentials (admin_id, user_uuid, password_hash)
SELECT 'iflsuperadmin', id, 'IFLadmin2024'
FROM public.admin_users 
WHERE role = 'superadmin' 
LIMIT 1
ON CONFLICT (admin_id) DO NOTHING;