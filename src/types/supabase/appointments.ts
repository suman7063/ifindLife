
export interface Appointment {
  id: string;
  userId: string;
  expertId: string;
  serviceId: number;
  appointmentDate: string;
  duration: number;
  status: AppointmentStatus;
  price?: number;
  currency?: string;
  notes?: string;
  channelName?: string;
  token?: string;
  uid?: number;
  expertName: string;
  actualDuration?: number;
  extensionCount?: number;
  refunded?: boolean;
  createdAt: string;
}

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW_USER = "no-show-user",
  NO_SHOW_EXPERT = "no-show-expert"
}

export interface TimeSlot {
  id: string;
  expertId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface AppointmentInsert {
  id?: string;
  userId: string;
  expertId: string;
  serviceId: number;
  appointmentDate: string;
  duration: number;
  status: AppointmentStatus;
  price?: number;
  currency?: string;
  notes?: string;
  expertName: string;
}
