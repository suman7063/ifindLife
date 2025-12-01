
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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

// Handle email sending logic using Resend API
const sendEmail = async (email: string, subject: string, htmlContent: string): Promise<Response> => {
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: "iFindLife Admin <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend email sending error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: error }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Email sent successfully via Resend:", data);
    return new Response(
      JSON.stringify({ message: "Email sent successfully", emailId: data?.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error sending email:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err instanceof Error ? err.message : String(err) }),
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
      : status === "rejected"
      ? "Update on Your Expert Account Application"
      : "Update on Your Expert Account Application";
    
    // Format the message - if it contains HTML, use it; otherwise wrap in paragraph tags
    const formattedMessage = message.includes('<') ? message : `<p>${message.replace(/\n/g, '<br>')}</p>`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: ${status === "approved" ? "#10b981" : "#ef4444"}; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="color: white; margin: 0;">
            ${status === "approved" ? "Congratulations!" : "Application Update"}
          </h2>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          ${formattedMessage}
          ${status === "approved" 
            ? `<p style="margin-top: 20px;">You can now <a href="${Deno.env.get("APP_URL") || "https://ifindlife.com"}/expert-login" style="color: #3b82f6; text-decoration: none; font-weight: bold;">log in to your expert dashboard</a>.</p>` 
            : ""
          }
          <p style="margin-top: 20px; color: #666;">If you have any questions, please contact our support team.</p>
          <p style="margin-top: 20px; color: #666;">Best regards,<br>The iFindLife Team</p>
        </div>
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
