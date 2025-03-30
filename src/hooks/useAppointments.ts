
import { UserProfile } from '@/types/supabase';
import { useAvailabilityManagement } from './useAvailabilityManagement';
import { useAppointmentManagement } from './useAppointmentManagement';
import type { TimeSlot, Availability, Appointment } from '@/types/appointments';

// Re-export the types
export type { TimeSlot, Availability, Appointment };

// Combined hook for backward compatibility
export const useAppointments = (currentUser: UserProfile | null, expertId?: string) => {
  const availabilityManager = useAvailabilityManagement(currentUser);
  const appointmentManager = useAppointmentManagement(currentUser, expertId);

  return {
    // From availability management
    availabilities: availabilityManager.availabilities,
    fetchAvailabilities: availabilityManager.fetchAvailabilities,
    createAvailability: availabilityManager.createAvailability,
    deleteAvailability: availabilityManager.deleteAvailability,
    
    // From appointment management
    appointments: appointmentManager.appointments,
    fetchAppointments: appointmentManager.fetchAppointments,
    bookAppointment: appointmentManager.bookAppointment,
    updateAppointmentStatus: appointmentManager.updateAppointmentStatus,
    
    // Shared properties
    loading: availabilityManager.loading || appointmentManager.loading,
    error: availabilityManager.error || appointmentManager.error
  };
};
