export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxthub/core', '@nuxt/image', 'nuxt-auth-utils'],

  // ── Devtools ─────────────────────────────────────────────
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  // ── App head ─────────────────────────────────────────────
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'dns-prefetch', href: 'https://api.dicebear.com' },
        { rel: 'canonical', href: 'https://rapidbyt.com/' },
      ],
      meta: [
        { name: 'theme-color', content: '#0ea5e9' },
        {
          name: 'google-site-verification',
          content: 'CitYK6ba8DPFHnzomMsJTibY_n1fw-teUUu20Cdrf-k',
        },
      ],
      script: [
        // Google Consent Mode v2 — defaults set BEFORE AdSense loads
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
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4495410434290445',
          crossorigin: 'anonymous',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  css: ['~/assets/css/main.css'],

  router: {
    options: { scrollBehaviorType: 'smooth' },
  },

  // ── Nuxt UI ─────────────────────────────────────────────
  ui: {
    experimental: { componentDetection: true },
  },

  // ── Runtime config ──────────────────────────────────────
  runtimeConfig: {
    resendApiKey: process.env.NUXT_RESEND_API_KEY || '',
    pagespeedApiKey: process.env.NUXT_PAGESPEED_API_KEY || '',
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || 'prerender-build-time-placeholder-32chars!!',
    },
  },

  // ── Experimental ────────────────────────────────────────
  experimental: {
    typedPages: true,
    writeEarlyHints: true,
    defaults: {
      nuxtLink: {
        trailingSlash: 'remove',
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
  compatibilityDate: '2026-10-01',
  nitro: {
    preset: process.env.NODE_ENV === 'production' ? 'cloudflare_module' : undefined,
    cloudflare: { deployConfig: true, nodeCompat: true },
    compressPublicAssets: { gzip: true, brotli: true },
    minify: true,
    alias: {
      '@react-email/render': fileURLToPath(
        new URL('./server/stubs/react-email-render.ts', import.meta.url),
      ),
    },

    prerender: {
      crawlLinks: false,
      routes: [
        '/',
        '/about',
        '/services',
        '/products',
        '/privacy',
        '/terms',
        '/disclaimer',
        '/contact',
        '/diagnose',
        '/sitemap.xml',
      ],
    },

    routeRules: {
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/img/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/': { prerender: true },
      '/about': { prerender: true },
      '/services': { prerender: true },
      '/products': { prerender: true },
      '/privacy': { prerender: true },
      '/terms': { prerender: true },
      '/disclaimer': { prerender: true },
      '/contact': { prerender: true },
      '/diagnose': { prerender: true },
      '/sitemap.xml': { prerender: true },
      '/api/**': { headers: { 'cache-control': 'no-store' } },
    },
  },

  // ── NuxtHub ─────────────────────────────────────────────
  hub: { db: 'sqlite' },

  // ── Vite ────────────────────────────────────────────────
  vite: {
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (id.includes('node_modules/vue') || id.includes('node_modules/vue-router')) {
              return 'vue-vendor'
            }
          },
        },
      },
    },
    optimizeDeps: { include: ['vue', 'vue-router'] },
    server: { ws: false, hmr: false },
  },

  // ── ESLint ──────────────────────────────────────────────
  eslint: { config: { stylistic: true } },

  // ── Image ───────────────────────────────────────────────
  image: {
    format: ['webp', 'avif'],
    quality: 80,
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 },
  },
})
