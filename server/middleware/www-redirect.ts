/**
 * Redirect www.rapidbyt.com → rapidbyt.com (301 permanent)
 * Prevents Google from treating them as duplicate pages.
 */
export default defineEventHandler((event) => {
  const host = getHeader(event, "host") ?? "";
  if (host.startsWith("www.")) {
    const url = getRequestURL(event);
    const canonical = `https://rapidbyt.com${url.pathname}${url.search}`;
    return sendRedirect(event, canonical, 301);
  }
});
