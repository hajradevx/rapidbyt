/**
 * Redirect www.rapidbyt.com → rapidbyt.com (301 permanent)
 * Prevents Google from treating them as duplicate pages.
 * This runs on EVERY request before any route handler.
 */
export default defineEventHandler(event => {
  const host = getHeader(event, 'host') ?? ''

  // Strip port if present (e.g. www.rapidbyt.com:443)
  const hostname = host.split(':')[0] ?? ''

  if (hostname.startsWith('www.')) {
    const url = getRequestURL(event)
    // Preserve full path + query string, remove www
    const canonical = `https://rapidbyt.com${url.pathname}${url.search}`
    return sendRedirect(event, canonical, 301)
  }
})
