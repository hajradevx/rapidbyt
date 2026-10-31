---
title: "Paying Too Much for Hosting? Move to Cloudflare and Cut Costs by 60%"
description: "A step-by-step guide to migrating your website to Cloudflare Pages or Workers — free hosting, global CDN, automatic HTTPS, and a faster site. No DevOps experience needed."
date: 2026-10-08
readTime: 16
category: "Development"
author: "RapidByt Team"
tags: ["Cloudflare", "hosting", "website speed", "CDN", "reduce hosting costs", "migration"]
image: "/blog/cloudflare-migration.svg"
---

You're paying $30–100/month for shared hosting. Your site still loads slowly for Pakistani visitors. The server goes down randomly. Support tickets take 24 hours to get a reply.

Meanwhile, the same site could run for free — or near-free — on Cloudflare's global network, with better performance, better uptime, and zero server management.

This guide covers three paths depending on your setup:

- **Option A:** Keep your current hosting, add Cloudflare as a CDN (20 minutes, any site)
- **Option B:** Migrate completely to Cloudflare Pages (free static/SSG hosting)
- **Option C:** Cloudflare Workers for full-stack apps with backend logic

All three are free to start.

---

## What Is Cloudflare, Really?

Cloudflare operates one of the world's largest networks — over 300 data centers in more than 100 countries, including Karachi and Mumbai. When you put your site on Cloudflare, Pakistani visitors load your content from a server physically close to them — not from wherever your hosting server happens to be located.

This isn't just about speed (though speed is enormous). Cloudflare's free plan also includes:

- **Automatic SSL/HTTPS** — managed and renewed automatically
- **DDoS protection** — enterprise-grade, included free
- **Web Application Firewall** — blocks known attack patterns (see [website security guide](/blog/website-security-hardening-guide))
- **Analytics** — traffic data without client-side JavaScript
- **Bot protection** — reduces malicious traffic consuming your resources
- **Global CDN** — static files cached at the nearest edge node

---

## Before You Start: What You Need

Regardless of which option you choose:

1. A **Cloudflare account** (free at cloudflare.com)
2. Access to your **domain registrar** (GoDaddy, Namecheap, Hosting.pk, etc.) — to update nameservers
3. 20–45 minutes

For Options B and C:

- Your site's **source code** in a GitHub or GitLab repository
- Basic familiarity with your framework's build process

---

## Option A: Cloudflare as CDN/Proxy (Any Website, 20 Minutes)

This is the quickest improvement you can make. It doesn't change your hosting at all — it just routes all traffic through Cloudflare's network first.

**What you gain:** CDN caching, DDoS protection, automatic HTTPS, and faster load times for visitors globally. Pakistani visitors load cached content from Cloudflare's Karachi node instead of your origin server.

**What stays the same:** Your WordPress installation, your database, your files — all still on your original host.

### Step 1: Add Your Domain to Cloudflare

1. Log in to [cloudflare.com](https://cloudflare.com) → click "Add a site"
2. Enter your domain (e.g., `example.com` — no www)
3. Select the **Free** plan → Continue
4. Cloudflare scans your existing DNS records automatically

### Step 2: Review DNS Records

Cloudflare shows you all your existing DNS records. Review them carefully:

- **Orange cloud (proxied)** = traffic goes through Cloudflare → gets CDN + protection
- **Grey cloud (DNS only)** = Cloudflare just manages DNS, no proxying

Set your main A records (for your website) to orange cloud. Leave any records for email (MX, SPF, DKIM) as DNS-only — do not proxy email records.

```
A  @  203.0.113.1    → Orange cloud ✅
A  www  203.0.113.1  → Orange cloud ✅
MX  @  mail.example.com  → Grey cloud (email, don't proxy) ✅
```

### Step 3: Update Nameservers at Your Registrar

Cloudflare gives you two nameserver addresses:

```
ns1.cloudflare.com
ns2.cloudflare.com
```

Go to your domain registrar → Nameservers → Replace existing nameservers with Cloudflare's.

Propagation takes 24–48 hours typically, but often completes in under 2 hours.

### Step 4: Configure Key Settings

Once active (Cloudflare dashboard shows "Active"), configure:

**SSL/TLS settings:**

- SSL/TLS → Overview → Set to **"Full (Strict)"**
- Edge Certificates → **Always Use HTTPS** → On
- Edge Certificates → **HTTP Strict Transport Security (HSTS)** → Enable (min-age: 6 months)

**Performance settings:**

- Speed → Optimization → **Auto Minify** → Enable HTML, CSS, JavaScript
- Speed → Optimization → **Brotli** → On
- Speed → Optimization → **Rocket Loader** → Test this (can improve JS-heavy sites, may break some)

**Caching settings:**

- Caching → Configuration → **Browser Cache TTL** → "1 year" for maximum caching
- Caching → Configuration → **Caching Level** → "Standard"

**Security settings:**

- Security → Settings → **Security Level** → "Medium"
- Security → Bots → **Bot Fight Mode** → On (reduces fake traffic)

### Step 5: Verify It's Working

After propagation, visit your site in a new incognito window. In Chrome DevTools → Network tab → click your domain request → look for the header `cf-ray` — this confirms traffic is going through Cloudflare.

Also run [PageSpeed Insights](https://pagespeed.web.dev) before and after. For Pakistani visitors, typical improvement: 0.5–1.5 seconds faster on initial load, 70%+ faster on repeat visits (cached from Cloudflare edge).

---

## Option B: Full Migration to Cloudflare Pages (Free Static Hosting)

If your site is static, SSG (statically generated), or built with Nuxt/Next.js/Astro in static mode — you can host it completely free on Cloudflare Pages with zero ongoing hosting costs.

**What you get:**

- Unlimited requests and bandwidth
- Automatic deployments from GitHub
- Preview deployments for every pull request
- Custom domain with automatic SSL
- Global CDN at 300+ locations

### Requirements

- Source code in a **GitHub or GitLab** repository
- Your framework can build to static HTML (Nuxt SSG, Next.js static export, Astro, etc.)
- Environment variables needed (stored securely in Cloudflare Pages settings)

### Step 1: Push Code to GitHub

If your code isn't in GitHub yet:

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit for Cloudflare Pages migration"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/your-site.git
git push -u origin main
```

### Step 2: Connect Cloudflare Pages to GitHub

1. Cloudflare Dashboard → **Workers & Pages** → **Create**
2. Select **Pages** → **Connect to Git**
3. Authorize GitHub → Select your repository
4. Click **Begin Setup**

### Step 3: Configure Build Settings

Cloudflare Pages auto-detects most frameworks. Verify or manually set:

**Nuxt 4 (Static Site Generation):**

```
Framework preset: Nuxt.js
Build command: nuxt generate
Output directory: .output/public
Node.js version: 22
```

**Next.js (Static Export):**

```
Framework preset: Next.js
Build command: next build
Output directory: out
```

(Requires `output: 'export'` in `next.config.js`)

**Astro:**

```
Framework preset: Astro
Build command: astro build
Output directory: dist
```

**React (Create React App):**

```
Framework preset: Create React App
Build command: npm run build
Output directory: build
```

**Plain HTML:**

```
Build command: (leave empty)
Output directory: / (or wherever your index.html lives)
```

**Hugo, Jekyll, Gatsby** — all have preset options in the dropdown.

### Step 4: Add Environment Variables

Settings → Environment Variables → Add secrets needed for build:

```
NUXT_API_KEY=your_api_key
DATABASE_URL=your_db_url
```

Variables added here are encrypted at rest and available during builds. Never commit `.env` files to your repository.

### Step 5: Deploy

Click **Save and Deploy**. Cloudflare:

1. Clones your repo
2. Installs dependencies (`npm install`)
3. Runs your build command
4. Deploys the output to 300+ global edge locations

First deployment: 2–5 minutes. After that, every push to `main` triggers automatic redeployment — usually within 60 seconds.

### Step 6: Connect Your Custom Domain

1. Workers & Pages → your project → **Custom Domains**
2. Click **Set up a custom domain**
3. Enter `yourwebsite.com`
4. If your domain is on Cloudflare: DNS records added automatically
5. If not: follow the instructions to add a CNAME record

Cloudflare provisions an SSL certificate automatically. HTTPS is active within minutes.

### Preview Deployments

Every git branch automatically gets a preview URL. Push a branch called `feature/new-homepage` and Cloudflare creates `feature-new-homepage.yoursite.pages.dev` automatically. Test any change before merging to main. This is a genuine professional workflow included in the free tier.

---

## Option C: Cloudflare Workers (Dynamic Apps with Server Logic)

If your site has a backend — database queries, user authentication, API routes, server-side rendering — Cloudflare Workers runs your server code at the edge in 300+ locations worldwide.

This is the most powerful option. Your server-side code runs physically close to every visitor, eliminating the geographic latency that makes traditional server hosting slow.

### Workers Free Tier

| Resource             | Free Allowance                  |
| -------------------- | ------------------------------- |
| Requests             | 100,000/day                     |
| CPU time             | 10ms per request                |
| D1 Database (SQLite) | 500MB storage, 5M row reads/day |
| R2 Object Storage    | 10GB storage, 1M reads/month    |
| KV Store             | 100K reads/day, 1K writes/day   |
| Cron Triggers        | 3 per account                   |

For most small to medium sites, the free tier is sufficient indefinitely.

### Basic Worker Setup

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create a new Workers project
npm create cloudflare@latest my-app
# Select: "Hello World" Worker or your preferred template

# Start local development
wrangler dev

# Deploy to production
wrangler deploy
```

### Nuxt 4 + Cloudflare Workers (Full Stack)

This is the setup RapidByt uses — a full-stack Nuxt application running on Cloudflare Workers with server-side rendering, API routes, and D1 database — all at the edge.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
});
```

```toml
# wrangler.toml
name = "my-nuxt-app"
compatibility_date = "2026-10-01"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "your-d1-id"
```

```bash
# Build and deploy
nuxt build
wrangler deploy
```

Your entire Nuxt app — SSR, API routes, database access — runs at Cloudflare's edge. Zero cold starts. Sub-5ms response from virtually anywhere.

### Next.js on Cloudflare Workers

```bash
npm create cloudflare@latest my-next-app -- --framework=next
```

Cloudflare provides an official Next.js adapter with Workers. Most Next.js features work, with some edge-runtime specific limitations.

### Using D1 (SQLite at the Edge)

D1 is Cloudflare's distributed SQLite database. It runs at the edge alongside your Workers — no separate database server to manage.

```typescript
// In a Nuxt server route or Worker handler
export default defineEventHandler(async (event) => {
  const db = hubDatabase(); // or event.env.DB for raw Workers

  const users = await db.prepare("SELECT * FROM users WHERE active = ?").bind(true).all();

  return users.results;
});
```

D1 supports full SQLite syntax and integrates with Drizzle ORM for type-safe queries.

---

## Performance Comparison: Real Numbers

After migrating clients from shared hosting to Cloudflare, here's what we typically see:

| Metric           | Shared Hosting | Cloudflare Pages/Workers |
| ---------------- | -------------- | ------------------------ |
| TTFB (Pakistan)  | 300–800ms      | 20–80ms                  |
| PageSpeed Mobile | 40–65          | 85–98                    |
| Uptime           | 99.5%          | 99.99%+                  |
| Monthly cost     | $10–100        | $0–5                     |
| DDoS protection  | None or basic  | Enterprise-grade         |
| SSL management   | Manual/annual  | Automatic                |
| Deployment       | FTP or cPanel  | Git push                 |

The performance gap is substantial. Every second saved in load time translates to measurable conversion improvements — a 1-second improvement can increase conversions by 7–20%. See the [page speed and revenue guide](/blog/why-page-speed-matters-for-revenue) for the full data.

---

## Common Migration Issues and Fixes

### "My Contact Form Stopped Working"

Static sites hosted on Pages can't process form submissions server-side. Options:

**Option 1 — Cloudflare Pages Functions (free):**

```javascript
// functions/api/contact.js
export async function onRequestPost(context) {
  const body = await context.request.json();

  // Send via Resend or similar
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "noreply@yourdomain.com",
      to: "you@yourdomain.com",
      subject: "New contact form submission",
      html: `<p>Name: ${body.name}</p><p>Message: ${body.message}</p>`,
    }),
  });

  return new Response(JSON.stringify({ success: true }));
}
```

**Option 2 — Third-party form service:**

- [Formspree](https://formspree.io) — free for 50 submissions/month
- [Web3Forms](https://web3forms.com) — 250 submissions/month free
- [Netlify Forms](https://netlify.com) — if also using Netlify for anything

### "My WordPress Site Can't Move to Cloudflare Pages"

Cloudflare Pages hosts static files — it cannot run PHP. WordPress needs PHP.

**Options for WordPress:**

1. Use **Cloudflare as CDN only** (Option A) — keeps WordPress on your current host, adds Cloudflare's speed layer
2. Migrate WordPress to Cloudflare's **[Automatic Platform Optimization (APO)](https://developers.cloudflare.com/automatic-platform-optimization/wordpress/)** — $5/month, caches WordPress pages at the edge
3. Migrate to a headless WordPress + Cloudflare Pages setup (complex, advanced)

For most WordPress sites, Option A + APO is the practical solution.

### "Build Fails on Cloudflare Pages"

Common causes:

```bash
# Check Node.js version — set in Pages settings
# Environment variable: NODE_VERSION=20

# Missing environment variables
# Add all vars from your .env to Pages settings

# Package installation fails
# Check if your lock file (package-lock.json or pnpm-lock.yaml) is committed

# Build command wrong
# Test your build locally first: npm run build
```

### "My Images Are Broken After Migration"

Check that all image paths in your code are relative, not absolute paths to a local machine. All images must be in your repository or served from an external URL.

```javascript
// Wrong — absolute machine path
<img src="/Users/ahmed/projects/website/public/logo.png" />

// Right — relative path (file committed to repo)
<img src="/logo.png" />

// Right — external URL
<img src="https://cdn.example.com/logo.png" />
```

### "APIs Use Node.js Built-ins That Don't Work on Workers"

Workers runs V8 isolates, not Node.js. Most Node.js APIs are available through the compatibility flag:

```toml
# wrangler.toml
compatibility_flags = ["nodejs_compat"]
```

This covers `fs`, `path`, `crypto`, `buffer`, and most common Node.js modules. A small number of APIs (like `child_process`, `net`) aren't supported — but most web application code doesn't need them.

---

## Is Cloudflare Right for Your Site?

**Excellent fit:**

- Portfolio/brochure sites
- Marketing landing pages
- Blogs with Nuxt Content, Astro, or Next.js
- Documentation sites
- API backends with Workers
- SaaS applications using edge-compatible frameworks

**Works with extra setup:**

- WordPress (use as CDN, or APO for full caching)
- Sites with large file uploads (use R2 storage + Workers)
- Sites with complex session handling (use Workers KV or D1)

**Requires alternative approach:**

- Legacy PHP applications that depend on server-specific features
- Sites needing persistent filesystem writes (use R2 instead)
- Sites requiring specific OS-level software

---

## Frequently Asked Questions

**Is Cloudflare free really free forever?**
Yes — the free tier has no time limit. The 100,000 requests/day Workers limit and the generous Pages limits are permanent. Cloudflare makes money from enterprise customers — the free tier is their way of building ecosystem loyalty.

**Will migrating affect my SEO?**
Done correctly, migration improves SEO. Faster load times and better Core Web Vitals are ranking factors. The key is ensuring all URLs remain the same (no structure changes) and canonical tags are correct.

**How do I handle database-dependent features on static Cloudflare Pages?**
Use Cloudflare Pages Functions (serverless functions included free) or Cloudflare Workers. Connect to D1 for SQLite, or any external database via fetch().

**Can I use Cloudflare for an e-commerce site?**
Yes. Cloudflare Works + D1 handles the backend. Or keep WooCommerce/Shopify on their own infrastructure and use Cloudflare as CDN only.

**What if I want to revert after migrating?**
Change your nameservers back at your registrar. DNS propagation takes up to 24 hours, but your site will be back on your original host within that window.

---

## Get Help with the Migration

Cloudflare migration is one of our core services. We handle the DNS transition, build configuration, environment variable setup, database migration if needed, and full testing — with zero downtime.

Clients typically see:

- 40–70% faster load times for Pakistani visitors
- PageSpeed mobile score improvement of 20–40 points
- Hosting cost reduction from $30–100/month to $0–5/month

[Request a migration assessment →](/contact) — free, includes a performance estimate and cost comparison for your specific setup.
