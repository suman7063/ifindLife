
export interface ExpertCardData {
  id: string;
  auth_id?: string; // Supabase auth ID
  name: string;
  email?: string; // Make email optional to fix type compatibility
  specialization: string;
  profilePicture?: string;
  averageRating: number;
  reviewsCount: number;
  verified: boolean;
  status: 'online' | 'offline';
  experience: number;
  price: number;
  waitTime: string;
  category?: string; // Expert category for duration filtering
  // Additional optional properties for compatibility
  title?: string;
  rating?: number;
  reviewCount?: number;
  dbStatus?: string; // Database status field (approved, pending, etc.)
}

export interface ExpertActionsProps {
  expert: ExpertCardData;
  onClick?: (expertId: string) => void;
}

export interface ExpertInfoProps {
  expert: ExpertCardData;
  showRating?: boolean;
}
