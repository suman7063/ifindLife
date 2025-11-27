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
   

    // Verify webhook signature for security
    const signature = req.headers.get('x-razorpay-signature')
    const body = await req.text()
    
    // Log webhook attempt even if signature fails (for debugging)
    let webhookLogId: string | null = null
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    if (!signature) {
      console.error('Missing Razorpay signature header')
      // Log failed attempt
      try {
        const { data } = await supabaseClient
          .from('webhook_logs')
          .insert({
            provider: 'razorpay',
            event_type: 'unknown',
            payload: { error: 'Missing signature header', body: body.substring(0, 500) },
            processed_at: new Date().toISOString(),
            status: 'failed'
          })
          .select()
          .single()
        webhookLogId = data?.id || null
      } catch (e) {
        console.error('Failed to log webhook error:', e)
      }
      
      return new Response(
        JSON.stringify({ error: 'Missing signature' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
    
    if (!webhookSecret) {
      console.error('Razorpay webhook secret not configured')
      // Log failed attempt
      try {
        await supabaseClient
          .from('webhook_logs')
          .insert({
            provider: 'razorpay',
            event_type: 'unknown',
            payload: { error: 'Webhook secret not configured' },
            processed_at: new Date().toISOString(),
            status: 'failed'
          })
      } catch (e) {
        console.error('Failed to log webhook error:', e)
      }
      
      return new Response(
        JSON.stringify({ error: 'Webhook secret not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // Razorpay sends signatures in format: "signature1,signature2" (comma-separated)
    // We need to check if any of the signatures match
    const signatures = signature.split(',').map(s => s.trim())
    
    // Verify signature using HMAC SHA256
    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    // Check if any signature matches
    const isValidSignature = signatures.some(sig => {
      // Razorpay uses format: "signature1|key_id1,signature2|key_id2"
      // We need to extract just the signature part (before |)
      const sigPart = sig.split('|')[0].trim()
      return sigPart === expectedSignature || sig === expectedSignature
    })

    if (!isValidSignature) {
      console.error('Invalid webhook signature', {
        received: signature,
        expected: expectedSignature,
        signatures: signatures,
        bodyLength: body.length
      })
      
      // Log failed attempt with details (but not full body for security)
      try {
        await supabaseClient
          .from('webhook_logs')
          .insert({
            provider: 'razorpay',
            event_type: 'unknown',
            payload: { 
              error: 'Invalid signature',
              receivedSignature: signature.substring(0, 50) + '...',
              expectedSignature: expectedSignature.substring(0, 50) + '...',
              bodyPreview: body.substring(0, 200)
            },
            processed_at: new Date().toISOString(),
            status: 'failed'
          })
      } catch (e) {
        console.error('Failed to log webhook error:', e)
      }
      
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
    
    console.log('✅ Webhook signature verified successfully', {
      event: payload.event,
      orderId: payload.payload?.payment?.entity?.order_id || payload.payload?.order?.entity?.id,
      paymentId: payload.payload?.payment?.entity?.id
    })

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
          payload: { error: String(error), stack: error instanceof Error ? error.stack : undefined },
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
  const payment = payload.payload.payment?.entity
  if (!payment) {
    console.error('❌ Payment entity not found in payload');
    return;
  }
  const orderId = payment.order_id
  

  
  try {
    console.log(`🔍 Processing payment.captured for order: ${orderId}`);
    console.log(`📋 Payment details:`, {
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      orderId: payment.order_id,
      notes: payment.notes,
    });

    // Get order details to find user_id and original currency
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('user_id, amount, currency, original_amount, original_currency, item_type')
      .eq('razorpay_order_id', orderId)
      .single()

    if (orderError) {
      console.error('❌ Order not found in database:', orderError);
      console.log('📋 Attempting to find order by payment notes...');
    } else {
      console.log('✅ Order found:', {
        user_id: orderData.user_id,
        amount: orderData.amount,
        currency: orderData.currency,
        item_type: orderData.item_type,
      });
    }

    // If this is a wallet top-up (purchase), add credits to wallet
    // Check if payment notes indicate wallet top-up
    const isWalletTopUp = payment.notes?.purpose === 'wallet_topup' || 
                          payment.notes?.itemType === 'wallet' ||
                          orderData?.item_type === 'wallet' ||
                          (!payment.notes?.appointment_id && !payment.notes?.callSessionId) // If no appointment_id or callSessionId, likely wallet top-up

    console.log('🔍 Wallet top-up detection:', {
      isWalletTopUp,
      purpose: payment.notes?.purpose,
      itemType: payment.notes?.itemType,
      orderItemType: orderData?.item_type,
      hasAppointmentId: !!payment.notes?.appointment_id,
      hasCallSessionId: !!payment.notes?.callSessionId,
    });

    // Get user_id from order notes or order table
    let userId = payment.notes?.user_id;
    
    if (!userId && orderData?.user_id) {
      userId = orderData.user_id;
      console.log('✅ Found user_id from order table:', userId);
    }

    // Process wallet top-up if applicable
    if (isWalletTopUp) {
      if (!userId) {
        console.error('❌ Cannot process wallet top-up: user_id is missing');
        console.error('Payment notes:', payment.notes);
        console.error('Order data:', orderData);
        // Continue processing - might be handled elsewhere or might not be a wallet top-up after all
      } else {
        // Process wallet top-up
        // Use original amount and currency from order (user's currency, e.g., 50 EUR)
        // NOT the Razorpay amount (which is in INR, e.g., 4500 INR)
        const amount = orderData?.original_amount || (payment.amount / 100); // Use original amount if available
        const currency = orderData?.original_currency || payment.currency; // Use original currency if available

        console.log(`💰 Processing wallet top-up: ${amount} ${currency} for user ${userId}`);
        console.log(`📊 Amount details:`, {
          razorpayAmountInPaise: payment.amount,
          razorpayAmountInCurrencyUnits: payment.amount / 100,
          razorpayCurrency: payment.currency,
          originalAmount: orderData?.original_amount,
          originalCurrency: orderData?.original_currency,
          finalAmount: amount,
          finalCurrency: currency,
        });

        // Add credits directly to wallet (webhook has service role access)
        try {
          // Calculate expiry (12 months from now)
          const expiresAt = new Date()
          expiresAt.setMonth(expiresAt.getMonth() + 12)

          // Create credit transaction
          // Note: reference_id is UUID type, but Razorpay payment IDs are strings
          // Store payment ID in metadata instead
          // Validate currency
          const validCurrency = currency === 'EUR' ? 'EUR' : 'INR'
          
          const { data: transactionData, error: transactionError } = await supabase
            .from('wallet_transactions')
            .insert({
              user_id: userId,
              type: 'credit',
              amount: amount,
              currency: validCurrency,
              reason: 'purchase',
              reference_id: null, // UUID type - Razorpay payment IDs are strings, so store in metadata
              reference_type: 'razorpay_payment',
              description: `Wallet top-up via ${currency} payment`,
              expires_at: expiresAt.toISOString(),
              metadata: {
                razorpay_payment_id: payment.id,
                razorpay_order_id: orderId
              }
            })
            .select()
            .single()

          if (transactionError) {
            console.error('❌ Failed to create wallet transaction:', transactionError);
            throw transactionError;
          }

          console.log('✅ Wallet transaction created:', transactionData.id);

          // Calculate new balance (credits - debits, only non-expired credits count)
          const { data: creditData, error: creditError } = await supabase
            .from('wallet_transactions')
            .select('amount')
            .eq('user_id', userId)
            .eq('type', 'credit')
            .gte('expires_at', new Date().toISOString())

          const { data: debitData, error: debitError } = await supabase
            .from('wallet_transactions')
            .select('amount')
            .eq('user_id', userId)
            .eq('type', 'debit')

          if (creditError || debitError) {
            console.warn('⚠️ Failed to calculate balance:', creditError || debitError);
          } else {
            const credits = creditData?.reduce((sum: number, t: { amount: number }) => sum + Number(t.amount), 0) || 0;
            const debits = debitData?.reduce((sum: number, t: { amount: number }) => sum + Number(t.amount), 0) || 0;
            const newBalance = credits - debits;
            
            // Update user's wallet_balance
            const { error: updateError } = await supabase
              .from('users')
              .update({ wallet_balance: newBalance })
              .eq('id', userId)

            if (updateError) {
              console.warn('⚠️ Failed to update wallet_balance:', updateError);
            } else {
              console.log('✅ Wallet balance updated:', newBalance, `(Credits: ${credits}, Debits: ${debits})`);
            }
          }
          
          // Update order status
          const { error: orderUpdateError } = await supabase
            .from('orders')
            .update({
              status: 'completed',
              razorpay_payment_id: payment.id
            })
            .eq('razorpay_order_id', orderId)

          if (orderUpdateError) {
            console.error('❌ Failed to update order status:', orderUpdateError);
          } else {
            console.log('✅ Order status updated to completed');
          }
        } catch (walletError) {
          console.error('❌ Error adding credits to wallet:', walletError)
          throw walletError
        }
      }
    } else {
      console.log('⚠️ Not a wallet top-up, skipping credit addition');
    }

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
      // If payment was via gateway (not wallet), add credits equivalent for future refunds
      // This ensures refunds can be processed even if payment was via gateway
      if (callSession.payment_method === 'gateway' && callSession.user_id) {
        // Note: We don't add credits here for bookings - credits are only added for wallet top-ups
        // Bookings deduct from wallet if using wallet, or process via gateway directly
      }
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
      
      return
    }

    // Log if no matching record found
    
    
  } catch (error) {
    console.error('Error handling payment.captured:', error)
    throw error
  }
}

async function handlePaymentFailed(supabase: any, payload: RazorpayWebhookPayload) {
  const payment = payload.payload.payment?.entity
  if (!payment) {
    console.error('❌ Payment entity not found in payload');
    return;
  }
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

    
  } catch (error) {
    console.error('Error handling payment.failed:', error)
    throw error
  }
}

async function handlePaymentAuthorized(supabase: any, payload: RazorpayWebhookPayload) {
  const payment = payload.payload.payment?.entity
  if (!payment) {
    console.error('❌ Payment entity not found in payload');
    return;
  }
  const orderId = payment.order_id
  
  
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
  
  
  // Log the event and update any relevant records
}

async function handlePaymentLinkPartiallyPaid(supabase: any, payload: RazorpayWebhookPayload) {
  const paymentLink = payload.payload.payment_link?.entity
  if (!paymentLink) return
  
}

async function handlePaymentLinkExpired(supabase: any, payload: RazorpayWebhookPayload) {
  const paymentLink = payload.payload.payment_link?.entity
  if (!paymentLink) return
  

  
}

async function handlePaymentLinkCancelled(supabase: any, payload: RazorpayWebhookPayload) {
  const paymentLink = payload.payload.payment_link?.entity
  if (!paymentLink) return
  

}

// Payment Dispute Event Handlers
async function handlePaymentDisputeCreated(supabase: any, payload: RazorpayWebhookPayload) {
  const dispute = payload.payload.dispute?.entity
  if (!dispute) return
  

}

async function handlePaymentDisputeWon(supabase: any, payload: RazorpayWebhookPayload) {
  const dispute = payload.payload.dispute?.entity
  if (!dispute) return
  

}

async function handlePaymentDisputeLost(supabase: any, payload: RazorpayWebhookPayload) {
  const dispute = payload.payload.dispute?.entity
  if (!dispute) return
  

}

async function handlePaymentDisputeClosed(supabase: any, payload: RazorpayWebhookPayload) {
  const dispute = payload.payload.dispute?.entity
  if (!dispute) return
  

}

async function handlePaymentDisputeUnderReview(supabase: any, payload: RazorpayWebhookPayload) {
  const dispute = payload.payload.dispute?.entity
  if (!dispute) return
  

}

async function handlePaymentDisputeActionRequired(supabase: any, payload: RazorpayWebhookPayload) {
  const dispute = payload.payload.dispute?.entity
  if (!dispute) return
  

}

// Payment Downtime Event Handlers
async function handlePaymentDowntimeStarted(supabase: any, payload: RazorpayWebhookPayload) {
  const downtime = payload.payload.downtime?.entity
  if (!downtime) return
  

}

async function handlePaymentDowntimeUpdated(supabase: any, payload: RazorpayWebhookPayload) {
  const downtime = payload.payload.downtime?.entity
  if (!downtime) return
  

}

async function handlePaymentDowntimeResolved(supabase: any, payload: RazorpayWebhookPayload) {
  const downtime = payload.payload.downtime?.entity
  if (!downtime) return
  

}

async function handleOrderPaid(supabase: any, payload: RazorpayWebhookPayload) {
  const order = payload.payload.order?.entity
  if (!order) return
  

  
  try {
    // This event is triggered when an order is completely paid
    // You can add additional business logic here if needed

    
  } catch (error) {
    console.error('Error handling order.paid:', error)
    throw error
  }
}