
export interface UserTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  type: string;
  status: string;
  created_at: string;
  payment_id: string;
  payment_method: string;
  transaction_type: string;
}

export interface UserReview {
  id?: string;
  expert_id: number;
  user_id?: string;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string | null;
  is_read: boolean | null;
}

// Full Report type from DB
export type Report = {
  id: string;
  expertId: string | number;
  reason: string;
  details?: string;
  date: string;
  status: string;
};

// Input type for inserting a new report
export type NewReport = Omit<Report, 'id' | 'date' | 'status'>;

// Full Review type
export type Review = {
  id: string;
  expertId: string | number;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
};

// Input type for inserting a new review
export type NewReview = Omit<Review, 'id' | 'date'>;
