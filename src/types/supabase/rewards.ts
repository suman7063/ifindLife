// Types for the new reward redemption system

export interface AdminRewardItem {
  id: string;
  name: string;
  description?: string;
  category: 'course' | 'session' | 'retreat' | 'event';
  points_required: number;
  is_active: boolean;
  image_url?: string;
  external_id?: string; // reference to course_id, session_id, etc.
  max_redemptions?: number; // null for unlimited
  current_redemptions: number;
  created_at: string;
  updated_at: string;
}

export interface UserRewardRedemption {
  id: string;
  user_id: string;
  reward_item_id: string;
  points_spent: number;
  status: 'pending' | 'fulfilled' | 'expired';
  redemption_date: string;
  fulfilled_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Expanded relation data
  reward_item?: AdminRewardItem;
}

export interface RewardTransaction {
  id: string;
  user_id: string;
  date: string;
  type: 'referral_reward' | 'redemption';
  points: number;
  description?: string;
  created_at: string;
  redemption_id?: string; // Reference to redemption if applicable
}