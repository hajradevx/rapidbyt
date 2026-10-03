/**
 * Manual sitemap route — served at /sitemap.xml
 */

const SITE_URL = "https://rapidbyt.com";

const pages = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/services", priority: "0.9", changefreq: "monthly" },
  { loc: "/diagnose", priority: "0.8", changefreq: "monthly" },
  { loc: "/blog", priority: "0.8", changefreq: "weekly" },
  { loc: "/about", priority: "0.7", changefreq: "monthly" },
  { loc: "/contact", priority: "0.7", changefreq: "monthly" },
  { loc: "/products", priority: "0.7", changefreq: "weekly" },
  { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
  { loc: "/terms", priority: "0.3", changefreq: "yearly" },
  { loc: "/disclaimer", priority: "0.3", changefreq: "yearly" },
  // Blog posts
  { loc: "/blog/best-web-hosting-pakistan-2026", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/chatgpt-website-content-seo-safe", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/competitor-outranking-you-on-google", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/contact-form-emails-not-arriving", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/core-web-vitals-guide-2026", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/fast-website-still-losing-sales-cro", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/free-website-speed-check-tools", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/get-first-1000-visitors-without-paid-ads", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/google-ads-not-converting-fix", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/google-ads-vs-facebook-ads-2026", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/google-analytics-not-working-fix", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/google-search-console-setup-beginners", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/high-bounce-rate-causes-and-fixes", priority: "0.7", changefreq: "monthly" },
  {
    loc: "/blog/how-to-move-to-cloudflare-and-cut-hosting-costs",
    priority: "0.7",
    changefreq: "monthly",
  },
  { loc: "/blog/images-loading-blurry-wrong-size", priority: "0.7", changefreq: "monthly" },
  {
    loc: "/blog/nuxt-cloudflare-workers-d1-local-vs-production",
    priority: "0.7",
    changefreq: "monthly",
  },
  { loc: "/blog/shopify-vs-woocommerce-2026", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/ssl-certificate-errors-fix", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/technical-seo-checklist-2026", priority: "0.7", changefreq: "monthly" },
  {
    loc: "/blog/traffic-not-converting-landing-page-fixes",
    priority: "0.7",
    changefreq: "monthly",
  },
  { loc: "/blog/website-broken-on-mobile-fix", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/website-down-what-to-do", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/website-maintenance-checklist", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/website-security-hardening-guide", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/why-is-my-website-not-showing-on-google", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/why-page-speed-matters-for-revenue", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/wordpress-slow-website-fix-guide", priority: "0.7", changefreq: "monthly" },
  { loc: "/blog/wordpress-vs-webflow-2026", priority: "0.7", changefreq: "monthly" },
];

const lastmod = new Date().toISOString().split("T")[0];

export default defineEventHandler((event) => {
  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  setHeader(event, "Cache-Control", "public, max-age=3600, s-maxage=3600");

  const urls = pages
    .map(
      (p) => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${lastmod}</lastmod>
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
