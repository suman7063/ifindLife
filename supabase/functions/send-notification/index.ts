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
    
    // Check user notification preferences before sending
    const { data: preferences, error: prefError } = await supabase
      .from('user_notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    // If preferences exist, check if this notification type is allowed
    if (preferences && !prefError) {
      // Map notification types to preference fields
      let shouldSend = true;
      let preferenceField: string | null = null;
      
      if (type === 'session_ready' || type.startsWith('appointment_')) {
        // Session ready and appointment notifications
        preferenceField = 'booking_confirmations';
        shouldSend = preferences.booking_confirmations === true;
      } else if (type === 'appointment_reminder' || type.includes('reminder')) {
        // Appointment reminders
        preferenceField = 'appointment_reminders';
        shouldSend = preferences.appointment_reminders === true;
      } else if (type === 'message' || type === 'expert_message' || type.includes('message')) {
        // Expert messages
        preferenceField = 'expert_messages';
        shouldSend = preferences.expert_messages === true;
      } else if (type === 'call_accepted' || type === 'call_ended' || type === 'incoming_call_request') {
        // Call-related notifications
        preferenceField = 'booking_confirmations';
        shouldSend = preferences.booking_confirmations === true;
      }
      // For other types (system, promotional, etc.), check push_notifications
      else {
        preferenceField = 'push_notifications';
        shouldSend = preferences.push_notifications === true;
      }
      
      if (!shouldSend) {
        console.log(`⏭️ Notification skipped - user has disabled ${preferenceField}`, {
          userId,
          type,
          preferenceField,
          preferenceValue: preferences[preferenceField as keyof typeof preferences]
        });
        return new Response(
          JSON.stringify({ 
            success: false, 
            skipped: true,
            reason: `User has disabled ${preferenceField} notifications`,
            message: 'Notification skipped due to user preferences'
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log(`✅ Notification allowed - user has enabled ${preferenceField}`, {
        userId,
        type,
        preferenceField
      });
    } else if (prefError && prefError.code !== 'PGRST116') {
      // If error is not "no rows returned", log it but continue (use defaults)
      console.warn('⚠️ Error fetching preferences, using defaults:', prefError);
    } else {
      // No preferences found - use defaults (allow all notifications)
      console.log('ℹ️ No preferences found, using defaults (allowing notification)', { userId });
    }
    
    // Validate referenceId is a valid UUID format
    // Only use it if it's a valid UUID (notifications table requires UUID type)
    const isValidUUID = referenceId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(referenceId);
    
    // Create in-app notification
    const notificationData: any = {
      user_id: userId,
      type,
      title,
      content: content || null,
      read: false,
      sender_id: senderId || null,
      reference_id: isValidUUID ? referenceId : null
    };
    
    // Note: If referenceId is not a valid UUID, it will be null
    // The actual reference (like callSessionId) should be passed in the data field
    // and stored in content or handled by the client

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

