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
  appointmentDate?: string; // Store original appointment_date from database (YYYY-MM-DD format)
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
        .maybeSingle(); // Use maybeSingle to handle no rows gracefully

      if (error) {
        // Handle 406 errors (RLS policy issue) gracefully
        if (error.code === '406' || error.message?.includes('406')) {
          console.warn('⚠️ RLS policy issue when fetching user profile (this may be expected):', error);
          // Return minimal data to allow session to continue
          return {
            id: userId,
            name: 'User',
            email: null,
            profile_picture: null
          };
        }
        // Handle PGRST116 (no rows) - this is expected when user doesn't exist
        if (error.code === 'PGRST116') {
          console.warn('⚠️ User profile not found:', userId);
          return {
            id: userId,
            name: 'User',
            email: null,
            profile_picture: null
          };
        }
        console.error('Error fetching user profile:', error);
        return {
          id: userId,
          name: 'User',
          email: null,
          profile_picture: null
        };
      }

      // If no data found, return minimal data
      if (!data) {
        return {
          id: userId,
          name: 'User',
          email: null,
          profile_picture: null
        };
      }

      return data;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      // Return minimal data on error to prevent breaking the session list
      return {
        id: userId,
        name: 'User',
        email: null,
        profile_picture: null
      };
    }
  };

  // Helper function to find continuous sessions (same user, same date, consecutive times)
  const findContinuousSessions = (startSession: Session, allSessions: Session[]): Session[] => {
    const continuous: Session[] = [startSession];
    
    // Get all sessions for the same user on the same date, sorted by start time
    const sameUserDateSessions = allSessions
      .filter(s => 
        s.clientId === startSession.clientId &&
        s.appointmentDate === startSession.appointmentDate &&
        s.status === 'scheduled' &&
        s.id !== startSession.id
      )
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    // Find sessions that are continuous (end time of current = start time of next)
    let currentEndTime = startSession.endTime;
    
    for (const nextSession of sameUserDateSessions) {
      // Check if next session starts exactly when current ends (within 1 minute tolerance)
      const timeDiff = Math.abs(nextSession.startTime.getTime() - currentEndTime.getTime());
      if (timeDiff <= 60000) { // 1 minute tolerance
        continuous.push(nextSession);
        currentEndTime = nextSession.endTime;
      } else {
        // Not continuous, stop looking
        break;
      }
    }
    
    return continuous;
  };

  // Fetch call session data if available
  // Returns the most recent call session (active or completed) for status determination
  const fetchCallSession = async (appointmentId: string) => {
    try {
      if (!expertId) {
        return null;
      }

      // First, try to get any call session (active or completed) to check if expert joined
      const { data: anyCallSession, error: anyError } = await supabase
        .from('call_sessions')
        .select('*')
        .eq('appointment_id', appointmentId)
        .eq('expert_id', expertId) // Add expert_id filter for RLS policy
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (anyError && anyError.code !== 'PGRST116') {
        // Handle 406 errors gracefully
        if (anyError.code === '406' || anyError.message?.includes('406')) {
          console.warn('RLS policy issue when fetching call session (this may be expected):', anyError);
          return null;
        }
        console.error('Error fetching call session:', anyError);
        return null;
      }

      // If we found a call session, return it (could be active or completed)
      if (anyCallSession) {
        return anyCallSession;
      }

      return null;
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
    // Priority: appointment status > call session check (expert joined?) > past time check
    let status: Session['status'] = 'scheduled';
    const appointmentStatus = appointment.status?.toLowerCase();
    
    // Check if appointment end time has passed
    const now = new Date();
    const isPast = endTime < now;
    
    // Check if expert joined (call session exists with start_time)
    const expertJoined = callSession && callSession.start_time;
    
    // First check appointment status (highest priority)
    if (appointmentStatus === 'completed') {
      status = 'completed';
    } else if (appointmentStatus === 'cancelled') {
      status = 'cancelled';
    } 
    // If expert joined (call session exists), determine status based on call session
    else if (expertJoined) {
      // Expert joined - check call session status
      if (callSession.status === 'active') {
        // Check if call session is recent (within last 30 minutes) for in-progress
        const callSessionTime = new Date(callSession.created_at);
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        if (callSessionTime >= thirtyMinutesAgo) {
          status = 'in-progress';
        } else {
          // Stale active call session - if past appointment time, mark as completed
          status = isPast ? 'completed' : 'scheduled';
        }
      } else if (callSession.status === 'completed' || callSession.status === 'ended') {
        // Call session completed
        status = 'completed';
      } else {
        // Other call session status - if past, mark as completed
        status = isPast ? 'completed' : 'scheduled';
      }
    }
    // Expert didn't join - check if appointment time passed
    else if (isPast && (appointmentStatus === 'scheduled' || appointmentStatus === 'pending' || appointmentStatus === 'confirmed')) {
      // Appointment time passed and expert didn't join - mark as no-show
      status = 'no-show';
    }
    // Future appointment, no call session yet
    else if (appointmentStatus === 'pending' || appointmentStatus === 'confirmed') {
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
      appointmentDate: appointment.appointment_date, // Store original date string for accurate comparison
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
            // Find continuous appointments for the same user on the same date
            const continuousSessions = findContinuousSessions(session, sessions);
            const totalDuration = continuousSessions.reduce((sum, s) => sum + s.duration, 0);
            
            // Use the first session's ID as the primary appointment_id
            const primarySessionId = continuousSessions[0].id;
            const appointmentIds = continuousSessions.map(s => s.id);
            
            // Create new call session with combined duration
            const callSessionId = `call_${primarySessionId}_${Date.now()}`;
            const { data: newCallSession, error: insertError } = await supabase
              .from('call_sessions')
              .insert({
                id: callSessionId,
                expert_id: expertId!,
                user_id: session.clientId,
                appointment_id: primarySessionId, // Primary appointment ID
                channel_name: session.channelName || `channel_${primarySessionId}`,
                call_type: session.type === 'video' ? 'video' : 'audio',
                status: 'active',
                start_time: new Date().toISOString(),
                selected_duration: totalDuration, // Combined duration for continuous slots
                call_metadata: {
                  continuous_appointments: appointmentIds,
                  total_slots: continuousSessions.length,
                  is_continuous: continuousSessions.length > 1
                }
              })
              .select()
              .single();
            
            if (insertError) {
              console.error('Error creating call session:', insertError);
            } else if (newCallSession && continuousSessions.length > 1) {
              console.log(`✅ Created continuous call session for ${continuousSessions.length} slots (${totalDuration} minutes total)`);
            }
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
          // If this is a continuous call session, mark all related appointments as completed
          const callMetadata = callSession.call_metadata as any;
          if (callMetadata?.continuous_appointments && Array.isArray(callMetadata.continuous_appointments)) {
            const continuousAppointmentIds = callMetadata.continuous_appointments;
            // Update all continuous appointments to completed
            await supabase
              .from('appointments')
              .update({ status: 'completed' })
              .in('id', continuousAppointmentIds);
            
            console.log(`✅ Marked ${continuousAppointmentIds.length} continuous appointments as completed`);
          }
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

