import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { expert_id, call_type = 'video', user_name = 'Test User' } = await req.json();

    if (!expert_id) {
      throw new Error('expert_id is required');
    }

    // Generate test data
    const channelName = `test_call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now
    
    // Get Agora token for the test call
    const { data: tokenData, error: tokenError } = await supabase.functions.invoke('smooth-action', {
      body: {
        channelName,
        uid: Math.floor(Math.random() * 1000000),
        role: 1,
        expireTime: 3600
      }
    });

    if (tokenError) {
      console.error('Failed to get Agora token:', tokenError);
      throw new Error('Failed to get Agora token');
    }

    // Create the call request
    const { data, error } = await supabase
      .from('incoming_call_requests')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // Test user ID
        expert_id,
        call_type,
        channel_name: channelName,
        agora_token: tokenData.token,
        agora_uid: tokenData.uid,
        estimated_cost_usd: call_type === 'video' ? 2.50 : 1.50,
        estimated_cost_inr: call_type === 'video' ? 200 : 120,
        expires_at: expiresAt.toISOString(),
        user_metadata: {
          name: user_name,
          avatar: null,
          test_call: true
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create call request:', error);
      throw error;
    }

    console.log('✅ Test call request created:', data);

    return new Response(JSON.stringify({
      success: true,
      call_request: data,
      message: `Test ${call_type} call request created for expert ${expert_id}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error creating test call request:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});