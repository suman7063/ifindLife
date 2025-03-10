
export type ServiceType = {
  id: number;
  name: string;
  description: string;
  rateUSD: number;
  rateINR: number;
};

export interface ExpertFormData {
  id: number;
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
}
