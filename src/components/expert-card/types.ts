
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
}

export interface ExpertCardProps {
  expert: ExpertCardData;
  onClick?: () => void;
  className?: string;
}
