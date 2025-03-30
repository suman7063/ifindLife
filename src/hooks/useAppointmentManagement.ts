
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Appointment } from '@/types/appointments';
import { UserProfile } from '@/types/supabase';

export const useAppointmentManagement = (currentUser: UserProfile | null, expertId?: string) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        start_time: apt.start_time || '00:00',
        end_time: apt.end_time || '00:00',
        status: apt.status,
        google_calendar_event_id: apt.google_calendar_event_id,
        user_calendar_event_id: apt.user_calendar_event_id,
        notes: apt.notes,
        expert_name: apt.expert_name,
        time_slot_id: apt.time_slot_id
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
      
      // Update state with the new status
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status } : apt
        )
      );
      
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

  // Load appointments when component mounts
  useEffect(() => {
    if (currentUser) {
      if (expertId) {
        fetchAppointments(undefined, expertId);
      } else {
        fetchAppointments(currentUser.id);
      }
    }
  }, [currentUser, expertId]);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    bookAppointment,
    updateAppointmentStatus
  };
};
