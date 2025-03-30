
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Appointment } from '@/types/appointments';
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
      
      // First check if time slot is available
      if (timeSlotId) {
        const { data: slots, error: checkError } = await supabase
          .from('expert_time_slots')
          .select('*')
          .eq('id', timeSlotId)
          .eq('is_booked', false);
        
        if (checkError) throw checkError;
        
        if (!slots || slots.length === 0) {
          toast.error('This time slot is no longer available');
          return null;
        }
      }
      
      // Insert new appointment
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
          status: 'pending',
          duration: 60 // Default to 60 minutes if not specified
        })
        .select()
        .single();
      
      if (appointmentError) throw appointmentError;
      
      // Mark time slot as booked if provided
      if (timeSlotId) {
        const { error: updateError } = await supabase
          .from('expert_time_slots')
          .update({ is_booked: true })
          .eq('id', timeSlotId);
        
        if (updateError) throw updateError;
      }
      
      // Refresh appointments
      await fetchAppointments(userId, expertId);
      
      toast.success('Appointment booked successfully');
      return data.id;
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
