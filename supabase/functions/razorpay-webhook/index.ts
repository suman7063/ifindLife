import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts"
import { Resend } from "npm:resend@2.0.0"

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
    payment_link?: {
      entity: {
        id: string
        entity: string
        status: string
        amount: number
        amount_paid: number
        currency: string
        description?: string
        customer: {
          name?: string
          email?: string
          contact?: string
        }
        created_at: number
        updated_at: number
        expire_by?: number
        expired_at?: number
        cancelled_at?: number
        short_url: string
      }
    }
    payment?: {
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
    dispute?: {
      entity: {
        id: string
        entity: string
        payment_id: string
        amount: number
        currency: string
        amount_deducted: number
        reason_code: string
        reason_description: string
        status: string
        phase: string
        respond_by: number
        created_at: number
        evidence?: Record<string, any>
      }
    }
    downtime?: {
      entity: {
        id: string
        entity: string
        begin: number
        end?: number
        status: string
        source: string
        method?: string
        instrument?: Record<string, any>
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
      // Payment Link Events
      case 'payment_link.paid':
        await handlePaymentLinkPaid(supabaseClient, payload)
        break
      
      case 'payment_link.partially_paid':
        await handlePaymentLinkPartiallyPaid(supabaseClient, payload)
        break
      
      case 'payment_link.expired':
        await handlePaymentLinkExpired(supabaseClient, payload)
        break
      
      case 'payment_link.cancelled':
        await handlePaymentLinkCancelled(supabaseClient, payload)
        break

      // Payment Events
      case 'payment.authorized':
        await handlePaymentAuthorized(supabaseClient, payload)
        break
      
      case 'payment.failed':
        await handlePaymentFailed(supabaseClient, payload)
        break
      
      case 'payment.captured':
        await handlePaymentCaptured(supabaseClient, payload)
        break

      // Payment Dispute Events
      case 'payment.dispute.created':
        await handlePaymentDisputeCreated(supabaseClient, payload)
        break
      
      case 'payment.dispute.won':
        await handlePaymentDisputeWon(supabaseClient, payload)
        break
      
      case 'payment.dispute.lost':
        await handlePaymentDisputeLost(supabaseClient, payload)
        break
      
      case 'payment.dispute.closed':
        await handlePaymentDisputeClosed(supabaseClient, payload)
        break
      
      case 'payment.dispute.under_review':
        await handlePaymentDisputeUnderReview(supabaseClient, payload)
        break
      
      case 'payment.dispute.action_required':
        await handlePaymentDisputeActionRequired(supabaseClient, payload)
        break

      // Payment Downtime Events
      case 'payment.downtime.started':
        await handlePaymentDowntimeStarted(supabaseClient, payload)
        break
      
      case 'payment.downtime.updated':
        await handlePaymentDowntimeUpdated(supabaseClient, payload)
        break
      
      case 'payment.downtime.resolved':
        await handlePaymentDowntimeResolved(supabaseClient, payload)
        break
      
      // Legacy events
      case 'order.paid':
        await handleOrderPaid(supabaseClient, payload)
        break
      
      default:
        console.log(`Unhandled webhook event: ${payload.event}`)
        await sendEmailNotification('unhandled_event', payload)
        break
    }

    // Send email notification for processed event
    await sendEmailNotification(payload.event, payload)

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

// Email notification function
async function sendEmailNotification(event: string, payload: RazorpayWebhookPayload) {
  try {
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    
    const emailContent = generateEmailContent(event, payload)
    
    await resend.emails.send({
      from: 'iFind Life <noreply@ifindlife.com>',
      to: ['dk@ifindlife.com'],
      subject: `Razorpay Webhook: ${event}`,
      html: emailContent
    })
    
    console.log(`Email notification sent for event: ${event}`)
  } catch (error) {
    console.error('Failed to send email notification:', error)
  }
}

function generateEmailContent(event: string, payload: RazorpayWebhookPayload): string {
  const timestamp = new Date().toISOString()
  
  let content = `
    <h2>Razorpay Webhook Event: ${event}</h2>
    <p><strong>Timestamp:</strong> ${timestamp}</p>
    <p><strong>Account ID:</strong> ${payload.account_id}</p>
  `
  
  if (payload.payload.payment_link) {
    const pl = payload.payload.payment_link.entity
    content += `
      <h3>Payment Link Details:</h3>
      <ul>
        <li><strong>ID:</strong> ${pl.id}</li>
        <li><strong>Status:</strong> ${pl.status}</li>
        <li><strong>Amount:</strong> ${pl.amount / 100} ${pl.currency}</li>
        <li><strong>Amount Paid:</strong> ${pl.amount_paid / 100} ${pl.currency}</li>
        <li><strong>Description:</strong> ${pl.description || 'N/A'}</li>
        <li><strong>Customer Name:</strong> ${pl.customer.name || 'N/A'}</li>
        <li><strong>Customer Email:</strong> ${pl.customer.email || 'N/A'}</li>
        <li><strong>Short URL:</strong> ${pl.short_url}</li>
      </ul>
    `
  }
  
  if (payload.payload.payment) {
    const p = payload.payload.payment.entity
    content += `
      <h3>Payment Details:</h3>
      <ul>
        <li><strong>ID:</strong> ${p.id}</li>
        <li><strong>Status:</strong> ${p.status}</li>
        <li><strong>Amount:</strong> ${p.amount / 100} ${p.currency}</li>
        <li><strong>Method:</strong> ${p.method}</li>
        <li><strong>Email:</strong> ${p.email}</li>
        <li><strong>Contact:</strong> ${p.contact}</li>
        <li><strong>Order ID:</strong> ${p.order_id}</li>
        ${p.error_description ? `<li><strong>Error:</strong> ${p.error_description}</li>` : ''}
      </ul>
    `
  }
  
  if (payload.payload.dispute) {
    const d = payload.payload.dispute.entity
    content += `
      <h3>Dispute Details:</h3>
      <ul>
        <li><strong>ID:</strong> ${d.id}</li>
        <li><strong>Payment ID:</strong> ${d.payment_id}</li>
        <li><strong>Amount:</strong> ${d.amount / 100} ${d.currency}</li>
        <li><strong>Status:</strong> ${d.status}</li>
        <li><strong>Phase:</strong> ${d.phase}</li>
        <li><strong>Reason:</strong> ${d.reason_description}</li>
      </ul>
    `
  }
  
  if (payload.payload.downtime) {
    const dt = payload.payload.downtime.entity
    content += `
      <h3>Downtime Details:</h3>
      <ul>
        <li><strong>ID:</strong> ${dt.id}</li>
        <li><strong>Status:</strong> ${dt.status}</li>
        <li><strong>Source:</strong> ${dt.source}</li>
        <li><strong>Begin:</strong> ${new Date(dt.begin * 1000).toISOString()}</li>
        ${dt.end ? `<li><strong>End:</strong> ${new Date(dt.end * 1000).toISOString()}</li>` : ''}
      </ul>
    `
  }
  
  content += `<p><strong>Raw Payload:</strong></p><pre>${JSON.stringify(payload, null, 2)}</pre>`
  
  return content
}

// Payment Link Event Handlers
async function handlePaymentLinkPaid(supabase: any, payload: RazorpayWebhookPayload) {
  const paymentLink = payload.payload.payment_link?.entity
  if (!paymentLink) return
  
  console.log(`Processing payment_link.paid for: ${paymentLink.id}`)
  
  // Log the event and update any relevant records
  console.log('Payment link fully paid:', paymentLink.id, 'Amount:', paymentLink.amount_paid)
}

async function handlePaymentLinkPartiallyPaid(supabase: any, payload: RazorpayWebhookPayload) {
  const paymentLink = payload.payload.payment_link?.entity
  if (!paymentLink) return
  
  console.log(`Processing payment_link.partially_paid for: ${paymentLink.id}`)
  console.log('Partial payment received:', paymentLink.amount_paid, 'of', paymentLink.amount)
}

async function handlePaymentLinkExpired(supabase: any, payload: RazorpayWebhookPayload) {
  const paymentLink = payload.payload.payment_link?.entity
  if (!paymentLink) return
  
  console.log(`Processing payment_link.expired for: ${paymentLink.id}`)
  console.log('Payment link expired at:', paymentLink.expired_at)
}

async function handlePaymentLinkCancelled(supabase: any, payload: RazorpayWebhookPayload) {
  const paymentLink = payload.payload.payment_link?.entity
  if (!paymentLink) return
  
  console.log(`Processing payment_link.cancelled for: ${paymentLink.id}`)
  console.log('Payment link cancelled at:', paymentLink.cancelled_at)
}

// Payment Dispute Event Handlers
async function handlePaymentDisputeCreated(supabase: any, payload: RazorpayWebhookPayload) {
  const dispute = payload.payload.dispute?.entity
  if (!dispute) return
  
  console.log(`Processing payment.dispute.created for payment: ${dispute.payment_id}`)
  console.log('Dispute amount:', dispute.amount, 'Reason:', dispute.reason_description)
}

async function handlePaymentDisputeWon(supabase: any, payload: RazorpayWebhookPayload) {
  const dispute = payload.payload.dispute?.entity
  if (!dispute) return
  
  console.log(`Processing payment.dispute.won for payment: ${dispute.payment_id}`)
  console.log('Dispute won for amount:', dispute.amount)
}

async function handlePaymentDisputeLost(supabase: any, payload: RazorpayWebhookPayload) {
  const dispute = payload.payload.dispute?.entity
  if (!dispute) return
  
  console.log(`Processing payment.dispute.lost for payment: ${dispute.payment_id}`)
  console.log('Dispute lost for amount:', dispute.amount)
}

async function handlePaymentDisputeClosed(supabase: any, payload: RazorpayWebhookPayload) {
  const dispute = payload.payload.dispute?.entity
  if (!dispute) return
  
  console.log(`Processing payment.dispute.closed for payment: ${dispute.payment_id}`)
  console.log('Dispute closed with status:', dispute.status)
}

async function handlePaymentDisputeUnderReview(supabase: any, payload: RazorpayWebhookPayload) {
  const dispute = payload.payload.dispute?.entity
  if (!dispute) return
  
  console.log(`Processing payment.dispute.under_review for payment: ${dispute.payment_id}`)
  console.log('Dispute under review, respond by:', new Date(dispute.respond_by * 1000).toISOString())
}

async function handlePaymentDisputeActionRequired(supabase: any, payload: RazorpayWebhookPayload) {
  const dispute = payload.payload.dispute?.entity
  if (!dispute) return
  
  console.log(`Processing payment.dispute.action_required for payment: ${dispute.payment_id}`)
  console.log('Action required for dispute, respond by:', new Date(dispute.respond_by * 1000).toISOString())
}

// Payment Downtime Event Handlers
async function handlePaymentDowntimeStarted(supabase: any, payload: RazorpayWebhookPayload) {
  const downtime = payload.payload.downtime?.entity
  if (!downtime) return
  
  console.log(`Processing payment.downtime.started for: ${downtime.id}`)
  console.log('Downtime started for source:', downtime.source, 'at:', new Date(downtime.begin * 1000).toISOString())
}

async function handlePaymentDowntimeUpdated(supabase: any, payload: RazorpayWebhookPayload) {
  const downtime = payload.payload.downtime?.entity
  if (!downtime) return
  
  console.log(`Processing payment.downtime.updated for: ${downtime.id}`)
  console.log('Downtime updated for source:', downtime.source, 'status:', downtime.status)
}

async function handlePaymentDowntimeResolved(supabase: any, payload: RazorpayWebhookPayload) {
  const downtime = payload.payload.downtime?.entity
  if (!downtime) return
  
  console.log(`Processing payment.downtime.resolved for: ${downtime.id}`)
  console.log('Downtime resolved for source:', downtime.source, 'ended at:', downtime.end ? new Date(downtime.end * 1000).toISOString() : 'N/A')
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