---
title: "Contact Form Submissions Not Arriving? Here's How to Fix It"
description: "Form submissions disappearing into the void is one of the most common and most damaging website problems. Every missed form is a lost lead. Here's the complete diagnostic and fix guide."
date: 2026-10-22
readTime: 16
category: "Business"
author: "RapidByt Team"
tags: ["contact form", "email deliverability", "SMTP", "spam filter", "form not working", "leads"]
image: "/blog/contact-form-not-working.svg"
---

Someone filled out your contact form. They're waiting for a reply. You never got the notification.

This is happening more often than you think — and it's completely silent. Nobody calls to tell you their form submission disappeared. They just move on to a competitor.

Here is how to diagnose and fix every common cause.

---

## First: Confirm the Problem

Before debugging, verify the form is actually failing versus you're just missing emails.

**Test it yourself:**

1. Go to your own contact form
2. Fill it out with a test message — use a subject like "TEST - please ignore"
3. Use an email address you can verify (Gmail works well)
4. Submit it
5. Wait 5 minutes

If you don't receive the notification:

- Check your spam/junk folder first
- Check your promotions folder (Gmail)
- Check any email filters you have set up

If you receive it but the client didn't receive their auto-reply — that's a separate deliverability issue (covered below).

---

## Cause 1: Emails Going to Spam

This is the most common cause. Your form is working — the emails are being sent and received, but your email client is filtering them to spam before you see them.

**Why it happens:**

- Your hosting server's IP is on a spam blacklist (very common with shared hosting)
- The email has no proper "From" domain — it's sent from a generic server address
- Missing SPF, DKIM, and DMARC DNS records
- Subject line contains spam trigger words

Spam filtering is also closely tied to how well you've implemented [website security measures](/blog/website-security-hardening-guide) — a compromised or poorly configured server gets blacklisted faster.

**Fix: Check your server's reputation**

Go to [mxtoolbox.com/blacklists](https://mxtoolbox.com/blacklists) → enter your domain or server IP → check if it's blacklisted.

If blacklisted: request delisting from each blacklist (each has its own process), and switch to a proper email sending service (see Cause 3).

**Fix: Add a Gmail filter**

As a temporary measure, add a filter in Gmail to never send emails from your domain to spam:
Settings → Filters → Create new filter → From: `@yourdomain.com` → Never send to spam.

---

## Cause 2: Wrong "From" Address

Many hosting-based form setups send emails "from" your server's generic address — something like `nobody@server123.yourhost.com`. Email providers treat these as suspicious.

The "From" address should always be from your own domain:

```
From: RapidByt Contact Form <noreply@rapidbyt.com>
```

Not:

```
From: nobody@shared-server-123.hostingcompany.com
```

**Fix:** Set the `From` header explicitly in your form handling code or configuration to use your actual domain email address.

---

## Cause 3: Using PHP mail() or Shared Hosting SMTP

The default `mail()` function in PHP sends emails directly from your server. Most email providers now block or spam-filter emails from generic hosting servers because they're heavily abused by spammers.

**Fix: Use a transactional email service**

These services are built for reliable email delivery. They handle authentication, reputation, and deliverability for you:

| Service                | Free Tier                          | Cost After Free | Best For                 |
| ---------------------- | ---------------------------------- | --------------- | ------------------------ |
| **Resend**             | 3,000 emails/month, 100/day        | From $20/mo     | Developers, API-first    |
| **SendGrid**           | 100 emails/day free forever        | From $20/mo     | High volume              |
| **Postmark**           | 100 emails/month                   | From $15/mo     | Transactional focus      |
| **Mailgun**            | 5,000 emails/month (3-month trial) | From $15/mo     | Flexible API             |
| **Brevo (Sendinblue)** | 300 emails/day                     | From $25/mo     | Also has marketing email |
| **AWS SES**            | 62,000/month (if on EC2)           | $0.10 per 1,000 | High volume, technical   |

**For Pakistani businesses:** Resend is the easiest to set up and has a generous free tier. For WooCommerce stores, Brevo integrates cleanly with WordPress plugins.

---

## SMTP Setup Guide: Multiple Providers

### Setting Up Resend

1. Create an account at [resend.com](https://resend.com)
2. Add and verify your domain (they walk you through adding DNS records)
3. Create an API key

```bash
npm install resend
```

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(data: { name: string; email: string; message: string }) {
  await resend.emails.send({
    from: "Contact Form <noreply@yourdomain.com>",
    to: "you@yourdomain.com",
    replyTo: data.email,
    subject: `New enquiry from ${data.name}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
  });
}
```

### Setting Up SendGrid

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Settings → Sender Authentication → verify your domain
3. Settings → API Keys → create key with "Mail Send" permission

```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

await sgMail.send({
  to: "you@yourdomain.com",
  from: "noreply@yourdomain.com", // Must be verified sender
  replyTo: userEmail,
  subject: `Contact form: ${subject}`,
  text: plainTextBody,
  html: htmlBody,
});
```

### Setting Up Mailgun

```bash
npm install mailgun.js form-data
```

```typescript
import Mailgun from "mailgun.js";
import FormData from "form-data";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
});

await mg.messages.create("yourdomain.com", {
  from: "Contact Form <noreply@yourdomain.com>",
  to: ["you@yourdomain.com"],
  subject: "New contact form submission",
  html: emailHtml,
  "h:Reply-To": userEmail,
});
```

### WordPress SMTP via WP Mail SMTP Plugin

For WordPress sites, you don't need to write code — install [WP Mail SMTP](https://wordpress.org/plugins/wp-mail-smtp/):

1. Install and activate
2. Go to WP Mail SMTP → Settings
3. Choose your mailer (Resend, SendGrid, Mailgun, etc.)
4. Enter your API key
5. Send a test email

WP Mail SMTP overrides `wp_mail()` so all WordPress emails (contact forms, WooCommerce orders, password resets) route through your chosen service.

---

## Cause 4: Missing or Incorrect DNS Records (SPF, DKIM, DMARC)

Even with a good email service, emails will land in spam if your domain doesn't have proper email authentication records. A misconfigured or missing [SSL certificate](/blog/ssl-certificate-errors-fix) can also trigger spam filters on some mail systems — make sure your domain is serving HTTPS correctly alongside these DNS records.

**Check your records:** Go to [mxtoolbox.com](https://mxtoolbox.com) → enter your domain → check SPF, DKIM, DMARC.

### Understanding Each Record

**SPF (Sender Policy Framework):**
An SPF record tells receiving mail servers which IP addresses and services are authorized to send email from your domain. Without it, any server can claim to send from `@yourdomain.com`.

What the record looks like in your DNS:

```
Type: TXT
Name: @ (or your domain name)
Value: v=spf1 include:_spf.resend.com ~all
```

The `~all` (soft fail) means "if the server isn't in this list, treat it with suspicion but don't outright reject." `−all` (hard fail) would reject unlisted senders. For most setups, start with `~all`.

If you use multiple sending services (e.g., Resend for contact forms AND Google Workspace for staff emails):

```
v=spf1 include:_spf.resend.com include:_spf.google.com ~all
```

**DKIM (DomainKeys Identified Mail):**
DKIM adds a cryptographic signature to each email. When receiving servers check this signature against your DNS record, they can verify the email actually came from you and wasn't tampered with in transit.

Your email service provides the exact DNS record to add — it looks like:

```
Type: TXT
Name: resend._domainkey
Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ...
```

The long string is your public key. Keep the corresponding private key secret (your email provider manages this for you).

**DMARC (Domain-based Message Authentication):**
DMARC tells receiving servers what to do with emails that fail SPF or DKIM — and importantly, it instructs them to send you reports about what's happening.

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
```

Start with `p=none` (monitoring only). After 2–4 weeks of reviewing the reports, move to:

- `p=quarantine` — suspicious emails go to spam
- `p=reject` — suspicious emails are outright rejected

**DNS record setup screenshots:** Each hosting control panel looks different, but the fields are always: Type (TXT), Name/Host, and Value. In cPanel, it's under "Zone Editor." In Cloudflare, it's the DNS tab. In Namecheap, it's "Advanced DNS."

---

## Cause 5: Form Submission Silently Failing

The form appears to submit (the page reloads or a success message shows) but nothing is actually sent or saved. This is common with JavaScript-based forms that handle errors poorly.

**How to check:**

Open Chrome DevTools → Network tab → submit the form → look at the request to your form handler. Check:

- Does it return a 200 status? Or 422/500?
- What does the response body say?

```javascript
// Your form handler should always return a clear response
// and log errors server-side

try {
  await sendEmail(formData);
  return { success: true };
} catch (error) {
  console.error("Form submission failed:", error);
  // Return an error the frontend can display
  return { success: false, error: error.message };
}
```

If the server returns an error, your frontend should show it to the user — not silently show a "success" message.

---

## Cause 6: Form Blocked by Browser Ad Blockers or Extensions

Some ad blockers block form submissions to certain endpoints, especially if your form posts to a third-party service. The form appears to work but the submission is silently dropped by the browser.

**How to check:** Test your form in an incognito window with extensions disabled. If it works there but not in your normal browser — an extension is the culprit.

This is rare but worth checking before spending hours debugging server-side code.

---

## Cause 7: Anti-Spam Protection Too Aggressive

If you use reCAPTCHA, hCaptcha, or a custom honeypot field, they might be blocking legitimate submissions — especially from users on VPNs or unusual browsers.

**Check your form's submission logs.** If you're not logging submissions to a database, start doing so.

**Fix: Log every submission to a database regardless of email success**

```typescript
// Save to DB first, send email second
// This way you never lose a submission even if email fails

await db.insert(contactSubmissions).values({
  name: body.name,
  email: body.email,
  message: body.message,
  submittedAt: new Date().toISOString(),
  emailSent: false,
});

try {
  await sendEmail(body);
  await db
    .update(contactSubmissions)
    .set({ emailSent: true })
    .where(eq(contactSubmissions.email, body.email));
} catch (err) {
  console.error("Email failed but submission saved:", err);
}
```

Now even if email delivery fails, the submission is in your database and you can review it manually.

---

## Complete Server-Side Form Validation Example

A common source of silent failures is insufficient server-side validation. Client-side validation (in JavaScript) can be bypassed — always validate on the server:

```typescript
// server/api/contact.post.ts (Nuxt server route)
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  // Honeypot field — bots fill this in, humans don't
  website: z.string().max(0, "Spam detected").optional(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate input
  const result = contactSchema.safeParse(body);
  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Validation failed",
      data: result.error.flatten(),
    });
  }

  const { name, email, phone, message } = result.data;

  // Sanitize — strip any HTML to prevent injection
  const sanitizedMessage = message.replace(/<[^>]*>/g, "");

  // Save to database first
  const submission = await db
    .insert(contactSubmissions)
    .values({
      name,
      email,
      phone: phone || null,
      message: sanitizedMessage,
      ipAddress: getRequestIP(event),
      userAgent: getRequestHeader(event, "user-agent"),
      submittedAt: new Date().toISOString(),
      emailSent: false,
    })
    .returning();

  // Send email notification
  try {
    await sendContactEmail({ name, email, message: sanitizedMessage });
    await db
      .update(contactSubmissions)
      .set({ emailSent: true })
      .where(eq(contactSubmissions.id, submission[0].id));
  } catch (emailError) {
    console.error("Email send failed — submission saved:", emailError);
    // Don't throw — submission is saved, email can be retried
  }

  return { success: true };
});
```

---

## Rate Limiting to Prevent Spam

Without rate limiting, your contact form is open to spam floods that can get your sending domain blacklisted within hours.

```typescript
// server/api/contact.post.ts — add rate limiting
import { defineEventHandler, getRequestIP, createError } from "h3";

// Simple in-memory rate limiter (use Redis for production)
const submissionCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = submissionCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    submissionCounts.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1 hour window
    return true;
  }

  if (entry.count >= 5) {
    // Max 5 submissions per hour per IP
    return false;
  }

  entry.count++;
  return true;
}

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event) || "unknown";

  if (!checkRateLimit(ip)) {
    throw createError({
      statusCode: 429,
      statusMessage: "Too many requests. Please try again later.",
    });
  }

  // ... rest of form handler
});
```

For production, replace the in-memory store with Redis using `ioredis` — the in-memory approach resets when the server restarts.

---

## JazzCash/EasyPaisa Payment Confirmation Email Issues

WooCommerce order confirmation emails frequently fail to reach customers when orders are paid via JazzCash or EasyPaisa. The root cause is usually timing — the payment gateway confirms asynchronously, but WooCommerce fires the email immediately.

**Common symptoms:**

- Order status stuck at "pending payment" even though payment went through
- Customer receives no confirmation email
- You receive the order notification but the customer doesn't

**Fix for WooCommerce:**

```php
// functions.php — manually trigger confirmation email when order moves to "processing"
add_action('woocommerce_order_status_processing', 'rapidbyt_send_customer_confirmation', 10, 2);
function rapidbyt_send_customer_confirmation($order_id, $order) {
    $mailer = WC()->mailer();
    $mails = $mailer->get_emails();
    if (!empty($mails['WC_Email_Customer_Processing_Order'])) {
        $mails['WC_Email_Customer_Processing_Order']->trigger($order_id);
    }
}

// Also handle JazzCash's IPN (Instant Payment Notification) callback
add_action('woocommerce_api_jazzcash_payment_callback', 'rapidbyt_handle_jazzcash_ipn');
function rapidbyt_handle_jazzcash_ipn() {
    // JazzCash posts payment result to your callback URL
    $pp_ResponseCode = sanitize_text_field($_POST['pp_ResponseCode'] ?? '');
    $pp_TxnRefNo = sanitize_text_field($_POST['pp_TxnRefNo'] ?? '');

    if ($pp_ResponseCode === '000') {
        // Payment successful — update order and trigger emails
        $order_id = get_order_id_from_txn_ref($pp_TxnRefNo);
        $order = wc_get_order($order_id);
        if ($order) {
            $order->payment_complete();
            // This triggers the processing email automatically
        }
    }
}
```

---

## Email Deliverability Testing Tools

Before going live with your contact form, test that emails actually reach inboxes:

| Tool                                                     | What It Tests                                  | Free?             |
| -------------------------------------------------------- | ---------------------------------------------- | ----------------- |
| [Mail Tester](https://www.mail-tester.com)               | Overall deliverability score, SPF/DKIM/content | Yes (3 tests/day) |
| [MXToolbox](https://mxtoolbox.com)                       | DNS records, blacklists, SMTP diagnostics      | Yes               |
| [GlockApps](https://glockapps.com)                       | Inbox vs spam placement at major providers     | Free trial        |
| [Postmark Spam Check](https://spamcheck.postmarkapp.com) | Spam score of your email content               | Yes               |
| [SendForensics](https://sendforensics.com)               | Deep deliverability analysis                   | Paid              |
| [Email on Acid](https://emailonacid.com)                 | Rendering across email clients                 | Paid              |

**The minimum test before launch:**

1. Send your form submission email to a Mail Tester address
2. Visit mail-tester.com and check your score
3. A score of 8+/10 means you have good deliverability
4. Below 7/10: check their specific recommendations

---

## WhatsApp Business API as a Backup Channel

Even with perfect email setup, add WhatsApp as a parallel lead capture channel. For Pakistani businesses, WhatsApp is often the preferred communication method — many potential clients will WhatsApp you before they'll fill a form.

**Simple WhatsApp button (no API needed):**

```html
<!-- Pre-filled message WhatsApp link -->
<a
  href="https://wa.me/923001234567?text=Hi%2C%20I%20found%20your%20website%20and%20would%20like%20to%20enquire%20about%20your%20services."
  target="_blank"
  class="whatsapp-button"
>
  <img src="/icons/whatsapp.svg" alt="WhatsApp" width="20" height="20" />
  Chat on WhatsApp
</a>
```

**WhatsApp Business API for automation:**

For businesses handling 50+ enquiries per month, the WhatsApp Business API allows automated responses and CRM integration. The simplest way to access it is through approved partners:

- **360dialog** — cheapest API access (€5/month + message costs)
- **Twilio** — easier setup, higher cost per message
- **WATI** — no-code setup, good for non-technical users

With the API, you can:

- Send automatic acknowledgment when someone fills your form (via webhook → WhatsApp message)
- Create a WhatsApp chatbot for first-line qualification
- Integrate with your CRM

For most Pakistani business websites, a simple pre-filled WhatsApp link on every page is sufficient and requires zero technical setup. The [landing page conversion guide](/blog/traffic-not-converting-landing-page-fixes) covers how to position the WhatsApp button for maximum visibility.

---

## The Complete Fix Checklist

- [ ] Test the form yourself and check spam folder
- [ ] Switch from `mail()` / basic SMTP to Resend, SendGrid, or Postmark
- [ ] Set the `From` address to your own domain
- [ ] Add SPF, DKIM, and DMARC DNS records
- [ ] Check your server IP against spam blacklists
- [ ] Log all submissions to a database as a backup
- [ ] Add proper error handling — never show "success" when the request failed
- [ ] Add rate limiting to prevent spam floods
- [ ] Test email deliverability with Mail Tester
- [ ] Test with extensions disabled in an incognito window
- [ ] Set up a weekly reminder to test your own form
- [ ] Add WhatsApp button as parallel contact channel

---

## Frequently Asked Questions

**Q: My form works fine but confirmation emails to customers go to spam. Why?**

The auto-reply to customers is a separate email flow and often less trusted than the notification to you. The customer's email (e.g., their Gmail or Yahoo account) has different spam filters than your business email. Ensure your auto-reply: uses a professional "From" address, has a personalized subject line (not just "Form Submission Received"), passes SPF and DKIM, and has non-spammy content. Run the customer auto-reply template through Mail Tester to check its spam score.

**Q: I get the form emails but they show my hosting server's IP as the sender, not my domain. Is this a problem?**

Yes. If your hosting provider's IP is on any spam blacklist (very common with shared hosting), your emails will fail at some recipients' mail servers even if they look correct to you. The fix is to route through a dedicated transactional email service (Resend, SendGrid) whose IPs have strong sending reputations and are whitelisted by major email providers.

**Q: How do I know if a form submission was lost vs the customer didn't actually submit?**

Database logging is the only reliable answer. Once you log every submission server-side, you can compare your database records with your email inbox. If the database shows a submission but your inbox doesn't, the email failed. If neither has a record, the submission likely failed silently on the client side (JavaScript error, network issue, or anti-spam block).

**Q: Can I use Gmail SMTP to send form emails?**

Yes, but with limitations. Gmail SMTP allows 500 emails/day, requires app passwords if you have 2FA, and marks emails as "sent via Gmail" in some clients. For a low-volume contact form this works, but it's not the cleanest solution. Use it as a temporary fix while you set up a proper transactional email service.

**Q: What's the difference between a transactional email service and a marketing email service?**

Transactional services (Resend, Postmark, SendGrid) are optimized for one-to-one emails triggered by user actions — form submissions, order confirmations, password resets. Marketing services (Mailchimp, Brevo) are for bulk broadcasts to subscriber lists. Use transactional services for contact form notifications. Don't mix them — using a marketing email service for transactional email (or vice versa) can hurt deliverability for both.

**Q: How often should I test my contact form?**

Monthly at minimum, per the [website maintenance checklist](/blog/website-maintenance-checklist). Better practice: set a weekly calendar reminder for a 2-minute test. Many businesses discover broken forms only when they notice their lead volume has dropped — by which point weeks of potential leads have been lost.

---

## The Backup Strategy: WhatsApp as a Parallel Channel

Even with perfect email setup, we always recommend adding a WhatsApp link as a parallel conversion channel. If email fails for any reason, visitors still have a direct way to reach you.

A floating WhatsApp button with a pre-filled message takes 30 minutes to add and captures leads that email misses. See our [lead generation guide](/blog/traffic-not-converting-landing-page-fixes) for implementation. Testing your contact form monthly should also be part of your [website maintenance checklist](/blog/website-maintenance-checklist) — it's one of the quickest issues to miss and one of the most damaging.

---

If you're not sure why your form is failing, [request a free audit](/contact) — we'll diagnose your form setup and email deliverability and send you a specific fix plan within 24 hours.
