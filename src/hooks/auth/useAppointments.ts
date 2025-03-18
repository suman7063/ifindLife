
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';

export interface Appointment {
  id: string;
  userId: string;
  expertId: string;
  expertName: string;
  appointmentDate: string; // ISO string
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  serviceId?: number;
  notes?: string;
  roomUrl?: string;
  createdAt: string;
}

export const useAppointments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Fetch user's appointments
  const fetchUserAppointments = async (userId: string) => {
    if (!userId) return [];
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
        .order('appointment_date', { ascending: true });
        
      if (error) throw error;
      
      // Transform from snake_case to camelCase
      const formattedAppointments = data.map(appointment => ({
        id: appointment.id,
        userId: appointment.user_id,
        expertId: appointment.expert_id,
        expertName: appointment.expert_name,
        appointmentDate: appointment.appointment_date,
        duration: appointment.duration,
        status: appointment.status,
        serviceId: appointment.service_id,
        notes: appointment.notes,
        roomUrl: appointment.room_url,
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
      // Generate a room URL for the appointment
      const formattedName = expertName.toLowerCase().replace(/\s+/g, '');
      const roomUrl = `https://doxy.me/${formattedName}${expertId.slice(0, 4)}`;
      
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
          room_url: roomUrl
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success(`Appointment with ${expertName} booked successfully`);
      
      // Transform to camelCase
      const appointment: Appointment = {
        id: data.id,
        userId: data.user_id,
        expertId: data.expert_id,
        expertName: data.expert_name,
        appointmentDate: data.appointment_date,
        duration: data.duration,
        status: data.status,
        serviceId: data.service_id,
        notes: data.notes,
        roomUrl: data.room_url,
        createdAt: data.created_at
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
        .eq('id', appointmentId);
        
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
