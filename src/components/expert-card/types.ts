
// Expert card type definitions for consistent use across the application
export interface ExpertCardProps {
  expert: ExpertCardData;
  onClick?: () => void;
  className?: string;
  showRating?: boolean;
}

export interface ExpertCardData {
  id: string | number;
  name: string;
  specialization?: string;
  profilePicture?: string;
  verified?: boolean;
  averageRating?: number;
  reviewsCount?: number;
  status?: 'online' | 'offline' | 'busy';
  // Additional fields for backward compatibility
  imageUrl?: string; // For components using imageUrl instead of profilePicture
  experience?: number | string;
  price?: number;
  waitTime?: string;
  specialties?: string[];
  online?: boolean;
}

export interface ExpertActionsProps {
  expert: ExpertCardData;
  onClick?: () => void;
}

export interface ExpertInfoProps {
  expert: ExpertCardData;
  showRating?: boolean;
}
