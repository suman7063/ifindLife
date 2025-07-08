-- Insert call pricing data for the system
INSERT INTO public.call_pricing (duration_minutes, price_usd, price_inr, tier, active) VALUES
(5, 2.50, 200, 'standard', true),
(10, 4.50, 350, 'standard', true),
(15, 6.00, 480, 'standard', true),
(30, 10.00, 800, 'premium', true),
(60, 18.00, 1440, 'premium', true);

-- Update existing testimonials with better content
UPDATE public.testimonials SET
  name = CASE 
    WHEN id = (SELECT id FROM public.testimonials ORDER BY created_at LIMIT 1) THEN 'Priya Sharma'
    ELSE name
  END,
  text = CASE 
    WHEN id = (SELECT id FROM public.testimonials ORDER BY created_at LIMIT 1) THEN 'The experts here truly understand mental health challenges. I found the support I needed during a difficult time.'
    ELSE text
  END
WHERE name IS NOT NULL;