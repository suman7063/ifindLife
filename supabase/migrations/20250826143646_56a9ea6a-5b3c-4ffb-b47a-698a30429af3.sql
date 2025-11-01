-- Create RPC to fetch a public expert profile by auth_id for approved experts
CREATE OR REPLACE FUNCTION public.get_public_expert_profile(p_auth_id uuid)
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
  status text,
  address text,
  city text,
  state text,
  country text,
  average_rating numeric,
  reviews_count integer,
  verified boolean,
  languages text[],
  selected_services integer[],
  category text,
  created_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ea.id,
    ea.auth_id,
    ea.name,
    ea.email,
    ea.phone,
    ea.bio,
    ea.specialization,
    ea.experience,
    ea.profile_picture,
    ea.status,
    ea.address,
    ea.city,
    ea.state,
    ea.country,
    ea.average_rating,
    ea.reviews_count,
    ea.verified,
    ea.languages,
    ea.selected_services,
    ea.category,
    ea.created_at
  FROM public.expert_accounts ea
  WHERE ea.status = 'approved' AND ea.auth_id = p_auth_id
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';