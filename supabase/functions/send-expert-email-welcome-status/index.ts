import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  expertName: string;
  expertEmail: string;
  emailType?: 'approval' | 'onboarding' | 'rejection'; // 'approval' for admin approval, 'onboarding' for onboarding complete, 'rejection' for rejection
  rejectionMessage?: string; // Optional custom message for rejection
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body with better error handling
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid request body", message: "Failed to parse JSON" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { expertName, expertEmail, emailType = 'onboarding', rejectionMessage }: WelcomeEmailRequest = requestBody;
    
    if (!expertName || !expertEmail) {
      console.error("Missing required fields:", { expertName: !!expertName, expertEmail: !!expertEmail });
      return new Response(
        JSON.stringify({ error: "Expert name and email are required", message: "expertName and expertEmail are required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending email to expert ${expertName} (${expertEmail}), type: ${emailType}`);

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured for send-expert-email-welcome-status function");
      console.error("Please add RESEND_API_KEY secret in Supabase Dashboard → Edge Functions → Secrets");
      return new Response(
        JSON.stringify({ 
          error: "Email service not configured",
          message: "RESEND_API_KEY secret is missing. Please configure it in Supabase Dashboard → Edge Functions → Secrets"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);

    const appUrl = Deno.env.get("APP_URL") || "https://ifindlife.com";
    
    // Determine if running in development/localhost
    const isDevelopment = Deno.env.get("ENVIRONMENT") === "development" || 
                         appUrl.includes("localhost") || 
                         appUrl.includes("127.0.0.1");
    // Determine email type and subject
    const isApprovalEmail = emailType === 'approval';
    const isRejectionEmail = emailType === 'rejection';
    const isOnboardingEmail = emailType === 'onboarding';
    
    const emailSubject = isApprovalEmail 
      ? "🎉 Your Expert Account has been Approved! Welcome to iFindLife!"
      : isRejectionEmail
      ? "Update on Your Expert Account Application"
      : "🎉 Welcome to iFindLife! Your Profile is Now Active!";
    
    // Format rejection message if provided
    const formattedRejectionMessage = isRejectionEmail && rejectionMessage 
      ? (rejectionMessage.includes('<') ? rejectionMessage : `<p>${rejectionMessage.replace(/\n/g, '<br>')}</p>`)
      : isRejectionEmail
      ? '<p>Unfortunately, your expert account application has been rejected.</p>'
      : '';

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: ${isRejectionEmail ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">
            ${isRejectionEmail ? 'Application Update' : `Welcome ${expertName}! 🎉`}
          </h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          ${isRejectionEmail 
            ? `
              <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
                We're sorry to inform you that your expert application has been <strong>rejected</strong>.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                ${formattedRejectionMessage}
              </div>
              
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  <strong>Note:</strong> If you have any questions about this decision or would like to reapply in the future, please contact our support team.
                </p>
              </div>
            `
            : isApprovalEmail 
            ? `
              <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
                Congratulations! Your expert application has been <strong>approved</strong>! We're excited to have you join our expert community.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
                <ul style="color: #666; line-height: 1.6;">
                  <li>Log in to your expert dashboard to complete your onboarding</li>
                  <li>Review and confirm the services assigned to you by our admin team</li>
                  <li>Set up your availability for consultations</li>
                  <li>Complete your profile to start receiving bookings</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${appUrl}/expert-login" 
                   style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Log In to Your Dashboard
                </a>
              </div>
            `
            : `
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
            `
          }
          
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

    // Use verified domain email address (update after domain verification)
    // For localhost/development: use resend.dev (testing domain - only works for your email)
    // For production: use verified domain (noreply@ifindlife.com) after domain verification
    let fromEmail = Deno.env.get("RESEND_FROM_EMAIL");
    
    if (!fromEmail) {
      if (isDevelopment) {
        // Development: Use testing domain (only works for your email address)
        fromEmail = "iFindLife Expert Team <onboarding@resend.dev>";
        console.log("⚠️ Development mode: Using testing domain. Emails will only work for your registered email address.");
      } else {
        // Production: Should use verified domain (update after domain verification)
        fromEmail = "iFindLife Expert Team <noreply@ifindlife.com>";
        console.log("📧 Production mode: Using verified domain. Make sure domain is verified in Resend.");
      }
    }
    
    const emailResponse = await resend.emails.send({
      from: fromEmail,
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
    console.error("Error in send-expert-email-welcome-status function:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      cause: error.cause
    });
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Internal server error",
        message: error.message || "Failed to send email",
        details: error.stack || "Failed to send welcome email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

