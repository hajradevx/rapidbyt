/**
 * Canonicalise all requests to https://rapidbyt.com (301 permanent).
 *
 * Handles two non-canonical variants that Google was indexing:
 *   - http://rapidbyt.com      → https://rapidbyt.com
 *   - http(s)://www.rapidbyt.com → https://rapidbyt.com
 *
 * Behind Cloudflare, TLS is terminated at the edge and the Worker/origin
 * receives plain HTTP internally, so we rely on the `x-forwarded-proto`
 * header to detect the original protocol rather than `url.protocol`.
 *
 * With `run_worker_first: true` in wrangler.jsonc, this middleware fires
 * before static assets are served, ensuring www/http requests are always
 * redirected even for prerendered pages.
 *
 * Static asset paths (/_nuxt/, /img/, /fonts/, etc.) are fast-pathed to
 * skip the hostname check since they can never be the source of a www
 * canonical issue — only HTML pages matter for SEO.
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
  ".mp4",
  ".webm",
]);

export default defineEventHandler((event) => {
  const host = getHeader(event, "host") ?? "";
  const proto = getHeader(event, "x-forwarded-proto") ?? "https";
  const hostname = host.split(":")[0] ?? "";

  const isWww = hostname.startsWith("www.");
  const isHttp = proto === "http";

  // Fast-path: canonical domain + HTTPS, nothing to do
  if (!isWww && !isHttp) return;

  // Skip redirect checks for static assets — they don't affect SEO canonicals
  // and we don't want to add latency to every JS/CSS/image request.
  const path = getRequestURL(event).pathname;
  if (STATIC_PREFIXES.some((p) => path.startsWith(p))) return;
  const dot = path.lastIndexOf(".");
  if (dot !== -1 && STATIC_EXTENSIONS.has(path.slice(dot))) return;

  // Redirect to canonical: https, no-www, preserve path + query
  const url = getRequestURL(event);
  const canonical = `https://rapidbyt.com${url.pathname}${url.search}`;
  return sendRedirect(event, canonical, 301);
});
