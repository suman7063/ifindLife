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
        .in('status', ['scheduled', 'confirmed', 'completed', 'cancelled', 'in-progress', 'pending'])
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });
      
      console.log('📅 useUserAppointments: Fetched', data?.length, 'appointments');
      if (data && data.length > 0) {
        console.log('📅 Sample appointments:', data.slice(0, 5).map(a => ({
          id: a.id,
          date: a.appointment_date,
          time: `${a.start_time} - ${a.end_time}`,
          status: a.status
        })));
      }

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
    try {
      // Handle HH:MM:SS format (take only HH:MM for parsing)
      const startTime = apt.start_time.split(':').slice(0, 2).join(':');
      const appointmentDateTime = new Date(`${apt.appointment_date}T${startTime}`);
      const now = new Date();
      
      // Include if appointment is in the future and not cancelled/completed
      return appointmentDateTime > now && 
             apt.status !== 'cancelled' && 
             apt.status !== 'completed' &&
             (apt.status === 'scheduled' || apt.status === 'confirmed' || apt.status === 'in-progress' || apt.status === 'pending');
    } catch (error) {
      console.error('Error filtering upcoming appointment:', apt.id, error);
      return false;
    }
  });

  // Get past appointments
  const pastAppointments = appointments.filter(apt => {
    try {
      // Handle HH:MM:SS format (take only HH:MM for parsing)
      const endTime = apt.end_time.split(':').slice(0, 2).join(':');
      const appointmentDateTime = new Date(`${apt.appointment_date}T${endTime}`);
      const now = new Date();
      
      // Include if appointment has ended or is completed/cancelled
      return appointmentDateTime < now || 
             apt.status === 'completed' || 
             apt.status === 'cancelled';
    } catch (error) {
      console.error('Error filtering past appointment:', apt.id, error);
      return false;
    }
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