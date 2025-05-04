
export interface ExpertCardProps {
  id: string;
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  consultations?: number;
  price: number;
  waitTime?: string;
  imageUrl: string;
  online?: boolean;
}

export interface ExpertInfoProps {
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  waitTime?: string;
  price: number;
}

export interface ExpertImageProps {
  imageUrl: string;
  name: string;
  online?: boolean;
}

export interface ExpertActionProps {
  id: string;
  online?: boolean;
}
