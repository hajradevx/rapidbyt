<script setup lang="ts">
// Prefetch the most-visited pages when idle
useHead({
  link: [
    { rel: "prefetch", href: "/services" },
    { rel: "prefetch", href: "/contact" },
  ],
});
</script>

<template>
  <!-- Google Tag Manager (noscript) — immediately after opening <body> tag -->
  <noscript>
    <iframe
      src="https://www.googletagmanager.com/ns.html?id=GTM-PXC3GX82"
      height="0"
      width="0"
      style="display: none; visibility: hidden"
    />
  </noscript>
  <AppHeader />
  <UMain>
    <NuxtPage />
  </UMain>
  <!-- Footer is below fold — lazy render -->
  <LazyAppFooter />
  <!-- Cookie consent banner — shown on first visit -->
  <LazyAppCookieConsent />
</template>
