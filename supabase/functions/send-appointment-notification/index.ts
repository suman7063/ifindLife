
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  appointmentId: string;
  type: 'confirmation' | 'reminder' | 'cancellation';
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    // Get request body
    const { appointmentId, type } = await req.json() as NotificationRequest;
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get appointment details
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        *, 
        users!appointments_user_id_fkey(name, email),
        experts!appointments_expert_id_fkey(name, email)
      `)
      .eq('id', appointmentId)
      .single();
    
    if (appointmentError) {
      throw new Error(`Error fetching appointment: ${appointmentError.message}`);
    }
    
    // Format date and time
    const appointmentDate = new Date(appointment.appointment_date);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Prepare notification data
    const user = appointment.users;
    const expert = appointment.experts;
    
    // In a real implementation, we would send an actual email here
    // For now, we'll just log the information
    console.log(`
      Notification Type: ${type}
      Appointment ID: ${appointmentId}
      Date: ${formattedDate}
      Time: ${appointment.start_time} - ${appointment.end_time}
      User: ${user.name} (${user.email})
      Expert: ${expert.name} (${expert.email})
    `);
    
    // Update appointment notification status
    let updateData = {};
    
    if (type === 'confirmation') {
      updateData = { confirmation_sent: true };
    } else if (type === 'reminder') {
      updateData = { reminder_sent: true };
    }
    
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', appointmentId);
      
      if (updateError) {
        throw new Error(`Error updating appointment: ${updateError.message}`);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${type} notification sent for appointment ${appointmentId}` 
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in send-appointment-notification:", error.message);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 400 
      }
    );
  }
});
