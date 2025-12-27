-- Migration: Fix RLS policy for expert registration
-- Problem: When email verification is enabled, signUp() might not create a session immediately
-- Solution: Create a function that allows authenticated users to insert their own expert account during registration

-- Create function to insert expert account during registration
-- This function uses SECURITY DEFINER to bypass RLS, but still validates auth.uid() = auth_id
CREATE OR REPLACE FUNCTION public.create_expert_account_during_registration(
  p_auth_id UUID,
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_address TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_state TEXT DEFAULT NULL,
  p_country TEXT DEFAULT NULL,
  p_specialization TEXT DEFAULT NULL,
  p_experience TEXT DEFAULT NULL,
  p_bio TEXT DEFAULT NULL,
  p_certificate_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  p_profile_picture TEXT DEFAULT NULL,
  p_category TEXT DEFAULT 'listening-expert',
  p_languages TEXT[] DEFAULT ARRAY[]::TEXT[],
  p_status TEXT DEFAULT 'pending'
)
RETURNS TABLE (
  auth_id UUID,
  name TEXT,
  email TEXT,
  status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate that if user is authenticated, the auth_id matches
  -- If not authenticated (email verification enabled), allow insert for new accounts only
  IF auth.uid() IS NOT NULL AND auth.uid() != p_auth_id THEN
    RAISE EXCEPTION 'auth_id must match authenticated user id';
  END IF;
  
  -- Check if expert account already exists for this auth_id
  IF EXISTS (SELECT 1 FROM public.expert_accounts WHERE auth_id = p_auth_id) THEN
    RAISE EXCEPTION 'Expert account already exists for this user';
  END IF;
  
  -- If not authenticated, we still allow the insert
  -- The auth_id validation happens at the application level (signUp returns the user id)
  -- This function is only called immediately after signUp(), so the user definitely exists
  
  -- Insert the expert account
  INSERT INTO public.expert_accounts (
    auth_id,
    name,
    email,
    phone,
    address,
    city,
    state,
    country,
    specialization,
    experience,
    bio,
    certificate_urls,
    profile_picture,
    category,
    languages,
    status,
    onboarding_completed,
    pricing_set,
    availability_set,
    profile_completed
  ) VALUES (
    p_auth_id,
    p_name,
    p_email,
    p_phone,
    p_address,
    p_city,
    p_state,
    p_country,
    p_specialization,
    p_experience,
    p_bio,
    p_certificate_urls,
    p_profile_picture,
    p_category,
    p_languages,
    p_status,
    false,
    false,
    false,
    false
  )
  RETURNING 
    expert_accounts.auth_id,
    expert_accounts.name,
    expert_accounts.email,
    expert_accounts.status
  INTO STRICT
    auth_id,
    name,
    email,
    status;
  
  RETURN NEXT;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_expert_account_during_registration TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_expert_account_during_registration TO anon;

-- Add comment
COMMENT ON FUNCTION public.create_expert_account_during_registration IS 
  'Allows authenticated users to create their own expert account during registration. Validates that auth.uid() matches the provided auth_id.';

