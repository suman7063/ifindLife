import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  expertName: string;
  expertEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { expertName, expertEmail }: WelcomeEmailRequest = await req.json();
    
    if (!expertName || !expertEmail) {
      return new Response(
        JSON.stringify({ error: "Expert name and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending welcome email to expert ${expertName} (${expertEmail})`);

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);

    const appUrl = Deno.env.get("APP_URL") || "https://ifindlife.com";
    const emailSubject = "🎉 Welcome to iFindLife! Your Profile is Now Active!";
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome ${expertName}! 🎉</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
            Congratulations! You've successfully completed your onboarding and your expert profile is now <strong>active</strong>!
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #333; margin-top: 0;">🎊 You're All Set!</h3>
            <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
              Your expert profile is now live and ready to receive bookings from users. You can start helping people right away!
            </p>
            <ul style="color: #666; line-height: 1.6; margin-top: 10px;">
              <li>✅ Your profile is complete and active</li>
              <li>✅ Your services are configured</li>
              <li>✅ Your pricing is set up</li>
              <li>✅ Your availability is configured</li>
            </ul>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #333; margin-top: 0;">What You Can Do Now</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li><strong>Accept Bookings:</strong> Users can now book consultations with you</li>
              <li><strong>Manage Your Schedule:</strong> Update your availability anytime from your dashboard</li>
              <li><strong>View Your Profile:</strong> See how your profile appears to users</li>
              <li><strong>Track Earnings:</strong> Monitor your consultations and earnings</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${appUrl}/expert-dashboard" 
               style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Go to Your Dashboard
            </a>
          </div>
          
          <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <p style="color: #0369a1; margin: 0; font-size: 14px;">
              <strong>💡 Tip:</strong> Keep your availability updated to maximize your bookings. The more available you are, the more clients you can help!
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Best regards,<br>
            <strong>The iFindLife Team</strong>
          </p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "iFindLife Expert Team <onboarding@resend.dev>",
      to: [expertEmail],
      subject: emailSubject,
      html: emailHtml,
    });

    if (emailResponse.error) {
      console.error("Resend email sending error:", emailResponse.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to send email", 
          details: emailResponse.error 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Welcome email sent successfully:", emailResponse.data);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      message: "Welcome email sent successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-expert-welcome-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: "Failed to send welcome email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

