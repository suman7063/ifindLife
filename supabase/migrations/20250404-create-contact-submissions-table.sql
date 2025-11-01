
-- Create contact submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up row level security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Admin users can view all submissions
CREATE POLICY "Admins can view all contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (auth.jwt() ? 'is_admin' AND auth.jwt() ->> 'is_admin' = 'true');

-- Admin users can insert contact submissions
CREATE POLICY "Admins can insert contact submissions"
ON public.contact_submissions
FOR INSERT
TO authenticated
WITH CHECK (auth.jwt() ? 'is_admin' AND auth.jwt() ->> 'is_admin' = 'true');

-- Admin users can update contact submissions
CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (auth.jwt() ? 'is_admin' AND auth.jwt() ->> 'is_admin' = 'true');

-- Anonymous users can insert contact submissions
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- Create index on created_at for faster queries
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions (created_at DESC);
