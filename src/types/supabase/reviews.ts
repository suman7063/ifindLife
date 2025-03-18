
export interface Review {
  id: string;
  expertId: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  userId: string;
  userName: string;
  expertName: string;
}

// Alias for Review to maintain compatibility with existing code
export type ReviewUI = Review;

export interface Report {
  id: string;
  expertId: string;
  reason: string;
  details: string;
  date: string;
  status: string;
  userId: string;
  userName: string;
}

// Moderation related types
export enum ReporterType {
  USER = 'user',
  EXPERT = 'expert',
  SYSTEM = 'system'
}

export enum TargetType {
  USER = 'user',
  EXPERT = 'expert',
  REVIEW = 'review',
  APPOINTMENT = 'appointment'
}

export enum ModerationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed'
}

export enum ModerationActionType {
  WARNING = 'warning',
  SUSPENSION = 'suspension',
  BAN = 'ban',
  CONTENT_REMOVAL = 'content_removal',
  NO_ACTION = 'no_action'
}

// New interface for the review status
export interface ReviewStatus {
  canReview: boolean;
  hasReviewed: boolean;
}
