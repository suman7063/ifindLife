
export interface UserSettings {
  id?: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  email_notifications: boolean;
  newsletter: boolean;
  two_factor_auth: boolean;
  timezone: string;
  language: string;
  created_at?: string;
  updated_at?: string;
}

export interface WalletData {
  id?: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at?: string;
  updated_at?: string;
}
