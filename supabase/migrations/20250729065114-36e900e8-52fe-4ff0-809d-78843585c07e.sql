-- Update expert categories to match requirements
DELETE FROM public.expert_categories;

INSERT INTO public.expert_categories (id, name, description, base_price_inr, base_price_eur) VALUES
('listening-volunteer', 'Listening Volunteer', 'Compassionate volunteers providing emotional support and listening services', 200, 10),
('listening-expert', 'Listening Expert', 'Professional listeners with specialized training in emotional support', 400, 20),
('mindfulness-coach', 'Mindfulness Coach', 'Certified coaches specializing in mindfulness practices and meditation', 1200, 50),
('mindfulness-expert', 'Mindfulness Expert', 'Expert practitioners with advanced mindfulness and meditation expertise', 600, 50),
('spiritual-mentor', 'Spiritual Mentor', 'Experienced spiritual guides and mentors for personal growth', 1800, 80);

-- Create pricing tiers table for category-specific duration pricing
CREATE TABLE public.expert_category_duration_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES public.expert_categories(id) ON DELETE CASCADE,
  duration_minutes INTEGER NOT NULL,
  price_inr NUMERIC NOT NULL,
  price_eur NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category_id, duration_minutes)
);

-- Enable RLS
ALTER TABLE public.expert_category_duration_pricing ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view duration pricing" 
ON public.expert_category_duration_pricing 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage duration pricing" 
ON public.expert_category_duration_pricing 
FOR ALL 
USING (is_any_admin())
WITH CHECK (is_any_admin());

-- Insert duration-specific pricing
INSERT INTO public.expert_category_duration_pricing (category_id, duration_minutes, price_inr, price_eur) VALUES
-- Listening Volunteer (30 min only)
('listening-volunteer', 30, 200, 10),
-- Listening Expert (30 min only)
('listening-expert', 30, 400, 20),
-- Mindfulness Coach (30 & 60 min)
('mindfulness-coach', 30, 1200, 50),
('mindfulness-coach', 60, 2000, 80),
-- Mindfulness Expert (30 & 60 min)
('mindfulness-expert', 30, 600, 50),
('mindfulness-expert', 60, 1000, 30),
-- Spiritual Mentor (30 & 60 min)
('spiritual-mentor', 30, 1800, 80),
('spiritual-mentor', 60, 3000, 150);