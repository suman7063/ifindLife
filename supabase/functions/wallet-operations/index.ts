import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authenticated user
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

    const { action, ...params } = await req.json()

    // Use service role for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (action) {
      case 'get_balance':
        return await getWalletBalance(supabaseAdmin, user.id, corsHeaders)

      case 'get_transactions':
        return await getWalletTransactions(supabaseAdmin, user.id, params, corsHeaders)

      case 'add_credits':
        // This will be called after Razorpay payment success
        // Amount should be in credits (1 credit = 1 currency unit)
        return await addCredits(
          supabaseAdmin,
          user.id,
          params.amount,
          params.reason || 'purchase',
          params.reference_id,
          params.reference_type || 'razorpay_payment',
          params.description,
          corsHeaders,
          params.currency || 'INR'
        )

      case 'deduct_credits':
        // This will be called during booking
        return await deductCredits(
          supabaseAdmin,
          user.id,
          params.amount,
          params.reason || 'booking',
          params.reference_id,
          params.reference_type || 'appointment',
          params.description,
          corsHeaders,
          params.currency || 'INR',
          params.metadata || null // Accept metadata for storing multiple appointment IDs
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Wallet operations error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function getWalletBalance(supabase: any, userId: string, corsHeaders: any) {
  try {
    // Use the database function to calculate balance
    // Force fresh calculation by adding timestamp to prevent caching
    const { data, error } = await supabase.rpc('get_wallet_balance', {
      p_user_id: userId
    })

    if (error) throw error

    // Add cache-control headers to prevent caching
    const cacheHeaders = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }

    return new Response(
      JSON.stringify({ balance: parseFloat(data || 0) }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          ...cacheHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error getting wallet balance:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to get wallet balance', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function getWalletTransactions(supabase: any, userId: string, params: any, corsHeaders: any) {
  try {
    let query = supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(params.limit || 50)

    if (params.reason) {
      query = query.eq('reason', params.reason)
    }

    if (params.type) {
      query = query.eq('type', params.type)
    }

    const { data, error } = await query

    if (error) throw error

    // Add cache-control headers to prevent caching
    const cacheHeaders = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }

    return new Response(
      JSON.stringify({ transactions: data || [] }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          ...cacheHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error getting wallet transactions:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to get transactions', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function addCredits(
  supabase: any,
  userId: string,
  amount: number,
  reason: string,
  referenceId: string | null,
  referenceType: string | null,
  description: string | null,
  corsHeaders: any,
  currency: string = 'INR'
) {
  try {
    // Validate amount
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate currency
    const validCurrency = currency === 'EUR' ? 'EUR' : 'INR'

    // Check for existing refund/credit transaction to prevent duplicates
    // This is especially important for expert_no_show refunds
    if (referenceId && referenceType && (reason === 'expert_no_show' || reason === 'refund')) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(referenceId)
      
      let existingQuery = supabase
        .from('wallet_transactions')
        .select('id, amount, created_at')
        .eq('user_id', userId)
        .eq('type', 'credit')
        .eq('reference_type', referenceType)
        .in('reason', ['expert_no_show', 'refund'])
        .limit(10) // Check multiple to see if duplicates exist

      if (isUUID) {
        existingQuery = existingQuery.eq('reference_id', referenceId)
      } else {
        existingQuery = existingQuery.eq('metadata->>reference_id', referenceId)
      }

      const { data: existingTransactions, error: checkError } = await existingQuery

      if (checkError) {
        console.warn('⚠️ Error checking for existing refunds:', checkError)
      }

      if (existingTransactions && existingTransactions.length > 0) {
        console.log('⚠️ Duplicate refund detected! Existing refunds:', {
          count: existingTransactions.length,
          refunds: existingTransactions.map(t => ({
            id: t.id,
            amount: t.amount,
            created_at: t.created_at
          }))
        })
        
        // Return the most recent refund instead of creating a new one
        const mostRecent = existingTransactions.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0]

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Refund already processed',
            transaction: mostRecent,
            duplicate: true,
            existing_count: existingTransactions.length,
            new_balance: await getWalletBalanceValue(supabase, userId)
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Calculate expiry (12 months from now)
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 12)

    // Create credit transaction
    // Note: reference_id is UUID type - if referenceId is not a valid UUID, store it in metadata
    const isUUID = referenceId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(referenceId)
    
    const { data, error } = await supabase
      .from('wallet_transactions')
      .insert({
        user_id: userId,
        type: 'credit',
        amount: amount,
        currency: validCurrency,
        reason: reason,
        reference_id: isUUID ? referenceId : null, // Only set if it's a valid UUID
        reference_type: referenceType,
        description: description || `Credits added: ${reason}`,
        expires_at: expiresAt.toISOString(),
        metadata: isUUID ? {} : { reference_id: referenceId } // Store non-UUID reference in metadata
      })
      .select()
      .single()

    if (error) {
      // Check if it's a duplicate key error
      if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
        console.warn('⚠️ Duplicate transaction prevented by database constraint')
        // Try to find the existing transaction
        const { data: existing } = await supabase
          .from('wallet_transactions')
          .select('*')
          .eq('user_id', userId)
          .eq('type', 'credit')
          .eq('reference_type', referenceType)
          .in('reason', ['expert_no_show', 'refund'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        
        if (existing) {
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'Refund already processed (duplicate prevented)',
              transaction: existing,
              duplicate: true,
              new_balance: await getWalletBalanceValue(supabase, userId)
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
      throw error
    }

    // Update user's wallet_balance (for backward compatibility)
    const { error: updateError } = await supabase
      .from('users')
      .update({ wallet_balance: await getWalletBalanceValue(supabase, userId) })
      .eq('id', userId)

    if (updateError) {
      console.warn('Failed to update wallet_balance field:', updateError)
      // Don't fail the transaction if this update fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        transaction: data,
        new_balance: await getWalletBalanceValue(supabase, userId)
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error adding credits:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to add credits', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function deductCredits(
  supabase: any,
  userId: string,
  amount: number,
  reason: string,
  referenceId: string | null,
  referenceType: string | null,
  description: string | null,
  corsHeaders: any,
  currency: string = 'INR',
  metadata: Record<string, any> | null = null
) {
  try {
    // Validate amount
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate currency
    const validCurrency = currency === 'EUR' ? 'EUR' : 'INR'

    // Check balance first
    const currentBalance = await getWalletBalanceValue(supabase, userId)
    if (currentBalance < amount) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient balance',
          current_balance: currentBalance,
          required: amount
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create debit transaction
    // Note: reference_id is UUID type - if referenceId is not a valid UUID, store it in metadata
    const isUUID = referenceId && typeof referenceId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(referenceId)
    
    console.log('💰 Creating debit transaction:', {
      userId,
      amount,
      currency: validCurrency,
      reason,
      referenceId,
      referenceIdType: typeof referenceId,
      referenceType,
      isUUID,
      willStoreInMetadata: !isUUID && referenceId
    })
    
    // Prepare metadata - store referenceId in metadata if it's not a UUID
    // Also merge any provided metadata (e.g., appointment_ids array for multiple slots)
    const transactionMetadata: Record<string, any> = metadata ? { ...metadata } : {};
    if (referenceId && !isUUID) {
      transactionMetadata.reference_id = referenceId;
    }
    
    const { data, error } = await supabase
      .from('wallet_transactions')
      .insert({
        user_id: userId,
        type: 'debit',
        amount: amount,
        currency: validCurrency,
        reason: reason,
        reference_id: isUUID ? referenceId : null, // Only set if it's a valid UUID
        reference_type: referenceType,
        description: description || `Credits deducted: ${reason}`,
        metadata: transactionMetadata // Store non-UUID reference in metadata, or empty object if UUID
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Error inserting wallet transaction:', error)
      throw error
    }
    
    console.log('✅ Wallet transaction created successfully:', {
      transactionId: data?.id,
      amount: data?.amount,
      referenceId: data?.reference_id,
      metadata: data?.metadata
    })

    // Update user's wallet_balance (for backward compatibility)
    const { error: updateError } = await supabase
      .from('users')
      .update({ wallet_balance: await getWalletBalanceValue(supabase, userId) })
      .eq('id', userId)

    if (updateError) {
      console.warn('Failed to update wallet_balance field:', updateError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        transaction: data,
        new_balance: await getWalletBalanceValue(supabase, userId)
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error deducting credits:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to deduct credits', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function getWalletBalanceValue(supabase: any, userId: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_wallet_balance', {
    p_user_id: userId
  })
  if (error) {
    console.error('Error calculating balance:', error)
    return 0
  }
  return parseFloat(data || 0)
}



