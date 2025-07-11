-- Update appointments table to support call integration
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS channel_name TEXT,
ADD COLUMN IF NOT EXISTS token TEXT;

-- Create index for faster channel name lookups
CREATE INDEX IF NOT EXISTS idx_appointments_channel_name ON public.appointments(channel_name);

-- Update call_sessions table to link with appointments
ALTER TABLE public.call_sessions
ADD COLUMN IF NOT EXISTS appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL;

-- Create index for appointment_id lookups
CREATE INDEX IF NOT EXISTS idx_call_sessions_appointment_id ON public.call_sessions(appointment_id);