<template>
  <section class="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
    <!-- Background blobs — CSS only, no JS, pointer-events off -->
    <div aria-hidden="true" class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-sky-400/10 dark:bg-sky-500/10 blur-3xl"
        style="will-change: auto"
      />
      <div
        class="absolute -bottom-20 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-400/10 dark:bg-indigo-500/10 blur-3xl"
        style="will-change: auto"
      />
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div
        class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400 text-sm font-medium mb-8"
      >
        <UIcon name="i-lucide-zap" class="w-4 h-4" />
        Turn your slow website into your biggest competitive advantage
      </div>
      <h1
        class="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 text-zinc-900 dark:text-white"
      >
        Your website is<br class="hidden sm:block" />
        <span class="gradient-text">losing you money.</span><br class="hidden sm:block" />
        We fix that.
      </h1>
      <p
        class="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10"
      >
        RapidByt diagnoses slow sites, broken code, and weak SEO — then engineers the fixes that
        turn digital problems into measurable revenue growth.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <UButton
          label="Get Your Free Audit"
          to="/contact"
          size="xl"
          class="glow-btn w-full sm:w-auto"
          trailing-icon="i-lucide-arrow-right"
        />
        <UButton
          label="Instant Auto-Diagnosis"
          to="/diagnose"
          size="xl"
          variant="outline"
          color="primary"
          leading-icon="i-lucide-scan-search"
          class="w-full sm:w-auto"
        />
      </div>
      <div class="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
        <div
          v-for="t in trustItems"
          :key="t"
          class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400"
        >
          <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-emerald-500 shrink-0" />
          {{ t }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const trustItems = [
  "No long-term contracts",
  "Results or we refund",
  "Audit in 24 hours",
  "100+ sites optimised",
];
</script>
