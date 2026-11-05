/**
 * POST /api/meta-checker
 *
 * Fetches a public URL, parses all SEO-relevant meta tags, and returns a
 * structured result with scoring and actionable issue descriptions.
 *
 * Security notes:
 * - Only http:// and https:// schemes are allowed.
 * - Private/loopback IP ranges are blocked to prevent SSRF.
 * - Response size is capped at 2 MB to prevent DoS.
 * - All user-supplied strings are validated before use.
 */

import { createError } from "h3";
import { URL } from "node:url";

// ── Types ──────────────────────────────────────────────────────────────

export interface MetaTag {
  property: string;
  content: string | null;
}

export interface MetaCheckerResult {
  url: string;
  domain: string;
  fetchedAt: string;

  // Raw tag values (null = missing)
  title: string | null;
  description: string | null;
  keywords: string | null;
  robots: string | null;
  canonical: string | null;
  viewport: string | null;
  charset: string | null;
  lang: string | null;
  themeColor: string | null;

  // Open Graph
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogImageWidth: string | null;
  ogImageHeight: string | null;
  ogUrl: string | null;
  ogType: string | null;
  ogSiteName: string | null;
  ogLocale: string | null;

  // Twitter Card
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  twitterSite: string | null;

  // Scoring
  score: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  issues: MetaIssue[];
  passed: string[];
}

export interface MetaIssue {
  severity: "error" | "warning" | "info";
  tag: string;
  message: string;
  fix: string;
}

// ── SSRF guard ─────────────────────────────────────────────────────────
// Reject any hostname that resolves to a private / loopback range.
// We do a basic string-level check on the hostname before sending the request.
const PRIVATE_HOSTNAME_RE =
  /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|0\.0\.0\.0)/i;

function assertPublicUrl(parsed: URL): void {
  const host = parsed.hostname.toLowerCase();
  if (PRIVATE_HOSTNAME_RE.test(host)) {
    throw createError({
      statusCode: 400,
      message: "Private or loopback addresses are not allowed.",
    });
  }
}

// ── HTML helpers ───────────────────────────────────────────────────────

/** Very fast attribute extractor — no DOM dependency. */
function extractAttr(tag: string, attr: string): string | null {
  // Match attr="value" or attr='value' (case-insensitive attribute names)
  const re = new RegExp(`${attr}\\s*=\\s*(?:"([^"]*?)"|'([^']*?)')`, "i");
  const m = tag.match(re);
  if (!m) return null;
  return (m[1] ?? m[2] ?? "").trim() || null;
}

/** Pull all <meta …> and <link …> and <title> tags from raw HTML. */
function parseMetaTags(html: string): {
  metaTags: MetaTag[];
  title: string | null;
  lang: string | null;
  charset: string | null;
  canonical: string | null;
} {
  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1]?.replace(/\s+/g, " ").trim() || null : null;

  // <html lang="...">
  const htmlTagMatch = html.match(/<html[^>]*>/i);
  const lang = htmlTagMatch ? (extractAttr(htmlTagMatch[0], "lang") ?? null) : null;

  // Collect all <meta> tag strings from <head>
  const headMatch = html.match(/<head[\s\S]*?<\/head>/i);
  const headHtml = headMatch ? headMatch[0] : html.substring(0, 8000);

  const metaTags: MetaTag[] = [];
  let charset: string | null = null;

  // <meta charset="...">
  const charsetMatch = headHtml.match(/<meta[^>]+charset\s*=\s*["']?([^"'\s>]+)/i);
  if (charsetMatch) charset = charsetMatch[1]?.trim() ?? null;

  // All property/name meta tags
  const metaRe = /<meta\s[^>]+>/gi;
  let m: RegExpExecArray | null;
  while ((m = metaRe.exec(headHtml)) !== null) {
    const tag = m[0];
    const property =
      extractAttr(tag, "property") ?? extractAttr(tag, "name") ?? extractAttr(tag, "http-equiv");
    const content = extractAttr(tag, "content");
    if (property) metaTags.push({ property: property.toLowerCase(), content });
  }

  // Canonical <link rel="canonical" href="...">
  const canonicalMatch = headHtml.match(/<link[^>]+rel\s*=\s*["']canonical["'][^>]*>/i);
  const canonical = canonicalMatch ? (extractAttr(canonicalMatch[0], "href") ?? null) : null;

  return { metaTags, title, lang, charset, canonical };
}

function getMeta(tags: MetaTag[], ...keys: string[]): string | null {
  for (const key of keys) {
    const found = tags.find((t) => t.property === key.toLowerCase());
    if (found?.content) return found.content;
  }
  return null;
}

// ── Scoring ────────────────────────────────────────────────────────────

function buildResult(
  url: string,
  domain: string,
  title: string | null,
  lang: string | null,
  charset: string | null,
  canonical: string | null,
  tags: MetaTag[],
): MetaCheckerResult {
  const description = getMeta(tags, "description");
  const keywords = getMeta(tags, "keywords");
  const robots = getMeta(tags, "robots");
  const viewport = getMeta(tags, "viewport");
  const themeColor = getMeta(tags, "theme-color");

  const ogTitle = getMeta(tags, "og:title");
  const ogDescription = getMeta(tags, "og:description");
  const ogImage = getMeta(tags, "og:image");
  const ogImageWidth = getMeta(tags, "og:image:width");
  const ogImageHeight = getMeta(tags, "og:image:height");
  const ogUrl = getMeta(tags, "og:url");
  const ogType = getMeta(tags, "og:type");
  const ogSiteName = getMeta(tags, "og:site_name");
  const ogLocale = getMeta(tags, "og:locale");

  const twitterCard = getMeta(tags, "twitter:card");
  const twitterTitle = getMeta(tags, "twitter:title");
  const twitterDescription = getMeta(tags, "twitter:description");
  const twitterImage = getMeta(tags, "twitter:image");
  const twitterSite = getMeta(tags, "twitter:site");

  const issues: MetaIssue[] = [];
  const passed: string[] = [];

  // ── Core SEO checks ────────────────────────────────────────────────
  if (!title) {
    issues.push({
      severity: "error",
      tag: "<title>",
      message: "Page title is missing.",
      fix: "Add a unique <title> tag (50–60 characters) to every page.",
    });
  } else if (title.length < 10) {
    issues.push({
      severity: "warning",
      tag: "<title>",
      message: `Title is too short (${title.length} chars).`,
      fix: "Expand title to 50–60 characters with your primary keyword.",
    });
  } else if (title.length > 70) {
    issues.push({
      severity: "warning",
      tag: "<title>",
      message: `Title may be truncated in SERPs (${title.length} chars, ideal ≤ 60).`,
      fix: "Trim title to 50–60 characters to prevent SERP truncation.",
    });
  } else {
    passed.push("Title length is good.");
  }

  if (!description) {
    issues.push({
      severity: "error",
      tag: "meta description",
      message: "Meta description is missing — Google may generate a low-quality snippet.",
      fix: "Write a unique meta description of 120–155 characters.",
    });
  } else if (description.length < 70) {
    issues.push({
      severity: "warning",
      tag: "meta description",
      message: `Description is too short (${description.length} chars).`,
      fix: "Expand description to 120–155 characters for better SERP CTR.",
    });
  } else if (description.length > 160) {
    issues.push({
      severity: "warning",
      tag: "meta description",
      message: `Description may be truncated (${description.length} chars, ideal ≤ 155).`,
      fix: "Trim description to 155 characters or less.",
    });
  } else {
    passed.push("Meta description length is good.");
  }

  if (!canonical) {
    issues.push({
      severity: "warning",
      tag: "canonical",
      message: "No canonical URL set — duplicate content risk.",
      fix: 'Add <link rel="canonical" href="https://yoursite.com/page"> to every page.',
    });
  } else {
    passed.push("Canonical URL is set.");
  }

  if (!lang) {
    issues.push({
      severity: "warning",
      tag: '<html lang="">',
      message: "Language is not declared on the <html> tag.",
      fix: 'Add lang="en" (or your language code) to the <html> element.',
    });
  } else {
    passed.push(`Language declared: ${lang}`);
  }

  if (!viewport) {
    issues.push({
      severity: "error",
      tag: "viewport",
      message: "Viewport meta tag is missing — site may not be mobile-friendly.",
      fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
    });
  } else {
    passed.push("Viewport meta tag is present.");
  }

  if (!charset) {
    issues.push({
      severity: "warning",
      tag: "charset",
      message: "Character encoding is not declared.",
      fix: 'Add <meta charset="UTF-8"> inside <head>.',
    });
  } else {
    passed.push(`Charset declared: ${charset}`);
  }

  if (robots && /noindex/i.test(robots)) {
    issues.push({
      severity: "error",
      tag: "robots",
      message: `robots meta contains "noindex" — this page is excluded from Google.`,
      fix: 'Remove "noindex" or change to <meta name="robots" content="index, follow">.',
    });
  } else if (robots) {
    passed.push(`Robots: ${robots}`);
  } else {
    passed.push("No robots restriction (defaults to index, follow).");
  }

  // ── Open Graph checks ──────────────────────────────────────────────
  if (!ogTitle) {
    issues.push({
      severity: "warning",
      tag: "og:title",
      message: "og:title is missing — Facebook and LinkedIn will use the page title.",
      fix: 'Add <meta property="og:title" content="Your Title">.',
    });
  } else {
    passed.push("og:title is set.");
  }

  if (!ogDescription) {
    issues.push({
      severity: "warning",
      tag: "og:description",
      message: "og:description is missing — social previews will show a poor snippet.",
      fix: 'Add <meta property="og:description" content="Your description">.',
    });
  } else {
    passed.push("og:description is set.");
  }

  if (!ogImage) {
    issues.push({
      severity: "error",
      tag: "og:image",
      message: "og:image is missing — no image will appear when shared on social media.",
      fix: 'Add <meta property="og:image" content="https://yoursite.com/og.png"> (1200×630px recommended).',
    });
  } else if (/\.svg$/i.test(ogImage)) {
    issues.push({
      severity: "error",
      tag: "og:image",
      message: "og:image is an SVG — Facebook, Twitter/X, WhatsApp do not render SVGs in previews.",
      fix: "Replace the SVG with a PNG or JPG image (1200×630px).",
    });
  } else {
    passed.push("og:image is set.");
    if (!ogImageWidth || !ogImageHeight) {
      issues.push({
        severity: "info",
        tag: "og:image:width / og:image:height",
        message: "og:image dimensions are not declared — Facebook may skip fetching the image.",
        fix: "Add og:image:width (1200) and og:image:height (630) meta tags.",
      });
    } else {
      passed.push(`og:image dimensions: ${ogImageWidth}×${ogImageHeight}`);
    }
  }

  if (!ogUrl) {
    issues.push({
      severity: "info",
      tag: "og:url",
      message: "og:url is not set.",
      fix: 'Add <meta property="og:url" content="https://yoursite.com/page">.',
    });
  } else {
    passed.push("og:url is set.");
  }

  if (!ogType) {
    issues.push({
      severity: "info",
      tag: "og:type",
      message: "og:type is not set.",
      fix: 'Add <meta property="og:type" content="website"> (or "article" for blog posts).',
    });
  } else {
    passed.push(`og:type: ${ogType}`);
  }

  // ── Twitter Card checks ────────────────────────────────────────────
  if (!twitterCard) {
    issues.push({
      severity: "warning",
      tag: "twitter:card",
      message: "Twitter Card is not configured — no preview on X (Twitter).",
      fix: 'Add <meta name="twitter:card" content="summary_large_image">.',
    });
  } else {
    passed.push(`twitter:card: ${twitterCard}`);
  }

  if (!twitterImage && !ogImage) {
    issues.push({
      severity: "warning",
      tag: "twitter:image",
      message: "No Twitter image is set and no og:image fallback exists.",
      fix: 'Add <meta name="twitter:image" content="https://yoursite.com/og.png">.',
    });
  } else if (twitterImage || ogImage) {
    passed.push("Twitter image is available (via twitter:image or og:image fallback).");
  }

  // ── Score calculation ──────────────────────────────────────────────
  const weights: { check: boolean; points: number }[] = [
    { check: !!title && title.length >= 10 && title.length <= 70, points: 20 },
    { check: !!description && description.length >= 70 && description.length <= 160, points: 15 },
    { check: !!canonical, points: 10 },
    { check: !!viewport, points: 10 },
    { check: !!lang, points: 5 },
    { check: !!charset, points: 5 },
    { check: !robots || !/noindex/i.test(robots), points: 5 },
    { check: !!ogTitle, points: 5 },
    { check: !!ogDescription, points: 5 },
    { check: !!ogImage && !/\.svg$/i.test(ogImage), points: 8 },
    { check: !!ogType, points: 3 },
    { check: !!ogUrl, points: 2 },
    { check: !!twitterCard, points: 5 },
    { check: !!(twitterImage || ogImage), points: 2 },
  ];
  const score = weights.reduce((s, w) => s + (w.check ? w.points : 0), 0);
  const grade: MetaCheckerResult["grade"] =
    score >= 90 ? "A" : score >= 75 ? "B" : score >= 55 ? "C" : score >= 35 ? "D" : "F";

  return {
    url,
    domain,
    fetchedAt: new Date().toISOString(),
    title,
    description,
    keywords,
    robots,
    canonical,
    viewport,
    charset,
    lang,
    themeColor,
    ogTitle,
    ogDescription,
    ogImage,
    ogImageWidth,
    ogImageHeight,
    ogUrl,
    ogType,
    ogSiteName,
    ogLocale,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterSite,
    score,
    grade,
    issues,
    passed,
  };
}

// ── Handler ────────────────────────────────────────────────────────────

export default defineEventHandler(async (event) => {
  const body = await readBody<{ url?: string }>(event);
  const rawUrl = (body?.url ?? "").trim();

  if (!rawUrl) {
    throw createError({ statusCode: 400, message: "URL is required." });
  }

  // Normalise — prepend https:// if scheme is missing
  const normalized = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw createError({ statusCode: 400, message: "Please enter a valid website URL." });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw createError({ statusCode: 400, message: "Only http and https URLs are allowed." });
  }

  assertPublicUrl(parsed);

  const domain = parsed.hostname.replace(/^www\./, "");
  const targetUrl = parsed.href;

  // ── Fetch the page ─────────────────────────────────────────────────
  let html: string;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        // Identify as a bot / crawler (transparent)
        "User-Agent": "RapidByt-MetaChecker/1.0 (+https://rapidbyt.com)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw createError({
        statusCode: 422,
        message: `The website returned HTTP ${response.status}. It may be blocking bots or require authentication.`,
      });
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("html")) {
      throw createError({
        statusCode: 422,
        message: "The URL does not appear to serve an HTML page.",
      });
    }

    // Cap at 2 MB
    const MAX_BYTES = 2 * 1024 * 1024;
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BYTES) {
        void reader.cancel();
        break;
      }
      chunks.push(value);
    }

    html = new TextDecoder().decode(
      chunks.reduce((acc, chunk) => {
        const merged = new Uint8Array(acc.length + chunk.length);
        merged.set(acc);
        merged.set(chunk, acc.length);
        return merged;
      }, new Uint8Array(0)),
    );
  } catch (err: unknown) {
    if (err && typeof err === "object" && "statusCode" in err) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("abort") || msg.includes("timed out")) {
      throw createError({
        statusCode: 408,
        message: "Request timed out — the site took too long to respond.",
      });
    }
    throw createError({
      statusCode: 502,
      message: `Could not fetch the website: ${msg.slice(0, 120)}`,
    });
  }

  // ── Parse & score ──────────────────────────────────────────────────
  const { metaTags, title, lang, charset, canonical } = parseMetaTags(html);
  return buildResult(targetUrl, domain, title, lang, charset, canonical, metaTags);
});
