
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
      
      // Use a custom query since the tables might not be in the TypeScript definitions yet
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
          
          // Return properly shaped data
          return {
            id: availability.id,
            expert_id: availability.expert_id,
            start_date: availability.start_date,
            end_date: availability.end_date,
            availability_type: availability.availability_type,
            time_slots: timeSlots || []
          } as Availability;
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
      
      const { data, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .in('status', ['pending', 'confirmed', 'cancelled', 'completed']);
      
      if (appointmentsError) throw appointmentsError;
      
      // Filter client-side for now until we update the TypeScript definitions
      let filteredAppointments = data || [];
      
      if (userId) {
        filteredAppointments = filteredAppointments.filter(apt => apt.user_id === userId);
      }
      
      if (expId) {
        filteredAppointments = filteredAppointments.filter(apt => apt.expert_id === expId);
      }
      
      // Map to the correct shape for our interface
      const formattedAppointments = filteredAppointments.map(apt => ({
        id: apt.id,
        expert_id: apt.expert_id,
        user_id: apt.user_id,
        appointment_date: apt.appointment_date,
        start_time: apt.start_time || '00:00',  // Provide defaults
        end_time: apt.end_time || '00:00',      // Provide defaults
        status: apt.status,
        google_calendar_event_id: apt.google_calendar_event_id,
        user_calendar_event_id: apt.user_calendar_event_id,
        notes: apt.notes,
        expert_name: apt.expert_name
      })) as Appointment[];
      
      setAppointments(formattedAppointments);
      return formattedAppointments;
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
        start_time: slot.start_time,
        end_time: slot.end_time,
        day_of_week: slot.day_of_week,
        specific_date: slot.specific_date,
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
      
      // We need to use a custom RPC call to check availability
      // Since the is_time_slot_available function is new, we'll need to handle it manually
      // by checking for overlapping appointments
      const { data: existingAppointments, error: checkError } = await supabase
        .from('appointments')
        .select('*')
        .eq('expert_id', expertId)
        .eq('appointment_date', date)
        .in('status', ['pending', 'confirmed'])
        .or(`start_time.lte.${startTime},end_time.gt.${startTime},start_time.lt.${endTime},end_time.gte.${endTime}`);
      
      if (checkError) throw checkError;
      
      if (existingAppointments && existingAppointments.length > 0) {
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
          notes: notes,
          status: 'pending'
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
