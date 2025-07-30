-- First, clear existing services
DELETE FROM services;

-- Insert the 6 services from frontend to database as single source of truth
INSERT INTO services (id, name, description, category, rate_usd, rate_inr, rate_eur, duration, featured) VALUES 
(1, 'Heart2Heart Listening Sessions', 'A unique space where you can express yourself freely while being deeply heard without judgment or interruption.', 'Listening & Support', 49.99, 4199, 45.99, 45, true),
(2, 'Listening Session with Guidance', 'Supportive listening sessions combined with gentle guidance and insights to help navigate life challenges.', 'Listening & Support', 59.99, 4999, 54.99, 50, true),
(3, 'Therapy Sessions', 'Professional therapy sessions to help you navigate life challenges, manage mental health concerns, and enhance personal growth.', 'Therapy & Counseling', 89.99, 7499, 79.99, 50, true),
(4, 'Guided Meditations', 'Expertly led meditation sessions to reduce stress, increase mindfulness, and cultivate inner peace and mental clarity.', 'Mindfulness & Meditation', 39.99, 3299, 35.99, 45, false),
(5, 'Offline Retreats', 'Immersive wellness experiences in nature to disconnect from technology and reconnect with yourself and others.', 'Retreats & Workshops', 299.99, 24999, 269.99, 2880, true),
(6, 'Life Coaching', 'Goal-oriented coaching to help you clarify your vision, overcome obstacles, and achieve personal and professional success.', 'Coaching & Development', 79.99, 6699, 71.99, 50, true);

-- Reset the sequence to continue from 7
SELECT setval('services_id_seq', 6, true);