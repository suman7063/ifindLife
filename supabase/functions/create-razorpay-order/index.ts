import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency, expertId, serviceId, description, callSessionId } = await req.json()

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured')
    }

    // Create Razorpay order
    const orderData = {
      amount: amount, // Amount already in paise from frontend
      currency: currency,
      receipt: `booking_${Date.now()}`,
      notes: {
        expertId: expertId,
        serviceId: serviceId,
        description: description,
        callSessionId: callSessionId
      }
    }

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`)
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Razorpay API error: ${errorData}`)
    }

    const order = await response.json()

    // Store order in database for verification
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

    // Store payment order for verification - handle both appointments and call sessions
    if (callSessionId) {
      // This is for call sessions
      await supabaseClient.from('call_sessions').insert({
        id: order.id,
        user_id: user.id,
        expert_id: parseInt(expertId), // Convert expertId to number
        call_type: 'video',
        channel_name: `session_${Date.now()}`,
        status: 'pending_payment',
        selected_duration: 60, // Default 60 minutes
        cost: currency === 'INR' ? amount / 100 : null, // Convert back from paise
        cost_eur: currency === 'EUR' ? amount / 100 : null,
        currency: currency
      })
    }
    // For appointments, we don't need to store anything here - will be handled after payment success

    return new Response(
      JSON.stringify({ 
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        razorpayKeyId: razorpayKeyId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})