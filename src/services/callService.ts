import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AGORA_CONFIG } from '@/utils/agoraConfig';

export interface InitiateCallParams {
  expertId: string; // expert_accounts.id
  expertAuthId: string; // expert_accounts.auth_id (for notifications)
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
 * Creates call session, generates Agora token, creates incoming call request, and sends notifications
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

    // Step 1: Generate unique channel name and UIDs
    // Use short IDs to ensure channel name is <= 64 bytes (Agora requirement)
    const timestamp = Date.now();
    const shortExpertId = expertId.replace(/-/g, '').substring(0, 8);
    const shortUserId = userId.replace(/-/g, '').substring(0, 8);
    const channelName = `call_${shortExpertId}_${shortUserId}_${timestamp}`;
    const userUid = Math.floor(Math.random() * 1000000);
    const expertUid = Math.floor(Math.random() * 1000000);

    // Step 2: Generate Agora tokens for both user and expert
    console.log('🔑 Generating Agora tokens...');
    
    // Generate token for user
    const { data: userTokenData, error: userTokenError } = await supabase.functions.invoke('generate-agora-token', {
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

    // Generate token for expert
    const { data: expertTokenData, error: expertTokenError } = await supabase.functions.invoke('generate-agora-token', {
      body: {
        channelName,
        uid: expertUid,
        role: 1, // Publisher role
        expireTime: (duration + 5) * 60 // Token expires after call duration + 5 min buffer
      }
    });

    if (expertTokenError) {
      console.error('❌ Failed to generate Agora token for expert:', expertTokenError);
      toast.error('Failed to initialize call. Please try again.');
      return null;
    }

    const expertAgoraToken = expertTokenData?.token || null;
    console.log('✅ Agora token generated for expert (UID:', expertUid, ')');

    // Step 3: Create call session
    console.log('📝 Creating call session...');
    const callSessionId = `session_${expertId}_${userId}_${timestamp}`;
    
    // Verify expert exists
    const { data: expertData } = await supabase
      .from('expert_accounts')
      .select('id')
      .eq('id', expertId)
      .single();
    
    if (!expertData) {
      throw new Error('Expert not found');
    }
    
    // expert_id in call_sessions is UUID (references expert_accounts.id)
    // Note: TypeScript types may show expert_id as number, but DB schema has it as UUID
    // We'll use channel_name as the id for easy lookup, or let DB auto-generate
    const { data: sessionData, error: sessionError } = await supabase
      .from('call_sessions')
      .insert({
        id: callSessionId,
        // Type assertion needed: TS types say number but DB is UUID
        expert_id: expertId as unknown as number,
        user_id: userId,
        channel_name: channelName,
        agora_channel_name: channelName,
        agora_token: userAgoraToken, // User's token (for user's UID)
        agora_uid: userUid, // Store user's UID
        call_type: callType,
        status: 'pending',
        selected_duration: duration,
        cost: estimatedCost,
        currency,
        call_direction: 'outgoing',
        expert_auth_id: expertAuthId,
        call_metadata: {
          initiated_by: userId,
          initiated_at: new Date().toISOString(),
          user_name: userName,
          user_avatar: userAvatar,
          expert_uid: expertUid, // Store expert UID in metadata
          expert_token: expertAgoraToken // Store expert token in metadata for reference
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

    // Step 4: Create incoming call request for expert
    console.log('📨 Creating incoming call request...');
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes to accept
    
    const { data: callRequestData, error: requestError } = await supabase
      .from('incoming_call_requests')
      .insert({
        user_id: userId,
        expert_id: expertAuthId, // Must be auth_id
        call_type: callType,
        status: 'pending',
        channel_name: channelName,
        agora_token: expertAgoraToken, // Expert's token (for expert's UID)
        agora_uid: expertUid, // Expert's UID
        estimated_cost_inr: currency === 'INR' ? estimatedCost : null,
        estimated_cost_eur: currency === 'EUR' ? estimatedCost : null,
        estimated_cost_usd: currency === 'USD' ? estimatedCost : null,
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
      // Continue anyway - the call session is created
      toast.warning('Call initiated but notification may not have been sent');
    } else {
      console.log('✅ Incoming call request created:', callRequestData.id);
    }

    // Step 5: Send notification to expert
    try {
      await supabase.functions.invoke('send-notification', {
        body: {
          userId: expertAuthId,
          type: 'incoming_call',
          title: `Incoming ${callType === 'video' ? 'Video' : 'Audio'} Call`,
          content: `${userName || 'A user'} wants to connect with you`,
          data: {
            callRequestId: callRequestData?.id || null,
            callSessionId,
            channelName,
            callType,
            agoraToken: expertAgoraToken,
            agoraUid: expertUid
          }
        }
      });
      console.log('✅ Notification sent to expert');
    } catch (notifError) {
      console.error('⚠️ Failed to send notification:', notifError);
      // Don't fail the call if notification fails
    }

    // Step 6: Send notification to user (confirmation)
    try {
      await supabase.functions.invoke('send-notification', {
        body: {
          userId,
          type: 'call_initiated',
          title: 'Call Initiated',
          content: `Waiting for ${callType === 'video' ? 'video' : 'audio'} call to be accepted`,
          data: {
            callSessionId,
            channelName,
            callType
          }
        }
      });
    } catch (notifError) {
      console.error('⚠️ Failed to send user notification:', notifError);
    }

    return {
      callRequestId: callRequestData?.id || '',
      channelName,
      agoraToken: userAgoraToken, // Return user's token
      agoraUid: userUid, // Return user's UID
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
      // Update call session status
      await supabase
        .from('call_sessions')
        .update({ 
          status: 'active',
          start_time: new Date().toISOString(),
          answered_at: new Date().toISOString()
        })
        .eq('id', callRequest.call_session_id);

      // Send notification to user
      await supabase.functions.invoke('send-notification', {
        body: {
          userId: callRequest.user_id,
          type: 'call_accepted',
          title: 'Call Accepted',
          content: 'The expert has accepted your call. Connecting now...',
          data: {
            callRequestId,
            callSessionId: callRequest.call_session_id
          }
        }
      });
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

    // Get call request and send notification to user
    const { data: callRequest } = await supabase
      .from('incoming_call_requests')
      .select('user_id, call_session_id')
      .eq('id', callRequestId)
      .single();

    if (callRequest) {
      // Update call session
      await supabase
        .from('call_sessions')
        .update({ 
          status: 'ended',
          end_time: new Date().toISOString()
        })
        .eq('id', callRequest.call_session_id);

      // Send notification to user
      await supabase.functions.invoke('send-notification', {
        body: {
          userId: callRequest.user_id,
          type: 'call_declined',
          title: 'Call Declined',
          content: 'The expert declined your call request',
          data: {
            callRequestId,
            callSessionId: callRequest.call_session_id
          }
        }
      });
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
export async function endCall(callSessionId: string, duration?: number): Promise<boolean> {
  try {
    const endTime = new Date().toISOString();
    
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

    // Update related call requests to cancelled
    await supabase
      .from('incoming_call_requests')
      .update({ status: 'cancelled' })
      .eq('call_session_id', callSessionId)
      .eq('status', 'pending');

    return true;
  } catch (error) {
    console.error('❌ Error ending call:', error);
    return false;
  }
}

/**
 * Get call session details
 */
export async function getCallSession(callSessionId: string) {
  try {
    const { data, error } = await supabase
      .from('call_sessions')
      .select('*')
      .eq('id', callSessionId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Error fetching call session:', error);
    return null;
  }
}

/**
 * Get active call request for user
 */
export async function getUserActiveCallRequest(userId: string) {
  try {
    const { data, error } = await supabase
      .from('incoming_call_requests')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['pending', 'accepted'])
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Error fetching user call request:', error);
    return null;
  }
}

