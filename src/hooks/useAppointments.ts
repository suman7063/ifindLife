
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { useAvailabilityManagement } from './useAvailabilityManagement';
import { useAppointmentManagement } from './useAppointmentManagement';
import { Appointment, TimeSlot } from '@/types/appointments';

export { type Appointment, type TimeSlot };

export const useAppointments = (currentUser: UserProfile | null, expertId?: string) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { fetchAvailabilities, availabilities, createAvailability, deleteAvailability } = useAvailabilityManagement(currentUser);
  const { 
    fetchAppointments: fetchAppointmentsOriginal, 
    bookAppointment, 
    updateAppointmentStatus 
  } = useAppointmentManagement(currentUser, expertId);
  
  const fetchAppointments = async () => {
    if (!currentUser) return [];
    
    setLoading(true);
    try {
      // Determine if the user is an expert by checking if they have an entry in the expert_accounts table
      const { data: expertData } = await supabase
        .from('expert_accounts')
        .select('id')
        .eq('auth_id', currentUser.id)
        .single();

      const isExpert = !!expertData;
      
      const data = await fetchAppointmentsOriginal(
        expertId ? undefined : currentUser.id,
        expertId || (isExpert ? currentUser.id : undefined)
      );
      
      setAppointments(data);
      return data;
    } catch (error: any) {
      console.error('Error fetching appointments:', error.message);
      toast.error('Failed to load appointments');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const sendMessageToClient = async (userId: string, content: string) => {
    if (!currentUser) return false;
    
    try {
      // First check if the messages table exists
      const { error: tableCheckError } = await supabase
        .from('messages')
        .select('id')
        .limit(1)
        .maybeSingle();
        
      if (tableCheckError) {
        console.error('Error accessing messages table:', tableCheckError);
        toast.error('Messaging system is not ready yet');
        return false;
      }
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUser.id,
          receiver_id: userId,
          content: content,
          read: false
        });
      
      if (error) throw error;
      
      toast.success('Message sent');
      return true;
    } catch (error: any) {
      console.error('Error sending message:', error.message);
      toast.error('Failed to send message');
      return false;
    }
  };
  
  const fetchClients = async () => {
    if (!currentUser) return [];
    
    try {
      // First get all appointments to find unique clients
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('expert_id', currentUser.id);
        
      if (appointmentsError) throw appointmentsError;
        
      // Get unique client IDs
      const uniqueClientIds = Array.from(new Set(appointmentsData?.map(apt => apt.user_id) || []));
      
      if (uniqueClientIds.length === 0) {
        return [];
      }
      
      // Fetch client details
      const { data: clientsData, error: clientsError } = await supabase
        .from('users')
        .select('id, name, email, phone, city, country, profile_picture, created_at')
        .in('id', uniqueClientIds);
        
      if (clientsError) throw clientsError;
      
      // Enhance client data with appointment statistics
      const enhancedClients = (clientsData || []).map(client => {
        const clientAppointments = appointmentsData?.filter(apt => apt.user_id === client.id) || [];
        const lastAppointment = clientAppointments.sort((a, b) => 
          new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime()
        )[0];
        
        return {
          ...client,
          appointment_count: clientAppointments.length,
          joined_at: client.created_at,
          last_appointment: lastAppointment?.appointment_date
        };
      });
      
      return enhancedClients;
    } catch (error: any) {
      console.error('Error fetching clients:', error.message);
      toast.error('Failed to load clients');
      return [];
    }
  };

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    bookAppointment,
    updateAppointmentStatus,
    sendMessageToClient,
    fetchClients,
    // From useAvailabilityManagement
    availabilities,
    fetchAvailabilities,
    createAvailability,
    deleteAvailability
  };
};

export default useAppointments;
