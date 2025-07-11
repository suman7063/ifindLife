import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  appointmentId: string;
  type: 'reminder' | 'confirmation' | 'cancellation';
  minutesBefore?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key
    const supabaseServiceRole = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let requestData: NotificationRequest;

    // Handle different request types
    if (req.method === "POST") {
      requestData = await req.json();
    } else {
      // For cron jobs, we'll find appointments that need reminders
      const now = new Date();
      const reminderTime = new Date(now.getTime() + (15 * 60 * 1000)); // 15 minutes from now
      
      // Find appointments that need reminders
      const { data: appointments, error: appointmentsError } = await supabaseServiceRole
        .from('appointments')
        .select(`
          id,
          user_id,
          expert_id,
          expert_name,
          appointment_date,
          start_time,
          end_time,
          status,
          users!appointments_user_id_fkey(email, name),
          expert_accounts!appointments_expert_id_fkey(email, name)
        `)
        .eq('status', 'confirmed')
        .gte('appointment_date', now.toISOString().split('T')[0])
        .lte('appointment_date', reminderTime.toISOString().split('T')[0]);

      if (appointmentsError) {
        throw appointmentsError;
      }

      // Process each appointment that needs a reminder
      for (const appointment of appointments || []) {
        const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
        const timeDiff = appointmentDateTime.getTime() - now.getTime();
        const minutesDiff = timeDiff / (1000 * 60);

        // Send reminder if appointment is 15 minutes away
        if (minutesDiff > 10 && minutesDiff <= 20) {
          await sendNotification(appointment, 'reminder', supabaseServiceRole);
        }
      }

      return new Response(
        JSON.stringify({ message: "Reminder notifications processed" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Fetch appointment details
    const { data: appointment, error: appointmentError } = await supabaseServiceRole
      .from('appointments')
      .select(`
        *,
        users!appointments_user_id_fkey(email, name),
        expert_accounts!appointments_expert_id_fkey(email, name)
      `)
      .eq('id', requestData.appointmentId)
      .single();

    if (appointmentError || !appointment) {
      throw new Error('Appointment not found');
    }

    await sendNotification(appointment, requestData.type, supabaseServiceRole);

    return new Response(
      JSON.stringify({ message: "Notification sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

async function sendNotification(appointment: any, type: string, supabase: any) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const userEmail = appointment.users?.email;
  const expertEmail = appointment.expert_accounts?.email;
  const userName = appointment.users?.name || 'User';
  const expertName = appointment.expert_accounts?.name || appointment.expert_name;

  const appointmentDate = formatDate(appointment.appointment_date);
  const appointmentTime = formatTime(appointment.start_time);
  const joinUrl = `${Deno.env.get("SITE_URL") || 'https://localhost:3000'}/appointments`;

  if (type === 'reminder') {
    // Send reminder to user
    if (userEmail) {
      await resend.emails.send({
        from: "WellnessConnect <appointments@wellnessconnect.com>",
        to: [userEmail],
        subject: "Your appointment starts in 15 minutes",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3B82F6;">Your Session Starts Soon!</h1>
            <p>Hello ${userName},</p>
            <p>Your appointment with <strong>${expertName}</strong> is starting in just 15 minutes.</p>
            
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Session Details:</h3>
              <p><strong>Expert:</strong> ${expertName}</p>
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
            </div>
            
            <p>You can join your video call from your appointments page:</p>
            <a href="${joinUrl}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">
              Join Your Session
            </a>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6B7280;">
              Best regards,<br>
              The WellnessConnect Team
            </p>
          </div>
        `,
      });
    }

    // Send reminder to expert
    if (expertEmail) {
      await resend.emails.send({
        from: "WellnessConnect <appointments@wellnessconnect.com>",
        to: [expertEmail],
        subject: "Upcoming session with client",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3B82F6;">Upcoming Session Reminder</h1>
            <p>Hello ${expertName},</p>
            <p>You have a session with <strong>${userName}</strong> starting in 15 minutes.</p>
            
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Session Details:</h3>
              <p><strong>Client:</strong> ${userName}</p>
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
            </div>
            
            <a href="${joinUrl}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">
              Join Session
            </a>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6B7280;">
              Best regards,<br>
              The WellnessConnect Team
            </p>
          </div>
        `,
      });
    }
  } else if (type === 'confirmation') {
    // Send confirmation to user
    if (userEmail) {
      await resend.emails.send({
        from: "WellnessConnect <appointments@wellnessconnect.com>",
        to: [userEmail],
        subject: "Appointment Confirmed",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #10B981;">Appointment Confirmed!</h1>
            <p>Hello ${userName},</p>
            <p>Your appointment with <strong>${expertName}</strong> has been confirmed.</p>
            
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Session Details:</h3>
              <p><strong>Expert:</strong> ${expertName}</p>
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
            </div>
            
            <p>You'll receive a reminder 15 minutes before your session. You can join the video call from your appointments page.</p>
            
            <a href="${joinUrl}" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">
              View Appointment
            </a>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6B7280;">
              Best regards,<br>
              The WellnessConnect Team
            </p>
          </div>
        `,
      });
    }
  }

  // Log notification in database
  await supabase.from('notifications').insert({
    user_id: appointment.user_id,
    type: 'appointment_' + type,
    title: type === 'reminder' ? 'Session Starting Soon' : 'Appointment Confirmed',
    content: `Your appointment with ${expertName} on ${appointmentDate} at ${appointmentTime}`,
    created_at: new Date().toISOString()
  });
}

serve(handler);