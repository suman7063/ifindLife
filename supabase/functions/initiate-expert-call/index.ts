import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with user's auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role for database operations
    const supabaseAdmin = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const {
      expertId,
      expertAuthId,
      expertName,
      expertAvatar,
      userId,
      userName,
      userAvatar,
      callType,
      duration,
      appointmentId,
      channelName,
      userAgoraToken,
      expertAgoraToken,
      userUid,
      expertUid
    } = await req.json();

    // Verify expert is authenticated and matches
    if (user.id !== expertAuthId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Expert ID mismatch' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create call session with service role (bypasses RLS)
    const callSessionId = crypto.randomUUID();
    
    const { data: callSessionData, error: sessionError } = await supabaseAdmin
      .from('call_sessions')
      .insert({
        id: callSessionId,
        expert_id: expertAuthId,
        user_id: userId,
        appointment_id: appointmentId,
        channel_name: channelName,
        agora_channel_name: channelName,
        agora_token: expertAgoraToken,
        call_type: callType,
        status: 'pending',
        selected_duration: duration,
        cost: 0, // Already paid via booking
        currency: 'INR',
        payment_method: 'wallet',
        payment_status: 'completed', // Already paid
        call_direction: 'outgoing',
        expert_auth_id: expertAuthId,
        call_metadata: {
          initiated_by: expertAuthId,
          initiated_at: new Date().toISOString(),
          expert_name: expertName,
          expert_avatar: expertAvatar,
          user_name: userName,
          user_avatar: userAvatar,
          user_uid: userUid,
          expert_uid: expertUid,
          user_token: userAgoraToken,
          expert_token: expertAgoraToken,
          is_scheduled_session: true,
          appointment_id: appointmentId
        }
      })
      .select()
      .single();

    if (sessionError) {
      console.error('❌ Failed to create call session:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create call session', details: sessionError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Call session created:', callSessionId);

    // Create incoming call request for user (expert is calling user)
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes to accept
    
    const { data: callRequestData, error: requestError } = await supabaseAdmin
      .from('incoming_call_requests')
      .insert({
        user_id: userId, // User receives the call request
        expert_id: expertAuthId,
        call_type: callType,
        status: 'pending',
        channel_name: channelName,
        agora_token: userAgoraToken, // User's token
        agora_uid: userUid,
        estimated_cost_inr: 0, // Already paid
        estimated_cost_eur: 0, // Already paid
        expires_at: expiresAt.toISOString(),
        call_session_id: callSessionId,
        user_metadata: {
          name: userName || 'User',
          avatar: userAvatar || null,
          user_id: userId
        },
        expert_metadata: {
          name: expertName || 'Expert',
          avatar: expertAvatar || null,
          expert_id: expertAuthId
        }
      })
      .select()
      .single();

    if (requestError) {
      console.error('❌ Failed to create incoming call request:', requestError);
      // Clean up call session if request creation fails
      await supabaseAdmin.from('call_sessions').delete().eq('id', callSessionId);
      return new Response(
        JSON.stringify({ error: 'Failed to create call request', details: requestError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('✅ Incoming call request created for user:', callRequestData.id);

    // Send notification to user
    try {
      console.log('📨 Sending notification to user:', userId);
      
      const notificationResponse = await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          type: 'incoming_call_request',
          title: `${expertName || 'Expert'} is starting your ${callType === 'video' ? 'Video' : 'Audio'} session`,
          content: `${expertName || 'Your expert'} wants to start your scheduled ${callType} session`,
          referenceId: callRequestData.id,
          senderId: expertAuthId,
          data: {
            callRequestId: callRequestData.id,
            callSessionId: callSessionId,
            callType: callType,
            duration: duration,
            estimatedCost: 0, // Already paid
            currency: 'INR',
            expertName: expertName,
            expertAvatar: expertAvatar,
            isScheduledSession: true,
            appointmentId: appointmentId
          }
        })
      });

      if (!notificationResponse.ok) {
        const errorText = await notificationResponse.text();
        console.warn('⚠️ Notification service unavailable (call will still proceed):', errorText);
      } else {
        console.log('✅ Notification sent to user successfully');
      }
    } catch (notificationErr: any) {
      console.warn('⚠️ Notification service unavailable (call will still proceed):', notificationErr?.message || 'Unknown error');
    }

    return new Response(
      JSON.stringify({
        success: true,
        callRequestId: callRequestData.id,
        callSessionId: callSessionId,
        channelName: channelName,
        agoraToken: expertAgoraToken,
        agoraUid: expertUid
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Error in initiate-expert-call:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

