-- Ensure appointments table has all required fields for Agora integration
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS channel_name TEXT,
ADD COLUMN IF NOT EXISTS token TEXT;