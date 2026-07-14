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
            <UButton
              to="https://twitter.com/rapidbyt"
              target="_blank"
              rel="noopener noreferrer"
              icon="i-lucide-twitter"
              variant="ghost"
              color="neutral"
              size="sm"
              class="w-9 h-9 rounded-lg"
            />
            <UButton
              to="https://linkedin.com/company/rapidbyt"
              target="_blank"
              rel="noopener noreferrer"
              icon="i-lucide-linkedin"
              variant="ghost"
              color="neutral"
              size="sm"
              class="w-9 h-9 rounded-lg"
            />
            <UButton
              to="https://github.com/rapidbyt"
              target="_blank"
              rel="noopener noreferrer"
              icon="i-lucide-github"
              variant="ghost"
              color="neutral"
              size="sm"
              class="w-9 h-9 rounded-lg"
            />
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
              <UButton
                to="mailto:info.rapidbyt@gmail.com"
                label="info.rapidbyt@gmail.com"
                variant="link"
                color="neutral"
                size="sm"
                class="p-0 h-auto"
              />
            </li>
            <li class="flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <UIcon name="i-lucide-message-circle" class="w-4 h-4 mt-0.5 text-sky-500 shrink-0" />
              <UButton
                to="https://wa.me/923168636339"
                target="_blank"
                rel="noopener noreferrer"
                label="+92 316 863 6339"
                variant="link"
                color="neutral"
                size="sm"
                class="p-0 h-auto"
              />
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
          <UButton
            label="Privacy Policy"
            to="/privacy"
            variant="link"
            color="neutral"
            size="xs"
            class="text-zinc-400 hover:text-sky-500 p-0"
          />
          <UButton
            label="Terms of Service"
            to="/terms"
            variant="link"
            color="neutral"
            size="xs"
            class="text-zinc-400 hover:text-sky-500 p-0"
          />
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
