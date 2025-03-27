
import { ExpertProfile } from '@/hooks/useExpertAuth';

export type ExpertFormData = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  specialization: string;
  experience: string;
  certificates?: File[];
  certificateUrls?: string[];
  bio: string;
  selectedServices: number[];
  acceptedTerms?: boolean;
  reportedUsers?: ReportUserType[];
};

export type ReportUserType = {
  id: string;
  userId: string;
  userName: string;
  reason: string;
  details?: string;
  date: string;
  status: string;
};

export type ServiceType = {
  id: number;
  name: string;
  description?: string;
  rateUSD: number;
  rateINR: number;
};

// Function to convert ExpertProfile to ExpertFormData
export const profileToFormData = (profile: ExpertProfile): ExpertFormData => ({
  id: profile.id,
  name: profile.name,
  email: profile.email,
  phone: profile.phone || '',
  address: profile.address || '',
  city: profile.city || '',
  state: profile.state || '',
  country: profile.country || '',
  specialization: profile.specialization || '',
  experience: profile.experience || '',
  certificateUrls: profile.certificate_urls || [],
  bio: profile.bio || '',
  selectedServices: profile.selected_services || [],
});

// Function to convert ExpertFormData to data for registration
export const formDataToRegistrationData = (formData: ExpertFormData) => ({
  name: formData.name,
  email: formData.email,
  password: formData.password || '',
  phone: formData.phone,
  address: formData.address,
  city: formData.city,
  state: formData.state,
  country: formData.country,
  specialization: formData.specialization,
  experience: formData.experience,
  bio: formData.bio,
  selected_services: formData.selectedServices
});
