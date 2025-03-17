
// Follow Deno deploy guidelines for Edge Functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID") || "";
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("RazorPay credentials are not configured");
    }

    const { amount } = await req.json();

    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error("Invalid amount");
    }

    // Create a RazorPay order
    const razorpayOrderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
      },
      body: JSON.stringify({
        amount: amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      }),
    });

    const data = await razorpayOrderResponse.json();

    if (!razorpayOrderResponse.ok) {
      throw new Error(data.error?.description || "Failed to create RazorPay order");
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating RazorPay order:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
