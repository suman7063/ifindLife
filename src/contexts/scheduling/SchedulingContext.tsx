
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { normalizeId, ensureStringId } from '@/utils/supabaseUtils';

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
    const expertIdStr = ensureStringId(expertId);
    
    try {
      const { data, error } = await supabase
        .from('expert_availabilities')  // Use correct table name: expert_availabilities not expert_availability
        .select('*')
        .eq('expert_id', expertIdStr)
        .eq('start_date', date);

      if (error) {
        console.error('Error fetching expert availability:', error);
        toast.error('Failed to fetch expert availability');
        return;
      }

      // Properly transform data to TimeSlot type
      if (data) {
        // Get time slots for this availability
        const availabilityIds = data.map(item => item.id);
        
        if (availabilityIds.length > 0) {
          const { data: timeSlotsData, error: timeSlotsError } = await supabase
            .from('expert_time_slots')
            .select('*')
            .in('availability_id', availabilityIds);
          
          if (timeSlotsError) {
            console.error('Error fetching time slots:', timeSlotsError);
            setAvailableTimeSlots([]);
            return;
          }
          
          const timeSlots: TimeSlot[] = (timeSlotsData || []).map(item => ({
            id: item.id,
            start_time: item.start_time,
            end_time: item.end_time,
            is_available: !item.is_booked
          }));
          
          setAvailableTimeSlots(timeSlots);
        } else {
          setAvailableTimeSlots([]);
        }
      } else {
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error('Error fetching expert availability:', error);
      toast.error('Failed to fetch expert availability');
      setAvailableTimeSlots([]);
    }
  };

  const bookAppointment = async (expertId: string | number, timeSlotId: string, date: string) => {
    // Convert expert ID to string
    const expertIdStr = ensureStringId(expertId);
    
    try {
      // Get the current user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to book an appointment.');
        return;
      }

      // Get expert data to populate expert_name field
      const { data: expertData, error: expertError } = await supabase
        .from('expert_accounts')
        .select('name')
        .eq('id', expertIdStr)
        .maybeSingle();
        
      if (expertError) {
        console.error('Error getting expert data:', expertError);
        toast.error('Could not retrieve expert information');
        return;
      }

      // Insert the new appointment into the database
      const appointmentData = {
        expert_id: expertIdStr,
        user_id: user.id,
        time_slot_id: timeSlotId,
        appointment_date: date,  // Match field name in database schema
        expert_name: expertData?.name || 'Unknown Expert',
        status: 'scheduled',
        duration: 60 // Default duration of 60 minutes
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (error) {
        console.error('Error booking appointment:', error);
        toast.error('Failed to book appointment');
        return;
      }

      if (data) {
        // Transform the appointment data to match our type
        const newAppointment: Appointment = {
          id: data.id,
          expert_id: data.expert_id,
          user_id: data.user_id,
          time_slot_id: data.time_slot_id,
          date: data.appointment_date
        };
        
        setAppointments([...appointments, newAppointment]);
        
        // Also mark the time slot as booked
        await supabase
          .from('expert_time_slots')
          .update({ is_booked: true })
          .eq('id', timeSlotId);
          
        toast.success('Appointment booked successfully!');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment');
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      // First get the appointment to retrieve the time_slot_id
      const { data: appointmentData, error: fetchError } = await supabase
        .from('appointments')
        .select('time_slot_id')
        .eq('id', appointmentId)
        .single();
        
      if (fetchError) {
        console.error('Error retrieving appointment:', fetchError);
        toast.error('Could not retrieve appointment details');
        return;
      }
      
      // Get the time slot ID
      const timeSlotId = appointmentData.time_slot_id;
      
      // Delete the appointment
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) {
        console.error('Error cancelling appointment:', error);
        toast.error('Failed to cancel appointment');
        return;
      }

      // Mark the time slot as available again
      if (timeSlotId) {
        await supabase
          .from('expert_time_slots')
          .update({ is_booked: false })
          .eq('id', timeSlotId);
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
