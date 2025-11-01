-- Fix RLS policies for expert_category_services table to allow admin access
-- The current policy prevents admins from inserting/updating service assignments

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Admins can manage category service assignments" ON expert_category_services;

-- Create new policy that properly allows admin access
CREATE POLICY "Admins can manage category service assignments" 
ON expert_category_services 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid()
  )
);