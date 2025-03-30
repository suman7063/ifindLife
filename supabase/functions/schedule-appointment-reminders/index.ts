
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

serve(async (req) => {
  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get current date and time
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    // Format the date for comparison
    const currentDate = now.toISOString().split('T')[0];
    
    // Format the time for comparison (HH:MM)
    const targetStartHour = twoHoursLater.getHours().toString().padStart(2, '0');
    const targetStartMinute = twoHoursLater.getMinutes().toString().padStart(2, '0');
    const targetStartTime = `${targetStartHour}:${targetStartMinute}`;
    
    // Find confirmed appointments that haven't been reminded yet and are scheduled to start in about 2 hours
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('status', 'confirmed')
      .eq('reminder_sent', false)
      .eq('appointment_date', currentDate)
      .lte('start_time', targetStartTime + ':59'); // Add seconds to match time format
      
    if (error) {
      throw new Error(`Error fetching appointments: ${error.message}`);
    }
    
    console.log(`Found ${appointments.length} appointments that need reminders`);
    
    // Send reminders for each appointment
    const reminderResults = await Promise.all(
      appointments.map(async (appointment) => {
        try {
          // Call the notification function
          const response = await fetch(
            `${supabaseUrl}/functions/v1/send-appointment-notification`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseKey}`
              },
              body: JSON.stringify({
                appointmentId: appointment.id,
                type: 'reminder'
              })
            }
          );
          
          const result = await response.json();
          return {
            appointmentId: appointment.id,
            success: result.success,
            message: result.message || result.error
          };
        } catch (error) {
          return {
            appointmentId: appointment.id,
            success: false,
            message: error.message
          };
        }
      })
    );
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        reminders_sent: reminderResults.filter(r => r.success).length,
        reminders_failed: reminderResults.filter(r => !r.success).length,
        details: reminderResults
      }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error scheduling reminders:", error.message);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
