
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

// Define proper ReviewStatus interface as an object, not an enum
export interface ReviewStatus {
  canReview: boolean;
  hasReviewed: boolean;
}

// Report status values as an enum
export enum ReportStatusValues {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

// Moderation types
export type ReporterType = 'user' | 'expert';
export type TargetType = 'user' | 'expert';
export type ModerationActionType = 'warning' | 'suspension' | 'ban' | 'no_action';
export type ModerationStatus = 'pending' | 'under_review' | 'resolved' | 'dismissed';
