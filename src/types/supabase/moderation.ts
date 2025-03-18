
export type ReportReason = 
  | 'inappropriate_behavior'
  | 'false_information'
  | 'unqualified'
  | 'harassment'
  | 'fake_account'
  | 'inappropriate'
  | 'misleading'
  | 'spam'
  | 'other';

export type ReporterType = 'user' | 'expert' | 'admin' | 'system';

export type TargetType = 'user' | 'expert' | 'content' | 'appointment' | 'review';

export type ModerationStatus = 'pending' | 'in_review' | 'dismissed' | 'actioned';

export enum ModerationActionType {
  WARNING = 'warn',
  SUSPENSION = 'suspend',
  BAN = 'ban',
  NO_ACTION = 'dismiss',
  HIDE = 'hide',
  DELETE = 'delete'
}

export interface ReportUI {
  id: string;
  reporterId: string;
  reporterType: ReporterType;
  reporterName: string;
  targetId: string;
  targetType: TargetType;
  targetName: string;
  reason: string | ReportReason;
  details: string;
  status: ModerationStatus;
  date: string;
  sessionId?: string;
}

export interface Report {
  id: string;
  userId: string;
  expertId: string;
  reason: string;
  details: string;
  date: string;
  status: string;
  
  // DB fields for compatibility
  user_id: string;
  expert_id: string;
}
