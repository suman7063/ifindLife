
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { from } from '@/lib/supabase'; // Add this import for type-safe custom table access
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
      
      // Use raw query approach for the tables not in TypeScript definitions
      const { data: availabilityData, error: availabilityError } = await supabase
        .rpc('query_expert_availability', { expert_id_param: expertId });
      
      if (availabilityError) throw availabilityError;
      
      if (!availabilityData || availabilityData.length === 0) {
        setAvailabilities([]);
        return [];
      }

      // For each availability, fetch time slots using a custom query
      const availabilitiesWithSlots = await Promise.all(
        availabilityData.map(async (availability: any) => {
          const { data: timeSlots, error: timeSlotsError } = await supabase
            .rpc('query_expert_time_slots', { availability_id_param: availability.id });
          
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
      
      let query = supabase.from('appointments').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      if (expId) {
        query = query.eq('expert_id', expId);
      }
      
      const { data, error: appointmentsError } = await query
        .in('status', ['pending', 'confirmed', 'cancelled', 'completed']);
      
      if (appointmentsError) throw appointmentsError;
      
      // Map to the correct shape for our interface
      const formattedAppointments = (data || []).map(apt => ({
        id: apt.id,
        expert_id: apt.expert_id,
        user_id: apt.user_id,
        appointment_date: apt.appointment_date,
        start_time: apt.start_time || '00:00',  // These fields will be added to the table
        end_time: apt.end_time || '00:00',      // These fields will be added to the table
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
      
      // Insert availability using RPC
      const { data: availabilityData, error: availabilityError } = await supabase
        .rpc('create_expert_availability', {
          p_expert_id: expertId,
          p_start_date: startDate,
          p_end_date: endDate,
          p_availability_type: availabilityType
        });
      
      if (availabilityError) throw availabilityError;
      
      if (!availabilityData) {
        throw new Error('Failed to create availability');
      }
      
      const availabilityId = availabilityData;
      
      // Insert time slots using RPC for each slot
      for (const slot of timeSlots) {
        const { error: slotError } = await supabase
          .rpc('create_expert_time_slot', {
            p_availability_id: availabilityId,
            p_start_time: slot.start_time,
            p_end_time: slot.end_time,
            p_day_of_week: slot.day_of_week,
            p_specific_date: slot.specific_date
          });
        
        if (slotError) throw slotError;
      }
      
      // Fetch updated availabilities
      await fetchAvailabilities(expertId);
      
      toast.success('Availability created successfully');
      return { availability: availabilityId };
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
      
      // Check availability using RPC
      const { data: isAvailable, error: checkError } = await supabase
        .rpc('is_time_slot_available', {
          p_expert_id: expertId,
          p_date: date,
          p_start_time: startTime,
          p_end_time: endTime
        });
      
      if (checkError) throw checkError;
      
      if (!isAvailable) {
        toast.error('This time slot is no longer available');
        return null;
      }
      
      // Insert appointment using RPC
      const { data: appointmentId, error: appointmentError } = await supabase
        .rpc('create_appointment', {
          p_expert_id: expertId,
          p_user_id: userId,
          p_appointment_date: date,
          p_start_time: startTime,
          p_end_time: endTime,
          p_time_slot_id: timeSlotId,
          p_notes: notes
        });
      
      if (appointmentError) throw appointmentError;
      
      // Refresh appointments
      await fetchAppointments(userId, expertId);
      
      toast.success('Appointment booked successfully');
      return appointmentId;
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
        .rpc('update_appointment_status', {
          p_appointment_id: appointmentId,
          p_status: status
        });
      
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
