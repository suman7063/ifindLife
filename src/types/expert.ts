
export interface Expert {
  id: string;
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  consultations: number;
  price: number;
  waitTime: string;
  imageUrl: string;
  online?: boolean;
  languages: string[];
  bio?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  certificateUrls?: string[];
  createdAt?: string;
  email?: string;
  phone?: string;
  selectedServices?: number[];
  averageRating?: number;
  reviewsCount?: number;
}
