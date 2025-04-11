
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
  referredId?: string;
  referrerId?: string;
  referredName?: string;
  referrerName?: string;
  referralCode: string;
  status: string;
  created_at?: string;
  completed_at?: string;
  rewardClaimed: boolean;
}
