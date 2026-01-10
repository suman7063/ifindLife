-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Get Supabase project URL and anon key from environment
-- These will be set via Supabase Dashboard or environment variables
DO $$
DECLARE
  supabase_url TEXT;
  supabase_anon_key TEXT;
  edge_function_url TEXT;
BEGIN
  -- Get Supabase project URL (this should be set in Supabase Dashboard)
  -- For now, we'll use a placeholder that needs to be replaced
  supabase_url := current_setting('app.settings.supabase_url', true);
  
  -- If not set, use default pattern
  IF supabase_url IS NULL OR supabase_url = '' THEN
    supabase_url := 'https://cqasmezxfzzwvoswngeu.supabase.co';
  END IF;
  
  -- Construct Edge Function URL
  edge_function_url := supabase_url || '/functions/v1/send-expert-email-welcome-status';
  
  -- Get anon key (this should be set in Supabase Dashboard)
  supabase_anon_key := current_setting('app.settings.supabase_anon_key', true);
  
  -- If not set, we'll need to get it from the database
  IF supabase_anon_key IS NULL OR supabase_anon_key = '' THEN
    -- Try to get from vault (Supabase stores secrets here)
    BEGIN
      SELECT decrypted_secret INTO supabase_anon_key
      FROM vault.decrypted_secrets
      WHERE name = 'anon_key'
      LIMIT 1;
    EXCEPTION
      WHEN OTHERS THEN
        -- If vault access fails, we'll need to set it manually
        RAISE NOTICE 'Could not retrieve anon_key from vault. Please set app.settings.supabase_anon_key manually.';
    END;
  END IF;
  
  -- Store in a temporary variable for use in functions
  PERFORM set_config('app.settings.edge_function_url', edge_function_url, false);
  PERFORM set_config('app.settings.supabase_anon_key', COALESCE(supabase_anon_key, ''), false);
END $$;

-- Function to send expert status change email via Edge Function
CREATE OR REPLACE FUNCTION public.send_expert_status_email_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  edge_function_url TEXT;
  anon_key TEXT;
  payload JSONB;
  response_id BIGINT;
BEGIN
  -- Only trigger on status changes to 'approved' or 'rejected'
  IF NEW.status != OLD.status AND NEW.status IN ('approved', 'rejected') THEN
    -- Get Edge Function URL and anon key
    edge_function_url := current_setting('app.settings.edge_function_url', true);
    anon_key := current_setting('app.settings.supabase_anon_key', true);
    
    -- If not configured, skip (log error but don't fail)
    IF edge_function_url IS NULL OR edge_function_url = '' OR anon_key IS NULL OR anon_key = '' THEN
      RAISE WARNING 'Edge Function URL or anon key not configured. Email not sent.';
      RETURN NEW;
    END IF;
    
    -- Construct webhook payload (matching DatabaseWebhookPayload interface)
    payload := jsonb_build_object(
      'type', 'UPDATE',
      'table', 'expert_accounts',
      'schema', 'public',
      'record', jsonb_build_object(
        'name', NEW.name,
        'email', NEW.email,
        'status', NEW.status,
        'feedback_message', NEW.feedback_message
      ),
      'old_record', jsonb_build_object(
        'status', OLD.status
      )
    );
    
    -- Call Edge Function via pg_net
    SELECT net.http_post(
      url := edge_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || anon_key,
        'apikey', anon_key
      ),
      body := payload::text,
      timeout_milliseconds := 10000
    ) INTO response_id;
    
    RAISE NOTICE 'Called Edge Function for expert status change. Response ID: %', response_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function to send expert onboarding completion email via Edge Function
CREATE OR REPLACE FUNCTION public.send_expert_onboarding_email_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  edge_function_url TEXT;
  anon_key TEXT;
  payload JSONB;
  response_id BIGINT;
BEGIN
  -- Only trigger when onboarding_completed changes from false/null to true
  IF NEW.onboarding_completed = true AND 
     (OLD.onboarding_completed = false OR OLD.onboarding_completed IS NULL) THEN
    -- Get Edge Function URL and anon key
    edge_function_url := current_setting('app.settings.edge_function_url', true);
    anon_key := current_setting('app.settings.supabase_anon_key', true);
    
    -- If not configured, skip (log error but don't fail)
    IF edge_function_url IS NULL OR edge_function_url = '' OR anon_key IS NULL OR anon_key = '' THEN
      RAISE WARNING 'Edge Function URL or anon key not configured. Email not sent.';
      RETURN NEW;
    END IF;
    
    -- Construct webhook payload (matching DatabaseWebhookPayload interface)
    payload := jsonb_build_object(
      'type', 'UPDATE',
      'table', 'expert_accounts',
      'schema', 'public',
      'record', jsonb_build_object(
        'name', NEW.name,
        'email', NEW.email,
        'status', NEW.status,
        'onboarding_completed', NEW.onboarding_completed
      ),
      'old_record', jsonb_build_object(
        'onboarding_completed', OLD.onboarding_completed
      )
    );
    
    -- Call Edge Function via pg_net
    SELECT net.http_post(
      url := edge_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || anon_key,
        'apikey', anon_key
      ),
      body := payload::text,
      timeout_milliseconds := 10000
    ) INTO response_id;
    
    RAISE NOTICE 'Called Edge Function for expert onboarding completion. Response ID: %', response_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS expert_status_email_webhook ON public.expert_accounts;
CREATE TRIGGER expert_status_email_webhook
  AFTER UPDATE OF status ON public.expert_accounts
  FOR EACH ROW
  WHEN (NEW.status != OLD.status AND NEW.status IN ('approved', 'rejected'))
  EXECUTE FUNCTION public.send_expert_status_email_webhook();

DROP TRIGGER IF EXISTS expert_onboarding_email_webhook ON public.expert_accounts;
CREATE TRIGGER expert_onboarding_email_webhook
  AFTER UPDATE OF onboarding_completed ON public.expert_accounts
  FOR EACH ROW
  WHEN (NEW.onboarding_completed = true AND (OLD.onboarding_completed = false OR OLD.onboarding_completed IS NULL))
  EXECUTE FUNCTION public.send_expert_onboarding_email_webhook();

