import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get authenticated user (can be expert or user)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let requestBody
    try {
      requestBody = await req.json()
    } catch (error) {
      console.error('❌ Failed to parse request body:', error)
      return new Response(
        JSON.stringify({ error: 'Invalid request body', details: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { callSessionId, duration } = requestBody

    console.log('📥 Received refund request:', { callSessionId, duration })

    if (!callSessionId) {
      console.error('❌ Missing callSessionId in request')
      return new Response(
        JSON.stringify({ error: 'callSessionId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (duration === undefined || duration === null) {
      console.error('❌ Missing duration in request')
      return new Response(
        JSON.stringify({ error: 'duration is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use service role for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch call session to get user_id, cost, and selected_duration
    const { data: callSession, error: fetchError } = await supabaseAdmin
      .from('call_sessions')
      .select('user_id, expert_id, cost, selected_duration, currency, status')
      .eq('id', callSessionId)
      .single()

    if (fetchError || !callSession) {
      console.error('❌ Failed to fetch call session:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Call session not found', details: fetchError?.message }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Note: We don't check if status is 'ended' because this function is called
    // from endCall() which processes the refund before updating the status
    // The refund should be processed as part of the call ending process

    // Check if refund already processed
    const { data: existingRefund, error: checkError } = await supabaseAdmin
      .from('wallet_transactions')
      .select('id')
      .eq('user_id', callSession.user_id)
      .eq('reason', 'refund')
      .eq('reference_type', 'call_session')
      .or(`reference_id.eq.${callSessionId},metadata->>reference_id.eq.${callSessionId}`)
      .limit(1)
      .maybeSingle()

    // Ignore errors when checking for existing refund (might be first time)
    if (checkError && checkError.code !== 'PGRST116') {
      console.warn('⚠️ Error checking for existing refund (continuing anyway):', checkError.message)
    }

    if (existingRefund) {
      console.log('ℹ️ Refund already processed for this call session:', existingRefund.id)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Refund already processed',
          refund_id: existingRefund.id
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate refund if we have all required data
    if (!callSession.cost || !callSession.selected_duration) {
      console.log('⚠️ Missing call session data:', {
        hasCost: !!callSession.cost,
        hasSelectedDuration: !!callSession.selected_duration,
        cost: callSession.cost,
        selected_duration: callSession.selected_duration
      })
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Cannot calculate refund - missing required data in call session',
          refund_amount: 0,
          call_session_data: {
            has_cost: !!callSession.cost,
            has_selected_duration: !!callSession.selected_duration
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const actualDurationMinutes = duration / 60 // Convert seconds to minutes
    const remainingMinutes = Math.max(0, callSession.selected_duration - actualDurationMinutes)
    const perMinuteRate = callSession.cost / callSession.selected_duration
    const refundAmount = remainingMinutes * perMinuteRate
    
    // Round to 2 decimal places
    const roundedRefund = Math.round(refundAmount * 100) / 100

    if (roundedRefund <= 0) {
      console.log('ℹ️ No refund needed - call used full duration or exceeded selected duration')
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No refund needed',
          refund_amount: 0,
          remaining_minutes: remainingMinutes
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('💰 Processing refund:', {
      callSessionId,
      userId: callSession.user_id,
      cost: callSession.cost,
      selected_duration: callSession.selected_duration,
      actual_duration_minutes: actualDurationMinutes,
      remaining_minutes: remainingMinutes,
      per_minute_rate: perMinuteRate,
      refund_amount: roundedRefund
    })

    // Process refund by adding credits back to wallet
    // Calculate expiry (12 months from now)
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 12)

    // Check if callSessionId is a valid UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(callSessionId)

    // Validate currency from call session
    const validCurrency = callSession.currency === 'EUR' ? 'EUR' : 'INR'
    
    // Create credit transaction
    const { data: transactionData, error: transactionError } = await supabaseAdmin
      .from('wallet_transactions')
      .insert({
        user_id: callSession.user_id,
        type: 'credit',
        amount: roundedRefund,
        currency: validCurrency,
        reason: 'refund',
        reference_id: isUUID ? callSessionId : null,
        reference_type: 'call_session',
        description: `Refund for call ended by expert. Remaining ${remainingMinutes.toFixed(2)} minutes refunded.`,
        expires_at: expiresAt.toISOString(),
        metadata: isUUID ? {} : { reference_id: callSessionId }
      })
      .select()
      .single()

    if (transactionError) {
      console.error('❌ Failed to create refund transaction:', transactionError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to process refund', 
          details: transactionError.message 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Refund transaction created:', transactionData.id)

    // Calculate new balance
    const { data: creditData, error: creditError } = await supabaseAdmin
      .from('wallet_transactions')
      .select('amount')
      .eq('user_id', callSession.user_id)
      .eq('type', 'credit')
      .gte('expires_at', new Date().toISOString())

    const { data: debitData, error: debitError } = await supabaseAdmin
      .from('wallet_transactions')
      .select('amount')
      .eq('user_id', callSession.user_id)
      .eq('type', 'debit')

    let newBalance = 0
    if (!creditError && !debitError) {
      const credits = creditData?.reduce((sum: number, t: { amount: number }) => sum + Number(t.amount), 0) || 0
      const debits = debitData?.reduce((sum: number, t: { amount: number }) => sum + Number(t.amount), 0) || 0
      newBalance = credits - debits
    }

    // Update user's wallet_balance (for backward compatibility)
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', callSession.user_id)

    if (updateError) {
      console.warn('⚠️ Failed to update wallet_balance field:', updateError)
    }

    // Update call session metadata with refund info
    const { data: existingSession } = await supabaseAdmin
      .from('call_sessions')
      .select('call_metadata')
      .eq('id', callSessionId)
      .single()

    const existingMetadata = (existingSession?.call_metadata as Record<string, any>) || {}
    
    await supabaseAdmin
      .from('call_sessions')
      .update({
        call_metadata: {
          ...existingMetadata,
          refund: {
            amount: roundedRefund,
            status: 'processed',
            processed_at: new Date().toISOString(),
            remaining_minutes: remainingMinutes,
            new_balance: newBalance,
            transaction_id: transactionData.id
          }
        }
      })
      .eq('id', callSessionId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        refund_amount: roundedRefund,
        remaining_minutes: remainingMinutes,
        transaction: transactionData,
        new_balance: newBalance
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('❌ Error processing call refund:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

