
export interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  userId: string;
  expertId: string;
  userName: string;
  expertName: string;
  verified: boolean;
}

// Review UI interface for the admin panel
export interface ReviewUI {
  id: string;
  userId: string;
  userName: string;
  expertId: string;
  expertName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}
