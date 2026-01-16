-- Update referral_settings table to support separate rewards for referrer and referred user
ALTER TABLE public.referral_settings 
  ADD COLUMN IF NOT EXISTS referrer_reward NUMERIC DEFAULT 10,
  ADD COLUMN IF NOT EXISTS referred_reward NUMERIC DEFAULT 5,
  ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing rows to use new structure
UPDATE public.referral_settings 
SET 
  active = COALESCE(program_enabled, false),
  referrer_reward = COALESCE(reward_amount, 10),
  referred_reward = COALESCE(reward_amount / 2, 5)
WHERE referrer_reward IS NULL OR referred_reward IS NULL;

-- Create function to handle referral completion and award credits
CREATE OR REPLACE FUNCTION public.handle_completed_referral(p_referral_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_referral RECORD;
  v_settings RECORD;
  v_referrer_id UUID;
  v_referred_id UUID;
  v_referrer_reward NUMERIC;
  v_referred_reward NUMERIC;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Get referral details
  SELECT referrer_id, referred_id, status
  INTO v_referral
  FROM public.referrals
  WHERE id = p_referral_id;

  -- Check if referral exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Referral not found';
  END IF;

  -- If referral is already completed, skip status update but still award rewards
  -- This allows rewards to be awarded even if status was updated earlier
  IF v_referral.status = 'completed' THEN
    -- Status already completed, just award rewards (don't update status again)
    -- Continue to reward processing
  ELSIF v_referral.status != 'pending' THEN
    -- Status is neither pending nor completed (shouldn't happen)
    RAISE EXCEPTION 'Referral status is invalid: %', v_referral.status;
  END IF;

  v_referrer_id := v_referral.referrer_id;
  v_referred_id := v_referral.referred_id;

  -- Get referral settings
  SELECT referrer_reward, referred_reward, active
  INTO v_settings
  FROM public.referral_settings
  ORDER BY updated_at DESC
  LIMIT 1;

  -- Check if referral program is active
  IF NOT FOUND OR NOT COALESCE(v_settings.active, false) THEN
    RAISE EXCEPTION 'Referral program is not active';
  END IF;

  v_referrer_reward := COALESCE(v_settings.referrer_reward, 0);
  v_referred_reward := COALESCE(v_settings.referred_reward, 0);

  -- Calculate expiry (12 months from now)
  v_expires_at := NOW() + INTERVAL '12 months';

  -- Award credits to referrer
  IF v_referrer_reward > 0 THEN
    INSERT INTO public.wallet_transactions (
      user_id,
      type,
      amount,
      currency,
      reason,
      reference_type,
      description,
      expires_at,
      metadata
    ) VALUES (
      v_referrer_id,
      'credit',
      v_referrer_reward,
      'INR',
      'referral_reward',
      'referral',
      'Referral reward for referring a user',
      v_expires_at,
      jsonb_build_object('referral_id', p_referral_id, 'reward_type', 'referrer')
    );
  END IF;

  -- Award credits to referred user
  IF v_referred_reward > 0 THEN
    INSERT INTO public.wallet_transactions (
      user_id,
      type,
      amount,
      currency,
      reason,
      reference_type,
      description,
      expires_at,
      metadata
    ) VALUES (
      v_referred_id,
      'credit',
      v_referred_reward,
      'INR',
      'referral_reward',
      'referral',
      'Referral reward for signing up via referral',
      v_expires_at,
      jsonb_build_object('referral_id', p_referral_id, 'reward_type', 'referred')
    );
  END IF;

  -- Update referral status (only if not already completed)
  UPDATE public.referrals
  SET 
    status = 'completed',
    reward_claimed = true,
    completed_at = COALESCE(completed_at, NOW()) -- Don't overwrite if already set
  WHERE id = p_referral_id
    AND status != 'completed'; -- Only update if not already completed

  -- Update wallet balances for both users
  UPDATE public.users
  SET wallet_balance = (
    SELECT COALESCE(SUM(CASE WHEN type = 'credit' AND expires_at >= NOW() THEN amount ELSE 0 END), 0) -
           COALESCE(SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END), 0)
    FROM public.wallet_transactions
    WHERE user_id = users.id
  )
  WHERE id IN (v_referrer_id, v_referred_id);

END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.handle_completed_referral(UUID) TO authenticated;
