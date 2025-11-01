-- Update expert_categories table with correct pricing for each category
UPDATE expert_categories SET 
  base_price_eur = 10, 
  base_price_inr = 200 
WHERE name = 'Listening Volunteer';

UPDATE expert_categories SET 
  base_price_eur = 20, 
  base_price_inr = 400 
WHERE name = 'Listening Expert';

UPDATE expert_categories SET 
  base_price_eur = 50, 
  base_price_inr = 600 
WHERE name = 'Mindfulness Expert';

UPDATE expert_categories SET 
  base_price_eur = 50, 
  base_price_inr = 1200 
WHERE name = 'Mindfulness Coach';

UPDATE expert_categories SET 
  base_price_eur = 80, 
  base_price_inr = 1800 
WHERE name = 'Spiritual Mentor';