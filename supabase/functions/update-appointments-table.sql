
-- Add missing fields to appointments table if they don't exist
DO $$
BEGIN
  -- Add start_time if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'appointments' 
    AND column_name = 'start_time'
  ) THEN
    ALTER TABLE public.appointments ADD COLUMN start_time TIME;
  END IF;
  
  -- Add end_time if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'appointments' 
    AND column_name = 'end_time'
  ) THEN
    ALTER TABLE public.appointments ADD COLUMN end_time TIME;
  END IF;
  
  -- Add time_slot_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'appointments' 
    AND column_name = 'time_slot_id'
  ) THEN
    ALTER TABLE public.appointments ADD COLUMN time_slot_id UUID REFERENCES public.expert_time_slots(id);
  END IF;
  
  -- Add google_calendar_event_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'appointments' 
    AND column_name = 'google_calendar_event_id'
  ) THEN
    ALTER TABLE public.appointments ADD COLUMN google_calendar_event_id TEXT;
  END IF;
  
  -- Add user_calendar_event_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'appointments' 
    AND column_name = 'user_calendar_event_id'
  ) THEN
    ALTER TABLE public.appointments ADD COLUMN user_calendar_event_id TEXT;
  END IF;
  
  -- Add updated_at if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'appointments' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.appointments ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;
END $$;
