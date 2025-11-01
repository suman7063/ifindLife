-- Update expert_categories table with correct pricing for each category
UPDATE expert_categories SET 
  base_price_eur = 10, 
  base_price_inr = 200 
WHERE id = 'listening-volunteer';

UPDATE expert_categories SET 
  base_price_eur = 20, 
  base_price_inr = 400 
WHERE id = 'listening-expert';

UPDATE expert_categories SET 
  base_price_eur = 50, 
  base_price_inr = 600 
WHERE id = 'mindfulness-expert';

UPDATE expert_categories SET 
  base_price_eur = 50, 
  base_price_inr = 1200 
WHERE id = 'mindfulness-coach';

UPDATE expert_categories SET 
  base_price_eur = 80, 
  base_price_inr = 1800 
WHERE id = 'spiritual-mentor';

-- Insert default pricing tiers for each category
INSERT INTO expert_pricing_tiers (expert_id, category, session_30_eur, session_30_inr, session_60_eur, session_60_inr)
SELECT 
  'default-' || id as expert_id,
  id as category,
  CASE 
    WHEN id = 'listening-volunteer' THEN 10
    WHEN id = 'listening-expert' THEN 20
    WHEN id = 'mindfulness-expert' THEN 50
    WHEN id = 'mindfulness-coach' THEN 50
    WHEN id = 'spiritual-mentor' THEN 80
  END as session_30_eur,
  CASE 
    WHEN id = 'listening-volunteer' THEN 200
    WHEN id = 'listening-expert' THEN 400
    WHEN id = 'mindfulness-expert' THEN 600
    WHEN id = 'mindfulness-coach' THEN 1200
    WHEN id = 'spiritual-mentor' THEN 1800
  END as session_30_inr,
  CASE 
    WHEN id = 'mindfulness-expert' THEN 30
    WHEN id = 'mindfulness-coach' THEN 80
    WHEN id = 'spiritual-mentor' THEN 150
    ELSE 0
  END as session_60_eur,
  CASE 
    WHEN id = 'mindfulness-expert' THEN 1000
    WHEN id = 'mindfulness-coach' THEN 2000
    WHEN id = 'spiritual-mentor' THEN 3000
    ELSE 0
  END as session_60_inr
FROM expert_categories
ON CONFLICT (expert_id, category) DO UPDATE SET
  session_30_eur = EXCLUDED.session_30_eur,
  session_30_inr = EXCLUDED.session_30_inr,
  session_60_eur = EXCLUDED.session_60_eur,
  session_60_inr = EXCLUDED.session_60_inr;