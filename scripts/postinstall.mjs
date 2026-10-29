#!/usr/bin/env node
/**
 * postinstall helper — runs `nuxt prepare` only outside CI environments.
 *
 * Cloudflare Pages (and most CI systems) set CI=true or CF_PAGES=1.
 * During a CI build the real build command (nuxt build) handles preparation,
 * so running `nuxt prepare` in postinstall is redundant AND can fail because
 * native modules (e.g. better-sqlite3) haven't been compiled yet.
 */
import { execSync } from "node:child_process";

const isCI = process.env.CI === "true" || process.env.CI === "1" || process.env.CF_PAGES === "1";

if (isCI) {
  console.log("[postinstall] CI environment detected — skipping nuxt prepare.");
  process.exit(0);
}

console.log("[postinstall] Running nuxt prepare...");
try {
  execSync("nuxt prepare", { stdio: "inherit" });
} catch (err) {
  console.error("[postinstall] nuxt prepare failed:", err.message);
  process.exit(1);
}
