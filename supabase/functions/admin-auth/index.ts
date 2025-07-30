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

interface AdminSession {
  token: string;
  adminId: string;
  expiresAt: string;
}

// In-memory session store (in production, use Redis or database)
const adminSessions = new Map<string, AdminSession>();

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
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { action, username, password, sessionToken }: AdminAuthRequest = await req.json();

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
          p_username: username,
          p_password: password
        });

        if (error) {
          console.error('Authentication error:', error);
          return new Response(
            JSON.stringify({ success: false, error: 'Authentication failed' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        if (!authResult?.success) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: authResult?.error || 'Invalid credentials' 
            }),
            { 
              status: 401, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // Create session
        const sessionToken = generateSessionToken();
        const expiresAt = generateSessionExpiry();
        
        adminSessions.set(sessionToken, {
          token: sessionToken,
          adminId: authResult.admin.id,
          expiresAt
        });

        console.log(`Admin login successful for user: ${username}`);

        return new Response(
          JSON.stringify({
            success: true,
            sessionToken,
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

        const session = adminSessions.get(sessionToken);
        if (!session) {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid session' }),
            { 
              status: 401, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // Check if session is expired
        if (new Date(session.expiresAt) <= new Date()) {
          adminSessions.delete(sessionToken);
          return new Response(
            JSON.stringify({ success: false, error: 'Session expired' }),
            { 
              status: 401, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // Get admin data
        const { data: admin, error } = await supabase
          .from('admin_accounts')
          .select('id, username, email, role')
          .eq('id', session.adminId)
          .single();

        if (error || !admin) {
          adminSessions.delete(sessionToken);
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid admin account' }),
            { 
              status: 401, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
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
          adminSessions.delete(sessionToken);
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
    console.error('Admin auth error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});