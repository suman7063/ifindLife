-- Fix security definer view by creating with SECURITY INVOKER instead
DROP VIEW IF EXISTS public.expert_public_profiles;

CREATE OR REPLACE VIEW public.expert_public_profiles 
WITH (security_invoker=true) AS
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
WHERE ea.status = 'approved';

-- Grant permissions for the view
GRANT SELECT ON public.expert_public_profiles TO anon, authenticated;