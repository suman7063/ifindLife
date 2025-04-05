
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  status: string;
  message: string;
}

// Handle email sending logic
const sendEmail = async (email: string, subject: string, content: string): Promise<Response> => {
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const { error } = await supabaseAdmin.auth.admin.sendAdminEmail(
      email,
      subject,
      content
    );

    if (error) {
      console.error("Email sending error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { email, status, message }: EmailRequest = await req.json();
    
    if (!email || !status) {
      return new Response(
        JSON.stringify({ error: "Email and status are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subject = status === "approved" 
      ? "Your Expert Account has been Approved!"
      : "Update on Your Expert Account Application";
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${status === "approved" ? "#10b981" : "#ef4444"}">
          ${status === "approved" ? "Congratulations!" : "Application Update"}
        </h2>
        <p>${message}</p>
        ${status === "approved" 
          ? `<p>You can now <a href="${Deno.env.get("APP_URL")}/expert-login" style="color: #3b82f6;">log in to your expert dashboard</a>.</p>` 
          : ""
        }
        <p>If you have any questions, please contact our support team.</p>
        <p style="margin-top: 20px;">Best regards,<br>The iFindLife Team</p>
      </div>
    `;

    return await sendEmail(email, subject, htmlContent);
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
