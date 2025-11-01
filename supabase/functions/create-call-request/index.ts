import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verify user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization header required' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const {
      user_id,
      expert_id,
      call_type,
      channel_name,
      call_session_id,
      expires_at,
      agora_token,
      agora_uid,
      estimated_cost_inr,
      estimated_cost_eur,
      user_metadata
    } = await req.json();

    // Validate that user_id matches authenticated user
    if (user_id !== user.id) {
      return new Response(
        JSON.stringify({ success: false, error: 'User ID mismatch' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    if (!expert_id || !call_type || !channel_name) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: expert_id, call_type, channel_name' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create incoming call request using service role (bypasses RLS)
    const { data: callRequest, error } = await supabase
      .from('incoming_call_requests')
      .insert({
        user_id: user.id, // Use authenticated user's ID
        expert_id,
        call_type,
        status: 'pending',
        channel_name,
        call_session_id: call_session_id || null,
        expires_at: expires_at || new Date(Date.now() + 2 * 60 * 1000).toISOString(),
        agora_token: agora_token || null,
        agora_uid: agora_uid || null,
        estimated_cost_inr: estimated_cost_inr || null,
        estimated_cost_eur: estimated_cost_eur || null,
        user_metadata: user_metadata || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating call request:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          details: error.details,
          hint: error.hint
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log('✅ Call request created via edge function:', callRequest.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        callRequest 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in create-call-request:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

