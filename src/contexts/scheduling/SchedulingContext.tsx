import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { normalizeId } from '@/utils/supabaseUtils';

// Define types for the context
interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface Appointment {
  id: string;
  expert_id: string;
  user_id: string;
  time_slot_id: string;
  date: string;
}

interface SchedulingContextType {
  availableTimeSlots: TimeSlot[];
  appointments: Appointment[];
  fetchExpertAvailability: (expertId: string | number, date: string) => Promise<void>;
  bookAppointment: (expertId: string | number, timeSlotId: string, date: string) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
}

// Create the context
const SchedulingContext = createContext<SchedulingContextType | undefined>(undefined);

// Create the provider component
interface SchedulingProviderProps {
  children: React.ReactNode;
}

export const SchedulingProvider: React.FC<SchedulingProviderProps> = ({ children }) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Update the functions that have type issues with the ID
  const fetchExpertAvailability = async (expertId: string | number, date: string) => {
    // Convert expert ID to string
    const expertIdStr = normalizeId(expertId);
    
    try {
      const { data, error } = await supabase
        .from('expert_availability')
        .select('*')
        .eq('expert_id', expertIdStr)
        .eq('date', date);

      if (error) {
        console.error('Error fetching expert availability:', error);
        toast.error('Failed to fetch expert availability');
        return;
      }

      if (data) {
        setAvailableTimeSlots(data as TimeSlot[]);
      } else {
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error('Error fetching expert availability:', error);
      toast.error('Failed to fetch expert availability');
    }
  };

  const bookAppointment = async (expertId: string | number, timeSlotId: string, date: string) => {
    // Convert expert ID to string
    const expertIdStr = normalizeId(expertId);
    
    try {
      // Get the current user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to book an appointment.');
        return;
      }

      // Insert the new appointment into the database
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          expert_id: expertIdStr,
          user_id: user.id,
          time_slot_id: timeSlotId,
          date: date,
        })
        .select()
        .single();

      if (error) {
        console.error('Error booking appointment:', error);
        toast.error('Failed to book appointment');
        return;
      }

      if (data) {
        setAppointments([...appointments, data as Appointment]);
        toast.success('Appointment booked successfully!');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment');
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) {
        console.error('Error cancelling appointment:', error);
        toast.error('Failed to cancel appointment');
        return;
      }

      setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
      toast.success('Appointment cancelled successfully.');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  // Return the modified functions to the context value
  const value: SchedulingContextType = {
    availableTimeSlots,
    appointments,
    fetchExpertAvailability,
    bookAppointment,
    cancelAppointment,
  };

  return (
    <SchedulingContext.Provider value={value}>
      {children}
    </SchedulingContext.Provider>
  );
};

// Create a custom hook to use the context
export const useScheduling = (): SchedulingContextType => {
  const context = useContext(SchedulingContext);
  if (!context) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }
  return context;
};
