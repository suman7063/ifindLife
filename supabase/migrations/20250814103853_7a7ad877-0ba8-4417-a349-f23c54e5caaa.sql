-- Fix admin access to expert_accounts and users tables

-- Update RLS policies for expert_accounts to allow admin access for all operations
DROP POLICY IF EXISTS "Admins can view all expert accounts safely" ON public.expert_accounts;
DROP POLICY IF EXISTS "Admins can update expert accounts safely" ON public.expert_accounts;

-- Create comprehensive admin policies for expert_accounts
CREATE POLICY "Admins can manage all expert accounts"
ON public.expert_accounts
FOR ALL
TO authenticated
USING (is_any_admin())
WITH CHECK (is_any_admin());

-- Update RLS policies for users table to allow admin access
DROP POLICY IF EXISTS "Service role can manage users" ON public.users;

-- Create admin policies for users table  
CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
TO authenticated
USING (is_any_admin());

CREATE POLICY "Admins can update users"
ON public.users
FOR UPDATE
TO authenticated
USING (is_any_admin())
WITH CHECK (is_any_admin());

CREATE POLICY "Admins can delete users"
ON public.users
FOR DELETE
TO authenticated
USING (is_any_admin());

-- Keep service role access for system operations
CREATE POLICY "Service role can manage users"
ON public.users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);