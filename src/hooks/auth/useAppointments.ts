
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase, from } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { useAgora } from './useAgora';
import { Appointment, AppointmentRow } from '@/types/supabase/appointments';

export const useAppointments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { generateToken, generateChannelName } = useAgora();

  // Fetch user's appointments
  const fetchUserAppointments = async (userId: string) => {
    if (!userId) return [];
    
    setIsLoading(true);
    try {
      // Using a type assertion to specify the expected return type
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
        .order('appointment_date', { ascending: true }) as { data: AppointmentRow[] | null, error: any };
        
      if (error) throw error;
      
      // Transform from snake_case to camelCase
      const formattedAppointments: Appointment[] = (data || []).map(appointment => ({
        id: appointment.id,
        userId: appointment.user_id,
        expertId: appointment.expert_id,
        expertName: appointment.expert_name,
        appointmentDate: appointment.appointment_date,
        duration: appointment.duration,
        status: appointment.status,
        serviceId: appointment.service_id,
        notes: appointment.notes,
        channelName: appointment.channel_name,
        token: appointment.token,
        uid: appointment.uid,
        createdAt: appointment.created_at
      }));
      
      setAppointments(formattedAppointments);
      return formattedAppointments;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load your appointments');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Book a new appointment
  const bookAppointment = async (
    user: UserProfile | null,
    expertId: string,
    expertName: string,
    appointmentDate: string,
    duration: number,
    serviceId?: number,
    notes?: string
  ) => {
    if (!user) {
      toast.error('You must be logged in to book an appointment');
      return null;
    }
    
    setIsLoading(true);
    try {
      // Generate Agora channel information
      const channelName = generateChannelName(expertId, user.id);
      const token = generateToken(channelName);
      const uid = Math.floor(Math.random() * 1000000);
      
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          expert_id: expertId,
          expert_name: expertName,
          appointment_date: appointmentDate,
          duration,
          status: 'scheduled',
          service_id: serviceId,
          notes,
          channel_name: channelName,
          token: token,
          uid: uid
        })
        .select() as { data: AppointmentRow[] | null, error: any };
        
      if (error) throw error;
      
      toast.success(`Appointment with ${expertName} booked successfully`);
      
      // Transform to camelCase
      const appointment: Appointment = {
        id: data?.[0].id ?? '',
        userId: data?.[0].user_id ?? '',
        expertId: data?.[0].expert_id ?? '',
        expertName: data?.[0].expert_name ?? '',
        appointmentDate: data?.[0].appointment_date ?? '',
        duration: data?.[0].duration ?? 0,
        status: data?.[0].status ?? 'scheduled',
        serviceId: data?.[0].service_id,
        notes: data?.[0].notes,
        channelName: data?.[0].channel_name,
        token: data?.[0].token,
        uid: data?.[0].uid,
        createdAt: data?.[0].created_at ?? new Date().toISOString()
      };
      
      return appointment;
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel an appointment
  const cancelAppointment = async (appointmentId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId) as { error: any };
        
      if (error) throw error;
      
      toast.success('Appointment cancelled successfully');
      return true;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    appointments,
    fetchUserAppointments,
    bookAppointment,
    cancelAppointment
  };
};
