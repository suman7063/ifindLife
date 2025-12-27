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
  isWarning: boolean; // true if 1+ minutes passed but expert hasn't joined yet
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
  const isProcessingRefundRef = useRef(false); // Lock to prevent concurrent processing
  const expertJoinedRef = useRef<boolean>(false); // Track expert joined status from real-time
  const hasCancelledRef = useRef<boolean>(false); // Track if appointment has been cancelled to prevent duplicate cancellation

  // Check if expert has joined the call session
  const checkExpertJoined = useCallback(async (aptId: string): Promise<boolean> => {
    try {
      // Check if there's an active call session for this appointment
      const { data: callSession, error } = await supabase
        .from('call_sessions')
        .select('id, status, start_time, expert_id, duration')
        .eq('appointment_id', aptId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking call session:', error);
        return false;
      }

      // CRITICAL: Expert has attended if call session has duration > 0
      // This is the most reliable indicator that the expert actually joined and the call happened
      if (callSession && callSession.duration && callSession.duration > 0) {
        console.log('✅ Expert attended - call session has duration:', callSession.duration);
        return true;
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
    // Prevent concurrent processing with lock
    if (isProcessingRefundRef.current) {
      return false;
    }

    if (hasProcessedRefundRef.current) {
      return true;
    }

    try {
      // Set lock immediately to prevent concurrent calls
      isProcessingRefundRef.current = true;
      setIsProcessingRefund(true);

      // First, check if refund was already processed for this appointment
      // Check for both 'expert_no_show' and 'refund' reasons
      // Use .select() instead of .maybeSingle() to check ALL existing refunds
      const { data: existingAppointmentRefunds, error: checkError } = await supabase
        .from('wallet_transactions' as never)
        .select('id, amount, created_at')
        .eq('reference_id', aptId)
        .eq('reference_type', 'appointment')
        .eq('type', 'credit')
        .in('reason', ['expert_no_show', 'refund']);

      if (checkError) {
        console.error('Error checking existing refunds:', checkError);
      }

      if (existingAppointmentRefunds && existingAppointmentRefunds.length > 0) {
        hasProcessedRefundRef.current = true;
        isProcessingRefundRef.current = false;
        setIsProcessingRefund(false);
        return true;
      }

      // Get appointment details to find payment information
      const { data: appointment } = await supabase
        .from('appointments')
        .select('id, user_id, expert_id')
        .eq('id', aptId)
        .single();

      if (!appointment) {
        hasProcessedRefundRef.current = true;
        return true;
      }

      // Check for call session payment
      const { data: callSession } = await supabase
        .from('call_sessions')
        .select('id, cost, user_id, currency, payment_status, duration, status')
        .eq('appointment_id', aptId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // CRITICAL: Do NOT process refund if expert attended the call (duration > 0)
      if (callSession && callSession.duration && callSession.duration > 0) {
        console.log('🚫 Refund blocked - expert attended the call. Duration:', callSession.duration, 'seconds');
        hasProcessedRefundRef.current = true;
        isProcessingRefundRef.current = false;
        setIsProcessingRefund(false);
        return true; // Exit early - no refund for attended calls
      }

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
        // Validate UUID before querying
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(callSession.id);
        
        let existingCallRefunds: any[] = [];
        if (isUUID) {
          // Query by reference_id if it's a valid UUID
          const { data } = await supabase
            .from('wallet_transactions' as never)
            .select('id, amount, created_at')
            .eq('reference_id', callSession.id)
            .eq('reference_type', 'call_session')
            .eq('type', 'credit')
            .in('reason', ['expert_no_show', 'refund']);
          existingCallRefunds = data || [];
        } else {
          // Query by metadata if it's not a UUID
          const { data } = await supabase
            .from('wallet_transactions' as never)
            .select('id, amount, created_at')
            .eq('metadata->>reference_id', callSession.id)
            .eq('reference_type', 'call_session')
            .eq('type', 'credit')
            .in('reason', ['expert_no_show', 'refund']);
          existingCallRefunds = data || [];
        }

        if (existingCallRefunds && existingCallRefunds.length > 0) {
          hasProcessedRefundRef.current = true;
          isProcessingRefundRef.current = false;
          setIsProcessingRefund(false);
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
          console.warn('No payment found to refund for appointment:', aptId);
          hasProcessedRefundRef.current = true;
          return true;
        }
      }

      if (refundAmount <= 0) {
        console.warn('⚠️ No payment amount to refund:', {
          refundAmount,
          callSession: callSession ? {
            id: callSession.id,
            cost: callSession.cost,
            payment_status: callSession.payment_status
          } : null,
          appointmentId: aptId
        });
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
        
        // Check if this was a duplicate
        if (data.duplicate) {
          toast.info('Refund was already processed earlier.');
          return true;
        }
        
        toast.success('Full refund has been credited to your wallet.');
        
        // Trigger wallet balance refresh via custom event
        window.dispatchEvent(new CustomEvent('walletBalanceRefresh', {
          detail: { 
            newBalance: data.new_balance,
            transactionId: data.transaction?.id 
          }
        }));
        
        return true;
      } else {
        console.error('❌ Refund failed - process-call-refund returned:', data);
        throw new Error(data?.error || 'Failed to process refund via call session');
      }
      } else {
        // Process refund directly to wallet for appointment payment
        // Use wallet-operations edge function to add credits
        const { data: refundResult, error: refundError } = await supabase.functions.invoke('wallet-operations', {
          body: {
            action: 'add_credits',
            amount: refundAmount,
            currency: currency,
            reason: 'expert_no_show',
            reference_id: paymentReferenceId,
            reference_type: paymentReferenceType,
            description: `Session Cancelled - Full Refund`
          }
        });

        if (refundError) {
          console.error('❌ Error calling wallet-operations:', refundError);
          throw refundError;
        }

        if (refundResult?.success) {
          hasProcessedRefundRef.current = true;
          toast.success(`Full refund of ₹${refundAmount.toFixed(2)} has been credited to your wallet.`);
          
          // Trigger wallet balance refresh via custom event
          window.dispatchEvent(new CustomEvent('walletBalanceRefresh', {
            detail: { 
              newBalance: refundResult.new_balance,
              transactionId: refundResult.transaction?.id 
            }
          }));
          
          return true;
        } else {
          console.error('❌ Refund failed - wallet-operations returned:', {
            success: refundResult?.success,
            error: refundResult?.error,
            fullResponse: refundResult
          });
          throw new Error(refundResult?.error || 'Failed to process refund');
        }
      }

      return false;
    } catch (error) {
      console.error('❌ Error processing no-show refund:', error);
      toast.error('Failed to process refund. Please contact support.');
      return false;
    } finally {
      // Always release the lock
      isProcessingRefundRef.current = false;
      setIsProcessingRefund(false);
    }
  }, []);

  // Mark appointment as no-show
  const markAsNoShow = useCallback(async (aptId: string): Promise<boolean> => {
    // Prevent duplicate cancellation
    if (hasCancelledRef.current) {
      // Still check if refund needs to be processed
      await processNoShowRefund(aptId);
      return true;
    }

    try {
      // Check if appointment is already cancelled
      const { data: currentAppointment } = await supabase
        .from('appointments')
        .select('status, notes')
        .eq('id', aptId)
        .single();

      if (currentAppointment?.status === 'cancelled') {
        hasCancelledRef.current = true;
        // Still process refund if not already processed
        await processNoShowRefund(aptId);
        return true;
      }

      // Get existing notes
      let existingNotes = {};
      try {
        if (currentAppointment?.notes) {
          existingNotes = typeof currentAppointment.notes === 'string' 
            ? JSON.parse(currentAppointment.notes) 
            : currentAppointment.notes;
        }
      } catch {
        // If parsing fails, use empty object
      }

      // Update appointment status to cancelled (no-show maps to cancelled in appointments table)
      // Only update if status is not already cancelled
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
        .eq('id', aptId)
        .neq('status', 'cancelled'); // Only update if not already cancelled

      if (error) {
        // If error is because status is already cancelled (no rows updated), that's okay
        if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
          hasCancelledRef.current = true;
          // Still process refund if not already processed
          await processNoShowRefund(aptId);
          return true;
        }
        throw error;
      }

      hasCancelledRef.current = true;

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
    if (!appointmentId || status === 'completed') {
      return;
    }

    // For cancelled appointments, only check if refund was processed (don't do full no-show check)
    if (status === 'cancelled') {
      try {
        // Check if this was cancelled due to expert no-show
        const { data: appointment } = await supabase
          .from('appointments')
          .select('notes')
          .eq('id', appointmentId)
          .single();

        let cancellationReason = null;
        if (appointment?.notes) {
          try {
            const notes = typeof appointment.notes === 'string' 
              ? JSON.parse(appointment.notes) 
              : appointment.notes;
            cancellationReason = notes?.cancellation_reason;
          } catch {
            // Ignore parse errors
          }
        }

        // Only process refund if it was expert no-show and refund hasn't been processed
        if (cancellationReason === 'expert_no_show') {
          // Check if refund was already processed (check both appointment and call_session)
          // Use comprehensive check: reference_id column OR metadata->>reference_id
          let refundProcessed = false;
          
          
          // Check appointment-level refund - check both reference_id column and metadata
          // Query 1: Check reference_id column
          const { data: appointmentRefundsByRefId, error: refIdError } = await supabase
            .from('wallet_transactions' as never)
            .select('id, amount, created_at, reference_id, metadata')
            .eq('reference_type', 'appointment')
            .eq('type', 'credit')
            .in('reason', ['expert_no_show', 'refund'])
            .eq('reference_id', appointmentId);

          // Query 2: Check metadata->>reference_id
          const { data: appointmentRefundsByMetadata, error: metadataError } = await supabase
            .from('wallet_transactions' as never)
            .select('id, amount, created_at, reference_id, metadata')
            .eq('reference_type', 'appointment')
            .eq('type', 'credit')
            .in('reason', ['expert_no_show', 'refund'])
            .eq('metadata->>reference_id', appointmentId);

          // Query 3: Check if this appointment is in metadata->>appointment_ids array
          // This handles cases where multiple slots were booked together
          const { data: appointmentRefundsByMetadataArray } = await supabase
            .from('wallet_transactions' as never)
            .select('id, amount, created_at, reference_id, metadata')
            .eq('reference_type', 'appointment')
            .eq('type', 'credit')
            .in('reason', ['expert_no_show', 'refund']);

          const appointmentRefundError = refIdError || metadataError;
          let appointmentRefunds = [
            ...(appointmentRefundsByRefId || []),
            ...(appointmentRefundsByMetadata || [])
          ];

          // Filter refunds where this appointment ID is in metadata->appointment_ids array
          if (appointmentRefundsByMetadataArray) {
            const refundsWithMatchingAppointment = appointmentRefundsByMetadataArray.filter(refund => {
              const metadata = refund.metadata || {};
              const appointmentIds = metadata.appointment_ids || [];
              return Array.isArray(appointmentIds) && appointmentIds.includes(appointmentId);
            });
            appointmentRefunds = [...appointmentRefunds, ...refundsWithMatchingAppointment];
          }

          // Remove duplicates
          appointmentRefunds = appointmentRefunds.filter((refund, index, self) => 
            index === self.findIndex(r => r.id === refund.id)
          );

          if (appointmentRefundError) {
            console.error('Error checking appointment refunds:', appointmentRefundError);
          }

          if (appointmentRefunds && appointmentRefunds.length > 0) {
            refundProcessed = true;
          } else {
            // Check call session refund
            const { data: callSession } = await supabase
              .from('call_sessions')
              .select('id')
              .eq('appointment_id', appointmentId)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (callSession) {
              // Validate UUID before querying
              const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(callSession.id);
              
              let callRefundsByRefId: any[] = [];
              let callRefundsByMetadata: any[] = [];
              
              if (isUUID) {
                // Query 1: Check reference_id column (only if UUID)
                const { data } = await supabase
                  .from('wallet_transactions' as never)
                  .select('id, amount, created_at, reference_id, metadata')
                  .eq('reference_type', 'call_session')
                  .eq('type', 'credit')
                  .in('reason', ['expert_no_show', 'refund'])
                  .eq('reference_id', callSession.id);
                callRefundsByRefId = data || [];
              }
              
              // Query 2: Check metadata->>reference_id (always check metadata)
              const { data } = await supabase
                .from('wallet_transactions' as never)
                .select('id, amount, created_at, reference_id, metadata')
                .eq('reference_type', 'call_session')
                .eq('type', 'credit')
                .in('reason', ['expert_no_show', 'refund'])
                .eq('metadata->>reference_id', callSession.id);
              callRefundsByMetadata = data || [];

              const callRefunds = [
                ...(callRefundsByRefId || []),
                ...(callRefundsByMetadata || [])
              ].filter((refund, index, self) => 
                index === self.findIndex(r => r.id === refund.id)
              ); // Remove duplicates
              const callRefundError = null; // No error if both queries succeed
              
              if (callRefundError) {
                console.error('Error checking call session refunds:', callRefundError);
              }

              if (callRefunds && callRefunds.length > 0) {
                refundProcessed = true;
              }
            }
          }

          // Fallback: Check all recent refund transactions for this user (in case reference doesn't match)
          // Also check if this appointment is part of a multi-slot booking that was refunded
          if (!refundProcessed) {
            try {
              const { data: currentUser } = await supabase.auth.getUser();
              if (currentUser?.user?.id) {
                // Get appointment details to check for same-date, same-expert bookings
                const { data: appointmentDetails } = await supabase
                  .from('appointments')
                  .select('appointment_date, expert_id')
                  .eq('id', appointmentId)
                  .single();

                if (appointmentDetails) {
                  // Check for any recent expert_no_show refunds (within last 24 hours)
                  const { data: recentRefunds } = await supabase
                    .from('wallet_transactions' as never)
                    .select('id, amount, created_at, reference_id, reference_type, metadata, description')
                    .eq('user_id', currentUser.user.id)
                    .eq('type', 'credit')
                    .in('reason', ['expert_no_show', 'refund'])
                    .order('created_at', { ascending: false })
                    .limit(20);

                  if (recentRefunds && recentRefunds.length > 0) {
                    // Check if any refund:
                    // 1. Has this appointment ID in metadata->appointment_ids array
                    // 2. Has this appointment ID in reference_id or metadata->reference_id
                    // 3. Is for same date and expert (multi-slot booking scenario)
                    const matchingRefund = recentRefunds.find(r => {
                      const metadata = r.metadata || {};
                      const appointmentIds = metadata.appointment_ids || [];
                      
                      // Check if this appointment is in the refund's appointment_ids array
                      if (Array.isArray(appointmentIds) && appointmentIds.includes(appointmentId)) {
                        return true;
                      }
                      
                      // Check direct reference match
                      if (r.reference_id === appointmentId || metadata.reference_id === appointmentId) {
                        return true;
                      }
                      
                      // Check if description mentions this appointment
                      if (r.description?.includes(appointmentId)) {
                        return true;
                      }
                      
                      return false;
                    });

                    if (matchingRefund) {
                      refundProcessed = true;
                    }
                  }
                }
              }
            } catch (error) {
              console.error('Error in fallback refund check:', error);
            }
          }

          if (!refundProcessed) {
            // Refund not processed yet, process it now
            const refundSuccess = await processNoShowRefund(appointmentId);
            if (refundSuccess) {
              // Re-check refund status after processing (comprehensive check)
              // Query 1: Check reference_id column
              const { data: newRefundsByRefId } = await supabase
                .from('wallet_transactions' as never)
                .select('id, amount, created_at, metadata')
                .eq('reference_type', 'appointment')
                .eq('type', 'credit')
                .in('reason', ['expert_no_show', 'refund'])
                .eq('reference_id', appointmentId);

              // Query 2: Check metadata->>reference_id
              const { data: newRefundsByMetadata } = await supabase
                .from('wallet_transactions' as never)
                .select('id, amount, created_at, metadata')
                .eq('reference_type', 'appointment')
                .eq('type', 'credit')
                .in('reason', ['expert_no_show', 'refund'])
                .eq('metadata->>reference_id', appointmentId);

              // Query 3: Check if this appointment is in metadata->>appointment_ids array
              const { data: newRefundsByMetadataArray } = await supabase
                .from('wallet_transactions' as never)
                .select('id, amount, created_at, metadata')
                .eq('reference_type', 'appointment')
                .eq('type', 'credit')
                .in('reason', ['expert_no_show', 'refund']);

              let newRefunds = [
                ...(newRefundsByRefId || []),
                ...(newRefundsByMetadata || [])
              ];

              // Filter refunds where this appointment ID is in metadata->appointment_ids array
              if (newRefundsByMetadataArray) {
                const refundsWithMatchingAppointment = newRefundsByMetadataArray.filter(refund => {
                  const metadata = refund.metadata || {};
                  const appointmentIds = metadata.appointment_ids || [];
                  return Array.isArray(appointmentIds) && appointmentIds.includes(appointmentId);
                });
                newRefunds = [...newRefunds, ...refundsWithMatchingAppointment];
              }

              // Remove duplicates
              newRefunds = newRefunds.filter((refund, index, self) => 
                index === self.findIndex(r => r.id === refund.id)
              );
              
              if (newRefunds && newRefunds.length > 0) {
                refundProcessed = true;
              } else {
                // Also check call session refunds
                const { data: callSession } = await supabase
                  .from('call_sessions')
                  .select('id')
                  .eq('appointment_id', appointmentId)
                  .order('created_at', { ascending: false })
                  .limit(1)
                  .maybeSingle();

                if (callSession) {
                  // Validate UUID before querying
                  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(callSession.id);
                  
                  let callRefundsByRefId: any[] = [];
                  let callRefundsByMetadata: any[] = [];
                  
                  if (isUUID) {
                    // Query 1: Check reference_id column (only if UUID)
                    const { data } = await supabase
                      .from('wallet_transactions' as never)
                      .select('id')
                      .eq('reference_type', 'call_session')
                      .eq('type', 'credit')
                      .in('reason', ['expert_no_show', 'refund'])
                      .eq('reference_id', callSession.id);
                    callRefundsByRefId = data || [];
                  }

                  // Query 2: Check metadata->>reference_id (always check metadata)
                  const { data } = await supabase
                    .from('wallet_transactions' as never)
                    .select('id')
                    .eq('reference_type', 'call_session')
                    .eq('type', 'credit')
                    .in('reason', ['expert_no_show', 'refund'])
                    .eq('metadata->>reference_id', callSession.id);
                  callRefundsByMetadata = data || [];

                  const callRefunds = [
                    ...(callRefundsByRefId || []),
                    ...(callRefundsByMetadata || [])
                  ].filter((refund, index, self) => 
                    index === self.findIndex(r => r.id === refund.id)
                  ); // Remove duplicates
                  
                  refundProcessed = !!(callRefunds && callRefunds.length > 0);
                }
              }
            }
          }
          
          // Update state with refund status
          setNoShowData({
            appointmentId,
            isNoShow: true,
            canReportNoShow: false,
            timeSinceStart: 0,
            refundProcessed: refundProcessed,
            isWarning: false
          });
        }
      } catch (error) {
        console.error('Error checking refund for cancelled appointment:', error);
      }
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
      
      // Check if expert has joined (use real-time status if available, otherwise check via API)
      // Real-time subscriptions update expertJoinedRef, so we only check API if ref is false
      let expertJoined = expertJoinedRef.current;
      if (!expertJoined) {
        // Only make API call if real-time hasn't detected join yet
        expertJoined = await checkExpertJoined(appointmentId);
        if (expertJoined) {
          expertJoinedRef.current = true;
        }
      }

      // Warning state: 1+ minutes passed but expert hasn't joined (not yet a no-show)
      const isWarning = timeSinceStart >= 1 && timeSinceStart < 5 && !expertJoined && (status === 'scheduled' || status === 'confirmed');

      // Consider it a no-show if:
      // 1. 5 minutes have passed since start time
      // 2. Expert hasn't joined
      // 3. Status is still scheduled/confirmed
      const isNoShow = timeSinceStart >= 5 && !expertJoined && (status === 'scheduled' || status === 'confirmed');
      const canReportNoShow = timeSinceStart >= 5 && !expertJoined && (status === 'scheduled' || status === 'confirmed');

      // Check if refund was already processed (check both appointment and call_session)
      // Use comprehensive check: reference_id column OR metadata->>reference_id
      let refundProcessed = false;
      
      // Check appointment-level refund - check both reference_id column and metadata
      // Query 1: Check reference_id column
      const { data: appointmentRefundsByRefId } = await supabase
        .from('wallet_transactions' as never)
        .select('id, amount, created_at, reference_id, metadata')
        .eq('reference_type', 'appointment')
        .eq('type', 'credit')
        .in('reason', ['expert_no_show', 'refund'])
        .eq('reference_id', appointmentId);

      // Query 2: Check metadata->>reference_id
      const { data: appointmentRefundsByMetadata } = await supabase
        .from('wallet_transactions' as never)
        .select('id, amount, created_at, reference_id, metadata')
        .eq('reference_type', 'appointment')
        .eq('type', 'credit')
        .in('reason', ['expert_no_show', 'refund'])
        .eq('metadata->>reference_id', appointmentId);

      // Query 3: Check if this appointment is in metadata->>appointment_ids array
      // This handles cases where multiple slots were booked together
      const { data: appointmentRefundsByMetadataArray } = await supabase
        .from('wallet_transactions' as never)
        .select('id, amount, created_at, reference_id, metadata')
        .eq('reference_type', 'appointment')
        .eq('type', 'credit')
        .in('reason', ['expert_no_show', 'refund']);

      let appointmentRefunds = [
        ...(appointmentRefundsByRefId || []),
        ...(appointmentRefundsByMetadata || [])
      ];

      // Filter refunds where this appointment ID is in metadata->appointment_ids array
      if (appointmentRefundsByMetadataArray) {
        const refundsWithMatchingAppointment = appointmentRefundsByMetadataArray.filter(refund => {
          const metadata = refund.metadata || {};
          const appointmentIds = metadata.appointment_ids || [];
          return Array.isArray(appointmentIds) && appointmentIds.includes(appointmentId);
        });
        appointmentRefunds = [...appointmentRefunds, ...refundsWithMatchingAppointment];
      }

      // Remove duplicates
      appointmentRefunds = appointmentRefunds.filter((refund, index, self) => 
        index === self.findIndex(r => r.id === refund.id)
      );
      
      if (appointmentRefunds && appointmentRefunds.length > 0) {
        // Refund already processed
        refundProcessed = true;
      } else {
        // Check call session refund
        const { data: callSession } = await supabase
          .from('call_sessions')
          .select('id')
          .eq('appointment_id', appointmentId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (callSession) {
          // Validate UUID before querying
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(callSession.id);
          
          let callRefundsByRefId: any[] = [];
          let callRefundsByMetadata: any[] = [];
          
          if (isUUID) {
            // Query 1: Check reference_id column (only if UUID)
            const { data } = await supabase
              .from('wallet_transactions' as never)
              .select('id, amount, created_at, reference_id, metadata')
              .eq('reference_type', 'call_session')
              .eq('type', 'credit')
              .in('reason', ['expert_no_show', 'refund'])
              .eq('reference_id', callSession.id);
            callRefundsByRefId = data || [];
          }

          // Query 2: Check metadata->>reference_id (always check metadata)
          const { data } = await supabase
            .from('wallet_transactions' as never)
            .select('id, amount, created_at, reference_id, metadata')
            .eq('reference_type', 'call_session')
            .eq('type', 'credit')
            .in('reason', ['expert_no_show', 'refund'])
            .eq('metadata->>reference_id', callSession.id);
          callRefundsByMetadata = data || [];

          const callRefunds = [
            ...(callRefundsByRefId || []),
            ...(callRefundsByMetadata || [])
          ].filter((refund, index, self) => 
            index === self.findIndex(r => r.id === refund.id)
          ); // Remove duplicates
        
          if (callRefunds && callRefunds.length > 0) {
            // Refund already processed
            refundProcessed = true;
          }
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
      // Only trigger once - check if already cancelled or refund processed
      if (isNoShow && !refundProcessed && !hasCancelledRef.current) {
        // Show global warning notification
        toast.error('Expert No-Show Detected', {
          description: `The expert did not join your session within 5 minutes. Full refund ${refundAmountDisplay ? `of ${refundAmountDisplay}` : ''} has been processed and credited to your wallet.`,
          duration: 10000
        });

        // Automatically cancel appointment and process refund
        const success = await markAsNoShow(appointmentId);
        if (!success) {
          console.error('Failed to automatically cancel appointment and process refund');
        }
      } else if (isWarning && !isNoShow) {
        // Show warning notification when 1 minute passed
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

  // Listen for wallet balance refresh events (triggered after refunds)
  useEffect(() => {
    const handleWalletRefresh = () => {
      // Re-check refund status when wallet balance is refreshed
      if (appointmentId && (status === 'cancelled' || noShowData?.isNoShow)) {
        checkNoShow();
      }
    };

    window.addEventListener('walletBalanceRefresh', handleWalletRefresh as EventListener);
    
    return () => {
      window.removeEventListener('walletBalanceRefresh', handleWalletRefresh as EventListener);
    };
  }, [appointmentId, status, checkNoShow, noShowData?.isNoShow]);

  // Set up real-time subscriptions and time-based checks
  useEffect(() => {
    if (!appointmentId || status === 'completed') {
      return;
    }

    let isMounted = true;
    let timeCheckInterval: NodeJS.Timeout | null = null;
    let channelRef: ReturnType<typeof supabase.channel> | null = null;

    // Reset expert joined status when appointment changes
    expertJoinedRef.current = false;
    hasCancelledRef.current = false; // Reset cancellation flag when appointment changes
    
    // Initial check
    checkNoShow();

    // Set up real-time subscription on call_sessions table
    // When expert clicks "Start", call_session is created/updated
    // When expert joins Agora call, status becomes 'active' with start_time
    channelRef = supabase
      .channel(`expert-no-show-${appointmentId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'call_sessions',
          filter: `appointment_id=eq.${appointmentId}`
        },
        (payload) => {
          if (!isMounted) return;
          const callSession = payload.new as any;
          
          // If call session is created with 'active' status and start_time, expert joined
          if (callSession.status === 'active' && callSession.start_time) {
            expertJoinedRef.current = true;
            // Expert joined - no need to check no-show anymore
            setNoShowData({
              appointmentId,
              isNoShow: false,
              canReportNoShow: false,
              timeSinceStart: 0,
              refundProcessed: false,
              isWarning: false
            });
          } else {
            // Call session created but not active yet - check no-show status
            checkNoShow();
          }
        }
      )
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
          
          // If call session status becomes 'active' with start_time, expert joined
          if (callSession.status === 'active' && callSession.start_time) {
            expertJoinedRef.current = true;
            // Expert joined - no need to check no-show anymore
            setNoShowData({
              appointmentId,
              isNoShow: false,
              canReportNoShow: false,
              timeSinceStart: 0,
              refundProcessed: false,
              isWarning: false
            });
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
          
          // If appointment status becomes 'in-progress' or 'completed', expert joined
          if (appointment.status === 'in-progress' || appointment.status === 'completed') {
            expertJoinedRef.current = true;
            setNoShowData({
              appointmentId,
              isNoShow: false,
              canReportNoShow: false,
              timeSinceStart: 0,
              refundProcessed: false,
              isWarning: false
            });
          } else if (appointment.status === 'cancelled') {
            // Appointment cancelled - check refund status
            checkNoShow();
          }
        }
      )
      .subscribe();

    // For cancelled appointments, check periodically to catch refund updates
    if (status === 'cancelled') {
      timeCheckInterval = setInterval(() => {
        if (!isMounted) return;
        checkNoShow();
      }, 10000); // Check every 10 seconds for cancelled appointments (refund status)
    } else {
      // For active appointments, set up a single timeout for exact 5-minute mark
      // Real-time subscriptions handle expert join detection instantly (no polling needed)
      const appointmentDateTime = parseISO(`${appointmentDate}T${startTime}`);
      const now = new Date();
      
      // Only set up timeout if appointment time has passed or is very close
      if (!isAfter(appointmentDateTime, addMinutes(now, -5))) {
        const timeSinceStart = differenceInMinutes(now, appointmentDateTime);
        
        if (timeSinceStart < 5) {
          // Calculate exact time until 5-minute mark
          const minutesUntil5Min = 5 - timeSinceStart;
          const millisecondsUntil5Min = minutesUntil5Min * 60 * 1000;
          
          // Single timeout for exact 5-minute mark (more efficient than interval)
          const timeoutId = setTimeout(() => {
            if (!isMounted || expertJoinedRef.current) {
              return;
            }
            checkNoShow();
          }, millisecondsUntil5Min);
          
          // Also set up a fallback interval (every 30 seconds) in case timeout is missed
          // This ensures we catch the 5-minute mark even if browser tab was inactive
          timeCheckInterval = setInterval(() => {
            if (!isMounted || expertJoinedRef.current) return;
            const currentTime = new Date();
            const currentTimeSinceStart = differenceInMinutes(currentTime, appointmentDateTime);
            
            // Only check if we're past the 5-minute mark
            if (currentTimeSinceStart >= 5) {
              checkNoShow();
              // Clear interval after detecting 5-minute mark
              if (timeCheckInterval) {
                clearInterval(timeCheckInterval);
                timeCheckInterval = null;
              }
            }
          }, 30000); // Check every 30 seconds as fallback
          
          // Store timeout ID for cleanup
          checkIntervalRef.current = timeoutId as any;
        } else {
          // Already past 5-minute mark - check immediately
          if (!expertJoinedRef.current) {
            checkNoShow();
          }
        }
      }
    }

    return () => {
      isMounted = false;
      if (channelRef) {
        supabase.removeChannel(channelRef);
      }
      if (timeCheckInterval) {
        clearInterval(timeCheckInterval);
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

  // Manual refund trigger for cancelled appointments
  const processRefundManually = useCallback(async (): Promise<boolean> => {
    if (!appointmentId) {
      toast.error('Appointment ID not found');
      return false;
    }
    
    hasProcessedRefundRef.current = false; // Reset to allow retry
    
    const success = await processNoShowRefund(appointmentId);
    
    if (success) {
      // Refresh the check to update refundProcessed status
      await checkNoShow();
    }
    
    return success;
  }, [appointmentId, processNoShowRefund, checkNoShow]);

  return {
    noShowData,
    isChecking,
    isProcessingRefund,
    checkNoShow,
    reportNoShow,
    processRefundManually
  };
};

