
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { useAgora } from './useAgora';
import { Appointment, AppointmentRow, AppointmentStatus } from '@/types/supabase/appointments';

export type { Appointment, AppointmentStatus } from '@/types/supabase/appointments';

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
        .order('appointment_date', { ascending: true });
        
      if (error) throw error;
      
      // Transform from snake_case to camelCase
      const formattedAppointments: Appointment[] = (data || []).map((appointment: any) => ({
        id: appointment.id,
        userId: appointment.user_id,
        expertId: appointment.expert_id,
        expertName: appointment.expert_name,
        appointmentDate: appointment.appointment_date,
        duration: appointment.duration,
        status: appointment.status as AppointmentStatus,
        serviceId: appointment.service_id,
        notes: appointment.notes,
        channelName: appointment.channel_name,
        token: appointment.token,
        uid: appointment.uid,
        createdAt: appointment.created_at,
        price: appointment.price,
        currency: appointment.currency,
        extensionCount: appointment.extension_count,
        actualDuration: appointment.actual_duration,
        refunded: appointment.refunded,
        calendarEventId: appointment.calendar_event_id
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

  // Fetch expert's appointments
  const fetchExpertAppointments = async (expertId: string) => {
    if (!expertId) return [];
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('expert_id', expertId)
        .order('appointment_date', { ascending: true });
        
      if (error) throw error;
      
      // Transform from snake_case to camelCase
      const formattedAppointments: Appointment[] = (data || []).map((appointment: any) => ({
        id: appointment.id,
        userId: appointment.user_id,
        expertId: appointment.expert_id,
        expertName: appointment.expert_name,
        appointmentDate: appointment.appointment_date,
        duration: appointment.duration,
        status: appointment.status as AppointmentStatus,
        serviceId: appointment.service_id,
        notes: appointment.notes,
        channelName: appointment.channel_name,
        token: appointment.token,
        uid: appointment.uid,
        createdAt: appointment.created_at,
        price: appointment.price,
        currency: appointment.currency,
        extensionCount: appointment.extension_count,
        actualDuration: appointment.actual_duration,
        refunded: appointment.refunded,
        calendarEventId: appointment.calendar_event_id
      }));
      
      setAppointments(formattedAppointments);
      return formattedAppointments;
    } catch (error) {
      console.error('Error fetching expert appointments:', error);
      toast.error('Failed to load appointments');
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
    price: number,
    currency: string = 'USD',
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
          status: 'scheduled' as AppointmentStatus,
          service_id: serviceId,
          notes,
          channel_name: channelName,
          token: token,
          uid: uid,
          price: price,
          currency: currency,
          extension_count: 0,
          actual_duration: 0,
          refunded: false
        })
        .select();
        
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
        status: data?.[0].status as AppointmentStatus,
        serviceId: data?.[0].service_id,
        notes: data?.[0].notes,
        channelName: data?.[0].channel_name,
        token: data?.[0].token,
        uid: data?.[0].uid,
        createdAt: data?.[0].created_at ?? new Date().toISOString(),
        price: data?.[0].price,
        currency: data?.[0].currency,
        extensionCount: data?.[0].extension_count,
        actualDuration: data?.[0].actual_duration,
        refunded: data?.[0].refunded,
        calendarEventId: data?.[0].calendar_event_id
      };
      
      // Add appointment to Google Calendar (this would be implemented in a future feature)
      // const calendarEventId = await addAppointmentToCalendar(appointment);
      
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
  const cancelAppointment = async (appointmentId: string, isExpert: boolean = false) => {
    setIsLoading(true);
    try {
      // First, get the appointment details
      const { data: appointmentData, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Update the appointment status
      const status = isExpert ? 'no-show-expert' : 'cancelled';
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: status as AppointmentStatus,
          refunded: isExpert // Refund if expert cancels
        })
        .eq('id', appointmentId);
        
      if (error) throw error;
      
      // Process refund if needed
      if (isExpert) {
        // In a real app, we would process a refund to the user's wallet or payment method
        // and possibly apply a penalty to the expert
        console.log("Processing refund and expert penalty");
        // await processRefund(appointmentId);
        // await applyExpertPenalty(appointmentId);
      }
      
      toast.success(isExpert 
        ? 'Appointment cancelled with refund to user' 
        : 'Appointment cancelled successfully');
      
      return true;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Extend a session
  const extendSession = async (appointmentId: string, extensionMinutes: number = 5) => {
    setIsLoading(true);
    try {
      // Get current appointment details
      const { data: appointment, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Calculate new values
      const newDuration = appointment.duration + extensionMinutes;
      const newExtensionCount = (appointment.extension_count || 0) + 1;
      
      // Update the appointment
      const { error } = await supabase
        .from('appointments')
        .update({ 
          duration: newDuration,
          extension_count: newExtensionCount
        })
        .eq('id', appointmentId);
        
      if (error) throw error;
      
      toast.success(`Session extended by ${extensionMinutes} minutes`);
      return true;
    } catch (error) {
      console.error('Error extending session:', error);
      toast.error('Failed to extend session');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Mark session completion with actual duration
  const completeSession = async (appointmentId: string, actualDuration: number) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'completed' as AppointmentStatus,
          actual_duration: actualDuration
        })
        .eq('id', appointmentId);
        
      if (error) throw error;
      
      toast.success('Session completed successfully');
      return true;
    } catch (error) {
      console.error('Error completing session:', error);
      toast.error('Failed to complete session');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Mark user as no-show
  const markUserNoShow = async (appointmentId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'no-show-user' as AppointmentStatus })
        .eq('id', appointmentId);
        
      if (error) throw error;
      
      toast.success('User marked as no-show');
      return true;
    } catch (error) {
      console.error('Error marking user no-show:', error);
      toast.error('Failed to update appointment status');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Mark expert as no-show
  const markExpertNoShow = async (appointmentId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'no-show-expert' as AppointmentStatus,
          refunded: true
        })
        .eq('id', appointmentId);
        
      if (error) throw error;
      
      // In a real app, we would process the refund and penalty here
      // await processRefund(appointmentId);
      // await applyExpertPenalty(appointmentId);
      
      toast.success('Expert marked as no-show, refund processed');
      return true;
    } catch (error) {
      console.error('Error marking expert no-show:', error);
      toast.error('Failed to update appointment status');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    appointments,
    fetchUserAppointments,
    fetchExpertAppointments,
    bookAppointment,
    cancelAppointment,
    extendSession,
    completeSession,
    markUserNoShow,
    markExpertNoShow
  };
};
