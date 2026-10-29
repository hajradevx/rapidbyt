/**
 * Generates SVG cover images for every blog post and saves them to
 * public/blog/<filename>.svg  (referenced as /blog/<filename>.jpg in
 * frontmatter — we'll update the extension below to .svg so Nuxt Image
 * can serve them directly).
 *
 * Run once:  node scripts/gen-blog-images.mjs
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../public/blog");

mkdirSync(OUT_DIR, { recursive: true });

// Category → gradient colors (from, to) + icon path
const CAT = {
  Performance: {
    from: "#0ea5e9",
    to: "#6366f1",
    icon: `<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke-linejoin="round"/>`,
  },
  SEO: {
    from: "#10b981",
    to: "#0ea5e9",
    icon: `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>`,
  },
  Development: {
    from: "#6366f1",
    to: "#8b5cf6",
    icon: `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
  },
  Security: {
    from: "#f43f5e",
    to: "#e11d48",
    icon: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
  },
  Business: {
    from: "#f59e0b",
    to: "#f97316",
    icon: `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,
  },
  Platform: {
    from: "#8b5cf6",
    to: "#6366f1",
    icon: `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>`,
  },
};

const DEFAULT_CAT = {
  from: "#64748b",
  to: "#475569",
  icon: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>`,
};

// Wrap text to lines of maxChars
function wrapText(text, maxChars = 28) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length <= maxChars) {
      current = (current + " " + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 4); // max 4 lines
}

const posts = [
  {
    file: "web-hosting-pakistan-2026",
    title: "Best Web Hosting in Pakistan 2026",
    category: "Business",
  },
  {
    file: "chatgpt-seo-safe",
    title: "Using ChatGPT for Website Content — SEO Safe?",
    category: "SEO",
  },
  { file: "competetor", title: "Why Your Competitor Ranks Higher on Google", category: "SEO" },
  {
    file: "contact-form-not-working",
    title: "Contact Form Not Arriving? How to Fix It",
    category: "Business",
  },
  {
    file: "core-web-vitals-guide-2026",
    title: "Core Web Vitals 2026: The Complete Fix Guide",
    category: "SEO",
  },
  {
    file: "fast-site-no-conversions",
    title: "Fast Website But No Sales? Here's Why",
    category: "Business",
  },
  {
    file: "free-speed-check-tools",
    title: "5 Best Free Tools to Check Website Speed",
    category: "Performance",
  },
  {
    file: "first-1000-visitors",
    title: "Get Your First 1,000 Visitors Without Paid Ads",
    category: "Business",
  },
  {
    file: "google-ads-not-converting",
    title: "Google Ads Getting Zero Sales? Here's Why",
    category: "Business",
  },
  {
    file: "google-ads-vs-facebook-ads",
    title: "Google Ads vs Facebook Ads 2026",
    category: "Business",
  },
  {
    file: "google-analytics-not-working",
    title: "Google Analytics Showing No Data — Fix Guide",
    category: "Business",
  },
  {
    file: "google-my-business-seo",
    title: "Google My Business SEO: Rank Higher Locally",
    category: "SEO",
  },
  { file: "search-console-setup", title: "How to Set Up Google Search Console", category: "SEO" },
  {
    file: "bounce-rate-fixes",
    title: "Why Your Bounce Rate Is High (And How to Fix It)",
    category: "Performance",
  },
  {
    file: "cloudflare-migration",
    title: "Move to Cloudflare and Cut Hosting Costs by 60%",
    category: "Development",
  },
  {
    file: "images-blurry-fix",
    title: "Why Images Look Blurry on Your Website",
    category: "Performance",
  },
  {
    file: "nuxt-cloudflare-d1-debug",
    title: "Nuxt + Cloudflare Workers: APIs Break in Production",
    category: "Development",
  },
  {
    file: "shopify-vs-woocommerce",
    title: "Shopify vs WooCommerce 2026 — Which to Choose?",
    category: "Business",
  },
  {
    file: "ssl-certificate-errors",
    title: 'SSL Certificate Errors: Fix "Not Secure" Warning',
    category: "Security",
  },
  {
    file: "technical-seo-checklist",
    title: "Technical SEO Checklist 2026: 30 Fixes",
    category: "SEO",
  },
  {
    file: "traffic-no-conversions",
    title: "Getting Traffic But No Sales? 10 Fixes",
    category: "Business",
  },
  {
    file: "website-broken-mobile",
    title: "Website Broken on Mobile — How to Fix It",
    category: "Performance",
  },
  { file: "website-down", title: "Your Website Is Down — What to Do Now", category: "Security" },
  {
    file: "website-maintenance-checklist",
    title: "Monthly Website Maintenance Checklist",
    category: "Security",
  },
  {
    file: "website-not-loading-mobile-data",
    title: "Website Not Loading on Mobile Data? Fix It",
    category: "Performance",
  },
  {
    file: "website-security",
    title: "My Website Got Hacked — What to Do Now",
    category: "Security",
  },
  {
    file: "website-not-on-google",
    title: "Why Your Website Isn't Showing on Google",
    category: "SEO",
  },
  {
    file: "why-page-speed-matters-for-revenue",
    title: "Why Page Speed Directly Impacts Revenue",
    category: "Performance",
  },
  {
    file: "wix-vs-wordpress",
    title: "Wix vs WordPress: Which to Use in 2026?",
    category: "Platform",
  },
  {
    file: "wordpress-slow-fix",
    title: "WordPress Site Slow? The Complete Fix Guide",
    category: "Performance",
  },
  {
    file: "wordpress-vs-webflow",
    title: "WordPress vs Webflow 2026 — Which to Choose?",
    category: "Development",
  },
];

// Noise/texture pattern IDs are unique per file
let count = 0;
for (const post of posts) {
  const cat = CAT[post.category] ?? DEFAULT_CAT;
  const lines = wrapText(post.title, 26);
  const lineHeight = 34;
  const textStartY = 148 - ((lines.length - 1) * lineHeight) / 2;
  const id = `g${count++}`;

  const textLines = lines
    .map(
      (line, i) =>
        `<text x="200" y="${textStartY + i * lineHeight}" text-anchor="middle" fill="white" font-family="system-ui,-apple-system,sans-serif" font-size="22" font-weight="700" letter-spacing="-0.3">${line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>`,
    )
    .join("\n  ");

  const catLabel = post.category.toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420">
  <defs>
    <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${cat.from}"/>
      <stop offset="100%" stop-color="${cat.to}"/>
    </linearGradient>
    <filter id="n${id}">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feBlend in="SourceGraphic" mode="overlay" result="blend"/>
      <feComposite in="blend" in2="SourceGraphic" operator="in"/>
    </filter>
  </defs>

  <!-- Background gradient -->
  <rect width="800" height="420" fill="url(#${id})"/>

  <!-- Noise overlay for texture -->
  <rect width="800" height="420" fill="white" opacity="0.03" filter="url(#n${id})"/>

  <!-- Decorative circles -->
  <circle cx="680" cy="-40" r="200" fill="white" opacity="0.06"/>
  <circle cx="720" cy="460" r="160" fill="white" opacity="0.04"/>
  <circle cx="-40" cy="200" r="140" fill="white" opacity="0.05"/>

  <!-- Grid dots pattern -->
  <pattern id="p${id}" width="40" height="40" patternUnits="userSpaceOnUse">
    <circle cx="1" cy="1" r="1" fill="white" opacity="0.15"/>
  </pattern>
  <rect width="800" height="420" fill="url(#p${id})"/>

  <!-- Category badge -->
  <rect x="24" y="24" width="${catLabel.length * 9 + 28}" height="28" rx="14" fill="white" opacity="0.2"/>
  <text x="38" y="42" fill="white" font-family="system-ui,-apple-system,sans-serif" font-size="11" font-weight="800" letter-spacing="1.5" opacity="0.9">${catLabel}</text>

  <!-- Icon (centered, large, subtle) -->
  <g transform="translate(368, 60)" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.25">
    <svg width="64" height="64" viewBox="0 0 24 24">${cat.icon}</svg>
  </g>

  <!-- Title text -->
  ${textLines}

  <!-- Bottom brand bar -->
  <rect x="0" y="384" width="800" height="36" fill="black" opacity="0.25"/>
  <text x="24" y="407" fill="white" font-family="system-ui,-apple-system,sans-serif" font-size="13" font-weight="700" opacity="0.8">rapidbyt.com</text>
  <text x="776" y="407" text-anchor="end" fill="white" font-family="system-ui,-apple-system,sans-serif" font-size="12" opacity="0.6">Web Performance &amp; SEO</text>
</svg>`;

  writeFileSync(join(OUT_DIR, `${post.file}.svg`), svg, "utf8");
  console.log(`✓ ${post.file}.svg`);
}

console.log(`\nGenerated ${posts.length} SVG cover images in public/blog/`);
