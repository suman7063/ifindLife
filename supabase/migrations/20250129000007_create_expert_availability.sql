-- Migration: Create expert_availability table (singular)
-- Created: 2025-01-29
-- This table stores availability periods for experts (different from expert_availabilities)
-- Used by availability-functions.sql

CREATE TABLE IF NOT EXISTS public.expert_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES public.expert_accounts(auth_id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    availability_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT expert_availability_date_range CHECK (end_date >= start_date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_expert_availability_expert_id ON public.expert_availability(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_availability_dates ON public.expert_availability(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_expert_availability_type ON public.expert_availability(availability_type);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_expert_availability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_expert_availability_updated_at
    BEFORE UPDATE ON public.expert_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_expert_availability_updated_at();

COMMENT ON TABLE public.expert_availability IS 'Stores availability periods for experts with date ranges and type (different from expert_availabilities which stores weekly patterns)';

