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
    
    console.log('📨 send-notification called with:', {
      userId,
      type,
      title,
      hasContent: !!content,
      hasReferenceId: !!referenceId,
      hasSenderId: !!senderId
    });
    
    if (!userId || !type || !title) {
      console.error('❌ Missing required fields:', { userId: !!userId, type: !!type, title: !!title });
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

    console.log('📝 Inserting notification:', notificationData);
    
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();
      
    if (error) {
      console.error('❌ Error creating notification:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      throw error;
    }
    
    console.log('✅ Notification created successfully:', {
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
    console.error('❌ Error in send-notification:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

