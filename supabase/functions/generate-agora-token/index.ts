import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Install agora-token package: npm install agora-token
import { RtcTokenBuilder, RtcRole } from "https://esm.sh/agora-token@2.0.4"

function generateAgoraToken(appId: string, appCertificate: string, channelName: string, uid: number, role: number, expireTime: number): string | null {
  try {
    // If no app certificate is provided, return null (for projects without authentication)
    if (!appCertificate || appCertificate === 'temp_certificate') {
      console.log('🟡 No app certificate provided, returning null token for channel:', channelName, 'uid:', uid);
      return null;
    }

    // Generate proper Agora token
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expireTime;
    
    // Use RtcRole.PUBLISHER for role 1 (host), RtcRole.SUBSCRIBER for role 2 (audience)
    const rtcRole = role === 1 ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      rtcRole,
      privilegeExpiredTs
    );
    
    console.log('✅ Generated Agora token for channel:', channelName, 'uid:', uid, 'role:', role);
    return token;
  } catch (error) {
    console.error('❌ Error generating Agora token:', error);
    // Fallback to null token for testing
    console.log('🟡 Falling back to null token for channel:', channelName, 'uid:', uid);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { channelName, uid, role = 1, expireTime = 3600 } = await req.json()
    
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
    
    // Generate Agora token
    const agoraToken = generateAgoraToken(
      appId, 
      appCertificate, 
      channelName, 
      uid, 
      role, 
      expireTime
    )

    return new Response(
      JSON.stringify({ 
        token: agoraToken,
        appId: appId,
        channelName: channelName,
        uid: uid,
        expireTime: expireTime
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error generating Agora token:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})