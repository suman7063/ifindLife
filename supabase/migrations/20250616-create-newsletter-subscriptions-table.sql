
-- Create newsletter subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Add RLS policies
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow any user to insert (subscribe)
CREATE POLICY "Allow anonymous subscription" ON newsletter_subscriptions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users to insert (subscribe)
CREATE POLICY "Allow authenticated users to subscribe" ON newsletter_subscriptions
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Only allow admins to view subscriptions
CREATE POLICY "Allow admins to view subscriptions" ON newsletter_subscriptions
  FOR SELECT TO authenticated
  USING (auth.role() = 'service_role');
