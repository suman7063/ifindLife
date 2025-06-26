
export interface SupportRequest {
  id: string;
  user_id: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  admin_notes?: string;
  resolved_at?: string;
}

export interface SupportRequestInsert {
  user_id: string;
  category: string;
  subject: string;
  message: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  admin_notes?: string;
  resolved_at?: string;
}
