-- Make admin expert listing usable from the admin UI without relying on Supabase auth session
-- 1) Grant EXECUTE on existing admin RPCs
GRANT EXECUTE ON FUNCTION public.admin_list_pending_experts() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_approved_experts() TO anon, authenticated;

-- 2) Create an RPC that returns all experts (any status), ordered by created_at desc
DROP FUNCTION IF EXISTS public.admin_list_all_experts();
CREATE OR REPLACE FUNCTION public.admin_list_all_experts()
RETURNS SETOF expert_accounts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.expert_accounts
  ORDER BY created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_all_experts() TO anon, authenticated;