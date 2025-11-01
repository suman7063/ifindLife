-- Database Foundation Updates for Expert Platform Enhancement (Fixed)

-- 1. Update expert categories to match pricing structure
ALTER TABLE public.expert_accounts 
ADD COLUMN IF NOT EXISTS category TEXT CHECK (category IN ('listening-volunteer', 'listening-expert', 'listening-coach', 'mindfulness-expert'));

-- 2. Add EUR currency support to users table
ALTER TABLE public.users 
ALTER COLUMN currency SET DEFAULT 'USD';

-- Add currency constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'currency_check') THEN
        ALTER TABLE public.users ADD CONSTRAINT currency_check CHECK (currency IN ('USD', 'INR', 'EUR'));
    END IF;
END $$;

-- 3. Update services table with proper pricing structure
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS rate_eur NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- 4. Create expert pricing tiers table
CREATE TABLE IF NOT EXISTS public.expert_pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('listening-volunteer', 'listening-expert', 'listening-coach', 'mindfulness-expert')),
  price_per_min_usd NUMERIC DEFAULT 0,
  price_per_min_inr NUMERIC DEFAULT 0,
  price_per_min_eur NUMERIC DEFAULT 0,
  consultation_fee_usd NUMERIC DEFAULT 0,
  consultation_fee_inr NUMERIC DEFAULT 0,
  consultation_fee_eur NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (expert_id) REFERENCES public.expert_accounts(id) ON DELETE CASCADE
);

-- Enable RLS on expert pricing tiers
ALTER TABLE public.expert_pricing_tiers ENABLE ROW LEVEL SECURITY;

-- RLS policies for expert pricing tiers
CREATE POLICY "Experts can manage their own pricing" ON public.expert_pricing_tiers
FOR ALL USING (expert_id IN (SELECT id FROM public.expert_accounts WHERE auth_id = auth.uid()));

CREATE POLICY "Public can view expert pricing" ON public.expert_pricing_tiers
FOR SELECT USING (true);

-- 5. Add expert dashboard post-approval fields
ALTER TABLE public.expert_accounts 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pricing_set BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS availability_set BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT false;

-- 6. Update call pricing with EUR support
ALTER TABLE public.call_pricing 
ADD COLUMN IF NOT EXISTS price_eur NUMERIC DEFAULT 0;

-- 7. Create expert categories reference table
CREATE TABLE IF NOT EXISTS public.expert_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  base_price_usd NUMERIC DEFAULT 0,
  base_price_inr NUMERIC DEFAULT 0,
  base_price_eur NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert expert categories with proper pricing
INSERT INTO public.expert_categories (id, name, description, base_price_usd, base_price_inr, base_price_eur) VALUES
('listening-volunteer', 'Listening Volunteer', 'Compassionate volunteers providing free emotional support', 0, 0, 0),
('listening-expert', 'Listening Expert', 'Professional listeners with extensive training', 2.0, 150, 1.8),
('listening-coach', 'Listening Coach', 'Certified coaches specializing in active listening', 3.0, 250, 2.7),
('mindfulness-expert', 'Mindfulness Expert', 'Certified mindfulness practitioners and meditation teachers', 4.0, 300, 3.6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_price_usd = EXCLUDED.base_price_usd,
  base_price_inr = EXCLUDED.base_price_inr,
  base_price_eur = EXCLUDED.base_price_eur;

-- Enable RLS and set policies for expert categories
ALTER TABLE public.expert_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view expert categories" ON public.expert_categories FOR SELECT USING (true);

-- 8. Update call sessions to support category-based pricing
ALTER TABLE public.call_sessions 
ADD COLUMN IF NOT EXISTS expert_category TEXT,
ADD COLUMN IF NOT EXISTS cost_eur NUMERIC DEFAULT 0;

-- 9. Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_expert_pricing_tiers_updated_at ON public.expert_pricing_tiers;
CREATE TRIGGER update_expert_pricing_tiers_updated_at
    BEFORE UPDATE ON public.expert_pricing_tiers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Create admin metrics function instead of view
CREATE OR REPLACE FUNCTION public.get_admin_metrics()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  -- Check if user is admin
  IF NOT public.is_any_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  SELECT json_build_object(
    'pending_experts', (SELECT COUNT(*) FROM public.expert_accounts WHERE status = 'pending'),
    'approved_experts', (SELECT COUNT(*) FROM public.expert_accounts WHERE status = 'approved'),
    'rejected_experts', (SELECT COUNT(*) FROM public.expert_accounts WHERE status = 'disapproved'),
    'total_users', (SELECT COUNT(*) FROM public.users),
    'upcoming_appointments', (SELECT COUNT(*) FROM public.appointments WHERE status = 'confirmed'),
    'completed_sessions', (SELECT COUNT(*) FROM public.call_sessions WHERE status = 'completed'),
    'total_revenue_usd', (SELECT COALESCE(SUM(cost), 0) FROM public.call_sessions WHERE status = 'completed'),
    'pending_tickets', (SELECT COUNT(*) FROM public.help_tickets WHERE status = 'Pending')
  ) INTO result;

  RETURN result;
END;
$$;