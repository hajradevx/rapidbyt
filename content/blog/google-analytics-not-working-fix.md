---
title: "Google Analytics Showing No Data or Wrong Numbers — Complete Fix Guide"
description: "GA4 showing zero users, inflated traffic from bots, missing conversions, or data that doesn't match reality. Here's how to diagnose and fix every common Google Analytics problem."
date: 2026-11-03
readTime: 16
category: "Business"
author: "RapidByt Team"
tags:
  ["Google Analytics", "GA4", "analytics not working", "tracking", "conversions", "data accuracy"]
image: "/blog/google-analytics-not-working.svg"
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

## GA4 Debug Mode

Debug mode is invaluable for verifying event tracking without waiting 24 hours for data to appear in standard reports.

**Enable debug mode:**

```javascript
// Enable debug mode in GA4 — events appear in DebugView immediately
gtag("config", "G-XXXXXXXXXX", {
  debug_mode: true,
});
```

Or use the GA4 DebugView Chrome extension to automatically set debug mode on your current device.

**Using DebugView:**

1. Open GA4 → Admin → DebugView
2. Browse your site on the device where debug mode is active
3. Watch events appear in real time as they fire
4. Click each event to see its parameters
5. Verify the event name, parameters, and values are exactly right

DebugView shows events within seconds — far faster than waiting for Realtime (30 seconds) or standard reports (24+ hours).

**Important:** Only enable debug mode on your test device. Debug events are excluded from standard reports, so they won't inflate your real data.

---

## GA4 Ecommerce Tracking for Pakistani Payment Gateways

Standard GA4 ecommerce tracking works with WooCommerce and Shopify, but JazzCash and EasyPaisa require custom implementation because they redirect to external payment pages and back.

### The Core Problem

When a customer clicks "Pay with JazzCash," they leave your site, complete payment on JazzCash's portal, then return to your order confirmation page. GA4 starts a new session when they return, and the original ecommerce data (product, value, order ID) is lost.

### Solution: Pass Order Data to Confirmation Page

```javascript
// On your checkout page — store order data before redirect
function initiateJazzCashPayment(orderData) {
  // Store in sessionStorage before leaving
  sessionStorage.setItem(
    "pending_order",
    JSON.stringify({
      transaction_id: orderData.orderId,
      value: orderData.total,
      currency: "PKR",
      items: orderData.items,
    }),
  );

  // Redirect to JazzCash
  window.location.href = orderData.jazzcashUrl;
}

// On your order confirmation page — fire purchase event
document.addEventListener("DOMContentLoaded", () => {
  const pendingOrder = sessionStorage.getItem("pending_order");
  if (pendingOrder) {
    const order = JSON.parse(pendingOrder);
    gtag("event", "purchase", {
      transaction_id: order.transaction_id,
      value: order.value,
      currency: "PKR",
      items: order.items,
    });
    sessionStorage.removeItem("pending_order");
  }
});
```

### EasyPaisa-Specific Setup

EasyPaisa mobile accounts (the most common payment method in Pakistan) require the same approach. The redirect URL EasyPaisa returns users to should be your order success page, which fires the purchase event:

```javascript
// order-success.js — fires on your thank-you page
// GA4 purchase event for EasyPaisa/JazzCash completions
window.addEventListener("load", () => {
  // Get order data from URL params or server-rendered data
  const orderData = window.__ORDER_DATA__; // Set by your server-side template

  if (orderData && !sessionStorage.getItem("purchase_tracked_" + orderData.id)) {
    gtag("event", "purchase", {
      transaction_id: String(orderData.id),
      affiliation: "Online Store",
      value: parseFloat(orderData.total),
      tax: parseFloat(orderData.tax),
      currency: "PKR",
      payment_method: orderData.paymentMethod, // 'jazzcash' or 'easypaisa'
      items: orderData.items.map((item) => ({
        item_id: String(item.id),
        item_name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
      })),
    });
    // Prevent double-firing on page refresh
    sessionStorage.setItem("purchase_tracked_" + orderData.id, "1");
  }
});
```

---

## Custom Events for Contact Form Submissions

Tracking contact form submissions as conversions is one of the most valuable GA4 setups for Pakistani service businesses. Here's the complete step-by-step:

**Step 1: Add the event to your form handler**

```javascript
// In your contact form JavaScript
document.getElementById("contact-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      // Fire GA4 event on successful submission
      gtag("event", "contact_form_submit", {
        event_category: "lead",
        event_label: "main_contact_form",
        form_location: window.location.pathname,
        // Optional: track which service they're interested in
        service_interest: formData.get("service") || "general",
      });

      // Show success message
      showSuccessMessage();
    }
  } catch (err) {
    console.error("Form error:", err);
  }
});
```

**Step 2: Mark it as a conversion in GA4**

1. Wait for the event to fire at least once (check DebugView or Realtime)
2. GA4 → Admin → Conversions → New conversion event
3. Enter the event name: `contact_form_submit`
4. Save

**Step 3: Set up a conversion funnel to track drop-offs**

Go to GA4 → Explore → Funnel Exploration → create a new funnel:

- Step 1: Page view on `/contact`
- Step 2: Event: `contact_form_submit`

This shows what % of visitors who reach your contact page actually submit the form — and you can add intermediate steps to see where people abandon.

---

## Cross-Domain Tracking for Separate Checkout Pages

If your main site is `yoursite.com` and your checkout runs on a subdomain like `store.yoursite.com` or an entirely different domain, you need cross-domain tracking to maintain session continuity.

```javascript
// Configure cross-domain measurement
gtag("config", "G-XXXXXXXXXX", {
  linker: {
    domains: ["yoursite.com", "store.yoursite.com", "checkout.yoursite.com"],
    accept_incoming: true,
  },
});
```

GA4 automatically appends a `_gl` parameter to links between your listed domains, which carries the session data across the domain boundary.

**Verify it's working:**

1. Visit your main site
2. Click a link to your checkout domain
3. In the checkout URL, you should see `?_gl=...` in the URL
4. In GA4 Realtime, your session should show as one continuous session, not as a new session from a referral

---

## Looker Studio Dashboard Setup

GA4's native reports are powerful but fragmented. Looker Studio (free) lets you build custom dashboards that show exactly the metrics your business cares about.

**Create your first Looker Studio dashboard:**

1. Go to [lookerstudio.google.com](https://lookerstudio.google.com)
2. Click "Create" → "Report"
3. Add data source → Google Analytics 4
4. Select your property

**Recommended metrics to display for a Pakistani business website:**

| Widget      | Metric                                  | Why                        |
| ----------- | --------------------------------------- | -------------------------- |
| Scorecard   | Users (last 30 days vs previous period) | Trend at a glance          |
| Scorecard   | Conversions (contact_form_submit)       | Leads generated            |
| Time series | Sessions by day                         | Spot spikes and drops      |
| Table       | Sessions + Conversions by Channel       | Which channels drive leads |
| Bar chart   | Top 10 landing pages by sessions        | Content performance        |
| Scorecard   | Average engagement time                 | Content quality signal     |
| Table       | Sessions by city                        | Geographic breakdown       |
| Pie chart   | Sessions by device (mobile/desktop)     | Optimization priority      |

**Share the dashboard with stakeholders:** Looker Studio reports are shareable by URL and update automatically with live GA4 data — no manual exporting to Excel needed.

---

## Custom Dimensions for User Properties

Custom dimensions let you segment your analytics data by attributes specific to your business — useful for Pakistani businesses that need to analyze data by city, industry, or customer type.

**Setting up a custom dimension:**

```javascript
// Set user properties (persist across sessions)
gtag("set", "user_properties", {
  user_type: "returning_customer", // 'new' or 'returning_customer'
  city: "Karachi", // User's city if known
  business_size: "sme", // 'freelancer', 'sme', 'enterprise'
  preferred_language: "urdu", // Language preference
});

// Or set per-event properties
gtag("event", "page_view", {
  content_type: "blog_post",
  author: "rapidbyt_team",
  post_category: "performance",
});
```

**Register custom dimensions in GA4 Admin:**

1. GA4 → Admin → Custom Definitions → Custom Dimensions
2. Click "Create custom dimension"
3. Dimension name: e.g., "User City"
4. Scope: User (for user properties) or Event (for event parameters)
5. User property/parameter: match exactly what you pass in your gtag() call

Once registered, custom dimensions appear in your GA4 reports and Looker Studio as filterable segments.

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
- [ ] Debug mode tested on key events
- [ ] JazzCash/EasyPaisa purchase events firing on confirmation page
- [ ] Custom dimensions registered for business-specific segments

---

## Frequently Asked Questions

**Q: GA4 shows traffic but Google Ads shows different conversion numbers. Which is right?**

Both can be right — they measure differently. GA4 uses last-click attribution by default, while Google Ads uses a different attribution model. Additionally, GA4 conversion data excludes users who have ad blocking, while Google Ads measures conversions from the ad click directly. Check your attribution model settings in GA4 → Admin → Attribution Settings and compare with your Google Ads attribution model for apples-to-apples comparison.

**Q: My GA4 shows users from countries I've never marketed to. Is this fake traffic?**

Often yes. Bots and scrapers generate fake geographic data. Check if these sessions have 0-second engagement time and a 100% bounce rate in GA4 → Explore → create a free-form exploration filtering by country. Real users have nonzero engagement times. Apply a bot filtering segment to clean up your reports.

**Q: How do I track WhatsApp button clicks in GA4?**

Add an onclick event to your WhatsApp link:

```html
<a
  href="https://wa.me/923001234567"
  onclick="gtag('event', 'whatsapp_click', {event_category: 'contact', event_label: 'header_button'})"
>
  WhatsApp Us
</a>
```

Mark `whatsapp_click` as a conversion in GA4 Admin. This is often the most valuable conversion event for Pakistani service businesses.

**Q: GA4 shows my site has a 90%+ bounce rate. Is that accurate?**

In GA4, "bounce" means a session with only one event — a single page view with no interaction. This is more strict than Universal Analytics. A user who reads your entire blog post and leaves after 5 minutes is technically a "bounce" in GA4 unless they triggered another event (scroll, click, etc.). Enable enhanced measurement (GA4 → Data Streams → your stream → Enhanced Measurement → toggle all) — this automatically tracks scrolls and outbound clicks, which reduces your "bounce" rate to a more realistic number.

**Q: I'm using a cookie consent banner. Should I delay GA4 loading until consent is given?**

Yes, if you're targeting EU visitors or want to comply with GDPR. For Pakistan-only businesses, this is less critical from a legal perspective, but still good practice. Use Google's Consent Mode v2:

```javascript
gtag("consent", "default", {
  analytics_storage: "denied", // until user consents
});
// After user accepts:
gtag("consent", "update", {
  analytics_storage: "granted",
});
```

**Q: How long does it take for GA4 to show data after setup?**

Realtime shows data within 30 seconds. Standard reports have a 24–48 hour delay. Audience data used for Google Ads remarketing can take 24–72 hours. The Data API (used by Looker Studio) reflects data from the previous day. If you need to verify your setup today, use Realtime and DebugView.

**Q: Can I see which specific pages are converting visitors into leads?**

Yes — use GA4 Explore → Funnel Exploration or Path Exploration. For direct page-to-conversion data: GA4 → Reports → Engagement → Pages and Screens → set the secondary dimension to "Conversions" or click through to see conversions per page. This shows which pages are generating the most form submissions — critical data for deciding where to invest content improvements.

---

**The one report to check every week:**

If you're overwhelmed by GA4's complexity, start with one report:

**Reports → Acquisition → Traffic acquisition**

This tells you:

- How many users came from each channel (organic, direct, social, email)
- Which channels convert best
- Whether your SEO and content work is growing organic traffic month over month. The [technical SEO checklist](/blog/technical-seo-checklist-2026) covers what to fix on the SEO side if organic traffic is flat or declining.

Everything else is secondary until you understand your traffic sources.

---

Want a GA4 audit to verify your tracking is accurate? [Get in touch](/contact) — bad analytics data leads to bad marketing decisions, and fixing the tracking is usually a 2–3 hour job. Once your analytics is working, pair it with [Google Search Console](/blog/google-search-console-setup-beginners) to get the full picture of how visitors find and use your site.
