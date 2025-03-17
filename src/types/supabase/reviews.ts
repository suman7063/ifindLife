
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

// ReviewUI is now the same as Review for consistency
export type ReviewUI = Review;

// Report interface for user reports
export interface Report {
  id: string;
  expertId: string;
  reason: string;
  details: string;
  date: string;
  status: string;
  userId?: string;
  userName?: string;
}

// ReportUI type for the admin panel
export type ReportUI = Report;

// Report status enum
export enum ReviewStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}
