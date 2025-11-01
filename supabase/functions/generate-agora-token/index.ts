
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Agora RTC Token Builder
// Implements Agora's RTC token generation using HMAC-SHA256
// Based on Agora's token v3 format (version 006)
class AgoraTokenBuilder {
  // Token version (v3)
  private static readonly VERSION = '006';
  
  /**
   * Generate HMAC-SHA256 signature
   */
  private static async hmacSha256(message: string, secret: string): Promise<ArrayBuffer> {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    return await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(message)
    );
  }
  
  /**
   * Convert ArrayBuffer to hex string (for Agora token signature)
   */
  private static arrayBufferToHex(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  
  /**
   * Generate Agora RTC token with UID
   * Token format: <VERSION><APP_ID><EXPIRES><SIGNATURE><CHANNEL><UID><ROLE>
   * Signature is HMAC-SHA256 of: <APP_ID><CHANNEL><UID><ROLE><EXPIRES>
   */
  static async buildTokenWithUid(
    appId: string, 
    appCertificate: string, 
    channelName: string, 
    uid: number, 
    role: number, 
    privilegeExpiredTs: number
  ): Promise<string | null> {
    // If no valid certificate, return null (use tokenless mode)
    if (!appCertificate || appCertificate === 'temp_certificate' || appCertificate.trim() === '') {
      return null;
    }
    
    try {
      // Build message for signature: APP_ID + CHANNEL + UID + ROLE + EXPIRES
      const message = `${appId}${channelName}${uid}${role}${privilegeExpiredTs}`;
      
      // Generate HMAC-SHA256 signature (32 bytes = 64 hex chars)
      const signatureBuffer = await this.hmacSha256(message, appCertificate);
      const signature = this.arrayBufferToHex(signatureBuffer);
      
      // Build token content
      // Format: VERSION(3) + APP_ID(32) + EXPIRES(10) + SIGNATURE(64 hex chars) + CHANNEL + UID + ROLE
      const tokenContent = [
        this.VERSION,
        appId,
        privilegeExpiredTs.toString(),
        signature,
        channelName,
        uid.toString(),
        role.toString()
      ].join('');
      
      // Encode entire token content to Base64
      const token = btoa(tokenContent);
      
      return token;
    } catch (error) {
      console.error('❌ Error generating token:', error);
      return null;
    }
  }
}

async function generateAgoraToken(appId: string, appCertificate: string, channelName: string, uid: number, role: number, expireTime: number): Promise<string | null> {
  try {
    // Calculate privilege expiry time (current time + expireTime in seconds)
    const privilegeExpiredTs = Math.floor(Date.now() / 1000) + expireTime;
    
    // If no app certificate is provided, return null (for tokenless mode)
    if (!appCertificate || appCertificate === 'temp_certificate' || appCertificate.trim() === '') {
      return null;
    }
    
    // Generate token (async - properly implemented with HMAC-SHA256)
    const token = await AgoraTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );
    
    return token;
    
  } catch (error) {
    console.error('❌ Error in token generation:', error);
    console.log('🔄 Falling back to null token (tokenless mode)');
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
    // Get from environment variables (set in Supabase dashboard under Edge Functions > Secrets)
    const appId = Deno.env.get('AGORA_APP_ID');
    if (!appId) {
      throw new Error('AGORA_APP_ID environment variable is required. Set it in Supabase Dashboard > Edge Functions > Secrets');
    }
    
    const appCertificate = Deno.env.get('AGORA_APP_CERTIFICATE') || 'temp_certificate';
    
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
      tokenType: agoraToken ? 'authenticated' : (appCertificate && appCertificate !== 'temp_certificate' ? 'generation_failed' : 'null_for_testing'),
      warning: !agoraToken && (!appCertificate || appCertificate === 'temp_certificate') 
        ? 'No App Certificate configured. Set AGORA_APP_CERTIFICATE in Supabase secrets or enable tokenless mode in Agora Console.'
        : undefined
    };


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
