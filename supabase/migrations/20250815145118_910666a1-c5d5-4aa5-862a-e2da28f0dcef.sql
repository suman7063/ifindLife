-- Fix security definer view issue
-- Drop and recreate expert_public_profiles view without security definer
-- This view should rely on RLS policies instead of security definer

DROP VIEW IF EXISTS public.expert_public_profiles;

-- Recreate the view as a regular view (no SECURITY DEFINER)
-- This will rely on the underlying table's RLS policies
CREATE VIEW public.expert_public_profiles AS
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
WHERE ea.status = 'approved';

-- Grant appropriate permissions
GRANT SELECT ON public.expert_public_profiles TO anon, authenticated;