
// Export all types from the supabase folder
export * from './tables';
export * from './user';
export * from './appointments';
export * from './education';
export * from './referrals';
export * from './expertId';

// Use 'export type' to avoid TS1205 errors with types from moderation
export type { 
  ReportReason, 
  Report,
  ReportUI,
  ReporterType,
  TargetType,
  ModerationStatus,
  ModerationActionType
} from './moderation';

// Use 'export type' to avoid TS1205 errors with types from reviews
export type {
  Review,
  ReviewUI
} from './reviews';
