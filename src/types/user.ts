
// User-related types for the application
export interface UserSettings {
  user_id: string;
  theme: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  newsletter: boolean;
  two_factor_auth: boolean;
  timezone: string;
  language: string;
}

export interface ReferralInfo {
  id: string;
  referrer_id: string;
  referred_id: string;
  status: string;
  created_at: string;
  completed_at?: string;
  reward_claimed: boolean;
  referrer_name?: string;
  referrer_email?: string;
  referrer_avatar?: string | null;
}
