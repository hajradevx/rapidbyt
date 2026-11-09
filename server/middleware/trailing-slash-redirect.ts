/**
 * Strip trailing slashes from HTML pages (301 permanent redirect).
 *
 * Why: Every page has a self-referencing canonical without a trailing slash
 * (e.g. https://rapidbyt.com/about). If Google crawls /about/ it sees a
 * page whose canonical points to /about — which is "Alternate page with
 * proper canonical tag" in Search Console. A 301 redirect collapses the
 * alternate back to the canonical, removing it from the GSC report.
 *
 * Rules:
 * - Root "/" is left alone — never redirect the homepage to empty string.
 * - Static asset paths and file extensions are skipped (images, JS, CSS, etc.)
 *   to avoid adding latency to non-HTML resources.
 * - Only paths ending in "/" that are longer than 1 char are redirected.
 * - Runs AFTER www-redirect.ts (Nitro alphabetically orders same-directory
 *   middleware, so "t" runs after "w" — but both are fast and the order is
 *   irrelevant; a second redirect is just a 2-hop 301 if both fire).
 */

const STATIC_PREFIXES = ["/_nuxt/", "/img/", "/fonts/", "/icons/"];
const STATIC_EXTENSIONS = new Set([
  ".js",
  ".css",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".svg",
  ".ico",
  ".gif",
  ".xml",
  ".txt",
  ".json",
  ".mp4",
  ".webm",
]);

export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const path = url.pathname;

  // Only act on paths that end with "/" and are longer than just "/"
  if (!path.endsWith("/") || path.length <= 1) return;

  // Skip static assets — they are never the source of trailing-slash SEO issues
  if (STATIC_PREFIXES.some((p) => path.startsWith(p))) return;
  const dot = path.lastIndexOf(".");
  if (dot !== -1 && STATIC_EXTENSIONS.has(path.slice(dot))) return;

  // 301 redirect to the no-trailing-slash canonical, preserving query string
  const canonical = `https://rapidbyt.com${path.slice(0, -1)}${url.search}`;
  return sendRedirect(event, canonical, 301);
});
