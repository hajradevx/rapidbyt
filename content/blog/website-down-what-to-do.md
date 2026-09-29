---
title: "Your Website Is Down — What to Do in the Next 60 Minutes"
description: "Every minute your site is down costs you money and SEO. This is the exact checklist to diagnose the cause, communicate with users, and get back online as fast as possible."
date: 2026-11-01
readTime: 7
category: "Security"
author: "RapidByt Team"
tags: ["website down", "downtime", "hosting", "uptime monitoring", "server error", "502", "503"]
image: "/blog/website-down.jpg"
---

Your site is down. A client just texted you. Your phone is ringing. You're staring at a blank screen or an error page.

The next 60 minutes matter. Here is exactly what to do.

---

## Minute 0–5: Confirm It's Actually Down

First, make sure it's not just your browser or your network.

**Check from multiple sources:**

1. [downforeveryoneorjustme.com](https://downforeveryoneorjustme.com) — paste your URL
2. [isitdownrightnow.com](https://isitdownrightnow.com) — checks from multiple locations
3. Ask someone in a different location to check (WhatsApp a colleague)

**Check the exact error message:**

| Error | What It Means |
|-------|---------------|
| `502 Bad Gateway` | Your web server is up but the app behind it crashed |
| `503 Service Unavailable` | Server is overloaded or in maintenance mode |
| `504 Gateway Timeout` | App is too slow to respond — possible traffic spike |
| `ERR_CONNECTION_REFUSED` | Server is completely unreachable — hosting problem |
| `ERR_NAME_NOT_RESOLVED` | DNS is failing — domain or DNS issue |
| Blank white page | PHP/app crash — check error logs immediately |

Write down the exact error. It tells you where to look.

---

## Minute 5–15: Check Hosting Status

**Go to your hosting provider's status page:**

Most hosting providers publish real-time status. Google your provider + "status page":
- Cloudflare: [cloudflarestatus.com](https://cloudflarestatus.com)
- DigitalOcean: [status.digitalocean.com](https://status.digitalocean.com)
- Hostinger, Namecheap, etc. — check their website or Twitter

If they're showing an incident, your hands are largely tied — wait for them to fix it, but communicate with your users (see below).

If they show all-green, the problem is on your site/configuration.

---

## Minute 5–15: Check DNS If You See ERR_NAME_NOT_RESOLVED

If the browser can't find your domain at all, DNS is the issue.

```bash
# Check if DNS resolves
nslookup yoursite.com

# Check what IP it resolves to
dig yoursite.com

# Compare to what it should be (check your hosting provider's docs)
```

Common DNS causes:
- Domain expired (check your domain registrar)
- DNS records accidentally changed or deleted
- Nameservers changed (e.g., you moved hosts but old DNS is still propagating)

**Quick check:** Log into your domain registrar → check the expiry date → check the nameservers are still pointing to the right place.

---

## Minute 15–25: Check Server Error Logs

If it's not a hosting outage and DNS is fine, check your server logs. This is where the actual error lives.

**For shared hosting (cPanel):**
cPanel → Logs → Error log → look at the last 20–30 lines

**For VPS (SSH access):**

```bash
# Nginx error log
sudo tail -100 /var/log/nginx/error.log

# Apache error log
sudo tail -100 /var/log/apache2/error.log

# PHP error log
sudo tail -100 /var/log/php/error.log

# Application log (Node.js / Nuxt)
sudo journalctl -u your-app-service -n 100 --no-pager
```

**For Cloudflare Workers:**

```bash
wrangler tail
# Then refresh the broken URL in your browser
```

**What to look for:**
- Out of memory errors
- Permission denied errors
- Database connection failures
- Disk space full
- App process crashed

---

## Minute 15–25: Check If You Ran Out of Resources

**Disk space full** is a surprisingly common cause of sudden downtime:

```bash
# Check disk usage
df -h

# If root partition is at 100%, find what's eating space
du -sh /var/log/*  # Often log files
du -sh /tmp/*
du -sh /home/*/public_html/*
```

**Fix:** Delete old log files, clear /tmp, or upgrade your storage plan.

**Out of memory:**

```bash
# Check memory usage
free -h

# Check what's consuming memory
top
# or
ps aux --sort=-%mem | head -20
```

**Fix:** Restart the memory-hungry process, or upgrade your plan if you're consistently near the limit.

**Too many database connections:**

```bash
# MySQL — check max connections
mysql -u root -p -e "SHOW STATUS LIKE 'max_used_connections';"
mysql -u root -p -e "SHOW VARIABLES LIKE 'max_connections';"
```

---

## Minute 25–40: Restart Services

If logs show a crashed process:

```bash
# Restart Nginx
sudo systemctl restart nginx

# Restart Apache
sudo systemctl restart apache2

# Restart MySQL
sudo systemctl restart mysql

# Restart your Node.js app (PM2)
pm2 restart all

# Restart PHP-FPM
sudo systemctl restart php8.1-fpm
```

After restarting, immediately check if the site is back up and monitor logs for repeated crashes.

---

## Minute 25–40: Check for Recent Changes

Think about what changed in the last 24 hours:

- Did you or someone on your team deploy new code?
- Did you update a plugin, theme, or dependency?
- Did you modify a config file?
- Did a scheduled task or cron job run?
- Did traffic suddenly spike (check Google Analytics or Cloudflare analytics)?

**If a deployment broke the site:**

```bash
# Roll back to the previous version
git revert HEAD
git push

# Or restore from the last working backup
```

**If a WordPress update broke it:**

cPanel → File Manager → rename `wp-content/plugins` to `wp-content/plugins-disabled` → refresh site. If it works, a plugin caused the crash. Rename it back, then deactivate plugins one by one.

---

## Minute 40–60: Communicate With Users

While you're fixing the issue (or waiting for hosting support), update your users. Silence is worse than transparency.

**Minimum communication:**

1. **Status page or social media post:** "We're aware of an issue affecting [site]. Our team is working on a fix. ETA: [time]." — Even if you don't have an ETA, say you're working on it.

2. **For business sites with email list:** A quick email to recent customers: "We're experiencing a technical issue. Your data is safe. We expect to be back online by [time]. We apologize for the inconvenience."

3. **For e-commerce:** Specifically notify anyone with active orders that their order is safe and will be processed normally.

Even if you fix it in 20 minutes, the people who saw it down are now worried. A 2-sentence communication rebuilds trust instantly.

---

## After the Fix: Post-Mortem

Once you're back online, spend 20 minutes on a post-mortem:

1. What caused the downtime?
2. How long were you down?
3. How did you find out? (Client email? That's bad — you should know before clients do)
4. How do you prevent this specific issue from happening again?
5. What monitoring can you add to catch this faster next time?

---

## Prevention: Set Up Monitoring Before It Happens Again

If a client told you your site was down before you knew about it, you have no monitoring. Fix this today — it's free.

**UptimeRobot (free for up to 50 monitors):**
1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add your site URL as an HTTP monitor
3. Set check interval to 5 minutes
4. Add alert contacts — email, SMS, or a webhook to Slack/WhatsApp

When your site goes down, you get a notification within 5 minutes. When it comes back up, you get another notification.

**Also monitor:**
- SSL certificate expiry (UptimeRobot does this too)
- Domain expiry (set a reminder 60 days before expiry)
- Key API endpoints (not just the homepage)

---

If your site is down right now and you can't diagnose it, [contact us via WhatsApp](/contact) for urgent support. We can usually identify the cause within 30 minutes from logs alone.
