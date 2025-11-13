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
  currency?: 'INR' | 'USD' | 'EUR';
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
    const shortExpertId = expertId.replace(/-/g, '').substring(0, 8);
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

    // Create call session
    const callSessionId = `session_${expertId}_${userId}_${timestamp}`;
    
    const { data: sessionData, error: sessionError } = await supabase
      .from('call_sessions')
      .insert({
        id: callSessionId,
        expert_id: expertId,
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
      await supabase
        .from('call_sessions')
        .update({ 
          status: 'ended',
          end_time: new Date().toISOString()
        })
        .eq('id', callRequest.call_session_id);
    }

    return true;
  } catch (error) {
    console.error('❌ Error declining call:', error);
    return false;
  }
}

/**
 * End a call and update session
 */
export async function endCall(callSessionId: string, duration?: number, endedBy?: 'user' | 'expert'): Promise<boolean> {
  try {
    const endTime = new Date().toISOString();
    
    // Fetch call session to get user_id before updating
    const { data: callSession, error: fetchError } = await supabase
      .from('call_sessions')
      .select('user_id, expert_id')
      .eq('id', callSessionId)
      .single();

    if (fetchError) {
      console.error('❌ Failed to fetch call session:', fetchError);
      return false;
    }

    const updateData: {
      status: 'ended';
      end_time: string;
      updated_at: string;
      duration?: number;
    } = {
      status: 'ended',
      end_time: endTime,
      updated_at: endTime
    };

    if (duration !== undefined) {
      updateData.duration = duration;
    }

    const { error } = await supabase
      .from('call_sessions')
      .update(updateData)
      .eq('id', callSessionId);

    if (error) {
      console.error('❌ Failed to end call session:', error);
      return false;
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
              duration: duration
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

