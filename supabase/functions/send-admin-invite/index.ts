import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const APP_URL = "https://inkingi-nine.vercel.app";
const FROM_EMAIL = "Inkingi <onboarding@resend.dev>";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase environment is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const { data: adminProfile, error: adminError } = await supabase
      .from("admins")
      .select("id, role, active")
      .eq("id", user.id)
      .maybeSingle();

    if (
      adminError ||
      !adminProfile ||
      adminProfile.role !== "super_admin" ||
      adminProfile.active !== true
    ) {
      return new Response(
        JSON.stringify({
          error: "Only an active Super Admin may send administrator invitations",
        }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const body = await req.json();
    const inviteId = String(body.invite_id || "").trim();

    if (!inviteId) {
      return new Response(
        JSON.stringify({ error: "Invitation ID is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const { data: invite, error: inviteError } = await supabase
      .from("admin_invites")
      .select(
        "id,email,permissions,invited_by,created_at,accepted_at,revoked,expires_at",
      )
      .eq("id", inviteId)
      .maybeSingle();

    if (inviteError) {
      console.error("Invitation lookup error:", inviteError);

      return new Response(
        JSON.stringify({ error: "Could not verify invitation" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (!invite) {
      return new Response(
        JSON.stringify({ error: "Invitation not found" }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (invite.invited_by !== user.id) {
      return new Response(
        JSON.stringify({
          error: "You are not authorized to send this invitation",
        }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (invite.accepted_at) {
      return new Response(
        JSON.stringify({
          error: "This invitation has already been accepted",
        }),
        {
          status: 409,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (invite.revoked) {
      return new Response(
        JSON.stringify({ error: "This invitation has been revoked" }),
        {
          status: 409,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (
      invite.expires_at &&
      new Date(invite.expires_at).getTime() <= Date.now()
    ) {
      return new Response(
        JSON.stringify({ error: "This invitation has expired" }),
        {
          status: 409,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const permissions = Array.isArray(invite.permissions)
      ? invite.permissions
      : [];

    const permissionText =
      permissions.length > 0
        ? permissions.join(", ")
        : "Standard administrator permissions";

    const inviteUrl = `${APP_URL}/`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Inkingi Administrator Invitation</title>
</head>
<body style="margin:0;padding:0;background:#f7f9f7;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

    <div style="padding:28px 30px;background:#166534;color:#ffffff;">
      <h1 style="margin:0;font-size:25px;">Inkingi</h1>
      <p style="margin:7px 0 0;font-size:14px;">
        Rwanda Agricultural Marketplace
      </p>
    </div>

    <div style="padding:32px 30px;">
      <h2 style="margin-top:0;color:#111827;">
        You're invited to become an administrator
      </h2>

      <p>
        You have been invited to join the Inkingi administration team.
      </p>

      <p>
        Please use the email address
        <strong>${invite.email}</strong>
        when registering or signing in to your Inkingi account.
      </p>

      <div style="background:#f3f4f6;border-radius:8px;padding:16px;margin:22px 0;">
        <strong>Administrator permissions</strong>
        <p style="margin:8px 0 0;font-size:14px;">
          ${permissionText}
        </p>
      </div>

      <p>
        Your invitation is valid until
        <strong>${new Date(invite.expires_at).toLocaleDateString()}</strong>.
      </p>

      <div style="text-align:center;margin:30px 0;">
        <a
          href="${inviteUrl}"
          style="display:inline-block;background:#166534;color:#ffffff;text-decoration:none;padding:13px 25px;border-radius:7px;font-weight:bold;"
        >
          Open Inkingi
        </a>
      </div>

      <p style="font-size:13px;color:#6b7280;">
        After opening Inkingi, register or sign in using the invited email
        address. Your administrator invitation will then be recognized by
        the system.
      </p>

      <p style="font-size:13px;color:#6b7280;">
        If you were not expecting this invitation, you can safely ignore this email.
      </p>
    </div>

    <div style="padding:20px 30px;background:#f9fafb;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#6b7280;text-align:center;">
        © Inkingi — Supporting Rwanda's Agricultural Transformation
      </p>
    </div>

  </div>
</body>
</html>
`;

    const resendResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [invite.email],
          subject: "You're invited to become an Inkingi administrator",
          html,
        }),
      },
    );

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend error:", resendData);

      return new Response(
        JSON.stringify({
          error: "Email provider rejected the message",
          details: resendData,
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        messageId: resendData.id,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("send-admin-invite error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});
