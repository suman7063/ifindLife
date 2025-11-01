-- Fix infinite recursion in admin_users RLS policies
-- The issue is that admin_users policies are referencing admin_users table in their expressions

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Admin users can view admin data" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view other admin users" ON public.admin_users;

-- Create a security definer function that bypasses RLS to check admin status
CREATE OR REPLACE FUNCTION public.is_user_admin(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = check_user_id
  );
$$;

-- Create non-recursive policies for admin_users
CREATE POLICY "Users can view their own admin record safely" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid() = id);

-- Update other policies that were using recursive checks
-- Fix expert_accounts policies to use the new safe function
DROP POLICY IF EXISTS "Admins can update expert accounts" ON public.expert_accounts;
DROP POLICY IF EXISTS "Admins can view all expert accounts" ON public.expert_accounts;

CREATE POLICY "Admins can update expert accounts safely" 
ON public.expert_accounts 
FOR UPDATE 
USING (public.is_user_admin());

CREATE POLICY "Admins can view all expert accounts safely" 
ON public.expert_accounts 
FOR SELECT 
USING (public.is_user_admin());

-- Update is_any_admin function to use the safe approach
CREATE OR REPLACE FUNCTION public.is_any_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT public.is_user_admin(auth.uid());
$$;