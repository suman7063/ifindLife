import { RtcTokenBuilder, RtcRole } from "npm:agora-token@2.0.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const appId = Deno.env.get("AGORA_APP_ID");
    const appCertificate = Deno.env.get("AGORA_APP_CERTIFICATE");
    
    console.log("🔑 Env Vars =>", {
      appId,
      appCertificate: appCertificate ? "SET" : "MISSING"
    });

    if (!appId || !appCertificate) {
      return new Response(JSON.stringify({
        error: "AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set"
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    // --- Parse request body safely ---
    let body = {};
    try {
      body = await req.json();
    } catch {
      console.warn("⚠️ No JSON body found, defaulting to empty object");
    }
    
    console.log("📩 Raw Request Body =>", body);

    // --- Parse query params as fallback ---
    const url = new URL(req.url);
    const params = url.searchParams;
    const channelName = body.channelName || params.get("channelName") || "defaultChannel";
    const uid = parseInt(body.uid || params.get("uid") || "0", 10);
    const roleParam = body.role ?? params.get("role") ?? 1;
    const expireTimeInSeconds = Number(body.expireTime || params.get("expireTime") || 3600);

    // --- Role mapping ---
    let agoraRole;
    if (roleParam === 2 || roleParam === "subscriber" || roleParam === "audience") {
      agoraRole = RtcRole.SUBSCRIBER;
    } else {
      agoraRole = RtcRole.PUBLISHER;
    }

    // --- Token Expiration ---
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTs = currentTime + expireTimeInSeconds;

    console.log("✅ Final Params =>", {
      channelName,
      uid,
      roleParam,
      agoraRole,
      expireTimeInSeconds,
      privilegeExpireTs
    });

    // --- Generate token ---
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      agoraRole,
      privilegeExpireTs
    );

    console.log("🎫 Generated Token =>", token ? "Token generated successfully" : "Token generation failed");

    return new Response(JSON.stringify({
      token
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("❌ Error generating token:", error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
