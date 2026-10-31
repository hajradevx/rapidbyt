---
title: "Why Images Look Blurry or Wrong Size on Your Website (And How to Fix It)"
description: "Blurry images, stretched photos, images that look fine on desktop but wrong on mobile — these problems destroy visual credibility. Here's every cause and fix."
date: 2026-11-06
readTime: 15
category: "Performance"
author: "RapidByt Team"
tags:
  ["images", "blurry images", "responsive images", "WebP", "srcset", "image optimization", "retina"]
image: "/blog/images-blurry-fix.svg"
---

Blurry images signal one thing to visitors: this website is unprofessional. It doesn't matter how good your copy is or how strong your offer is — if your hero image looks like it was photographed with a 2008 phone camera, first impressions are damaged before a word is read.

The causes of image quality problems are almost always technical, not creative. Your photographer delivered sharp images. Your website is degrading them. Here's how to diagnose and fix every cause.

---

## Why Images Look Blurry: The Core Concept

Images look blurry when the **displayed size is larger than the actual image resolution**. Beyond the visual problem, oversized or poorly optimized images are also the #1 cause of slow websites — as covered in our [page speed and revenue guide](/blog/why-page-speed-matters-for-revenue).

If you have an image that's 400×300 pixels and your CSS displays it at 800×600 pixels, the browser stretches it — and it looks blurry.

The opposite is also a problem: displaying a 4000×3000 pixel image at 400×300 pixels wastes bandwidth (the user downloads a 3MB image to display as a thumbnail) without any quality benefit.

**The goal:** Serve each image at exactly the resolution it will display — no smaller (blurry), no larger (wasted bandwidth).

---

## Fix 1: Serve Images at 2× the Display Size (Retina Displays)

Modern device screens — iPhone, Android flagships, MacBook Pro — have **2× pixel density** (called "Retina" or HiDPI). They pack two physical pixels into every CSS pixel.

**The consequence:** If you display an image at 400px wide on a Retina display, the screen uses 800 physical pixels to draw it. If your actual image is only 400px wide, it gets stretched across 800 physical pixels — and looks blurry.

**The fix:** Export images at **2× the CSS display size**.

- Image displayed at 400px → export at 800px wide
- Image displayed at 600px → export at 1200px wide
- Hero image displayed at 1200px → export at 2400px wide (with compression)

```html
<!-- Basic approach: always supply 2× resolution -->
<!-- Image displays at 400px, actual file is 800px wide -->
<img src="photo-800w.jpg" width="400" height="300" alt="Description" />
```

This single change eliminates most blurriness on modern phones and laptops.

---

## Fix 2: Use `srcset` for Responsive Images (The Proper Solution)

The 2× approach helps but wastes data on small screens — a phone loading a 2400px hero image to display it at 375px is downloading 10× more data than needed.

`srcset` tells the browser: "Here are multiple sizes available — pick the right one for this screen."

```html
<img
  src="photo-800w.webp"
  srcset="
    photo-400w.webp   400w,
    photo-800w.webp   800w,
    photo-1200w.webp 1200w,
    photo-1600w.webp 1600w
  "
  sizes="
    (max-width: 640px)  100vw,
    (max-width: 1024px) 50vw,
    800px
  "
  alt="Descriptive alt text"
  width="800"
  height="600"
/>
```

**How this works:**

- `srcset` lists available files and their pixel widths (`400w`, `800w` etc.)
- `sizes` tells the browser how wide the image will display at different viewport widths
- Browser picks the most appropriate file automatically — a phone gets the small file, a 4K monitor gets the large one

**Real-world savings from srcset:**

- Phone (375px screen): downloads 400w file (~30KB) instead of 1600w file (~400KB)
- Laptop (1440px): downloads 1200w file (~150KB) — sharp and not oversized

### Generating Multiple Sizes Automatically

**In Nuxt with `@nuxt/image`:**

```html
<NuxtImg
  src="/images/hero.jpg"
  width="1200"
  height="600"
  sizes="100vw sm:50vw md:800px"
  format="webp"
  quality="80"
  alt="Hero description"
/>
```

Nuxt generates the `srcset` automatically and converts to WebP.

**In Next.js:**

```jsx
import Image from "next/image";

<Image
  src="/images/hero.jpg"
  width={1200}
  height={600}
  sizes="(max-width: 768px) 100vw, 800px"
  quality={80}
  alt="Description"
/>;
```

**In WordPress with Imagify or ShortPixel:**
These plugins automatically generate multiple sizes and serve WebP. Enable and your existing images get srcset added automatically.

---

## Fix 3: Convert Images to WebP or AVIF Format

JPEG was designed in 1992. PNG was designed in 1996. WebP (Google, 2010) is 25–35% smaller at equivalent quality. AVIF (2019) is 40–50% smaller.

| Format | Compression | Quality           | Browser Support  |
| ------ | ----------- | ----------------- | ---------------- |
| JPEG   | Baseline    | Good              | Universal        |
| PNG    | Lossless    | Perfect           | Universal        |
| WebP   | Modern      | Excellent         | 96%+ of browsers |
| AVIF   | Best        | Excellent         | 90%+ of browsers |
| SVG    | Vector      | Perfect for icons | Universal        |

**For photography and complex images:** Use WebP (safe choice) or AVIF (best quality/size).  
**For logos, icons, illustrations:** Use SVG if possible, WebP if raster is required.

### Converting Images on Your Machine

**Windows — using cwebp (free):**

```bash
# Download cwebp from Google: https://developers.google.com/speed/webp/download
# Then convert a single file
cwebp -q 80 input.jpg -o output.webp

# Batch convert all JPGs in a folder
for %f in (*.jpg) do cwebp -q 80 "%f" -o "%~nf.webp"
```

**Mac:**

```bash
# Install via Homebrew
brew install webp

# Convert single file
cwebp -q 80 input.jpg -o output.webp

# Batch convert all JPGs
for f in *.jpg; do cwebp -q 80 "$f" -o "${f%.jpg}.webp"; done
```

**Online (no software):** [squoosh.app](https://squoosh.app) — drag, drag, click. Compare quality side by side. Export WebP or AVIF. Free, no signup.

### Serve WebP with JPEG Fallback (For Older Browsers)

```html
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" width="800" height="600" />
</picture>
```

Browsers that support AVIF use AVIF. WebP-capable browsers use WebP. Legacy browsers get JPEG. Three formats, one block.

---

## Fix 4: Always Set Explicit Width and Height on `<img>` Tags

This is required for two reasons:

**1. Prevent Cumulative Layout Shift (CLS):** Without dimensions, the browser doesn't know how much space to reserve for the image. Content loads, then the image loads and pushes everything down. Users see the page jump — this is called layout shift.

**2. Google ranking:** CLS is one of the three [Core Web Vitals](/blog/core-web-vitals-guide-2026) ranking signals. Layout shift from images without dimensions directly hurts your Google rankings.

```html
<!-- Bad — browser doesn't know dimensions until image downloads -->
<img src="photo.webp" alt="Photo" />

<!-- Good — browser reserves exact space immediately -->
<img src="photo.webp" width="800" height="600" alt="Photo" />
```

**With CSS `height: auto`, the image is still responsive:**

```css
img {
  max-width: 100%;
  height: auto; /* Maintains aspect ratio while respecting width: attribute */
}
```

The `width` and `height` attributes set the aspect ratio — not the actual displayed size. CSS controls the actual display size.

---

## Fix 5: Background Images Looking Wrong on Mobile

CSS background images often look correct on desktop but show the wrong part of the image, cut off the subject, or appear zoomed-in on mobile.

**Basic background image CSS:**

```css
.hero {
  background-image: url("/hero.webp");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
```

**The real problem:** A landscape hero photograph (1440×600px) doesn't crop nicely into a portrait mobile viewport (375×667px). The center of the image shows — but the important subject might be off-center.

**Solution: Use different images for mobile and desktop (art direction):**

```css
/* Mobile: portrait-cropped version showing the subject clearly */
.hero {
  background-image: url("/hero-mobile.webp");
  background-position: top center;
  height: 400px;
}

/* Desktop: full landscape panoramic version */
@media (min-width: 768px) {
  .hero {
    background-image: url("/hero-desktop.webp");
    background-position: center center;
    height: 500px;
  }
}
```

**Even better — use `<img>` with `object-fit` instead of CSS background:**

```html
<div class="hero-wrapper">
  <picture>
    <source media="(max-width: 767px)" srcset="/hero-mobile.webp" />
    <source media="(min-width: 768px)" srcset="/hero-desktop.webp" />
    <img class="hero-img" src="/hero-desktop.webp" alt="Hero" />
  </picture>
</div>
```

```css
.hero-wrapper {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

This gives full control over which image version loads on each device.

---

## Fix 6: File Size Targets (What "Good" Looks Like)

Even with the right format and dimensions, oversized files slow your site. These are the targets to aim for:

| Image Type               | Target File Size | Notes                     |
| ------------------------ | ---------------- | ------------------------- |
| Hero / full-width banner | Under 150KB      | WebP, 2× CSS display size |
| Blog post thumbnail      | Under 40KB       | 400–600px wide, WebP      |
| Product photo            | Under 60KB       | Clean background, WebP    |
| Logo                     | Under 10KB       | SVG preferred             |
| Team photo (small)       | Under 30KB       | 200px, WebP               |
| Full-width background    | Under 180KB      | WebP, very compressed     |
| Icon                     | Under 5KB        | SVG or icon font          |

**Check your current image sizes:**
Chrome DevTools → Network tab → filter by "Img" → reload the page → click Size column to sort by largest.

Any image over 200KB without a specific reason is a compression candidate.

**Tools to compress without visible quality loss:**

- [Squoosh.app](https://squoosh.app) — best quality/compression control (free, no signup)
- [TinyPNG](https://tinypng.com) — drag and drop, free for small batches
- [ImageOptim](https://imageoptim.com) — Mac batch processing (free)
- Imagify WordPress plugin — auto-compresses on upload (free tier)

---

## Fix 7: Hero Image as LCP — Priority Loading

Your hero image is almost always your **Largest Contentful Paint (LCP)** element — the biggest visible thing above the fold. LCP is a Google ranking signal. If your hero image loads slowly, your LCP score fails, and your ranking suffers.

**The default behavior is wrong:** Browsers load images in order of discovery in the HTML. Your hero image competes with scripts, stylesheets, and other assets.

**Fix — tell the browser to prioritize the hero image:**

```html
<!-- Preload hint: start downloading before browser parses the img tag -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />

<!-- On the actual image element -->
<img
  src="/hero.webp"
  fetchpriority="high"
  decoding="async"
  width="1440"
  height="600"
  alt="Hero description"
/>
```

**Critical: Do NOT use `loading="lazy"` on the hero image:**

```html
<!-- WRONG — tells browser to delay loading until scrolled to -->
<img src="/hero.webp" loading="lazy" />

<!-- RIGHT — no loading attribute (default = eager) or explicit eager -->
<img src="/hero.webp" fetchpriority="high" />
```

`loading="lazy"` delays image loading. For above-the-fold images, this is the opposite of what you want. Use lazy loading only for images below the fold.

---

## Fix 8: Images in Nuxt/Next.js Apps Not Optimizing

If you're using a JavaScript framework and images still look blurry or load slowly despite using the built-in image components, check these common configuration issues:

**Nuxt — `@nuxt/image` setup:**

```typescript
// nuxt.config.ts
image: {
  format: ['webp', 'avif'],  // Enable modern formats
  quality: 80,
  screens: {
    xs: 320, sm: 640, md: 768,
    lg: 1024, xl: 1280, xxl: 1536
  }
}
```

**Common Nuxt image mistake:**

```html
<!-- Wrong — plain <img> bypasses @nuxt/image optimization -->
<img src="/hero.jpg" />

<!-- Right — NuxtImg runs optimization pipeline -->
<NuxtImg src="/hero.jpg" width="800" height="400" format="webp" />
```

**Next.js — domains configuration required for external images:**

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ["your-cdn.com", "api.dicebear.com"],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
};
```

---

## Fix 9: SVG Images as OG Images (Social Sharing Problem)

If your blog posts use SVG images as Open Graph images (the preview image when sharing on WhatsApp, LinkedIn, Twitter), many social platforms can't render SVGs properly.

**The problem:** WhatsApp, LinkedIn, and older Facebook crawlers either don't render SVGs or show placeholder boxes.

**The fix:** Use PNG or JPG for OG images:

```html
<!-- In your blog post meta -->
<meta property="og:image" content="https://yoursite.com/blog/post-cover.jpg" />
<!-- NOT: /blog/post-cover.svg -->
```

Minimum dimensions for OG images:

- Facebook/LinkedIn: 1200×630px
- Twitter/X: 1200×675px
- WhatsApp: 800×420px (smaller is acceptable)

**If your blog images are currently SVGs:** Create a separate raster (JPG/PNG) version at 1200×630px for use as the OG image. Keep the SVG for display in the article if you prefer.

---

## Complete Image Optimization Checklist

Apply to every image on your site:

**Quality and dimensions:**

- [ ] Exported at 2× the CSS display size (or using srcset)
- [ ] Format is WebP or AVIF (not JPEG for photos unless legacy support needed)
- [ ] File size is under the target for its type (hero < 150KB, thumbnail < 40KB)

**HTML implementation:**

- [ ] `width` and `height` attributes set on every `<img>` (prevents CLS)
- [ ] `alt` text on every image (accessibility + SEO)
- [ ] Hero image has `fetchpriority="high"` — no `loading="lazy"`
- [ ] Below-fold images have `loading="lazy"`

**Mobile:**

- [ ] Background images have mobile-specific portrait versions
- [ ] Tested on actual phone — looks sharp and correct

**Social sharing:**

- [ ] OG image is PNG or JPG, not SVG
- [ ] OG image dimensions are 1200×630px

**Performance:**

- [ ] No image over 200KB without specific reason
- [ ] Largest image on page is the LCP element and loads within 2.5 seconds

---

## Frequently Asked Questions

**What's the difference between WebP and AVIF? Which should I use?**
Both are modern formats. AVIF is newer and compresses 10–15% better than WebP at equivalent quality. Browser support is slightly lower for AVIF (~90% vs 96% for WebP). The safest approach: offer AVIF first, WebP as fallback, JPEG as legacy fallback — the `<picture>` element handles this automatically.

**My images look blurry on iPhone but fine on Android — why?**
iPhone screens have high pixel density (2× or 3×). If your images aren't served at 2× resolution, they'll look sharper on lower-density Android screens. Fix: ensure you're serving images at 2× the CSS display size.

**Should I use SVG or PNG for my logo?**
SVG for logos, icons, and illustrations — they're infinitely scalable and tiny file sizes. PNG for photographs, complex graphics, or when you need pixel-perfect control. Never use JPEG for logos (compression artifacts on sharp edges).

**How do I know if my image optimization is working?**
Run Chrome DevTools → Network tab → filter by Img → check file sizes. Then run [PageSpeed Insights](https://pagespeed.web.dev) — the "Properly size images" and "Serve images in next-gen formats" opportunities disappear when you've fixed image issues correctly.

**My WordPress theme has a built-in image compression — do I still need Imagify?**
Most theme compression is basic. Imagify or ShortPixel offer 30–50% better compression at equivalent quality. The combination of both is fine — just ensure you're not double-compressing the same image (which degrades quality).

**Loading="lazy" on all images — good or bad?**
Good for images below the fold. Bad for above-the-fold images (hero, header logo). The `loading="lazy"` attribute should be applied selectively — never to the primary hero image or anything visible without scrolling.

---

If your images pass all these checks and still look wrong, the issue is usually in your CMS's image processing pipeline or a CSS rule overriding dimensions. [Get in touch](/contact) and we'll diagnose the specific cause — most image quality issues are fixable in under 2 hours.
