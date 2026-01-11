import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterEmailRequest {
  emails: string[];
  subject: string;
  message: string;
  youtubeLink?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody: NewsletterEmailRequest = await req.json();
    const { emails, subject, message, youtubeLink } = requestBody;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No email addresses provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!subject || !message) {
      return new Response(
        JSON.stringify({ success: false, error: "Subject and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "iFind Life <onboarding@resend.dev>";

    // Escape message for HTML and replace newlines
    const escapedMessage = message.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');

    // Build email HTML content
    let emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #5AC8FA 0%, #7DD8C9 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">iFind Life</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <div style="white-space: pre-wrap; margin-bottom: 30px;">${escapedMessage}</div>
    `;

    // Add YouTube link if provided
    if (youtubeLink) {
      // Extract video ID from various YouTube URL formats
      let videoId = '';
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = youtubeLink.match(youtubeRegex);
      if (match && match[1]) {
        videoId = match[1];
      } else {
        // If no match, try to use the link as-is
        videoId = youtubeLink;
      }

      emailHtml += `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${youtubeLink}" 
                 style="display: inline-block; background: #FF0000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0;">
                📺 Watch on YouTube
              </a>
            </div>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${youtubeLink}" style="color: #5AC8FA; text-decoration: none; font-size: 14px;">
                ${youtubeLink}
              </a>
            </div>
      `;
    }

    emailHtml += `
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #666; font-size: 12px; text-align: center; margin: 0;">
              This email was sent to you because you subscribed to our newsletter.<br>
              <a href="#" style="color: #5AC8FA; text-decoration: none;">Unsubscribe</a>
            </p>
          </div>
        </body>
      </html>
    `;

    // Send emails to all recipients
    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (const email of emails) {
      try {
        const response = await resend.emails.send({
          from: fromEmail,
          to: [email],
          subject: subject,
          html: emailHtml,
        });

        if (response.error) {
          console.error(`Failed to send email to ${email}:`, response.error);
          results.push({ email, success: false, error: response.error });
          failureCount++;
        } else {
          console.log(`✅ Email sent successfully to ${email}`);
          results.push({ email, success: true });
          successCount++;
        }
      } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
        results.push({ 
          email, 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        });
        failureCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total: emails.length,
        successCount,
        failureCount,
        results,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in send-newsletter-email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
};

serve(handler);

