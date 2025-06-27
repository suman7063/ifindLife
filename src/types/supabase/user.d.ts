
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  city?: string;
  country?: string;
  currency?: string;
  wallet_balance?: number;
  profile_picture?: string;
  favorite_experts: string[]; // Made required and consistent
  favorite_programs: number[]; // Made required and number[] only
}
