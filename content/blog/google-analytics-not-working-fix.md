---
title: "Google Analytics Showing No Data or Wrong Numbers — Complete Fix Guide"
description: "GA4 showing zero users, inflated traffic from bots, missing conversions, or data that doesn't match reality. Here's how to diagnose and fix every common Google Analytics problem."
date: 2026-11-03
readTime: 8
category: "Business"
author: "RapidByt Team"
tags:
  ["Google Analytics", "GA4", "analytics not working", "tracking", "conversions", "data accuracy"]
image: "/blog/google-analytics-not-working.jpg"
---

You set up Google Analytics. The dashboard shows numbers — but something looks off. Zero visitors when you know people are visiting. Traffic that mysteriously doubles. Conversions that never fire. Referral data that says "(not set)" for everything.

Bad analytics data is worse than no analytics data — it leads to bad decisions. Here's how to fix the most common GA4 problems.

---

## First: Verify the Tag Is Actually Installed

Before diagnosing data problems, confirm the tracking code is on your site.

**Method 1: Google Tag Assistant**

Install the [Tag Assistant Chrome extension](https://tagassistant.google.com) from Google → navigate to your site → click the extension. It shows whether GA4 is detected and whether it's firing correctly.

**Method 2: GA4 Real-Time Report**

1. Open your GA4 property
2. Go to Reports → Realtime
3. Open your site in a new browser tab
4. Your visit should appear in Realtime within 30 seconds

If nothing appears in Realtime: your tag is not firing on your site.

**Method 3: Browser DevTools**

Open Chrome DevTools → Network tab → type `collect` in the filter box → reload your page. You should see requests to `google-analytics.com/g/collect`. If you see none, the tag isn't installed.

---

## Problem 1: No Data — Tag Not Installing Correctly

**Cause A: Tag is only on some pages**

If GA4 fires on some pages but not others, your data is incomplete. Check that the tag (or GTM snippet) is in the `<head>` of every page template — not just the homepage.

In Nuxt:

```typescript
// nuxt.config.ts — add GA4 to every page's head
app: {
  head: {
    script: [
      {
        src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX',
        async: true,
      },
      {
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `,
      },
    ],
  },
},
```

**Cause B: Tag placed in wrong location**

GA4 should be as high in `<head>` as possible — ideally the first script. If it's placed just before `</body>`, it may miss users who leave quickly.

**Cause C: Content Security Policy blocking GA4**

If your site has a CSP header, it might block Google Analytics requests.

```
# Add Google Analytics domains to your CSP
Content-Security-Policy:
  script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com;
  img-src 'self' https://www.google-analytics.com;
  connect-src 'self' https://www.google-analytics.com;
```

---

## Problem 2: Traffic Numbers Look Too High (Bot Traffic)

Your Analytics shows 10,000 sessions but you can see from your hosting that only 500 real people visited.

**Cause:** Bots and spam crawlers are sending fake traffic to inflate your numbers.

**Fix: Enable IP filtering and bot filtering**

In GA4:

1. Admin → Data Streams → your stream → Configure tag settings
2. Enable "Enable Google signals"
3. Admin → Data Settings → Data Filters → create a filter for internal traffic (your own IP)

**Filter your own visits:**

```javascript
// Add this before the gtag config to exclude your own IP
// (Use a custom dimension or internal traffic filter in GA4 Admin instead)

// Or use a cookie approach for development
if (document.cookie.includes("ga_exclude=1")) {
  window["ga-disable-G-XXXXXXXXXX"] = true;
}
```

Better approach in GA4 Admin:

- Admin → Data Streams → your stream → Configure tag settings → Show more → Provide your own user ID
- Admin → Data Filters → create "Internal Traffic" filter → define your IP → activate

**Filter referral spam:**

Go to Admin → Data Settings → Data Filters and add filters for known spam referrers. GA4 filters most automatically, but not all.

---

## Problem 3: Conversions Not Tracking

You set up a conversion event but it never fires. Your conversion count is permanently zero.

**Step 1: Check the event name exactly**

GA4 is case-sensitive. `form_submit` and `Form_Submit` are different events.

In GA4 → Reports → Realtime → complete your conversion action → watch for the event in the "Event count by event name" card. If you see the event but it's not marked as a conversion, mark it.

**Step 2: Verify the event fires in Tag Assistant**

With Tag Assistant active, complete the conversion action (form submission, button click, etc.). Tag Assistant shows every event that fired in sequence. If your conversion event isn't there, the implementation is wrong.

**Step 3: Check for common conversion setup mistakes**

```javascript
// Wrong — event name has a typo
gtag("event", "form_submitt");

// Wrong — firing on page load instead of form submit
document.addEventListener("DOMContentLoaded", () => {
  gtag("event", "form_submit"); // Fires on every page load, not on submit
});

// Right — fire only when form is actually submitted
document.querySelector("#contact-form").addEventListener("submit", () => {
  gtag("event", "form_submit", {
    event_category: "contact",
    event_label: "contact_page_form",
  });
});
```

**Step 4: Wait for data propagation**

GA4 conversion data can take **24–48 hours** to appear in standard reports. Use Realtime to verify it fires, then wait for standard reports to update.

---

## Problem 4: Source/Medium Showing "(not set)" or "(direct)"

You know traffic came from your Instagram post or email campaign, but Analytics shows it as Direct.

**Why this happens:**

- Links shared on WhatsApp and most messaging apps strip UTM parameters
- Redirects lose UTM parameters if not configured correctly
- HTTPS → HTTP redirect drops the referrer
- Some browsers send no referrer for privacy reasons

**Fix: Always use UTM parameters on links you control**

```
https://yoursite.com/blog/post?utm_source=whatsapp&utm_medium=social&utm_campaign=october-newsletter
```

UTM parameter guide:

- `utm_source` — where traffic comes from (whatsapp, instagram, newsletter)
- `utm_medium` — type of channel (social, email, cpc, sms)
- `utm_campaign` — which specific campaign (october-newsletter, black-friday)
- `utm_content` — optional, for A/B testing different links

**Use a UTM builder:** [ga-dev-tools.web.app/campaign-url-builder](https://ga-dev-tools.web.app/campaign-url-builder)

Build a UTM for every link you share in campaigns, and train your team to do the same.

---

## Problem 5: Page Views Counting Multiple Times

A single page visit shows as 3–5 page views in GA4.

**Cause A: Tag installed twice**

Check your site source for duplicate GA4 tags — one in the theme, one in a plugin, one added manually. Two tags = double counting.

```bash
# Search your codebase for GA4 tags
grep -r "G-XXXXXXXXXX" ./
grep -r "gtag" ./ --include="*.html" --include="*.js"
```

Remove all but one installation.

**Cause B: Single-page app (SPA) not configured correctly**

In Nuxt, Next.js, or any SPA, navigating between pages doesn't reload the browser — so GA4 doesn't automatically track navigation as page views.

For Nuxt, use the official module:

```bash
npm install @nuxtjs/google-analytics
# or use @gtm-support/vue-gtm for GTM
```

Or configure it manually with a router hook:

```typescript
// plugins/analytics.client.ts
export default defineNuxtPlugin(() => {
  const router = useRouter();
  router.afterEach((to) => {
    gtag("event", "page_view", {
      page_path: to.fullPath,
      page_title: document.title,
    });
  });
});
```

---

## Problem 6: Referral Traffic Showing Wrong Source

Your own site is showing as a referrer to itself, or a payment processor (Stripe, PayPal) is showing as the traffic source for conversions.

**Cause:** Users are being sent to an external site (payment page, email service landing page) and back to yours. GA4 treats the return as a new session from the external site.

**Fix: Add referral exclusions**

GA4 Admin → Data Streams → your stream → Configure tag settings → List unwanted referrals

Add all external services that redirect back to your site:

- `stripe.com`
- `paypal.com`
- `checkout.stripe.com`
- Your own domain variants (`www.yoursite.com` if your property is `yoursite.com`)

---

## GA4 Data Quality Checklist

- [ ] Tag fires on every page (verify with Realtime)
- [ ] Tag only installed once (check for duplicates)
- [ ] Your own IP filtered from data
- [ ] UTM parameters on all campaign links
- [ ] Conversion events fire on correct action (not page load)
- [ ] SPA navigation tracked correctly
- [ ] Payment/redirect exclusions configured
- [ ] Cross-domain tracking set up if using multiple domains
- [ ] Data retention set to 14 months (Admin → Data Settings → Data Retention → 14 months)

---

## The One Report to Check Every Week

If you're overwhelmed by GA4's complexity, start with one report:

**Reports → Acquisition → Traffic acquisition**

This tells you:

- How many users came from each channel (organic, direct, social, email)
- Which channels convert best
- Whether your SEO and content work is growing organic traffic month over month

Everything else is secondary until you understand your traffic sources.

---

Want a GA4 audit to verify your tracking is accurate? [Get in touch](/contact) — bad analytics data leads to bad marketing decisions, and fixing the tracking is usually a 2–3 hour job.
