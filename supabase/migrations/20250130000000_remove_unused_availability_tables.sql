-- Migration: Remove unused availability tables
-- Created: 2025-01-30
-- This migration removes expert_time_slots and expert_availability tables
-- as we're now using only expert_availabilities (simple schema)

-- Step 1: Drop foreign key constraint from appointments.time_slot_id if it exists
DO $$
BEGIN
  -- Check if foreign key constraint exists and drop it
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'appointments_time_slot_id_fkey'
    AND table_name = 'appointments'
  ) THEN
    ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_time_slot_id_fkey;
    RAISE NOTICE 'Dropped foreign key constraint: appointments_time_slot_id_fkey';
  END IF;
END $$;

-- Step 2: Drop expert_time_slots table (if exists)
-- Note: This will cascade delete any related data
DROP TABLE IF EXISTS public.expert_time_slots CASCADE;

-- Step 3: Drop expert_availability table (singular, if exists)
DROP TABLE IF EXISTS public.expert_availability CASCADE;

-- Step 4: Drop related functions that use these tables
DROP FUNCTION IF EXISTS public.query_expert_time_slots(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.query_expert_availability(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.create_expert_availability(UUID, DATE, DATE, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.create_expert_time_slot(UUID, TIME, TIME, INTEGER, DATE) CASCADE;
DROP FUNCTION IF EXISTS public.delete_expert_availability(UUID) CASCADE;

-- Step 5: Keep appointments.time_slot_id column but make it nullable (already is)
-- This allows existing data to remain but new bookings won't use it
-- No action needed as column is already nullable

COMMENT ON COLUMN public.appointments.time_slot_id IS 'Legacy field - no longer used. Kept for backward compatibility with existing appointments.';

