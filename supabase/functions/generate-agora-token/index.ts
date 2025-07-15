import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple token generation for Agora (placeholder implementation)
// In production, you should use the official Agora token server or SDK
function generateAgoraToken(appId: string, appCertificate: string, channelName: string, uid: number, role: number, expireTime: number): string {
  // This is a simplified token generation
  // In production, use the official Agora RTC Token Builder
  const timestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = timestamp + expireTime;
  
  // For demo purposes, return a mock token format
  // In production, implement proper Agora token generation
  return `agora_token_${appId}_${channelName}_${uid}_${privilegeExpiredTs}`;
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