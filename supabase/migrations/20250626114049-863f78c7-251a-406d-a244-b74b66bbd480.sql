
-- First, let's create the missing newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Add RLS policies for newsletter_subscriptions
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow any user to insert (subscribe)
CREATE POLICY "Allow anonymous subscription" ON public.newsletter_subscriptions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users to insert (subscribe)
CREATE POLICY "Allow authenticated users to subscribe" ON public.newsletter_subscriptions
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Only allow admins to view subscriptions
CREATE POLICY "Allow admins to view subscriptions" ON public.newsletter_subscriptions
  FOR SELECT TO authenticated
  USING (auth.role() = 'service_role');

-- Create the missing support_requests table
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

-- Add Row Level Security (RLS) for support_requests
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

-- Fix the programs table programType column to use a proper enum
DO $$ 
BEGIN
  -- Create enum type if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'program_type') THEN
    CREATE TYPE program_type AS ENUM ('wellness', 'academic', 'business', 'productivity', 'leadership');
  END IF;
END $$;

-- First remove the default constraint, then change the type, then add it back
ALTER TABLE public.programs ALTER COLUMN "programType" DROP DEFAULT;
ALTER TABLE public.programs 
ALTER COLUMN "programType" TYPE program_type USING "programType"::program_type;
ALTER TABLE public.programs ALTER COLUMN "programType" SET DEFAULT 'wellness'::program_type;
