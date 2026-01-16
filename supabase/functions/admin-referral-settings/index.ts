import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-session-token',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get admin session token from header
    const sessionToken = req.headers.get('x-admin-session-token')
    
    if (!sessionToken) {
      return new Response(
        JSON.stringify({ error: 'Admin session token required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify admin session using admin-auth function
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

    const { data: verifyData, error: verifyError } = await supabaseClient.functions.invoke('admin-auth', {
      body: {
        action: 'verify',
        sessionToken
      }
    })

    if (verifyError || !verifyData?.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired admin session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use service role key for database operations (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const method = req.method
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || method.toLowerCase()

    if (method === 'GET') {
      // Fetch referral settings
      const { data, error } = await supabaseAdmin
        .from('referral_settings')
        .select('*')
        .limit(1)
        .maybeSingle()

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'POST' || method === 'PUT') {
      // Save/update referral settings
      const body = await req.json()
      
      const settingsData: any = {
        id: body.id || undefined,
        referrer_reward_inr: body.referrer_reward_inr ?? 10,
        referrer_reward_eur: body.referrer_reward_eur ?? 10,
        referred_reward_inr: body.referred_reward_inr ?? 5,
        referred_reward_eur: body.referred_reward_eur ?? 5,
        active: body.active ?? false,
        currency: body.currency || 'INR',
        description: body.description || '',
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabaseAdmin
        .from('referral_settings')
        .upsert(settingsData, {
          onConflict: 'id'
        })
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ data, success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error in admin-referral-settings:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
