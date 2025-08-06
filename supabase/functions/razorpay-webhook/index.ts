import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
}

interface RazorpayWebhookPayload {
  entity: string
  account_id: string
  event: string
  contains: string[]
  payload: {
    payment: {
      entity: {
        id: string
        entity: string
        amount: number
        currency: string
        status: string
        order_id: string
        invoice_id?: string
        international: boolean
        method: string
        amount_refunded: number
        refund_status?: string
        captured: boolean
        description?: string
        card_id?: string
        bank?: string
        wallet?: string
        vpa?: string
        email: string
        contact: string
        notes: Record<string, any>
        fee: number
        tax: number
        error_code?: string
        error_description?: string
        error_source?: string
        error_step?: string
        error_reason?: string
        acquirer_data?: Record<string, any>
        created_at: number
      }
    }
    order?: {
      entity: {
        id: string
        entity: string
        amount: number
        amount_paid: number
        amount_due: number
        currency: string
        receipt: string
        offer_id?: string
        status: string
        attempts: number
        notes: Record<string, any>
        created_at: number
      }
    }
  }
  created_at: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Razorpay webhook received:', req.method)

    // Verify webhook signature for security
    const signature = req.headers.get('x-razorpay-signature')
    if (!signature) {
      console.error('Missing Razorpay signature header')
      return new Response(
        JSON.stringify({ error: 'Missing signature' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const body = await req.text()
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
    
    if (!webhookSecret) {
      console.error('Razorpay webhook secret not configured')
      return new Response(
        JSON.stringify({ error: 'Webhook secret not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // Verify signature using HMAC SHA256
    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (expectedSignature !== signature) {
      console.error('Invalid webhook signature')
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    // Parse webhook payload
    const payload: RazorpayWebhookPayload = JSON.parse(body)
    console.log('Webhook event:', payload.event)
    console.log('Payment ID:', payload.payload.payment?.entity?.id)
    console.log('Order ID:', payload.payload.payment?.entity?.order_id)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle different webhook events
    switch (payload.event) {
      case 'payment.captured':
        await handlePaymentCaptured(supabaseClient, payload)
        break
      
      case 'payment.failed':
        await handlePaymentFailed(supabaseClient, payload)
        break
      
      case 'payment.authorized':
        await handlePaymentAuthorized(supabaseClient, payload)
        break
      
      case 'order.paid':
        await handleOrderPaid(supabaseClient, payload)
        break
      
      default:
        console.log(`Unhandled webhook event: ${payload.event}`)
        break
    }

    // Log webhook event for audit trail
    await supabaseClient
      .from('webhook_logs')
      .insert({
        provider: 'razorpay',
        event_type: payload.event,
        payload: payload,
        processed_at: new Date().toISOString(),
        status: 'success'
      })
      .select()

    return new Response(
      JSON.stringify({ status: 'success', event: payload.event }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    
    // Log failed webhook for debugging
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )
      
      await supabaseClient
        .from('webhook_logs')
        .insert({
          provider: 'razorpay',
          event_type: 'error',
          payload: { error: error.message },
          processed_at: new Date().toISOString(),
          status: 'failed'
        })
    } catch (logError) {
      console.error('Failed to log webhook error:', logError)
    }

    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

async function handlePaymentCaptured(supabase: any, payload: RazorpayWebhookPayload) {
  const payment = payload.payload.payment.entity
  const orderId = payment.order_id
  
  console.log(`Processing payment.captured for order: ${orderId}`)
  
  try {
    // Update call sessions if this is a call payment
    const { data: callSession, error: callSessionError } = await supabase
      .from('call_sessions')
      .update({
        status: 'completed',
        payment_status: 'paid',
        razorpay_payment_id: payment.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (callSession) {
      console.log('Updated call session:', callSession.id)
      return
    }

    // Update appointments if this is an appointment payment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .update({
        status: 'confirmed',
        payment_status: 'paid',
        razorpay_payment_id: payment.id
      })
      .eq('id', orderId)
      .select()
      .single()

    if (appointment) {
      console.log('Updated appointment:', appointment.id)
      return
    }

    // Log if no matching record found
    console.log(`No matching record found for order: ${orderId}`)
    
  } catch (error) {
    console.error('Error handling payment.captured:', error)
    throw error
  }
}

async function handlePaymentFailed(supabase: any, payload: RazorpayWebhookPayload) {
  const payment = payload.payload.payment.entity
  const orderId = payment.order_id
  
  console.log(`Processing payment.failed for order: ${orderId}`)
  
  try {
    // Update call sessions
    await supabase
      .from('call_sessions')
      .update({
        status: 'payment_failed',
        payment_status: 'failed',
        razorpay_payment_id: payment.id,
        failure_reason: payment.error_description || 'Payment failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    // Update appointments
    await supabase
      .from('appointments')
      .update({
        status: 'payment_failed',
        payment_status: 'failed',
        razorpay_payment_id: payment.id,
        notes: payment.error_description || 'Payment failed'
      })
      .eq('id', orderId)

    console.log('Updated records for failed payment')
    
  } catch (error) {
    console.error('Error handling payment.failed:', error)
    throw error
  }
}

async function handlePaymentAuthorized(supabase: any, payload: RazorpayWebhookPayload) {
  const payment = payload.payload.payment.entity
  const orderId = payment.order_id
  
  console.log(`Processing payment.authorized for order: ${orderId}`)
  
  try {
    // Update records to show payment is authorized but not captured yet
    await supabase
      .from('call_sessions')
      .update({
        payment_status: 'authorized',
        razorpay_payment_id: payment.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    await supabase
      .from('appointments')
      .update({
        payment_status: 'authorized',
        razorpay_payment_id: payment.id
      })
      .eq('id', orderId)

    console.log('Updated records for authorized payment')
    
  } catch (error) {
    console.error('Error handling payment.authorized:', error)
    throw error
  }
}

async function handleOrderPaid(supabase: any, payload: RazorpayWebhookPayload) {
  const order = payload.payload.order?.entity
  if (!order) return
  
  console.log(`Processing order.paid for order: ${order.id}`)
  
  try {
    // This event is triggered when an order is completely paid
    // You can add additional business logic here if needed
    console.log('Order fully paid:', order.id)
    
  } catch (error) {
    console.error('Error handling order.paid:', error)
    throw error
  }
}