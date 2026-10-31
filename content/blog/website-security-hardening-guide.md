---
title: "My Website Got Hacked — What to Do Now (And How to Prevent It)"
description: "Your website was hacked or defaced. Here's the step-by-step recovery process, plus 12 security hardening measures to prevent it happening again."
date: 2026-09-28
readTime: 17
category: "Security"
author: "RapidByt Team"
tags: ["website hacked", "security", "malware", "WordPress security", "SSL", "firewall"]
image: "/blog/website-security.svg"
---

You wake up to an email from a client: "Your website is showing weird content." Or Google Search Console says your site is distributing malware. Or your homepage has been replaced with a hacker's defacement page in Arabic or Chinese characters.

Panic sets in. What do you do first?

Website hacks are not rare. According to Sucuri's annual hacked website research, WordPress sites account for over 90% of all CMS hacks — and the majority are through known vulnerabilities in outdated plugins, not sophisticated attacks. In Pakistan, where many small businesses run WordPress on cheap shared hosting with no security configuration, this problem is common and largely preventable.

This guide covers emergency recovery in the first 30 minutes, then a complete hardening plan to prevent it happening again.

---

## EMERGENCY: First 30 Minutes

Stay calm and work through this in order. The actions you take in the first 30 minutes determine how much damage gets done.

### Step 1: Take Your Site Offline Immediately

If your site is actively serving malware, spam links, or phishing content — your visitors, your email reputation, and your SEO are all at risk every minute it stays live. Google will blacklist your domain if it detects you're serving malware, which causes far more damage than temporary downtime.

**Options to take offline quickly:**

**Option A — Add a maintenance page (fastest)**
Replace your index.php or index.html temporarily:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Maintenance in Progress</title>
    <meta name="robots" content="noindex" />
    <style>
      body {
        font-family: sans-serif;
        text-align: center;
        padding: 80px 20px;
      }
      h1 {
        color: #1a1a1a;
      }
      p {
        color: #666;
      }
    </style>
  </head>
  <body>
    <h1>We're performing urgent maintenance.</h1>
    <p>We'll be back online shortly. Thank you for your patience.</p>
    <p>For urgent enquiries: your@email.com</p>
  </body>
</html>
```

**Option B — Password protect the directory**
Via cPanel → Directory Privacy → enable password protection on your public_html folder. This blocks all public access immediately.

**Option C — Cloudflare Under Attack Mode**
If you're on Cloudflare: Security → Under Attack Mode. This forces all visitors through a JavaScript challenge before allowing access — effectively blocking the attack traffic while you investigate.

### Step 2: Change Every Password — All of Them

The attacker may have your passwords. Change all of these before doing anything else:

- **Hosting control panel** (cPanel, Plesk, or your host's dashboard)
- **FTP/SFTP credentials** — these are separate from cPanel logins
- **Database password** — in cPanel → MySQL Databases, then update wp-config.php
- **WordPress admin password** (or your CMS admin)
- **Email accounts** associated with the domain
- **Domain registrar** — to prevent domain theft
- **Any API keys** in your `.env` or config files (Stripe, Resend, etc.)

Use a password manager. Generate 20+ character random passwords. Write none of them down on paper near your desk.

**Enable 2FA everywhere it's offered.** Your hosting panel, your WordPress login, your domain registrar. SMS 2FA is acceptable — authenticator app (Google Authenticator, Authy) is better.

### Step 3: Scan for Malware

**Free online scanners:**

- [Sucuri SiteCheck](https://sitecheck.sucuri.net) — paste your URL for an instant malware scan. Identifies blacklisting status, malware signatures, and SEO spam.
- [VirusTotal](https://virustotal.com) — checks your URL against 70+ antivirus engines simultaneously
- Google Search Console → Security Issues tab — if Google has detected malware, it will be listed here with the specific pages affected

**Server-side scanning (if you have SSH access):**

```bash
# Find PHP files modified in the last 7 days (common attack vector)
find /var/www/html -name "*.php" -mtime -7 -ls

# Find recently modified files across all types
find /var/www/html -newer /var/www/html/wp-config.php -ls | tail -50

# Search for common malware signatures in PHP files
grep -r "base64_decode\|eval(base64\|system(\|exec(\|passthru(" \
  /var/www/html --include="*.php" -l

# Find PHP files in upload directories (shouldn't be there)
find /var/www/html/wp-content/uploads -name "*.php" -ls
```

Malware is commonly injected into:

- Core CMS files (wp-config.php, functions.php)
- Plugin files (attackers replace legitimate plugin files)
- Uploaded files directory (malicious PHP files disguised as images)
- `.htaccess` file (adding redirect rules to spam sites)

### Step 4: Restore from a Clean Backup

This is the fastest and most reliable recovery method if you have backups. Restore to a snapshot from before the hack occurred.

**How to find when the hack happened:**

1. Check Google Search Console → Security Issues → when the issue was first detected
2. Check your hosting server logs for unusual access patterns
3. Look at the modification dates of suspicious files found in Step 3

Restore to a backup from 1 day before that date.

**If you don't have backups** — document this painfully, because it means rebuilding from scratch or manually cleaning the infection. Manual cleaning is risky because you may miss hidden backdoors. After this incident, **automated backups are non-negotiable.** See Prevention Point 10 below.

If the hack caused complete downtime, follow the recovery steps in our [website down guide](/blog/website-down-what-to-do) alongside this one.

### Step 5: Identify and Close the Entry Point

Before going back online, understand how they got in. If you don't close the door, they come back within hours.

**Most common attack entry points:**

| Entry Point               | How to Check                                  | How to Close                                                          |
| ------------------------- | --------------------------------------------- | --------------------------------------------------------------------- |
| Outdated plugin/theme     | Check plugin versions vs current releases     | Update everything; delete unused plugins                              |
| Weak admin password       | Was the admin password "admin123" or similar? | Already changed in Step 2 — also check for new admin accounts created |
| Nulled/pirated plugins    | Do you have any paid plugins obtained free?   | Remove immediately — they contain backdoors by design                 |
| Exposed `.env` file       | Visit yourdomain.com/.env in browser          | Must be blocked at server level (see Prevention #5)                   |
| Old PHP version           | In cPanel, check PHP version                  | Upgrade to PHP 8.2+                                                   |
| File upload exploit       | Check uploads folder for .php files           | Remove PHP files; restrict upload types                               |
| Shared hosting compromise | Another site on your server was hacked        | Contact host; consider moving to VPS                                  |

---

## Prevention: 12 Security Measures to Implement Now

These are ordered from highest impact to implementation complexity. The first 5 should be done today.

### 1. Update Everything — Always

Outdated software is responsible for the majority of WordPress hacks. Plugin developers release security patches when vulnerabilities are discovered. The window between a vulnerability being published and attackers exploiting it is often **hours**, not days.

```bash
# WordPress CLI — update core, plugins, themes in one command
wp core update
wp plugin update --all
wp theme update --all

# Check PHP version
php -v  # Should be 8.1 or higher in 2026
```

**WordPress dashboard approach:**

- Dashboard → Updates → Update All
- Set plugins to auto-update for security releases: Plugins → for each plugin, click "Enable auto-updates"

**Delete what you don't use.** Deactivated but installed plugins still represent an attack surface. If you're not using a plugin, delete it completely.

Monthly updates should be part of your standard [website maintenance checklist](/blog/website-maintenance-checklist) — not something you do when you remember.

### 2. Strong, Unique Passwords + 2FA Everywhere

An 8-character password can be brute-forced in seconds. A 20-character random password takes millions of years.

**Password requirements for every website account:**

- Minimum 16 characters for admin/hosting accounts
- Mix of letters, numbers, symbols
- Never reused from any other service
- Stored only in a password manager (Bitwarden is excellent and free)

**Two-Factor Authentication priority list:**

1. Domain registrar (losing your domain is catastrophic)
2. Hosting control panel
3. WordPress admin
4. Email accounts associated with the domain

### 3. Web Application Firewall (WAF)

A WAF sits between the internet and your server, filtering malicious requests before they reach your application. It blocks SQL injection, XSS (cross-site scripting), brute-force login attempts, and known exploit patterns.

**Cloudflare (free plan) — best starting point:**

1. Create account at cloudflare.com
2. Add your domain → update nameservers at your registrar (15 minutes)
3. In your Cloudflare dashboard → Security → WAF
4. Enable "Managed Rules" — pre-built rules covering common attack patterns

**Additional Cloudflare settings that help:**

- Security → Bots → "Block AI Scrapers and Crawlers"
- Security → Settings → Security Level: Medium or High
- Under Attack Mode: enables when you're actively being attacked

This single step stops the majority of automated attack traffic. Most malicious bots are unsophisticated — they scan for known vulnerabilities and move on when they hit a WAF.

### 4. Set Correct File Permissions

File permissions control which users and processes can read, write, or execute each file. Too permissive = attackers can write malicious files. Too restrictive = your site breaks.

```bash
# WordPress recommended permissions
# Directories: 755 (owner can write, everyone can read/execute)
find /var/www/html -type d -exec chmod 755 {} \;

# Files: 644 (owner can write, everyone can read)
find /var/www/html -type f -exec chmod 644 {} \;

# wp-config.php: 600 or 640 (only owner can read, nobody else)
chmod 600 /var/www/html/wp-config.php

# .env file: 600
chmod 600 /var/www/html/.env
```

**Never set 777 permissions.** "I got a 403 error so I ran chmod 777 to fix it" is something many developers do once and regret. 777 means any process on the server (including a compromised script) can write any file in that location.

### 5. Protect Config Files from Public Access

Your `wp-config.php` and `.env` files contain database credentials, API keys, and secret keys. They must never be publicly accessible.

```apache
# Apache .htaccess — block direct access to sensitive files
<Files wp-config.php>
  Order allow,deny
  Deny from all
</Files>

<Files .env>
  Order allow,deny
  Deny from all
</Files>

<Files .htaccess>
  Order allow,deny
  Deny from all
</Files>
```

```nginx
# Nginx — same protection
location ~ /\.(env|git|htaccess) {
    deny all;
    return 404;
}

location ~* wp-config\.php {
    deny all;
    return 404;
}
```

**Test it:** Visit `yourdomain.com/wp-config.php` in a browser. You should get a 403 Forbidden or 404, not a file download or blank page.

### 6. Security Headers

HTTP security headers are instructions your server sends to the browser. They prevent a range of attacks including clickjacking, MIME type sniffing, and cross-site scripting.

Check your current headers at [securityheaders.com](https://securityheaders.com).

```nginx
# Nginx — add to your server block
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

```apache
# Apache — in .htaccess or httpd.conf
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
```

These take 5 minutes to add and improve your security grade from F to A on securityheaders.com.

### 7. Disable XML-RPC (WordPress)

XML-RPC is a legacy WordPress feature that allows remote publishing and ping notifications. In 2026, almost no site needs it — but attackers exploit it constantly for brute-force password attacks and DDoS amplification.

```php
// Add to your theme's functions.php
add_filter('xmlrpc_enabled', '__return_false');

// Also disable the pingback method specifically
add_filter('xmlrpc_methods', function($methods) {
    unset($methods['pingback.ping']);
    unset($methods['pingback.extensions.getPingbacks']);
    return $methods;
});
```

Block it at the server level too (belt and braces):

```apache
# Apache .htaccess
<Files xmlrpc.php>
  Order Deny,Allow
  Deny from all
</Files>
```

**After disabling:** Use the Jetpack plugin or REST API for any legitimate remote functionality that previously used XML-RPC.

### 8. Rate-Limit Login Attempts

Brute-force attacks try thousands of password combinations per minute. Rate limiting stops this by locking an account after a small number of failed attempts.

**WordPress — WP Cerber Security plugin (free):**

- Install and activate WP Cerber Security
- Settings → Hardening → Login attempts: set to 5
- Lock duration: 60 minutes minimum

**Custom application (Node.js example):**

```javascript
import { RateLimiterMemory } from "rate-limiter-flexible";

const loginLimiter = new RateLimiterMemory({
  keyPrefix: "login",
  points: 5, // 5 attempts
  duration: 900, // per 15 minutes
  blockDuration: 1800, // block for 30 minutes after exceeding
});

async function loginHandler(req, res) {
  try {
    await loginLimiter.consume(req.ip);
    // proceed with login logic
  } catch (rejRes) {
    const retryAfter = Math.round(rejRes.msBeforeNext / 1000);
    res.status(429).json({
      error: `Too many login attempts. Try again in ${retryAfter} seconds.`,
    });
  }
}
```

**Also add reCAPTCHA or hCaptcha to login forms** — stops automated bots without requiring users to do anything annoying (invisible v3 reCAPTCHA is seamless).

### 9. Change Default Admin URL (WordPress)

WordPress admin lives at `/wp-admin` on every WordPress installation on earth. Every automated attack script tries this URL first. Moving it to something unpredictable eliminates the majority of brute-force attempts.

**Using WPS Hide Login plugin:**

1. Install and activate WPS Hide Login
2. Settings → WPS Hide Login → set your new login URL
3. Use something specific and unguessable: `/site-management-2026` or `/login-rbteam`
4. Save it somewhere secure — if you forget this URL and lose access, recovery is complex

**Do not use common alternatives** like `/secret`, `/admin-login`, `/wp-login` — attackers try these too.

### 10. Automated Backups — Daily, Off-Site

If this guide teaches you one thing: **you do not truly own a website you cannot restore from backup.**

Without backups, a hack means starting over. With backups, it means 1–2 hours of recovery.

**Backup requirements:**

- **Frequency:** Daily at minimum. E-commerce or frequently-updated sites: hourly or twice-daily
- **Retention:** Keep at least 30 days of backups
- **Location:** Stored off the server being backed up (separate cloud storage — Google Drive, Backblaze, Amazon S3)
- **Testing:** Verify you can actually restore from backup quarterly — backups that can't be restored are not backups

**WordPress backup options:**

- **UpdraftPlus** (free): Automatic backups to Google Drive, Dropbox, or S3. Set-and-forget.
- **BlogVault** (paid): Real-time incremental backups, one-click restore
- **Your hosting provider**: Many include daily backups — check if yours does and where they're stored

**Manual backup before every update:**
Before updating plugins, themes, or WordPress core — take a manual backup. Most major hacks happen through update-related conflicts that expose vulnerabilities in the transition.

### 11. Monitor for Changes

Get notified the moment something unexpected happens. Monitoring turns a major crisis into a minor incident.

**Free monitoring stack:**

1. **UptimeRobot** (free): Checks your site every 5 minutes. Sends email/SMS if it goes down. Takes 5 minutes to set up at uptimerobot.com.

2. **Google Search Console**: Email alerts for security issues. Highly reliable — Google will notify you if malware is detected.

3. **Wordfence (WordPress)**: Real-time file integrity monitoring. Alerts you when core files are modified. Compares your files against known-good versions from the WordPress repository.

4. **Cloudflare Analytics**: Shows traffic spikes (unusual spikes often precede or indicate an attack).

**Set up alerts for:**

- Site going down
- Google blacklisting your domain
- Core file changes (Wordfence)
- New WordPress admin user creation (Wordfence or WP Security Audit Log)
- Failed login attempts exceeding threshold

### 12. HTTPS Everywhere + HSTS

HTTP in 2026 is indefensible. Chrome shows "Not Secure" warnings. Google uses HTTPS as a ranking signal. Data transmitted over HTTP is visible to anyone on the same network.

**Get HTTPS:**

- **Free:** Let's Encrypt SSL certificate via your hosting panel (most cPanel hosts have a one-click install) or via Cloudflare
- **Cloudflare:** Even easier — enable SSL/TLS → Full (Strict) in Cloudflare dashboard

**Force all traffic to HTTPS:**

```apache
# Apache .htaccess
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

```nginx
# Nginx server block
server {
    listen 80;
    server_name yoursite.com www.yoursite.com;
    return 301 https://$server_name$request_uri;
}
```

**Enable HSTS (HTTP Strict Transport Security):**

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

This tells browsers to always use HTTPS for your domain — even if a user types `http://`. Combined with the 301 redirect, it closes the brief window where HTTP could be used for a man-in-the-middle attack.

If you're encountering SSL issues after setup, our [SSL certificate errors guide](/blog/ssl-certificate-errors-fix) covers every error type with specific fixes.

---

## Security Audit Checklist

Work through this and tick everything off before considering your site secure:

**Immediate (do today):**

- [ ] All software updated (CMS, plugins, themes, PHP version)
- [ ] All passwords changed to 20+ character unique strings
- [ ] 2FA enabled on hosting, domain registrar, and CMS
- [ ] Cloudflare WAF enabled (free plan)

**This week:**

- [ ] File permissions: 755 for directories, 644 for files, 600 for wp-config.php
- [ ] Config files blocked from public access (test by visiting /.env in browser)
- [ ] Security headers added (verify at securityheaders.com)
- [ ] XML-RPC disabled
- [ ] Login attempts rate-limited
- [ ] Admin URL changed (WordPress)

**This month:**

- [ ] Automated daily backups configured with off-site storage
- [ ] Test backup restore confirmed working
- [ ] UptimeRobot monitoring configured
- [ ] Google Search Console security alerts enabled
- [ ] Wordfence or equivalent monitoring installed

**Ongoing:**

- [ ] Monthly plugin/theme updates (scheduled in calendar)
- [ ] Quarterly backup restore test
- [ ] Annual security audit (manual review of logs, headers, permissions)

---

## Frequently Asked Questions

**My site was hacked through a plugin I had deactivated but not deleted — is that possible?**
Yes. Deactivated plugins still exist on your server as files. If they contain vulnerabilities, they can still be exploited via direct file access. Always delete plugins you don't use.

**How did they get in if I was using a strong password?**
Most hacks don't involve guessing your password. They exploit vulnerabilities in outdated plugin code — attacking the plugin directly, bypassing authentication entirely. Strong passwords protect against brute force; keeping software updated protects against code exploits.

**Can shared hosting cause my site to get hacked even if I do everything right?**
Yes. On shared hosting, hundreds of websites share the same server. If one is compromised, attackers can sometimes pivot to other sites on the same server (cross-site contamination). Moving to a VPS (Virtual Private Server) eliminates this risk. DigitalOcean, Vultr, and Linode offer basic VPS plans from $6–12/month.

**Google has blacklisted my site — how long does it take to get removed after cleanup?**
After submitting a review request in Google Search Console (Security Issues → Request Review), Google typically responds within 1–3 days if the malware has been genuinely removed. If they find remaining issues, you'll need to clean further and re-request.

**Will Google penalize my rankings after being hacked?**
Temporarily, yes. If your site was serving malware or spam, Google may demote it during the infection period. Once cleaned and reviewed, rankings typically recover within 2–4 weeks. Being proactive (fixing fast, requesting review immediately) minimizes the impact.

**Is Cloudflare enough security on its own?**
No. Cloudflare is an excellent first layer of defense — it blocks traffic-based attacks and known exploit patterns. But it doesn't protect against attacks that come through legitimate-looking requests (plugin vulnerabilities, authentication exploits). You need the full stack: WAF + updated software + strong passwords + 2FA + monitoring + backups.

---

## We Can Do This For You

Security hardening is one of our core services. We audit your current security posture, implement all the measures above, configure monitoring and alerting, and set up automated backups — so you're not guessing at your own security.

[Request a Security Audit →](/contact) — free initial review, no obligation, delivered within 24 hours. We've hardened over 40 Pakistani business websites and have not had a single repeat hack.
