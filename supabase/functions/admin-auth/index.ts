import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LoginRequest {
  action: 'login' | 'verify' | 'logout';
  username?: string;
  password?: string;
  sessionToken?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, username, password, sessionToken } = await req.json() as LoginRequest

    switch (action) {
      case 'login':
        if (!username || !password) {
          return new Response(
            JSON.stringify({ success: false, error: 'Username and password required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Call the authenticate_admin function
        const { data: authResult, error: authError } = await supabaseClient
          .rpc('authenticate_admin', {
            p_username: username,
            p_password: password
          })

        if (authError) {
          console.error('Authentication error:', authError)
          return new Response(
            JSON.stringify({ success: false, error: 'Authentication failed' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        if (!authResult?.success) {
          return new Response(
            JSON.stringify({ success: false, error: authResult?.error || 'Invalid credentials' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Create session token
        const sessionData = {
          admin_id: authResult.admin.id,
          session_token: crypto.randomUUID(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          ip_address: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown',
          user_agent: req.headers.get('user-agent') || null
        }

        const { error: sessionError } = await supabaseClient
          .from('admin_sessions')
          .insert(sessionData)

        if (sessionError) {
          console.error('Session creation error:', sessionError)
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to create session' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({
            success: true,
            admin: authResult.admin,
            sessionToken: sessionData.session_token,
            expiresAt: sessionData.expires_at
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'verify':
        if (!sessionToken) {
          return new Response(
            JSON.stringify({ success: false, error: 'Session token required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { data: session, error: sessionQueryError } = await supabaseClient
          .from('admin_sessions')
          .select(`
            *,
            admin_accounts(id, username, email, role, last_login)
          `)
          .eq('session_token', sessionToken)
          .gt('expires_at', new Date().toISOString())
          .single()

        if (sessionQueryError || !session) {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid or expired session' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({
            success: true,
            admin: session.admin_accounts
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'logout':
        if (sessionToken) {
          await supabaseClient
            .from('admin_sessions')
            .delete()
            .eq('session_token', sessionToken)
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Admin auth error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})