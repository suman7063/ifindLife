
-- Create expert_availability table
CREATE TABLE IF NOT EXISTS public.expert_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID NOT NULL REFERENCES public.experts(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.expert_availability ENABLE ROW LEVEL SECURITY;

-- Allow experts to view their own availability
CREATE POLICY "Experts can view their own availability" 
ON public.expert_availability 
FOR SELECT 
USING (auth.uid()::text = expert_id::text);

-- Allow experts to create their own availability
CREATE POLICY "Experts can create their own availability" 
ON public.expert_availability 
FOR INSERT 
WITH CHECK (auth.uid()::text = expert_id::text);

-- Allow experts to update their own availability
CREATE POLICY "Experts can update their own availability" 
ON public.expert_availability 
FOR UPDATE 
USING (auth.uid()::text = expert_id::text);

-- Allow experts to delete their own availability
CREATE POLICY "Experts can delete their own availability" 
ON public.expert_availability 
FOR DELETE 
USING (auth.uid()::text = expert_id::text);

-- Allow all users to view expert availability (for booking)
CREATE POLICY "All users can view expert availability" 
ON public.expert_availability 
FOR SELECT 
USING (true);

-- Update appointments table with new fields
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS price NUMERIC,
ADD COLUMN IF NOT EXISTS currency TEXT,
ADD COLUMN IF NOT EXISTS extension_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS actual_duration INTEGER,
ADD COLUMN IF NOT EXISTS refunded BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS calendar_event_id TEXT;
