---
title: "Core Web Vitals in 2026: The Complete Fix Guide"
description: "LCP, CLS, INP — what they mean, how to measure them, and exactly how to fix each one. A practical guide with real code examples."
date: 2026-09-01
readTime: 13
category: "SEO"
author: "RapidByt Team"
tags: ["Core Web Vitals", "LCP", "CLS", "INP", "SEO", "Google ranking"]
image: "/blog/core-web-vitals-guide-2026.jpg"
---

Google's Core Web Vitals have been a ranking factor since 2021. In March 2024, INP replaced FID as the third metric — a significant change that caught a lot of developers off guard. And in 2026, the competition keeps intensifying as more sites optimize, meaning if you haven't addressed your vitals, you're actively falling behind sites that have. Poor Core Web Vitals don't just hurt your rankings — they directly [impact your revenue](/blog/why-page-speed-matters-for-revenue) through lost conversions.

The frustrating thing about Core Web Vitals is that most guides give vague advice like "optimize your images" and "reduce JavaScript." That's technically correct but not very useful if you're staring at a score of 34 and don't know where to start.

This guide is different. We cover all three vitals with concrete, copy-paste fixes — not general suggestions.

## The Three Core Web Vitals

| Metric  | What It Measures    | Good Score | Poor Score |
| ------- | ------------------- | ---------- | ---------- |
| **LCP** | Loading performance | ≤ 2.5s     | > 4s       |
| **CLS** | Visual stability    | ≤ 0.1      | > 0.25     |
| **INP** | Interactivity       | ≤ 200ms    | > 500ms    |

All three are measured from two data sources: real user data from the Chrome User Experience Report (CrUX), and lab data from Lighthouse. Google weights the real-world field data more heavily for rankings — so a Lighthouse score of 90 in a lab test doesn't guarantee a passing grade if real users on slow connections are having a different experience.

This is why it's worth checking your scores in Google Search Console, not just running a one-time PageSpeed Insights test.

---

## LCP: Largest Contentful Paint

LCP measures the time from when a user starts loading a page to when the largest visible content element finishes rendering. That element is usually a hero image, a large heading, or a video poster frame.

A good LCP is under 2.5 seconds. Anything above 4 seconds is considered poor and will drag your rankings down. And as we covered in our [page speed and revenue guide](/blog/why-page-speed-matters-for-revenue), every second of delay costs real conversions.

### Why LCP Is Often Worse Than You Think

The problem with LCP is that it looks fine on your laptop with a fast connection, but real users on mobile with 4G or slower see something completely different. The Chrome User Experience Report measures 75th percentile performance — meaning 25% of your real visitors have an even worse experience than what Google reports.

### Common LCP Culprits

Before fixing anything, identify what your LCP element actually is. Open Chrome DevTools, go to the Performance tab, record a page load, and look for the "LCP" marker in the timeline. Then check what element it's pointing to.

The most common LCP elements:

- Hero images (the #1 cause of poor LCP)
- Large text headings above the fold
- Video poster frames
- Large background images loaded via CSS

### Fix #1: Preload the LCP Image

This is the single highest-impact fix for most sites. The browser normally discovers your hero image only after parsing HTML and CSS — which is too late. A preload hint tells the browser to fetch the image immediately.

```html
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />
```

Add this to your `<head>` before any stylesheets.

### Fix #2: Use fetchpriority="high" on the Hero Image

```html
<img src="/hero.webp" fetchpriority="high" alt="Hero image" width="1200" height="600" />
```

This signals to the browser that this image is critical and should be prioritized over other resource downloads.

### Fix #3: Stop Lazy Loading Above-the-Fold Images

Lazy loading is a great performance technique — but only for images that are below the fold. Applying it to your hero image is a common mistake that directly causes poor LCP.

```html
<!-- Wrong — lazy loading delays the LCP element -->
<img src="/hero.webp" loading="lazy" />

<!-- Right — no loading attribute for above-fold images -->
<img src="/hero.webp" fetchpriority="high" />

<!-- Correct use of lazy loading — below the fold -->
<img src="/product-card.webp" loading="lazy" />
```

### Fix #4: Reduce Server Response Time (TTFB)

If your Time to First Byte (TTFB) is over 800ms, frontend optimizations alone won't get you a passing LCP. Your server is slow to respond before the browser can even start loading anything.

Solutions depending on your setup:

- **WordPress on shared hosting:** Move to a VPS or consider Cloudflare's full proxy with caching
- **Static site:** Deploy to edge hosting like Cloudflare Pages or Vercel Edge
- **Dynamic site:** Implement server-side caching (Redis, Varnish) or use a CDN with edge rendering

### Fix #5: Convert and Compress Images Properly

If your hero image is a 3MB JPEG, no amount of other optimization will save your LCP. Convert to WebP (25–35% smaller than JPEG at equivalent quality) and compress aggressively.

A well-optimized hero image for most websites should be under 200KB. On mobile viewports it should be even smaller — use responsive images with `srcset` to serve the right size for the device.

```html
<img
  src="/hero-800.webp"
  srcset="/hero-400.webp 400w, /hero-800.webp 800w, /hero-1200.webp 1200w"
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  fetchpriority="high"
  alt="Hero"
/>
```

---

## CLS: Cumulative Layout Shift

CLS measures unexpected visual shifts — content that moves after the page has started loading. A score of 0.1 or below is considered good. Above 0.25 is poor.

Layout shifts are one of the most frustrating user experiences on the web. You're reading an article, an ad loads above the text, and everything jumps down. You tap a button and the page shifts right as your finger lands, so you accidentally click something else.

### The Root Causes of CLS

1. **Images without explicit dimensions** — the browser doesn't know how much space to reserve
2. **Ads and embeds without reserved space** — the ad loads and pushes content down
3. **Dynamically injected content** — a banner or notification appears above existing content
4. **Web fonts causing FOUT** — text renders in a fallback font, then jumps when the custom font loads
5. **Animations that trigger layout** — CSS properties like `top`, `left`, `margin`, `width` that cause reflow

### Fix #1: Always Set Width and Height on Images

The most common cause of CLS across the web. Without dimensions, the browser allocates no space for the image and shifts content when it arrives.

```html
<!-- Bad — browser doesn't reserve space -->
<img src="/product.jpg" />

<!-- Good — browser reserves exact space -->
<img src="/product.jpg" width="800" height="600" />
```

Even if you're styling images with CSS, set the HTML attributes. They establish aspect ratio so the browser can reserve space even before the image loads.

If you use responsive images with CSS:

```css
img {
  aspect-ratio: 4 / 3;
  width: 100%;
  height: auto;
}
```

### Fix #2: Reserve Space for Ads and Embeds

Ad slots are notorious CLS contributors because the ad loads asynchronously after the page content. Reserve minimum space with CSS:

```css
.ad-slot {
  min-height: 250px; /* Standard ad height */
  min-width: 300px;
}
```

Same principle applies to YouTube embeds, maps, and any other iframe-based content.

### Fix #3: Fix Web Font Loading

Web fonts cause CLS when the browser switches from a fallback font to the custom font after it loads — known as Flash of Unstyled Text (FOUT). The text shifts because the two fonts have different metrics.

```css
@font-face {
  font-family: "MyFont";
  src: url("/fonts/myfont.woff2") format("woff2");
  font-display: optional;
}
```

`font-display: optional` is the most aggressive approach — it only uses the custom font if it's already cached, completely eliminating layout shift. `font-display: swap` shows the fallback first and swaps when the custom font loads (less CLS than default, but some shift still occurs).

Also use `size-adjust`, `ascent-override`, and `descent-override` CSS descriptors to make your fallback font metrics closely match your custom font — reducing the visual jump when the swap happens.

### Fix #4: Use CSS Transforms for Animations

If you're animating elements, stick to `transform` and `opacity`. Properties like `margin`, `top`, `left`, `width`, and `height` trigger layout reflow and cause CLS.

```css
/* Bad — triggers layout, causes CLS */
.element {
  transition: margin-top 0.3s ease;
}

/* Good — GPU composited, no layout change */
.element {
  transition: transform 0.3s ease;
}
```

---

## INP: Interaction to Next Paint

INP replaced FID (First Input Delay) in March 2024. The key difference: FID only measured the first interaction on a page. INP measures the worst interaction across the entire visit. This made it a much stricter — and more accurate — measure of real interactivity.

An INP under 200ms is good. Above 500ms is poor and will affect rankings.

### Why INP Problems Are Hard to Diagnose

Unlike LCP and CLS which have clear visual causes, INP problems are invisible. They happen in JavaScript. A click feels slow because some script is running a long task on the main thread, blocking the browser from processing your input.

### Fix #1: Find Long Tasks First

Open Chrome DevTools → Performance tab → record yourself clicking around the page → look for red "Long Task" warnings in the Main thread track. Any task over 50ms is a "long task" and a potential INP problem.

### Fix #2: Break Up Long Tasks with scheduler.yield()

Instead of running a large operation in one go, break it into chunks and yield to the browser between each chunk. This gives the browser opportunities to handle pending user input.

```js
async function processLargeArray(items) {
  for (const item of items) {
    processItem(item);

    // Yield after each item — lets browser handle user input
    if (typeof scheduler !== "undefined" && scheduler.yield) {
      await scheduler.yield();
    }
  }
}
```

### Fix #3: Move Heavy Work to Web Workers

Web Workers run JavaScript on a background thread, completely separate from the main thread. Use them for computationally heavy tasks like data processing, image manipulation, or search indexing.

```js
// main.js
const worker = new Worker("/workers/heavy-compute.js");
worker.postMessage({ data: largeDataset });
worker.onmessage = (e) => {
  updateUI(e.data.result);
};

// workers/heavy-compute.js
self.onmessage = (e) => {
  const result = heavyComputation(e.data.data);
  self.postMessage({ result });
};
```

The main thread stays free and responsive while the worker handles the heavy lifting.

### Fix #4: Audit and Remove Unnecessary Third-Party Scripts

Every third-party script — analytics, chat widgets, marketing pixels, A/B testing tools — adds JavaScript that runs on your main thread. They compete with your own code for execution time.

Audit your scripts ruthlessly. Ask: is this directly contributing to revenue? If not, consider removing it or loading it conditionally only on pages where it's needed.

---

## How to Measure Your Vitals

### Quick Lab Test

Use [PageSpeed Insights](https://pagespeed.web.dev) for a fast Lighthouse-based result, or check our roundup of [free website speed check tools](/blog/free-website-speed-check-tools). Or use our [free diagnosis tool](/diagnose) — it runs the same tests and emails you the results with a prioritized fix list. For a broader view of your site's ranking health, see the [free website speed check tools](/blog/free-website-speed-check-tools) that work alongside PageSpeed Insights.

### Real User Data (Most Accurate)

```js
// Install the web-vitals library
import { onLCP, onCLS, onINP } from "web-vitals";

function sendToAnalytics({ name, value, id }) {
  // Send to your analytics service
  gtag("event", name, { value: Math.round(value), event_label: id });
}

onLCP(sendToAnalytics);
onCLS(sendToAnalytics);
onINP(sendToAnalytics);
```

This gives you real measurements from your actual users on their real devices and connections.

### Google Search Console

The Core Web Vitals report in Search Console shows field data grouped by "Good," "Needs Improvement," and "Poor" — and breaks it down by page. This is the data Google actually uses for ranking. Check it monthly. For a complete picture of everything affecting your rankings, the [technical SEO checklist](/blog/technical-seo-checklist-2026) covers all the signals Google evaluates beyond just Core Web Vitals.

---

## The Order to Fix Them

If you're starting from scratch, prioritize in this order. For a broader view of all technical fixes beyond just vitals, see our [technical SEO checklist](/blog/technical-seo-checklist-2026).

1. **LCP first** — it's the most impactful for rankings and has the most actionable fixes
2. **CLS second** — image dimensions and font loading are quick wins
3. **INP third** — requires profiling and JavaScript work, takes more time

The most common quick wins that fix multiple vitals at once: add explicit image dimensions (fixes CLS), convert images to WebP and add preload for hero (fixes LCP), and enable compression + proper caching (helps LCP).

---

## Need Help Fixing Your Vitals?

Core Web Vitals fixes require both frontend expertise and infrastructure changes. If you want an expert to handle it, our [performance optimization service](/services#speed) covers the full implementation — from image pipelines to edge caching to JavaScript refactoring.

[Run a free site diagnosis first](/diagnose) to see exactly where you stand — then [get in touch](/contact) if you want us to fix it.
