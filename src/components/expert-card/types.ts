
export interface ExpertCardProps {
  id: string | number;
  name: string;
  experience: string | number;
  specialties: string[];
  rating: number;
  price: number;
  imageUrl?: string;
  waitTime?: string;
  online?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string | number) => void;
  consultations?: number; // Added to support TopTherapistsSection
}

export interface ExpertImageProps {
  imageUrl?: string;
  online?: boolean;
  verified?: boolean;
}

export interface ExpertInfoProps {
  name: string;
  experience: string | number;
  specialties: string[];
  rating: number;
  waitTime?: string; 
  price: number;
}

export interface ExpertActionsProps {
  id: string | number;
  online?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string | number) => void;
  onCallNow?: (id: string | number) => void;
  onBookAppointment?: (id: string | number) => void;
}
