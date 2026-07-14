<script setup lang="ts">
import type { FooterColumn, NavigationMenuItem } from "@nuxt/ui";

const columns: FooterColumn[] = [
  {
    label: "Services",
    children: [
      { label: "Website Speed Optimization", to: "/services#speed" },
      { label: "SEO & Core Web Vitals", to: "/services#seo" },
      { label: "Web Application Development", to: "/services#dev" },
      { label: "Cloud & Hosting Solutions", to: "/services#cloud" },
      { label: "Security & Uptime Monitoring", to: "/services#security" },
    ],
  },
  {
    label: "Company",
    children: [
      { label: "Why RapidByt", to: "/#why" },
      { label: "Case Studies", to: "/#results" },
      { label: "Pricing", to: "/#pricing" },
      { label: "Free Diagnosis", to: "/diagnose" },
      { label: "Contact Us", to: "/contact" },
      { label: "Login", to: "/login" },
    ],
  },
  {
    label: "Get In Touch",
    children: [
      {
        label: "info.rapidbyt@gmail.com",
        to: "mailto:info.rapidbyt@gmail.com",
        icon: "i-lucide-mail",
      },
      {
        label: "+92 316 863 6339",
        to: "https://wa.me/923168636339",
        target: "_blank",
        icon: "i-lucide-message-circle",
      },
      { label: "Mon–Fri, 9am–6pm EST", icon: "i-lucide-clock" },
    ],
  },
];

const bottomLinks: NavigationMenuItem[] = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];
</script>

<template>
  <UFooter>
    <!-- ── Top: brand + columns ── -->
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #left>
            <div class="space-y-4">
              <!-- Logo -->
              <NuxtLink to="/" class="flex items-center gap-2">
                <img
                  src="/img/logo.png"
                  alt="RapidByt"
                  class="size-12 object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <span class="font-black text-xl tracking-tight">
                  <span class="gradient-text">Rapid</span
                  ><span class="text-zinc-900 dark:text-white">Byt</span>
                </span>
              </NuxtLink>

              <!-- Tagline -->
              <p class="text-sm text-muted leading-relaxed max-w-xs">
                We diagnose your digital bottlenecks and engineer solutions that make your business
                faster, smarter, and more profitable.
              </p>

              <!-- Social icons -->
              <div class="flex items-center gap-1 pt-1">
                <UButton
                  to="https://twitter.com/rapidbyt"
                  target="_blank"
                  icon="i-lucide-twitter"
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  aria-label="Twitter"
                />
                <UButton
                  to="https://linkedin.com/company/rapidbyt"
                  target="_blank"
                  icon="i-lucide-linkedin"
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  aria-label="LinkedIn"
                />
                <UButton
                  to="https://github.com/rapidbyt"
                  target="_blank"
                  icon="i-lucide-github"
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  aria-label="GitHub"
                />
              </div>

              <!-- CTAs -->
              <div class="flex flex-col gap-2 pt-1">
                <UButton
                  label="Free Website Audit"
                  to="/contact"
                  size="sm"
                  variant="outline"
                  color="primary"
                />
                <UButton
                  label="Auto-Diagnosis"
                  to="/diagnose"
                  size="sm"
                  variant="soft"
                  color="primary"
                  leading-icon="i-lucide-scan-search"
                />
              </div>
            </div>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <!-- ── Bottom bar ── -->
    <template #left>
      <p class="text-sm text-muted">
        © {{ new Date().getFullYear() }} RapidByt Solutions. All rights reserved.
      </p>
    </template>

    <UNavigationMenu :items="bottomLinks" variant="link" />

    <template #right>
      <UButton
        to="https://twitter.com/rapidbyt"
        target="_blank"
        icon="i-lucide-twitter"
        color="neutral"
        variant="ghost"
        aria-label="Twitter"
      />
      <UButton
        to="https://linkedin.com/company/rapidbyt"
        target="_blank"
        icon="i-lucide-linkedin"
        color="neutral"
        variant="ghost"
        aria-label="LinkedIn"
      />
      <UButton
        to="https://github.com/rapidbyt"
        target="_blank"
        icon="i-lucide-github"
        color="neutral"
        variant="ghost"
        aria-label="GitHub"
      />
    </template>
  </UFooter>
</template>
