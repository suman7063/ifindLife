-- Update existing expert accounts with default categories
-- For demonstration purposes, set them to listening-expert as a default
UPDATE expert_accounts 
SET category = 'listening-expert'
WHERE category IS NULL;

-- Also ensure we have some valid certificate URLs for testing
-- Update one approved expert with a proper category
UPDATE expert_accounts 
SET category = 'listening-volunteer'
WHERE name = 'Neo K' AND status = 'approved';

UPDATE expert_accounts 
SET category = 'mindfulness-expert'
WHERE name = 'Dev OM' AND status = 'approved';