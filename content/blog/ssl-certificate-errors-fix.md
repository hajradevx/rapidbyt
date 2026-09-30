---
title: "SSL Certificate Errors: Why Visitors See 'Your Connection Is Not Private' — And How to Fix It"
description: "The red warning screen drives away nearly every visitor who sees it. Here's every type of SSL error, what causes it, and the exact steps to fix each one — including expired certs, mixed content, and misconfigured hosts."
date: 2026-10-28
readTime: 8
category: "Security"
author: "RapidByt Team"
tags:
  [
    "SSL certificate",
    "HTTPS",
    "connection not private",
    "mixed content",
    "certificate expired",
    "security",
  ]
image: "/blog/ssl-certificate-errors.jpg"
---

Your visitor types in your URL. Instead of your website, Chrome shows:

> **Your connection is not private**
> Attackers might be trying to steal your information from yoursite.com

Most users close the tab immediately. Very few click "Advanced" and proceed anyway. That warning screen is costing you an unknown number of visitors every day.

Here's every type of SSL error, why it happens, and how to fix it.

---

## Understanding SSL/TLS Certificates

An SSL certificate does two things:

1. **Encrypts** the connection between the visitor's browser and your server
2. **Verifies** that your website is actually who it claims to be

Without a valid certificate, browsers show security warnings. With one, your URL shows `https://` and a padlock icon — the baseline signal of trustworthiness in 2026.

---

## Error Type 1: Expired Certificate

**What the visitor sees:**

> NET::ERR_CERT_DATE_INVALID
> Your connection is not private

**Why it happens:** SSL certificates expire. Most are valid for 90 days (Let's Encrypt) or 1–2 years (paid certificates). If renewal isn't automated, they expire silently.

**How to check your certificate expiry:**

```bash
# Check certificate expiry date from command line
echo | openssl s_client -connect yoursite.com:443 2>/dev/null | openssl x509 -noout -dates
```

Or just visit your site in Chrome, click the padlock icon → "Certificate is valid" → check the expiry date.

**Fix for Let's Encrypt (most hosting):**

Let's Encrypt certificates should auto-renew via certbot. If they're not:

```bash
# Test renewal
sudo certbot renew --dry-run

# Force renewal now
sudo certbot renew --force-renewal

# Check the certbot cron job exists
sudo crontab -l | grep certbot
```

If the cron job is missing, add it:

```bash
# Add to crontab — runs renewal check twice daily
sudo crontab -e
0 0,12 * * * certbot renew --quiet
```

**Fix for Cloudflare users:**

Cloudflare manages SSL certificates automatically. If you're seeing a certificate error while using Cloudflare, check that:

1. Your SSL/TLS mode is set to "Full (Strict)" — not "Flexible"
2. The origin certificate on your server is also valid
3. Cloudflare → SSL/TLS → Overview shows "Active Certificate"

**Fix for cPanel hosting:**

cPanel → SSL/TLS → Manage SSL sites → check expiry dates → use "AutoSSL" to renew (most cPanel hosts include this free).

---

## Error Type 2: Self-Signed Certificate

**What the visitor sees:**

> NET::ERR_CERT_AUTHORITY_INVALID

**Why it happens:** You (or your hosting setup) generated a certificate yourself instead of getting one from a trusted Certificate Authority. Self-signed certs are fine for development but not for production.

**Fix:**

Replace the self-signed cert with a free Let's Encrypt certificate:

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx  # For Nginx
sudo apt-get install certbot python3-certbot-apache # For Apache

# Get and install certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
# or
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
```

If you're on shared hosting without server access, use your hosting control panel's AutoSSL feature, or point your domain to Cloudflare and use their free SSL.

---

## Error Type 3: Wrong Domain on Certificate

**What the visitor sees:**

> NET::ERR_CERT_COMMON_NAME_INVALID
> The certificate is only valid for other-domain.com

**Why it happens:** The SSL certificate was issued for a different domain than the one the visitor is accessing. Common causes:

- Certificate was issued for `www.yoursite.com` but visitor goes to `yoursite.com` (or vice versa)
- You moved to a new domain but the old certificate is still being served
- The certificate doesn't include all the subdomains you're using

**Fix:**

Get a certificate that covers both `yoursite.com` and `www.yoursite.com`:

```bash
sudo certbot --nginx -d yoursite.com -d www.yoursite.com
```

For multiple subdomains, use a wildcard:

```bash
sudo certbot --nginx -d yoursite.com -d "*.yoursite.com"
# Note: wildcard requires DNS challenge, not HTTP challenge
```

---

## Error Type 4: Mixed Content Warning

**What the visitor sees:** The page loads with HTTPS but the padlock has a warning triangle, or some elements don't load. In the browser console:

> Mixed Content: The page was loaded over HTTPS, but requested an insecure resource 'http://...'

**Why it happens:** Your page is served over HTTPS but some resources (images, scripts, CSS, iframes) are loaded over HTTP. Browsers block or warn about these.

**How to find mixed content:**

1. Open Chrome DevTools → Console tab → look for "Mixed Content" warnings
2. Or use [Why No Padlock](https://www.whynopadlock.com) — paste your URL and it lists all HTTP resources

**Fix: Update all resource URLs to HTTPS**

In your HTML and CSS, change every `http://` reference to `https://`:

```html
<!-- Bad -->
<img src="http://example.com/image.jpg" />
<script src="http://cdn.example.com/script.js"></script>

<!-- Good -->
<img src="https://example.com/image.jpg" />
<script src="https://cdn.example.com/script.js"></script>
```

**For WordPress:** Install the "Really Simple SSL" plugin — it handles most mixed content automatically.

**Database search and replace for WordPress:**

```sql
UPDATE wp_posts SET post_content =
  REPLACE(post_content, 'http://yoursite.com', 'https://yoursite.com');

UPDATE wp_options SET option_value =
  REPLACE(option_value, 'http://yoursite.com', 'https://yoursite.com')
  WHERE option_name IN ('siteurl', 'home');
```

**Add a Content Security Policy upgrade header** as a catch-all:

```
Content-Security-Policy: upgrade-insecure-requests
```

This tells browsers to automatically upgrade HTTP sub-requests to HTTPS where possible.

---

## Error Type 5: Certificate Chain Incomplete

**What the visitor sees:**

> ERR_SSL_VERSION_OR_CIPHER_MISMATCH
> or various "certificate chain" errors in some browsers

**Why it happens:** SSL certificates come in chains — your certificate, an intermediate certificate, and a root certificate. If the intermediate certificate is missing from your server's configuration, some browsers can't verify the chain.

**Fix for Nginx:**

```nginx
# Your certificate should include the full chain
ssl_certificate /etc/letsencrypt/live/yoursite.com/fullchain.pem;  # full chain
ssl_certificate_key /etc/letsencrypt/live/yoursite.com/privkey.pem;

# NOT this (missing intermediate)
ssl_certificate /etc/letsencrypt/live/yoursite.com/cert.pem;
```

**Fix for Apache:**

```apache
SSLCertificateFile /etc/letsencrypt/live/yoursite.com/cert.pem
SSLCertificateKeyFile /etc/letsencrypt/live/yoursite.com/privkey.pem
SSLCertificateChainFile /etc/letsencrypt/live/yoursite.com/chain.pem
```

Test your certificate chain at [SSL Labs](https://www.ssllabs.com/ssltest/) — it gives you a letter grade and identifies chain issues.

---

## Error Type 6: HTTP → HTTPS Redirect Missing or Wrong

Your certificate is valid, but visitors who type `http://yoursite.com` don't get redirected to HTTPS — they see either the HTTP version (no padlock) or an error.

**Fix for Nginx:**

```nginx
server {
  listen 80;
  server_name yoursite.com www.yoursite.com;
  return 301 https://yoursite.com$request_uri;
}

server {
  listen 443 ssl;
  server_name yoursite.com;
  # ... rest of your config
}
```

**Fix for Apache (.htaccess):**

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

**Fix for Cloudflare:**

Cloudflare → SSL/TLS → Edge Certificates → Always Use HTTPS → turn on.

Also enable HSTS while you're there:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

This tells browsers to always use HTTPS for your domain, even before making the first request.

---

## The SSL Health Checklist

Run through these after any SSL fix:

- [ ] Certificate is valid and not expired (check padlock in browser)
- [ ] Certificate covers both `yoursite.com` and `www.yoursite.com`
- [ ] HTTP redirects to HTTPS (test with `curl -I http://yoursite.com`)
- [ ] No mixed content warnings (check DevTools console)
- [ ] Full certificate chain present ([SSL Labs test](https://www.ssllabs.com/ssltest/))
- [ ] HSTS header set
- [ ] Auto-renewal is configured and tested (`certbot renew --dry-run`)

**Score yourself:** SSL Labs gives you an A+ if all of the above are correctly configured. Anything below B is visible to technically savvy users and some enterprise security tools.

---

## SSL on Cloudflare (The Easiest Path)

If you're on shared hosting with a complicated SSL setup, the fastest fix is often to put Cloudflare in front of your site. Cloudflare:

- Manages SSL certificates automatically (renews itself)
- Forces HTTPS on all connections
- Serves your site over their CDN (faster loading)
- Handles the certificate chain correctly

See our [Cloudflare migration guide](/blog/how-to-move-to-cloudflare-and-cut-hosting-costs) for the full setup process.

---

If you're seeing an SSL error you can't diagnose from this guide, [get in touch](/contact). SSL misconfigurations are usually fixable within an hour — and the impact on visitor trust and SEO ranking is immediate once fixed.
