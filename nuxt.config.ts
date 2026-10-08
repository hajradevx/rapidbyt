export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxthub/core",
    "@nuxt/image",
    "nuxt-auth-utils",
    "@nuxt/content",
    "@nuxtjs/seo",
  ],

  // ── Devtools ─────────────────────────────────────────────
  devtools: {
    enabled: process.env.NODE_ENV !== "production",
  },

  // ── App head ─────────────────────────────────────────────
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },

      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "manifest",
          href: "/site.webmanifest",
        },
        {
          rel: "dns-prefetch",
          href: "https://api.dicebear.com",
        },
      ],

      meta: [
        {
          name: "theme-color",
          content: "#0ea5e9",
        },
        {
          name: "google-site-verification",
          content: "CitYK6ba8DPFHnzomMsJTibY_n1fw-teUUu20Cdrf-k",
        },
      ],

      script: [
        // Google Consent Mode v2 — defaults set BEFORE GTM/AdSense loads
        {
          key: "consent-mode",
          tagPriority: "critical",
          innerHTML: `window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
window.gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});`,
        },

        // Google Tag Manager — must load after Consent Mode defaults
        {
          key: "gtm",
          tagPriority: "critical",
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PXC3GX82');`,
        },

        {
          async: true,
          src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4495410434290445",
          crossorigin: "anonymous",
        },
      ],
    },

    pageTransition: {
      name: "page",
      mode: "out-in",
    },
  },
  css: ["~/assets/css/main.css"],
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },

  // ── Site URL (required for og:image / canonical absolute URLs) ──
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
  ui: {
    content: true,
    experimental: {
      componentDetection: true,
    },
  },

  runtimeConfig: {
    resendApiKey: process.env.NUXT_RESEND_API_KEY || "",
    pagespeedApiKey: process.env.NUXT_PAGESPEED_API_KEY || "",

    session: {
      password: process.env.NUXT_SESSION_PASSWORD || "prerender-build-time-placeholder-32chars!!",
    },
  },
  experimental: {
    typedPages: true,
    writeEarlyHints: true,

    defaults: {
      nuxtLink: {
        trailingSlash: "remove",
        prefetch: true,
        prefetchOn: {
          visibility: true,
        },
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
    preset: process.env.NODE_ENV === "production" ? "cloudflare_module" : undefined,

    cloudflare: {
      deployConfig: false,
      nodeCompat: true,
    },

    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },

    minify: true,

    alias: {
      "@react-email/render": "./server/stubs/react-email-render.ts",
    },

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
        "/blog/website-broken-on-mobile-fix",
        "/blog/website-down-what-to-do",
        "/blog/website-maintenance-checklist",
        "/blog/website-security-hardening-guide",
        "/blog/why-is-my-website-not-showing-on-google",
        "/blog/why-page-speed-matters-for-revenue",
        "/blog/wordpress-slow-website-fix-guide",
        "/blog/wordpress-vs-webflow-2026",
        "/sitemap.xml",
      ],
    },

    routeRules: {
      "/_nuxt/**": {
        headers: {
          "cache-control": "public, max-age=31536000, immutable",
        },
      },

      "/fonts/**": {
        headers: {
          "cache-control": "public, max-age=31536000, immutable",
        },
      },

      "/img/**": {
        headers: {
          "cache-control": "public, max-age=31536000, immutable",
        },
      },

      "/": {
        prerender: true,
      },

      "/about": {
        prerender: true,
      },

      "/services": {
        prerender: true,
      },

      "/products": {
        prerender: true,
      },

      "/privacy": {
        prerender: true,
      },

      "/terms": {
        prerender: true,
      },

      "/disclaimer": {
        prerender: true,
      },

      "/contact": {
        prerender: true,
      },

      "/diagnose": {
        prerender: true,
      },

      "/blog": {
        prerender: true,
      },

      "/blog/**": {
        prerender: true,
      },

      "/sitemap.xml": {
        prerender: true,
      },

      "/api/**": {
        headers: {
          "cache-control": "no-store",
        },
      },
    },
  },

  // ── NuxtHub ─────────────────────────────────────────────
  hub: {
    db: "sqlite",
  },

  // ── Vite ────────────────────────────────────────────────
  vite: {
    build: {
      cssMinify: true,

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
  eslint: {
    config: {
      stylistic: true,
    },
  },

  // ── Image ───────────────────────────────────────────────
  image: {
    format: ["webp", "avif"],
    quality: 80,

    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  seo: {
    // charset is set by a dependency we don't control — suppress the duplicate check
    validateAppHead: false,
  },
});
