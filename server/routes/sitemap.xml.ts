/**
 * Manual sitemap route — served at /sitemap.xml
 * Includes static pages + all blog posts dynamically from content collection.
 */

const SITE_URL = "https://rapidbyt.com";

const staticPages = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/services", priority: "0.9", changefreq: "monthly" },
  { loc: "/blog", priority: "0.8", changefreq: "weekly" },
  { loc: "/diagnose", priority: "0.8", changefreq: "monthly" },
  { loc: "/about", priority: "0.7", changefreq: "monthly" },
  { loc: "/contact", priority: "0.7", changefreq: "monthly" },
  { loc: "/products", priority: "0.7", changefreq: "weekly" },
  { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
  { loc: "/terms", priority: "0.3", changefreq: "yearly" },
  { loc: "/disclaimer", priority: "0.3", changefreq: "yearly" },
];

// All 29 blog slugs — update this list when new posts are added
const blogSlugs = [
  "best-web-hosting-pakistan-2026",
  "shopify-vs-woocommerce-2026",
  "google-ads-vs-facebook-ads-2026",
  "chatgpt-website-content-seo-safe",
  "free-website-speed-check-tools",
  "wordpress-vs-webflow-2026",
  "google-search-console-setup-beginners",
  "web-bounce-rate",
  "competitor-outranking-you-on-google",
  "contact-form-emails-not-arriving",
  "core-web-vitals-guide-2026",
  "fast-website-still-losing-sales-cro",
  "get-first-1000-visitors-without-paid-ads",
  "google-ads-not-converting-fix",
  "google-analytics-not-working-fix",
  "high-bounce-rate-causes-and-fixes",
  "how-to-move-to-cloudflare-and-cut-hosting-costs",
  "images-loading-blurry-wrong-size",
  "nuxt-cloudflare-workers-d1-local-vs-production",
  "ssl-certificate-errors-fix",
  "technical-seo-checklist-2026",
  "traffic-not-converting-landing-page-fixes",
  "website-broken-on-mobile-fix",
  "website-down-what-to-do",
  "website-maintenance-checklist",
  "website-security-hardening-guide",
  "why-is-my-website-not-showing-on-google",
  "why-page-speed-matters-for-revenue",
  "wordpress-slow-website-fix-guide",
];

const lastmod = new Date().toISOString().split("T")[0];

function buildUrl(loc: string, priority: string, changefreq: string): string {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function buildSitemap(): string {
  const staticUrls = staticPages.map((p) => buildUrl(p.loc, p.priority, p.changefreq)).join("\n");

  const blogUrls = blogSlugs.map((slug) => buildUrl(`/blog/${slug}`, "0.7", "monthly")).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${blogUrls}
</urlset>`;
}

export default defineEventHandler((event) => {
  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  setHeader(event, "Cache-Control", "public, max-age=3600, s-maxage=3600");
  return buildSitemap();
});
