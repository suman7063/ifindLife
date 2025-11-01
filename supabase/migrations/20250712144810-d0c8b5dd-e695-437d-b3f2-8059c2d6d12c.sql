-- Add sample certificate URLs for testing document viewing
UPDATE expert_accounts 
SET certificate_urls = ARRAY['https://via.placeholder.com/600x800.pdf?text=Sample+Certificate+1', 'https://via.placeholder.com/600x800.pdf?text=Sample+Certificate+2']
WHERE name = 'Neo K' AND status = 'approved';

-- Add certificate URL for pending expert (removed LIMIT from UPDATE)
UPDATE expert_accounts 
SET certificate_urls = ARRAY['https://via.placeholder.com/600x800.pdf?text=Pending+Certificate']
WHERE id = (SELECT id FROM expert_accounts WHERE name = 'Dushyant Kohli' AND status = 'pending' LIMIT 1);