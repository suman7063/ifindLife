import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, username, password, sessionToken } = await req.json();

    // Create Supabase client with service role key for admin operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (action === "login") {
      // Input validation
      if (!username || !password) {
        return new Response(
          JSON.stringify({ success: false, error: "Username and password are required" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // Sanitize inputs
      const sanitizedUsername = username.trim().toLowerCase();
      const sanitizedPassword = password.trim();

      // Use the secure authentication function
      const { data, error } = await supabase.rpc("authenticate_admin", {
        p_username: sanitizedUsername,
        p_password: sanitizedPassword,
      });

      if (error) {
        console.error("Admin auth error:", error);
        return new Response(
          JSON.stringify({ success: false, error: "Authentication failed" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      if (!data?.success) {
        return new Response(
          JSON.stringify({ success: false, error: data?.error || "Invalid credentials" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
          }
        );
      }

      // Generate secure session token
      const sessionTokenValue = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store session in database
      const { error: sessionError } = await supabase
        .from("admin_sessions")
        .insert({
          admin_id: data.admin.id,
          session_token: sessionTokenValue,
          expires_at: expiresAt.toISOString(),
          ip_address: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
          user_agent: req.headers.get("user-agent"),
        });

      if (sessionError) {
        console.error("Session creation error:", sessionError);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to create session" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          admin: data.admin,
          sessionToken: sessionTokenValue,
          expiresAt: expiresAt.toISOString(),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );

    } else if (action === "verify") {
      // Verify session token
      if (!sessionToken) {
        return new Response(
          JSON.stringify({ success: false, error: "Session token required" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      const { data: sessionData, error: sessionError } = await supabase
        .from("admin_sessions")
        .select(`
          id,
          admin_id,
          expires_at,
          admin_accounts (
            id,
            username,
            email,
            role,
            is_active
          )
        `)
        .eq("session_token", sessionToken)
        .single();

      if (sessionError || !sessionData) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid session" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
          }
        );
      }

      // Check if session is expired
      if (new Date(sessionData.expires_at) < new Date()) {
        // Delete expired session
        await supabase.from("admin_sessions").delete().eq("id", sessionData.id);
        
        return new Response(
          JSON.stringify({ success: false, error: "Session expired" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
          }
        );
      }

      // Check if admin account is active
      if (!sessionData.admin_accounts?.is_active) {
        return new Response(
          JSON.stringify({ success: false, error: "Account deactivated" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          admin: sessionData.admin_accounts,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );

    } else if (action === "logout") {
      // Logout - delete session
      if (sessionToken) {
        await supabase.from("admin_sessions").delete().eq("session_token", sessionToken);
      }

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Invalid action" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );

  } catch (error) {
    console.error("Admin auth function error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});