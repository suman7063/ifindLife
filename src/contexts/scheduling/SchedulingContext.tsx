
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';

// Define context types
interface SchedulingContextType {
  isBooking: boolean;
  bookAppointment: (appointmentData: any) => Promise<boolean>;
  cancelAppointment: (appointmentId: string) => Promise<boolean>;
  rescheduleAppointment: (appointmentId: string, newData: any) => Promise<boolean>;
  userAppointments: any[];
  expertAppointments: any[];
  isLoading: boolean;
  loadUserAppointments: () => Promise<void>;
  loadExpertAppointments: () => Promise<void>;
}

// Create context with default values
const SchedulingContext = createContext<SchedulingContextType>({
  isBooking: false,
  bookAppointment: async () => false,
  cancelAppointment: async () => false,
  rescheduleAppointment: async () => false,
  userAppointments: [],
  expertAppointments: [],
  isLoading: false,
  loadUserAppointments: async () => {},
  loadExpertAppointments: async () => {},
});

export const SchedulingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBooking, setIsBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userAppointments, setUserAppointments] = useState<any[]>([]);
  const [expertAppointments, setExpertAppointments] = useState<any[]>([]);
  
  const { user, userProfile, expertProfile } = useAuth();

  // Load user appointments on mount if user is authenticated
  useEffect(() => {
    if (user?.id && userProfile) {
      loadUserAppointments();
    }
  }, [user?.id, userProfile]);

  // Load expert appointments on mount if user is an expert
  useEffect(() => {
    if (user?.id && expertProfile) {
      loadExpertAppointments();
    }
  }, [user?.id, expertProfile]);

  // Function to book a new appointment
  const bookAppointment = async (appointmentData: any): Promise<boolean> => {
    if (!user?.id) {
      toast.error('You must be logged in to book an appointment');
      return false;
    }

    setIsBooking(true);
    try {
      // Ensure we have all required fields including duration
      const completeAppointmentData = {
        ...appointmentData,
        user_id: user.id,
        duration: appointmentData.duration || 30, // Default to 30 minutes if not specified
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert(completeAppointmentData);

      if (error) {
        throw error;
      }

      toast.success('Appointment booked successfully');
      await loadUserAppointments();
      return true;
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast.error(error.message || 'Failed to book appointment');
      return false;
    } finally {
      setIsBooking(false);
    }
  };

  // Function to cancel an appointment
  const cancelAppointment = async (appointmentId: string): Promise<boolean> => {
    if (!user?.id) {
      toast.error('You must be logged in to cancel an appointment');
      return false;
    }

    setIsLoading(true);
    try {
      // First check if the appointment belongs to the user
      const { data: appointmentData, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (appointmentData.user_id !== user.id && appointmentData.expert_id !== user.id) {
        toast.error('You do not have permission to cancel this appointment');
        return false;
      }

      // Update appointment status to cancelled
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (updateError) {
        throw updateError;
      }

      toast.success('Appointment cancelled successfully');
      
      // Reload appropriate appointments based on user role
      if (appointmentData.user_id === user.id) {
        await loadUserAppointments();
      }
      
      if (appointmentData.expert_id === user.id) {
        await loadExpertAppointments();
      }
      
      return true;
    } catch (error: any) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.message || 'Failed to cancel appointment');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reschedule an appointment
  const rescheduleAppointment = async (appointmentId: string, newData: any): Promise<boolean> => {
    if (!user?.id) {
      toast.error('You must be logged in to reschedule an appointment');
      return false;
    }

    setIsLoading(true);
    try {
      // First check if the appointment belongs to the user
      const { data: appointmentData, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (appointmentData.user_id !== user.id && appointmentData.expert_id !== user.id) {
        toast.error('You do not have permission to reschedule this appointment');
        return false;
      }

      // Update appointment with new scheduling data
      const { error: updateError } = await supabase
        .from('appointments')
        .update({
          ...newData,
          status: 'rescheduled'
        })
        .eq('id', appointmentId);

      if (updateError) {
        throw updateError;
      }

      toast.success('Appointment rescheduled successfully');
      
      // Reload appropriate appointments based on user role
      if (appointmentData.user_id === user.id) {
        await loadUserAppointments();
      }
      
      if (appointmentData.expert_id === user.id) {
        await loadExpertAppointments();
      }
      
      return true;
    } catch (error: any) {
      console.error('Error rescheduling appointment:', error);
      toast.error(error.message || 'Failed to reschedule appointment');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load user's appointments
  const loadUserAppointments = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });

      if (error) {
        throw error;
      }

      setUserAppointments(data || []);
    } catch (error: any) {
      console.error('Error loading user appointments:', error);
      toast.error('Failed to load your appointments');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load expert's appointments
  const loadExpertAppointments = async () => {
    if (!user?.id || !expertProfile) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('expert_id', expertProfile.auth_id)
        .order('appointment_date', { ascending: false });

      if (error) {
        throw error;
      }

      setExpertAppointments(data || []);
    } catch (error: any) {
      console.error('Error loading expert appointments:', error);
      toast.error('Failed to load client appointments');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SchedulingContext.Provider
      value={{
        isBooking,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        userAppointments,
        expertAppointments,
        isLoading,
        loadUserAppointments,
        loadExpertAppointments,
      }}
    >
      {children}
    </SchedulingContext.Provider>
  );
};

// Custom hook for using the scheduling context
export const useScheduling = (): SchedulingContextType => {
  const context = useContext(SchedulingContext);
  if (context === undefined) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }
  return context;
};
