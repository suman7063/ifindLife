-- Clear existing pricing data and add the new pricing structure
DELETE FROM public.call_pricing;

INSERT INTO public.call_pricing (duration_minutes, price_usd, price_inr, tier, active) VALUES
(5, 2.50, 200, 'standard', true),
(10, 4.50, 350, 'standard', true),
(15, 6.00, 480, 'standard', true),
(30, 10.00, 800, 'premium', true),
(60, 18.00, 1440, 'premium', true);