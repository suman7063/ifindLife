-- Create webhook logs table for audit trail
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access only (webhooks are system-level)
CREATE POLICY "Service role can manage webhook logs" 
ON public.webhook_logs 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add payment_status columns to existing tables if they don't exist
DO $$
BEGIN
  -- Add payment_status to call_sessions if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'call_sessions' 
    AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE public.call_sessions 
    ADD COLUMN payment_status TEXT DEFAULT 'pending';
  END IF;
  
  -- Add razorpay_payment_id to call_sessions if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'call_sessions' 
    AND column_name = 'razorpay_payment_id'
  ) THEN
    ALTER TABLE public.call_sessions 
    ADD COLUMN razorpay_payment_id TEXT;
  END IF;
  
  -- Add failure_reason to call_sessions if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'call_sessions' 
    AND column_name = 'failure_reason'
  ) THEN
    ALTER TABLE public.call_sessions 
    ADD COLUMN failure_reason TEXT;
  END IF;
  
  -- Add payment_status to appointments if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' 
    AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE public.appointments 
    ADD COLUMN payment_status TEXT DEFAULT 'pending';
  END IF;
  
  -- Add razorpay_payment_id to appointments if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' 
    AND column_name = 'razorpay_payment_id'
  ) THEN
    ALTER TABLE public.appointments 
    ADD COLUMN razorpay_payment_id TEXT;
  END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_webhook_logs_provider_event ON public.webhook_logs(provider, event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_processed_at ON public.webhook_logs(processed_at);
CREATE INDEX IF NOT EXISTS idx_call_sessions_razorpay_payment_id ON public.call_sessions(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_appointments_razorpay_payment_id ON public.appointments(razorpay_payment_id);