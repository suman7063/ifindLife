-- Fix RLS policies to resolve 406 errors and ensure proper access to expert availabilities
-- This migration addresses the issues causing 406 errors when accessing user profiles
-- and 403 errors when accessing expert availabilities

-- 1. Fix the users table RLS policies
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Allow service role full access to users" ON public.users;

-- Create a more permissive policy for users to view their own data
CREATE POLICY "Users can view their own profile data" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Allow service role to have full access for system operations
CREATE POLICY "Service role can manage users" 
ON public.users 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- 2. Fix the expert_availabilities table RLS policies
DROP POLICY IF EXISTS "Experts can manage their availabilities" ON public.expert_availabilities;
DROP POLICY IF EXISTS "Experts can manage their own availabilities" ON public.expert_availabilities;
DROP POLICY IF EXISTS "Experts can create their own availabilities" ON public.expert_availabilities;
DROP POLICY IF EXISTS "Experts can view their own availabilities" ON public.expert_availabilities;
DROP POLICY IF EXISTS "Experts can update their own availabilities" ON public.expert_availabilities;
DROP POLICY IF EXISTS "Experts can delete their own availabilities" ON public.expert_availabilities;
DROP POLICY IF EXISTS "Users can view expert availabilities" ON public.expert_availabilities;

-- Create comprehensive policies for expert availability management
CREATE POLICY "Experts can manage their own availabilities" 
ON public.expert_availabilities 
FOR ALL 
USING (expert_id = auth.uid()::text) 
WITH CHECK (expert_id = auth.uid()::text);

-- Allow users to view expert availabilities for booking purposes
CREATE POLICY "Users can view expert availabilities for booking" 
ON public.expert_availabilities 
FOR SELECT 
USING (true);

-- 3. Fix the expert_time_slots table RLS policies
DROP POLICY IF EXISTS "Experts can manage their own time slots" ON public.expert_time_slots;
DROP POLICY IF EXISTS "Anyone can view expert time slots" ON public.expert_time_slots;

-- Create policy for experts to manage their time slots
CREATE POLICY "Experts can manage their time slots" 
ON public.expert_time_slots 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.expert_availabilities 
  WHERE expert_availabilities.id = expert_time_slots.availability_id 
  AND expert_availabilities.expert_id = auth.uid()::text
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.expert_availabilities 
  WHERE expert_availabilities.id = expert_time_slots.availability_id 
  AND expert_availabilities.expert_id = auth.uid()::text
));

-- Allow users to view time slots for booking
CREATE POLICY "Users can view time slots for booking" 
ON public.expert_time_slots 
FOR SELECT 
USING (true);

-- 4. Ensure expert_accounts table has correct policies
DROP POLICY IF EXISTS "Experts can view their own account data" ON public.expert_accounts;
DROP POLICY IF EXISTS "Experts can update their own account data" ON public.expert_accounts;

-- Recreate expert account policies with proper checks
CREATE POLICY "Experts can view their own account data" 
ON public.expert_accounts 
FOR SELECT 
USING (auth_id = auth.uid());

CREATE POLICY "Experts can update their own account data" 
ON public.expert_accounts 
FOR UPDATE 
USING (auth_id = auth.uid()) 
WITH CHECK (auth_id = auth.uid());

-- 5. Add helpful indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expert_availabilities_expert_id ON public.expert_availabilities(expert_id);
CREATE INDEX IF NOT EXISTS idx_expert_time_slots_availability_id ON public.expert_time_slots(availability_id);
CREATE INDEX IF NOT EXISTS idx_expert_accounts_auth_id ON public.expert_accounts(auth_id);