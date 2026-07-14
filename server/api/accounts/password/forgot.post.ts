import { Resend } from "resend";
import { randomBytes } from "node:crypto";

const FROM_ADDRESS = "RapidByt <noreply@rapidbyt.com>";

export default eventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.username)
    throw createError({ statusCode: 400, statusMessage: "Username or email is required" });

  // Try username first, then email — always return success to prevent enumeration
  let account = await orm.accounts.getByUsername(body.username);
  if (!account) account = await orm.accounts.getByEmail(body.username);

  // Always return success — never reveal whether the account exists
  if (!account || !account.email) {
    return sendSuccess(null, {
      message: "If an account with that username or email exists, we've sent a reset link.",
    });
  }

  // Generate a secure random token (64 hex chars)
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await orm.accounts.setResetToken(account.id, token, expiresAt);

  // Send reset email
  const config = useRuntimeConfig();
  const resendApiKey = config.resendApiKey;

  if (resendApiKey) {
    const resend = new Resend(resendApiKey);
    const resetUrl = `${getRequestURL(event).origin}/reset-password?token=${token}`;

    await resend.emails
      .send({
        from: FROM_ADDRESS,
        to: [account.email],
        subject: "Reset your RapidByt password",
        html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px">
          <div style="text-align:center;margin-bottom:24px">
            <div style="display:inline-flex;width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#0ea5e9,#6366f1);align-items:center;justify-content:center;margin-bottom:12px">
              <span style="color:#fff;font-weight:900;font-size:20px">R</span>
            </div>
            <h1 style="margin:0;font-size:22px;font-weight:900;color:#0f172a">Reset your password</h1>
          </div>
          <p style="color:#64748b;font-size:15px;line-height:1.6">Hi ${account.name || account.username},</p>
          <p style="color:#64748b;font-size:15px;line-height:1.6">
            We received a request to reset your RapidByt password. Click the button below — this link expires in <strong>1 hour</strong>.
          </p>
          <div style="text-align:center;margin:32px 0">
            <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#0ea5e9,#6366f1);color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px">
              Reset Password
            </a>
          </div>
          <p style="color:#94a3b8;font-size:12px;text-align:center">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
      })
      .catch(() => {
        // Don't fail the request if email fails — token is still saved
      });
  }

  return sendSuccess(null, {
    message: "If an account with that username or email exists, we've sent a reset link.",
  });
});
