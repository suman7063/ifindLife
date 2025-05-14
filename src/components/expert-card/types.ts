
export interface ExpertCardProps {
  id: string | number;
  name: string;
  experience?: string | number;
  specialties?: string[];
  rating?: number;
  price?: number;
  imageUrl?: string;
  waitTime?: string;
  online?: boolean;
  isFavorite?: boolean;
}

export interface ExpertImageProps {
  imageUrl?: string;
  name: string;
  online?: boolean;
}

export interface ExpertInfoProps {
  name: string;
  experience?: string | number;
  specialties?: string[];
  rating?: number;
  waitTime?: string;
  price?: number;
}

export interface ExpertActionsProps {
  id: string | number;
  online?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string | number) => void;
}
