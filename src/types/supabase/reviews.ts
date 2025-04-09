export interface Review {
  id: string;
  expertId: string;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
}

export interface Report {
  id: string;
  expertId: string;
  reason: string;
  details?: string;
  date: string;
  status: string;
}

export interface UserReview {
  id?: string;
  expert_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
}
