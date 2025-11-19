import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    const body = await req.json().catch(() => ({}));
    const { id, status } = body;

    console.log('admin-update-expert: Received request:', { id, status, body });

    if (!id || !status) {
      console.error('admin-update-expert: Missing required fields:', { id, status });
      return new Response(JSON.stringify({
        success: false,
        error: `id and status are required. Received: id=${id}, status=${status}`
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (!['approved', 'disapproved', 'pending'].includes(status)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'invalid status'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Update by auth_id (primary key)
    console.log('admin-update-expert: Updating expert_accounts with auth_id:', id);
    const { data, error } = await supabase
      .from('expert_accounts')
      .update({ status })
      .eq('auth_id', id)
      .select('auth_id, status')
      .limit(1);

    if (error) {
      console.error('admin-update-expert: Database error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: `Database error: ${error.message}`
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (!data || data.length === 0) {
      console.error('admin-update-expert: No expert found with auth_id:', id);
      return new Response(JSON.stringify({
        success: false,
        error: `No expert found with auth_id: ${id}`
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    console.log('admin-update-expert: Successfully updated expert:', data[0]);

    return new Response(JSON.stringify({
      success: true,
      expert: data[0]
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (e) {
    console.error('Unhandled error:', e);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
});

