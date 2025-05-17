
-- Create a table for support requests
CREATE TABLE IF NOT EXISTS public.support_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  admin_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Add Row Level Security (RLS)
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own support requests
CREATE POLICY "Users can view their own support requests" 
  ON public.support_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own support requests
CREATE POLICY "Users can create their own support requests" 
  ON public.support_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
