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
    
    const { amount, currency, original_amount, original_currency, description, itemId, itemType } = await req.json();
    
    // Store original amount and currency for wallet credits
    // Use provided original_amount/currency if available, otherwise use amount/currency
    const originalAmount = original_amount || amount; // User's original amount (e.g., 25 EUR)
    const originalCurrency = original_currency || currency || 'INR'; // User's original currency (e.g., 'EUR')
    
    // Use the currency from request - Razorpay supports multiple currencies (EUR, USD, INR, etc.)
    // This will make Razorpay show the currency in the modal
    // Supported currencies: INR, EUR, USD, GBP, AED, SGD, AUD, CAD, JPY, and many more
    // Check Razorpay dashboard for full list
    const razorpayCurrency = currency || 'INR';
    
    console.log('Request data:', { 
      amount, 
      currency: currency || 'INR', 
      razorpayCurrency, 
      originalAmount,
      originalCurrency,
      description, 
      itemId, 
      itemType, 
      userId: user.id 
    });

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
    // Amount is always in INR (converted from EUR if needed)
    // Convert rupees to paise (e.g., 4500 INR = 450000 paise)
    // If amount > 10000, assume it's already in paise
    const amountInSmallestUnit = amount > 10000 ? Math.round(amount) : Math.round(amount * 100);

    // Create Razorpay order
    // Use the currency from request - Razorpay supports multiple currencies
    // This will make Razorpay show EUR/USD/etc. in the modal
    const receiptPrefix = itemType === 'wallet' ? 'wallet' : 'booking';
    
    // Customize description
    let orderDescription = description || (itemType === 'wallet' ? 'Wallet top-up' : 'Expert consultation booking');
    if (originalCurrency === 'EUR' && itemType === 'wallet') {
      // If using EUR, show EUR amount clearly
      orderDescription = `Add €${originalAmount} EUR Credits to Wallet`;
    }
    
    const orderData = {
      amount: amountInSmallestUnit, // Amount in smallest unit (cents for EUR/USD, paise for INR, yen for JPY)
      currency: razorpayCurrency, // Currency for Razorpay (EUR, USD, INR, etc.) - Razorpay will show this currency
      receipt: `${receiptPrefix}_${Date.now()}`,
      notes: {
        description: orderDescription, // Show EUR amount in description
        itemId: itemId || '',
        itemType: itemType || 'consultation',
        user_id: user.id, // Include user_id for wallet top-ups
        purpose: itemType === 'wallet' ? 'wallet_topup' : undefined,
        original_amount: originalAmount?.toString() || amount.toString(), // Store original amount
        original_currency: originalCurrency, // Store original currency (e.g., 'EUR')
        display_message: originalCurrency === 'EUR' ? `Adding €${originalAmount} EUR to wallet` : undefined
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

      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          razorpay_order_id: responseData.id,
          user_id: user.id,
          amount: razorpayCurrency === 'JPY' ? amountInSmallestUnit : amountInSmallestUnit / 100, // Amount in currency units
          currency: razorpayCurrency, // Currency used for Razorpay (EUR, USD, INR, etc.)
          original_amount: originalAmount, // Original amount in user's currency (e.g., 50 EUR)
          original_currency: originalCurrency, // Original currency (e.g., 'EUR')
          status: 'pending',
          item_type: 'wallet',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (orderError) {
        console.error('❌ Failed to insert order into database:', orderError);
        // Don't fail the entire request, but log the error
        // The order was created in Razorpay, so we can still return success
      } else {
        console.log('✅ Order inserted into database:', orderData.id);
      }
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