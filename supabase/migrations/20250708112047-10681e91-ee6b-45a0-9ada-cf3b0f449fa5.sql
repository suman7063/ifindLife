-- Ensure the latest call pricing data is available
DELETE FROM public.call_pricing WHERE duration_minutes IN (5, 10, 15, 30, 60) AND tier IN ('standard', 'premium');

INSERT INTO public.call_pricing (duration_minutes, price_usd, price_inr, tier, active) VALUES
(5, 2.50, 200, 'standard', true),
(10, 4.50, 350, 'standard', true),
(15, 6.00, 480, 'standard', true),
(30, 10.00, 800, 'premium', true),
(60, 18.00, 1440, 'premium', true)
ON CONFLICT (duration_minutes, tier) DO NOTHING;