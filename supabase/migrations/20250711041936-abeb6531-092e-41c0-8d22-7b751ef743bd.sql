-- Fix Function Search Path Mutable warnings by adding search_path parameter

-- Update is_user_admin function to include search_path
CREATE OR REPLACE FUNCTION public.is_user_admin(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = check_user_id
  );
$$;

-- Update is_any_admin function to include search_path
CREATE OR REPLACE FUNCTION public.is_any_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
  SELECT public.is_user_admin(auth.uid());
$$;