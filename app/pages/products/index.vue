<script setup lang="ts">
definePageMeta({ layout: "default" });
useSeoMeta({
  title: "Products — RapidByt",
  description: "Free and premium tools from RapidByt to diagnose, optimize, and grow your website.",
  ogTitle: "Products & Tools — RapidByt",
  ogDescription:
    "Free website diagnosis tool, performance audits, SEO checklists, and speed optimization services from RapidByt.",
  ogImage: "https://rapidbyt.com/og-image.png",
});
useHead({
  link: [{ rel: "canonical", href: "https://rapidbyt.com/products" }],
});
</script>

<template>
  <UPage>
    <div class="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      <div
        class="absolute top-0 left-1/3 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/8 rounded-full blur-3xl"
      />
    </div>

    <UContainer class="py-20 max-w-5xl">
      <!-- Header -->
      <div class="text-center mb-14">
        <div
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-6"
        >
          <UIcon name="i-lucide-package" class="w-4 h-4" />
          Our Tools
        </div>
        <h1
          class="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4"
        >
          Products &amp; <span class="gradient-text">Tools</span>
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg">
          Free and premium tools to diagnose, fix, and grow your website's performance.
        </p>
      </div>

      <!-- Products grid -->
      <div class="grid sm:grid-cols-2 gap-6">
        <!-- Free Diagnosis Tool -->
        <div
          class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-7 flex flex-col"
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center shrink-0"
            >
              <UIcon name="i-lucide-scan-search" class="w-6 h-6 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h2 class="font-black text-zinc-900 dark:text-white">Free Website Diagnosis</h2>
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">Free</span>
            </div>
          </div>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 mb-6">
            Enter your URL and get an instant analysis of your Core Web Vitals, SEO issues, and
            performance bottlenecks — no signup required.
          </p>
          <UButton
            label="Run Free Diagnosis"
            to="/diagnose"
            color="primary"
            trailing-icon="i-lucide-arrow-right"
          />
        </div>

        <!-- Performance Audit Service -->
        <div
          class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-7 flex flex-col"
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0"
            >
              <UIcon name="i-lucide-zap" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 class="font-black text-zinc-900 dark:text-white">Full Performance Audit</h2>
              <span class="text-xs font-bold text-sky-600 dark:text-sky-400">Premium Service</span>
            </div>
          </div>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 mb-6">
            A manual deep-dive into your site — waterfall analysis, render-blocking resources,
            JavaScript profiling, and a prioritised fix list with estimated impact.
          </p>
          <UButton
            label="Request Audit"
            to="/contact"
            color="primary"
            variant="outline"
            trailing-icon="i-lucide-arrow-right"
          />
        </div>

        <!-- SEO Checklist -->
        <div
          class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-7 flex flex-col"
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0"
            >
              <UIcon
                name="i-lucide-list-checks"
                class="w-6 h-6 text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <div>
              <h2 class="font-black text-zinc-900 dark:text-white">Technical SEO Checklist</h2>
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400"
                >Free Guide</span
              >
            </div>
          </div>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 mb-6">
            A 50-point technical SEO checklist covering crawlability, indexation, structured data,
            Core Web Vitals, and more — with actionable fix notes for each item.
          </p>
          <UButton
            label="Get Free Audit"
            to="/contact"
            color="primary"
            variant="soft"
            trailing-icon="i-lucide-arrow-right"
          />
        </div>

        <!-- Speed Optimization Service -->
        <div
          class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-7 flex flex-col"
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0"
            >
              <UIcon name="i-lucide-gauge" class="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 class="font-black text-zinc-900 dark:text-white">Speed Optimization</h2>
              <span class="text-xs font-bold text-amber-600 dark:text-amber-400">Done-For-You</span>
            </div>
          </div>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 mb-6">
            We handle everything — image optimization, caching, CDN setup, JavaScript splitting, and
            server-side improvements — until your scores turn green.
          </p>
          <UButton
            label="Get Started"
            to="/services#speed"
            color="primary"
            variant="soft"
            trailing-icon="i-lucide-arrow-right"
          />
        </div>
      </div>
    </UContainer>
  </UPage>
</template>
