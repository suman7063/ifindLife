
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase, tables } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { Appointment, AppointmentStatus } from '@/types/supabase/appointments';
import { useAgora } from './useAgora';

export const useAppointments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { generateToken, generateChannelName } = useAgora();
  
  // Book a new appointment
  const bookAppointment = async (
    user: UserProfile,
    expertId: string,
    expertName: string, 
    appointmentDate: string, 
    duration: number,
    price: number,
    currency: string,
    serviceId: number = 1,
    notes?: string
  ) => {
    if (!user || !user.id) {
      toast.error('You must be logged in to book an appointment');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Generate a unique channel name for this appointment
      const channelName = generateChannelName(expertId, user.id);
      
      // Generate a token for the user to join the channel
      const token = generateToken(channelName);
      
      // Generate a random UID for the user
      const uid = Math.floor(Math.random() * 1000000);
      
      // Insert the appointment into the database
      const appointmentData = {
        userId: user.id,
        expertId: expertId,
        expertName: expertName,
        appointmentDate: appointmentDate,
        duration: duration,
        status: AppointmentStatus.SCHEDULED,
        serviceId: serviceId,
        channelName: channelName,
        token: token,
        uid: uid,
        price: price,
        currency: currency,
        notes: notes
      };

      // Convert UI format to DB format
      const dbAppointmentData = {
        user_id: appointmentData.userId,
        expert_id: appointmentData.expertId,
        expert_name: appointmentData.expertName,
        appointment_date: appointmentData.appointmentDate,
        duration: appointmentData.duration,
        status: appointmentData.status,
        service_id: appointmentData.serviceId,
        channel_name: appointmentData.channelName,
        token: appointmentData.token,
        uid: appointmentData.uid,
        price: appointmentData.price,
        currency: appointmentData.currency,
        notes: appointmentData.notes
      };
      
      const { data, error } = await tables.appointments()
        .insert(dbAppointmentData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Deduct the amount from user's wallet (implement this logic)
      // ...
      
      toast.success('Appointment booked successfully!');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to book appointment');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch user's appointments
  const fetchUserAppointments = async (userId: string): Promise<Appointment[]> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await tables.appointments()
        .select('*')
        .eq('user_id', userId)
        .order('appointment_date', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to include both snake_case and camelCase properties
      const appointments: Appointment[] = (data || []).map(item => ({
        id: item.id,
        userId: item.user_id,
        expertId: item.expert_id,
        expertName: item.expert_name,
        appointmentDate: item.appointment_date,
        duration: item.duration,
        status: item.status as AppointmentStatus,
        serviceId: item.service_id,
        notes: item.notes,
        channelName: item.channel_name,
        token: item.token,
        uid: item.uid,
        createdAt: item.created_at || new Date().toISOString(),
        price: item.price,
        currency: item.currency,
        extensionCount: item.extension_count,
        actualDuration: item.actual_duration,
        refunded: item.refunded,
        calendarEventId: item.calendar_event_id
      }));
      
      return appointments;
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch appointments');
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cancel an appointment
  const cancelAppointment = async (appointmentId: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await tables.appointments()
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);
      
      if (error) throw error;
      
      toast.success('Appointment cancelled successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel appointment');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mark appointment as completed
  const completeSession = async (appointmentId: string, actualDuration: number) => {
    setIsLoading(true);
    
    try {
      const { error } = await tables.appointments()
        .update({
          status: 'completed',
          actual_duration: actualDuration
        })
        .eq('id', appointmentId);
      
      if (error) throw error;
      
      toast.success('Session completed successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete session');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Extend appointment duration
  const extendSession = async (appointmentId: string, additionalMinutes: number) => {
    setIsLoading(true);
    
    try {
      // First get the current appointment details
      const { data, error: fetchError } = await tables.appointments()
        .select('duration, extension_count')
        .eq('id', appointmentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (!data) {
        throw new Error('Appointment not found');
      }
      
      // Update the appointment with extended duration
      const { error: updateError } = await tables.appointments()
        .update({
          duration: data.duration + additionalMinutes,
          extension_count: (data.extension_count || 0) + 1
        })
        .eq('id', appointmentId);
      
      if (updateError) throw updateError;
      
      toast.success(`Session extended by ${additionalMinutes} minutes`);
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to extend session');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mark user as no-show
  const markUserNoShow = async (appointmentId: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await tables.appointments()
        .update({ status: 'no-show-user' })
        .eq('id', appointmentId);
      
      if (error) throw error;
      
      toast.success('Appointment marked as no-show');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update appointment');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mark expert as no-show (initiates refund)
  const markExpertNoShow = async (appointmentId: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await tables.appointments()
        .update({
          status: 'no-show-expert',
          refunded: true
        })
        .eq('id', appointmentId);
      
      if (error) throw error;
      
      toast.success('Expert marked as no-show. Refund will be processed.');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update appointment');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    bookAppointment,
    fetchUserAppointments,
    cancelAppointment,
    completeSession,
    extendSession,
    markUserNoShow,
    markExpertNoShow,
    isLoading
  };
};
