-- First, let's enhance the expert presence system with activity tracking
-- Add a table to track expert presence status and activity

CREATE TABLE IF NOT EXISTS public.expert_presence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expert_id UUID NOT NULL REFERENCES expert_accounts(auth_id),
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('available', 'busy', 'away', 'offline')),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  auto_away_enabled BOOLEAN DEFAULT true,
  away_timeout_minutes INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for expert messages/notifications when away
CREATE TABLE IF NOT EXISTS public.expert_away_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expert_id UUID NOT NULL REFERENCES expert_accounts(auth_id),
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on both tables
ALTER TABLE public.expert_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_away_messages ENABLE ROW LEVEL SECURITY;

-- Policies for expert_presence
CREATE POLICY "Experts can view and update their own presence" 
ON public.expert_presence 
FOR ALL
USING (auth.uid() = expert_id)
WITH CHECK (auth.uid() = expert_id);

CREATE POLICY "Anyone can view expert presence status" 
ON public.expert_presence 
FOR SELECT 
USING (true);

-- Policies for expert_away_messages
CREATE POLICY "Users can send messages to away experts" 
ON public.expert_away_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Experts can view their away messages" 
ON public.expert_away_messages 
FOR SELECT 
USING (auth.uid() = expert_id);

CREATE POLICY "Experts can update their away message read status" 
ON public.expert_away_messages 
FOR UPDATE 
USING (auth.uid() = expert_id);

CREATE POLICY "Users can view their own sent messages" 
ON public.expert_away_messages 
FOR SELECT 
USING (auth.uid() = user_id);

-- Function to automatically set experts as 'away' based on inactivity
CREATE OR REPLACE FUNCTION public.update_expert_away_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.expert_presence 
  SET status = 'away', updated_at = now()
  WHERE auto_away_enabled = true 
    AND status != 'offline'
    AND status != 'away'
    AND last_activity < (now() - (away_timeout_minutes || ' minutes')::interval);
END;
$$;

-- Trigger function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_expert_presence_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_expert_presence_updated_at
  BEFORE UPDATE ON public.expert_presence
  FOR EACH ROW
  EXECUTE FUNCTION public.update_expert_presence_updated_at();

-- Function to mark away messages as read
CREATE OR REPLACE FUNCTION public.mark_away_message_read(message_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.expert_away_messages 
  SET is_read = true, read_at = now()
  WHERE id = message_id AND expert_id = auth.uid();
END;
$$;