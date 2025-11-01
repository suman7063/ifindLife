-- Drop the services table data since it's not used for pricing
DELETE FROM services;

-- Create category-based pricing table
CREATE TABLE IF NOT EXISTS expert_category_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price_usd NUMERIC NOT NULL,
  price_inr NUMERIC NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique category + duration combinations
  UNIQUE(category, duration_minutes)
);

-- Enable RLS
ALTER TABLE expert_category_pricing ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active pricing
CREATE POLICY "Anyone can view active category pricing" 
ON expert_category_pricing 
FOR SELECT 
USING (active = true);

-- Insert category-based pricing data
INSERT INTO expert_category_pricing (category, duration_minutes, price_usd, price_inr) VALUES
-- Listening Volunteers (lowest rates)
('listening-volunteer', 30, 15, 1200),
('listening-volunteer', 60, 25, 2000),

-- Listening Experts (moderate rates)  
('listening-expert', 30, 25, 2000),
('listening-expert', 60, 45, 3600),

-- Mindfulness Experts (moderate rates)
('mindfulness-expert', 30, 20, 1600),
('mindfulness-expert', 60, 35, 2800),

-- Life Coaches (higher rates)
('life-coach', 30, 30, 2400),
('life-coach', 60, 55, 4400),

-- Spiritual Mentors (higher rates)
('spiritual-mentor', 30, 28, 2200),
('spiritual-mentor', 60, 50, 4000);

-- Update services table to be purely for matching/filtering (not pricing)
INSERT INTO services (name, description, category, rate_usd, rate_inr, duration) VALUES
-- Anxiety & Stress (just for matching)
('Anxiety Counseling', 'Professional anxiety management and coping strategies', 'Anxiety & Stress', 0, 0, 60),
('Stress Management', 'Practical stress reduction techniques', 'Anxiety & Stress', 0, 0, 60),

-- Mindfulness & Meditation  
('Mindfulness Session', 'Guided mindfulness and meditation practice', 'Mindfulness & Meditation', 0, 0, 60),
('Meditation Coaching', 'Personal meditation guidance and techniques', 'Mindfulness & Meditation', 0, 0, 60),

-- Career & Life
('Career Counseling', 'Professional career guidance and planning', 'Career & Life', 0, 0, 60),
('Life Coaching', 'Personal development and life planning', 'Career & Life', 0, 0, 60),

-- Grief & Loss
('Grief Counseling', 'Support for grief and loss processing', 'Grief & Loss', 0, 0, 60),
('Bereavement Support', 'Emotional support for bereavement', 'Grief & Loss', 0, 0, 60),

-- General Mental Health
('General Counseling', 'General mental health support and guidance', 'General Mental Health', 0, 0, 60),
('Wellness Coaching', 'Overall wellness and health coaching', 'General Mental Health', 0, 0, 60);