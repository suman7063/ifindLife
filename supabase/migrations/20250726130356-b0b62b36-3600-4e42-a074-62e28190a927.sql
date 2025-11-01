-- Fix function search paths for security compliance
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
    
    -- Create notification record using CASE expression
    INSERT INTO public.expert_approval_notifications (expert_id, notification_type)
    VALUES (NEW.auth_id, CASE WHEN NEW.status = 'approved' THEN 'approval' ELSE 'rejection' END);
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix search path for onboarding progress function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;