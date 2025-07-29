-- Fix RLS policy for admin access to expert_category_services
-- The current policy is working but let's check if the issue is with the is_any_admin function

-- Drop and recreate the RLS policy with explicit admin_users check
DROP POLICY IF EXISTS "Admins can manage category service assignments" ON expert_category_services;

-- Create a more explicit policy that checks admin_users table directly
CREATE POLICY "Admins can manage category service assignments" 
ON expert_category_services 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.id = auth.uid()
  )
);

-- Also ensure we have admin_users records for testing
-- Note: You'll need to manually add your admin user ID to the admin_users table if it doesn't exist