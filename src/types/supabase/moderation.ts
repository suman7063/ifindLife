
import { Expert, User } from './tables';
import { ReporterType, TargetType, ModerationStatus, ModerationActionType } from '@/types/supabase/reviews';

// Moderation Report Types
export type ReportReason = 
  | 'misleading_information'
  | 'off_platform_redirection'  
  | 'inappropriate_behavior'
  | 'bad_behavior'
  | 'foul_language'
  | 'other';

// Re-export enum types for consistency 
export { ModerationStatus as ReportStatus, ModerationActionType };

// Report interface for the UI
export interface ReportUI {
  id: string;
  reporterId: string;
  reporterType: ReporterType;
  reporterName: string;
  targetId: string;
  targetType: TargetType; 
  targetName: string;
  reason: ReportReason;
  details: string;
  status: ModerationStatus;
  date: string;
  sessionId?: string;
}

// Moderation action interface
export interface ModerationAction {
  id: string;
  reportId: string;
  adminId: string;
  adminName: string;
  actionType: ModerationActionType;
  message: string;
  date: string;
  notes?: string;
}

// Database Report interface
export interface ReportDB {
  id: string;
  reporter_id: string;
  reporter_type: 'user' | 'expert';
  target_id: string;
  target_type: 'user' | 'expert';
  reason: string;
  details: string;
  status: string;
  created_at: string;
  session_id?: string;
}

// Database Moderation Action interface
export interface ModerationActionDB {
  id: string;
  report_id: string;
  admin_id: string;
  action_type: string;
  message: string;
  created_at: string;
  notes?: string;
}
