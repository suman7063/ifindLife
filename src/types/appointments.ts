
/**
 * Types related to appointments, availability, and time slots
 */

export interface TimeSlot {
  id: string;
  availability_id: string;
  start_time: string;
  end_time: string;
  day_of_week?: number;
  specific_date?: string;
  is_booked?: boolean;
  created_at?: string;
}

export interface Availability {
  id: string;
  expert_id: string;
  start_date: string;
  end_date: string;
  availability_type: 'date_range' | 'recurring';
  time_slots: TimeSlot[];
  created_at?: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  expert_id: string;
  duration: number;
  service_id?: number;
  uid?: number;
  appointment_date: string;
  start_time?: string;
  end_time?: string;
  time_slot_id?: string;
  expert_name: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  channel_name?: string;
  token?: string;
  google_calendar_event_id?: string;
  user_calendar_event_id?: string;
  created_at: string;
}

// Also include the Message type here as it's related to appointments
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}
