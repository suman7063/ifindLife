import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, callSessionId } = await req.json()

    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!razorpayKeySecret) {
      throw new Error('Razorpay secret not configured')
    }

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = createHmac('sha256', razorpayKeySecret)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Invalid payment signature')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    // Handle different payment types - call sessions vs appointments
    if (callSessionId) {
      // Update call session status to completed
      const { data: session, error: updateError } = await supabaseClient
        .from('call_sessions')
        .update({
          status: 'completed',
          payment_method: 'razorpay',
          updated_at: new Date().toISOString()
        })
        .eq('id', razorpay_order_id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (updateError || !session) {
        throw new Error('Failed to update session status')
      }

      // Generate Agora token and channel for the call
      const channelName = `session_${Date.now()}_${user.id}`
      const uid = Math.floor(Math.random() * 1000000)

      // Generate Agora token using our token service
      const tokenResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-agora-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channelName: channelName,
          uid: uid,
          role: 1,
          expireTime: 3600
        })
      })

      let agoraToken = 'fallback_token'
      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json()
        agoraToken = tokenData.token
      }

      // Update session with call details
      await supabaseClient
        .from('call_sessions')
        .update({
          channel_name: channelName,
          start_time: new Date().toISOString()
        })
        .eq('id', razorpay_order_id)

      return new Response(
        JSON.stringify({ 
          success: true,
          sessionId: razorpay_order_id,
          channelName: channelName,
          uid: uid,
          token: agoraToken,
          appId: '9b3ad657507642f98a52d47893780e8e'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    } else {
      // For appointment bookings - just return success
      // The appointment creation will be handled in the frontend after payment verification
      return new Response(
        JSON.stringify({ 
          success: true,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})