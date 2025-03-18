
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show-user' | 'no-show-expert';

export interface Appointment {
  id: string;
  // Snake case for DB compatibility
  user_id: string;
  expert_id: string;
  expert_name: string;
  appointment_date: string;
  duration: number;
  status: AppointmentStatus;
  service_id: number;
  notes: string | null;
  channel_name: string | null;
  token: string | null;
  uid: number | null;
  created_at: string;
  price?: number;
  currency?: string;
  extension_count?: number;
  actual_duration?: number;
  refunded?: boolean;
  calendar_event_id?: string;
  
  // Camel case for UI compatibility
  userId?: string;
  expertId?: string;
  expertName?: string;
  appointmentDate?: string;
  serviceId?: number;
  channelName?: string;
  extensionCount?: number;
  actualDuration?: number;
  calendarEventId?: string;
}

export interface AppointmentInsert {
  user_id: string;
  expert_id: string;
  expert_name: string;
  appointment_date: string;
  duration: number;
  status: AppointmentStatus;
  service_id: number;
  notes?: string;
  channel_name?: string;
  token?: string;
  uid?: number;
  price?: number;
  currency?: string;
}

export interface AppointmentUpdate extends Partial<AppointmentInsert> {
  id?: string;
  extension_count?: number;
  actual_duration?: number;
  refunded?: boolean;
  calendar_event_id?: string;
}

export interface TimeSlot {
  id: string;
  expertId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}
