
// Define database review type to avoid excessive type inference
export interface DbReview {
  id: string;
  expert_id: number;
  rating: number;
  comment: string | null;
  date: string;
  verified: boolean | null;
  user_id: string;
  user_name: string | null;
}

// Define the structure returned by our RPC function
export interface UserReviewWithExpert {
  review_id: string;
  expert_id: number;
  rating: number;
  comment: string | null;
  date: string;
  verified: boolean | null;
  user_name: string | null;
  expert_name: string | null;
}

// Define service status return type
export interface ReviewsResult {
  success: boolean;
  reviews: import('@/types/supabase/reviews').Review[];
}
