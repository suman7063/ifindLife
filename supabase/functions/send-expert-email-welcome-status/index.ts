import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  expertName: string;
  expertEmail: string;
  emailType?: 'approval' | 'onboarding' | 'rejection';
  rejectionMessage?: string;
}

// Database Webhook payload format (Supabase native)
interface DatabaseWebhookPayload {
  type: 'UPDATE' | 'INSERT' | 'DELETE';
  table: string;
  schema: string;
  record: {
    name: string;
    email: string;
    status: 'pending' | 'approved' | 'rejected';
    feedback_message?: string;
    onboarding_completed?: boolean;
    [key: string]: any;
  };
  old_record?: {
    status: string;
    onboarding_completed?: boolean;
    [key: string]: any;
  };
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
    
    // Check if this is a database webhook payload (Supabase native)
    const isWebhook = requestBody.type && requestBody.table && requestBody.record;
    
    let expertName: string;
    let originalExpertEmail: string;
    let emailType: 'approval' | 'onboarding' | 'rejection' | undefined;
    let rejectionMessage: string | undefined;
    
    if (isWebhook) {
      // Handle database webhook payload (Supabase native)
      const webhookPayload = requestBody as DatabaseWebhookPayload;
      
      // Only process UPDATE events on expert_accounts table
      if (webhookPayload.type !== 'UPDATE' || webhookPayload.table !== 'expert_accounts') {
        return new Response(
          JSON.stringify({ success: true, message: "Webhook event ignored (not an expert_accounts UPDATE)" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const newRecord = webhookPayload.record;
      const oldRecord = webhookPayload.old_record;
      
      // Check if onboarding_completed changed from false to true
      const onboardingCompleted = newRecord.onboarding_completed === true && 
                                   (oldRecord?.onboarding_completed === false || oldRecord?.onboarding_completed === null || oldRecord?.onboarding_completed === undefined);
      
      // Check if status changed
      const statusChanged = oldRecord && newRecord.status !== oldRecord.status;
      
      // Extract name and email from record (handle null/undefined)
      expertName = newRecord.name || newRecord.email?.split('@')[0] || 'Expert';
      originalExpertEmail = newRecord.email || '';
      
      // Validate we have email
      if (!originalExpertEmail) {
        console.error("Webhook payload missing email:", JSON.stringify(newRecord));
        return new Response(
          JSON.stringify({ success: false, error: "Email is required in webhook payload" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (onboardingCompleted) {
        // Onboarding completed - send welcome email
        emailType = 'onboarding';
        console.log(`📧 [Supabase Webhook] Onboarding completed for ${expertName} (${originalExpertEmail})`);
      } else if (statusChanged) {
        // Status changed - determine email type based on status change
        if (newRecord.status === 'approved') {
          emailType = 'approval';
        } else if (newRecord.status === 'rejected') {
          emailType = 'rejection';
          rejectionMessage = newRecord.feedback_message;
        } else {
          // Status changed but not to approved/rejected, don't send email
          return new Response(
            JSON.stringify({ success: true, message: "Status change doesn't require email" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        console.log(`📧 [Supabase Webhook] Status changed from ${oldRecord?.status || 'unknown'} to ${newRecord.status} for ${expertName} (${originalExpertEmail})`);
      } else {
        // No relevant change, don't send email
        return new Response(
          JSON.stringify({ success: true, message: "No relevant change, email not sent" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      // Handle manual call payload (backward compatibility)
      const manualPayload = requestBody as WelcomeEmailRequest;
      expertName = manualPayload.expertName;
      originalExpertEmail = manualPayload.expertEmail;
      emailType = manualPayload.emailType || 'onboarding';
      rejectionMessage = manualPayload.rejectionMessage;
      
      console.log(`📧 [Manual Call] Sending ${emailType} email to ${expertName} (${originalExpertEmail})`);
    }
    
    if (!expertName || !originalExpertEmail || !emailType) {
      console.error("Missing required fields:", { expertName: !!expertName, expertEmail: !!originalExpertEmail, emailType: !!emailType });
      return new Response(
        JSON.stringify({ error: "Expert name, email, and email type are required", message: "expertName, expertEmail, and emailType are required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    const appUrl = Deno.env.get("APP_URL") || "https://ifindlife.org";
    
    // Determine if running in development/localhost
    const isDevelopment = Deno.env.get("ENVIRONMENT") === "development" || 
                         appUrl.includes("localhost") || 
                         appUrl.includes("127.0.0.1");
    
    // Send email to actual expert email address
    // Domain is verified in Resend, so emails can be sent to any recipient
    const expertEmail = originalExpertEmail;
    
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
    // IMPORTANT: Always use testing domain (onboarding@resend.dev) until domain is verified
    // Domain verification required for production emails to work
    let fromEmail = Deno.env.get("RESEND_FROM_EMAIL");
    
    if (!fromEmail) {
      // Always use testing domain until domain is verified in Resend
      // This works for your registered email address (singh1996fly@gmail.com)
      fromEmail = "iFindLife Expert Team <onboarding@resend.dev>";
      
      if (isDevelopment) {
        console.log("⚠️ Development mode: Using testing domain. Emails will only work for your registered email address.");
      } else {
        console.log("⚠️ Production mode: Using testing domain (domain not verified). Emails will only work for your registered email address.");
        console.log("💡 To send to all recipients, verify domain at: https://resend.com/domains");
        console.log("💡 After verification, set RESEND_FROM_EMAIL secret to: iFindLife Expert Team <noreply@ifindlife.org>");
      }
    }
    
    console.log(`📧 Attempting to send email to ${expertEmail} using ${fromEmail}`);
    
    let emailResponse;
    try {
      emailResponse = await resend.emails.send({
        from: fromEmail,
        to: [expertEmail],
        subject: emailSubject,
        html: emailHtml,
      });
    } catch (sendError) {
      console.error("❌ Resend API call failed:", sendError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to call Resend API", 
          details: sendError instanceof Error ? sendError.message : String(sendError)
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (emailResponse.error) {
      console.error("❌ Resend email sending error:", JSON.stringify(emailResponse.error));
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to send email", 
          details: emailResponse.error 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("✅ Welcome email sent successfully:", emailResponse.data);

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

