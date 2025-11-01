-- Update the existing database schema to support the comprehensive platform requirements

-- First, ensure users table has all required fields for user registration
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS occupation TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS privacy_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT FALSE;

-- Create enhanced service pricing table for dynamic pricing
CREATE TABLE IF NOT EXISTS public.service_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id INTEGER REFERENCES public.services(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES public.expert_accounts(id) ON DELETE CASCADE,
  base_price_usd NUMERIC NOT NULL DEFAULT 0,
  base_price_inr NUMERIC NOT NULL DEFAULT 0,
  peak_hour_multiplier NUMERIC DEFAULT 1.2,
  experience_multiplier NUMERIC DEFAULT 1.0,
  demand_multiplier NUMERIC DEFAULT 1.0,
  discount_percentage NUMERIC DEFAULT 0,
  minimum_session_duration INTEGER DEFAULT 30,
  maximum_session_duration INTEGER DEFAULT 120,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for service_pricing
ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;

-- Create policies for service_pricing
CREATE POLICY "Public can view active service pricing" 
ON public.service_pricing 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Experts can manage their own pricing" 
ON public.service_pricing 
FOR ALL 
USING (expert_id = auth.uid()) 
WITH CHECK (expert_id = auth.uid());

CREATE POLICY "Admins can manage all pricing" 
ON public.service_pricing 
FOR ALL 
USING (is_user_admin());

-- Create booking requests table for enhanced booking flow
CREATE TABLE IF NOT EXISTS public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES public.expert_accounts(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES public.services(id) ON DELETE CASCADE,
  requested_date DATE NOT NULL,
  requested_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  estimated_price_usd NUMERIC NOT NULL,
  estimated_price_inr NUMERIC NOT NULL,
  user_currency TEXT DEFAULT 'USD',
  special_requirements TEXT,
  urgency_level TEXT DEFAULT 'normal' CHECK (urgency_level IN ('low', 'normal', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'completed', 'cancelled')),
  expert_response TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '24 hours')
);

-- Enable RLS for booking_requests
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for booking_requests
CREATE POLICY "Users can view their own booking requests" 
ON public.booking_requests 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own booking requests" 
ON public.booking_requests 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own booking requests" 
ON public.booking_requests 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Experts can view their assigned booking requests" 
ON public.booking_requests 
FOR SELECT 
USING (expert_id = auth.uid());

CREATE POLICY "Experts can update their assigned booking requests" 
ON public.booking_requests 
FOR UPDATE 
USING (expert_id = auth.uid());

-- Create expert service specializations table
CREATE TABLE IF NOT EXISTS public.expert_service_specializations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID REFERENCES public.expert_accounts(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES public.services(id) ON DELETE CASCADE,
  proficiency_level TEXT DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience INTEGER DEFAULT 0,
  certifications TEXT[],
  description TEXT,
  is_primary_service BOOLEAN DEFAULT FALSE,
  hourly_rate_usd NUMERIC,
  hourly_rate_inr NUMERIC,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(expert_id, service_id)
);

-- Enable RLS for expert_service_specializations
ALTER TABLE public.expert_service_specializations ENABLE ROW LEVEL SECURITY;

-- Create policies for expert_service_specializations
CREATE POLICY "Public can view expert service specializations" 
ON public.expert_service_specializations 
FOR SELECT 
USING (is_available = true);

CREATE POLICY "Experts can manage their own specializations" 
ON public.expert_service_specializations 
FOR ALL 
USING (expert_id = auth.uid()) 
WITH CHECK (expert_id = auth.uid());

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  booking_confirmations BOOLEAN DEFAULT TRUE,
  appointment_reminders BOOLEAN DEFAULT TRUE,
  expert_messages BOOLEAN DEFAULT TRUE,
  promotional_emails BOOLEAN DEFAULT FALSE,
  weekly_digest BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for user_notification_preferences
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user_notification_preferences
CREATE POLICY "Users can manage their own notification preferences" 
ON public.user_notification_preferences 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_service_pricing_updated_at 
BEFORE UPDATE ON public.service_pricing 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_requests_updated_at 
BEFORE UPDATE ON public.booking_requests 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expert_service_specializations_updated_at 
BEFORE UPDATE ON public.expert_service_specializations 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notification_preferences_updated_at 
BEFORE UPDATE ON public.user_notification_preferences 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();