
import { Expert } from '@/types/expert';

export interface ServiceType {
  id: number;
  name: string;
  description?: string;
  rateUSD: number;
  rateINR: number;
}

export interface ExpertFormData {
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
  [key: string]: any; // To allow dynamic property access
}

export interface ExpertRegistrationData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string;
  bio?: string;
  certificate_urls?: string[];
  selected_services?: number[];
}

export interface ReportUserType {
  id: string;
  user_id: string;
  expert_id: number;
  reason: string;
  details?: string;
  date: string;
  status: string;
}

export const formDataToRegistrationData = (formData: ExpertFormData): ExpertRegistrationData => {
  console.log('Converting form data to registration data:', formData);
  
  return {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    phone: formData.phone,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    country: formData.country,
    specialization: formData.specialization,
    experience: formData.experience,
    bio: formData.bio,
    certificate_urls: formData.certificateUrls, // Convert to backend format
    selected_services: formData.selectedServices // Convert to backend format
  };
};

export type ExpertProps = {
  expert: Expert;
};
