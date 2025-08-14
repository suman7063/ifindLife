-- Fix the expert_public_profiles view to work with anonymous users
DROP VIEW IF EXISTS public.expert_public_profiles;

CREATE VIEW public.expert_public_profiles 
AS
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

-- Grant explicit permissions for the view
GRANT SELECT ON public.expert_public_profiles TO anon, authenticated;

-- Enable RLS on the view
ALTER VIEW public.expert_public_profiles SET (security_barrier = false);

-- Create RLS policy for public access to approved experts
CREATE POLICY "Public can view approved experts" 
ON public.expert_public_profiles 
FOR SELECT 
USING (true);