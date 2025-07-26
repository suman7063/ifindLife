-- Create expert_services table to manage expert-service assignments by admins
CREATE TABLE public.expert_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  expert_id UUID NOT NULL,
  service_id INTEGER NOT NULL,
  admin_assigned_rate_usd DECIMAL(10,2),
  admin_assigned_rate_inr DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create expert_onboarding_status table to track post-approval onboarding
CREATE TABLE public.expert_onboarding_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  expert_id UUID NOT NULL UNIQUE,
  services_assigned BOOLEAN DEFAULT false,
  pricing_setup BOOLEAN DEFAULT false,
  availability_setup BOOLEAN DEFAULT false,
  profile_completed BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  first_login_after_approval TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create expert_approval_notifications table for email tracking
CREATE TABLE public.expert_approval_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  expert_id UUID NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('approval', 'rejection')),
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.expert_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_onboarding_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_approval_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for expert_services
CREATE POLICY "Experts can view their own services" 
ON public.expert_services 
FOR SELECT 
USING (expert_id = auth.uid());

CREATE POLICY "Admins can manage all expert services" 
ON public.expert_services 
FOR ALL 
USING (public.is_any_admin());

-- Create RLS policies for expert_onboarding_status
CREATE POLICY "Experts can view their own onboarding status" 
ON public.expert_onboarding_status 
FOR SELECT 
USING (expert_id = auth.uid());

CREATE POLICY "Experts can update their own onboarding status" 
ON public.expert_onboarding_status 
FOR UPDATE 
USING (expert_id = auth.uid());

CREATE POLICY "Admins can manage all onboarding status" 
ON public.expert_onboarding_status 
FOR ALL 
USING (public.is_any_admin());

-- Create RLS policies for expert_approval_notifications
CREATE POLICY "Admins can manage approval notifications" 
ON public.expert_approval_notifications 
FOR ALL 
USING (public.is_any_admin());

-- Create triggers for updated_at
CREATE TRIGGER update_expert_services_updated_at
  BEFORE UPDATE ON public.expert_services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expert_onboarding_status_updated_at
  BEFORE UPDATE ON public.expert_onboarding_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle expert approval workflow
CREATE OR REPLACE FUNCTION public.handle_expert_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if status changed to 'approved' or 'disapproved'
  IF NEW.status != OLD.status AND NEW.status IN ('approved', 'disapproved') THEN
    
    -- Insert onboarding status record for approved experts
    IF NEW.status = 'approved' THEN
      INSERT INTO public.expert_onboarding_status (expert_id)
      VALUES (NEW.auth_id)
      ON CONFLICT (expert_id) DO NOTHING;
    END IF;
    
    -- Create notification record
    INSERT INTO public.expert_approval_notifications (expert_id, notification_type)
    VALUES (NEW.auth_id, NEW.status = 'approved' ? 'approval' : 'rejection');
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on expert_accounts for approval workflow
CREATE TRIGGER expert_approval_trigger
  AFTER UPDATE ON public.expert_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_expert_approval();

-- Create function to get expert onboarding progress
CREATE OR REPLACE FUNCTION public.get_expert_onboarding_progress(expert_auth_id UUID)
RETURNS JSON AS $$
DECLARE
  progress_data JSON;
BEGIN
  SELECT json_build_object(
    'services_assigned', COALESCE(eos.services_assigned, false),
    'pricing_setup', COALESCE(eos.pricing_setup, false),
    'availability_setup', COALESCE(eos.availability_setup, false),
    'profile_completed', COALESCE(eos.profile_completed, false),
    'onboarding_completed', COALESCE(eos.onboarding_completed, false),
    'first_login_after_approval', eos.first_login_after_approval,
    'total_services', COALESCE(service_count.count, 0)
  ) INTO progress_data
  FROM public.expert_onboarding_status eos
  LEFT JOIN (
    SELECT expert_id, COUNT(*) as count 
    FROM public.expert_services 
    WHERE is_active = true 
    GROUP BY expert_id
  ) service_count ON service_count.expert_id = expert_auth_id
  WHERE eos.expert_id = expert_auth_id;
  
  RETURN COALESCE(progress_data, json_build_object(
    'services_assigned', false,
    'pricing_setup', false,
    'availability_setup', false,
    'profile_completed', false,
    'onboarding_completed', false,
    'first_login_after_approval', null,
    'total_services', 0
  ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;