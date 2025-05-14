
export interface ExpertCardData {
  id: string | number;
  name: string;
  title?: string;
  specialties?: string[];
  rating?: number;
  reviewCount?: number;
  pricePerMinute?: number;
  profilePicture?: string;
  status?: 'online' | 'offline' | 'busy';
  isFavorite?: boolean;
  location?: string;
  languages?: string[];
  experience?: string;
}

export interface ExpertCardProps {
  expert: ExpertCardData;
  onFavoriteToggle?: (expertId: string | number, isFavorite: boolean) => void;
  onCallClick?: (expertId: string | number) => void;
  onChatClick?: (expertId: string | number) => void;
  onBookClick?: (expertId: string | number) => void;
  showActions?: boolean;
}
