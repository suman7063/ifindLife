-- Remove the view entirely and rely on RPC functions for admin access
-- This eliminates any potential security definer view issues

DROP VIEW IF EXISTS public.expert_public_profiles;

-- For public access to approved experts, we'll create a simple RPC function instead
-- This gives us more control over security
CREATE OR REPLACE FUNCTION public.get_approved_experts()
RETURNS TABLE (
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
SECURITY INVOKER  -- Use SECURITY INVOKER instead of DEFINER
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
  FROM expert_accounts ea
  WHERE ea.status = 'approved'
  ORDER BY ea.created_at DESC;
END;
$$;

-- Grant execute to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.get_approved_experts() TO anon, authenticated;