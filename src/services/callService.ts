/**
 * Call Service
 * Handles all call-related database operations
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface InitiateCallParams {
  expertId: string;
  expertAuthId: string;
  callType: 'audio' | 'video';
  duration: number; // in minutes
  userId: string;
  userName?: string;
  userAvatar?: string;
  estimatedCost?: number;
  currency?: 'INR' | 'EUR';
}

export interface CallRequestResponse {
  callRequestId: string;
  channelName: string;
  agoraToken: string | null;
  agoraUid: number;
  callSessionId: string;
}

/**
 * Initiate a call from user to expert
 */
export async function initiateCall(params: InitiateCallParams): Promise<CallRequestResponse | null> {
  try {
    const {
      expertId,
      expertAuthId,
      callType,
      duration,
      userId,
      userName,
      userAvatar,
      estimatedCost = 0,
      currency = 'INR'
    } = params;

    console.log('📞 Initiating call:', { expertId, expertAuthId, callType, duration, userId });

    // Generate unique channel name and UIDs
    const timestamp = Date.now();
    const shortExpertId = expertAuthId.replace(/-/g, '').substring(0, 8);
    const shortUserId = userId.replace(/-/g, '').substring(0, 8);
    const channelName = `call_${shortExpertId}_${shortUserId}_${timestamp}`;
    const userUid = Math.floor(Math.random() * 1000000);
    const expertUid = Math.floor(Math.random() * 1000000);

    // Generate Agora tokens for both user and expert
    console.log('🔑 Generating Agora tokens...');
    
    const { data: userTokenData, error: userTokenError } = await supabase.functions.invoke('smooth-action', {
      body: {
        channelName,
        uid: userUid,
        role: 1, // Publisher role
        expireTime: (duration + 5) * 60 // Token expires after call duration + 5 min buffer
      }
    });

    if (userTokenError) {
      console.error('❌ Failed to generate Agora token for user:', userTokenError);
      toast.error('Failed to initialize call. Please try again.');
      return null;
    }

    const userAgoraToken = userTokenData?.token || null;
    console.log('✅ Agora token generated for user (UID:', userUid, ')');

    const { data: expertTokenData, error: expertTokenError } = await supabase.functions.invoke('smooth-action', {
      body: {
        channelName,
        uid: expertUid,
        role: 1, // Publisher role
        expireTime: (duration + 5) * 60
      }
    });

    if (expertTokenError) {
      console.error('❌ Failed to generate Agora token for expert:', expertTokenError);
      toast.error('Failed to initialize call. Please try again.');
      return null;
    }

    const expertAgoraToken = expertTokenData?.token || null;
    console.log('✅ Agora token generated for expert (UID:', expertUid, ')');

    // Create call session with UUID
    // Use crypto.randomUUID() for proper UUID format that can be stored in reference_id
    const callSessionId = crypto.randomUUID();
    
    const { data: sessionData, error: sessionError } = await supabase
      .from('call_sessions')
      .insert({
        id: callSessionId,
        expert_id: expertAuthId, // Use auth_id since foreign key references expert_accounts(auth_id)
        user_id: userId,
        channel_name: channelName,
        agora_channel_name: channelName,
        agora_token: userAgoraToken,
        call_type: callType,
        status: 'pending',
        selected_duration: duration,
        cost: estimatedCost,
        currency,
        payment_method: 'wallet', // Default to wallet payment
        payment_status: 'pending',
        call_direction: 'outgoing',
        expert_auth_id: expertAuthId,
        call_metadata: {
          initiated_by: userId,
          initiated_at: new Date().toISOString(),
          user_name: userName,
          user_avatar: userAvatar,
          user_uid: userUid,
          expert_uid: expertUid,
          expert_token: expertAgoraToken
        }
      } as never)
      .select()
      .single();

    if (sessionError) {
      console.error('❌ Failed to create call session:', sessionError);
      toast.error('Failed to create call session');
      return null;
    }

    console.log('✅ Call session created:', callSessionId);

    // Create incoming call request for expert
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes to accept
    
    const { data: callRequestData, error: requestError } = await supabase
      .from('incoming_call_requests')
      .insert({
        user_id: userId,
        expert_id: expertAuthId,
        call_type: callType,
        status: 'pending',
        channel_name: channelName,
        agora_token: expertAgoraToken,
        agora_uid: expertUid,
        estimated_cost_inr: currency === 'INR' ? estimatedCost : null,
        estimated_cost_eur: currency === 'EUR' ? estimatedCost : null,
        expires_at: expiresAt.toISOString(),
        call_session_id: callSessionId,
        user_metadata: {
          name: userName || 'User',
          avatar: userAvatar || null,
          user_id: userId
        }
      })
      .select()
      .single();

    if (requestError) {
      console.error('❌ Failed to create incoming call request:', requestError);
      toast.error('Failed to create call request. Please try again.');
      return null;
    }
    
    console.log('✅ Incoming call request created:', callRequestData.id);

    // Send notification to expert
    try {
      console.log('📨 Sending notification to expert:', expertAuthId);
      
      // Send notification via Edge Function
      const { error: notificationError } = await supabase.functions.invoke('send-notification', {
        body: {
          userId: expertAuthId, // Use auth_id as user_id for notifications
          type: 'incoming_call_request',
          title: `New ${callType === 'video' ? 'Video' : 'Audio'} Call Request`,
          content: `${userName || 'A user'} wants to have a ${callType} call with you`,
          referenceId: callRequestData.id,
          senderId: userId,
          data: {
            callRequestId: callRequestData.id,
            callSessionId: callSessionId,
            callType: callType,
            duration: duration,
            estimatedCost: estimatedCost,
            currency: currency,
            userName: userName,
            userAvatar: userAvatar
          }
        }
      });

      if (notificationError) {
        // Silently handle notification errors - they're non-critical
        console.warn('⚠️ Notification service unavailable (call will still proceed):', notificationError.message || 'Unknown error');
        // Don't fail the call initiation if notification fails
      } else {
        console.log('✅ Notification sent to expert successfully');
      }
    } catch (notificationErr: any) {
      // Silently handle notification errors - they're non-critical
      console.warn('⚠️ Notification service unavailable (call will still proceed):', notificationErr?.message || 'Unknown error');
      // Don't fail the call initiation if notification fails
    }

    return {
      callRequestId: callRequestData?.id || '',
      channelName,
      agoraToken: userAgoraToken,
      agoraUid: userUid,
      callSessionId
    };

  } catch (error) {
    console.error('❌ Error initiating call:', error);
    toast.error('Failed to initiate call: ' + (error instanceof Error ? error.message : 'Unknown error'));
    return null;
  }
}

/**
 * Accept a call request (expert side)
 */
export async function acceptCall(callRequestId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('incoming_call_requests')
      .update({ 
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', callRequestId);

    if (error) {
      console.error('❌ Failed to accept call:', error);
      return false;
    }

    // Get call request details
    const { data: callRequest } = await supabase
      .from('incoming_call_requests')
      .select('*, call_sessions(*)')
      .eq('id', callRequestId)
      .single();

    if (callRequest) {
      await supabase
        .from('call_sessions')
        .update({ 
          status: 'pending',
          answered_at: new Date().toISOString()
        })
        .eq('id', callRequest.call_session_id);

      // Send notification to expert confirming call acceptance
      try {
        const userName = (callRequest.user_metadata as any)?.name || 'A user';
        const callType = callRequest.call_type === 'video' ? 'Video' : 'Audio';
        
        console.log('📨 Sending acceptance confirmation notification to expert:', callRequest.expert_id);
        
        const { error: notificationError } = await supabase.functions.invoke('send-notification', {
          body: {
            userId: callRequest.expert_id, // expert_id is the auth_id
            type: 'call_accepted_by_expert',
            title: 'Call Accepted',
            content: `You have accepted the ${callType.toLowerCase()} call from ${userName}. Connecting now...`,
            referenceId: callRequestId,
            senderId: callRequest.user_id,
            data: {
              callRequestId: callRequestId,
              callSessionId: callRequest.call_session_id,
              callType: callRequest.call_type,
              userName: userName
            }
          }
        });

        if (notificationError) {
          console.warn('⚠️ Failed to send acceptance notification to expert:', notificationError.message || 'Unknown error');
          // Don't fail the accept call if notification fails
        } else {
          console.log('✅ Acceptance confirmation notification sent to expert successfully');
        }
      } catch (notificationErr: any) {
        console.warn('⚠️ Error sending acceptance notification to expert:', notificationErr?.message || 'Unknown error');
        // Don't fail the accept call if notification fails
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Error accepting call:', error);
    return false;
  }
}

/**
 * Decline a call request (expert side)
 */
export async function declineCall(callRequestId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('incoming_call_requests')
      .update({ 
        status: 'declined',
        updated_at: new Date().toISOString()
      })
      .eq('id', callRequestId);

    if (error) {
      console.error('❌ Failed to decline call:', error);
      return false;
    }

    const { data: callRequest } = await supabase
      .from('incoming_call_requests')
      .select('user_id, call_session_id')
      .eq('id', callRequestId)
      .single();

    if (callRequest) {
      const endTime = new Date().toISOString();
      
      // Update call session status
      await supabase
        .from('call_sessions')
        .update({ 
          status: 'ended',
          end_time: endTime
        })
        .eq('id', callRequest.call_session_id);

      // Fetch call session to get expert_id for notification
      const { data: callSession } = await supabase
        .from('call_sessions')
        .select('user_id, expert_id')
        .eq('id', callRequest.call_session_id)
        .single();

      // Send notification to user (same as when expert ends call)
      if (callSession?.user_id) {
        try {
          console.log('📨 Sending notification to user about call decline:', callSession.user_id);
          
          const { error: notificationError } = await supabase.functions.invoke('send-notification', {
            body: {
              userId: callSession.user_id,
              type: 'call_ended',
              title: 'Call Ended',
              content: 'Call declined by expert',
              referenceId: callRequest.call_session_id,
              senderId: callSession.expert_id,
              data: {
                callSessionId: callRequest.call_session_id,
                endedBy: 'expert',
                declined: true
              }
            }
          });

          if (notificationError) {
            // Silently handle notification errors - they're non-critical
            console.warn('⚠️ Failed to send notification (call still declined):', notificationError.message || 'Unknown error');
          } else {
            console.log('✅ Notification sent to user successfully');
          }
        } catch (notificationErr: any) {
          // Silently handle notification errors - they're non-critical
          console.warn('⚠️ Notification service unavailable (call still declined):', notificationErr?.message || 'Unknown error');
        }
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Error declining call:', error);
    return false;
  }
}

/**
 * End a call and update session
 * @param callSessionId - The call session ID
 * @param duration - Call duration in seconds
 * @param endedBy - Who ended the call ('user' or 'expert')
 * @param disconnectionReason - Reason for disconnection ('network_error' | 'normal' | 'user_ended' | 'expert_ended' | 'user_misbehaving' | 'expert_emergency')
 */
export async function endCall(
  callSessionId: string, 
  duration?: number, 
  endedBy?: 'user' | 'expert',
  disconnectionReason: 'network_error' | 'normal' | 'user_ended' | 'expert_ended' | 'user_misbehaving' | 'expert_emergency' = 'normal'
): Promise<boolean> {
  try {
    const endTime = new Date().toISOString();
    
    // Fetch call session to get user_id, cost, and selected_duration before updating
    const { data: callSession, error: fetchError } = await supabase
      .from('call_sessions')
      .select('user_id, expert_id, cost, selected_duration, currency, payment_method')
      .eq('id', callSessionId)
      .single();

    if (fetchError) {
      console.error('❌ Failed to fetch call session:', fetchError);
      return false;
    }

    // Fetch existing metadata to preserve it
    const { data: existingSession } = await supabase
      .from('call_sessions')
      .select('call_metadata')
      .eq('id', callSessionId)
      .single();

    const existingMetadata = (existingSession?.call_metadata as Record<string, any>) || {};
    
    const updateData: {
      status: 'ended';
      end_time: string;
      updated_at: string;
      duration?: number;
      call_metadata?: Record<string, any>;
    } = {
      status: 'ended',
      end_time: endTime,
      updated_at: endTime
    };

    if (duration !== undefined) {
      updateData.duration = duration;
    }

    // IMPORTANT: Update status to 'ended' FIRST (before refund processing)
    // This ensures real-time subscription triggers immediately so user sees confirmation dialog
    const { error: statusUpdateError } = await supabase
      .from('call_sessions')
      .update({
        status: 'ended',
        end_time: endTime,
        updated_at: endTime,
        duration: duration !== undefined ? duration : undefined
      })
      .eq('id', callSessionId);

    if (statusUpdateError) {
      console.error('❌ Failed to update call session status:', statusUpdateError);
      return false;
    }

    console.log('✅ Call session status updated to ended - real-time subscription should trigger now');

    // Now process refund asynchronously (don't block the status update)
    // IMPORTANT: Only refund if there was a network problem, not for normal call endings
    // Calculate and process refund ONLY if disconnection was due to network error
    const shouldRefund = disconnectionReason === 'network_error' && 
                         callSession?.user_id && 
                         callSession?.cost && 
                         callSession?.selected_duration && 
                         duration !== undefined;
    
    if (shouldRefund) {
      try {
        // Calculate refund: refund = cost - (remaining_minutes * per_minute_rate)
        // Per-minute rate = cost / selected_duration
        // Actual duration in minutes = duration (seconds) / 60
        // Remaining minutes = selected_duration - actual_duration_in_minutes
        
        const actualDurationMinutes = duration / 60; // Convert seconds to minutes
        const remainingMinutes = Math.max(0, callSession.selected_duration - actualDurationMinutes);
        const perMinuteRate = callSession.cost / callSession.selected_duration;
        const refundAmount = remainingMinutes * perMinuteRate;
        
        // Round to 2 decimal places
        const roundedRefund = Math.round(refundAmount * 100) / 100;
        
        if (roundedRefund > 0) {
          console.log('💰 Calculating refund due to network error:', {
            cost: callSession.cost,
            selected_duration: callSession.selected_duration,
            actual_duration_minutes: actualDurationMinutes,
            remaining_minutes: remainingMinutes,
            per_minute_rate: perMinuteRate,
            refund_amount: roundedRefund,
            disconnection_reason: disconnectionReason
          });

          // Process refund using dedicated edge function (works for both expert and user ending call)
          const { data: refundData, error: refundError } = await supabase.functions.invoke('process-call-refund', {
            body: {
              callSessionId: callSessionId,
              duration: duration
            }
          });

          if (refundError) {
            console.error('❌ Failed to process refund:', refundError);
            // Continue with call ending even if refund fails
            updateData.call_metadata = {
              ...existingMetadata,
              refund: {
                amount: roundedRefund,
                status: 'failed',
                error: refundError.message || 'Unknown error',
                calculated_at: endTime,
                remaining_minutes: remainingMinutes
              }
            };
          } else if (refundData?.success) {
            console.log('✅ Refund processed successfully:', {
              refund_amount: refundData.refund_amount || roundedRefund,
              new_balance: refundData.new_balance,
              transaction_id: refundData.transaction?.id
            });
            updateData.call_metadata = {
              ...existingMetadata,
              refund: {
                amount: refundData.refund_amount || roundedRefund,
                status: 'processed',
                processed_at: endTime,
                remaining_minutes: remainingMinutes,
                new_balance: refundData.new_balance,
                transaction_id: refundData.transaction?.id
              }
            };
            
            const currencySymbol = callSession.currency === 'INR' ? '₹' : callSession.currency === 'EUR' ? '€' : '€';
            toast.success(`Refund of ${currencySymbol}${(refundData.refund_amount || roundedRefund).toFixed(2)} processed for remaining ${remainingMinutes.toFixed(2)} minutes`);
          } else {
            // Refund was not needed or already processed
            updateData.call_metadata = {
              ...existingMetadata,
              refund: {
                amount: refundData?.refund_amount || 0,
                status: refundData?.message === 'Refund already processed' ? 'already_processed' : 'not_applicable',
                calculated_at: endTime,
                remaining_minutes: remainingMinutes
              }
            };
          }
        } else {
          console.log('ℹ️ No refund needed - call used full duration or exceeded selected duration');
          updateData.call_metadata = {
            ...existingMetadata,
            refund: {
              status: 'not_applicable',
              reason: 'Call used full duration or exceeded selected duration',
              calculated_at: endTime
            }
          };
        }
      } catch (refundErr: any) {
        console.error('❌ Error processing refund:', refundErr);
        // Continue with call ending even if refund calculation fails
        updateData.call_metadata = {
          ...existingMetadata,
          refund: {
            status: 'error',
            error: refundErr.message || 'Unknown error',
            calculated_at: endTime
          }
        };
      }
    } else {
      // Preserve existing metadata if no refund processing, but add disconnection reason
      updateData.call_metadata = {
        ...existingMetadata,
        disconnection_reason: disconnectionReason,
        ended_by: endedBy || 'unknown',
        ended_at: endTime
      };
    }

    // IMPORTANT: Always save disconnection reason in metadata (even if refund processing happened)
    // If refund processing already set metadata, merge disconnection reason into it
    if (updateData.call_metadata && !updateData.call_metadata.disconnection_reason) {
      updateData.call_metadata = {
        ...updateData.call_metadata,
        disconnection_reason: disconnectionReason,
        ended_by: endedBy || 'unknown',
        ended_at: endTime
      };
    }

    // Update metadata separately (status already updated above)
    if (updateData.call_metadata) {
      const { error: metadataError } = await supabase
        .from('call_sessions')
        .update({ call_metadata: updateData.call_metadata })
        .eq('id', callSessionId);

      if (metadataError) {
        console.warn('⚠️ Failed to update call session metadata:', metadataError);
        // Don't fail the call ending if metadata update fails
      }
    }

    // IMPORTANT: If disconnection reason is "user_misbehaving", create a report in expert_user_reports
    if (disconnectionReason === 'user_misbehaving' && endedBy === 'expert' && callSession?.user_id && callSession?.expert_id) {
      try {
        console.log('📝 Creating user report for misbehavior during call:', {
          callSessionId,
          expertId: callSession.expert_id,
          userId: callSession.user_id
        });

        // Get user email from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('id', callSession.user_id)
          .single();

        if (userError) {
          console.warn('⚠️ Could not fetch user email for report:', userError);
        }

        // Create report in expert_user_reports table
        const { error: reportError } = await supabase
          .from('expert_user_reports')
          .insert({
            expert_id: callSession.expert_id,
            reported_user_id: callSession.user_id,
            reported_user_email: userData?.email || null,
            reason: 'User is misbehaving',
            details: `User was reported for misbehavior during call session ${callSessionId}. Call was disconnected by expert.`,
            call_session_id: callSessionId,
            status: 'pending'
          });

        if (reportError) {
          console.warn('⚠️ Failed to create user report (call still ended):', reportError.message || 'Unknown error');
          // Don't fail the call ending if report creation fails
        } else {
          console.log('✅ User report created successfully for misbehavior');
        }
      } catch (reportErr: any) {
        console.warn('⚠️ Error creating user report (call still ended):', reportErr?.message || 'Unknown error');
        // Don't fail the call ending if report creation fails
      }
    }

    await supabase
      .from('incoming_call_requests')
      .update({ status: 'cancelled' })
      .eq('call_session_id', callSessionId)
      .in('status', ['pending', 'accepted']);

    // Send notification to user if expert ended the call
    if (endedBy === 'expert' && callSession?.user_id) {
      try {
        console.log('📨 Sending notification to user about call end:', callSession.user_id);
        
        const { error: notificationError } = await supabase.functions.invoke('send-notification', {
          body: {
            userId: callSession.user_id,
            type: 'call_ended',
            title: 'Call Ended',
            content: 'Call end by expert',
            referenceId: callSessionId,
            senderId: callSession.expert_id,
            data: {
              callSessionId: callSessionId,
              endedBy: 'expert',
              duration: duration,
              refundAmount: (updateData.call_metadata as any)?.refund?.amount || null
            }
          }
        });

        if (notificationError) {
          // Silently handle notification errors - they're non-critical
          console.warn('⚠️ Failed to send notification (call still ended):', notificationError.message || 'Unknown error');
        } else {
          console.log('✅ Notification sent to user successfully');
        }
      } catch (notificationErr: any) {
        // Silently handle notification errors - they're non-critical
        console.warn('⚠️ Notification service unavailable (call still ended):', notificationErr?.message || 'Unknown error');
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Error ending call:', error);
    return false;
  }
}

/**
 * Check if a call session has ended
 * @param callSessionId - The call session ID to check
 * @returns Object with call status information, or null if session not found
 */
export async function checkCallStatus(callSessionId: string): Promise<{
  isEnded: boolean;
  status: string;
  endTime: string | null;
  duration: number | null;
} | null> {
  try {
    const { data: session, error } = await supabase
      .from('call_sessions')
      .select('status, end_time, duration')
      .eq('id', callSessionId)
      .single();

    if (error) {
      console.error('❌ Failed to check call status:', error);
      return null;
    }

    if (!session) {
      return null;
    }

    return {
      isEnded: session.status === 'ended',
      status: session.status,
      endTime: session.end_time || null,
      duration: session.duration || null
    };
  } catch (error) {
    console.error('❌ Error checking call status:', error);
    return null;
  }
}

/**
 * Join an appointment call (when expert has started the session)
 * Gets appointment details and call session, then returns call data for joining Agora
 */
export async function joinAppointmentCall(appointmentId: string): Promise<CallRequestResponse | null> {
  try {
    console.log('📞 Joining appointment call:', appointmentId);
    
    // Get appointment details
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('id, channel_name, token, expert_id, user_id, duration')
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      console.error('❌ Failed to get appointment:', appointmentError);
      toast.error('Appointment not found');
      return null;
    }

    // Check if expert has started the session (channel_name exists)
    if (!appointment.channel_name) {
      toast.error('Expert has not started the session yet. Please wait for them to start.');
      return null;
    }

    // Get call session for this appointment
    const { data: callSession, error: callSessionError } = await supabase
      .from('call_sessions')
      .select('id, agora_token, agora_uid, call_type')
      .eq('appointment_id', appointmentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (callSessionError && callSessionError.code !== 'PGRST116') {
      console.error('❌ Failed to get call session:', callSessionError);
    }

    // Use call session token/uid if available, otherwise use appointment token
    let agoraToken = callSession?.agora_token || appointment.token;
    let agoraUid = callSession?.agora_uid || Math.floor(Math.random() * 1000000);
    const callType = (callSession?.call_type === 'video' ? 'video' : 'audio') as 'audio' | 'video';

    // Generate user token if not available (using appointment's channel_name)
    if (!agoraToken || agoraToken === 'null' || agoraToken === '') {
      const userUid = Math.floor(Math.random() * 1000000);
      const { data: tokenData, error: tokenError } = await supabase.functions.invoke('smooth-action', {
        body: {
          channelName: appointment.channel_name,
          uid: userUid,
          role: 1, // Publisher role
          expireTime: (appointment.duration || 30 + 5) * 60 // Token expires after session duration + 5 min buffer
        }
      });

      if (tokenError) {
        console.error('❌ Failed to generate Agora token for user:', tokenError);
        toast.error('Failed to generate call token. Please try again.');
        return null;
      }

      agoraToken = tokenData?.token || null;
      agoraUid = userUid;
      console.log('✅ Agora token generated for user (UID:', userUid, ')');
    }

    const callSessionId = callSession?.id || `call_${appointmentId}_${Date.now()}`;

    // If call session doesn't exist, create it
    if (!callSession) {
      const { error: insertError } = await supabase
        .from('call_sessions')
        .insert({
          id: callSessionId,
          expert_id: appointment.expert_id,
          user_id: appointment.user_id,
          appointment_id: appointmentId,
          channel_name: appointment.channel_name,
          agora_token: agoraToken,
          agora_uid: agoraUid,
          call_type: callType,
          status: 'pending' // Will be updated to 'active' when user joins
        });

      if (insertError) {
        console.error('❌ Failed to create call session:', insertError);
        // Continue anyway - we can still join the call
      }
    }

    console.log('✅ Appointment call data ready:', {
      callSessionId,
      channelName: appointment.channel_name,
      callType,
      hasToken: !!agoraToken
    });

    return {
      callRequestId: '', // Not needed for appointment calls
      channelName: appointment.channel_name,
      agoraToken: agoraToken,
      agoraUid: agoraUid,
      callSessionId: callSessionId
    };
  } catch (error) {
    console.error('❌ Error joining appointment call:', error);
    toast.error('Failed to join call. Please try again.');
    return null;
  }
}

/**
 * Subscribe to call session status changes to detect when expert ends call
 * @param callSessionId - The call session ID to monitor
 * @param onCallEnded - Callback function when call is ended
 * @returns Cleanup function to unsubscribe
 */
export function subscribeToCallStatus(
  callSessionId: string,
  onCallEnded: (endedBy?: 'user' | 'expert') => void
): () => void {
  const channel = supabase
    .channel(`call_status_${callSessionId}_${Date.now()}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'call_sessions',
        filter: `id=eq.${callSessionId}`
      },
      async (payload) => {
        const updatedSession = payload.new as { status: string; end_time?: string };
        
        if (updatedSession.status === 'ended') {
          console.log('🔴 Call ended detected via subscription');
          
          // Try to determine who ended it by checking the last update
          // Note: This is a best-effort approach. For exact tracking, 
          // you might want to add an 'ended_by' field to call_sessions table
          onCallEnded();
        }
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
}

