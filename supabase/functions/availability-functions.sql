
-- Function to query expert availability
CREATE OR REPLACE FUNCTION public.query_expert_availability(expert_id_param UUID)
RETURNS SETOF public.expert_availability
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.expert_availability 
  WHERE expert_id = expert_id_param
  ORDER BY start_date DESC;
$$;

-- Function to query time slots for an availability
CREATE OR REPLACE FUNCTION public.query_expert_time_slots(availability_id_param UUID)
RETURNS SETOF public.expert_time_slots
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.expert_time_slots 
  WHERE availability_id = availability_id_param
  ORDER BY start_time ASC;
$$;

-- Function to create an expert availability record
CREATE OR REPLACE FUNCTION public.create_expert_availability(
  p_expert_id UUID,
  p_start_date DATE,
  p_end_date DATE,
  p_availability_type TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.expert_availability(
    expert_id,
    start_date,
    end_date,
    availability_type
  ) VALUES (
    p_expert_id,
    p_start_date,
    p_end_date,
    p_availability_type
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Function to create a time slot
CREATE OR REPLACE FUNCTION public.create_expert_time_slot(
  p_availability_id UUID,
  p_start_time TIME,
  p_end_time TIME,
  p_day_of_week INTEGER DEFAULT NULL,
  p_specific_date DATE DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.expert_time_slots(
    availability_id,
    day_of_week,
    specific_date,
    start_time,
    end_time
  ) VALUES (
    p_availability_id,
    p_day_of_week,
    p_specific_date,
    p_start_time,
    p_end_time
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Function to delete an availability and its time slots
CREATE OR REPLACE FUNCTION public.delete_expert_availability(availability_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete time slots (will be cascaded automatically)
  DELETE FROM public.expert_availability
  WHERE id = availability_id_param;
  
  RETURN FOUND;
END;
$$;

-- Function to create an appointment
CREATE OR REPLACE FUNCTION public.create_appointment(
  p_expert_id UUID,
  p_user_id UUID,
  p_appointment_date DATE,
  p_start_time TIME,
  p_end_time TIME,
  p_time_slot_id UUID DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
  expert_name_val TEXT;
BEGIN
  -- Get expert name
  SELECT name INTO expert_name_val
  FROM public.experts
  WHERE id = p_expert_id;
  
  -- Insert appointment
  INSERT INTO public.appointments(
    expert_id,
    user_id,
    appointment_date,
    start_time,
    end_time,
    time_slot_id,
    notes,
    status,
    expert_name
  ) VALUES (
    p_expert_id,
    p_user_id,
    p_appointment_date,
    p_start_time,
    p_end_time,
    p_time_slot_id,
    p_notes,
    'pending',
    expert_name_val
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Function to update appointment status
CREATE OR REPLACE FUNCTION public.update_appointment_status(
  p_appointment_id UUID,
  p_status TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.appointments
  SET 
    status = p_status,
    updated_at = NOW()
  WHERE id = p_appointment_id;
  
  RETURN FOUND;
END;
$$;
