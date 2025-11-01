-- Create some approved expert accounts for testing the fixed system
UPDATE expert_accounts 
SET status = 'approved' 
WHERE name IN ('Dushyant Kohli', 'Dev OM') 
AND status = 'pending'
LIMIT 3;