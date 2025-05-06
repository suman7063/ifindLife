
export interface ExpertProfile {
  id: string;
  auth_id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string;
  bio?: string;
  certificate_urls?: string[];
  profile_picture?: string;
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExpertRegistrationData {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string | number;
  bio?: string;
  certificate_urls?: string[];
  selected_services?: number[];
}

export interface ExpertTimeSlot {
  id?: string;
  expert_id?: string;
  day_of_week?: number;
  day?: number;
  start_time: string;
  end_time: string;
  is_booked?: boolean;
}

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string;
  bio?: string;
  profile_picture?: string;
}
