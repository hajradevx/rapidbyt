---
title: "My Website Got Hacked — What to Do Now (And How to Prevent It)"
description: "Your website was hacked or defaced. Here's the step-by-step recovery process, plus 12 security hardening measures to prevent it happening again."
date: 2026-09-28
readTime: 9
category: "Security"
author: "RapidByt Team"
tags: ["website hacked", "security", "malware", "WordPress security", "SSL", "firewall"]
image: "/blog/website-security.jpg"
---

You wake up to an email from a client: "Your website is showing weird content." Or Google Search Console says your site is distributing malware. Or your homepage has been replaced with a defacement page.

Panic sets in. What do you do first?

This guide covers emergency recovery and — more importantly — how to harden your site so it never happens again.

---

## EMERGENCY: First 30 Minutes

### Step 1: Take Your Site Offline (If Possible)

If your site is actively serving malware or spam, your visitors and SEO are both at risk. Put up a maintenance page immediately:

```html
<!-- Temporary maintenance page -->
<!DOCTYPE html>
<html>
<head>
  <title>Maintenance</title>
  <meta name="robots" content="noindex" />
</head>
<body>
  <h1>We're performing urgent maintenance. Back shortly.</h1>
</body>
</html>
```

### Step 2: Change All Passwords Immediately

- Hosting control panel (cPanel, Plesk)
- FTP/SFTP credentials
- Database password
- CMS admin password (WordPress, etc.)
- Email accounts associated with the domain
- Any API keys in your config files

Use a password manager and generate 20+ character random passwords for each.

### Step 3: Scan for Malware

**Free tools:**
- [Sucuri SiteCheck](https://sitecheck.sucuri.net) — paste your URL, get instant malware scan
- [VirusTotal](https://virustotal.com) — checks your URL against 70+ antivirus engines
- Google Search Console → Security Issues tab

**If you have server access:**
```bash
# Find recently modified PHP files (common attack vector)
find /var/www/html -name "*.php" -newer /var/www/html/index.php -ls

# Search for common malware signatures
grep -r "base64_decode\|eval(" /var/www/html --include="*.php"
```

### Step 4: Restore from a Clean Backup

This is why backups exist. Restore to a version from before the hack. If you don't have a backup — note this for Step 5 of your prevention plan.

### Step 5: Identify the Entry Point

Before you restore, understand *how* they got in. Common entry points:
- Outdated plugins/themes (WordPress: check installed plugin versions)
- Weak or reused admin passwords
- Old PHP version
- Exposed `.env` file with credentials
- Malicious file upload through a form

---

## Prevention: 12 Security Measures

### 1. Keep Everything Updated

Outdated software is the #1 cause of hacks. WordPress, plugins, themes, PHP version — all need to be current.

```bash
# WordPress CLI — update everything
wp core update
wp plugin update --all
wp theme update --all
```

Enable automatic updates for minor security releases.

### 2. Use Strong, Unique Passwords + 2FA

Never reuse a password. Use a password manager (Bitwarden is free). Enable two-factor authentication on your hosting, domain registrar, and CMS.

### 3. Add a Web Application Firewall (WAF)

A WAF filters malicious traffic before it reaches your server. **Cloudflare's free plan** includes a basic WAF and blocks common attack patterns (SQL injection, XSS, etc.).

Setup takes 15 minutes:
1. Sign up at cloudflare.com
2. Add your domain → update nameservers at your registrar
3. Enable "Under Attack Mode" if you're actively being attacked
4. Turn on WAF rules in Security → WAF

This also makes your site significantly faster (see our [Cloudflare guide](/blog/how-to-move-to-cloudflare-and-cut-hosting-costs)).

### 4. Set Proper File Permissions

```bash
# WordPress recommended permissions
find /var/www/html -type d -exec chmod 755 {} \;  # Directories
find /var/www/html -type f -exec chmod 644 {} \;  # Files
chmod 600 wp-config.php                            # Config file
```

Never set permissions to 777 — this allows anyone to write any file.

### 5. Protect wp-config.php and .env Files

```apache
# .htaccess — block direct access to config files
<Files wp-config.php>
  Order allow,deny
  Deny from all
</Files>

<Files .env>
  Order allow,deny
  Deny from all
</Files>
```

### 6. Add Security Headers

These headers are set on the server and protect against a range of attacks:

```
# Nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline';";
```

Check your current headers at [securityheaders.com](https://securityheaders.com).

### 7. Disable XML-RPC (WordPress)

XML-RPC is a legacy WordPress API that attackers frequently abuse for brute-force attacks.

```php
// functions.php — disable XML-RPC
add_filter( 'xmlrpc_enabled', '__return_false' );
```

Or block it at the server level:
```apache
# .htaccess
<Files xmlrpc.php>
  Order Deny,Allow
  Deny from all
</Files>
```

### 8. Limit Login Attempts

After 5 failed logins, lock the account for 15 minutes. This stops brute-force attacks cold.

WordPress: Install the "Limit Login Attempts Reloaded" plugin.

Custom apps:
```js
// Simple rate limiting with Redis
const attempts = await redis.incr(`login:${ip}`);
if (attempts === 1) await redis.expire(`login:${ip}`, 900); // 15 min window
if (attempts > 5) throw new Error('Too many attempts. Try again in 15 minutes.');
```

### 9. Change the Default Admin URL (WordPress)

`/wp-admin` is the first URL attackers try. Change it:

Install the "WPS Hide Login" plugin and change it to something unpredictable like `/manage-site-2026`.

### 10. Set Up Automated Backups

Backups are not optional. Without them, a hack means starting your website from scratch.

**Minimum backup strategy:**
- Daily automated backups
- Store off-site (not on the same server)
- Keep at least 30 days of backups
- Test restoring from backup quarterly

Free options: BackupBuddy (WordPress), UpdraftPlus, or your hosting provider's backup tool.

### 11. Monitor for Changes

Get notified the moment something changes on your site.

**Free monitoring tools:**
- [UptimeRobot](https://uptimerobot.com) — monitors uptime, alerts on downtime
- [Google Search Console](https://search.google.com/search-console) — alerts for security issues
- Wordfence (WordPress) — real-time file change monitoring

### 12. Use HTTPS Everywhere + HSTS

If you're still on HTTP in 2026, Google actively penalises you and browsers show scary warning screens.

Get a free SSL certificate from [Let's Encrypt](https://letsencrypt.org) or via Cloudflare. Then force all traffic to HTTPS:

```apache
# .htaccess — force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## Security Audit Checklist

- [ ] All software (CMS, plugins, PHP) up to date
- [ ] Unique, strong passwords + 2FA on all accounts
- [ ] WAF active (Cloudflare free plan)
- [ ] File permissions: 755 for dirs, 644 for files
- [ ] Config files protected from public access
- [ ] Security headers set (check securityheaders.com)
- [ ] Login attempts limited
- [ ] Automated daily backups running
- [ ] Uptime + security monitoring active
- [ ] SSL + HTTPS everywhere

---

## We Can Do This For You

Security hardening is one of our core services. We audit your current setup, implement all the above measures, and set up ongoing monitoring so you sleep well knowing your site is protected.

[Request a Security Audit →](/contact) — free, no obligation, delivered within 24 hours.
