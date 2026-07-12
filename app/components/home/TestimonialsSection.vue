<template>
  <section id="results" class="py-24 bg-white dark:bg-zinc-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 fade-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Real Results
        </div>
        <h2 class="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white">
          Don't take our word for it
        </h2>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Here's what happened when real businesses stopped guessing and started fixing.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(t, i) in testimonials"
          :key="t.name"
          class="fade-up card-hover rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 flex flex-col"
          :style="`transition-delay:${i * 80}ms`">
          <!-- Stars -->
          <div class="flex items-center gap-0.5 mb-4">
            <UIcon v-for="n in 5" :key="n" name="i-lucide-star" class="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <blockquote class="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed flex-1 mb-6">
            "{{ t.text }}"
          </blockquote>
          <div class="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div class="flex items-center gap-3">
              <div :class="['w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black', t.color]">
                {{ t.initials }}
              </div>
              <div>
                <p class="text-sm font-bold text-zinc-900 dark:text-white">
                  {{ t.name }}
                </p>
                <p class="text-xs text-zinc-400">
                  {{ t.role }}
                </p>
              </div>
            </div>
            <span class="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
              {{ t.metric }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const testimonials = [
  { name: 'Aisha Rahman', role: 'E-commerce Founder', initials: 'AR', color: 'bg-sky-500', text: 'Our checkout load time dropped from 11 seconds to under 2. Conversion rate jumped 42% in the first month. RapidByt paid for itself in week one.', metric: '+42% conversions' },
  { name: 'Marcus Cole', role: 'SaaS CEO', initials: 'MC', color: 'bg-indigo-500', text: 'We were losing money on slow infrastructure. RapidByt migrated us to Cloudflare edge and server bills dropped 60% while performance went through the roof.', metric: '−60% server costs' },
  { name: 'Sofia Mendez', role: 'Digital Agency Owner', initials: 'SM', color: 'bg-emerald-500', text: 'I send all clients with performance issues to RapidByt. They fix things fast, explain clearly, and results are always measurable and significant.', metric: '3× organic traffic' },
]
</script>
