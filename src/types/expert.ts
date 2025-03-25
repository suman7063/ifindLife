
export interface Expert {
  id: number;
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  consultations: number;
  price: number;
  waitTime?: string; // Made optional to match AstrologerCardProps
  imageUrl: string;
  online?: boolean;
  languages: string[];
}
