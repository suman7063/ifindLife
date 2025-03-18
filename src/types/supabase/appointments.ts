
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show-user' | 'no-show-expert';

export interface Appointment {
  id: string;
  userId: string;
  expertId: string;
  expertName: string;
  appointmentDate: string; // ISO string
  duration: number; // in minutes
  status: AppointmentStatus;
  serviceId?: number;
  notes?: string;
  channelName?: string;
  token?: string;
  uid?: number;
  createdAt: string;
  price?: number;
  currency?: string;
  extensionCount?: number;
  actualDuration?: number;
  refunded?: boolean;
  calendarEventId?: string;
}

// Format for the Supabase database
export interface AppointmentRow {
  id: string;
  user_id: string;
  expert_id: string;
  expert_name: string;
  appointment_date: string;
  duration: number;
  status: AppointmentStatus;
  service_id?: number;
  notes?: string;
  channel_name?: string;
  token?: string;
  uid?: number;
  created_at: string;
  price?: number;
  currency?: string;
  extension_count?: number;
  actual_duration?: number;
  refunded?: boolean;
  calendar_event_id?: string;
}
