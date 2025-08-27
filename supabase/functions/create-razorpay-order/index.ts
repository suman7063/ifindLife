import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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
    
    const { amount, currency, description, itemId, itemType } = await req.json();
    
    console.log('Request data:', { amount, currency, description, itemId, itemType });

    // Validate required fields
    if (!amount || !currency) {
      console.error('Missing required fields:', { amount, currency });
      return new Response(
        JSON.stringify({ error: 'Amount and currency are required' }),
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

    // Convert amount to smallest currency unit (paise for INR, cents for USD/EUR)
    const amountInSmallestUnit = Math.round(amount * 100);

    // Create Razorpay order
    const orderData = {
      amount: amountInSmallestUnit,
      currency: currency,
      receipt: `booking_${Date.now()}`,
      notes: {
        description: description || 'Expert consultation booking',
        itemId: itemId || '',
        itemType: itemType || 'consultation'
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

    // Return order details with key ID for frontend
    const result = {
      id: responseData.id,
      amount: responseData.amount,
      currency: responseData.currency,
      razorpayKeyId: razorpayKeyId // Frontend needs this
    };

    console.log('Order created successfully:', result);

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