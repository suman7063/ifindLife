
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'student' | 'instructor' | 'admin';
  created_at: string;
  updated_at: string;
  phone?: string;
  country?: string;
  city?: string;
  wallet_balance?: number;
  currency?: string;
  profile_picture?: string;
  referral_code?: string;
  referred_by?: string;
  referral_link?: string;
}

export interface ThirdPartyLMS {
  provider: 'moodle' | 'canvas' | 'blackboard' | 'custom';
  access_url: string;
  credentials?: {
    username?: string;
    access_token?: string;
  };
  last_synced?: string;
}

export interface EnrolledProgram {
  id: string;
  program_id: string;
  user_id: string;
  enrollment_date: string;
  completion_status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  last_accessed?: string;
  third_party_lms?: ThirdPartyLMS;
  program: {
    id: string;
    title: string;
    description: string;
    thumbnail_url?: string;
    instructor_name: string;
  };
}
