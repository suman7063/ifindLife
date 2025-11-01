-- Enhance call sessions table for better call management
ALTER TABLE public.call_sessions 
ADD COLUMN IF NOT EXISTS call_direction VARCHAR(10) DEFAULT 'outgoing' CHECK (call_direction IN ('incoming', 'outgoing')),
ADD COLUMN IF NOT EXISTS expert_auth_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS missed_call BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS answered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS call_metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS agora_channel_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS agora_token TEXT;

-- Create incoming call requests table
CREATE TABLE IF NOT EXISTS public.incoming_call_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  expert_id UUID NOT NULL REFERENCES expert_accounts(auth_id),
  call_type VARCHAR(10) NOT NULL CHECK (call_type IN ('audio', 'video')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'timeout', 'cancelled')),
  channel_name VARCHAR(255) NOT NULL,
  agora_token TEXT,
  agora_uid INTEGER,
  estimated_cost_usd DECIMAL(10,2),
  estimated_cost_inr DECIMAL(10,2),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  call_session_id UUID REFERENCES call_sessions(id),
  user_metadata JSONB DEFAULT '{}'
);

-- Enable RLS on incoming_call_requests
ALTER TABLE public.incoming_call_requests ENABLE ROW LEVEL SECURITY;

-- Policies for incoming_call_requests
CREATE POLICY "Experts can view incoming calls for them" 
ON public.incoming_call_requests 
FOR SELECT 
USING (auth.uid() = expert_id);

CREATE POLICY "Experts can update their incoming calls" 
ON public.incoming_call_requests 
FOR UPDATE 
USING (auth.uid() = expert_id);

CREATE POLICY "Users can create call requests" 
ON public.incoming_call_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own call requests" 
ON public.incoming_call_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own call requests" 
ON public.incoming_call_requests 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_incoming_call_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_incoming_call_requests_updated_at
  BEFORE UPDATE ON public.incoming_call_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_incoming_call_requests_updated_at();

-- Function to expire old call requests
CREATE OR REPLACE FUNCTION public.expire_old_call_requests()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.incoming_call_requests 
  SET status = 'timeout', updated_at = now()
  WHERE status = 'pending' 
    AND expires_at < now();
END;
$$;