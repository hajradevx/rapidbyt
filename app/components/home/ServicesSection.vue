<template>
  <section id="services" class="py-24 bg-white dark:bg-zinc-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 fade-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-4">
          What We Do
        </div>
        <h2 class="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white">
          Solutions engineered for<br class="hidden sm:block"> real business impact
        </h2>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Every service is built around one question: how does this increase revenue or reduce cost for your business?
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(s, i) in services"
          :key="s.title"
          class="fade-up gradient-border card-hover rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 relative"
          :style="`transition-delay:${i * 60}ms`">
          <div v-if="s.badge" class="absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400">
            {{ s.badge }}
          </div>
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-4', s.bg]">
            <UIcon :name="s.icon" :class="['w-6 h-6', s.color]" />
          </div>
          <h3 class="font-bold text-zinc-900 dark:text-white mb-2 text-lg">
            {{ s.title }}
          </h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {{ s.desc }}
          </p>
          <NuxtLink to="/services" class="mt-4 flex items-center gap-1 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:gap-2 transition-all">
            Learn more <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const services = [
  { icon: 'i-lucide-zap', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', title: 'Speed Optimisation', desc: 'Cut load times up to 80% via Cloudflare edge caching, code splitting, image compression, and SSR.', badge: 'Most Popular' },
  { icon: 'i-lucide-trending-up', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', title: 'SEO & Core Web Vitals', desc: 'Technical audits, structured data, LCP/CLS fixes, and content strategy that climbs rankings and stays.', badge: null },
  { icon: 'i-lucide-code-2', color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-900/20', title: 'Web App Development', desc: 'Full-stack apps with Nuxt, Vue, React — edge-first architecture built for performance and real outcomes.', badge: null },
  { icon: 'i-lucide-cloud', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', title: 'Cloud & Infrastructure', desc: 'Cloudflare Workers, D1, R2 and serverless deployments. Zero cold starts. Global edge. Infinite scale.', badge: null },
  { icon: 'i-lucide-shield-check', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', title: 'Security & Monitoring', desc: '24/7 uptime checks, vulnerability scanning, automated backups, and instant alerting before it hurts.', badge: null },
  { icon: 'i-lucide-bar-chart-2', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', title: 'Analytics & CRO', desc: 'Heatmaps, funnel analysis, A/B testing, and data-driven recommendations that grow conversions.', badge: null },
]
</script>
