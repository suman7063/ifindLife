
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';

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
}

export const useAppointments = (currentUser: UserProfile | null, expertId?: string) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch expert availabilities
  const fetchAvailabilities = async (expertId: string) => {
    try {
      setLoading(true);
      
      // Fetch availabilities
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('expert_availability')
        .select('*')
        .eq('expert_id', expertId);
      
      if (availabilityError) throw availabilityError;
      
      // For each availability, fetch time slots
      const availabilitiesWithSlots = await Promise.all(
        availabilityData.map(async (availability) => {
          const { data: timeSlots, error: timeSlotsError } = await supabase
            .from('expert_time_slots')
            .select('*')
            .eq('availability_id', availability.id);
          
          if (timeSlotsError) throw timeSlotsError;
          
          return {
            ...availability,
            time_slots: timeSlots || []
          };
        })
      );
      
      setAvailabilities(availabilitiesWithSlots);
      return availabilitiesWithSlots;
    } catch (error: any) {
      console.error('Error fetching availabilities:', error);
      setError(error.message);
      toast.error('Failed to load expert availabilities');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments
  const fetchAppointments = async (userId?: string, expId?: string) => {
    try {
      setLoading(true);
      
      let query = supabase.from('appointments').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      if (expId) {
        query = query.eq('expert_id', expId);
      }
      
      const { data, error: appointmentsError } = await query;
      
      if (appointmentsError) throw appointmentsError;
      
      setAppointments(data || []);
      return data || [];
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      setError(error.message);
      toast.error('Failed to load appointments');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create availability
  const createAvailability = async (
    expertId: string, 
    startDate: string, 
    endDate: string, 
    availabilityType: 'date_range' | 'recurring',
    timeSlots: Omit<TimeSlot, 'id' | 'availability_id'>[]
  ) => {
    try {
      setLoading(true);
      
      // Insert availability
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('expert_availability')
        .insert({
          expert_id: expertId,
          start_date: startDate,
          end_date: endDate,
          availability_type: availabilityType
        })
        .select()
        .single();
      
      if (availabilityError) throw availabilityError;
      
      // Insert time slots
      const formattedTimeSlots = timeSlots.map(slot => ({
        ...slot,
        availability_id: availabilityData.id
      }));
      
      const { data: slotsData, error: slotsError } = await supabase
        .from('expert_time_slots')
        .insert(formattedTimeSlots)
        .select();
      
      if (slotsError) throw slotsError;
      
      // Fetch updated availabilities
      await fetchAvailabilities(expertId);
      
      toast.success('Availability created successfully');
      return { availability: availabilityData, slots: slotsData };
    } catch (error: any) {
      console.error('Error creating availability:', error);
      setError(error.message);
      toast.error('Failed to create availability');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Book appointment
  const bookAppointment = async (
    expertId: string,
    userId: string,
    date: string,
    startTime: string,
    endTime: string,
    timeSlotId?: string,
    notes?: string
  ) => {
    try {
      setLoading(true);
      
      // Check if the slot is available using our custom function
      const { data: availabilityCheck, error: availabilityError } = await supabase
        .rpc('is_time_slot_available', {
          p_expert_id: expertId,
          p_date: date,
          p_start_time: startTime,
          p_end_time: endTime
        });
      
      if (availabilityError) throw availabilityError;
      
      if (!availabilityCheck) {
        toast.error('This time slot is no longer available');
        return null;
      }
      
      // Insert appointment
      const { data, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          expert_id: expertId,
          user_id: userId,
          appointment_date: date,
          start_time: startTime,
          end_time: endTime,
          time_slot_id: timeSlotId,
          notes
        })
        .select()
        .single();
      
      if (appointmentError) throw appointmentError;
      
      // Refresh appointments
      await fetchAppointments(userId, expertId);
      
      toast.success('Appointment booked successfully');
      return data;
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      setError(error.message);
      toast.error('Failed to book appointment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh appointments
      if (currentUser) {
        if (expertId) {
          await fetchAppointments(undefined, expertId);
        } else {
          await fetchAppointments(currentUser.id);
        }
      }
      
      toast.success(`Appointment ${status} successfully`);
      return data;
    } catch (error: any) {
      console.error('Error updating appointment:', error);
      setError(error.message);
      toast.error('Failed to update appointment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      if (expertId) {
        fetchAvailabilities(expertId);
        fetchAppointments(undefined, expertId);
      } else {
        fetchAppointments(currentUser.id);
      }
    }
  }, [currentUser, expertId]);

  return {
    availabilities,
    appointments,
    loading,
    error,
    fetchAvailabilities,
    fetchAppointments,
    createAvailability,
    bookAppointment,
    updateAppointmentStatus
  };
};
