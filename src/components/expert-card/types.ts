
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
}
