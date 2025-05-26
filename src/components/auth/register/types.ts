
import { ReferralSettings } from '@/types/supabase';

export interface RegisterTabProps {
  onRegister?: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    city?: string;
    referralCode?: string;
  }) => Promise<boolean>;
  loading?: boolean;
  isRegistering?: boolean;
  registerError?: string | null;
  initialReferralCode?: string | null;
  referralSettings?: ReferralSettings | null;
  setCaptchaVerified?: () => void;
  onSwitchToLogin: () => void;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  country: string;
  city: string;
  referralCode: string;
}
