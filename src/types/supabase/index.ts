
// Export all types from the supabase folder
export * from './tables';
export * from './user';
export * from './appointments';
export * from './education';
export * from './referrals';
export * from './expertId';
export * from './transaction';
export * from './userObjects';
export * from './moderation';

// Use 'export type' to avoid TS1205 errors with types from reviews
export type {
  Review,
  ReviewUI
} from './reviews';

// Re-export ReferralSettings to resolve ambiguity
export type { ReferralSettings } from './tables';
