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
    const { id, status, category, feedback_message } = body;

    console.log('admin-update-expert: Received request:', { id, status, category, body });

    if (!id) {
      console.error('admin-update-expert: Missing required field: id');
      return new Response(JSON.stringify({
        success: false,
        error: `id is required. Received: id=${id}`
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Build update object
    const updateData: any = {};
    
    if (status) {
      if (!['approved', 'rejected', 'disapproved', 'pending'].includes(status)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'invalid status'
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
      // Map 'rejected' to 'disapproved' for database compatibility
      // (database constraint still uses 'disapproved', but UI uses 'rejected')
      updateData.status = status === 'rejected' ? 'disapproved' : status;
    }

    if (category) {
      // Validate category if provided
      const validCategories = ['listening-volunteer', 'listening-expert', 'listening-coach', 'mindfulness-expert'];
      if (!validCategories.includes(category)) {
        return new Response(JSON.stringify({
          success: false,
          error: `invalid category. Must be one of: ${validCategories.join(', ')}`
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
      updateData.category = category;
    }

    if (feedback_message !== undefined) {
      // Save feedback message (can be empty string to clear it)
      updateData.feedback_message = feedback_message || null;
    }

    // Always update the admin update timestamp when status or feedback is changed
    if (status || feedback_message !== undefined) {
      updateData.updated_by_admin_at = new Date().toISOString();
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'At least one of status or category must be provided'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Update by auth_id (primary key)
    console.log('admin-update-expert: Updating expert_accounts with auth_id:', id, 'updateData:', updateData);
    const { data, error } = await supabase
      .from('expert_accounts')
      .update(updateData)
      .eq('auth_id', id)
      .select('auth_id, status, category')
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

