-- Migration: Add start_date and end_date to expert_availabilities
-- Created: 2025-12-15
-- This migration adds date range columns to support availability date ranges

-- Add start_date and end_date columns to expert_availabilities table
ALTER TABLE public.expert_availabilities 
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Set default values for existing records (today to 1 year from now)
UPDATE public.expert_availabilities 
SET 
  start_date = CURRENT_DATE,
  end_date = CURRENT_DATE + INTERVAL '1 year'
WHERE start_date IS NULL OR end_date IS NULL;

-- Add comments
COMMENT ON COLUMN public.expert_availabilities.start_date IS 'Start date of availability period. Used with day_of_week to determine when slots are available.';
COMMENT ON COLUMN public.expert_availabilities.end_date IS 'End date of availability period. Used with day_of_week to determine when slots are available.';

