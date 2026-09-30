// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxthub/core",
    "@nuxt/image",
    "nuxt-auth-utils",
    "@nuxtjs/sitemap",
    "@nuxt/content",
  ],

  // ── Devtools — off in production, on in dev only ──────────
  devtools: { enabled: process.env.NODE_ENV !== "production" },

  // ── App head ─────────────────────────────────────────────
  app: {
    head: {
      htmlAttrs: { lang: "en" },

      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "dns-prefetch", href: "https://api.dicebear.com" },
        // Canonical — tells Google the authoritative non-www URL
        { rel: "canonical", href: "https://rapidbyt.com/" },
      ],

      meta: [
        { name: "theme-color", content: "#0ea5e9" },
        {
          name: "google-site-verification",
          content: "CitYK6ba8DPFHnzomMsJTibY_n1fw-teUUu20Cdrf-k",
        },
      ],

      script: [
        // Google consent mode v2 — set defaults BEFORE AdSense loads
        // so ad_storage starts as "denied" until the user accepts cookies
        {
          innerHTML: `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
window.gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});`,
        },
        {
          async: true,
          src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4495410434290445",
          crossorigin: "anonymous",
        },
      ],
    },

    pageTransition: { name: "page", mode: "out-in" },
  },

  css: ["~/assets/css/main.css"],

  // ── Router ──────────────────────────────────────────────
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },

  // ── Site URL (used by @nuxtjs/sitemap & other SEO modules) ──
  site: {
    url: "https://rapidbyt.com",
    name: "RapidByt",
  },

  // ── Content (blog) ──────────────────────────────────────
  content: {
    build: {
      markdown: {
        highlight: {
          theme: { default: "github-light", dark: "github-dark" },
          langs: ["js", "ts", "vue", "html", "css", "bash", "json"],
        },
      },
    },
  },

  // ── Nuxt UI ─────────────────────────────────────────────
  ui: {
    content: true,
    experimental: { componentDetection: true },
  },

  // ── Runtime config ──────────────────────────────────────
  runtimeConfig: {
    resendApiKey: process.env.NUXT_RESEND_API_KEY || "",
    pagespeedApiKey: process.env.NUXT_PAGESPEED_API_KEY || "",
  },

  // ── Experimental perf flags ─────────────────────────────
  experimental: {
    typedPages: true,
    writeEarlyHints: true,
    defaults: {
      nuxtLink: {
        trailingSlash: "remove",
        prefetch: true,
        prefetchOn: { visibility: true },
      },
    },
    viteEnvironmentApi: true,
    typescriptPlugin: true,
    extractAsyncDataHandlers: true,
    granularCachedData: true,
  },

  // ── Nitro / Cloudflare ──────────────────────────────────
  compatibilityDate: "2026-02-25",
  nitro: {
    // cloudflare_module preset only for production build — dev uses default
    // node preset so Node.js APIs (crypto, etc.) work without polyfills.
    preset: process.env.NODE_ENV === "production" ? "cloudflare_module" : undefined,
    cloudflare: { deployConfig: true, nodeCompat: true },
    compressPublicAssets: { gzip: true, brotli: true },
    minify: true,
    // resend@6 optionally imports @react-email/render which is a Node-only
    // package — Cloudflare Workers cannot bundle it. Alias it to a stub so
    // the build succeeds; we only use plain HTML strings, not React Email.
    alias: {
      "@react-email/render": fileURLToPath(
        new URL("./server/stubs/react-email-render.ts", import.meta.url),
      ),
    },
    routeRules: {
      "/_nuxt/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
      "/fonts/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
      "/": { headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=3600" } },
      "/services": {
        headers: { "cache-control": "public, s-maxage=300, stale-while-revalidate=3600" },
      },
      "/contact": {
        headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=600" },
      },
      "/diagnose": {
        headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=600" },
      },
      "/api/**": { headers: { "cache-control": "no-store" } },
    },
  },

  // ── NuxtHub ─────────────────────────────────────────────
  hub: { db: "sqlite" },

  // ── Vite ────────────────────────────────────────────────
  vite: {
    build: {
      cssMinify: true,
      // Rolldown (Vite+) requires manualChunks as a function, not an object
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (id.includes("node_modules/vue") || id.includes("node_modules/vue-router")) {
              return "vue-vendor";
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: ["vue", "vue-router"],
    },
    server: {
      ws: false,
      hmr: false,
    },
  },

  // ── ESLint ──────────────────────────────────────────────
  eslint: { config: { stylistic: true } },

  // ── Image optimisation ──────────────────────────────────
  image: {
    format: ["webp", "avif"],
    quality: 80,
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 },
  },
});
