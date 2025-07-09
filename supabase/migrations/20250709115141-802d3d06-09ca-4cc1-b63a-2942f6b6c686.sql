-- Create some approved expert accounts for testing the fixed system
UPDATE expert_accounts 
SET status = 'approved' 
WHERE id IN (
  SELECT id FROM expert_accounts 
  WHERE name IN ('Dushyant Kohli', 'Dev OM') 
  AND status = 'pending'
  LIMIT 3
);