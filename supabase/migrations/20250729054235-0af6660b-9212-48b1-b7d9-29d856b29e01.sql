-- 1. Create expert categories table (populated with current hardcoded categories)
CREATE TABLE IF NOT EXISTS public.expert_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  base_price_inr NUMERIC DEFAULT 0,
  base_price_eur NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert the current hardcoded categories from the registration form
INSERT INTO public.expert_categories (id, name, description, base_price_inr, base_price_eur) VALUES
  ('listening-volunteer', 'Listening Volunteer', 'Provide compassionate listening and emotional support', 50, 5),
  ('listening-expert', 'Listening Expert', 'Expert-level listening and guidance services', 100, 10),
  ('mindfulness-expert', 'Mindfulness Expert', 'Specialized mindfulness and meditation guidance', 150, 15),
  ('life-coach', 'Life Coach', 'Professional life coaching and personal development', 200, 20),
  ('spiritual-mentor', 'Spiritual Mentor', 'Spiritual guidance and mentorship services', 120, 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_price_inr = EXCLUDED.base_price_inr,
  base_price_eur = EXCLUDED.base_price_eur;

-- 2. Create category_services table to assign services to categories
CREATE TABLE IF NOT EXISTS public.category_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT REFERENCES public.expert_categories(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(category_id, service_id)
);

-- 3. Remove USD rates from existing tables
-- Update services table to remove rate_usd column (keep rate_inr and rate_eur)
ALTER TABLE public.services DROP COLUMN IF EXISTS rate_usd;

-- Update call_pricing table to remove price_usd column
ALTER TABLE public.call_pricing DROP COLUMN IF EXISTS price_usd;

-- Update expert_category_pricing table to remove price_usd column
ALTER TABLE public.expert_category_pricing DROP COLUMN IF EXISTS price_usd;

-- Update expert_pricing_tiers table to remove USD columns
ALTER TABLE public.expert_pricing_tiers 
  DROP COLUMN IF EXISTS price_per_min_usd,
  DROP COLUMN IF EXISTS session_30_usd,
  DROP COLUMN IF EXISTS session_60_usd,
  DROP COLUMN IF EXISTS consultation_fee_usd;

-- Update booking_requests table to remove USD pricing
ALTER TABLE public.booking_requests DROP COLUMN IF EXISTS estimated_price_usd;

-- Update incoming_call_requests table to remove USD pricing
ALTER TABLE public.incoming_call_requests DROP COLUMN IF EXISTS estimated_cost_usd;

-- Update call_sessions table to remove USD cost
ALTER TABLE public.call_sessions DROP COLUMN IF EXISTS cost;

-- 4. Enable RLS on new tables
ALTER TABLE public.expert_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_services ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies
-- Expert categories - anyone can view, only admins can manage
CREATE POLICY "Anyone can view expert categories" 
ON public.expert_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage expert categories" 
ON public.expert_categories 
FOR ALL 
USING (is_any_admin());

-- Category services - anyone can view, only admins can manage
CREATE POLICY "Anyone can view category services" 
ON public.category_services 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage category services" 
ON public.category_services 
FOR ALL 
USING (is_any_admin());

-- 6. Create trigger for updated_at on category_services
CREATE OR REPLACE FUNCTION public.update_category_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_category_services_updated_at
  BEFORE UPDATE ON public.category_services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_category_services_updated_at();