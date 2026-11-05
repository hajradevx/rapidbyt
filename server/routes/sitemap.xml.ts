/**
 * Manual sitemap route — served at /sitemap.xml
 *
 * Rules:
 * - noindex pages (/terms, /privacy, /disclaimer) are intentionally excluded — having
 *   noindex URLs in a sitemap causes Google Search Console warnings.
 * - lastmod uses ISO 8601 datetime format (YYYY-MM-DDTHH:mm:ss+00:00) as Google prefers.
 * - Cornerstone / pillar content gets priority 0.9; standard posts get 0.8.
 */

const SITE_URL = "https://rapidbyt.com";

const pages = [
  { loc: "/", lastmod: "2026-11-04T00:00:00+00:00", priority: "1.0", changefreq: "weekly" },
  {
    loc: "/services",
    lastmod: "2026-11-01T00:00:00+00:00",
    priority: "0.9",
    changefreq: "monthly",
  },
  {
    loc: "/diagnose",
    lastmod: "2026-11-01T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/products",
    lastmod: "2026-11-01T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  { loc: "/blog", lastmod: "2026-11-04T00:00:00+00:00", priority: "0.8", changefreq: "weekly" },
  { loc: "/about", lastmod: "2026-11-01T00:00:00+00:00", priority: "0.7", changefreq: "monthly" },
  { loc: "/contact", lastmod: "2026-11-01T00:00:00+00:00", priority: "0.7", changefreq: "monthly" },
  {
    loc: "/tools/meta-checker",
    lastmod: "2026-11-04T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },

  // ── Blog posts (cornerstone content → 0.9, standard → 0.8) ─────────────────
  {
    loc: "/blog/technical-seo-checklist-2026",
    lastmod: "2026-09-15T00:00:00+00:00",
    priority: "0.9",
    changefreq: "monthly",
  },
  {
    loc: "/blog/core-web-vitals-guide-2026",
    lastmod: "2026-09-01T00:00:00+00:00",
    priority: "0.9",
    changefreq: "monthly",
  },
  {
    loc: "/blog/why-page-speed-matters-for-revenue",
    lastmod: "2026-08-10T00:00:00+00:00",
    priority: "0.9",
    changefreq: "monthly",
  },
  {
    loc: "/blog/why-is-my-website-not-showing-on-google",
    lastmod: "2026-09-20T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/high-bounce-rate-causes-and-fixes",
    lastmod: "2026-09-25T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/website-security-hardening-guide",
    lastmod: "2026-09-28T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/best-web-hosting-pakistan-2026",
    lastmod: "2026-10-01T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/shopify-vs-woocommerce-2026",
    lastmod: "2026-10-02T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/traffic-not-converting-landing-page-fixes",
    lastmod: "2026-10-02T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/google-ads-vs-facebook-ads-2026",
    lastmod: "2026-10-03T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/chatgpt-website-content-seo-safe",
    lastmod: "2026-10-04T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/free-website-speed-check-tools",
    lastmod: "2026-10-05T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/wordpress-vs-webflow-2026",
    lastmod: "2026-10-06T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/google-search-console-setup-beginners",
    lastmod: "2026-10-07T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/how-to-move-to-cloudflare-and-cut-hosting-costs",
    lastmod: "2026-10-08T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/wordpress-slow-website-fix-guide",
    lastmod: "2026-10-12T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/nuxt-cloudflare-workers-d1-local-vs-production",
    lastmod: "2026-10-15T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/google-ads-not-converting-fix",
    lastmod: "2026-10-18T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/website-broken-on-mobile-fix",
    lastmod: "2026-10-20T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/contact-form-emails-not-arriving",
    lastmod: "2026-10-22T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/competitor-outranking-you-on-google",
    lastmod: "2026-10-25T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/ssl-certificate-errors-fix",
    lastmod: "2026-10-28T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/website-down-what-to-do",
    lastmod: "2026-10-01T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/google-analytics-not-working-fix",
    lastmod: "2026-10-03T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/images-loading-blurry-wrong-size",
    lastmod: "2026-10-06T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/get-first-1000-visitors-without-paid-ads",
    lastmod: "2026-10-08T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/fast-website-still-losing-sales-cro",
    lastmod: "2026-10-01T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/website-maintenance-checklist",
    lastmod: "2026-10-01T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/wix-vs-wordpress-which-is-better",
    lastmod: "2026-10-10T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/google-my-business-seo-guide",
    lastmod: "2026-10-11T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/website-not-loading-on-mobile-data",
    lastmod: "2026-10-12T00:00:00+00:00",
    priority: "0.8",
    changefreq: "monthly",
  },
];

export default defineEventHandler((event) => {
  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  // Cache for 24 hours — sitemap doesn't change that often
  setHeader(event, "Cache-Control", "public, max-age=86400, s-maxage=86400");

  const urls = pages
    .map(
      (p) => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
});
