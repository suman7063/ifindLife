
export interface NewReview {
  expertId: string;
  rating: number;
  comment: string;
}

export interface NewReport {
  expertId: string;
  reason: string;
  details: string;
}

export interface ReferralUI {
  id: string;
  name: string;
  email: string;
  date: string;
  status: 'pending' | 'completed';
  reward?: number;
  currency?: string;
}

