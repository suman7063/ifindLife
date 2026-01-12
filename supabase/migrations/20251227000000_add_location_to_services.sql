-- Add location column to services table for Offline Retreats
-- This field will store the location where the retreat takes place

ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS location TEXT;

-- Add comment to explain the field
COMMENT ON COLUMN public.services.location IS 'Location where the service/retreat takes place (primarily for Offline Retreats)';

