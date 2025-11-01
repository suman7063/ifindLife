-- Create function to deduct reward points and create transaction record
CREATE OR REPLACE FUNCTION public.deduct_reward_points(
  user_id UUID,
  points_to_deduct INTEGER,
  redemption_description TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Deduct points from user profile
  UPDATE public.profiles
  SET reward_points = GREATEST(0, COALESCE(reward_points, 0) - points_to_deduct)
  WHERE id = user_id;
  
  -- Also update in users table for consistency
  UPDATE public.users
  SET reward_points = GREATEST(0, COALESCE(reward_points, 0) - points_to_deduct)
  WHERE id = user_id;
  
  -- Create transaction record
  INSERT INTO public.user_reward_transactions (
    user_id,
    date,
    type,
    points,
    description
  ) VALUES (
    user_id,
    now()::text,
    'redemption',
    -points_to_deduct,
    redemption_description
  );
END;
$$;