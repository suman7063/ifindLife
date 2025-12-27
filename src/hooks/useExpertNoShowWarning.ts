import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { parseISO, isAfter, addMinutes, differenceInMinutes } from 'date-fns';

export interface ExpertNoShowWarning {
  appointmentId: string;
  isWarning: boolean; // true if 65+ minutes passed but expert hasn't joined yet
  isNoShow: boolean; // true if 70+ minutes passed
  timeSinceStart: number; // minutes
  minutesRemaining: number; // minutes until refund
  refundProcessed?: boolean; // true if refund was already processed
}

// Shared cache for call session data across all hook instances
// This prevents multiple API calls for the same appointment_id
const callSessionCache = new Map<string, {
  data: any;
  timestamp: number;
}>();

const CACHE_DURATION = 60000; // Cache for 60 seconds

// Function to set call session data in cache (called from useExpertSessions)
export const setCallSessionCache = (appointmentId: string, callSession: any) => {
  callSessionCache.set(appointmentId, {
    data: callSession,
    timestamp: Date.now()
  });
};

// Function to batch set call session data in cache
export const setCallSessionCacheBatch = (callSessionMap: Map<string, any>) => {
  const now = Date.now();
  callSessionMap.forEach((callSession, appointmentId) => {
    callSessionCache.set(appointmentId, {
      data: callSession,
      timestamp: now
    });
  });
};

/**
 * Hook to warn expert if they haven't joined within 70 minutes
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
      return true;
    }
    
    // If we've already checked and expert didn't join, still return early
    // Real-time subscriptions will update us if status changes
    if (hasCheckedRef.current && !expertJoinedRef.current) {
      return false;
    }
    
    try {
      // FIRST: Always check shared cache before making API call
      const cached = callSessionCache.get(aptId);
      const now = Date.now();
      let callSession = null;
      
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        // Use cached data - no API call needed
        callSession = cached.data;
        // Mark as checked since we have data
        hasCheckedRef.current = true;
      } else if (!hasCheckedRef.current) {
        // Cache miss or expired - make API call ONLY if we haven't checked before
        // This prevents multiple instances from making the same call
        hasCheckedRef.current = true; // Mark as checking to prevent concurrent calls
        
        const { data, error } = await supabase
          .from('call_sessions')
          .select('id, status, start_time, expert_id')
          .eq('appointment_id', aptId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking call session:', error);
          hasCheckedRef.current = false; // Reset on error
          return false;
        }

        callSession = data;
        
        // Update cache for future use
        if (callSession) {
          callSessionCache.set(aptId, {
            data: callSession,
            timestamp: now
          });
        }
      } else {
        // Already checked but no cache - use cached result from previous check
        // This shouldn't happen often, but handle gracefully
        return expertJoinedRef.current;
      }

      // Expert has joined if there's an active call session with start_time
      const expertJoined = callSession && callSession.status === 'active' && callSession.start_time;
      
      if (expertJoined) {
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
          expertJoinedRef.current = true;
          hasCheckedRef.current = true;
          return true;
        }
      }

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
    if (!appointmentId) {
      return;
    }
    
    // For cancelled or completed sessions, only check if refund was processed
    if (status === 'cancelled' || status === 'completed') {
      // Check if refund was already processed
      let refundProcessed = false;
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appointmentId);
      
      if (isUUID) {
        // Check appointment-level refunds
        const { data: appointmentRefunds } = await supabase
          .from('wallet_transactions')
          .select('id')
          .eq('reference_id', appointmentId)
          .eq('reference_type', 'appointment')
          .eq('type', 'credit')
          .in('reason', ['expert_no_show', 'refund'])
          .limit(1);
        
        if (appointmentRefunds && appointmentRefunds.length > 0) {
          refundProcessed = true;
        } else {
          // Check call session refunds
          const { data: callSession } = await supabase
            .from('call_sessions')
            .select('id')
            .eq('appointment_id', appointmentId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          if (callSession) {
            const callSessionIsUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(callSession.id);
            if (callSessionIsUUID) {
              const { data: callRefunds } = await supabase
                .from('wallet_transactions')
                .select('id')
                .eq('reference_id', callSession.id)
                .eq('reference_type', 'call_session')
                .eq('type', 'credit')
                .in('reason', ['expert_no_show', 'refund'])
                .limit(1);
              refundProcessed = (callRefunds && callRefunds.length > 0) || false;
            } else {
              const { data: callRefunds } = await supabase
                .from('wallet_transactions')
                .select('id')
                .eq('metadata->>reference_id', callSession.id)
                .eq('reference_type', 'call_session')
                .eq('type', 'credit')
                .in('reason', ['expert_no_show', 'refund'])
                .limit(1);
              refundProcessed = (callRefunds && callRefunds.length > 0) || false;
            }
          }
        }
      }
      
      setWarningData({
        appointmentId,
        isWarning: false,
        isNoShow: false,
        timeSinceStart: 0,
        minutesRemaining: 0,
        refundProcessed
      });
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

      // Check if refund was already processed
      let refundProcessed = false;
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appointmentId);
      
      if (isUUID) {
        // Check appointment-level refunds
        const { data: appointmentRefunds } = await supabase
          .from('wallet_transactions')
          .select('id')
          .eq('reference_id', appointmentId)
          .eq('reference_type', 'appointment')
          .eq('type', 'credit')
          .in('reason', ['expert_no_show', 'refund'])
          .limit(1);
        
        if (appointmentRefunds && appointmentRefunds.length > 0) {
          refundProcessed = true;
        } else {
          // Check call session refunds
          const { data: callSession } = await supabase
            .from('call_sessions')
            .select('id')
            .eq('appointment_id', appointmentId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          if (callSession) {
            const callSessionIsUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(callSession.id);
            if (callSessionIsUUID) {
              const { data: callRefunds } = await supabase
                .from('wallet_transactions')
                .select('id')
                .eq('reference_id', callSession.id)
                .eq('reference_type', 'call_session')
                .eq('type', 'credit')
                .in('reason', ['expert_no_show', 'refund'])
                .limit(1);
              refundProcessed = (callRefunds && callRefunds.length > 0) || false;
            } else {
              const { data: callRefunds } = await supabase
                .from('wallet_transactions')
                .select('id')
                .eq('metadata->>reference_id', callSession.id)
                .eq('reference_type', 'call_session')
                .eq('type', 'credit')
                .in('reason', ['expert_no_show', 'refund'])
                .limit(1);
              refundProcessed = (callRefunds && callRefunds.length > 0) || false;
            }
          }
        }
      }

      // Warning state: 65+ minutes passed but expert hasn't joined (not yet a no-show)
      const isWarning = timeSinceStart >= 65 && timeSinceStart < 70 && (status === 'scheduled' || status === 'confirmed');
      
      // No-show state: 70+ minutes passed
      const isNoShow = timeSinceStart >= 70 && (status === 'scheduled' || status === 'confirmed');
      const minutesRemaining = Math.max(0, 70 - timeSinceStart);

      setWarningData({
        appointmentId,
        isWarning,
        isNoShow,
        timeSinceStart,
        minutesRemaining,
        refundProcessed
      });

      // Show warning notification when 3 minutes passed
      if (isWarning && !hasShownWarningRef.current) {
        hasShownWarningRef.current = true;
        toast.warning('Join Session Reminder', {
          description: `You haven't joined your scheduled session yet. If you don't join within ${minutesRemaining} minute(s), the user will receive a full refund automatically.`,
          duration: 10000
        });
      }

      // Show no-show notification and automatically cancel when 70 minutes passed
      if (isNoShow && !hasShownNoShowRef.current) {
        hasShownNoShowRef.current = true;
        toast.error('Session Not Joined', {
          description: 'You did not join the session within 70 minutes. The appointment has been automatically cancelled and the user has been refunded.',
          duration: 10000
        });
        
        // Automatically cancel the appointment (user side will process refund)
        try {
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
            console.error('Error auto-cancelling appointment:', error);
            toast.error('Failed to cancel appointment automatically');
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

  // For cancelled/completed sessions, check refund status immediately
  useEffect(() => {
    if (!appointmentId || (status !== 'cancelled' && status !== 'completed')) {
      return;
    }

    // Immediately check if refund was processed for cancelled/completed sessions
    const checkRefundForCancelled = async () => {
      let refundProcessed = false;
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appointmentId);
      
      console.log('🔍 Checking refund for cancelled session:', { appointmentId, isUUID, status });
      
      if (isUUID) {
        // Check appointment-level refunds - check both reference_id column and metadata
        const { data: appointmentRefundsByRefId } = await supabase
          .from('wallet_transactions')
          .select('id')
          .eq('reference_id', appointmentId)
          .eq('reference_type', 'appointment')
          .eq('type', 'credit')
          .in('reason', ['expert_no_show', 'refund'])
          .limit(1);
        
        const { data: appointmentRefundsByMetadata } = await supabase
          .from('wallet_transactions')
          .select('id')
          .eq('metadata->>reference_id', appointmentId)
          .eq('reference_type', 'appointment')
          .eq('type', 'credit')
          .in('reason', ['expert_no_show', 'refund'])
          .limit(1);
        
        // Also check if appointment is in metadata->>appointment_ids array (for combined bookings)
        const { data: allAppointmentRefunds } = await supabase
          .from('wallet_transactions')
          .select('id, metadata')
          .eq('reference_type', 'appointment')
          .eq('type', 'credit')
          .in('reason', ['expert_no_show', 'refund']);
        
        const refundInArray = allAppointmentRefunds?.find((refund: any) => {
          const metadata = refund.metadata || {};
          const appointmentIds = metadata.appointment_ids || [];
          return Array.isArray(appointmentIds) && appointmentIds.includes(appointmentId);
        });
        
        if ((appointmentRefundsByRefId && appointmentRefundsByRefId.length > 0) ||
            (appointmentRefundsByMetadata && appointmentRefundsByMetadata.length > 0) ||
            refundInArray) {
          refundProcessed = true;
          console.log('✅ Refund found for appointment:', appointmentId);
        } else {
          // Check call session refunds
          const { data: callSession } = await supabase
            .from('call_sessions')
            .select('id')
            .eq('appointment_id', appointmentId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          if (callSession) {
            const callSessionIsUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(callSession.id);
            if (callSessionIsUUID) {
              const { data: callRefunds } = await supabase
                .from('wallet_transactions')
                .select('id')
                .eq('reference_id', callSession.id)
                .eq('reference_type', 'call_session')
                .eq('type', 'credit')
                .in('reason', ['expert_no_show', 'refund'])
                .limit(1);
              refundProcessed = (callRefunds && callRefunds.length > 0) || false;
            } else {
              const { data: callRefunds } = await supabase
                .from('wallet_transactions')
                .select('id')
                .eq('metadata->>reference_id', callSession.id)
                .eq('reference_type', 'call_session')
                .eq('type', 'credit')
                .in('reason', ['expert_no_show', 'refund'])
                .limit(1);
              refundProcessed = (callRefunds && callRefunds.length > 0) || false;
            }
            if (refundProcessed) {
              console.log('✅ Refund found for call session:', callSession.id);
            }
          }
        }
      }
      
      console.log('💰 Refund check result:', { appointmentId, refundProcessed });
      
      setWarningData({
        appointmentId,
        isWarning: false,
        isNoShow: false,
        timeSinceStart: 0,
        minutesRemaining: 0,
        refundProcessed
      });
    };

    checkRefundForCancelled();
  }, [appointmentId, status]);

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
          
          // Update cache with new call session data
          if (callSession && appointmentId) {
            callSessionCache.set(appointmentId, {
              data: callSession,
              timestamp: Date.now()
            });
          }
          
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
    if (!isAfter(appointmentDateTime, addMinutes(now, -70)) && 
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

