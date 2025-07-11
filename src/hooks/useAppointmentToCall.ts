import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useCallModal } from '@/components/call/modals/context/CallModalProvider';
import { toast } from 'sonner';

interface AppointmentCallData {
  appointmentId: string;
  expertId: string;
  expertName: string;
  channelName: string;
  callType: 'audio' | 'video';
}

export const useAppointmentToCall = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useSimpleAuth();
  const {
    setCurrentSessionId,
    setCallStatus,
    initializeCall,
    callOperations,
    setShowChat
  } = useCallModal();

  const generateChannelName = useCallback((appointmentId: string) => {
    return `appointment_${appointmentId}_${Date.now()}`;
  }, []);

  const initiateCallFromAppointment = useCallback(async (
    appointmentId: string, 
    callType: 'audio' | 'video' = 'video'
  ) => {
    if (!user) {
      toast.error('Please log in to join the call');
      return null;
    }

    try {
      setLoading(true);

      // Fetch appointment details
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();

      if (appointmentError || !appointment) {
        throw new Error('Appointment not found');
      }

      // Fetch expert details separately
      const { data: expertData, error: expertError } = await supabase
        .from('expert_accounts')
        .select('id, name, auth_id')
        .eq('id', appointment.expert_id)
        .single();

      if (expertError || !expertData) {
        throw new Error('Expert not found');
      }

      // Verify user has permission to join this call
      if (appointment.user_id !== user.id && expertData.auth_id !== user.id) {
        throw new Error('You are not authorized to join this call');
      }

      // Check if appointment is confirmed and within valid time window
      if (appointment.status !== 'confirmed') {
        throw new Error('This appointment is not confirmed');
      }

      const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
      const now = new Date();
      const timeDiff = appointmentDateTime.getTime() - now.getTime();
      const minutesDiff = timeDiff / (1000 * 60);

      // Allow joining 15 minutes before and up to 60 minutes after appointment time
      if (minutesDiff > 15 || minutesDiff < -60) {
        throw new Error('Call is not available at this time');
      }

      // Generate or use existing channel name
      let channelName = appointment.channel_name;
      if (!channelName) {
        channelName = generateChannelName(appointmentId);
        
        // Update appointment with channel name
        const { error: updateError } = await supabase
          .from('appointments')
          .update({ channel_name: channelName })
          .eq('id', appointmentId);

        if (updateError) {
          console.error('Failed to update appointment with channel name:', updateError);
        }
      }

      // Create or get call session
      const { data: existingSession } = await supabase
        .from('call_sessions')
        .select('*')
        .eq('channel_name', channelName)
        .eq('status', 'active')
        .single();

      let sessionId;
      if (existingSession) {
        sessionId = existingSession.id;
      } else {
        // Create new call session
        const { data: newSession, error: sessionError } = await supabase
          .from('call_sessions')
          .insert({
            id: `appointment_${appointmentId}_${Date.now()}`,
            expert_id: parseInt(appointment.expert_id),
            user_id: appointment.user_id,
            call_type: callType,
            channel_name: channelName,
            status: 'active',
            start_time: new Date().toISOString(),
            selected_duration: 60 // Default 60 minutes
          })
          .select()
          .single();

        if (sessionError || !newSession) {
          throw new Error('Failed to create call session');
        }
        sessionId = newSession.id;
      }

      // Set up call modal
      setCurrentSessionId(sessionId);
      setCallStatus('connecting');
      
      // Initialize the call infrastructure
      await initializeCall({
        expertId: appointment.expert_id,
        expertName: expertData.name || appointment.expert_name,
        chatMode: false
      });

      // Start the actual call
      const success = await callOperations.startCall(callType);
      
      if (success) {
        setShowChat(true);
        setCallStatus('connected');
        toast.success(`${callType} call connected successfully`);
        return sessionId;
      } else {
        throw new Error('Failed to connect call');
      }

    } catch (error: any) {
      console.error('Failed to initiate appointment call:', error);
      toast.error(error.message || 'Failed to start call');
      setCallStatus('error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, generateChannelName, setCurrentSessionId, setCallStatus, initializeCall, callOperations, setShowChat]);

  const getAppointmentStatus = useCallback(async (appointmentId: string) => {
    try {
      const { data: appointment, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();

      if (error || !appointment) {
        return null;
      }

      const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
      const now = new Date();
      const timeDiff = appointmentDateTime.getTime() - now.getTime();
      const minutesDiff = timeDiff / (1000 * 60);

      return {
        appointment,
        canJoin: minutesDiff <= 15 && minutesDiff >= -60 && appointment.status === 'confirmed',
        timeUntilJoin: minutesDiff > 15 ? minutesDiff - 15 : 0,
        isExpired: minutesDiff < -60
      };
    } catch (error) {
      console.error('Error getting appointment status:', error);
      return null;
    }
  }, []);

  const endAppointmentCall = useCallback(async (appointmentId: string) => {
    try {
      // Update appointment status to completed
      const { error: appointmentError } = await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', appointmentId);

      if (appointmentError) {
        console.error('Failed to update appointment status:', appointmentError);
      }

      // End call session
      const { data: appointment } = await supabase
        .from('appointments')
        .select('channel_name')
        .eq('id', appointmentId)
        .single();

      if (appointment?.channel_name) {
        const { error: sessionError } = await supabase
          .from('call_sessions')
          .update({ 
            status: 'completed',
            end_time: new Date().toISOString()
          })
          .eq('channel_name', appointment.channel_name);

        if (sessionError) {
          console.error('Failed to update call session:', sessionError);
        }
      }

      toast.success('Call ended successfully');
    } catch (error) {
      console.error('Failed to end appointment call:', error);
      toast.error('Failed to end call properly');
    }
  }, []);

  return {
    loading,
    initiateCallFromAppointment,
    getAppointmentStatus,
    endAppointmentCall
  };
};