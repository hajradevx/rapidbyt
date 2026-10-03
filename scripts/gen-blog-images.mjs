import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'

const OUT = 'public/blog'
await mkdir(OUT, { recursive: true })

// Category → gradient colors (top-left, bottom-right)
const categoryColors = {
  Performance: { from: '#0ea5e9', to: '#2563eb' },   // sky → blue
  SEO:         { from: '#8b5cf6', to: '#6d28d9' },   // violet
  Security:    { from: '#ef4444', to: '#b91c1c' },   // red
  Marketing:   { from: '#f59e0b', to: '#d97706' },   // amber
  Tools:       { from: '#10b981', to: '#047857' },   // emerald
  Business:    { from: '#6366f1', to: '#4338ca' },   // indigo
  Technical:   { from: '#0ea5e9', to: '#0369a1' },   // sky
  Default:     { from: '#64748b', to: '#334155' },   // slate
}

const posts = [
  { file: 'web-hosting-pakistan-2026.jpg',   title: 'Best Web Hosting\nPakistan 2026',     category: 'Business' },
  { file: 'chatgpt-seo-safe.jpg',            title: 'ChatGPT Content:\nSEO Safe?',          category: 'SEO' },
  { file: 'competetor.jpg',                  title: 'Competitor Outranking\nYou on Google', category: 'SEO' },
  { file: 'contact-form-not-working.jpg',    title: 'Contact Form Emails\nNot Arriving',    category: 'Technical' },
  { file: 'fast-site-no-conversions.jpg',    title: 'Fast Site, Still\nLosing Sales?',      category: 'Marketing' },
  { file: 'free-speed-check-tools.jpg',      title: 'Free Website Speed\nCheck Tools',      category: 'Tools' },
  { file: 'first-1000-visitors.jpg',         title: 'First 1000 Visitors\nWithout Paid Ads',category: 'Marketing' },
  { file: 'google-ads-not-converting.jpg',   title: 'Google Ads\nNot Converting',           category: 'Marketing' },
  { file: 'google-ads-vs-facebook-ads.jpg',  title: 'Google Ads vs\nFacebook Ads 2026',     category: 'Marketing' },
  { file: 'google-analytics-not-working.jpg',title: 'Google Analytics\nNot Working Fix',    category: 'Technical' },
  { file: 'search-console-setup.jpg',        title: 'Google Search Console\nSetup Guide',   category: 'SEO' },
  { file: 'bounce-rate-fixes.jpg',           title: 'High Bounce Rate:\nCauses & Fixes',    category: 'Performance' },
  { file: 'cloudflare-migration.jpg',        title: 'Move to Cloudflare\n& Cut Costs',      category: 'Technical' },
  { file: 'images-blurry-fix.jpg',           title: 'Images Loading\nBlurry? Fix It',       category: 'Performance' },
  { file: 'nuxt-cloudflare-d1-debug.jpg',    title: 'Nuxt + Cloudflare\nD1 Debug Guide',    category: 'Technical' },
  { file: 'shopify-vs-woocommerce.jpg',      title: 'Shopify vs\nWooCommerce 2026',         category: 'Business' },
  { file: 'ssl-certificate-errors.jpg',      title: 'SSL Certificate\nErrors: Fix Guide',   category: 'Security' },
  { file: 'technical-seo-checklist.jpg',     title: 'Technical SEO\nChecklist 2026',        category: 'SEO' },
  { file: 'traffic-no-conversions.jpg',      title: 'Traffic Not\nConverting? Fix It',      category: 'Marketing' },
  { file: 'website-broken-mobile.jpg',       title: 'Website Broken\non Mobile: Fix',       category: 'Performance' },
  { file: 'website-down.jpg',                title: 'Website Down?\nWhat To Do Now',        category: 'Technical' },
  { file: 'website-security.jpg',            title: 'Website Security\nHardening Guide',    category: 'Security' },
  { file: 'website-not-on-google.jpg',       title: 'Why Is My Site Not\nShowing on Google',category: 'SEO' },
  { file: 'wordpress-slow-fix.jpg',          title: 'WordPress Slow?\nComplete Fix Guide',  category: 'Performance' },
  { file: 'wordpress-vs-webflow.jpg',        title: 'WordPress vs\nWebflow 2026',           category: 'Business' },
]

// Escape XML special characters
function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// Build SVG with gradient background + RapidByt branding + title text
function makeSvg(title, category) {
  const colors = categoryColors[category] || categoryColors.Default
  const lines = title.split('\n').map(esc)
  const y1 = lines.length === 1 ? 290 : 268
  const y2 = 318

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.from};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:${colors.to};stop-opacity:1"/>
    </linearGradient>
    <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#000000;stop-opacity:0"/>
      <stop offset="100%" style="stop-color:#000000;stop-opacity:0.35"/>
    </linearGradient>
  </defs>

  <!-- Background gradient -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#overlay)"/>

  <!-- Decorative circles -->
  <circle cx="980" cy="100" r="280" fill="white" fill-opacity="0.05"/>
  <circle cx="1100" cy="520" r="160" fill="white" fill-opacity="0.05"/>
  <circle cx="120" cy="500" r="200" fill="white" fill-opacity="0.04"/>

  <!-- Grid dots pattern -->
  <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="1.5" fill="white" fill-opacity="0.12"/>
  </pattern>
  <rect width="1200" height="630" fill="url(#dots)"/>

  <!-- Category badge -->
  <rect x="60" y="60" width="${category.length * 12 + 40}" height="36" rx="18" fill="white" fill-opacity="0.2"/>
  <text x="${60 + (category.length * 12 + 40) / 2}" y="83" font-family="system-ui,-apple-system,sans-serif" font-size="16" font-weight="600" fill="white" text-anchor="middle" letter-spacing="1">${esc(category).toUpperCase()}</text>

  <!-- Main title line 1 -->
  <text x="60" y="${y1}" font-family="system-ui,-apple-system,sans-serif" font-size="68" font-weight="800" fill="white" letter-spacing="-1">${lines[0]}</text>
  ${lines[1] ? `<text x="60" y="${y2}" font-family="system-ui,-apple-system,sans-serif" font-size="68" font-weight="800" fill="white" fill-opacity="0.92" letter-spacing="-1">${lines[1]}</text>` : ''}

  <!-- Branding -->
  <text x="60" y="580" font-family="system-ui,-apple-system,sans-serif" font-size="22" font-weight="700" fill="white" fill-opacity="0.85">RapidByt.com</text>
  <text x="1140" y="580" font-family="system-ui,-apple-system,sans-serif" font-size="18" fill="white" fill-opacity="0.6" text-anchor="end">Web Performance</text>
</svg>`
}

let created = 0
let skipped = 0

for (const post of posts) {
  const outPath = `${OUT}/${post.file}`
  if (existsSync(outPath)) {
    console.log(`  skip  ${post.file}`)
    skipped++
    continue
  }
  const svg = makeSvg(post.title, post.category)
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outPath)
  console.log(`  ✔  ${post.file}`)
  created++
}

console.log(`\nDone — ${created} created, ${skipped} skipped`)
