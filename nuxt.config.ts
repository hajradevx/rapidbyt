import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxthub/core",
    "@nuxt/image",
    "nuxt-auth-utils",
    // @nuxtjs/sitemap removed — manual server/routes/sitemap.xml.ts handles all 39 URLs.
    // The module was conflicting with the manual route and crawling @nuxt/content at
    // runtime on every sitemap request, causing CPU spikes on Cloudflare Workers.
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
    // Fallback password for prerender — only real password used at runtime
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || "prerender-build-time-placeholder-32chars!!",
    },
    public: {
      siteUrl: "https://rapidbyt.com",
      siteName: "RapidByt",
    },
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
  compatibilityDate: "2026-10-01",
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

    // ── Explicitly tell Nitro to crawl + generate these at build time ──────
    // crawlLinks: false — all routes explicitly listed, no auto-discovery needed
    prerender: {
      crawlLinks: false,
      routes: [
        "/",
        "/about",
        "/services",
        "/products",
        "/privacy",
        "/terms",
        "/disclaimer",
        "/contact",
        "/diagnose",
        "/blog",
        "/blog/best-web-hosting-pakistan-2026",
        "/blog/chatgpt-website-content-seo-safe",
        "/blog/competitor-outranking-you-on-google",
        "/blog/contact-form-emails-not-arriving",
        "/blog/core-web-vitals-guide-2026",
        "/blog/fast-website-still-losing-sales-cro",
        "/blog/free-website-speed-check-tools",
        "/blog/get-first-1000-visitors-without-paid-ads",
        "/blog/google-ads-not-converting-fix",
        "/blog/google-ads-vs-facebook-ads-2026",
        "/blog/google-analytics-not-working-fix",
        "/blog/google-search-console-setup-beginners",
        "/blog/high-bounce-rate-causes-and-fixes",
        "/blog/how-to-move-to-cloudflare-and-cut-hosting-costs",
        "/blog/images-loading-blurry-wrong-size",
        "/blog/nuxt-cloudflare-workers-d1-local-vs-production",
        "/blog/shopify-vs-woocommerce-2026",
        "/blog/ssl-certificate-errors-fix",
        "/blog/technical-seo-checklist-2026",
        "/blog/traffic-not-converting-landing-page-fixes",
        "/blog/website-bounce-rate-kam-kaise-karein",
        "/blog/website-broken-on-mobile-fix",
        "/blog/website-down-what-to-do",
        "/blog/website-maintenance-checklist",
        "/blog/website-security-hardening-guide",
        "/blog/why-is-my-website-not-showing-on-google",
        "/blog/why-page-speed-matters-for-revenue",
        "/blog/wordpress-slow-website-fix-guide",
        "/blog/wordpress-vs-webflow-2026",
      ],
    },
    routeRules: {
      "/_nuxt/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
      "/fonts/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
      "/img/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },

      // ── Fully prerendered at build time — Worker NEVER runs for these ──────
      "/": { prerender: true },
      "/about": { prerender: true },
      "/services": { prerender: true },
      "/products": { prerender: true },
      "/privacy": { prerender: true },
      "/terms": { prerender: true },
      "/disclaimer": { prerender: true },
      "/contact": { prerender: true },
      "/diagnose": { prerender: true },
      "/blog": { prerender: true },

      // All 29 blog posts — prerendered at build time
      "/blog/best-web-hosting-pakistan-2026": { prerender: true },
      "/blog/chatgpt-website-content-seo-safe": { prerender: true },
      "/blog/competitor-outranking-you-on-google": { prerender: true },
      "/blog/contact-form-emails-not-arriving": { prerender: true },
      "/blog/core-web-vitals-guide-2026": { prerender: true },
      "/blog/fast-website-still-losing-sales-cro": { prerender: true },
      "/blog/free-website-speed-check-tools": { prerender: true },
      "/blog/get-first-1000-visitors-without-paid-ads": { prerender: true },
      "/blog/google-ads-not-converting-fix": { prerender: true },
      "/blog/google-ads-vs-facebook-ads-2026": { prerender: true },
      "/blog/google-analytics-not-working-fix": { prerender: true },
      "/blog/google-search-console-setup-beginners": { prerender: true },
      "/blog/high-bounce-rate-causes-and-fixes": { prerender: true },
      "/blog/how-to-move-to-cloudflare-and-cut-hosting-costs": { prerender: true },
      "/blog/images-loading-blurry-wrong-size": { prerender: true },
      "/blog/nuxt-cloudflare-workers-d1-local-vs-production": { prerender: true },
      "/blog/shopify-vs-woocommerce-2026": { prerender: true },
      "/blog/ssl-certificate-errors-fix": { prerender: true },
      "/blog/technical-seo-checklist-2026": { prerender: true },
      "/blog/traffic-not-converting-landing-page-fixes": { prerender: true },
      "/blog/website-bounce-rate-kam-kaise-karein": { prerender: true },
      "/blog/website-broken-on-mobile-fix": { prerender: true },
      "/blog/website-down-what-to-do": { prerender: true },
      "/blog/website-maintenance-checklist": { prerender: true },
      "/blog/website-security-hardening-guide": { prerender: true },
      "/blog/why-is-my-website-not-showing-on-google": { prerender: true },
      "/blog/why-page-speed-matters-for-revenue": { prerender: true },
      "/blog/wordpress-slow-website-fix-guide": { prerender: true },
      "/blog/wordpress-vs-webflow-2026": { prerender: true },

      // Sitemap — static, prerender it too
      "/sitemap.xml": { prerender: true },

      // ── Only these truly need the Worker (dynamic/API) ───────────────────
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
