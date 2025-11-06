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
    console.log('Create Razorpay Order - Starting request processing');
    
    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const { amount, currency, description, itemId, itemType } = await req.json();
    
    // Razorpay only supports INR for Indian merchants
    // Force currency to INR regardless of what was passed
    const razorpayCurrency = 'INR';
    
    console.log('Request data:', { amount, currency: currency || 'INR', razorpayCurrency, description, itemId, itemType, userId: user.id });

    // Validate required fields
    if (!amount || amount <= 0) {
      console.error('Missing or invalid amount:', { amount });
      return new Response(
        JSON.stringify({ error: 'Valid amount is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get Razorpay credentials from environment
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Detect test mode (test keys start with 'rzp_test_')
    const isTestMode = razorpayKeyId.startsWith('rzp_test_');
    if (isTestMode) {
      console.log('🧪 TEST MODE: Using Razorpay test keys');
    }

    // Convert amount to smallest currency unit (paise for INR)
    // Amount should be passed in INR (e.g., 500 for ₹500), convert to paise (500 * 100 = 50000)
    // If amount > 10000, assume it's already in paise
    // Note: If original currency was USD, frontend should have converted it to INR already
    let amountInSmallestUnit: number;
    // Always treat as INR - convert rupees to paise
    // If amount > 10000, likely already in paise, otherwise convert rupees to paise
    amountInSmallestUnit = amount > 10000 ? Math.round(amount) : Math.round(amount * 100);

    // Create Razorpay order
    // IMPORTANT: Always use INR currency for Razorpay (Indian payment gateway)
    const receiptPrefix = itemType === 'wallet' ? 'wallet' : 'booking';
    const orderData = {
      amount: amountInSmallestUnit, // Amount in paise
      currency: razorpayCurrency, // Always 'INR' for Razorpay
      receipt: `${receiptPrefix}_${Date.now()}`,
      notes: {
        description: description || (itemType === 'wallet' ? 'Wallet top-up' : 'Expert consultation booking'),
        itemId: itemId || '',
        itemType: itemType || 'consultation',
        user_id: user.id, // Include user_id for wallet top-ups
        purpose: itemType === 'wallet' ? 'wallet_topup' : undefined,
        original_currency: currency || 'INR' // Store original currency for reference
      }
    };

    console.log('Creating Razorpay order with data:', orderData);

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const responseData = await response.json();
    console.log('Razorpay API response:', responseData);

    if (!response.ok) {
      console.error('Razorpay API error:', responseData);
      return new Response(
        JSON.stringify({ error: 'Failed to create payment order', details: responseData }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Store order in database for wallet top-ups
    if (itemType === 'wallet') {
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      await supabaseAdmin
        .from('orders')
        .insert({
          razorpay_order_id: responseData.id,
          user_id: user.id,
          amount: amountInSmallestUnit / 100, // Convert back to currency units
          currency: currency,
          status: 'pending',
          item_type: 'wallet',
          created_at: new Date().toISOString()
        });
    }

    // Return order details with key ID for frontend
    // Note: responseData.amount is in paise, responseData.currency is 'INR'
    const result = {
      id: responseData.id,
      amount: responseData.amount, // Amount in paise
      currency: 'INR', // Always INR for Razorpay
      razorpayKeyId: razorpayKeyId, // Frontend needs this
      isTestMode: isTestMode // Indicate if in test mode
    };

    console.log('✅ Order created successfully:', {
      orderId: responseData.id,
      amount: responseData.amount,
      amountInRupees: responseData.amount / 100,
      currency: responseData.currency,
      status: responseData.status,
      createdAt: responseData.created_at,
      isTestMode: isTestMode,
      keyId: razorpayKeyId,
    });

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in create-razorpay-order:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});