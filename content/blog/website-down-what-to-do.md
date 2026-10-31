---
title: "Your Website Is Down — What to Do in the Next 60 Minutes"
description: "Every minute your site is down costs you money and SEO. This is the exact checklist to diagnose the cause, communicate with users, and get back online as fast as possible."
date: 2026-11-01
readTime: 14
category: "Security"
author: "RapidByt Team"
tags: ["website down", "downtime", "hosting", "uptime monitoring", "server error", "502", "503"]
image: "/blog/website-down.svg"
---

Your site is down. A client just texted you. Your phone is ringing. You're staring at a blank screen or an error page.

The next 60 minutes matter. Every minute of downtime costs you visitors, potential leads, and SEO signals. Here is exactly what to do — in order.

---

## Minute 0–5: Confirm It's Actually Down

Before panicking, verify it's not just your browser, your ISP, or a local network issue.

**Check from multiple sources simultaneously:**

1. [downforeveryoneorjustme.com](https://downforeveryoneorjustme.com) — paste your URL, one-click check
2. [isitdownrightnow.com](https://isitdownrightnow.com) — checks from multiple geographic locations
3. [uptrends.com/tools/uptime](https://www.uptrends.com/tools/uptime) — tests from 6 locations worldwide
4. Ask someone in a different city to check (WhatsApp a colleague or family member)
5. Try loading your site on mobile data instead of WiFi — rules out your local network

If multiple sources confirm it's down: proceed. If only you can't reach it: check your router, your DNS settings, or whether your IP was blocked.

**Read the exact error message — it tells you where to look:**

| Error Code                | What It Means                                             | Where to Look                                        |
| ------------------------- | --------------------------------------------------------- | ---------------------------------------------------- |
| `502 Bad Gateway`         | Web server (Nginx/Apache) is up but app behind it crashed | Application logs, PHP error logs                     |
| `503 Service Unavailable` | Server is overloaded or in planned maintenance            | Server resources (CPU/RAM/disk), hosting status page |
| `504 Gateway Timeout`     | App is too slow to respond                                | Database performance, slow API calls                 |
| `ERR_CONNECTION_REFUSED`  | Server completely unreachable                             | Hosting status page, server firewall                 |
| `ERR_NAME_NOT_RESOLVED`   | DNS lookup failing                                        | Domain registrar, DNS records                        |
| `ERR_SSL_PROTOCOL_ERROR`  | SSL/TLS handshake failure                                 | SSL certificate status, Cloudflare SSL settings      |
| Blank white page          | PHP/application crash                                     | PHP error logs immediately                           |
| `403 Forbidden`           | Permissions issue or IP blocked                           | File permissions, .htaccess, Cloudflare block rules  |

Write down the exact error. This diagnosis step saves you from debugging the wrong thing.

---

## Minute 5–10: Check Hosting Status Pages

Before spending time debugging your own code, verify your hosting provider isn't having an outage. This takes 2 minutes and could save you an hour.

**Popular hosting status pages:**

- Cloudflare: [cloudflarestatus.com](https://cloudflarestatus.com)
- DigitalOcean: [status.digitalocean.com](https://status.digitalocean.com)
- AWS: [health.aws.amazon.com](https://health.aws.amazon.com)
- Vultr: [status.vultr.com](https://status.vultr.com)
- Hostinger: Check their Twitter or website footer for status link
- Local Pakistani hosts: Check their Twitter account — fastest way they announce incidents

**If they're showing an incident:** Your hands are largely tied. The fix is in their infrastructure, not yours. Use the time to communicate with your users (see communication section below) and monitor for updates.

**If they show all-green:** The problem is specific to your site configuration. Continue debugging.

---

## Minute 5–15: Investigate ERR_NAME_NOT_RESOLVED (DNS Problem)

If the browser says it can't find your domain at all, DNS is failing. This is separate from your hosting.

```bash
# Check DNS resolution from your machine
nslookup yoursite.com

# More detailed DNS check
dig yoursite.com

# Check what IP the domain resolves to (compare to your server IP)
dig +short yoursite.com
```

**Common DNS causes:**

**1. Domain expired:**
Log into your domain registrar (GoDaddy, Namecheap, Hosting.pk, etc.) → check expiry date. An expired domain causes the exact `ERR_NAME_NOT_RESOLVED` error.

Fix: Renew immediately. Most registrars restore within 15–30 minutes of payment. Prevent this in future: renew 2 years in advance and set calendar reminders 60 days before expiry.

**2. DNS records accidentally changed:**
If someone made DNS changes recently (added Cloudflare, changed hosting, updated records) — check the current DNS records against what they should be.

**3. Nameserver propagation in progress:**
After changing nameservers, propagation takes 24–48 hours. During this time, some users can reach your site and others can't — depending on which DNS cache they're reading.

Check current propagation status at [dnschecker.org](https://dnschecker.org) — shows how your DNS change has propagated globally.

---

## Minute 15–25: Check Server Error Logs

If DNS is fine and the host isn't having an outage, the error is in your server or application. Logs tell you exactly what happened.

**For shared hosting (cPanel):**

1. Login to cPanel
2. Go to Logs → Error Log
3. Read the last 30–50 lines — look for timestamps around when the site went down

**For VPS with SSH access:**

```bash
# Nginx error log (most common web server)
sudo tail -100 /var/log/nginx/error.log

# Apache error log
sudo tail -100 /var/log/apache2/error.log

# PHP-FPM error log
sudo tail -100 /var/log/php8.2-fpm.log

# Application logs (Node.js/PM2)
pm2 logs --lines 100

# Systemd service logs (for custom services)
sudo journalctl -u your-service-name -n 100 --no-pager

# Combined log — all errors in last hour
sudo journalctl --since "1 hour ago" -p err
```

**For Cloudflare Workers:**

```bash
# Tail live logs from your Worker
wrangler tail

# Then open your broken URL in a browser — errors appear in real time
```

**What to look for in logs:**

```bash
# Disk space full — very common
CRITICAL: No space left on device

# Memory exhausted
PHP Fatal error: Allowed memory size of X bytes exhausted

# Database connection failed
SQLSTATE[HY000] [2002] Connection refused

# Permission denied (file permissions problem)
PHP Warning: include(): Failed opening '/var/www/html/config.php' (Permission denied)

# Application crash
[error] 502 Bad Gateway
[crit] 13: Permission denied while connecting to upstream
```

---

## Minute 15–25: Check Server Resources

**Disk space full** is a common, easily-missed cause of sudden downtime:

```bash
# Check overall disk usage
df -h

# If root partition is at 100%, find what's eating space
du -sh /var/log/* 2>/dev/null | sort -h  # Often bloated logs
du -sh /tmp/*                              # Temporary files
du -sh /home/*                             # Home directories

# Quick wins to free space
sudo find /var/log -type f -name "*.log" -size +100M  # Find huge log files
sudo journalctl --disk-usage                           # Check journal size
sudo journalctl --vacuum-size=100M                     # Limit journal to 100MB
```

**Memory exhausted:**

```bash
# Current memory usage
free -h

# What's consuming memory
ps aux --sort=-%mem | head -20

# Kill a specific process that's consuming too much (replace PID)
kill -9 [PID]
```

**Too many database connections:**

```bash
# MySQL — check connection count
mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"
mysql -u root -p -e "SHOW STATUS LIKE 'max_used_connections';"
mysql -u root -p -e "SHOW VARIABLES LIKE 'max_connections';"

# If connections are maxed out, restart MySQL
sudo systemctl restart mysql
```

---

## Minute 25–35: Restart Services

If logs show a crashed process, restart it:

```bash
# Restart web server
sudo systemctl restart nginx
# or
sudo systemctl restart apache2

# Restart database
sudo systemctl restart mysql
sudo systemctl restart postgresql

# Restart PHP-FPM (if using PHP)
sudo systemctl restart php8.2-fpm

# Restart all Node.js apps (PM2)
pm2 restart all
pm2 save

# Check what restarted successfully
sudo systemctl status nginx
sudo systemctl status mysql
pm2 status
```

After restarting, immediately:

1. Check if the site is back up
2. Monitor logs for the error recurring

If the service crashes again within minutes — something is repeatedly triggering it (an application error, a resource exhaustion loop, a script running continuously). The restart buys you time to diagnose the root cause.

---

## Minute 25–40: Check What Changed Recently

The most common cause of sudden downtime is a recent change. Work backwards:

**Questions to answer:**

- Did you or a team member deploy new code in the last 24 hours?
- Was a plugin, theme, or package updated?
- Did a scheduled task or cron job run recently?
- Did traffic suddenly spike? (Check Cloudflare analytics or Google Analytics)
- Was a server configuration file modified?
- Did an SSL certificate expire?

**If a code deployment broke the site:**

```bash
# Roll back to previous version with git
git log --oneline -10  # See recent commits
git revert HEAD        # Revert the last commit
git push

# Or restore from deployment snapshot if using a deploy tool
```

**If a WordPress plugin update broke the site:**

1. Login to cPanel → File Manager
2. Rename `wp-content/plugins` to `wp-content/plugins-disabled`
3. Reload your site — if it works, a plugin caused the crash
4. Rename back, then deactivate plugins one by one until the problem plugin is identified

**If SSL certificate expired:**

```bash
# Check certificate expiry
echo | openssl s_client -connect yoursite.com:443 2>/dev/null | openssl x509 -noout -enddate

# Force Let's Encrypt renewal
sudo certbot renew --force-renewal

# Verify renewal
sudo certbot certificates
```

See the [SSL errors fix guide](/blog/ssl-certificate-errors-fix) for specific certificate error types.

---

## Minute 35–50: Restore from Backup (If Available)

If you can't identify or fix the root cause quickly, and you have recent backups — restore first, investigate second. A 4-hour outage while debugging is worse than a 1-hour rollback.

**Restore options by platform:**

**cPanel hosting:**

- Go to cPanel → Backup Restore
- Select the most recent backup from before the incident
- Restore files and database separately

**Managed WordPress hosting (Kinsta, WP Engine, SiteGround):**

- Your hosting dashboard has 1-click backup restore
- Select a backup from before the outage

**VPS with UpdraftPlus backup:**

- WordPress admin → UpdraftPlus → Restore from backup

**VPS with manual backups:**

```bash
# Restore files
rsync -avz /backup/website/ /var/www/html/

# Restore database
mysql -u root -p database_name < /backup/database_backup.sql
```

**Cloudflare Pages/Workers:**
Revert to a previous deployment in the Cloudflare dashboard:
Workers & Pages → your project → Deployments → find a working deployment → "Rollback to this deployment"

**If you have no backups:** This is the moment you commit to implementing backups immediately after recovery. See the [website maintenance checklist](/blog/website-maintenance-checklist) for the backup setup instructions.

---

## Minute 40–60: Communicate With Users

While you're fixing the issue — or waiting for hosting support to fix it — communicate with your users. Silence is worse than transparency. People assume the worst when businesses go dark.

**Minimum acceptable communication:**

**1. Social media post (if you have any following):**

> "We're aware of a technical issue affecting [site]. Our team is working on a fix. We'll update when it's resolved. Thank you for your patience."

Post this within 30 minutes of confirming the outage.

**2. WhatsApp status or group update** (for Pakistani businesses where WhatsApp is primary):

> "Our website is temporarily down. We're fixing it now. For urgent inquiries, WhatsApp us directly at [number]."

**3. Email to recent customers or subscribers** (for longer outages):
Only for outages over 2 hours. Keep it brief: the site is down, you're working on it, their data is safe.

**For e-commerce businesses specifically:**

- Tell customers their orders are safe and will be processed normally
- Provide an alternative ordering method (WhatsApp, phone) if possible
- Give an honest estimated restoration time if you have one

Even if you fix the issue in 20 minutes, the customers who saw the error are now concerned. A single proactive message rebuilds that trust instantly.

---

## After Recovery: The Post-Mortem

Once you're back online, spend 20 minutes on a post-mortem before the details fade:

**Document these 5 things:**

1. **What caused the downtime?** (Be specific — "disk full due to unrotated PHP error logs" is more useful than "server issue")

2. **How long were you down?** (Check UptimeRobot's incident report or Cloudflare analytics)

3. **How did you find out?** If a client emailed you before you knew — that's a monitoring gap to fix.

4. **What was the fix?** Document the exact steps.

5. **What prevents recurrence?** Log rotation, disk monitoring, automated backup verification, etc.

Keep this somewhere you'll actually reference. Future you (or your team) will thank you.

---

## Prevention: Set Up Monitoring Right Now

If a client emailed you about your downtime before you knew about it — you have no monitoring. This takes 10 minutes to fix and costs nothing.

### UptimeRobot (Free for up to 50 monitors)

1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add your site as an **HTTP(S)** monitor
3. Set check interval: **5 minutes**
4. Add alert contacts: your email + WhatsApp (via webhook to a WhatsApp business API if needed)
5. Add your SSL certificate as a separate **SSL Certificate monitor** — alerts 30 days before expiry

**What you should monitor:**

- Your homepage (`https://yoursite.com`)
- Your most important API endpoint (if applicable)
- Your SSL certificate expiry
- Any critical service pages (checkout, contact form page)

When your site goes down, you get a notification within 5 minutes. When it comes back up, you get another one with the downtime duration.

### Cloudflare Health Checks (If On Cloudflare)

Cloudflare → Traffic → Health Checks → Create health check. Cloudflare tests your origin server independently of their edge cache — you see origin failures even when the cached version is serving visitors.

### Status Page (Optional but Professional)

For businesses where uptime trust matters — set up a public status page:

- [Statuspage.io](https://statuspage.io) — professional, free tier available
- [Freshstatus](https://freshstatus.io) — free for small sites

A status page lets customers check your service status themselves instead of emailing you — and it demonstrates transparency that builds trust.

---

## The 60-Minute Recovery Timeline Summary

| Time           | Action                                              |
| -------------- | --------------------------------------------------- |
| 0–5 min        | Confirm it's down (multiple tools), read error code |
| 5–10 min       | Check hosting status page                           |
| 5–15 min       | If DNS error: check domain expiry + DNS records     |
| 15–25 min      | Read server error logs                              |
| 15–25 min      | Check disk space, memory, database connections      |
| 25–35 min      | Restart failed services                             |
| 25–40 min      | Check what changed recently, consider rollback      |
| 35–50 min      | Restore from backup if needed                       |
| 40–60 min      | Communicate with users                              |
| After recovery | Post-mortem + set up monitoring                     |

---

## Frequently Asked Questions

**My site is down and I have no SSH access or technical knowledge — what do I do?**
Contact your hosting provider's support immediately. Open a ticket AND try their live chat simultaneously. Be specific: share the exact error message, when it started, and any recent changes. Most managed hosting providers have emergency support for downtime.

**How long can I be down before it affects my Google ranking?**
A few hours of downtime has minimal SEO impact. Google crawls your site periodically — if it's back up when Googlebot visits, no penalty. Extended downtime (days) can cause ranking drops. Frequent short outages are a pattern Google may notice over time in its crawl data.

**My site comes back up but keeps going down every few hours — what is it?**
This is typically a resource issue — memory leaks, database connection limits, or CPU exhaustion from runaway processes. Log your resource usage over time (`top`, `free -h`, `df -h`) to identify what fills up before each crash.

**Should I tell clients my site was down?**
For brief outages (under 1 hour): only if they noticed. For extended outages (2+ hours) or outages that affected their orders/data: yes, proactively.

**I just found out I have no backups — what do I do?**
Set up backups today, before anything else. See the [website maintenance checklist](/blog/website-maintenance-checklist) for the specific tools and setup process.

---

If your site is down right now and you can't identify the cause from this guide, [contact us via WhatsApp or the contact form](/contact) for urgent support. We can usually identify the cause within 30 minutes from server logs alone.
