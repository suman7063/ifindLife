
export interface Appointment {
  id: string;
  user_id: string;
  expert_id: string;
  duration: number;
  service_id?: number;
  uid?: number;
  created_at: string;
  start_time?: string;
  end_time?: string;
  time_slot_id?: string;
  expert_name: string;
  appointment_date: string;
  status: AppointmentStatus;
  notes?: string;
  channel_name?: string;
  token?: string;
  google_calendar_event_id?: string;
  user_calendar_event_id?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';

export interface AppointmentWithExpertDetails extends Appointment {
  expert: {
    name: string;
    profile_picture?: string;
    specialization?: string;
  };
}
