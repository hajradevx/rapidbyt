/**
 * Manual sitemap route — served at /sitemap.xml
 */

const SITE_URL = "https://rapidbyt.com";

const pages = [
  { loc: "", lastmod: "2026-09-01", priority: "1.0", changefreq: "weekly" },
  { loc: "/services", lastmod: "2026-09-01", priority: "0.9", changefreq: "monthly" },
  { loc: "/diagnose", lastmod: "2026-09-01", priority: "0.8", changefreq: "monthly" },
  { loc: "/blog", lastmod: "2026-10-01", priority: "0.8", changefreq: "weekly" },
  { loc: "/about", lastmod: "2026-09-01", priority: "0.7", changefreq: "monthly" },
  { loc: "/contact", lastmod: "2026-09-01", priority: "0.7", changefreq: "monthly" },
  { loc: "/products", lastmod: "2026-09-01", priority: "0.7", changefreq: "weekly" },
  { loc: "/privacy", lastmod: "2026-09-01", priority: "0.3", changefreq: "yearly" },
  { loc: "/terms", lastmod: "2026-09-01", priority: "0.3", changefreq: "yearly" },
  { loc: "/disclaimer", lastmod: "2026-09-01", priority: "0.3", changefreq: "yearly" },
  // Blog posts — lastmod = actual publish date
  {
    loc: "/blog/best-web-hosting-pakistan-2026",
    lastmod: "2026-09-15",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/chatgpt-website-content-seo-safe",
    lastmod: "2026-09-15",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/competitor-outranking-you-on-google",
    lastmod: "2026-09-20",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/contact-form-emails-not-arriving",
    lastmod: "2026-09-18",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/core-web-vitals-guide-2026",
    lastmod: "2026-09-10",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/fast-website-still-losing-sales-cro",
    lastmod: "2026-09-22",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/free-website-speed-check-tools",
    lastmod: "2026-09-12",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/get-first-1000-visitors-without-paid-ads",
    lastmod: "2026-09-25",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/google-ads-not-converting-fix",
    lastmod: "2026-09-28",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/google-ads-vs-facebook-ads-2026",
    lastmod: "2026-09-14",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/google-analytics-not-working-fix",
    lastmod: "2026-09-16",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/google-search-console-setup-beginners",
    lastmod: "2026-09-08",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/high-bounce-rate-causes-and-fixes",
    lastmod: "2026-09-19",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/how-to-move-to-cloudflare-and-cut-hosting-costs",
    lastmod: "2026-09-23",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/images-loading-blurry-wrong-size",
    lastmod: "2026-09-11",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/nuxt-cloudflare-workers-d1-local-vs-production",
    lastmod: "2026-09-30",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/shopify-vs-woocommerce-2026",
    lastmod: "2026-09-13",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/ssl-certificate-errors-fix",
    lastmod: "2026-09-09",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/technical-seo-checklist-2026",
    lastmod: "2026-09-17",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/traffic-not-converting-landing-page-fixes",
    lastmod: "2026-09-21",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/website-broken-on-mobile-fix",
    lastmod: "2026-09-26",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/website-down-what-to-do",
    lastmod: "2026-09-07",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/website-maintenance-checklist",
    lastmod: "2026-09-29",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/website-security-hardening-guide",
    lastmod: "2026-09-24",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/why-is-my-website-not-showing-on-google",
    lastmod: "2026-09-05",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/why-page-speed-matters-for-revenue",
    lastmod: "2026-09-06",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/wordpress-slow-website-fix-guide",
    lastmod: "2026-09-27",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    loc: "/blog/wordpress-vs-webflow-2026",
    lastmod: "2026-09-03",
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
