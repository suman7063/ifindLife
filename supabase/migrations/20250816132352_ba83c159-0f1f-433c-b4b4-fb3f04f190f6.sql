-- Make get_approved_experts callable by anon by safely bypassing RLS
-- Recreate the function as SECURITY DEFINER (view was removed earlier due to linter issue)
-- This function only exposes approved experts and selected safe columns

-- Drop existing function to ensure we can set SECURITY DEFINER
DROP FUNCTION IF EXISTS public.get_approved_experts();

CREATE OR REPLACE FUNCTION public.get_approved_experts()
RETURNS TABLE(
  id uuid,
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
  selected_services integer[],
  status text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ea.id,
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
    ea.selected_services,
    'approved'::text AS status
  FROM public.expert_accounts ea
  WHERE ea.status = 'approved'
  ORDER BY ea.created_at DESC;
END;
$$;

-- Grant execute to public roles (anon + authenticated)
GRANT EXECUTE ON FUNCTION public.get_approved_experts() TO anon, authenticated;