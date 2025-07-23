import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { appointmentId, type } = await req.json();
    
    // Fetch appointment details
    const { data: appointment, error } = await supabase
      .from('appointments')
      .select('*, user:users(name, email)')
      .eq('id', appointmentId)
      .single();
      
    if (error) throw error;
    
    // Create in-app notification
    await supabase
      .from('notifications')
      .insert({
        user_id: appointment.user_id,
        type: `appointment_${type}`,
        title: `Appointment ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        content: `Your appointment with ${appointment.expert_name} on ${appointment.appointment_date} at ${appointment.start_time}`,
        read: false
      });
    
    // Mark reminder as sent if it's a reminder
    if (type === 'reminder') {
      await supabase
        .from('appointments')
        .update({ reminder_sent: true })
        .eq('id', appointmentId);
    }
    
    return new Response(
      JSON.stringify({ success: true, message: `${type} notification sent` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});