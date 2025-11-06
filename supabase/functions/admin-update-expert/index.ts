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

    if (!id || !status) {
      return new Response(JSON.stringify({
        success: false,
        error: 'id and status are required'
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

    // Update by either expert_accounts.id (primary) or auth_id (fallback)
    const { data, error } = await supabase
      .from('expert_accounts')
      .update({ status })
      .or(`id.eq.${id},auth_id.eq.${id}`)
      .select('id, auth_id, status')
      .limit(1);

    if (error || !data || data.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: error?.message || 'No matching expert found'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

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

