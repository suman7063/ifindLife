
// Shared type definitions to ensure consistency

// Make ReferralUI type available for imports
export interface ReferralUI {
  id: string;
  referredName: string;
  status: string;
  rewardClaimed: boolean;
  created_at?: string;
}

// Define NewReport type
export interface NewReport {
  expertId: string; // Ensure this is string only, not string | number
  reason: string;
  details: string;
}

// Define NewReview type
export interface NewReview {
  expertId: string; // Ensure this is string only, not string | number
  rating: number;
  comment: string;
}
