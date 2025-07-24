-- Update pricing tables to use EUR instead of USD

-- Add EUR columns to call_pricing table
ALTER TABLE public.call_pricing ADD COLUMN price_eur numeric;

-- Update EUR pricing to be the same as USD pricing initially
UPDATE public.call_pricing SET price_eur = price_usd WHERE price_usd IS NOT NULL;

-- Make price_eur NOT NULL now that we have data
ALTER TABLE public.call_pricing ALTER COLUMN price_eur SET NOT NULL;

-- Drop old USD column
ALTER TABLE public.call_pricing DROP COLUMN price_usd;

-- Add EUR columns to expert_category_pricing table  
ALTER TABLE public.expert_category_pricing ADD COLUMN price_eur numeric;

-- Update EUR pricing to be the same as USD pricing initially
UPDATE public.expert_category_pricing SET price_eur = price_usd WHERE price_usd IS NOT NULL;

-- Make price_eur NOT NULL now that we have data
ALTER TABLE public.expert_category_pricing ALTER COLUMN price_eur SET NOT NULL;

-- Drop old USD column
ALTER TABLE public.expert_category_pricing DROP COLUMN price_usd;

-- Update expert_categories table
ALTER TABLE public.expert_categories ADD COLUMN base_price_eur numeric DEFAULT 0;
UPDATE public.expert_categories SET base_price_eur = base_price_usd WHERE base_price_usd IS NOT NULL;
ALTER TABLE public.expert_categories DROP COLUMN base_price_usd;

-- Update expert_pricing_tiers table
ALTER TABLE public.expert_pricing_tiers ADD COLUMN consultation_fee_eur numeric DEFAULT 0;
ALTER TABLE public.expert_pricing_tiers ADD COLUMN session_30_eur numeric DEFAULT 0; 
ALTER TABLE public.expert_pricing_tiers ADD COLUMN session_60_eur numeric DEFAULT 0;
ALTER TABLE public.expert_pricing_tiers ADD COLUMN price_per_min_eur numeric DEFAULT 0;

-- Copy USD values to EUR columns
UPDATE public.expert_pricing_tiers SET 
  consultation_fee_eur = consultation_fee_usd,
  session_30_eur = session_30_usd,
  session_60_eur = session_60_usd,
  price_per_min_eur = price_per_min_usd
WHERE consultation_fee_usd IS NOT NULL;

-- Drop USD columns from expert_pricing_tiers
ALTER TABLE public.expert_pricing_tiers DROP COLUMN consultation_fee_usd;
ALTER TABLE public.expert_pricing_tiers DROP COLUMN session_30_usd;
ALTER TABLE public.expert_pricing_tiers DROP COLUMN session_60_usd;
ALTER TABLE public.expert_pricing_tiers DROP COLUMN price_per_min_usd;

-- Update booking_requests table
ALTER TABLE public.booking_requests ADD COLUMN estimated_price_eur numeric;
UPDATE public.booking_requests SET estimated_price_eur = estimated_price_usd WHERE estimated_price_usd IS NOT NULL;
ALTER TABLE public.booking_requests DROP COLUMN estimated_price_usd;

-- Update incoming_call_requests table  
ALTER TABLE public.incoming_call_requests ADD COLUMN estimated_cost_eur numeric;
UPDATE public.incoming_call_requests SET estimated_cost_eur = estimated_cost_usd WHERE estimated_cost_usd IS NOT NULL;
ALTER TABLE public.incoming_call_requests DROP COLUMN estimated_cost_usd;