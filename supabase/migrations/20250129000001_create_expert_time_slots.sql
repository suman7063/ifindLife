-- Migration: Create expert_time_slots table
-- Created: 2025-01-29
-- This table stores individual time slots for expert availability

CREATE TABLE IF NOT EXISTS public.expert_time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    availability_id UUID NOT NULL REFERENCES public.expert_availabilities(id) ON DELETE CASCADE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
    specific_date DATE,
    is_booked BOOLEAN DEFAULT false,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_expert_time_slots_availability_id ON public.expert_time_slots(availability_id);
CREATE INDEX IF NOT EXISTS idx_expert_time_slots_is_booked ON public.expert_time_slots(is_booked);
CREATE INDEX IF NOT EXISTS idx_expert_time_slots_specific_date ON public.expert_time_slots(specific_date) WHERE specific_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_expert_time_slots_day_of_week ON public.expert_time_slots(day_of_week) WHERE day_of_week IS NOT NULL;

-- Add foreign key constraint for appointments.time_slot_id
-- This allows appointments to reference time slots
COMMENT ON TABLE public.expert_time_slots IS 'Stores individual time slots for expert availability, linked to expert_availabilities';

