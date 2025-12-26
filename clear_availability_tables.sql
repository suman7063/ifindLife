-- Script to clear all availability data for fresh testing
-- Run this in Supabase SQL Editor
-- This clears the main expert_availabilities table (TIME-WISE approach)

-- Clear expert_availabilities table (main table for time-wise approach)
-- This table stores time ranges (e.g., Monday 9:00-17:00)
-- Each row = one day + time range (not individual slots)
DELETE FROM public.expert_availabilities;

-- Reset availability_set flag for all experts (optional)
-- Uncomment if you want to reset the flag
-- UPDATE public.expert_accounts SET availability_set = false;

-- Verify table is empty
SELECT 
  'expert_availabilities' as table_name,
  COUNT(*) as row_count,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ Table is empty - ready for fresh test'
    ELSE '⚠️ Table still has ' || COUNT(*) || ' rows'
  END as status
FROM public.expert_availabilities;

-- Show summary
DO $$
DECLARE
  row_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO row_count FROM public.expert_availabilities;
  
  IF row_count = 0 THEN
    RAISE NOTICE '✅ All availability data cleared successfully!';
    RAISE NOTICE '📝 You can now test with fresh data using TIME-WISE approach.';
    RAISE NOTICE '💡 Remember: Time ranges (9:00-17:00) will be stored, not individual 30-min slots.';
  ELSE
    RAISE WARNING '⚠️ Table still has % rows. Check for foreign key constraints.', row_count;
  END IF;
END $$;

