
// Types for Supabase table operations
export interface NewReview {
  user_id: string;
  expert_id: number | string;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
}

export interface NewReport {
  user_id: string;
  expert_id: number | string;
  reason: string;
  details?: string;
  date: string;
  status: string;
}

export interface NewTransaction {
  user_id: string;
  amount: number;
  date: string;
  type: string;
  currency: string;
  description?: string;
}
