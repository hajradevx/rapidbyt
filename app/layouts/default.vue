<script setup lang="ts">
// Prefetch the most-visited pages when idle
useHead({
  link: [
    { rel: 'prefetch', href: '/services' },
    { rel: 'prefetch', href: '/contact' },
  ],
})
</script>

<template>
  <AppHeader />
  <UMain>
    <NuxtPage />
  </UMain>
  <!-- Footer is below fold — lazy render -->
  <LazyAppFooter />
</template>
