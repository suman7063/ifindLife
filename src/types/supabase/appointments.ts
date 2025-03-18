
export interface Appointment {
  id: string;
  userId: string;
  expertId: string;
  expertName: string;
  appointmentDate: string; // ISO string
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  serviceId?: number;
  notes?: string;
  channelName?: string;
  token?: string;
  uid?: number;
  createdAt: string;
}

// Format for the Supabase database
export interface AppointmentRow {
  id: string;
  user_id: string;
  expert_id: string;
  expert_name: string;
  appointment_date: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  service_id?: number;
  notes?: string;
  channel_name?: string;
  token?: string;
  uid?: number;
  created_at: string;
}
