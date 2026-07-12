<template>
  <section class="py-24 bg-white dark:bg-zinc-950">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 fade-up">
        <h2 class="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white">
          Frequently asked questions
        </h2>
        <p class="text-zinc-500 dark:text-zinc-400">
          Still not sure? Here are the questions we hear most often.
        </p>
      </div>

      <div class="space-y-3">
        <div
          v-for="(item, i) in faqs"
          :key="i"
          class="fade-up rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 overflow-hidden"
          :style="`transition-delay:${i * 50}ms`">
          <button
            class="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
            @click="toggle(i)">
            <span class="font-semibold text-zinc-900 dark:text-white text-sm sm:text-base">{{ item.q }}</span>
            <UIcon
              name="i-lucide-chevron-down"
              :class="['w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-300', openIdx === i ? 'rotate-180' : '']" />
          </button>
          <div
            class="overflow-hidden transition-all duration-300"
            :style="openIdx === i ? 'max-height:400px;opacity:1' : 'max-height:0;opacity:0'">
            <p class="px-6 pb-5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {{ item.a }}
            </p>
          </div>
        </div>
      </div>

      <div class="text-center mt-12 fade-up">
        <p class="text-zinc-500 dark:text-zinc-400 mb-4">
          Have a question we didn't answer?
        </p>
        <UButton label="Ask Us Anything" to="/contact" variant="outline" color="primary" trailing-icon="i-lucide-message-circle" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const openIdx = ref<number | null>(0)
const toggle = (i: number) => { openIdx.value = openIdx.value === i ? null : i }

const faqs = [
  { q: 'How much can you actually improve my site speed?', a: 'Most client sites go from a PageSpeed score of 20–40 to 90+ after our optimisation sprint. Load times typically drop 70–85%. We share benchmarks upfront before any commitment.' },
  { q: 'Do I need to rebuild my entire site?', a: 'Rarely. Most improvements are done without a full rebuild — we optimise existing code, assets, server config, and caching. A rebuild is only recommended when technical debt makes it cheaper.' },
  { q: 'How long does it take to see results?', a: 'Speed improvements are visible immediately. SEO gains typically show within 4–12 weeks as Google re-crawls and indexes your improved pages.' },
  { q: 'Will this affect my site design or content?', a: 'No. Performance work is done under the hood. Your design, branding, and content stay the same unless you ask us to improve those too.' },
  { q: 'Do you work with any tech stack?', a: 'We specialise in modern stacks (Nuxt, Next.js, Vue, React) and Cloudflare edge infrastructure, but we can audit and optimise any website regardless of the technology.' },
]
</script>
