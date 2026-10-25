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
 * This runs on EVERY request before any route handler.
 */
export default defineEventHandler((event) => {
  const host = getHeader(event, "host") ?? "";
  const proto = getHeader(event, "x-forwarded-proto") ?? "https";

  // Strip port if present (e.g. www.rapidbyt.com:443)
  const hostname = host.split(":")[0] ?? "";

  const isWww = hostname.startsWith("www.");
  const isHttp = proto === "http";

  if (isWww || isHttp) {
    const url = getRequestURL(event);
    // Always redirect to canonical: https, no-www, preserve path + query
    const canonical = `https://rapidbyt.com${url.pathname}${url.search}`;
    return sendRedirect(event, canonical, 301);
  }
});
