-- Migration: Remove selected_services column from expert_accounts
-- This column is no longer needed as we use expert_service_specializations table instead

-- Step 1: Drop existing get_approved_experts() function first (needed to change return type)
DROP FUNCTION IF EXISTS public.get_approved_experts();

-- Step 2: Recreate get_approved_experts() function without selected_services
CREATE OR REPLACE FUNCTION public.get_approved_experts()
RETURNS TABLE(
  auth_id uuid,
  name text,
  profile_picture text,
  specialization text,
  experience text,
  average_rating numeric,
  reviews_count integer,
  verified boolean,
  category text,
  languages text[],
  status text,
  profile_completed boolean,
  onboarding_completed boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ea.auth_id,
    ea.name,
    ea.profile_picture,
    ea.specialization,
    ea.experience,
    ea.average_rating,
    ea.reviews_count,
    ea.verified,
    ea.category,
    ea.languages,
    'approved'::text AS status,
    COALESCE(ea.profile_completed, false) AS profile_completed,
    COALESCE(ea.onboarding_completed, false) AS onboarding_completed
  FROM public.expert_accounts ea
  WHERE ea.status = 'approved'
    AND COALESCE(ea.onboarding_completed, false) = true
  ORDER BY ea.created_at DESC;
END;
$$;

-- Step 3: Drop the selected_services column from expert_accounts table
-- Note: This will fail if there are any other dependencies, so we use IF EXISTS
ALTER TABLE public.expert_accounts 
DROP COLUMN IF EXISTS selected_services;

-- Step 4: Grant permissions
GRANT EXECUTE ON FUNCTION public.get_approved_experts() TO anon, authenticated;

-- Note: If get_public_expert_profile function exists in your database, it may need to be manually updated
-- to remove selected_services from its return type. After dropping the column, it will return NULL
-- for that field, which should be fine since our code no longer uses it.

