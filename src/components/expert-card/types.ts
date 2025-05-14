
export interface Expert {
  id: number;
  name: string;
  title?: string;
  imageUrl?: string;
  profilePicture?: string; 
  rating?: number;
  reviewCount?: number;
  status?: 'online' | 'offline' | 'busy';
  specialties?: string[];
  price?: number;
}

export interface ExpertCardProps {
  expert: Expert;
  onClick?: () => void;
  className?: string;
  showRating?: boolean;
}

export interface ExpertInfoProps {
  expert: Expert;
  showRating?: boolean;
}

export interface ExpertActionsProps {
  expert: Expert;
  onClick?: () => void;
}
