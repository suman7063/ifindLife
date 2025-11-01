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
    
    const { userId, type, title, content, data, referenceId, senderId } = await req.json();
    
    if (!userId || !type || !title) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: userId, type, title' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Create in-app notification
    const notificationData: any = {
      user_id: userId,
      type,
      title,
      content: content || null,
      read: false,
      sender_id: senderId || null,
      reference_id: referenceId || null
    };

    // Store additional data in a JSONB column if needed (we'll use a custom field via data parameter)
    // For now, we'll encode it in content or create it separately
    
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
    
    // If data object is provided, we can store it separately or extend notification
    // For now, we'll log it - you can extend the notifications table schema if needed
    
    console.log('✅ Notification created:', {
      id: notification.id,
      userId,
      type,
      title,
      hasData: !!data
    });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        notification: {
          ...notification,
          data // Include data in response
        },
        message: 'Notification sent successfully'
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error('Error in send-notification:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

