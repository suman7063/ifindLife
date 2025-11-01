-- 1) Create a restricted public view exposing only non-sensitive fields for approved experts
CREATE OR REPLACE VIEW public.expert_public_profiles AS
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

-- 2) Drop overly-permissive policy that allowed public SELECT on full expert_accounts rows
DROP POLICY IF EXISTS "Public can view approved experts" ON public.expert_accounts;

-- 3) Ensure anon/authenticated can read from the new restricted view only
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.expert_public_profiles TO anon, authenticated;