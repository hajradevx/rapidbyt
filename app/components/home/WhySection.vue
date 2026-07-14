<template>
  <section id="why" class="py-24 bg-zinc-50 dark:bg-zinc-900/40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left: Copy -->
        <div class="fade-up">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            Why RapidByt
          </div>
          <h2
            class="text-3xl sm:text-4xl font-black tracking-tight mb-6 text-zinc-900 dark:text-white"
          >
            We don't just find problems.<br />
            We own the results.
          </h2>
          <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
            Most agencies hand you a 50-page report and disappear. We roll up our sleeves, implement
            every fix, and measure the outcome. If it doesn't move the needle, we keep going — no
            extra charge.
          </p>
          <ul class="space-y-4">
            <li v-for="item in whyItems" :key="item.title" class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center shrink-0 mt-0.5"
              >
                <UIcon :name="item.icon" class="w-5 h-5 text-sky-500" />
              </div>
              <div>
                <h4 class="font-bold text-zinc-900 dark:text-white mb-0.5">
                  {{ item.title }}
                </h4>
                <p class="text-sm text-zinc-500 dark:text-zinc-400">
                  {{ item.desc }}
                </p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Right: Process steps -->
        <div class="fade-up" style="transition-delay: 100ms">
          <div class="space-y-4">
            <div
              v-for="(step, i) in steps"
              :key="step.step"
              class="flex items-start gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 card-hover"
              :style="`transition-delay:${i * 80}ms`"
            >
              <div
                class="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex flex-col items-center justify-center shrink-0 shadow-md"
              >
                <span class="text-white text-xs font-black leading-none">{{ step.step }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-zinc-900 dark:text-white mb-1">
                  {{ step.title }}
                </h4>
                <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {{ step.desc }}
                </p>
                <UButton
                  v-if="step.to"
                  :to="step.to"
                  label="Try it now"
                  variant="link"
                  color="primary"
                  size="xs"
                  trailing-icon="i-lucide-arrow-right"
                  class="mt-2 px-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const whyItems = [
  {
    icon: "i-lucide-target",
    title: "Results-first guarantee",
    desc: "We define measurable success criteria before we start. If we miss them, you don't pay the remainder.",
  },
  {
    icon: "i-lucide-clock",
    title: "Fast delivery",
    desc: "Most projects are live within 7–14 days. We move fast because your revenue doesn't wait.",
  },
  {
    icon: "i-lucide-users",
    title: "Dedicated team, not tickets",
    desc: "You get a named engineer and project lead. Not a helpdesk. Not a rotating support queue.",
  },
  {
    icon: "i-lucide-book-open",
    title: "Full transparency",
    desc: "You see every change before it goes live, with plain-English explanations of what we did and why.",
  },
];
const steps = [
  {
    step: "01",
    title: "Free Diagnosis",
    desc: "Enter your URL — we automatically scan speed, SEO, security, and code issues in seconds.",
    to: "/diagnose",
  },
  {
    step: "02",
    title: "Custom Strategy",
    desc: "Tailored roadmap with clear timelines, deliverables, and expected outcomes.",
    to: null,
  },
  {
    step: "03",
    title: "We Execute",
    desc: "Engineers implement every fix. Weekly updates and staging previews.",
    to: null,
  },
  {
    step: "04",
    title: "Measure & Grow",
    desc: "We track every KPI and iterate until results are delivered.",
    to: null,
  },
];
</script>
