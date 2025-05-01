
export interface ExpertCardProps {
  id: string;
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  price: number;
  imageUrl: string;
  waitTime: string;
  online: boolean;
  consultations?: number;
}

export interface ExpertActionProps {
  id: string;
  online: boolean;
}
