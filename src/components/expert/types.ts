
export type ServiceType = {
  id: number;
  name: string;
  description: string;
  rateUSD: number;
  rateINR: number;
};

export type ReportUserType = {
  id: string;
  userId: string;
  userName: string;
  reason: string;
  details: string;
  date: string;
  status: 'pending' | 'reviewed' | 'resolved';
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
  profilePicture?: string;
  reportedUsers?: ReportUserType[];
}
