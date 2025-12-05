-- Migration: Fix get_public_expert_profile function
-- This function was referencing the removed selected_services column
-- We need to update it to fetch services from expert_service_specializations table

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.get_public_expert_profile(uuid);
DROP FUNCTION IF EXISTS public.get_public_expert_profile(text);

-- Recreate the function to fetch services from expert_service_specializations
-- Support both UUID and text input for compatibility
CREATE OR REPLACE FUNCTION public.get_public_expert_profile(p_auth_id text)
RETURNS TABLE(
  id uuid,
  auth_id uuid,
  name text,
  email text,
  phone text,
  bio text,
  specialization text,
  experience text,
  profile_picture text,
  address text,
  city text,
  state text,
  country text,
  average_rating numeric,
  reviews_count integer,
  verified boolean,
  status text,
  category text,
  languages text[],
  created_at timestamptz,
  selected_services text[],
  certificate_urls text[]
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ea.auth_id AS id,
    ea.auth_id,
    ea.name,
    ea.email,
    ea.phone,
    ea.bio,
    ea.specialization,
    ea.experience,
    ea.profile_picture,
    ea.address,
    ea.city,
    ea.state,
    ea.country,
    COALESCE(ea.average_rating, 0) AS average_rating,
    COALESCE(ea.reviews_count, 0) AS reviews_count,
    COALESCE(ea.verified, false) AS verified,
    ea.status,
    ea.category,
    COALESCE(ea.languages, ARRAY[]::text[]) AS languages,
    ea.created_at,
    -- Get services from expert_service_specializations table
    -- Return as text array since service_id is UUID
    COALESCE(
      ARRAY(
        SELECT ess.service_id::text
        FROM public.expert_service_specializations ess
        WHERE ess.expert_id = ea.auth_id
        AND ess.is_available = true
        ORDER BY ess.is_primary_service DESC, ess.created_at ASC
      ),
      ARRAY[]::text[]
    ) AS selected_services,
    COALESCE(ea.certificate_urls, ARRAY[]::text[]) AS certificate_urls
  FROM public.expert_accounts ea
  WHERE ea.auth_id = p_auth_id::uuid
    AND ea.status = 'approved';
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_public_expert_profile(text) TO anon, authenticated;

