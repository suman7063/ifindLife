
export interface ExpertCardProps {
  id: string | number;
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  consultations?: number;
  price: number;
  waitTime?: string;
  imageUrl: string;
  online?: boolean;
  isFavorite?: boolean;
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
  id: string | number;
  online?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string | number) => void;
  onCallNow?: (id: string | number) => void;
  onBookAppointment?: (id: string | number) => void;
}
