-- Add reminder_sent field to appointments table if it doesn't exist
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false;