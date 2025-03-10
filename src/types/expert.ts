
export interface Expert {
  id: number;
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  consultations: number;
  price: number;
  waitTime?: string;
  imageUrl: string;
  online?: boolean;
  languages: string[];
}
