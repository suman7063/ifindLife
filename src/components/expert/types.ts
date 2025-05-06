
export interface ExpertFormData {
  id?: string | number;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
  city: string;
  state: string;
  country: string;
  specialization: string;
  experience: string;
  certificates: File[];
  certificateUrls: string[];
  bio: string;
  selectedServices: number[];
  acceptedTerms: boolean;
  reportedUsers?: any[];
  profilePicture?: string; // Add the missing profilePicture property
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
  experience?: string; // Change to string to match with hooks/expert-auth/types.ts
  bio?: string;
  certificate_urls?: string[];
  selected_services?: number[];
}

export interface ServiceType {
  id: number;
  name: string;
  description?: string;
  rate_usd?: number;
  rate_inr?: number;
}

export interface ReportUserType {
  id: string;
  user_id: string;
  expert_id: number;
  reason: string;
  details?: string;
  date: string;
  status: string;
  userName?: string;
}

export const formDataToRegistrationData = (formData: ExpertFormData): ExpertRegistrationData => {
  return {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    password: formData.password,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    country: formData.country,
    specialization: formData.specialization,
    experience: formData.experience,
    bio: formData.bio,
    certificate_urls: formData.certificateUrls,
    selected_services: formData.selectedServices
  };
};
