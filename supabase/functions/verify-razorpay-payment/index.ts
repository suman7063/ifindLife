
// Follow Deno deploy guidelines for Edge Functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID") || "";
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

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

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials are not configured");
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
      amount,
    } = await req.json();

    // Create Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get user details
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("wallet_balance, currency")
      .eq("id", user_id)
      .single();

    if (userError) {
      throw new Error("User not found");
    }

    // Amount is in paise, convert to rupees (or the appropriate currency unit)
    const amountToAdd = amount;
    const newBalance = (userData.wallet_balance || 0) + amountToAdd;

    // Update user's wallet balance
    const { error: updateError } = await supabase
      .from("users")
      .update({ wallet_balance: newBalance })
      .eq("id", user_id);

    if (updateError) {
      throw new Error("Failed to update wallet balance");
    }

    // Record the transaction
    const { error: transactionError } = await supabase
      .from("user_transactions")
      .insert({
        user_id: user_id,
        date: new Date().toISOString(),
        type: "recharge",
        amount: amountToAdd,
        currency: userData.currency || "INR",
        description: `Wallet recharge via RazorPay (Payment ID: ${razorpay_payment_id})`,
      });

    if (transactionError) {
      throw new Error("Failed to record transaction");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Payment verified and wallet updated" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
