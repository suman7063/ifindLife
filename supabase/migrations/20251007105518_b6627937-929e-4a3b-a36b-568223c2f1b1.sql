-- Create waitlist table for Souli landing page
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  subscriber_number INTEGER NOT NULL,
  honeypot TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_email UNIQUE (email)
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into waitlist (for signups)
CREATE POLICY "Anyone can join waitlist"
ON public.waitlist
FOR INSERT
WITH CHECK (true);

-- Only admins can view waitlist
CREATE POLICY "Admins can view waitlist"
ON public.waitlist
FOR SELECT
USING (is_any_admin());

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);

-- Create index on subscriber_number
CREATE INDEX IF NOT EXISTS idx_waitlist_subscriber_number ON public.waitlist(subscriber_number);