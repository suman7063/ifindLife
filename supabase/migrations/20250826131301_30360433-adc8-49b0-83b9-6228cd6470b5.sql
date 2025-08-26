-- Add timezone column to expert_availabilities table
ALTER TABLE public.expert_availabilities 
ADD COLUMN timezone text DEFAULT 'UTC';

-- Add timezone column to expert_time_slots table for timezone-aware booking
ALTER TABLE public.expert_time_slots 
ADD COLUMN timezone text DEFAULT 'UTC';

-- Add unique constraint to prevent duplicate time slots
ALTER TABLE public.expert_time_slots 
ADD CONSTRAINT unique_expert_time_slot 
UNIQUE (availability_id, start_time, end_time, day_of_week, specific_date);

-- Create function to check for overlapping time slots
CREATE OR REPLACE FUNCTION public.check_time_slot_overlap(
  p_availability_id uuid,
  p_start_time time,
  p_end_time time,
  p_day_of_week integer DEFAULT NULL,
  p_specific_date date DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  overlap_count integer;
BEGIN
  -- Check for overlapping slots in the same availability period
  SELECT COUNT(*) INTO overlap_count
  FROM public.expert_time_slots
  WHERE availability_id = p_availability_id
    AND (
      (p_day_of_week IS NOT NULL AND day_of_week = p_day_of_week) OR
      (p_specific_date IS NOT NULL AND specific_date = p_specific_date)
    )
    AND (
      (start_time <= p_start_time AND end_time > p_start_time) OR
      (start_time < p_end_time AND end_time >= p_end_time) OR
      (start_time >= p_start_time AND end_time <= p_end_time)
    );
  
  RETURN overlap_count > 0;
END;
$$;