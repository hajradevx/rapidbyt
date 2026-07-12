<script setup lang="ts">
// Global head tags set once at app level
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
  ],
  htmlAttrs: { lang: 'en' },
})
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <!-- Slim loading bar — 3px height, minimal JS -->
    <NuxtLoadingIndicator
      :height="3"
      :duration="2000"
      :throttle="100"
      color="var(--color-primary-500, #0ea5e9)" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
