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
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownWarningRef = useRef(false);
  const hasShownNoShowRef = useRef(false);

  // Check if expert has joined the call session
  const checkExpertJoined = useCallback(async (aptId: string): Promise<boolean> => {
    try {
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
      if (callSession && callSession.status === 'active' && callSession.start_time) {
        return true;
      }

      // Also check appointment status - if it's marked as 'in-progress' or 'completed', expert likely joined
      const { data: appointment } = await supabase
        .from('appointments')
        .select('status')
        .eq('id', aptId)
        .single();

      if (appointment && (appointment.status === 'completed' || appointment.status === 'in-progress')) {
        return true;
      }

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
      
      // Check if expert has joined
      const expertJoined = await checkExpertJoined(appointmentId);

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

      // Show no-show notification when 5 minutes passed
      if (isNoShow && !hasShownNoShowRef.current) {
        hasShownNoShowRef.current = true;
        toast.error('Session Not Joined', {
          description: 'You did not join the session within 5 minutes. The user has been refunded the full amount.',
          duration: 10000
        });
      }
    } catch (error) {
      console.error('Error checking warning:', error);
    } finally {
      setIsChecking(false);
    }
  }, [appointmentId, appointmentDate, startTime, status, checkExpertJoined]);

  // Set up periodic checking
  useEffect(() => {
    if (!appointmentId || status === 'cancelled' || status === 'completed') {
      return;
    }

    // Initial check
    checkWarning();

    // Check every 30 seconds for upcoming/past appointments
    const appointmentDateTime = parseISO(`${appointmentDate}T${startTime}`);
    const now = new Date();
    
    // Only set up interval if appointment is today or in the past (check 5 minutes before)
    if (!isAfter(appointmentDateTime, addMinutes(now, -5))) {
      checkIntervalRef.current = setInterval(() => {
        checkWarning();
      }, 30000); // Check every 30 seconds for faster detection
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [appointmentId, appointmentDate, startTime, status, checkWarning]);

  return {
    warningData,
    isChecking,
    checkWarning
  };
};

