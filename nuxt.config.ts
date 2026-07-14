// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxthub/core", "@nuxt/image", "nuxt-auth-utils"],

  // ── Devtools — disabled to prevent HMR WebSocket conflict with Vite+ ──
  devtools: { enabled: false },

  // ── App head — preconnect critical origins ──────────────
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
        { rel: "dns-prefetch", href: "https://api.dicebear.com" },
      ],
      meta: [{ name: "theme-color", content: "#0ea5e9" }],
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
    typescriptPlugin: true,
    extractAsyncDataHandlers: true,
    granularCachedData: true,
  },

  // ── Nitro / Cloudflare ──────────────────────────────────
  compatibilityDate: "2026-02-25",
  nitro: {
    preset: "cloudflare_module",
    cloudflare: { deployConfig: true, nodeCompat: true },
    compressPublicAssets: { gzip: true, brotli: true },
    minify: true,
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

  // ── Vite — separate HMR port to avoid WebSocket upgrade conflict ──────
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
      hmr: {
        port: 24678,
        host: "localhost",
        protocol: "ws",
      },
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
