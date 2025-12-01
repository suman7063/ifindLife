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

    console.log('admin-delete-expert: Received request:', { id, body });

    if (!id) {
      console.error('admin-delete-expert: Missing required field: id');
      return new Response(JSON.stringify({
        success: false,
        error: `id is required. Received: id=${id}`
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Soft delete: Set deleted_at timestamp instead of actually deleting
    console.log('admin-delete-expert: Soft deleting expert_accounts with auth_id:', id);
    const { data: deletedData, error: dbError } = await supabase
      .from('expert_accounts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('auth_id', id)
      .select()
      .single();

    if (dbError) {
      console.error('admin-delete-expert: Database error:', dbError);
      return new Response(JSON.stringify({
        success: false,
        error: `Database error: ${dbError.message}`
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (!deletedData) {
      console.error('admin-delete-expert: No expert found with auth_id:', id);
      return new Response(JSON.stringify({
        success: false,
        error: `No expert found with auth_id: ${id}`
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    console.log('admin-delete-expert: Expert account soft deleted successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'Expert soft deleted successfully',
      expert: deletedData
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

