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
    // Parse request body with error handling
    let requestBody
    try {
      requestBody = await req.json()
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body', details: String(parseError) }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, callSessionId } = requestBody

    // Validate required fields
    if (!razorpay_order_id) {
      console.error('❌ Missing razorpay_order_id')
      return new Response(
        JSON.stringify({ error: 'Missing required field: razorpay_order_id' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    if (!razorpay_payment_id) {
      console.error('❌ Missing razorpay_payment_id')
      return new Response(
        JSON.stringify({ error: 'Missing required field: razorpay_payment_id' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    if (!razorpay_signature) {
      console.error('❌ Missing razorpay_signature')
      return new Response(
        JSON.stringify({ error: 'Missing required field: razorpay_signature' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    console.log('✅ Received payment verification request:', {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      has_signature: !!razorpay_signature,
      has_callSessionId: !!callSessionId
    })

    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!razorpayKeySecret) {
      console.error('❌ RAZORPAY_KEY_SECRET not configured')
      return new Response(
        JSON.stringify({ 
          error: 'Razorpay secret not configured',
          details: 'RAZORPAY_KEY_SECRET environment variable is missing. Please set it in Supabase Dashboard → Edge Functions → Secrets'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    console.log('✅ RAZORPAY_KEY_SECRET found (length:', razorpayKeySecret.length, ')')

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = createHmac('sha256', razorpayKeySecret)
      .update(body)
      .digest('hex')

    console.log('🔍 Signature verification:', {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      received_sig: razorpay_signature.substring(0, 20) + '...',
      expected_sig: expectedSignature.substring(0, 20) + '...',
      match: expectedSignature === razorpay_signature
    })

    if (expectedSignature !== razorpay_signature) {
      console.error('❌ Invalid payment signature', {
        received: razorpay_signature,
        expected: expectedSignature,
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        body: body
      })
      return new Response(
        JSON.stringify({ 
          error: 'Invalid payment signature',
          details: 'The payment signature does not match. Please verify that RAZORPAY_KEY_SECRET is correct and matches your Razorpay account.',
          received_sig_preview: razorpay_signature.substring(0, 20) + '...',
          expected_sig_preview: expectedSignature.substring(0, 20) + '...'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    console.log('✅ Payment signature verified successfully')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('❌ Missing Authorization header')
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)

    if (userError || !user) {
      console.error('❌ User authentication failed:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: userError?.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    console.log('✅ User authenticated:', user.id)

    // Check if this is a wallet top-up by looking up the order
    console.log('🔍 Looking up order:', razorpay_order_id)
    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .select('user_id, amount, currency, item_type, status')
      .eq('razorpay_order_id', razorpay_order_id)
      .single()

    if (orderError) {
      console.error('❌ Order lookup error:', orderError)
      console.log('Order ID searched:', razorpay_order_id)
    } else {
      console.log('✅ Order found:', {
        id: orderData.id,
        user_id: orderData.user_id,
        item_type: orderData.item_type,
        status: orderData.status,
        amount: orderData.amount
      })
    }

    const isWalletTopUp = orderData?.item_type === 'wallet'

    // If order not found but this might be a wallet top-up, try to process it anyway
    // (This can happen if webhook processed it first or order creation had issues)
    if (orderError && !orderData) {
      console.warn('⚠️ Order not found in database, but continuing with payment verification')
      // Continue to other payment handlers (call sessions, appointments)
    }

    // Handle wallet top-ups
    if (isWalletTopUp && orderData) {
      console.log('💰 Processing wallet top-up for order:', razorpay_order_id)
      
      // Check if already processed (avoid duplicate transactions)
      if (orderData.status === 'completed') {
        console.log('⚠️ Order already completed, skipping wallet transaction')
        return new Response(
          JSON.stringify({ 
            success: true,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            message: 'Order already processed'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )
      }

      const userId = orderData.user_id || user.id
      const amount = orderData.amount // Already in currency units (not paise)

      // Add credits to wallet
      try {
        // Calculate expiry (12 months from now)
        const expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 12)

        // Create credit transaction
        // Note: reference_id is UUID type, but Razorpay payment IDs are strings
        // Store payment ID in metadata instead
        const { data: transactionData, error: transactionError } = await supabaseClient
          .from('wallet_transactions')
          .insert({
            user_id: userId,
            type: 'credit',
            amount: amount,
            reason: 'purchase',
            reference_id: null, // UUID type - Razorpay payment IDs are strings, so store in metadata
            reference_type: 'razorpay_payment',
            description: `Wallet top-up via ${orderData.currency || 'INR'} payment`,
            expires_at: expiresAt.toISOString(),
            metadata: {
              razorpay_payment_id: razorpay_payment_id,
              razorpay_order_id: razorpay_order_id
            }
          })
          .select()
          .single()

        if (transactionError) {
          console.error('❌ Failed to create wallet transaction:', transactionError)
          throw transactionError
        }

        console.log('✅ Wallet transaction created:', transactionData.id)

        // Calculate new balance
        const { data: creditData, error: creditError } = await supabaseClient
          .from('wallet_transactions')
          .select('amount')
          .eq('user_id', userId)
          .eq('type', 'credit')
          .gte('expires_at', new Date().toISOString())

        const { data: debitData, error: debitError } = await supabaseClient
          .from('wallet_transactions')
          .select('amount')
          .eq('user_id', userId)
          .eq('type', 'debit')

        let newBalance = 0
        if (!creditError && !debitError) {
          const credits = creditData?.reduce((sum: number, t: { amount: number }) => sum + Number(t.amount), 0) || 0
          const debits = debitData?.reduce((sum: number, t: { amount: number }) => sum + Number(t.amount), 0) || 0
          newBalance = credits - debits
          
          // Update user's wallet_balance
          await supabaseClient
            .from('users')
            .update({ wallet_balance: newBalance })
            .eq('id', userId)

          console.log('✅ Wallet balance updated:', newBalance)
        }

        // Update order status
        const { error: orderUpdateError, data: updatedOrder } = await supabaseClient
          .from('orders')
          .update({
            status: 'completed',
            razorpay_payment_id: razorpay_payment_id,
            updated_at: new Date().toISOString()
          })
          .eq('razorpay_order_id', razorpay_order_id)
          .select()
          .single()

        if (orderUpdateError) {
          console.error('❌ Failed to update order status:', orderUpdateError)
          // Don't fail the entire request if order update fails - transaction was created
          console.warn('⚠️ Wallet transaction created but order status update failed')
        } else {
          console.log('✅ Order status updated to completed:', updatedOrder?.id)
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            transactionId: transactionData.id,
            newBalance: newBalance,
            orderUpdated: !orderUpdateError
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )
      } catch (walletError) {
        console.error('❌ Error processing wallet top-up:', walletError)
        throw walletError
      }
    }

    // Handle different payment types - call sessions vs appointments
    if (callSessionId) {
      console.log('Looking for call session with ID:', razorpay_order_id, 'for user:', user.id)
      
      // Update call session status to completed
      const { data: session, error: updateError } = await supabaseClient
        .from('call_sessions')
        .update({
          status: 'completed',
          payment_method: 'gateway',
          updated_at: new Date().toISOString()
        })
        .eq('id', razorpay_order_id)
        .eq('user_id', user.id)
        .select()
        .single()

      console.log('Update result:', { session, updateError })

      if (updateError || !session) {
        console.error('Failed to update session. Error:', updateError)
        throw new Error(`Failed to update session status: ${updateError?.message || 'Session not found'}`)
      }

      // Generate Agora token and channel for the call
      const channelName = `session_${Date.now()}_${user.id}`
      const uid = Math.floor(Math.random() * 1000000)

      // Generate Agora token using our token service
      const tokenResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/smooth-action`, {
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
          appId: (() => {
            const appId = Deno.env.get('AGORA_APP_ID');
            if (!appId) {
              console.error('❌ AGORA_APP_ID is not set in Supabase Edge Function secrets');
              throw new Error('AGORA_APP_ID is required - set it in Supabase Dashboard > Edge Functions > Secrets');
            }
            return appId;
          })()
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
  } catch (error: any) {
    console.error('❌ Error verifying payment:', error)
    console.error('Error stack:', error.stack)
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      cause: error.cause
    })
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Payment verification failed',
        details: error.stack ? error.stack.substring(0, 200) : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})