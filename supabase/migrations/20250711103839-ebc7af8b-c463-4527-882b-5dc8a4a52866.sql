-- Remove emergency contact fields from users table
ALTER TABLE public.users DROP COLUMN IF EXISTS emergency_contact_name;
ALTER TABLE public.users DROP COLUMN IF EXISTS emergency_contact_phone;