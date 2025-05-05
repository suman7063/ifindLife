
export interface HelpTicket {
  id: string;
  ticket_id: string;
  user_id: string;
  category: string;
  details: string;
  screenshot_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  admin_notes: string | null;
  resolved_at: string | null;
  user_name?: string;
  user_email?: string;
}
