
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useAvailabilityManagement } from '@/hooks/useAvailabilityManagement';
import { useAppointmentManagement } from '@/hooks/useAppointmentManagement';
import type { Availability, Appointment, TimeSlot } from '@/types/appointments';
import { toast } from 'sonner';

interface SchedulingContextType {
  // Data
  availabilities: Availability[];
  appointments: Appointment[];
  
  // State
  loading: boolean;
  error: string | null;
  
  // Expert actions
  createAvailability: (
    startDate: string,
    endDate: string,
    availabilityType: 'date_range' | 'recurring',
    timeSlots: Omit<TimeSlot, 'id' | 'availability_id'>[]
  ) => Promise<{ availability: string } | null>;
  
  deleteAvailability: (availabilityId: string) => Promise<boolean>;
  
  // User actions
  bookAppointment: (
    expertId: string,
    date: string,
    startTime: string,
    endTime: string,
    timeSlotId?: string,
    notes?: string
  ) => Promise<string | null>;
  
  // Shared actions
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => Promise<any>;
  
  // Refresh functions
  refreshAvailabilities: () => Promise<Availability[]>;
  refreshAppointments: () => Promise<Appointment[]>;
  
  // Utility functions
  isTimeSlotAvailable: (timeSlotId: string) => boolean;
  getUpcomingAppointments: () => Appointment[];
}

const SchedulingContext = createContext<SchedulingContextType | undefined>(undefined);

export const SchedulingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile, expertProfile, isAuthenticated } = useAuth();
  const availabilityManager = useAvailabilityManagement(userProfile);
  const appointmentManager = useAppointmentManagement(userProfile);
  
  const [initialized, setInitialized] = useState(false);
  
  // Initialize data
  useEffect(() => {
    const initData = async () => {
      if (isAuthenticated && user?.id) {
        if (expertProfile) {
          // Load expert availabilities and appointments
          // Ensure id is always treated as a string
          await availabilityManager.fetchAvailabilities(String(expertProfile.id));
          await appointmentManager.fetchAppointments(undefined, String(expertProfile.id));
        } else if (userProfile) {
          // Load user appointments
          await appointmentManager.fetchAppointments(userProfile.id);
        }
        setInitialized(true);
      }
    };
    
    initData();
  }, [isAuthenticated, user?.id, expertProfile, userProfile]);
  
  // Expert actions
  const createAvailability = async (
    startDate: string,
    endDate: string,
    availabilityType: 'date_range' | 'recurring',
    timeSlots: Omit<TimeSlot, 'id' | 'availability_id'>[]
  ) => {
    if (!expertProfile) {
      toast.error('You must be logged in as an expert to create availability');
      return null;
    }
    
    return availabilityManager.createAvailability(
      String(expertProfile.id),
      startDate,
      endDate,
      availabilityType,
      timeSlots
    );
  };
  
  const deleteAvailability = async (availabilityId: string) => {
    if (!expertProfile) {
      toast.error('You must be logged in as an expert to delete availability');
      return false;
    }
    
    return availabilityManager.deleteAvailability(availabilityId);
  };
  
  // User actions
  const bookAppointment = async (
    expertId: string,
    date: string,
    startTime: string,
    endTime: string,
    timeSlotId?: string,
    notes?: string
  ) => {
    if (!userProfile) {
      toast.error('You must be logged in to book an appointment');
      return null;
    }
    
    return appointmentManager.bookAppointment(
      expertId,
      userProfile.id,
      date,
      startTime,
      endTime,
      timeSlotId,
      notes
    );
  };
  
  // Shared actions
  const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']) => {
    return appointmentManager.updateAppointmentStatus(appointmentId, status);
  };
  
  // Refresh functions
  const refreshAvailabilities = async () => {
    if (!expertProfile) return [];
    return availabilityManager.fetchAvailabilities(String(expertProfile.id));
  };
  
  const refreshAppointments = async () => {
    if (!userProfile) return [];
    
    if (expertProfile) {
      return appointmentManager.fetchAppointments(undefined, String(expertProfile.id));
    } else {
      return appointmentManager.fetchAppointments(userProfile.id);
    }
  };
  
  // Utility functions
  const isTimeSlotAvailable = (timeSlotId: string) => {
    const appointments = appointmentManager.appointments;
    return !appointments.some(apt => apt.time_slot_id === timeSlotId);
  };
  
  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointmentManager.appointments
      .filter(apt => {
        const appointmentDate = new Date(`${apt.appointment_date}T${apt.start_time}`);
        return appointmentDate > now && apt.status !== 'cancelled';
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.appointment_date}T${a.start_time}`);
        const dateB = new Date(`${b.appointment_date}T${b.start_time}`);
        return dateA.getTime() - dateB.getTime();
      });
  };
  
  const value: SchedulingContextType = {
    // Data
    availabilities: availabilityManager.availabilities,
    appointments: appointmentManager.appointments,
    
    // State
    loading: availabilityManager.loading || appointmentManager.loading,
    error: availabilityManager.error || appointmentManager.error,
    
    // Expert actions
    createAvailability,
    deleteAvailability,
    
    // User actions
    bookAppointment,
    
    // Shared actions
    updateAppointmentStatus,
    
    // Refresh functions
    refreshAvailabilities,
    refreshAppointments,
    
    // Utility functions
    isTimeSlotAvailable,
    getUpcomingAppointments
  };
  
  return (
    <SchedulingContext.Provider value={value}>
      {children}
    </SchedulingContext.Provider>
  );
};

export const useScheduling = () => {
  const context = useContext(SchedulingContext);
  if (context === undefined) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }
  return context;
};
