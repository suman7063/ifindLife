
export interface Expert {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  specialization: string;
  experience: string;
  rating: number;
  reviews: number;
}

export interface EnhancedExpertSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpertSelected: (expertId: number) => void;
  serviceTitle: string;
}

export interface ReportUserType {
  id: string;
  user_id: string;
  expert_id: number;
  reason: string;
  details: string;
  date: string;
  status: string;
  userName?: string;
}

export interface ExpertFormData {
  id?: number | string;
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
  bio: string;
  acceptedTerms: boolean;
  selectedServices: number[];
  profilePicture?: string;
  certificates?: File[];
  certificateUrls?: string[];
  certificate_urls?: string[];
  selected_services?: number[];
  reportedUsers?: ReportUserType[];
}

export interface ExpertRegistrationData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  specialization: string;
  experience: string;
  bio: string;
  certificate_urls: string[];
  selected_services: number[];
}

export interface ServiceType {
  id: number;
  name: string;
  title?: string;
  description: string;
  price?: number;
  category?: string;
  duration?: string;
  image?: string;
}
