import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserAppointment {
  id: string;
  expert_id: string;
  expert_name: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  status: string;
  notes?: string;
  service_id?: number;
  channel_name?: string;
  created_at: string;
}

export const useUserAppointments = (userId?: string) => {
  const [appointments, setAppointments] = useState<UserAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select(`
          id,
          expert_id,
          expert_name,
          appointment_date,
          start_time,
          end_time,
          duration,
          status,
          notes,
          service_id,
          channel_name,
          created_at
        `)
        .eq('user_id', userId)
        .order('appointment_date', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      // Update local state
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: newStatus }
            : apt
        )
      );

      toast.success('Appointment updated successfully');
    } catch (err) {
      console.error('Error updating appointment:', err);
      toast.error('Failed to update appointment');
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    await updateAppointmentStatus(appointmentId, 'cancelled');
  };

  const rescheduleAppointment = async (appointmentId: string) => {
    // This would typically open a reschedule modal
    toast.info('Reschedule functionality coming soon');
  };

  // Get upcoming appointments (today and future)
  const upcomingAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(apt.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate >= today && apt.status !== 'cancelled' && apt.status !== 'completed';
  });

  // Get past appointments
  const pastAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(apt.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate < today || apt.status === 'completed' || apt.status === 'cancelled';
  });

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  return {
    appointments,
    upcomingAppointments,
    pastAppointments,
    loading,
    error,
    refetch: fetchAppointments,
    cancelAppointment,
    rescheduleAppointment,
    updateAppointmentStatus
  };
};