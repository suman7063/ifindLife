
import { 
  ReporterType, 
  TargetType, 
  ModerationStatus, 
  ModerationActionType 
} from '@/types/supabase/reviews';

export interface ReportUI {
  id: string;
  reporterId: string;
  reporterType: ReporterType;
  reporterName: string;
  targetId: string;
  targetType: TargetType;
  targetName: string;
  reason: string;
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
