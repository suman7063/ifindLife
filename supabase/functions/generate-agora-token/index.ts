
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// For development/testing, return null to allow testing without proper tokens
// In production, you would implement proper Agora token generation or use a service
async function generateAgoraToken(appId: string, appCertificate: string, channelName: string, uid: number, role: number, expireTime: number): Promise<string | null> {
  try {
    // If no app certificate is provided, return null (for projects without authentication)
    if (!appCertificate || appCertificate === 'temp_certificate') {
      console.log('🟡 No app certificate provided, returning null token for channel:', channelName, 'uid:', uid);
      return null;
    }

    console.log('⚠️  App certificate provided but using null token for testing compatibility');
    console.log('🔧 For production, implement proper Agora RTC token generation');
    console.log('📋 Channel:', channelName, 'UID:', uid, 'Role:', role, 'Expire:', expireTime);
    
    // Return null to allow testing without complex token implementation
    // This works when Agora project has certificate-based authentication disabled
    return null;
    
  } catch (error) {
    console.error('❌ Error in token generation:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { channelName, uid, role = 1, expireTime = 3600 } = await req.json()
    
    console.log('🚀 Token generation request:', { channelName, uid, role, expireTime });
    
    // Verify user authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header required')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    // Agora configuration
    const appId = '9b3ad657507642f98a52d47893780e8e' // Your Agora App ID
    const appCertificate = Deno.env.get('AGORA_APP_CERTIFICATE') || 'temp_certificate'
    
    console.log('🔧 Using Agora config:', { appId, hasCertificate: !!appCertificate && appCertificate !== 'temp_certificate' });
    
    // Generate Agora token
    const agoraToken = await generateAgoraToken(
      appId, 
      appCertificate, 
      channelName, 
      uid, 
      role, 
      expireTime
    );

    const response = {
      token: agoraToken,
      appId: appId,
      channelName: channelName,
      uid: uid,
      expireTime: expireTime,
      tokenType: agoraToken ? 'authenticated' : 'null_for_testing'
    };

    console.log('📤 Sending token response:', { ...response, token: agoraToken ? '[HIDDEN]' : null });

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('❌ Error in token generation endpoint:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Token generation failed - check logs for details'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
