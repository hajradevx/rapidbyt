import { Resend } from "resend";

// ── HTML escaping — applied to ALL user-supplied inputs before HTML interpolation ──
const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
function escapeHtml(input: string): string {
  return String(input).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c] ?? c);
}

const WHATSAPP_NUMBER = "923168636339";
const NOTIFY_EMAIL = "info.rapidbyt@gmail.com";
const FROM_ADDRESS = "RapidByt <noreply@rapidbyt.com>";

const serviceLabels: Record<string, string> = {
  speed: "Speed Optimisation",
  seo: "SEO & Core Web Vitals",
  dev: "Web App Development",
  cloud: "Cloud & Infrastructure",
  security: "Security & Monitoring",
  cro: "Analytics & CRO",
  unsure: "Not sure yet",
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, website, service, message } = body;

  // ── Validation ──────────────────────────────────────────
  if (!name?.trim() || !email?.trim() || !website?.trim()) {
    throw createError({ statusCode: 400, message: "Name, email, and website are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError({ statusCode: 400, message: "Please enter a valid email address." });
  }

  // Escape all user inputs before any HTML interpolation
  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeWebsite = escapeHtml(website.trim());
  const safeServiceRaw = service ?? "";
  const safeMessage = message ? escapeHtml(message.trim()) : null;

  const config = useRuntimeConfig();
  const resendApiKey = config.resendApiKey;
  const emailEnabled = !!resendApiKey;

  const serviceLabel = escapeHtml(
    serviceLabels[safeServiceRaw] || safeServiceRaw || "Not specified",
  );
  const submittedAt = new Date().toLocaleString("en-PK", {
    timeZone: "Asia/Karachi",
    dateStyle: "full",
    timeStyle: "short",
  });

  // ── WhatsApp message text ────────────────────────────────
  const waText = encodeURIComponent(
    `🚀 *New RapidByt Lead*\n\n` +
      `👤 *Name:* ${name.trim()}\n` +
      `📧 *Email:* ${email.trim()}\n` +
      `🌐 *Website:* ${website.trim()}\n` +
      `🛠️ *Service:* ${serviceLabel}\n` +
      `💬 *Message:* ${message?.trim() || "No message provided"}\n\n` +
      `📅 ${submittedAt}`,
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  // ── Notification email to RapidByt ──────────────────────
  const notifyHtml = `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;border-radius:16px">
      <div style="background:linear-gradient(135deg,#0ea5e9,#6366f1);padding:24px 32px;border-radius:12px;margin-bottom:24px">
        <h1 style="color:#fff;margin:0;font-size:22px;font-weight:900">🚀 New Audit Request</h1>
        <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px">via RapidByt website contact form</p>
      </div>

      <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
        <tr style="border-bottom:1px solid #f1f5f9">
          <td style="padding:14px 20px;font-size:13px;font-weight:700;color:#64748b;width:140px">Full Name</td>
          <td style="padding:14px 20px;font-size:14px;color:#0f172a;font-weight:600">${safeName}</td>
        </tr>
        <tr style="border-bottom:1px solid #f1f5f9">
          <td style="padding:14px 20px;font-size:13px;font-weight:700;color:#64748b">Email</td>
          <td style="padding:14px 20px;font-size:14px"><a href="mailto:${safeEmail}" style="color:#0ea5e9">${safeEmail}</a></td>
        </tr>
        <tr style="border-bottom:1px solid #f1f5f9">
          <td style="padding:14px 20px;font-size:13px;font-weight:700;color:#64748b">Website</td>
          <td style="padding:14px 20px;font-size:14px"><a href="${safeWebsite}" style="color:#0ea5e9">${safeWebsite}</a></td>
        </tr>
        <tr style="border-bottom:1px solid #f1f5f9">
          <td style="padding:14px 20px;font-size:13px;font-weight:700;color:#64748b">Service</td>
          <td style="padding:14px 20px;font-size:14px;color:#0f172a">${serviceLabel}</td>
        </tr>
        <tr>
          <td style="padding:14px 20px;font-size:13px;font-weight:700;color:#64748b;vertical-align:top">Message</td>
          <td style="padding:14px 20px;font-size:14px;color:#334155;line-height:1.6">${safeMessage ?? '<em style="color:#94a3b8">No message provided</em>'}</td>
        </tr>
      </table>

      <div style="margin-top:20px;padding:16px 20px;background:#fff;border-radius:12px;border:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:12px;color:#94a3b8">Submitted: ${submittedAt} (PKT)</span>
        <a href="${whatsappUrl}" style="background:#22c55e;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:700">
          💬 Reply on WhatsApp
        </a>
      </div>

      <p style="font-size:11px;color:#94a3b8;text-align:center;margin-top:24px">
        RapidByt · Automated notification · Do not reply to this email
      </p>
    </div>
  `;

  // ── Auto-reply email to the lead ─────────────────────────
  const autoReplyHtml = `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;border-radius:16px">
      <div style="background:linear-gradient(135deg,#0ea5e9,#6366f1);padding:24px 32px;border-radius:12px;margin-bottom:24px">
        <h1 style="color:#fff;margin:0;font-size:22px;font-weight:900">✅ We've got your request!</h1>
        <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px">RapidByt — Web Performance &amp; Software Solutions</p>
      </div>

      <div style="background:#fff;border-radius:12px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
        <p style="font-size:16px;color:#0f172a;margin:0 0 16px">Hey ${safeName},</p>
        <p style="font-size:15px;color:#334155;line-height:1.7;margin:0 0 16px">
          Thanks for reaching out! We've received your audit request for <strong style="color:#0ea5e9">${safeWebsite}</strong> and our team will have a full analysis delivered to your inbox within <strong>24 hours</strong>.
        </p>
        <p style="font-size:15px;color:#334155;line-height:1.7;margin:0 0 24px">
          In the meantime, if you have urgent questions, feel free to message us directly on WhatsApp — we're usually pretty quick.
        </p>

        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:20px;margin-bottom:24px">
          <p style="font-size:13px;font-weight:700;color:#0369a1;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.05em">Your request summary</p>
          <table style="width:100%">
            <tr><td style="font-size:13px;color:#64748b;padding:4px 0;width:100px">Website</td><td style="font-size:13px;color:#0f172a;font-weight:600">${safeWebsite}</td></tr>
            <tr><td style="font-size:13px;color:#64748b;padding:4px 0">Service</td><td style="font-size:13px;color:#0f172a;font-weight:600">${serviceLabel}</td></tr>
          </table>
        </div>

        <a href="https://wa.me/${WHATSAPP_NUMBER}" style="display:inline-block;background:#22c55e;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700;margin-bottom:8px">
          💬 Chat on WhatsApp
        </a>
      </div>

      <div style="text-align:center;margin-top:24px">
        <p style="font-size:12px;color:#94a3b8">© ${new Date().getFullYear()} RapidByt Solutions · <a href="mailto:${NOTIFY_EMAIL}" style="color:#0ea5e9">${NOTIFY_EMAIL}</a></p>
      </div>
    </div>
  `;

  // ── Send emails ──────────────────────────────────────────
  let autoReplySent = false;

  if (!emailEnabled) {
    console.warn("[contact] Email service not configured (NUXT_RESEND_API_KEY missing).");
    console.info("[contact] Lead received:", {
      name: name.trim(),
      email: email.trim(),
      website: website.trim(),
      service: serviceLabel,
      message: message?.trim(),
    });
  } else {
    const resend = new Resend(resendApiKey);

    const [notifyResult, autoReplyResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_ADDRESS,
        to: [NOTIFY_EMAIL],
        subject: `🚀 New Audit Request from ${name.trim()} — ${website.trim()}`,
        html: notifyHtml,
        replyTo: email.trim(),
      }),
      resend.emails.send({
        from: FROM_ADDRESS,
        to: [email.trim()],
        subject: `We've received your audit request — RapidByt`,
        html: autoReplyHtml,
      }),
    ]);

    if (notifyResult.status === "rejected") {
      console.error("[contact] Notification email failed:", JSON.stringify(notifyResult.reason));
    } else {
      console.info("[contact] Notification email sent:", notifyResult.value?.data?.id);
    }

    if (autoReplyResult.status === "rejected") {
      console.error("[contact] Auto-reply email failed:", JSON.stringify(autoReplyResult.reason));
    } else {
      console.info("[contact] Auto-reply email sent:", autoReplyResult.value?.data?.id);
    }

    autoReplySent = notifyResult.status === "fulfilled";
  }

  return {
    success: true,
    whatsappUrl,
    autoReplySent,
    emailEnabled,
  };
});
