
export interface ExpertActionProps {
  id: string | number;
  online?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string | number) => void;
  onCallNow?: (id: string | number) => void;
  onBookAppointment?: (id: string | number) => void;
}

export interface ExpertCardProps {
  id: string | number;
  name: string;
  experience: number;
  specialties: string[];
  rating: number;
  price: number;
  imageUrl: string;
  waitTime: string;
  online: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string | number) => void;
  onCallNow?: (id: string | number) => void;
  onBookAppointment?: (id: string | number) => void;
}
