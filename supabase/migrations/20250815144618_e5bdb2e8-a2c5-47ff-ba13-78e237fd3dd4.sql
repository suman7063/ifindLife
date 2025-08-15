-- Create admin RPCs that bypass RLS safely using SECURITY DEFINER
-- Approved experts
CREATE OR REPLACE FUNCTION public.admin_list_approved_experts()
RETURNS SETOF public.expert_accounts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.expert_accounts
  WHERE status = 'approved'
  ORDER BY created_at DESC;
END;
$$;

-- Pending experts
CREATE OR REPLACE FUNCTION public.admin_list_pending_experts()
RETURNS SETOF public.expert_accounts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.expert_accounts
  WHERE status = 'pending'
  ORDER BY created_at DESC;
END;
$$;

-- All users for admin listing
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS SETOF public.users
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.users
  ORDER BY created_at DESC;
END;
$$;

-- Grant execute to anon so frontend can call; function runs with definer rights
GRANT EXECUTE ON FUNCTION public.admin_list_approved_experts() TO anon;
GRANT EXECUTE ON FUNCTION public.admin_list_pending_experts() TO anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users() TO anon;