import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  expertId: string;
  notificationType: 'approval' | 'rejection';
  expertName: string;
  expertEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { expertId, notificationType, expertName, expertEmail }: NotificationRequest = await req.json();
    
    console.log(`Sending ${notificationType} notification to expert ${expertName} (${expertEmail})`);

    let emailSubject: string;
    let emailHtml: string;

    if (notificationType === 'approval') {
      emailSubject = "🎉 Your Expert Application Has Been Approved!";
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Congratulations ${expertName}! 🎉</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
              We're excited to inform you that your expert application has been <strong>approved</strong>!
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
              <a href="${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token_hash=${encodeURIComponent('')}&type=magiclink&redirect_to=${encodeURIComponent('https://nmcqyudqvbldxwzhyzma.supabase.co/expert-dashboard')}" 
                 style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Access Your Dashboard
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Welcome to our expert community! We're excited to have you on board and look forward to the value you'll bring to our users.
            </p>
          </div>
        </div>
      `;
    } else {
      emailSubject = "Update on Your Expert Application";
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #ef4444; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Application Update</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
              Dear ${expertName},
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for your interest in joining our expert community. After careful review, we are unable to approve your application at this time.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #333; margin-top: 0;">What You Can Do</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Review your qualifications and experience</li>
                <li>Update your certifications or credentials</li>
                <li>Reapply in the future when you meet our requirements</li>
                <li>Contact our support team for specific feedback</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              We appreciate your interest and encourage you to apply again in the future. If you have any questions, please don't hesitate to contact our support team.
            </p>
          </div>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "iFind Expert Team <onboarding@resend.dev>",
      to: [expertEmail],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      message: `${notificationType} notification sent successfully`
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in expert-approval-notifications function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: "Failed to send approval/rejection notification"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);