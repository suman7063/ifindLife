import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { parseISO, isAfter, addMinutes, differenceInMinutes } from 'date-fns';

// Type for wallet transactions (not in generated types)
interface WalletTransaction {
  id: string;
  amount?: number;
  currency?: string;
  type?: string;
  reason?: string;
  reference_id?: string;
  reference_type?: string;
}

export interface ExpertNoShowCheck {
  appointmentId: string;
  isNoShow: boolean;
  canReportNoShow: boolean;
  timeSinceStart: number; // minutes
  refundProcessed: boolean;
  isWarning: boolean; // true if 5+ minutes passed but expert hasn't joined yet
}

/**
 * Hook to detect and handle expert no-show scenarios
 * Checks if expert hasn't joined within 5 minutes of session start time
 * Automatically processes full refund to user's wallet
 */
export const useExpertNoShow = (appointmentId: string | null, appointmentDate: string, startTime: string, status: string) => {
  const [noShowData, setNoShowData] = useState<ExpertNoShowCheck | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasProcessedRefundRef = useRef(false);

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

  // Process refund for no-show
  const processNoShowRefund = useCallback(async (aptId: string): Promise<boolean> => {
    if (hasProcessedRefundRef.current) {
      console.log('Refund already processed for this appointment');
      return true;
    }

    try {
      setIsProcessingRefund(true);

      // First, check if refund was already processed for this appointment
      // Check for both 'expert_no_show' and 'refund' reasons
      const { data: existingAppointmentRefund } = await supabase
        .from('wallet_transactions' as never)
        .select('id')
        .eq('reference_id', aptId)
        .eq('reference_type', 'appointment')
        .eq('type', 'credit')
        .in('reason', ['expert_no_show', 'refund'])
        .maybeSingle();

      if (existingAppointmentRefund) {
        console.log('Refund already processed for appointment');
        hasProcessedRefundRef.current = true;
        return true;
      }

      // Get appointment details to find payment information
      const { data: appointment } = await supabase
        .from('appointments')
        .select('id, user_id, expert_id')
        .eq('id', aptId)
        .single();

      if (!appointment) {
        console.log('Appointment not found');
        hasProcessedRefundRef.current = true;
        return true;
      }

      // Check for call session payment
      const { data: callSession } = await supabase
        .from('call_sessions')
        .select('id, cost, user_id, currency, payment_status')
        .eq('appointment_id', aptId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Determine payment amount and method
      let refundAmount = 0;
      let currency = 'INR';
      let paymentReferenceId = aptId;
      let paymentReferenceType = 'appointment';

      if (callSession && callSession.payment_status === 'paid' && callSession.cost) {
        // Payment was made via call session
        refundAmount = callSession.cost;
        currency = callSession.currency || 'INR';
        paymentReferenceId = callSession.id;
        paymentReferenceType = 'call_session';

        // Check if refund already processed for call session
        // Check for both 'expert_no_show' and 'refund' reasons
        const { data: existingCallRefund } = await supabase
          .from('wallet_transactions' as never)
        .select('id')
        .eq('reference_id', callSession.id)
        .eq('reference_type', 'call_session')
        .eq('type', 'credit')
        .in('reason', ['expert_no_show', 'refund'])
        .maybeSingle();

        if (existingCallRefund) {
          console.log('Refund already processed for call session');
          hasProcessedRefundRef.current = true;
          return true;
        }
      } else {
        // Check wallet transactions for this appointment
        const { data: paymentTransaction } = await supabase
          .from('wallet_transactions' as never)
          .select('amount, currency')
          .eq('reference_id', aptId)
          .eq('reference_type', 'appointment')
          .eq('type', 'debit')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const transaction = paymentTransaction as WalletTransaction | null;
        if (transaction?.amount) {
          refundAmount = transaction.amount;
          currency = transaction.currency || 'INR';
        } else {
          console.log('No payment found to refund');
          hasProcessedRefundRef.current = true;
          return true;
        }
      }

      if (refundAmount <= 0) {
        console.log('No payment amount to refund');
        hasProcessedRefundRef.current = true;
        return true;
      }

      // Process refund via edge function if call session exists
      if (callSession && paymentReferenceType === 'call_session') {
      const { data, error } = await supabase.functions.invoke('process-call-refund', {
        body: {
          callSessionId: callSession.id,
          duration: 0, // Expert didn't join, so duration is 0
          reason: 'expert_no_show',
          refundFullAmount: true
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        hasProcessedRefundRef.current = true;
          console.log('✅ Refund processed successfully for expert no-show via call session');
          return true;
        }
      } else {
        // Process refund directly to wallet for appointment payment
        // Use RPC or edge function for wallet transactions since table might not be in types
        const { data: refundResult, error: refundError } = await supabase.functions.invoke('process-refund', {
          body: {
            appointmentId: aptId,
            userId: appointment.user_id,
            amount: refundAmount,
            currency: currency,
            reason: 'expert_no_show',
            referenceId: paymentReferenceId,
            referenceType: paymentReferenceType
          }
        }).catch(async () => {
          // Fallback: try direct insert if edge function doesn't exist
          return await supabase
            .from('wallet_transactions' as never)
            .insert({
              user_id: appointment.user_id,
              type: 'credit',
              amount: refundAmount,
              currency: currency,
              reason: 'expert_no_show',
              reference_id: paymentReferenceId,
              reference_type: paymentReferenceType,
              description: `Refund for expert no-show - Appointment ${aptId}`
            } as never)
            .select()
            .single();
        });

        const refundTransaction = refundResult || (refundResult as { data?: unknown })?.data;

        if (refundError) {
          throw refundError;
        }

        if (refundTransaction) {
          hasProcessedRefundRef.current = true;
          console.log('✅ Refund processed successfully for expert no-show via appointment');
          toast.success('Full refund has been credited to your wallet.');
        return true;
        }
      }

      return false;
    } catch (error) {
      console.error('❌ Error processing no-show refund:', error);
      toast.error('Failed to process refund. Please contact support.');
      return false;
    } finally {
      setIsProcessingRefund(false);
    }
  }, []);

  // Mark appointment as no-show
  const markAsNoShow = useCallback(async (aptId: string): Promise<boolean> => {
    try {
      // Get existing notes
      const { data: existingAppointment } = await supabase
        .from('appointments')
        .select('notes')
        .eq('id', aptId)
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

      // Update appointment status to cancelled (no-show maps to cancelled in appointments table)
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
        .eq('id', aptId);

      if (error) {
        throw error;
      }

      // Process refund
      await processNoShowRefund(aptId);

      return true;
    } catch (error) {
      console.error('Error marking as no-show:', error);
      toast.error('Failed to mark as no-show');
      return false;
    }
  }, [processNoShowRefund]);

  // Check no-show status
  const checkNoShow = useCallback(async () => {
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
        setNoShowData({
          appointmentId,
          isNoShow: false,
          canReportNoShow: false,
          timeSinceStart: 0,
          refundProcessed: false,
          isWarning: false
        });
        return;
      }

      const timeSinceStart = differenceInMinutes(now, appointmentDateTime);
      
      // Check if expert has joined
      const expertJoined = await checkExpertJoined(appointmentId);

      // Warning state: 3+ minutes passed but expert hasn't joined (not yet a no-show)
      const isWarning = timeSinceStart >= 3 && timeSinceStart < 5 && !expertJoined && (status === 'scheduled' || status === 'confirmed');

      // Consider it a no-show if:
      // 1. 5 minutes have passed since start time
      // 2. Expert hasn't joined
      // 3. Status is still scheduled/confirmed
      const isNoShow = timeSinceStart >= 5 && !expertJoined && (status === 'scheduled' || status === 'confirmed');
      const canReportNoShow = timeSinceStart >= 5 && !expertJoined && (status === 'scheduled' || status === 'confirmed');

      // Check if refund was already processed (check both appointment and call_session)
      let refundProcessed = false;
      
      // Check appointment-level refund (check for both 'expert_no_show' and 'refund' reasons)
      const { data: appointmentRefund } = await supabase
        .from('wallet_transactions' as never)
        .select('id')
        .eq('reference_id', appointmentId)
        .eq('reference_type', 'appointment')
        .eq('type', 'credit')
        .in('reason', ['expert_no_show', 'refund'])
        .maybeSingle();
      
      if (appointmentRefund) {
        refundProcessed = true;
      } else {
        // Check call session refund (check for both 'expert_no_show' and 'refund' reasons)
      const { data: callSession } = await supabase
        .from('call_sessions')
        .select('id')
        .eq('appointment_id', appointmentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (callSession) {
          const { data: callRefund } = await supabase
            .from('wallet_transactions' as never)
          .select('id')
          .eq('reference_id', callSession.id)
          .eq('reference_type', 'call_session')
          .eq('type', 'credit')
          .in('reason', ['expert_no_show', 'refund'])
          .maybeSingle();
        
          refundProcessed = !!callRefund;
        }
      }

      // Get appointment details for refund amount display
      let refundAmountDisplay = '';
      if (isNoShow && !refundProcessed) {
        // Check call session first
        const { data: callSessionForAmount } = await supabase
          .from('call_sessions')
          .select('cost, currency')
          .eq('appointment_id', appointmentId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (callSessionForAmount?.cost) {
          const currencySymbol = callSessionForAmount.currency === 'INR' ? '₹' : callSessionForAmount.currency === 'EUR' ? '€' : '';
          refundAmountDisplay = `${currencySymbol}${callSessionForAmount.cost}`;
        } else {
          // Check wallet transactions for payment amount
          const { data: paymentTransaction } = await supabase
            .from('wallet_transactions' as never)
            .select('amount, currency')
            .eq('reference_id', appointmentId)
            .eq('reference_type', 'appointment')
            .eq('type', 'debit')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          const transaction = paymentTransaction as WalletTransaction | null;
          if (transaction?.amount) {
            const currencySymbol = transaction.currency === 'INR' ? '₹' : transaction.currency === 'EUR' ? '€' : '';
            refundAmountDisplay = `${currencySymbol}${transaction.amount}`;
          }
        }
      }

      setNoShowData({
        appointmentId,
        isNoShow,
        canReportNoShow,
        timeSinceStart,
        refundProcessed,
        isWarning
      });

      // Auto-mark as no-show and process refund if 5 minutes have passed
      if (isNoShow && !refundProcessed) {
        // Show global warning notification
        toast.error('Expert No-Show Detected', {
          description: `The expert did not join your session within 5 minutes. Full refund ${refundAmountDisplay ? `of ${refundAmountDisplay}` : ''} has been processed and credited to your wallet.`,
          duration: 10000,
          action: {
            label: 'View Details',
            onClick: () => {
              // Could navigate to appointment details
              console.log('Navigate to appointment:', appointmentId);
            }
          }
        });

        await markAsNoShow(appointmentId);
      } else if (isWarning && !isNoShow) {
        // Show warning notification when 3 minutes passed
        toast.warning('Expert Not Joined Yet', {
          description: `The expert hasn't joined your session yet. If they don't join within ${5 - timeSinceStart} minute(s), you'll receive a full refund automatically.`,
          duration: 8000
        });
      }
    } catch (error) {
      console.error('Error checking no-show:', error);
    } finally {
      setIsChecking(false);
    }
  }, [appointmentId, appointmentDate, startTime, status, checkExpertJoined, markAsNoShow]);

  // Set up periodic checking
  useEffect(() => {
    if (!appointmentId || status === 'cancelled' || status === 'completed') {
      return;
    }

    // Initial check
    checkNoShow();

    // Check every minute for upcoming/past appointments
    const appointmentDateTime = parseISO(`${appointmentDate}T${startTime}`);
    const now = new Date();
    
    // Only set up interval if appointment is today or in the past (check 5 minutes before)
    if (!isAfter(appointmentDateTime, addMinutes(now, -5))) {
      checkIntervalRef.current = setInterval(() => {
        checkNoShow();
      }, 30000); // Check every 30 seconds for faster detection
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [appointmentId, appointmentDate, startTime, status, checkNoShow]);

  // Manual report no-show
  const reportNoShow = useCallback(async () => {
    if (!appointmentId || !noShowData?.canReportNoShow) {
      return;
    }

    const success = await markAsNoShow(appointmentId);
    if (success) {
      toast.success('Expert no-show reported. Refund will be processed.');
      await checkNoShow(); // Refresh status
    }
  }, [appointmentId, noShowData, markAsNoShow, checkNoShow]);

  return {
    noShowData,
    isChecking,
    isProcessingRefund,
    checkNoShow,
    reportNoShow
  };
};

