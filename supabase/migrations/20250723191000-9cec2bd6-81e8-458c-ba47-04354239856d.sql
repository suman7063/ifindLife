-- Insert service categories with rates for different durations and expert types
-- Based on common therapy/counseling categories

-- Anxiety & Stress Management Services  
INSERT INTO services (name, description, rate_usd, rate_inr, category, duration) VALUES
('Anxiety Counseling (30 min)', 'Professional anxiety management and coping strategies', 25, 2000, 'Anxiety & Stress', 30),
('Anxiety Counseling (60 min)', 'Comprehensive anxiety therapy session', 45, 3500, 'Anxiety & Stress', 60),
('Stress Management (30 min)', 'Practical stress reduction techniques', 25, 2000, 'Anxiety & Stress', 30),
('Stress Management (60 min)', 'In-depth stress management counseling', 45, 3500, 'Anxiety & Stress', 60);

-- Mindfulness & Meditation Services
INSERT INTO services (name, description, rate_usd, rate_inr, category, duration) VALUES  
('Mindfulness Session (30 min)', 'Guided mindfulness and meditation practice', 20, 1500, 'Mindfulness & Meditation', 30),
('Mindfulness Session (60 min)', 'Extended mindfulness training and practice', 35, 2800, 'Mindfulness & Meditation', 60),
('Meditation Coaching (30 min)', 'Personal meditation guidance and techniques', 20, 1500, 'Mindfulness & Meditation', 30),
('Meditation Coaching (60 min)', 'Comprehensive meditation coaching session', 35, 2800, 'Mindfulness & Meditation', 60);

-- Career & Life Counseling  
INSERT INTO services (name, description, rate_usd, rate_inr, category, duration) VALUES
('Career Counseling (30 min)', 'Professional career guidance and planning', 30, 2500, 'Career & Life', 30),
('Career Counseling (60 min)', 'Comprehensive career development session', 55, 4500, 'Career & Life', 60),
('Life Coaching (30 min)', 'Personal development and life planning', 30, 2500, 'Career & Life', 30),
('Life Coaching (60 min)', 'In-depth life coaching and goal setting', 55, 4500, 'Career & Life', 60);

-- Grief & Loss Support
INSERT INTO services (name, description, rate_usd, rate_inr, category, duration) VALUES
('Grief Counseling (30 min)', 'Support for grief and loss processing', 28, 2300, 'Grief & Loss', 30),
('Grief Counseling (60 min)', 'Comprehensive grief therapy session', 50, 4000, 'Grief & Loss', 60),
('Bereavement Support (30 min)', 'Emotional support for bereavement', 28, 2300, 'Grief & Loss', 30),
('Bereavement Support (60 min)', 'Extended bereavement counseling', 50, 4000, 'Grief & Loss', 60);

-- General Mental Health
INSERT INTO services (name, description, rate_usd, rate_inr, category, duration) VALUES
('General Counseling (30 min)', 'General mental health support and guidance', 25, 2000, 'General Mental Health', 30), 
('General Counseling (60 min)', 'Comprehensive mental health counseling', 45, 3500, 'General Mental Health', 60),
('Wellness Coaching (30 min)', 'Overall wellness and health coaching', 25, 2000, 'General Mental Health', 30),
('Wellness Coaching (60 min)', 'Extended wellness and health guidance', 45, 3500, 'General Mental Health', 60);

-- Update featured status for some popular services
UPDATE services SET featured = true WHERE name IN (
  'Anxiety Counseling (60 min)',
  'Mindfulness Session (60 min)', 
  'Career Counseling (60 min)',
  'General Counseling (60 min)'
);