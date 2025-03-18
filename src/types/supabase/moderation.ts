
// Define the enums for moderation
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

// Define the type for report reasons
export enum ReportReason {
  MISLEADING_INFORMATION = 'misleading_information',
  OFF_PLATFORM_REDIRECTION = 'off_platform_redirection',
  INAPPROPRIATE_BEHAVIOR = 'inappropriate_behavior',
  BAD_BEHAVIOR = 'bad_behavior',
  FOUL_LANGUAGE = 'foul_language',
  OTHER = 'other'
}

export interface ReportUI {
  id: string;
  reporterId: string;
  reporterType: ReporterType;
  reporterName: string;
  targetId: string;
  targetType: TargetType;
  targetName: string;
  reason: ReportReason | string;
  details: string;
  status: ModerationStatus;
  date: string;
  sessionId?: string;
}

export interface ModerateRequestUI {
  reportId: string;
  adminId: string;
  actionType: ModerationActionType;
  message: string;
  notes?: string;
}

export type ModerationType = ModerationActionType;
