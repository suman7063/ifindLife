-- Fix Function Search Path Mutable security issues
-- Add secure search_path to all functions that are missing it

-- Fix update_expert_away_status function
CREATE OR REPLACE FUNCTION public.update_expert_away_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Fix update_expert_presence_updated_at function
CREATE OR REPLACE FUNCTION public.update_expert_presence_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = 'public';

-- Fix mark_away_message_read function
CREATE OR REPLACE FUNCTION public.mark_away_message_read(message_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.expert_away_messages 
  SET is_read = true, read_at = now()
  WHERE id = message_id AND expert_id = auth.uid();
END;
$$;

-- Fix authenticate_admin function
CREATE OR REPLACE FUNCTION public.authenticate_admin(p_username text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    admin_record RECORD;
    is_valid BOOLEAN := FALSE;
BEGIN
    -- Get admin account
    SELECT * INTO admin_record 
    FROM admin_accounts 
    WHERE username = p_username AND is_active = true;
    
    -- Check if admin exists and account is not locked
    IF admin_record.id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Invalid credentials');
    END IF;
    
    -- Check if account is locked
    IF admin_record.locked_until IS NOT NULL AND admin_record.locked_until > NOW() THEN
        RETURN json_build_object('success', false, 'error', 'Account is temporarily locked');
    END IF;
    
    -- Verify password (using crypt function for bcrypt)
    SELECT (admin_record.password_hash = crypt(p_password, admin_record.password_hash)) INTO is_valid;
    
    IF is_valid THEN
        -- Update last login and reset failed attempts
        UPDATE admin_accounts 
        SET 
            last_login = NOW(),
            failed_login_attempts = 0,
            locked_until = NULL
        WHERE id = admin_record.id;
        
        -- Return success with admin info
        RETURN json_build_object(
            'success', true,
            'admin', json_build_object(
                'id', admin_record.id,
                'username', admin_record.username,
                'email', admin_record.email,
                'role', admin_record.role,
                'lastLogin', NOW()
            )
        );
    ELSE
        -- Increment failed login attempts
        UPDATE admin_accounts 
        SET 
            failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1,
            locked_until = CASE 
                WHEN COALESCE(failed_login_attempts, 0) + 1 >= 5 
                THEN NOW() + INTERVAL '15 minutes'
                ELSE locked_until
            END
        WHERE id = admin_record.id;
        
        RETURN json_build_object('success', false, 'error', 'Invalid credentials');
    END IF;
END;
$$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, country, city)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'country',
    NEW.raw_user_meta_data->>'city'
  );
  RETURN NEW;
END;
$$;

-- Fix update_modified_column function
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$;

-- Fix is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.admin_users WHERE id = user_id;
  RETURN user_role IS NOT NULL;
END;
$$;

-- Fix is_superadmin functions (both variants)
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.admin_users WHERE id = auth.uid();
  RETURN user_role = 'superadmin';
END;
$$;

CREATE OR REPLACE FUNCTION public.is_superadmin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  is_super boolean;
BEGIN
  SELECT (role = 'superadmin') INTO is_super FROM public.admin_users WHERE id = user_id;
  RETURN COALESCE(is_super, false);
END;
$$;

-- Fix is_any_admin function
CREATE OR REPLACE FUNCTION public.is_any_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.admin_users WHERE id = auth.uid();
  RETURN user_role IS NOT NULL;
END;
$$;

-- Fix update_expert_average_rating function
CREATE OR REPLACE FUNCTION public.update_expert_average_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.experts
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.user_reviews
      WHERE expert_id = NEW.expert_id
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM public.user_reviews
      WHERE expert_id = NEW.expert_id
    )
  WHERE id = NEW.expert_id;
  RETURN NEW;
END;
$$;

-- Fix handle_new_message function
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Create a notification for the recipient
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    content,
    sender_id,
    reference_id,
    read
  ) VALUES (
    NEW.receiver_id,
    'message',
    'New message',
    substring(NEW.content from 1 for 100),
    NEW.sender_id,
    NEW.id,
    false
  );
  
  RETURN NEW;
END;
$$;

-- Fix increment_program_enrollments function
CREATE OR REPLACE FUNCTION public.increment_program_enrollments(program_id integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.programs
  SET enrollments = enrollments + 1
  WHERE id = program_id;
END;
$$;

-- Fix handle_completed_referral function
CREATE OR REPLACE FUNCTION public.handle_completed_referral(p_referral_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_referrer_id UUID;
  v_referred_id UUID;
  v_referrer_reward NUMERIC;
  v_referred_reward NUMERIC;
  v_referrer_currency TEXT;
  v_referred_currency TEXT;
BEGIN
  -- Get the referral information
  SELECT referrer_id, referred_id INTO v_referrer_id, v_referred_id
  FROM public.referrals
  WHERE id = p_referral_id AND status = 'pending' AND reward_claimed = false;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Get reward amounts from settings
  SELECT referrer_reward, referred_reward INTO v_referrer_reward, v_referred_reward
  FROM public.referral_settings
  LIMIT 1;
  
  -- Get user currencies
  SELECT currency INTO v_referrer_currency
  FROM public.users
  WHERE id = v_referrer_id;
  
  SELECT currency INTO v_referred_currency
  FROM public.users
  WHERE id = v_referred_id;
  
  -- Update referrer's wallet
  UPDATE public.users
  SET wallet_balance = wallet_balance + v_referrer_reward
  WHERE id = v_referrer_id;
  
  -- Update referred user's wallet
  UPDATE public.users
  SET wallet_balance = wallet_balance + v_referred_reward
  WHERE id = v_referred_id;
  
  -- Create transaction records
  INSERT INTO public.user_transactions (user_id, date, type, amount, currency, description)
  VALUES (
    v_referrer_id, 
    now()::text, 
    'referral_reward', 
    v_referrer_reward, 
    v_referrer_currency, 
    'Referral reward for inviting a new user'
  );
  
  INSERT INTO public.user_transactions (user_id, date, type, amount, currency, description)
  VALUES (
    v_referred_id, 
    now()::text, 
    'referral_reward', 
    v_referred_reward, 
    v_referred_currency, 
    'Welcome reward for joining through a referral'
  );
  
  -- Update referral status
  UPDATE public.referrals
  SET status = 'completed',
      reward_claimed = true,
      completed_at = now()
  WHERE id = p_referral_id;
  
  RETURN true;
END;
$$;

-- Fix generate_referral_code function
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  code TEXT := '';
  i INTEGER;
  attempts INTEGER := 0;
  max_attempts INTEGER := 10;
  existing_code_count INTEGER;
BEGIN
  WHILE attempts < max_attempts LOOP
    -- Generate a random 8-character code
    code := '';
    FOR i IN 1..8 LOOP
      code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    -- Check if this code already exists
    SELECT COUNT(*) INTO existing_code_count 
    FROM public.users 
    WHERE referral_code = code;
    
    IF existing_code_count = 0 THEN
      -- Code is unique, we can use it
      NEW.referral_code := code;
      NEW.referral_link := '/signup?ref=' || code;
      RETURN NEW;
    END IF;
    
    attempts := attempts + 1;
  END LOOP;
  
  -- If we reach here, we couldn't generate a unique code after max attempts
  RAISE EXCEPTION 'Could not generate a unique referral code after % attempts', max_attempts;
END;
$$;

-- Fix get_user_reviews_with_experts function
CREATE OR REPLACE FUNCTION public.get_user_reviews_with_experts(user_id_param uuid)
RETURNS TABLE(review_id uuid, expert_id integer, rating integer, comment text, date text, verified boolean, user_name text, expert_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id as review_id,
    r.expert_id,
    r.rating,
    r.comment,
    r.date,
    r.verified,
    r.user_name,
    e.name as expert_name
  FROM 
    public.user_reviews r
  LEFT JOIN 
    public.experts e ON e.id = CAST(r.expert_id AS TEXT)
  WHERE 
    r.user_id = user_id_param;
END;
$$;