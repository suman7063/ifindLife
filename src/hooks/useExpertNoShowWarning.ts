import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { parseISO, isAfter, addMinutes, differenceInMinutes } from 'date-fns';

export interface ExpertNoShowWarning {
  appointmentId: string;
  isWarning: boolean; // true if 3+ minutes passed but expert hasn't joined yet
  isNoShow: boolean; // true if 5+ minutes passed
  timeSinceStart: number; // minutes
  minutesRemaining: number; // minutes until refund
}

/**
 * Hook to warn expert if they haven't joined within 5 minutes
 * Shows warnings to expert about potential refund to user
 */
export const useExpertNoShowWarning = (
  appointmentId: string | null,
  appointmentDate: string,
  startTime: string,
  status: string
) => {
  const [warningData, setWarningData] = useState<ExpertNoShowWarning | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const hasShownWarningRef = useRef(false);
  const hasShownNoShowRef = useRef(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const expertJoinedRef = useRef<boolean>(false);
  const hasCheckedRef = useRef<boolean>(false); // Track if we've already checked
  const isCheckingRef = useRef<boolean>(false); // Prevent concurrent checks
  const checkWarningRef = useRef<(() => void) | null>(null);
  const checkExpertJoinedRef = useRef<((aptId: string) => Promise<boolean>) | null>(null);

  // Check if expert has joined the call session (initial check only)
  const checkExpertJoined = useCallback(async (aptId: string): Promise<boolean> => {
    // If we've already checked and expert joined, return early without API call
    if (hasCheckedRef.current && expertJoinedRef.current) {
      console.log('✅ Already checked - expert joined, skipping API call');
      return true;
    }
    
    // If we've already checked and expert didn't join, still return early
    // Real-time subscriptions will update us if status changes
    if (hasCheckedRef.current && !expertJoinedRef.current) {
      console.log('⏸️ Already checked - expert not joined, skipping API call (will use real-time updates)');
      return false;
    }
    
    try {
      console.log('🔍 Checking expert joined status for appointment:', aptId);
      
      // Check if there's an active call session for this appointment
      const { data: callSession, error } = await supabase
        .from('call_sessions')
        .select('id, status, start_time, expert_id')
        .eq('appointment_id', aptId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking call session:', error);
        return false;
      }

      // Expert has joined if there's an active call session with start_time
      const expertJoined = callSession && callSession.status === 'active' && callSession.start_time;
      
      if (expertJoined) {
        console.log('✅ Expert has joined (call session active)');
        expertJoinedRef.current = true;
        hasCheckedRef.current = true;
        return true;
      }

      // Also check appointment status (only if call session check didn't find anything)
      if (!callSession) {
        const { data: appointment } = await supabase
          .from('appointments')
          .select('status')
          .eq('id', aptId)
          .maybeSingle();

        if (appointment && (appointment.status === 'completed' || appointment.status === 'in-progress')) {
          console.log('✅ Expert has joined (appointment in-progress/completed)');
          expertJoinedRef.current = true;
          hasCheckedRef.current = true;
          return true;
        }
      }

      console.log('❌ Expert has not joined yet');
      expertJoinedRef.current = false;
      hasCheckedRef.current = true;
      return false;
    } catch (error) {
      console.error('Error checking expert joined status:', error);
      return false;
    }
  }, []);

  // Check warning status
  const checkWarning = useCallback(async () => {
    if (!appointmentId || status === 'cancelled' || status === 'completed') {
      return;
    }

    try {
      setIsChecking(true);

      // If appointment status is already 'in-progress' or 'completed', expert definitely joined
      if (status === 'in-progress' || status === 'completed') {
        expertJoinedRef.current = true;
        setWarningData({
          appointmentId,
          isWarning: false,
          isNoShow: false,
          timeSinceStart: 0,
          minutesRemaining: 0
        });
        hasShownWarningRef.current = false;
        hasShownNoShowRef.current = false;
        return;
      }

      // Parse appointment datetime
      const appointmentDateTime = parseISO(`${appointmentDate}T${startTime}`);
      const now = new Date();
      
      // Only check if appointment time has passed
      if (isAfter(appointmentDateTime, now)) {
        setWarningData({
          appointmentId,
          isWarning: false,
          isNoShow: false,
          timeSinceStart: 0,
          minutesRemaining: 0
        });
        return;
      }

      const timeSinceStart = differenceInMinutes(now, appointmentDateTime);
      
      // Use the ref value (updated via real-time) or verify against database
      let expertJoined = expertJoinedRef.current;
      
      // If ref says expert hasn't joined, verify against database (only if time has passed)
      // This handles cases where expert joined before subscription was set up
      if (!expertJoined && timeSinceStart > 0 && checkExpertJoinedRef.current) {
        const actualJoined = await checkExpertJoinedRef.current(appointmentId);
        if (actualJoined) {
          expertJoinedRef.current = true;
          expertJoined = true;
        }
      }

      // If expert has joined, no warning needed
      if (expertJoined) {
        setWarningData({
          appointmentId,
          isWarning: false,
          isNoShow: false,
          timeSinceStart: 0,
          minutesRemaining: 0
        });
        hasShownWarningRef.current = false;
        hasShownNoShowRef.current = false;
        return;
      }

      // Warning state: 3+ minutes passed but expert hasn't joined (not yet a no-show)
      const isWarning = timeSinceStart >= 3 && timeSinceStart < 5 && (status === 'scheduled' || status === 'confirmed');
      
      // No-show state: 5+ minutes passed
      const isNoShow = timeSinceStart >= 5 && (status === 'scheduled' || status === 'confirmed');
      const minutesRemaining = Math.max(0, 5 - timeSinceStart);

      setWarningData({
        appointmentId,
        isWarning,
        isNoShow,
        timeSinceStart,
        minutesRemaining
      });

      // Show warning notification when 3 minutes passed
      if (isWarning && !hasShownWarningRef.current) {
        hasShownWarningRef.current = true;
        toast.warning('Join Session Reminder', {
          description: `You haven't joined your scheduled session yet. If you don't join within ${minutesRemaining} minute(s), the user will receive a full refund automatically.`,
          duration: 10000
        });
      }

      // Show no-show notification and automatically cancel when 5 minutes passed
      if (isNoShow && !hasShownNoShowRef.current) {
        hasShownNoShowRef.current = true;
        toast.error('Session Not Joined', {
          description: 'You did not join the session within 5 minutes. The appointment has been automatically cancelled and the user has been refunded.',
          duration: 10000
        });
        
        // Automatically cancel the appointment (user side will process refund)
        try {
          console.log('🚨 Auto-cancelling appointment due to expert no-show:', appointmentId);
          
          // Get existing notes
          const { data: existingAppointment } = await supabase
            .from('appointments')
            .select('notes')
            .eq('id', appointmentId)
            .single();

          let existingNotes = {};
          try {
            if (existingAppointment?.notes) {
              existingNotes = typeof existingAppointment.notes === 'string' 
                ? JSON.parse(existingAppointment.notes) 
                : existingAppointment.notes;
            }
          } catch {
            // If parsing fails, use empty object
          }

          // Update appointment status to cancelled with no-show reason
          const { error } = await supabase
            .from('appointments')
            .update({ 
              status: 'cancelled',
              notes: JSON.stringify({
                ...existingNotes,
                cancellation_reason: 'expert_no_show',
                cancelled_at: new Date().toISOString()
              })
            })
            .eq('id', appointmentId);

          if (error) {
            console.error('❌ Error auto-cancelling appointment:', error);
            toast.error('Failed to cancel appointment automatically');
          } else {
            console.log('✅ Appointment automatically cancelled due to expert no-show');
          }
        } catch (error) {
          console.error('❌ Error in auto-cancellation:', error);
        }
      }
    } catch (error) {
      console.error('Error checking warning:', error);
    } finally {
      setIsChecking(false);
    }
  }, [appointmentId, appointmentDate, startTime, status]);

  // Reset check flag when appointmentId changes
  useEffect(() => {
    hasCheckedRef.current = false;
    expertJoinedRef.current = false;
    isCheckingRef.current = false;
  }, [appointmentId]);

  // Set up real-time subscriptions and periodic time checks
  useEffect(() => {
    if (!appointmentId || status === 'cancelled' || status === 'completed') {
      return;
    }

    let isMounted = true;
    let timeCheckInterval: NodeJS.Timeout | null = null;

    // DISABLED: Initial API check - rely only on real-time subscriptions
    // This prevents the flood of API calls when SessionManager loads
    // Real-time subscriptions will update us when status changes
    // Only do time-based calculations without API calls
    const appointmentDateTime = parseISO(`${appointmentDate}T${startTime}`);
    const now = new Date();
    
    // If appointment time has passed, do initial time-based check (no API call)
    if (!isAfter(appointmentDateTime, now) && checkWarningRef.current) {
      checkWarningRef.current(); // This only calculates time, doesn't make API calls
    }

    // Set up real-time subscription for call_sessions
    // Only subscribe to updates, don't make initial API calls
    const channel = supabase
      .channel(`expert-no-show-warning-${appointmentId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'call_sessions',
          filter: `appointment_id=eq.${appointmentId}`
        },
        (payload) => {
          if (!isMounted) return;
          const callSession = payload.new as any;
          
          // Update expert joined status based on call session (no API call needed)
          if (callSession && callSession.status === 'active' && callSession.start_time) {
            expertJoinedRef.current = true;
            hasCheckedRef.current = true;
            if (checkWarningRef.current) {
              checkWarningRef.current(); // Only updates UI, no API call
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `id=eq.${appointmentId}`
        },
        (payload) => {
          if (!isMounted) return;
          const appointment = payload.new as any;
          
          // Update expert joined status based on appointment status (no API call needed)
          if (appointment && (appointment.status === 'in-progress' || appointment.status === 'completed')) {
            expertJoinedRef.current = true;
            hasCheckedRef.current = true;
            if (checkWarningRef.current) {
              checkWarningRef.current(); // Only updates UI, no API call
            }
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Set up interval only for time-based checks (not API calls)
    // This just checks if time has passed, doesn't make API calls
    // Only set up interval if appointment is today or in the past
    if (!isAfter(appointmentDateTime, addMinutes(now, -5)) && 
        (status === 'scheduled' || status === 'confirmed')) {
      timeCheckInterval = setInterval(() => {
        if (!isMounted || expertJoinedRef.current || !checkWarningRef.current) return;
        // Only update time-based calculations, no API calls
        checkWarningRef.current();
      }, 60000); // Check every 60 seconds (reduced frequency)
    }

    return () => {
      isMounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      if (timeCheckInterval) {
        clearInterval(timeCheckInterval);
      }
    };
  }, [appointmentId, appointmentDate, startTime, status]); // Removed function deps to prevent infinite loops

  // Keep refs updated after functions are defined
  useEffect(() => {
    checkWarningRef.current = checkWarning;
    checkExpertJoinedRef.current = checkExpertJoined;
  }, [checkWarning, checkExpertJoined]);

  return {
    warningData,
    isChecking,
    checkWarning
  };
};

