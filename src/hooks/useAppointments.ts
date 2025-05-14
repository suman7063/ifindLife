
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/supabase/user';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  user_id: string;
  expert_id: string;
  expert_name: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  service_id?: string;
}

export const useAppointments = (user: UserProfile | null) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchAppointments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      setTimeout(() => {
        // Mock data
        const mockAppointments = [
          {
            id: '1',
            user_id: user.id,
            expert_id: 'expert1',
            expert_name: 'Dr. John Smith',
            appointment_date: '2025-06-15',
            start_time: '10:00',
            end_time: '11:00',
            status: 'confirmed' as const,
            notes: 'Initial consultation',
            service_id: '1'
          },
          {
            id: '2',
            user_id: user.id,
            expert_id: 'expert2',
            expert_name: 'Dr. Jane Doe',
            appointment_date: '2025-06-20',
            start_time: '14:00',
            end_time: '15:00',
            status: 'pending' as const,
            service_id: '2'
          }
        ];
        
        setAppointments(mockAppointments);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
      setLoading(false);
    }
  };
  
  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    setLoading(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        const updatedAppointments = appointments.map(appointment => {
          if (appointment.id === appointmentId) {
            return {
              ...appointment,
              status: newStatus as 'pending' | 'confirmed' | 'cancelled' | 'completed'
            };
          }
          return appointment;
        });
        
        setAppointments(updatedAppointments);
        setLoading(false);
        toast.success(`Appointment ${newStatus}`);
      }, 800);
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError(`Failed to update appointment status to ${newStatus}`);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAppointments();
  }, [user]);
  
  return {
    appointments,
    loading,
    error,
    updateAppointmentStatus,
    fetchAppointments
  };
};
