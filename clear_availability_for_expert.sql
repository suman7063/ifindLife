-- Script to clear availability for a specific expert
-- Usage: Replace 'YOUR_EXPERT_AUTH_ID' with actual expert auth_id UUID
-- Example: WHERE expert_id = '123e4567-e89b-12d3-a456-426614174000'

-- Option 1: Using variable (for psql)
-- \set expert_auth_id 'YOUR_EXPERT_AUTH_ID'
-- DELETE FROM public.expert_availabilities WHERE expert_id = :'expert_auth_id';

-- Option 2: Direct query (for Supabase SQL Editor)
-- Replace the UUID below with your expert's auth_id
DELETE FROM public.expert_availabilities 
WHERE expert_id = 'YOUR_EXPERT_AUTH_ID_HERE';

-- Reset availability_set flag for this expert
UPDATE public.expert_accounts 
SET availability_set = false 
WHERE auth_id = 'YOUR_EXPERT_AUTH_ID_HERE';

-- Verify deletion
SELECT 
  expert_id,
  COUNT(*) as remaining_time_ranges,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ All cleared'
    ELSE '⚠️ Still has data'
  END as status
FROM public.expert_availabilities
WHERE expert_id = 'YOUR_EXPERT_AUTH_ID_HERE'
GROUP BY expert_id;

-- Success message
DO $$
DECLARE
  row_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO row_count 
  FROM public.expert_availabilities 
  WHERE expert_id = 'YOUR_EXPERT_AUTH_ID_HERE';
  
  IF row_count = 0 THEN
    RAISE NOTICE '✅ Availability cleared for expert successfully!';
    RAISE NOTICE '📝 Expert can now set fresh availability using TIME-WISE approach.';
  ELSE
    RAISE WARNING '⚠️ Expert still has % time ranges. Check the expert_id.', row_count;
  END IF;
END $$;

