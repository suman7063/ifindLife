
// Define the Expert interface for consistent use across the application
export interface Expert {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  specialties?: string[];
  experience: string | number;
  bio?: string;
  imageUrl?: string;
  rating?: number;
  consultations?: number;
  price?: number;
  waitTime?: string;
  online?: boolean;
  certificate_urls?: string[];
  languages?: string[];
  education?: string[];
  availability?: ExpertAvailability[];
  services?: number[];
  reviews_count?: number;
  average_rating?: number;
}

export interface ExpertAvailability {
  id: string;
  expertId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface ExpertCardProps {
  expert: Expert;
}

export interface ExpertFilterParams {
  specialty?: string;
  rating?: number;
  price?: string;
  availability?: string;
  language?: string;
  location?: string;
  sort?: 'rating' | 'experience' | 'price' | 'name';
}
