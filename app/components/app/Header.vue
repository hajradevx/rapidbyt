<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const { logout, isLoggingOut } = useLogout();
const route = useRoute();

const navLinks = [
  { label: "Services", to: "/services", highlight: false },
  { label: "Why RapidByt", to: "/#why", highlight: false },
  { label: "Pricing", to: "/#pricing", highlight: false },
  { label: "Free Diagnosis", to: "/diagnose", highlight: true },
  { label: "Contact", to: "/contact", highlight: false },
];

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

const isScrolled = ref(false);
const mobileOpen = ref(false);

onMounted(() => {
  const onScroll = () => {
    isScrolled.value = window.scrollY > 16;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onUnmounted(() => window.removeEventListener("scroll", onScroll));
});

// Close mobile menu on route change
watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false;
  },
);

function isActive(to: string) {
  if (to === "/") return route.path === "/";
  return route.path.startsWith(to.split("#")[0]) && to.split("#")[0] !== "/";
}
</script>

<template>
  <!-- ── Navbar ─────────────────────────────────────────── -->
  <header
    class="fixed top-0 inset-x-0 z-50 transition-all duration-300"
    :class="
      isScrolled
        ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl shadow-sm shadow-zinc-900/5 border-b border-zinc-200/60 dark:border-zinc-800/60'
        : 'bg-transparent border-b border-transparent'
    "
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-18">
        <!-- ── Logo ── -->
        <NuxtLink to="/" class="flex items-center gap-2.5 group shrink-0">
          <div
            class="relative w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:shadow-sky-500/50 transition-shadow duration-300"
          >
            <span class="text-white font-black text-base leading-none tracking-tighter">R</span>
            <!-- subtle shine -->
            <div
              class="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/20"
            />
          </div>
          <span class="font-black text-xl tracking-tight select-none">
            <span class="gradient-text">Rapid</span
            ><span class="text-zinc-900 dark:text-white">Byt</span>
          </span>
        </NuxtLink>

        <!-- ── Desktop nav ── -->
        <nav class="hidden lg:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="[
              'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              link.highlight
                ? 'bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-300 dark:border-sky-700 hover:bg-sky-500/20'
                : isActive(link.to)
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60',
            ]"
          >
            <span v-if="link.highlight" class="flex items-center gap-1.5">
              <UIcon name="i-lucide-scan-search" class="w-3.5 h-3.5" />
              {{ link.label }}
            </span>
            <template v-else>{{ link.label }}</template>
            <span
              v-if="!link.highlight && isActive(link.to)"
              class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sky-500"
            />
          </NuxtLink>
        </nav>

        <!-- ── Right actions ── -->
        <div class="flex items-center gap-2">
          <UColorModeButton size="sm" />

          <UButton
            label="Free Audit"
            to="/contact"
            size="sm"
            variant="solid"
            color="primary"
            class="hidden sm:flex glow-btn font-semibold rounded-xl px-4"
            trailing-icon="i-lucide-arrow-right"
          />

          <AppAuthSection :profile-items="profileItems" />

          <!-- Mobile hamburger -->
          <UButton
            :icon="mobileOpen ? 'i-lucide-x' : 'i-lucide-menu'"
            :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
            variant="ghost"
            color="neutral"
            size="sm"
            class="lg:hidden"
            @click="mobileOpen = !mobileOpen"
          />
        </div>
      </div>
    </div>

    <!-- ── Mobile drawer ── -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileOpen"
        class="lg:hidden border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl"
      >
        <nav class="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
              link.highlight
                ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800'
                : isActive(link.to)
                  ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800',
            ]"
          >
            <UIcon v-if="link.highlight" name="i-lucide-scan-search" class="w-4 h-4 shrink-0" />
            <span
              v-else
              :class="[
                'w-1.5 h-1.5 rounded-full shrink-0',
                isActive(link.to) ? 'bg-sky-500' : 'bg-zinc-300 dark:bg-zinc-600',
              ]"
            />
            {{ link.label }}
          </NuxtLink>

          <div class="pt-3 mt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
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
        </nav>
      </div>
    </Transition>
  </header>

  <!-- Spacer so content doesn't go under fixed header -->
  <div class="h-16 lg:h-18" />
</template>
