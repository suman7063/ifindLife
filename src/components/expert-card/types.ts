
export interface ExpertCardData {
  id: string | number;
  name: string;
  specialization?: string;
  averageRating?: number;
  reviewsCount?: number;
  verified?: boolean;
  profilePicture?: string;
  status?: 'online' | 'offline' | 'busy';
  experience?: number;
  price?: number;
  waitTime?: string;
  bio?: string;
  languages?: string[];
  qualifications?: string[];
  // Alternative naming for backward compatibility
  title?: string;
  rating?: number;
  reviewCount?: number;
}

export interface ExpertCardProps {
  expert: ExpertCardData;
  onClick?: () => void;
  className?: string;
}

// Add the missing ExpertActionsProps interface
export interface ExpertActionsProps {
  expert: ExpertCardData;
  onClick?: (id: string | number) => void;
}

// Add the missing ExpertInfoProps interface
export interface ExpertInfoProps {
  expert: ExpertCardData;
  showRating?: boolean;
}
