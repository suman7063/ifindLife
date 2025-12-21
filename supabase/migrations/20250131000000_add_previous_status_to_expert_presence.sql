-- Migration: Add previous_status column to expert_presence table
-- This stores the status before it was auto-set to 'busy' due to active booking
-- Allows auto-revert after booking ends, even after page refresh

-- Add previous_status column to expert_presence table
ALTER TABLE public.expert_presence
ADD COLUMN IF NOT EXISTS previous_status TEXT CHECK (previous_status = ANY (ARRAY['available', 'busy', 'away', 'offline']));

-- Add comment to explain the column
COMMENT ON COLUMN public.expert_presence.previous_status IS 'Stores the status before it was auto-set to busy due to active booking. Used for auto-revert functionality.';

