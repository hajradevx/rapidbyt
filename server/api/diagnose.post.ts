import { Resend } from 'resend'

const FROM_ADDRESS = 'RapidByt Diagnostics <noreply@rapidbyt.com>'
const NOTIFY_EMAIL = 'info.rapidbyt@gmail.com'
const WHATSAPP_NUMBER = '923168636339'

interface PageSpeedCategory {
  score: number | null
}
interface PageSpeedAudit {
  score: number | null
  displayValue?: string
  title: string
  description?: string
}
interface PageSpeedResult {
  categories: {
    performance?: PageSpeedCategory
    seo?: PageSpeedCategory
    accessibility?: PageSpeedCategory
    'best-practices'?: PageSpeedCategory
  }
  audits: Record<string, PageSpeedAudit>
  runtimeError?: { message?: string }
}

interface PsiApiResponse {
  error?: { code?: number, message?: string, status?: string }
  lighthouseResult?: PageSpeedResult
}

// Disallow whitespace, @, and HTML-significant characters so a malicious
// value can never pass validation and later get embedded in HTML unescaped.
const EMAIL_REGEX = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/

// ── HTML escaping (defense in depth — used on every user-supplied or
// derived string before it is interpolated into an HTML email) ──────────
const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
}
function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, c => HTML_ESCAPES[c] ?? c)
}

function normalizeUrl(input: string): string {
  let targetUrl = input.trim()
  if (!targetUrl.startsWith('http')) targetUrl = `https://${targetUrl}`

  try {
    const parsed = new URL(targetUrl)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('invalid protocol')
    }
    return parsed.href
  }
  catch {
    throw createError({ statusCode: 400, message: 'Please enter a valid website URL.' })
  }
}

function scoreColor(score: number | null): string {
  if (score === null) return '#94a3b8'
  const s = Math.round(score * 100)
  if (s >= 90) return '#22c55e'
  if (s >= 50) return '#f59e0b'
  return '#ef4444'
}

function scoreBg(score: number | null): string {
  if (score === null) return '#f1f5f9'
  const s = Math.round(score * 100)
  if (s >= 90) return '#f0fdf4'
  if (s >= 50) return '#fffbeb'
  return '#fef2f2'
}

// ── Problem/solution definitions ──────────────────────────────────────
// Each check carries its own solution directly, keyed by the Lighthouse
// audit key. This replaces the old approach of re-matching solution text
// against problem *labels* via substring search, which silently dropped
// solutions whenever a label's wording didn't exactly contain the
// solution-map key (e.g. "is-crawlable" never matched previously).
interface CheckDef {
  key: string
  label: string
  solution?: string
}

const CHECKS: CheckDef[] = [
  { key: 'first-contentful-paint', label: 'Slow First Contentful Paint (FCP)', solution: 'Remove render-blocking resources, inline critical CSS' },
  { key: 'largest-contentful-paint', label: 'Slow Largest Contentful Paint (LCP) — hurts SEO', solution: 'Optimise server response time, use a CDN, preload critical resources' },
  { key: 'total-blocking-time', label: 'High Total Blocking Time — JavaScript is too heavy', solution: 'Split and defer JavaScript bundles, remove unused scripts' },
  { key: 'cumulative-layout-shift', label: 'Layout Shift (CLS) — page elements are jumping around', solution: 'Set explicit width/height on images and embeds, avoid injecting content above the fold' },
  { key: 'speed-index', label: 'Slow Speed Index — content loads too slowly', solution: 'Reduce main-thread work and defer non-critical resources' },
  { key: 'uses-optimized-images', label: 'Images are not optimised — wasting load time', solution: 'Compress images (e.g. Squoosh) or automate compression in your build pipeline' },
  { key: 'uses-webp-images', label: 'Not using modern image formats (WebP/AVIF)', solution: 'Convert to WebP/AVIF — 30–80% smaller than JPEG/PNG' },
  { key: 'render-blocking-resources', label: 'Render-blocking resources slowing down page display', solution: 'Use async/defer on scripts, inline critical CSS, remove unused styles' },
  { key: 'unused-javascript', label: 'Unused JavaScript is being loaded unnecessarily', solution: 'Enable tree-shaking, code-split routes, remove unused dependencies' },
  { key: 'unused-css-rules', label: 'Unused CSS rules are bloating your page', solution: 'Use PurgeCSS or your framework\'s built-in CSS purge to remove unused styles' },
  { key: 'uses-text-compression', label: 'Text compression (GZIP/Brotli) is not enabled', solution: 'Enable GZIP or Brotli compression on your server/CDN' },
  { key: 'uses-long-cache-ttl', label: 'Poor caching policy — visitors re-download assets every visit', solution: 'Set Cache-Control headers with a long TTL for static assets' },
  { key: 'efficient-animated-content', label: 'Animated GIFs instead of optimised video formats', solution: 'Replace animated GIFs with a muted, autoplaying video (MP4/WebM)' },
  { key: 'meta-description', label: 'Missing meta description — hurts SEO click-through rate', solution: 'Write a unique, keyword-rich meta description for every page' },
  { key: 'document-title', label: 'Missing page title tag — critical SEO issue', solution: 'Add a unique, descriptive title tag to every page' },
  { key: 'hreflang', label: 'Missing hreflang tags for international targeting', solution: 'Add hreflang tags if you serve multiple languages/regions' },
  { key: 'http-status-code', label: 'HTTP error status code detected', solution: 'Fix the server so it returns a 200 OK status for this page' },
  { key: 'is-crawlable', label: 'Page is blocked from search engine crawling', solution: 'Fix robots.txt / meta robots tags — they are currently blocking search engines' },
  { key: 'link-text', label: 'Generic link text ("click here") hurts SEO', solution: 'Use descriptive, keyword-relevant link text' },
  { key: 'image-alt', label: 'Images missing alt text — accessibility & SEO issue', solution: 'Add descriptive alt attributes to all images' },
  { key: 'color-contrast', label: 'Poor colour contrast — accessibility problem', solution: 'Increase text/background contrast to meet WCAG AA' },
  { key: 'tap-targets', label: 'Touch targets too small for mobile users', solution: 'Ensure all buttons/links are at least 48×48px on mobile' },
  { key: 'viewport', label: 'Missing mobile viewport meta tag', solution: 'Add a responsive <meta name="viewport"> tag' },
  { key: 'uses-https', label: 'Site is not served over HTTPS — security risk', solution: 'Install an SSL certificate (free via Let\'s Encrypt)' },
  { key: 'no-vulnerable-libraries', label: 'Vulnerable JavaScript libraries detected', solution: 'Update all dependencies to their latest patched versions' },
]

function buildProblemsAndSolutions(audits: Record<string, PageSpeedAudit>): { problems: string[], solutions: string[] } {
  const problems: string[] = []
  const solutions: string[] = []

  for (const check of CHECKS) {
    const audit = audits[check.key]
    if (audit && audit.score !== null && audit.score < 0.9) {
      const val = audit.displayValue ? ` (${audit.displayValue})` : ''
      problems.push(`${check.label}${val}`)
      if (check.solution) {
        solutions.push(`<strong>${escapeHtml(check.label.split(' — ')[0].split(' (')[0])}:</strong> ${escapeHtml(check.solution)}`)
      }
    }
  }
  return { problems, solutions }
}

function severityLevel(perfScore: number | null, seoScore: number | null, problemCount: number): { level: string, color: string, bg: string, message: string } {
  const perf = perfScore !== null ? Math.round(perfScore * 100) : 50
  const seo = seoScore !== null ? Math.round(seoScore * 100) : 50
  const avg = (perf + seo) / 2
  if (avg >= 85 && problemCount <= 3) {
    return { level: 'Good', color: '#22c55e', bg: '#f0fdf4', message: 'Your site is performing well! A few minor optimisations could push it further.' }
  }
  if (avg >= 60 && problemCount <= 8) {
    return { level: 'Needs Attention', color: '#f59e0b', bg: '#fffbeb', message: 'Your site has several fixable issues that are costing you traffic and conversions.' }
  }
  return { level: 'Critical', color: '#ef4444', bg: '#fef2f2', message: 'Your site has serious performance issues that are actively losing you customers every day.' }
}

export default defineEventHandler(async event => {
  // ── Parse & validate the request body defensively ─────────────────
  let body: unknown
  try {
    body = await readBody(event)
  }
  catch {
    throw createError({ statusCode: 400, message: 'Invalid request body.' })
  }

  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, message: 'Invalid request body.' })
  }

  const { url, email, name } = body as Record<string, unknown>

  if (typeof url !== 'string' || typeof email !== 'string' || !url.trim() || !email.trim()) {
    throw createError({ statusCode: 400, message: 'Website URL and email are required.' })
  }
  if (name !== undefined && name !== null && typeof name !== 'string') {
    throw createError({ statusCode: 400, message: 'Invalid name.' })
  }

  const trimmedEmail = email.trim()
  if (!EMAIL_REGEX.test(trimmedEmail) || trimmedEmail.length > 254) {
    throw createError({ statusCode: 400, message: 'Please enter a valid email address.' })
  }

  const targetUrl = normalizeUrl(url)

  const config = useRuntimeConfig()
  const psiKey = config.pagespeedApiKey
  const resendApiKey = config.resendApiKey

  if (!resendApiKey) {
    throw createError({ statusCode: 500, message: 'Email service not configured.' })
  }

  // ── Run PageSpeed Insights ───────────────────────────────
  const apiBase = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'

  // 45s timeout per call — PSI can be slow for heavy sites
  const fetchPsi = async (strategy: string, useKey: boolean): Promise<{ data: PageSpeedResult | null, error: string | null }> => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 45000)
    const keySuffix = useKey && psiKey ? `&key=${psiKey}` : ''
    const psiUrl = `${apiBase}?url=${encodeURIComponent(targetUrl)}&strategy=${strategy}${keySuffix}&category=performance&category=seo&category=accessibility&category=best-practices`

    try {
      const response = await fetch(psiUrl, { signal: controller.signal })
      const json = await response.json() as PsiApiResponse

      if (json.error?.message) {
        console.error(`PSI ${strategy} API error:`, json.error.message)
        return { data: null, error: json.error.message }
      }

      const result = json.lighthouseResult
      if (!result?.categories) {
        const runtimeError = result?.runtimeError?.message
        if (runtimeError) {
          console.error(`PSI ${strategy} runtime error:`, runtimeError)
          return { data: null, error: runtimeError }
        }
        return { data: null, error: 'No Lighthouse data returned.' }
      }

      return { data: result, error: null }
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Request failed'
      console.error(`PSI ${strategy} fetch failed:`, err)
      return { data: null, error: message }
    }
    finally {
      clearTimeout(timer)
    }
  }

  const runPsi = async (strategy: string) => {
    const withKey = await fetchPsi(strategy, true)
    if (withKey.data) return withKey

    const shouldRetryWithoutKey = !!psiKey
      && !!withKey.error
      && /api key|quota exceeded/i.test(withKey.error)

    if (!shouldRetryWithoutKey) return withKey

    console.warn(`PSI ${strategy}: retrying without API key`)
    return fetchPsi(strategy, false)
  }

  const [mobileRes, desktopRes] = await Promise.all([
    runPsi('mobile'),
    runPsi('desktop'),
  ])

  const mobileData = mobileRes.data
  const desktopData = desktopRes.data

  if (!mobileData && !desktopData) {
    const errors = [mobileRes.error, desktopRes.error].filter(Boolean)
    const combined = errors.join(' · ')

    if (/api key not valid/i.test(combined)) {
      throw createError({
        statusCode: 503,
        message: 'Diagnostic service is temporarily unavailable. Please try again later or contact us directly.',
      })
    }

    if (/quota exceeded/i.test(combined)) {
      throw createError({
        statusCode: 503,
        message: 'Diagnostic service is busy right now. Please try again in a few minutes.',
      })
    }

    throw createError({
      statusCode: 422,
      message: `Could not analyse "${targetUrl}". Make sure the URL is publicly accessible and try again.`,
    })
  }

  // Primary "data" used for scores/audits: prefer mobile, fall back to desktop.
  const data = mobileData || desktopData!
  // Desktop performance is ONLY taken from an actual desktop run — never
  // silently substituted with mobile data (previous code mislabeled mobile
  // scores as "Desktop Performance" whenever the desktop PSI call failed).
  const desktopAvailable = !!desktopData
  const dPerf = desktopData?.categories?.performance?.score ?? null

  const mPerf = data.categories?.performance?.score ?? null
  const mSeo = data.categories?.seo?.score ?? null
  const mA11y = data.categories?.accessibility?.score ?? null
  const mBp = data.categories?.['best-practices']?.score ?? null

  const { problems, solutions } = buildProblemsAndSolutions(data.audits || {})
  const severity = severityLevel(mPerf, mSeo, problems.length)

  // Key metrics
  const lcp = data.audits?.['largest-contentful-paint']?.displayValue || 'N/A'
  const fcp = data.audits?.['first-contentful-paint']?.displayValue || 'N/A'
  const tbt = data.audits?.['total-blocking-time']?.displayValue || 'N/A'
  const cls = data.audits?.['cumulative-layout-shift']?.displayValue || 'N/A'

  // Escape everything that originates from user input (or is derived from
  // it) before it is interpolated into HTML emails.
  const displayName = escapeHtml(name?.trim() || 'there')
  const safeEmail = escapeHtml(trimmedEmail)
  const safeTargetUrl = escapeHtml(targetUrl)
  const domain = escapeHtml(new URL(targetUrl).hostname)
  const analysedAt = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi', dateStyle: 'full', timeStyle: 'short' })

  // ── WhatsApp notification text ────────────────────────────
  const waText = encodeURIComponent(
    `🔍 *New Auto-Diagnosis*\n\n`
    + `👤 *Name:* ${name?.trim() || 'there'}\n`
    + `📧 *Email:* ${trimmedEmail}\n`
    + `🌐 *Site:* ${targetUrl}\n\n`
    + `📊 *Scores (Mobile)*\n`
    + `  ⚡ Performance: ${mPerf !== null ? Math.round(mPerf * 100) : 'N/A'}/100\n`
    + `  🔍 SEO: ${mSeo !== null ? Math.round(mSeo * 100) : 'N/A'}/100\n`
    + `  ♿ Accessibility: ${mA11y !== null ? Math.round(mA11y * 100) : 'N/A'}/100\n\n`
    + `🚨 *Issues Found:* ${problems.length}\n`
    + `📅 ${analysedAt}`,
  )
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`

  // ── Score card HTML helper ────────────────────────────────
  const scoreCard = (label: string, score: number | null) => `
    <td style="text-align:center;padding:12px 8px;">
      <div style="width:64px;height:64px;border-radius:50%;background:${scoreBg(score)};border:3px solid ${scoreColor(score)};display:flex;align-items:center;justify-content:center;margin:0 auto 6px;font-size:18px;font-weight:900;color:${scoreColor(score)}">
        ${score !== null ? Math.round(score * 100) : '?'}
      </div>
      <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">${label}</div>
    </td>`

  // ── Customer report email ─────────────────────────────────
  const customerHtml = `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px;margin:0 auto;background:#f8fafc;padding:24px;border-radius:20px">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);padding:28px 32px;border-radius:14px;margin-bottom:20px;text-align:center">
      <div style="font-size:28px;margin-bottom:8px">🔍</div>
      <h1 style="color:#fff;margin:0 0 4px;font-size:22px;font-weight:900">Your Website Diagnostic Report</h1>
      <p style="color:rgba(255,255,255,0.85);margin:0;font-size:14px">${domain} · Analysed ${analysedAt} (PKT)</p>
    </div>

    <!-- Severity Banner -->
    <div style="background:${severity.bg};border:2px solid ${severity.color};border-radius:12px;padding:16px 20px;margin-bottom:20px;text-align:center">
      <p style="margin:0;font-size:16px;font-weight:900;color:${severity.color}">Overall Status: ${severity.level}</p>
      <p style="margin:6px 0 0;font-size:14px;color:#475569">${severity.message}</p>
    </div>

    <!-- Scores Grid -->
    <div style="background:#fff;border-radius:14px;padding:24px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,0.08)">
      <h2 style="margin:0 0 20px;font-size:16px;font-weight:800;color:#0f172a">📊 PageSpeed Scores</h2>
      <div style="margin-bottom:12px">
        <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em">${mobileData ? 'Mobile' : 'Desktop (mobile scan unavailable)'}</p>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            ${scoreCard('Performance', mPerf)}
            ${scoreCard('SEO', mSeo)}
            ${scoreCard('Accessibility', mA11y)}
            ${scoreCard('Best Practices', mBp)}
          </tr>
        </table>
      </div>
      ${desktopAvailable
        ? `
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid #f1f5f9">
        <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em">Desktop Performance</p>
        <div style="height:10px;background:#f1f5f9;border-radius:9999px;overflow:hidden;margin-top:8px">
          <div style="height:100%;width:${Math.round((dPerf ?? 0) * 100)}%;background:${scoreColor(dPerf)};border-radius:9999px;transition:width 0.3s"></div>
        </div>
        <p style="margin:4px 0 0;font-size:13px;font-weight:700;color:${scoreColor(dPerf)}">${dPerf !== null ? Math.round(dPerf * 100) : 'N/A'}/100</p>
      </div>`
        : ''}
    </div>

    <!-- Core Web Vitals -->
    <div style="background:#fff;border-radius:14px;padding:24px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,0.08)">
      <h2 style="margin:0 0 16px;font-size:16px;font-weight:800;color:#0f172a">⚡ Core Web Vitals${mobileData ? ' (Mobile)' : ' (Desktop)'}</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr style="border-bottom:1px solid #f1f5f9">
          <td style="padding:10px 0;font-size:13px;color:#64748b;font-weight:600">Largest Contentful Paint (LCP)</td>
          <td style="padding:10px 0;font-size:14px;font-weight:800;color:#0f172a;text-align:right">${lcp}</td>
        </tr>
        <tr style="border-bottom:1px solid #f1f5f9">
          <td style="padding:10px 0;font-size:13px;color:#64748b;font-weight:600">First Contentful Paint (FCP)</td>
          <td style="padding:10px 0;font-size:14px;font-weight:800;color:#0f172a;text-align:right">${fcp}</td>
        </tr>
        <tr style="border-bottom:1px solid #f1f5f9">
          <td style="padding:10px 0;font-size:13px;color:#64748b;font-weight:600">Total Blocking Time (TBT)</td>
          <td style="padding:10px 0;font-size:14px;font-weight:800;color:#0f172a;text-align:right">${tbt}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:13px;color:#64748b;font-weight:600">Cumulative Layout Shift (CLS)</td>
          <td style="padding:10px 0;font-size:14px;font-weight:800;color:#0f172a;text-align:right">${cls}</td>
        </tr>
      </table>
    </div>

    <!-- Problems Found -->
    ${problems.length > 0
      ? `
    <div style="background:#fff;border-radius:14px;padding:24px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,0.08)">
      <h2 style="margin:0 0 16px;font-size:16px;font-weight:800;color:#0f172a">🚨 ${problems.length} Issues Found</h2>
      <ul style="margin:0;padding:0;list-style:none">
        ${problems.map(p => `
        <li style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid #f8fafc">
          <span style="color:#ef4444;font-size:16px;line-height:1.4;shrink:0">●</span>
          <span style="font-size:13px;color:#334155;line-height:1.5">${escapeHtml(p)}</span>
        </li>`).join('')}
      </ul>
    </div>`
      : `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:20px;margin-bottom:20px;text-align:center">
      <p style="margin:0;font-size:15px;font-weight:700;color:#166534">🎉 No major issues detected!</p>
    </div>`}

    <!-- Solutions -->
    ${solutions.length > 0
      ? `
    <div style="background:#fff;border-radius:14px;padding:24px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,0.08)">
      <h2 style="margin:0 0 16px;font-size:16px;font-weight:800;color:#0f172a">✅ How to Fix These Issues</h2>
      <ul style="margin:0;padding:0;list-style:none">
        ${solutions.map(s => `
        <li style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid #f8fafc">
          <span style="color:#22c55e;font-size:16px;line-height:1.4">✓</span>
          <span style="font-size:13px;color:#334155;line-height:1.5">${s}</span>
        </li>`).join('')}
      </ul>
    </div>`
      : ''}

    <!-- CTA -->
    <div style="background:linear-gradient(135deg,#0ea5e9,#6366f1);border-radius:14px;padding:28px;text-align:center;margin-bottom:20px">
      <h3 style="color:#fff;margin:0 0 8px;font-size:18px;font-weight:900">Want us to fix all of this for you?</h3>
      <p style="color:rgba(255,255,255,0.85);margin:0 0 20px;font-size:14px">Our engineers can implement every fix — most sites are fully optimised within 7 days.</p>
      <a href="https://wa.me/${WHATSAPP_NUMBER}" style="display:inline-block;background:#fff;color:#0ea5e9;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:800;margin-right:8px">
        💬 WhatsApp Us
      </a>
      <a href="mailto:${NOTIFY_EMAIL}" style="display:inline-block;background:rgba(255,255,255,0.15);color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:800;border:2px solid rgba(255,255,255,0.4)">
        📧 Email Us
      </a>
    </div>

    <p style="font-size:11px;color:#94a3b8;text-align:center">© ${new Date().getFullYear()} RapidByt Solutions · info.rapidbyt@gmail.com · This report was auto-generated</p>
  </div>`

  // ── Internal notification email ───────────────────────────
  const internalHtml = `
  <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:24px;border-radius:16px">
    <div style="background:linear-gradient(135deg,#0ea5e9,#6366f1);padding:20px 28px;border-radius:12px;margin-bottom:20px">
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:900">🔍 New Auto-Diagnosis Request</h1>
      <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px">${domain} · ${analysedAt}</p>
    </div>
    <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:16px">
      <table style="width:100%">
        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px;color:#64748b;font-size:13px;width:120px">Name</td><td style="padding:10px;font-weight:700;color:#0f172a">${displayName}</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px;color:#64748b;font-size:13px">Email</td><td style="padding:10px;font-weight:700"><a href="mailto:${safeEmail}" style="color:#0ea5e9">${safeEmail}</a></td></tr>
        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px;color:#64748b;font-size:13px">Website</td><td style="padding:10px;font-weight:700"><a href="${safeTargetUrl}" style="color:#0ea5e9">${safeTargetUrl}</a></td></tr>
        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px;color:#64748b;font-size:13px">Performance</td><td style="padding:10px;font-weight:700;color:${scoreColor(mPerf)}">${mPerf !== null ? Math.round(mPerf * 100) : 'N/A'}/100 ${mobileData ? 'mobile' : 'desktop'} · ${dPerf !== null ? Math.round(dPerf * 100) : 'N/A'}/100 desktop</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9"><td style="padding:10px;color:#64748b;font-size:13px">SEO</td><td style="padding:10px;font-weight:700;color:${scoreColor(mSeo)}">${mSeo !== null ? Math.round(mSeo * 100) : 'N/A'}/100</td></tr>
        <tr><td style="padding:10px;color:#64748b;font-size:13px">Issues</td><td style="padding:10px;font-weight:700;color:#ef4444">${problems.length} problems found</td></tr>
      </table>
    </div>
    <a href="${whatsappUrl}" style="display:block;background:#22c55e;color:#fff;padding:14px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:800;text-align:center">
      💬 Follow up on WhatsApp
    </a>
  </div>`

  const resend = new Resend(resendApiKey)

  const [customerEmail, internalEmail] = await Promise.allSettled([
    resend.emails.send({
      from: FROM_ADDRESS,
      to: [trimmedEmail],
      subject: `Your Website Diagnostic Report — ${domain} (${problems.length} issues found)`,
      html: customerHtml,
    }),
    resend.emails.send({
      from: FROM_ADDRESS,
      to: [NOTIFY_EMAIL],
      subject: `🔍 New diagnosis: ${domain} — ${problems.length} issues · Score ${mPerf !== null ? Math.round(mPerf * 100) : '?'}/100`,
      html: internalHtml,
      replyTo: trimmedEmail,
    }),
  ])

  const emailSent = customerEmail.status === 'fulfilled'
  if (!emailSent) {
    console.error('Customer diagnostic email failed:', customerEmail.status === 'rejected' ? customerEmail.reason : 'unknown')
  }
  if (internalEmail.status === 'rejected') {
    console.error('Internal diagnostic email failed:', internalEmail.reason)
  }

  return {
    success: true,
    domain: new URL(targetUrl).hostname,
    emailSent,
    scores: {
      performance: mPerf !== null ? Math.round(mPerf * 100) : null,
      seo: mSeo !== null ? Math.round(mSeo * 100) : null,
      accessibility: mA11y !== null ? Math.round(mA11y * 100) : null,
      bestPractices: mBp !== null ? Math.round(mBp * 100) : null,
      desktopPerformance: dPerf !== null ? Math.round(dPerf * 100) : null,
    },
    vitals: { lcp, fcp, tbt, cls },
    problems,
    solutions,
    severity: severity.level,
    whatsappUrl,
  }
})