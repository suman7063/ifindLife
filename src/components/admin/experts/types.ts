
export interface Expert {
  id: string; // Changed from number to string
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  consultations: number;
  price: number;
  waitTime: string;
  imageUrl: string;
  online: boolean;
  languages?: string[];
  bio?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  availability?: string;
  status?: 'pending' | 'approved' | 'disapproved'; // Added status property
}
