/**
 * Debug function to test notification creation
 * Call this from browser console to test notifications
 * Usage: await window.testNotification('expert-auth-id-uuid')
 */

export async function testNotification(expertAuthId: string) {
  const { supabase } = await import('@/integrations/supabase/client');
  
  console.log('🧪 Testing notification creation for expert:', expertAuthId);
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  console.log('🔍 Current authenticated user:', user?.id);
  console.log('🔍 Expert auth ID:', expertAuthId);
  console.log('🔍 Match:', user?.id === expertAuthId);
  
  try {
    // Test 1: Try to create notification directly
    console.log('📝 Test 1: Direct insert...');
    const { data: directNotification, error: directError } = await supabase
      .from('notifications')
      .insert({
        user_id: expertAuthId,
        type: 'incoming_call_request',
        title: 'Test Call Request',
        content: 'This is a test notification',
        read: false
      })
      .select()
      .single();

    if (directError) {
      console.error('❌ Direct insert failed:', directError);
      console.error('Error code:', directError.code);
      console.error('Error message:', directError.message);
      console.error('Error details:', directError.details);
    } else {
      console.log('✅ Direct insert succeeded:', directNotification);
    }

    // Test 2: Try via Edge Function
    console.log('📝 Test 2: Edge Function...');
    const { data: edgeFunctionResult, error: edgeError } = await supabase.functions.invoke('send-notification', {
      body: {
        userId: expertAuthId,
        type: 'incoming_call_request',
        title: 'Test Call Request via Edge Function',
        content: 'This is a test notification from Edge Function'
      }
    });

    if (edgeError) {
      console.error('❌ Edge Function failed:', edgeError);
      console.error('Error details:', {
        message: edgeError.message,
        name: edgeError.name,
        status: edgeError.status
      });
    } else {
      console.log('✅ Edge Function succeeded:', edgeFunctionResult);
    }

    // Test 3: Check if we can read notifications
    console.log('📝 Test 3: Read notifications...');
    const { data: notifications, error: readError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', expertAuthId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (readError) {
      console.error('❌ Read notifications failed:', readError);
      console.error('Error code:', readError.code);
      console.error('Error message:', readError.message);
    } else {
      console.log('✅ Read notifications succeeded:', notifications);
      console.log('Found', notifications?.length || 0, 'notifications');
    }

    return { 
      success: !directError && !edgeError && !readError,
      directNotification,
      directError,
      edgeFunctionResult,
      edgeError,
      notifications,
      readError,
      currentUser: user?.id
    };
  } catch (error) {
    console.error('❌ Test failed:', error);
    return { success: false, error };
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).testNotification = testNotification;
  console.log('💡 Test function available: await window.testNotification("expert-auth-id")');
}

