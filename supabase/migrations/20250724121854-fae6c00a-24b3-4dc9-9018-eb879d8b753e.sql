-- Transform wallet system to reward points system

-- Add reward_points column to users table (assuming wallet_balance is in users table)
ALTER TABLE public.users ADD COLUMN reward_points integer DEFAULT 0;

-- Copy existing wallet_balance to reward_points (convert to integer points)
UPDATE public.users SET reward_points = COALESCE(wallet_balance::integer, 0);

-- Add reward_points column to profiles table and copy data
ALTER TABLE public.profiles ADD COLUMN reward_points integer DEFAULT 0;
UPDATE public.profiles SET reward_points = COALESCE(wallet_balance::integer, 0);

-- Create a new user_reward_transactions table for reward points history
CREATE TABLE public.user_reward_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  points INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on reward transactions table
ALTER TABLE public.user_reward_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for reward transactions
CREATE POLICY "Users can view their own reward transactions" 
ON public.user_reward_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reward transactions" 
ON public.user_reward_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Update referral settings to use points instead of money
UPDATE public.referral_settings SET 
  referrer_reward = 100,  -- 100 points for referrer
  referred_reward = 50,   -- 50 points for referred user
  description = 'Invite friends and earn reward points when they join and complete their first purchase.';

-- Create or replace the handle_completed_referral function to use points
CREATE OR REPLACE FUNCTION public.handle_completed_referral(p_referral_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_referrer_id UUID;
  v_referred_id UUID;
  v_referrer_reward INTEGER;
  v_referred_reward INTEGER;
BEGIN
  -- Get the referral information
  SELECT referrer_id, referred_id INTO v_referrer_id, v_referred_id
  FROM public.referrals
  WHERE id = p_referral_id AND status = 'pending' AND reward_claimed = false;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Get reward amounts from settings (convert to integer points)
  SELECT referrer_reward::integer, referred_reward::integer INTO v_referrer_reward, v_referred_reward
  FROM public.referral_settings
  LIMIT 1;
  
  -- Update referrer's reward points in users table
  UPDATE public.users
  SET reward_points = COALESCE(reward_points, 0) + v_referrer_reward
  WHERE id = v_referrer_id;
  
  -- Update referred user's reward points in users table
  UPDATE public.users
  SET reward_points = COALESCE(reward_points, 0) + v_referred_reward
  WHERE id = v_referred_id;
  
  -- Update referrer's reward points in profiles table
  UPDATE public.profiles
  SET reward_points = COALESCE(reward_points, 0) + v_referrer_reward
  WHERE id = v_referrer_id;
  
  -- Update referred user's reward points in profiles table
  UPDATE public.profiles
  SET reward_points = COALESCE(reward_points, 0) + v_referred_reward
  WHERE id = v_referred_id;
  
  -- Create reward transaction records
  INSERT INTO public.user_reward_transactions (user_id, date, type, points, description)
  VALUES (
    v_referrer_id, 
    now()::text, 
    'referral_reward', 
    v_referrer_reward, 
    'Referral reward points for inviting a new user'
  );
  
  INSERT INTO public.user_reward_transactions (user_id, date, type, points, description)
  VALUES (
    v_referred_id, 
    now()::text, 
    'referral_reward', 
    v_referred_reward, 
    'Welcome reward points for joining through a referral'
  );
  
  -- Update referral status
  UPDATE public.referrals
  SET status = 'completed',
      reward_claimed = true,
      completed_at = now()
  WHERE id = p_referral_id;
  
  RETURN true;
END;
$function$;