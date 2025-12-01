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
    const { id } = body;

    console.log('admin-restore-expert: Received request:', { id, body });

    if (!id) {
      console.error('admin-restore-expert: Missing required field: id');
      return new Response(JSON.stringify({
        success: false,
        error: `id is required. Received: id=${id}`
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Restore expert by setting deleted_at to NULL
    console.log('admin-restore-expert: Restoring expert_accounts with auth_id:', id);
    const { data: restoredData, error: dbError } = await supabase
      .from('expert_accounts')
      .update({ deleted_at: null })
      .eq('auth_id', id)
      .select()
      .single();

    if (dbError) {
      console.error('admin-restore-expert: Database error:', dbError);
      return new Response(JSON.stringify({
        success: false,
        error: `Database error: ${dbError.message}`
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (!restoredData) {
      console.error('admin-restore-expert: No deleted expert found with auth_id:', id);
      return new Response(JSON.stringify({
        success: false,
        error: `No deleted expert found with auth_id: ${id}`
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    console.log('admin-restore-expert: Expert account restored successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'Expert restored successfully',
      expert: restoredData
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

