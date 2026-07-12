<template>
  <section id="pricing" class="py-24 bg-zinc-50 dark:bg-zinc-900/40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 fade-up">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-4"
        >
          Pricing
        </div>
        <h2
          class="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white"
        >
          Simple, transparent pricing
        </h2>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          No retainer traps. No hidden setup fees. Start with a free audit and only pay when you
          decide to move forward.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div
          v-for="(plan, i) in plans"
          :key="plan.name"
          :class="[
            'fade-up rounded-2xl p-7 flex flex-col transition-all',
            plan.highlight
              ? 'bg-gradient-to-b from-sky-600 to-indigo-700 text-white shadow-2xl shadow-sky-500/30 scale-[1.03] border-0'
              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 card-hover',
          ]"
          :style="`transition-delay:${i * 80}ms`"
        >
          <div class="mb-6">
            <p
              :class="[
                'text-xs font-bold uppercase tracking-widest mb-2',
                plan.highlight ? 'text-sky-200' : 'text-sky-600 dark:text-sky-400',
              ]"
            >
              {{ plan.name }}
            </p>
            <div class="flex items-baseline gap-1">
              <span
                :class="[
                  'text-4xl font-black',
                  plan.highlight ? 'text-white' : 'text-zinc-900 dark:text-white',
                ]"
              >
                {{ plan.price }}
              </span>
              <span
                v-if="plan.period"
                :class="['text-sm', plan.highlight ? 'text-sky-200' : 'text-zinc-400']"
              >
                {{ plan.period }}
              </span>
            </div>
            <p
              :class="[
                'text-sm mt-2',
                plan.highlight ? 'text-sky-100' : 'text-zinc-500 dark:text-zinc-400',
              ]"
            >
              {{ plan.desc }}
            </p>
          </div>

          <ul class="space-y-3 flex-1 mb-8">
            <li v-for="f in plan.features" :key="f" class="flex items-center gap-2 text-sm">
              <UIcon
                name="i-lucide-check"
                :class="['w-4 h-4 shrink-0', plan.highlight ? 'text-sky-200' : 'text-emerald-500']"
              />
              <span :class="plan.highlight ? 'text-sky-50' : 'text-zinc-600 dark:text-zinc-400'">{{
                f
              }}</span>
            </li>
          </ul>

          <UButton
            :label="plan.cta"
            :to="plan.to"
            :variant="plan.highlight ? 'solid' : 'outline'"
            :color="plan.highlight ? 'neutral' : 'primary'"
            :class="
              plan.highlight ? 'bg-white text-sky-700 hover:bg-sky-50 border-0 font-bold' : ''
            "
            block
          />
        </div>
      </div>

      <p class="text-center text-sm text-zinc-400 mt-8 fade-up">
        Enterprise or custom scope?
        <NuxtLink to="/contact" class="text-sky-600 dark:text-sky-400 font-semibold hover:underline"
          >Let's talk →</NuxtLink
        >
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const plans = [
  {
    name: "Diagnose",
    price: "Free",
    period: "",
    highlight: false,
    desc: "Get a full picture of what is holding your site back.",
    features: [
      "Complete speed audit",
      "SEO health check",
      "Security vulnerability scan",
      "Prioritised fix report",
      "No credit card required",
    ],
    cta: "Run Free Diagnosis",
    to: "/diagnose",
  },
  {
    name: "Accelerate",
    price: "$100",
    period: "one-time",
    highlight: true,
    desc: "We fix your biggest performance bottlenecks fast.",
    features: [
      "Everything in Diagnose",
      "Core Web Vitals fixes",
      "Image & asset optimisation",
      "Caching configuration",
      "Technical SEO implementation",
      "30-day follow-up support",
    ],
    cta: "Get Started",
    to: "/contact",
  },
  {
    name: "Scale",
    price: "$150",
    period: "/month",
    highlight: false,
    desc: "Ongoing optimisation, monitoring, and growth partnership.",
    features: [
      "Everything in Accelerate",
      "Monthly performance review",
      "24/7 uptime monitoring",
      "Security patching",
      "Quarterly SEO reporting",
      "Priority support (4h SLA)",
    ],
    cta: "Book a Call",
    to: "/contact",
  },
];
</script>
