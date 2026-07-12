<template>
  <footer class="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        <!-- Brand -->
        <div class="space-y-4 lg:col-span-1">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center"
            >
              <span class="text-white font-black text-sm">R</span>
            </div>
            <span class="font-black text-xl tracking-tight">
              <span class="gradient-text">Rapid</span
              ><span class="text-zinc-900 dark:text-white">Byt</span>
            </span>
          </NuxtLink>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            We diagnose your digital bottlenecks and engineer solutions that make your business
            faster, smarter, and more profitable.
          </p>
          <div class="flex items-center gap-3 pt-2">
            <a
              href="https://twitter.com/rapidbyt"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
            >
              <UIcon name="i-lucide-twitter" class="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/company/rapidbyt"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
            >
              <UIcon name="i-lucide-linkedin" class="w-4 h-4" />
            </a>
            <a
              href="https://github.com/rapidbyt"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
            >
              <UIcon name="i-lucide-github" class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Services -->
        <div class="space-y-4">
          <h4 class="font-semibold text-zinc-900 dark:text-white text-sm uppercase tracking-wider">
            Services
          </h4>
          <ul class="space-y-3">
            <li v-for="link in serviceLinks" :key="link.label">
              <NuxtLink
                :to="link.to"
                class="text-sm text-zinc-500 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1.5 group"
              >
                <UIcon
                  name="i-lucide-arrow-right"
                  class="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                />
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Company -->
        <div class="space-y-4">
          <h4 class="font-semibold text-zinc-900 dark:text-white text-sm uppercase tracking-wider">
            Company
          </h4>
          <ul class="space-y-3">
            <li v-for="link in companyLinks" :key="link.label">
              <NuxtLink
                :to="link.to"
                class="text-sm text-zinc-500 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1.5 group"
              >
                <UIcon
                  name="i-lucide-arrow-right"
                  class="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                />
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="space-y-4">
          <h4 class="font-semibold text-zinc-900 dark:text-white text-sm uppercase tracking-wider">
            Get In Touch
          </h4>
          <ul class="space-y-3">
            <li class="flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <UIcon name="i-lucide-mail" class="w-4 h-4 mt-0.5 text-sky-500 shrink-0" />
              <a
                href="mailto:info.rapidbyt@gmail.com"
                class="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >info.rapidbyt@gmail.com</a
              >
            </li>
            <li class="flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <UIcon name="i-lucide-message-circle" class="w-4 h-4 mt-0.5 text-sky-500 shrink-0" />
              <a
                href="https://wa.me/923168636339"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >+92 316 863 6339</a
              >
            </li>
            <li class="flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <UIcon name="i-lucide-clock" class="w-4 h-4 mt-0.5 text-sky-500 shrink-0" />
              <span>Mon–Fri, 9am–6pm EST</span>
            </li>
          </ul>
          <UButton
            label="Free Website Audit"
            to="/contact"
            size="sm"
            variant="outline"
            color="primary"
            class="mt-2"
          />
          <UButton
            label="Auto-Diagnosis"
            to="/diagnose"
            size="sm"
            variant="soft"
            color="primary"
            class="mt-1"
            leading-icon="i-lucide-scan-search"
          />
        </div>
      </div>

      <!-- Bottom bar -->
      <div
        class="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p class="text-xs text-zinc-400">
          © {{ new Date().getFullYear() }} RapidByt Solutions. All rights reserved.
        </p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/privacy" class="text-xs text-zinc-400 hover:text-sky-500 transition-colors"
            >Privacy Policy</NuxtLink
          >
          <NuxtLink to="/terms" class="text-xs text-zinc-400 hover:text-sky-500 transition-colors"
            >Terms of Service</NuxtLink
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const serviceLinks = [
  { label: "Website Speed Optimization", to: "/services#speed" },
  { label: "SEO & Core Web Vitals", to: "/services#seo" },
  { label: "Web Application Development", to: "/services#dev" },
  { label: "Cloud & Hosting Solutions", to: "/services#cloud" },
  { label: "Security & Uptime Monitoring", to: "/services#security" },
];

const companyLinks = [
  { label: "Why RapidByt", to: "/#why" },
  { label: "Case Studies", to: "/#results" },
  { label: "Pricing", to: "/#pricing" },
  { label: "Free Diagnosis", to: "/diagnose" },
  { label: "Contact Us", to: "/contact" },
  { label: "Login", to: "/login" },
];
</script>
