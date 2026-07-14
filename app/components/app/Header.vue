<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";

const { logout, isLoggingOut } = useLogout();
const route = useRoute();

const announcementVisible = ref(true);

const navItems = computed<NavigationMenuItem[]>(() => [
  {
    label: "Services",
    icon: "i-lucide-layers",
    children: [
      {
        label: "Speed Optimization",
        description: "Cut load times, boost Core Web Vitals",
        icon: "i-lucide-zap",
        to: "/services#speed",
      },
      {
        label: "SEO & Core Web Vitals",
        description: "Rank higher with technical SEO",
        icon: "i-lucide-bar-chart-2",
        to: "/services#seo",
      },
      {
        label: "Web App Development",
        description: "Scalable, performant applications",
        icon: "i-lucide-code-2",
        to: "/services#dev",
      },
      {
        label: "Cloud & Hosting",
        description: "Edge-ready infrastructure at scale",
        icon: "i-lucide-cloud",
        to: "/services#cloud",
      },
      {
        label: "Security & Monitoring",
        description: "24/7 uptime and threat detection",
        icon: "i-lucide-shield-check",
        to: "/services#security",
      },
    ],
  },
  {
    label: "Why RapidByt",
    to: "/#why",
    active: false,
  },
  {
    label: "Pricing",
    to: "/#pricing",
    active: false,
  },
  {
    label: "Contact",
    to: "/contact",
    active: route.path.startsWith("/contact"),
  },
]);

const profileItems = ref<DropdownMenuItem[][]>([
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-right-on-rectangle",
      onSelect: logout,
      disabled: isLoggingOut.value,
    },
  ],
]);
</script>

<template>
  <div class="sticky top-0 z-50">
    <!-- ── Announcement Bar ── -->
    <Transition name="announcement">
      <div
        v-if="announcementVisible"
        class="relative bg-linear-to-r from-sky-600 to-indigo-600 text-white text-center text-xs font-medium py-2 px-10 hidden sm:block"
      >
        <NuxtLink
          to="/diagnose"
          class="hover:underline underline-offset-2 inline-flex items-center gap-1.5"
        >
          <UIcon name="i-lucide-scan-search" class="w-3.5 h-3.5 shrink-0" />
          Free instant website diagnosis — see exactly what's slowing you down
          <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5 shrink-0" />
        </NuxtLink>
        <button
          class="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss announcement"
          @click="announcementVisible = false"
        >
          <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
        </button>
      </div>
    </Transition>

    <!-- ── Main Header ── -->
    <UHeader
      :ui="{
        root: 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/70 dark:border-zinc-800/60 h-16',
      }"
    >
      <!-- ── Logo ── -->
      <template #title>
        <NuxtLink to="/" class="flex items-center gap-2.5 group">
          <img
            src="/img/logo.png"
            alt="RapidByt"
            class="h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <div class="flex flex-col leading-tight">
            <span class="font-black text-xl tracking-tight select-none leading-none">
              <span class="gradient-text">Rapid</span
              ><span class="text-zinc-900 dark:text-white">Byt</span>
            </span>
            <span
              class="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium tracking-widest uppercase leading-none mt-0.5 hidden sm:block"
            >
              Web Performance
            </span>
          </div>
        </NuxtLink>
      </template>

      <!-- ── Desktop nav ── -->
      <UNavigationMenu :items="navItems" />

      <!-- ── Right actions ── -->
      <template #right>
        <UColorModeButton size="sm" />

        <!-- Diagnosis CTA — subtle -->
        <UButton
          label="Free Diagnosis"
          to="/diagnose"
          size="sm"
          variant="ghost"
          color="neutral"
          class="hidden md:flex font-medium text-zinc-600 dark:text-zinc-300"
          leading-icon="i-lucide-scan-search"
        />

        <!-- Primary CTA -->
        <UButton
          label="Get Free Audit"
          to="/contact"
          size="sm"
          variant="solid"
          color="primary"
          class="hidden sm:flex glow-btn font-semibold rounded-xl"
          trailing-icon="i-lucide-arrow-right"
        />

        <AppAuthSection :profile-items="profileItems" />
      </template>

      <!-- ── Mobile menu ── -->
      <template #body>
        <!-- Mobile nav links -->
        <UNavigationMenu :items="navItems" orientation="vertical" class="-mx-2.5" />

        <!-- Mobile trust badge -->
        <div
          class="mt-4 flex items-center gap-2 px-2 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
        >
          <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-emerald-500 shrink-0" />
          <span class="text-xs text-zinc-500 dark:text-zinc-400"
            >Trusted by 50+ businesses worldwide</span
          >
        </div>

        <!-- Mobile CTAs -->
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
  </div>
</template>

<style scoped>
.announcement-enter-active,
.announcement-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.announcement-enter-from,
.announcement-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.announcement-enter-to,
.announcement-leave-from {
  opacity: 1;
  max-height: 40px;
}
</style>
