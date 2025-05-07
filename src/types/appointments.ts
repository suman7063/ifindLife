
export interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  day_of_week?: number;
  specific_date?: string;
  availability_id: string;
  is_booked?: boolean;
}

export interface Availability {
  id: string;
  expert_id: string;
  start_date: string;
  end_date: string;
  availability_type: 'date_range' | 'recurring';
  time_slots?: TimeSlot[];
}

export interface Appointment {
  id: string;
  expert_id: string;
  user_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  google_calendar_event_id?: string;
  user_calendar_event_id?: string;
  notes?: string;
  expert_name?: string;
  user_name?: string;
  time_slot_id?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

