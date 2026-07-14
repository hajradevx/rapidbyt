<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";

const { logout, isLoggingOut } = useLogout();
const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  { label: "Services", to: "/services", active: route.path.startsWith("/services") },
  { label: "Why RapidByt", to: "/#why" },
  { label: "Pricing", to: "/#pricing" },
  {
    label: "Free Diagnosis",
    to: "/diagnose",
    icon: "i-lucide-scan-search",
    active: route.path.startsWith("/diagnose"),
    class: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-300 dark:border-sky-700",
  },
  { label: "Contact", to: "/contact", active: route.path.startsWith("/contact") },
]);

const profileItems = ref<DropdownMenuItem[][]>([
  [
    {
      label: "Logout",
      icon: "i-lucide-log-out",
      onSelect: logout,
      disabled: isLoggingOut.value,
    },
  ],
]);
</script>

<template>
  <UHeader
    :ui="{
      root: 'bg-white/75 dark:bg-zinc-950/75 backdrop-blur border-b border-zinc-200/60 dark:border-zinc-800/60 h-16 sticky top-0 z-50',
    }"
  >
    <!-- ── Logo ── -->
    <template #title>
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <div
          class="relative w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:shadow-sky-500/50 transition-shadow duration-300"
        >
          <span class="text-white font-black text-base leading-none tracking-tighter">R</span>
          <div class="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/20" />
        </div>
        <span class="font-black text-xl tracking-tight select-none">
          <span class="gradient-text">Rapid</span
          ><span class="text-zinc-900 dark:text-white">Byt</span>
        </span>
      </NuxtLink>
    </template>

    <!-- ── Desktop nav (center) ── -->
    <UNavigationMenu :items="items" />

    <!-- ── Right actions ── -->
    <template #right>
      <UColorModeButton size="sm" />

      <UButton
        label="Free Audit"
        to="/contact"
        size="sm"
        variant="solid"
        color="primary"
        class="hidden sm:flex glow-btn font-semibold rounded-xl"
        trailing-icon="i-lucide-arrow-right"
      />

      <AppAuthSection :profile-items="profileItems" />
    </template>

    <!-- ── Mobile menu body ── -->
    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />

      <div class="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
        <UButton
          label="Get Free Audit"
          to="/contact"
          variant="solid"
          color="primary"
          class="w-full font-semibold"
          size="md"
          trailing-icon="i-lucide-arrow-right"
        />
        <UButton
          label="Instant Auto-Diagnosis"
          to="/diagnose"
          variant="outline"
          color="primary"
          class="w-full font-semibold"
          size="md"
          leading-icon="i-lucide-scan-search"
        />
      </div>
    </template>
  </UHeader>
</template>
