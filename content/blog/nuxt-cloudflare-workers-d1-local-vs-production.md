---
title: "Nuxt + Cloudflare Workers: APIs Work Locally But Break in Production — Complete Fix Guide"
description: "Your Nuxt app runs perfectly with nuxt dev but APIs fail after wrangler deploy. This guide covers D1 bindings, environment variables, Node.js compatibility, and wrangler debugging — based on a real production setup."
date: 2026-10-15
readTime: 14
category: "Development"
author: "RapidByt Team"
tags: ["Nuxt", "Cloudflare Workers", "D1 database", "wrangler", "NuxtHub", "deployment", "bindings"]
image: "/blog/nuxt-cloudflare-d1-debug.jpg"
---

Everything works on `nuxt dev`. You run `wrangler deploy` and production immediately breaks:

```
500 Internal Server Error
Error: D1_ERROR: no such table: accounts
```

Or maybe:

```
TypeError: Cannot read properties of undefined (reading 'prepare')
```

Or the API just returns a blank response with no error at all.

This is the most common — and most confusing — problem when deploying Nuxt to Cloudflare Workers. This guide walks through every root cause systematically, with exact fixes for each.

---

## Why Local Works But Production Doesn't

These two environments are fundamentally different runtimes:

|            | `nuxt dev` (Local)                       | `wrangler deploy` (Production)      |
| ---------- | ---------------------------------------- | ----------------------------------- |
| Runtime    | **Node.js**                              | **V8 Isolate** (Cloudflare)         |
| Database   | Local SQLite file (`.data/db/sqlite.db`) | **D1 binding** (remote)             |
| Env vars   | `.env` file                              | Wrangler secrets / `vars`           |
| Node APIs  | All available                            | Restricted — no `fs`, `net`, `path` |
| Cold start | N/A                                      | 0–5ms but strict CPU limits         |

Your code runs on Node.js locally and on V8 Workers in production. The gap between them is the source of almost every "works locally, breaks in prod" issue.

---

## Problem 1: D1 Database Binding Not Working

### Symptoms

```
Error: Cannot read properties of undefined (reading 'prepare')
D1_ERROR: no such table: accounts
TypeError: db is undefined
```

### Cause

Locally, `@nuxthub/core` uses a local SQLite file at `.data/db/sqlite.db`. In production, it needs a Cloudflare D1 binding — defined in `wrangler.jsonc` and provisioned in your Cloudflare account.

### Step 1: Verify your `wrangler.jsonc` binding

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "rapidbyt",
      "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "migrations_table": "_hub_migrations",
      "migrations_dir": "server/db/migrations/sqlite/",
    },
  ],
}
```

The `binding` name (`DB`) must match what your app expects. NuxtHub uses `DB` by default.

Then verify in Cloudflare Dashboard → Workers & Pages → your Worker → Settings → Bindings that the `DB` binding exists and points to the correct database.

### Step 2: Create the D1 database if it doesn't exist

```bash
wrangler d1 create rapidbyt
# Copy the database_id from the output into wrangler.jsonc
```

### Step 3: Apply migrations to the remote database

**This is the most commonly missed step.** You ran migrations locally but never applied them to the remote D1 instance.

```bash
# Apply to local D1 emulator (for wrangler dev testing)
wrangler d1 migrations apply DB --local

# Apply to production — you must do this every time you add a migration
wrangler d1 migrations apply DB --remote
```

### Step 4: Confirm your `nuxt.config.ts` preset

```typescript
export default defineNuxtConfig({
  modules: ["@nuxthub/core"],
  hub: { db: "sqlite" }, // NuxtHub handles the DB binding automatically

  nitro: {
    // Use cloudflare_module only for production builds
    // Dev uses undefined (Node.js) so local SQLite works without polyfills
    preset: process.env.NODE_ENV === "production" ? "cloudflare_module" : undefined,

    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
});
```

The conditional preset is important. If you hardcode `cloudflare_module` for both dev and prod, local development breaks because the Workers runtime doesn't have access to your local SQLite file.

---

## Problem 2: Environment Variables Are Undefined in Production

### Symptoms

```
Resend API key is missing
NUXT_RESEND_API_KEY is undefined
Error: Invalid API key provided
```

### Cause

`.env` files are only read by `nuxt dev` and `nuxt build` on your local machine. **Cloudflare Workers never sees your `.env` file.** You must set secrets separately via Wrangler.

### Fix: Set Wrangler secrets

For sensitive values like API keys, use `wrangler secret` — they are encrypted and never exposed:

```bash
wrangler secret put NUXT_RESEND_API_KEY
# Wrangler prompts for the value — it won't appear on screen

wrangler secret put NUXT_SESSION_PASSWORD

wrangler secret put NUXT_PAGESPEED_API_KEY
```

For non-sensitive public vars, add them directly to `wrangler.jsonc`:

```jsonc
{
  "vars": {
    "NUXT_PUBLIC_SITE_URL": "https://rapidbyt.com",
  },
}
```

### Verify what's set

```bash
# Lists secret names (not values — values are never retrievable)
wrangler secret list
```

Also check Cloudflare Dashboard → Workers & Pages → your Worker → Settings → Variables and Secrets.

### If using NuxtHub deploy

If you deploy through `nuxthub.com`, set environment variables in the NuxtHub project UI — they get synced to your Worker automatically.

---

## Problem 3: Node.js APIs Not Available in Workers

### Symptoms

```
ReferenceError: process is not defined
TypeError: fs.readFileSync is not a function
Error: Dynamic require of "crypto" is not supported
Cannot use import statement outside a module
```

### Cause

Cloudflare Workers runs a V8 isolate, not Node.js. These are unavailable:

- `fs` — no file system access
- `path` — no path utilities
- `net` / `dns` — no raw networking
- `child_process` — no subprocesses
- Node.js `crypto` module (use the Web Crypto API instead — it's available globally)

### Fix 1: Enable `nodeCompat`

In `wrangler.jsonc`:

```jsonc
{
  "compatibility_flags": ["nodejs_compat"],
  "compatibility_date": "2026-07-12",
}
```

And in `nuxt.config.ts`:

```typescript
nitro: {
  cloudflare: {
    deployConfig: true,
    nodeCompat: true, // polyfills many Node.js APIs
  },
}
```

This polyfills most Node.js APIs. It won't fix `fs.readFileSync` (no file system in Workers), but it covers `Buffer`, `crypto`, `stream`, `util`, and most others.

### Fix 2: Stub packages that import Node-only dependencies

The `resend` v6+ package optionally imports `@react-email/render`, which is Node.js only. The build will fail on Cloudflare unless you stub it:

```typescript
// server/stubs/react-email-render.ts
export const render = () => "";
export default { render };
```

```typescript
// nuxt.config.ts
import { fileURLToPath } from 'node:url'

nitro: {
  alias: {
    '@react-email/render': fileURLToPath(
      new URL('./server/stubs/react-email-render.ts', import.meta.url)
    )
  }
}
```

This pattern works for any package that has a Node.js-only optional dependency. Stub it with an empty export that matches the API shape your code actually uses.

---

## Problem 4: Not Testing with the Right Local Setup

### The correct pre-deploy test workflow

`nuxt dev` does not simulate the Workers environment. To catch production issues before deploying, use `wrangler dev`:

```bash
# 1. Build for production
nuxt build

# 2. Run in the Workers runtime locally
wrangler dev --local
```

This runs your built Worker in a local V8 isolate with a local D1 emulator — much closer to what production does.

### Key differences

|             | `nuxt dev`          | `wrangler dev --local`  |
| ----------- | ------------------- | ----------------------- |
| Runtime     | Node.js             | V8 isolate (Workers)    |
| Database    | Local SQLite file   | Local D1 emulator       |
| Env vars    | `.env` file         | `wrangler.jsonc` vars   |
| Hot reload  | Yes                 | No — rebuild required   |
| When to use | Feature development | Pre-deploy verification |

The tradeoff: `wrangler dev` has no hot reload, so it's slow to iterate on. Use `nuxt dev` for development and `wrangler dev` only for final verification before deploying.

---

## Problem 5: Migration Mismatch Between Local and Remote

### Symptoms

```
D1_ERROR: no such table: accounts
D1_ERROR: table accounts has no column named email_verified
```

### Cause

Your local SQLite and remote D1 are out of sync — a new migration ran locally but was never applied to the remote database.

### Check migration status

```bash
# What's applied locally
wrangler d1 migrations list DB --local

# What's applied on production
wrangler d1 migrations list DB --remote
```

Compare the two outputs. Any migration in the local list but not the remote list needs to be applied:

```bash
wrangler d1 migrations apply DB --remote
```

### Generating new migrations with Drizzle

When you change a schema file, generate a migration:

```bash
nuxt db generate
```

This creates a new `.sql` file in `server/db/migrations/sqlite/`. Then apply it to both:

```bash
wrangler d1 migrations apply DB --local
wrangler d1 migrations apply DB --remote
```

Never manually edit the D1 database through the Cloudflare Dashboard for schema changes — always go through migrations so local and remote stay in sync.

---

## Problem 6: Build Fails with Dynamic Require Error

### Symptoms

```
Error: Dynamic require of "some-package" is not supported
```

### Cause

Some npm packages are written as CommonJS (`require()`) and don't bundle cleanly for the Workers ESM environment.

### Fix: Inline the package in the Nitro bundle

```typescript
// nuxt.config.ts
nitro: {
  externals: {
    inline: ["problematic-package-name"];
  }
}
```

Or mark it as an external and provide a stub if it's not actually needed at runtime.

---

## The Full Deployment Checklist

Run through these in order before every production deploy:

```bash
# 1. Build
nuxt build

# 2. Test in Workers runtime
wrangler dev --local
# Manually hit your API endpoints

# 3. Check remote migration status
wrangler d1 migrations list DB --remote

# 4. Apply any pending migrations
wrangler d1 migrations apply DB --remote

# 5. Verify secrets are set
wrangler secret list

# 6. Deploy
wrangler deploy

# 7. Tail logs and run a smoke test
wrangler tail &
curl -X POST https://yoursite.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","website":"https://test.com"}'
```

---

## Debugging Production with `wrangler tail`

This is the most powerful tool for diagnosing production issues and the one most people skip:

```bash
wrangler tail
```

It streams real-time logs from your production Worker. Make a request in the browser and you see the exact error:

```
[2026-10-15 14:23:15] POST /api/contact - 500 Internal Server Error
  Error: Cannot read properties of undefined (reading 'prepare')
  at Object.handler (worker.mjs:1:45231)
  at async Server.<anonymous> (worker.mjs:1:98432)
```

No more guessing. You get the exact file, line, and error message. Use this before spending time on hypotheses.

You can also filter by status:

```bash
# Only show errors
wrangler tail --status error

# Only show a specific route
wrangler tail --search "/api/diagnose"
```

---

## The Working `nuxt.config.ts` Pattern

This is the exact configuration used on this site (rapidbyt.com) that works correctly across both local dev and production:

```typescript
import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  modules: ["@nuxthub/core", "@nuxt/ui", "@nuxtjs/sitemap"],

  hub: { db: "sqlite" },

  nitro: {
    // cloudflare_module for production, Node.js for local dev
    preset: process.env.NODE_ENV === "production" ? "cloudflare_module" : undefined,

    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },

    // Stub Node.js-only optional deps in packages
    alias: {
      "@react-email/render": fileURLToPath(
        new URL("./server/stubs/react-email-render.ts", import.meta.url),
      ),
    },

    compressPublicAssets: { gzip: true, brotli: true },
    minify: true,
  },
});
```

---

## Quick Reference: Error → Cause → Fix

| Error                                   | Most Likely Cause             | Fix                                                  |
| --------------------------------------- | ----------------------------- | ---------------------------------------------------- |
| `db is undefined`                       | D1 binding not configured     | Add binding to `wrangler.jsonc`, verify in Dashboard |
| `no such table`                         | Remote migrations not applied | `wrangler d1 migrations apply DB --remote`           |
| `API key undefined`                     | Secrets not set               | `wrangler secret put KEY_NAME`                       |
| `fs is not a function`                  | Node.js API in Workers        | `nodeCompat: true` + avoid `fs`                      |
| `Dynamic require not supported`         | CJS package                   | Add to `externals.inline` or stub                    |
| Blank 500, no error                     | Build error or crash          | `wrangler tail` to see the real error                |
| Works in `wrangler dev`, fails deployed | Secrets not set               | Set via `wrangler secret put`                        |

---

If you're hitting a production issue on Nuxt + Cloudflare Workers that isn't covered here, [get in touch](/contact) — we build and deploy on this exact stack and can diagnose most issues from a `wrangler tail` log.
