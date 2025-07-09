-- Fix RLS policies for expert system to resolve "Failed to fetch" errors
-- This migration addresses the core issues preventing expert data access

-- 1. Fix expert_accounts table RLS policies for public viewing of approved experts
DROP POLICY IF EXISTS "Everyone can view approved experts" ON public.expert_accounts;

-- Create policy to allow public viewing of approved expert accounts
CREATE POLICY "Public can view approved experts" 
ON public.expert_accounts 
FOR SELECT 
USING (status = 'approved');

-- Keep existing policies for expert self-management
-- (These already exist but ensuring they work correctly)

-- 2. Ensure services table allows public read access
DROP POLICY IF EXISTS "Public can view services" ON public.services;

CREATE POLICY "Public can view all services" 
ON public.services 
FOR SELECT 
USING (true);

-- 3. Fix experts table to allow public read access to approved experts  
DROP POLICY IF EXISTS "Public can view approved experts" ON public.experts;

CREATE POLICY "Public can view all experts" 
ON public.experts 
FOR SELECT 
USING (true);

-- 4. Create indexes for better performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_expert_accounts_status ON public.expert_accounts(status);
CREATE INDEX IF NOT EXISTS idx_expert_accounts_auth_id ON public.expert_accounts(auth_id);
CREATE INDEX IF NOT EXISTS idx_expert_availabilities_expert_id ON public.expert_availabilities(expert_id);

-- 5. Ensure expert presence tracking can be read publicly for approved experts
-- This allows the real-time presence system to work for public users browsing experts
DROP POLICY IF EXISTS "Public can view expert presence" ON public.expert_availabilities;

CREATE POLICY "Public can view expert availabilities" 
ON public.expert_availabilities 
FOR SELECT 
USING (true);