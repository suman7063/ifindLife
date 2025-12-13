import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Session {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  clientEmail?: string;
  type: 'video' | 'audio' | 'in-person';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  actualDuration?: number;
  notes: string;
  goals: string[];
  outcomes: string[];
  nextSteps: string[];
  rating?: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  amount: number;
  appointmentId?: string;
  channelName?: string;
  token?: string;
}

interface UseExpertSessionsOptions {
  expertId?: string;
  autoFetch?: boolean;
}

export const useExpertSessions = ({ expertId, autoFetch = true }: UseExpertSessionsOptions = {}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile data for client information
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, profile_picture')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  };

  // Fetch call session data if available
  const fetchCallSession = async (appointmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('call_sessions')
        .select('*')
        .eq('appointment_id', appointmentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching call session:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error fetching call session:', err);
      return null;
    }
  };

  // Map appointment to Session format
  const mapAppointmentToSession = async (appointment: any): Promise<Session> => {
    // Fetch user profile for client information
    const userProfile = await fetchUserProfile(appointment.user_id);
    
    // Fetch call session if available
    const callSession = await fetchCallSession(appointment.id);

    // Parse start and end times
    const appointmentDate = new Date(appointment.appointment_date);
    const startTime = appointment.start_time
      ? new Date(`${appointment.appointment_date}T${appointment.start_time}`)
      : appointmentDate;
    const endTime = appointment.end_time
      ? new Date(`${appointment.appointment_date}T${appointment.end_time}`)
      : new Date(startTime.getTime() + (appointment.duration || 60) * 60000);

    // Determine session type (default to video if channel_name exists)
    const type: 'video' | 'audio' | 'in-person' = 
      appointment.channel_name ? 'video' : 'audio';

    // Map status - appointments can have: 'scheduled', 'completed', 'cancelled', 'pending', 'confirmed'
    let status: Session['status'] = 'scheduled';
    const appointmentStatus = appointment.status?.toLowerCase();
    
    if (appointmentStatus === 'completed') {
      status = 'completed';
    } else if (appointmentStatus === 'cancelled') {
      status = 'cancelled';
    } else if (callSession?.status === 'active') {
      status = 'in-progress';
    } else if (appointmentStatus === 'pending' || appointmentStatus === 'confirmed') {
      status = 'scheduled';
    } else {
      status = 'scheduled'; // Default
    }

    // Calculate actual duration from call session
    let actualDuration: number | undefined;
    if (callSession?.start_time && callSession?.end_time) {
      const start = new Date(callSession.start_time);
      const end = new Date(callSession.end_time);
      actualDuration = Math.round((end.getTime() - start.getTime()) / 60000);
    } else if (callSession?.duration) {
      actualDuration = callSession.duration;
    }

    // Parse notes (could be JSON or plain text)
    let notes = appointment.notes || '';
    let goals: string[] = [];
    let outcomes: string[] = [];
    let nextSteps: string[] = [];

    try {
      if (notes) {
        const parsed = JSON.parse(notes);
        if (typeof parsed === 'object') {
          notes = parsed.notes || notes;
          goals = parsed.goals || [];
          outcomes = parsed.outcomes || [];
          nextSteps = parsed.nextSteps || [];
        }
      }
    } catch {
      // If parsing fails, use notes as-is
    }

    return {
      id: appointment.id,
      clientId: appointment.user_id,
      clientName: userProfile?.name || 'Unknown Client',
      clientAvatar: userProfile?.profile_picture || undefined,
      clientEmail: userProfile?.email || undefined,
      type,
      status,
      startTime,
      endTime,
      duration: appointment.duration || 60,
      actualDuration,
      notes,
      goals,
      outcomes,
      nextSteps,
      rating: callSession?.rating || undefined,
      paymentStatus: (appointment.payment_status as 'pending' | 'paid' | 'refunded') || 'pending',
      amount: 0, // TODO: Calculate from service or call session
      appointmentId: appointment.id,
      channelName: appointment.channel_name || callSession?.channel_name || undefined,
      token: appointment.token || callSession?.agora_token || undefined,
    };
  };

  // Fetch sessions from Supabase
  const fetchSessions = useCallback(async () => {
    if (!expertId) {
      setSessions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch appointments for this expert
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('expert_id', expertId)
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (appointmentsError) {
        throw appointmentsError;
      }

      if (!appointments || appointments.length === 0) {
        setSessions([]);
        return;
      }

      // Map appointments to sessions
      const mappedSessions = await Promise.all(
        appointments.map(mapAppointmentToSession)
      );

      setSessions(mappedSessions);
    } catch (err: any) {
      console.error('Error fetching sessions:', err);
      setError(err.message || 'Failed to fetch sessions');
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, [expertId]);

  // Update session status
  const updateSessionStatus = async (
    sessionId: string,
    status: Session['status'],
    notes?: string
  ) => {
    try {
      setLoading(true);

      // Update appointment status - map Session status to appointment status
      let appointmentStatus: string;
      if (status === 'in-progress') {
        appointmentStatus = 'scheduled'; // Keep as scheduled in appointments table
      } else if (status === 'no-show') {
        appointmentStatus = 'cancelled'; // Map no-show to cancelled
      } else {
        appointmentStatus = status; // 'scheduled', 'completed', 'cancelled'
      }

      const updateData: any = {
        status: appointmentStatus,
      };

      if (notes !== undefined) {
        // Try to preserve existing structured notes
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
          const existingNotes = {
            notes: notes,
            goals: session.goals || [],
            outcomes: session.outcomes || [],
            nextSteps: session.nextSteps || [],
          };
          updateData.notes = JSON.stringify(existingNotes);
        } else {
          updateData.notes = notes;
        }
      }

      const { error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', sessionId);

      if (error) {
        throw error;
      }

      // If starting a session, create/update call session
      if (status === 'in-progress') {
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
          // Check if call session exists
          const { data: existingCallSession } = await supabase
            .from('call_sessions')
            .select('*')
            .eq('appointment_id', sessionId)
            .single();

          if (!existingCallSession) {
            // Create new call session
            await supabase
              .from('call_sessions')
              .insert({
                id: `call_${sessionId}_${Date.now()}`,
                expert_id: expertId!,
                user_id: session.clientId,
                appointment_id: sessionId,
                channel_name: session.channelName || `channel_${sessionId}`,
                call_type: session.type === 'video' ? 'video' : 'audio',
                status: 'active',
                start_time: new Date().toISOString(),
                selected_duration: session.duration,
              });
          } else {
            // Update existing call session
            await supabase
              .from('call_sessions')
              .update({
                status: 'active',
                start_time: new Date().toISOString(),
              })
              .eq('id', existingCallSession.id);
          }
        }
      }

      // If ending a session, update call session
      if (status === 'completed') {
        const { data: callSession } = await supabase
          .from('call_sessions')
          .select('*')
          .eq('appointment_id', sessionId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (callSession) {
          const startTime = callSession.start_time 
            ? new Date(callSession.start_time)
            : new Date();
          const endTime = new Date();
          const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

          await supabase
            .from('call_sessions')
            .update({
              status: 'ended',
              end_time: endTime.toISOString(),
              duration,
            })
            .eq('id', callSession.id);
        }

        // Also update appointment status
        await supabase
          .from('appointments')
          .update({ status: 'completed' })
          .eq('id', sessionId);
      }

      // Refresh sessions
      await fetchSessions();
      toast.success(`Session ${status} successfully`);
    } catch (err: any) {
      console.error('Error updating session status:', err);
      setError(err.message || 'Failed to update session');
      toast.error('Failed to update session');
    } finally {
      setLoading(false);
    }
  };

  // Update session notes
  const updateSessionNotes = async (
    sessionId: string,
    notes: string,
    goals?: string[],
    outcomes?: string[],
    nextSteps?: string[]
  ) => {
    try {
      setLoading(true);

      const notesData = {
        notes,
        goals: goals || [],
        outcomes: outcomes || [],
        nextSteps: nextSteps || [],
      };

      const { error } = await supabase
        .from('appointments')
        .update({ notes: JSON.stringify(notesData) })
        .eq('id', sessionId);

      if (error) {
        throw error;
      }

      await fetchSessions();
      toast.success('Session notes updated');
    } catch (err: any) {
      console.error('Error updating session notes:', err);
      setError(err.message || 'Failed to update notes');
      toast.error('Failed to update notes');
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!expertId || !autoFetch) return;

    // Initial fetch
    fetchSessions();

    // Subscribe to appointment changes
    const appointmentChannel = supabase
      .channel(`expert-appointments-${expertId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `expert_id=eq.${expertId}`,
        },
        () => {
          // Refetch on any change
          fetchSessions();
        }
      )
      .subscribe();

    // Subscribe to call session changes
    const callSessionChannel = supabase
      .channel(`expert-call-sessions-${expertId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'call_sessions',
          filter: `expert_id=eq.${expertId}`,
        },
        () => {
          // Refetch on any change
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentChannel);
      supabase.removeChannel(callSessionChannel);
    };
  }, [expertId, autoFetch, fetchSessions]);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    updateSessionStatus,
    updateSessionNotes,
  };
};

