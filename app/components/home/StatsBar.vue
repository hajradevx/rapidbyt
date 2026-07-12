<template>
  <section class="py-12 border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-zinc-200 dark:divide-zinc-800"
      >
        <div
          v-for="s in stats"
          :key="s.value"
          class="flex flex-col items-center text-center lg:px-8"
        >
          <span class="text-4xl font-black gradient-text leading-none mb-1">{{ s.value }}</span>
          <span class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{{ s.label }}</span>
          <span class="text-xs text-zinc-400 mt-0.5">{{ s.sub }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stats = [
  { value: "2.1s", label: "Avg. load time post-fix", sub: "Down from 9.4s average" },
  { value: "340%", label: "Avg. organic traffic growth", sub: "Within 6 months" },
  { value: "99.98%", label: "Uptime across managed sites", sub: "Last 12 months" },
  { value: "4.8★", label: "Client satisfaction rating", sub: "Based on 80+ reviews" },
];
</script>
