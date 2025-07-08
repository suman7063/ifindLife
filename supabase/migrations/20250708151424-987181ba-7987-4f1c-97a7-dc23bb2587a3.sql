-- Check existing RLS policies on users table and fix potential issues
-- The 406 error suggests RLS is blocking the query even for authenticated users

-- First, let's see what policies exist
\dp public.users;

-- Create a policy that allows users to view their own data and allow service role to read
-- This should fix the 406 error when querying user profiles
DROP POLICY IF EXISTS "Users can view own data" ON public.users;

CREATE POLICY "Users can view own data" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Also ensure that authenticated users can see basic user info when needed
-- This is often needed for expert dashboards to reference user data
CREATE POLICY "Allow service role full access to users" 
ON public.users 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Make sure we have proper policies for expert_accounts table as well
-- Ensure experts can read their own accounts
CREATE POLICY IF NOT EXISTS "Experts can view their own account data" 
ON public.expert_accounts 
FOR SELECT 
USING (auth_id = auth.uid());

-- Ensure experts can update their own accounts
CREATE POLICY IF NOT EXISTS "Experts can update their own account data" 
ON public.expert_accounts 
FOR UPDATE 
USING (auth_id = auth.uid()) 
WITH CHECK (auth_id = auth.uid());

-- Also fix any potential issues with availability tables
-- Ensure the correct RLS policies exist for expert availability management
CREATE POLICY IF NOT EXISTS "Experts can manage their availabilities" 
ON public.expert_availabilities 
FOR ALL 
USING (expert_id::text = auth.uid()::text) 
WITH CHECK (expert_id::text = auth.uid()::text);