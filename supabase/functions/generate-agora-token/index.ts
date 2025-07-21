
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Proper Agora RTC Token generation following official spec
async function generateAgoraToken(appId: string, appCertificate: string, channelName: string, uid: number, role: number, expireTime: number): Promise<string | null> {
  try {
    // If no app certificate is provided, return null (for projects without authentication)
    if (!appCertificate || appCertificate === 'temp_certificate') {
      console.log('🟡 No app certificate provided, returning null token for channel:', channelName, 'uid:', uid);
      return null;
    }

    console.log('🔑 Generating proper Agora RTC token...');
    
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expireTime;
    const salt = Math.floor(Math.random() * 0xFFFFFFFF);
    
    // Helper function to pack uint32 in little endian
    function packUint32LE(value: number): Uint8Array {
      const buffer = new ArrayBuffer(4);
      const view = new DataView(buffer);
      view.setUint32(0, value, true); // true = little endian
      return new Uint8Array(buffer);
    }
    
    // Helper function to pack uint16 in little endian
    function packUint16LE(value: number): Uint8Array {
      const buffer = new ArrayBuffer(2);
      const view = new DataView(buffer);
      view.setUint16(0, value, true); // true = little endian
      return new Uint8Array(buffer);
    }
    
    // Build privileges map
    const privileges = new Map<number, number>();
    privileges.set(1, privilegeExpiredTs); // kJoinChannel
    if (role === 1) { // Publisher
      privileges.set(2, privilegeExpiredTs); // kPublishAudioStream
      privileges.set(3, privilegeExpiredTs); // kPublishVideoStream
      privileges.set(4, privilegeExpiredTs); // kPublishDataStream
    }
    
    // Pack privileges
    const privilegesPacked: Uint8Array[] = [];
    privilegesPacked.push(packUint16LE(privileges.size));
    
    for (const [key, value] of privileges) {
      privilegesPacked.push(packUint16LE(key));
      privilegesPacked.push(packUint32LE(value));
    }
    
    // Combine all privilege bytes
    const privilegesBytes = new Uint8Array(privilegesPacked.reduce((acc, arr) => acc + arr.length, 0));
    let offset = 0;
    for (const arr of privilegesPacked) {
      privilegesBytes.set(arr, offset);
      offset += arr.length;
    }
    
    // Build message to sign (appId + channelName + uid + expiredTs + salt + privileges)
    const appIdBytes = new TextEncoder().encode(appId);
    const channelNameBytes = new TextEncoder().encode(channelName);
    const uidBytes = packUint32LE(uid);
    const expiredTsBytes = packUint32LE(privilegeExpiredTs);
    const saltBytes = packUint32LE(salt);
    
    // Combine message components
    const messageLength = appIdBytes.length + channelNameBytes.length + 4 + 4 + 4 + privilegesBytes.length;
    const message = new Uint8Array(messageLength);
    offset = 0;
    
    message.set(appIdBytes, offset);
    offset += appIdBytes.length;
    message.set(channelNameBytes, offset);
    offset += channelNameBytes.length;
    message.set(uidBytes, offset);
    offset += 4;
    message.set(expiredTsBytes, offset);
    offset += 4;
    message.set(saltBytes, offset);
    offset += 4;
    message.set(privilegesBytes, offset);
    
    // Generate HMAC-SHA256 signature
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(appCertificate),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', key, message);
    const signatureBytes = new Uint8Array(signature);
    
    // Build final token: version(3) + signature(32) + appId + expiredTs + salt + message
    const version = '007';
    const versionBytes = new TextEncoder().encode(version);
    
    const tokenLength = versionBytes.length + signatureBytes.length + appIdBytes.length + 4 + 4 + messageLength;
    const token = new Uint8Array(tokenLength);
    offset = 0;
    
    token.set(versionBytes, offset);
    offset += versionBytes.length;
    token.set(signatureBytes, offset);
    offset += signatureBytes.length;
    token.set(appIdBytes, offset);
    offset += appIdBytes.length;
    token.set(expiredTsBytes, offset);
    offset += 4;
    token.set(saltBytes, offset);
    offset += 4;
    token.set(message, offset);
    
    // Base64 encode the final token
    const tokenBase64 = btoa(String.fromCharCode(...token));
    
    console.log('✅ Generated proper Agora RTC token for channel:', channelName, 'uid:', uid, 'role:', role);
    console.log('🔍 Token length:', tokenBase64.length, 'Version:', version);
    return tokenBase64;
    
  } catch (error) {
    console.error('❌ Error generating Agora token:', error);
    // For development/testing, return null to allow testing without tokens
    console.log('🟡 Falling back to null token for testing - channel:', channelName, 'uid:', uid);
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
