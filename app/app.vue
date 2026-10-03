<script setup lang="ts">
// Global head tags set once at app level — lang is set here, viewport is handled by Nuxt
useHead({
  htmlAttrs: { lang: "en" },
});
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <!-- Slim loading bar — 3px height, minimal JS -->
    <NuxtLoadingIndicator
      :height="3"
      :duration="2000"
      :throttle="100"
      color="var(--color-primary-500, #0ea5e9)"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
