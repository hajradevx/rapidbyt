<template>
  <section class="py-24 bg-zinc-50 dark:bg-zinc-900/40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 fade-up">
        <h2 class="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white">
          Recognise any of these problems?
        </h2>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          These are the silent killers that cost businesses thousands every month — and most owners don't even know the problem exists.
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(p, i) in problems"
          :key="p.title"
          class="fade-up card-hover rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
          :style="`transition-delay:${i * 60}ms`">
          <div class="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <UIcon :name="p.icon" class="w-5 h-5 text-red-500" />
          </div>
          <h3 class="font-bold text-zinc-900 dark:text-white mb-2">
            {{ p.title }}
          </h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {{ p.desc }}
          </p>
        </div>
      </div>
      <div class="text-center mt-12 fade-up">
        <p class="text-zinc-600 dark:text-zinc-400 mb-5 font-medium">
          Sound familiar? Find out exactly what's broken on your site — in seconds.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <UButton
            label="Run Instant Diagnosis"
            to="/diagnose"
            size="lg"
            class="glow-btn w-full sm:w-auto"
            leading-icon="i-lucide-scan-search" />
          <UButton
            label="Talk to a Human"
            to="/contact"
            size="lg"
            variant="outline"
            color="neutral"
            class="w-full sm:w-auto"
            trailing-icon="i-lucide-arrow-right" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const problems = [
  { icon: 'i-lucide-gauge', title: 'Slow Load Times', desc: 'Every second of delay costs 7% in conversions. Google penalises slow pages — so do your customers.' },
  { icon: 'i-lucide-search-x', title: 'Poor SEO Rankings', desc: 'Invisible on Google means zero organic traffic. Bad Core Web Vitals tank your rankings before you start.' },
  { icon: 'i-lucide-bug', title: 'Buggy Functionality', desc: 'Broken forms, crashing checkouts, and JS errors erode trust and destroy revenue quietly every day.' },
  { icon: 'i-lucide-shield-off', title: 'Security Vulnerabilities', desc: 'Outdated software and weak configs expose your business to downtime, data breaches, and penalties.' },
  { icon: 'i-lucide-server-crash', title: 'Unreliable Hosting', desc: 'Shared hosting that buckles under traffic spikes sends customers straight to your competitors.' },
  { icon: 'i-lucide-smartphone', title: 'Poor Mobile UX', desc: '60% of traffic is mobile. A site that breaks on phones simply does not exist for most of your customers.' },
]
</script>
