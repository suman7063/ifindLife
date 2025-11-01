-- Create admin_reward_items table for managing redeemable items
CREATE TABLE public.admin_reward_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'course', 'session', 'retreat', 'event'
  points_required INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  external_id TEXT, -- reference to course_id, session_id, etc.
  max_redemptions INTEGER, -- null for unlimited
  current_redemptions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_reward_redemptions table to track redemptions
CREATE TABLE public.user_reward_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_item_id UUID NOT NULL REFERENCES public.admin_reward_items(id) ON DELETE CASCADE,
  points_spent INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'fulfilled', 'expired'
  redemption_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  fulfilled_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update user_reward_transactions table to include redemption tracking
ALTER TABLE public.user_reward_transactions 
ADD COLUMN IF NOT EXISTS redemption_id UUID REFERENCES public.user_reward_redemptions(id) ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE public.admin_reward_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reward_redemptions ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_reward_items
CREATE POLICY "Anyone can view active reward items" 
ON public.admin_reward_items 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage reward items" 
ON public.admin_reward_items 
FOR ALL 
USING (is_any_admin());

-- Create policies for user_reward_redemptions
CREATE POLICY "Users can view their own redemptions" 
ON public.user_reward_redemptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own redemptions" 
ON public.user_reward_redemptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all redemptions" 
ON public.user_reward_redemptions 
FOR SELECT 
USING (is_any_admin());

CREATE POLICY "Admins can update redemptions" 
ON public.user_reward_redemptions 
FOR UPDATE 
USING (is_any_admin());

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_reward_items_updated_at
BEFORE UPDATE ON public.admin_reward_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_reward_redemptions_updated_at
BEFORE UPDATE ON public.user_reward_redemptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Remove wallet_balance column from profiles table as it's no longer needed
ALTER TABLE public.profiles DROP COLUMN IF EXISTS wallet_balance;