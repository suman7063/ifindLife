-- Create user_notification_preferences table
CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  email_notifications boolean NULL DEFAULT true,
  sms_notifications boolean NULL DEFAULT false,
  push_notifications boolean NULL DEFAULT true,
  booking_confirmations boolean NULL DEFAULT true,
  appointment_reminders boolean NULL DEFAULT true,
  expert_messages boolean NULL DEFAULT true,
  promotional_emails boolean NULL DEFAULT false,
  weekly_digest boolean NULL DEFAULT true,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT user_notification_preferences_pkey PRIMARY KEY (id),
  CONSTRAINT user_notification_preferences_user_id_key UNIQUE (user_id),
  CONSTRAINT user_notification_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create trigger for updating updated_at column
CREATE TRIGGER update_user_notification_preferences_updated_at 
BEFORE UPDATE ON public.user_notification_preferences 
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own preferences
CREATE POLICY "Users can view their own notification preferences"
  ON public.user_notification_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own preferences
CREATE POLICY "Users can insert their own notification preferences"
  ON public.user_notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own preferences
CREATE POLICY "Users can update their own notification preferences"
  ON public.user_notification_preferences
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own preferences
CREATE POLICY "Users can delete their own notification preferences"
  ON public.user_notification_preferences
  FOR DELETE
  USING (auth.uid() = user_id);

