
export interface ExpertCardData {
  id: string;
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
}
