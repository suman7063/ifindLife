import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AdminAuthRequest {
  action: 'login' | 'logout' | 'verify';
  username?: string;
  password?: string;
  sessionToken?: string;
}

interface AdminSessionRow {
  session_token: string;
  admin_id: string;
  expires_at: string;
  revoked_at: string | null;
}

function generateSessionToken(): string {
  return crypto.randomUUID() + '-' + Date.now();
}

function generateSessionExpiry(): string {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 8); // 8 hour session
  return expiry.toISOString();
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: { ...corsHeaders, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' }
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body with error handling
    let requestData: AdminAuthRequest;
    try {
      const body = await req.text();
      if (!body) {
        return new Response(
          JSON.stringify({ success: false, error: 'Request body is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      requestData = JSON.parse(body);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid request format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const { action, username, password, sessionToken } = requestData;

    if (!action) {
      return new Response(
        JSON.stringify({ success: false, error: 'Action is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Admin auth action: ${action}`);

    switch (action) {
      case 'login': {
        if (!username || !password) {
          return new Response(
            JSON.stringify({ success: false, error: 'Username and password required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // Call the authenticate_admin function
        const { data: authResult, error } = await supabase.rpc('authenticate_admin', {
          p_username: username.trim(),
          p_password: password
        });

        if (error) {
          console.error('Authentication RPC error:', JSON.stringify(error, null, 2));
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: error.message || 'Authentication service error' 
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // Validate authResult structure
        if (!authResult || typeof authResult !== 'object') {
          console.error('Invalid authResult format:', authResult);
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid authentication response' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        if (!authResult.success) {
          const errorMsg = authResult.error || 'Invalid credentials';
          console.log(`Authentication failed for user: ${username}, reason: ${errorMsg}`);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: errorMsg
            }),
            { 
              status: 401, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // Validate admin data exists in response
        if (!authResult.admin || !authResult.admin.id) {
          console.error('Missing admin data in auth result:', authResult);
          return new Response(
            JSON.stringify({ success: false, error: 'Authentication succeeded but admin data is missing' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // Create session persisted in DB
        const newSessionToken = generateSessionToken();
        const expiresAt = generateSessionExpiry();

        // Optional: revoke previous active sessions for this admin
        await supabase
          .from('admin_sessions')
          .update({ revoked_at: new Date().toISOString() })
          .is('revoked_at', null)
          .eq('admin_id', authResult.admin.id);

        const { error: insertError } = await supabase
          .from('admin_sessions')
          .insert({
            session_token: newSessionToken,
            admin_id: authResult.admin.id,
            expires_at: expiresAt,
            revoked_at: null
          });

        if (insertError) {
          console.error('Failed to create admin session:', JSON.stringify(insertError, null, 2));
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: insertError.message || 'Could not create session' 
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Admin login successful for user: ${username} (ID: ${authResult.admin.id})`);

        return new Response(
          JSON.stringify({
            success: true,
            sessionToken: newSessionToken,
            expiresAt,
            admin: authResult.admin
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      case 'verify': {
        if (!sessionToken) {
          return new Response(
            JSON.stringify({ success: false, error: 'Session token required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // Load session from DB
        const { data: session, error: sessionError } = await supabase
          .from('admin_sessions')
          .select('session_token, admin_id, expires_at, revoked_at')
          .eq('session_token', sessionToken)
          .maybeSingle<AdminSessionRow>();

        if (sessionError || !session) {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid session' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check expiry or revocation
        if (
          session.revoked_at !== null ||
          new Date(session.expires_at) <= new Date()
        ) {
          // Best-effort cleanup when expired
          await supabase
            .from('admin_sessions')
            .delete()
            .eq('session_token', sessionToken);
          return new Response(
            JSON.stringify({ success: false, error: 'Session expired' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get admin data
        const { data: admin, error } = await supabase
          .from('admin_accounts')
          .select('id, username, email, role')
          .eq('id', session.admin_id)
          .single();

        if (error || !admin) {
          // Revoke this session since account is invalid
          await supabase
            .from('admin_sessions')
            .update({ revoked_at: new Date().toISOString() })
            .eq('session_token', sessionToken);
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid admin account' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            admin
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      case 'logout': {
        if (sessionToken) {
          await supabase
            .from('admin_sessions')
            .update({ revoked_at: new Date().toISOString() })
            .eq('session_token', sessionToken);
        }
        
        return new Response(
          JSON.stringify({ success: true }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }
  } catch (error) {
    console.error('Admin auth unhandled error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});