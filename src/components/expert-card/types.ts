
export interface ExpertCardData {
  id: string | number;
  name: string;
  title?: string;
  specialties?: string[];
  specialization?: string; // Added for backward compatibility
  rating?: number;
  reviewCount?: number;
  pricePerMinute?: number;
  profilePicture?: string;
  imageUrl?: string; // Added for backward compatibility
  status?: 'online' | 'offline' | 'busy';
  isFavorite?: boolean;
  location?: string;
  languages?: string[];
  experience?: string | number;
  averageRating?: number; // Added for backward compatibility
  reviewsCount?: number; // Added for backward compatibility
  verified?: boolean; // Added for backward compatibility
  price?: number; // Added for backward compatibility
  waitTime?: string; // Added for backward compatibility
}

export interface ExpertCardProps {
  expert: ExpertCardData;
  onClick?: (expertId: string | number) => void;
  onFavoriteToggle?: (expertId: string | number, isFavorite: boolean) => void;
  onCallClick?: (expertId: string | number) => void;
  onChatClick?: (expertId: string | number) => void;
  onBookClick?: (expertId: string | number) => void;
  showActions?: boolean;
  showRating?: boolean;
  className?: string;
}

export interface ExpertInfoProps {
  expert: ExpertCardData;
  showRating?: boolean;
}

export interface ExpertActionsProps {
  expert: ExpertCardData;
  onClick?: (expertId: string | number) => void;
}
