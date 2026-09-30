<script setup lang="ts">
definePageMeta({ layout: "default" });
useSeoMeta({
  title: "About RapidByt — Web Performance & SEO Agency",
  description:
    "RapidByt is a web performance and SEO agency helping businesses build faster, higher-ranking, and more profitable websites.",
  ogTitle: "About RapidByt",
  ogDescription:
    "We diagnose digital bottlenecks and engineer solutions that make your business faster, smarter, and more profitable.",
});
useHead({
  link: [{ rel: "canonical", href: "https://rapidbyt.com/about" }],
});
</script>

<template>
  <UPage>
    <div class="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      <div
        class="absolute top-0 right-1/3 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/8 rounded-full blur-3xl"
      />
    </div>

    <UContainer class="py-20 max-w-4xl">
      <!-- Hero -->
      <div class="text-center mb-16">
        <div
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400 text-sm font-medium mb-6"
        >
          <UIcon name="i-lucide-users" class="w-4 h-4" />
          Who We Are
        </div>
        <h1
          class="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-6"
        >
          We make websites
          <span class="gradient-text">fast, visible, and profitable</span>
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
          RapidByt is a web performance and SEO agency. We help businesses diagnose exactly what's
          slowing them down online — and fix it with precision.
        </p>
      </div>

      <!-- Mission -->
      <div class="grid sm:grid-cols-3 gap-6 mb-16">
        <div
          class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
        >
          <div
            class="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mb-4"
          >
            <UIcon name="i-lucide-zap" class="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <h3 class="font-black text-zinc-900 dark:text-white mb-2">Performance First</h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Every millisecond matters. We obsess over Core Web Vitals, LCP, CLS, and INP to give
            your users a fast, smooth experience.
          </p>
        </div>
        <div
          class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
        >
          <div
            class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4"
          >
            <UIcon name="i-lucide-search" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 class="font-black text-zinc-900 dark:text-white mb-2">SEO That Ranks</h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Technical SEO done right — structured data, crawlability, page speed signals — so Google
            finds and ranks your content.
          </p>
        </div>
        <div
          class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
        >
          <div
            class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-4"
          >
            <UIcon
              name="i-lucide-bar-chart-2"
              class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
            />
          </div>
          <h3 class="font-black text-zinc-900 dark:text-white mb-2">Revenue Focused</h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Faster sites convert better. We tie every optimization to business outcomes — more
            leads, more sales, lower bounce rates.
          </p>
        </div>
      </div>

      <!-- Story -->
      <div
        class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 sm:p-10 mb-10"
      >
        <h2 class="text-2xl font-black text-zinc-900 dark:text-white mb-4">Our Story</h2>
        <div class="prose prose-zinc dark:prose-invert max-w-none">
          <p>
            RapidByt was founded with a simple observation: most businesses know their website is
            slow, but don't know exactly what to fix or where to start. Generic advice doesn't cut
            it — every site has different bottlenecks.
          </p>
          <p>
            We built a free diagnosis tool and a team of specialists who translate PageSpeed scores
            into actionable fixes. Whether it's a WordPress site loading in 8 seconds or a React app
            with a broken INP score, we've seen it and fixed it.
          </p>
          <p>
            Today we work with businesses across e-commerce, SaaS, and professional services —
            helping them turn slow, invisible websites into their best-performing sales channel.
          </p>
        </div>
      </div>

      <!-- Contact CTA -->
      <div class="text-center">
        <p class="text-zinc-500 dark:text-zinc-400 mb-4">Want to work with us or just say hello?</p>
        <div class="flex items-center justify-center gap-3 flex-wrap">
          <UButton
            label="Get Free Audit"
            to="/contact"
            size="lg"
            color="primary"
            trailing-icon="i-lucide-arrow-right"
          />
          <UButton
            label="Free Diagnosis"
            to="/diagnose"
            size="lg"
            variant="outline"
            color="primary"
            leading-icon="i-lucide-scan-search"
          />
        </div>
        <p class="text-sm text-zinc-400 mt-4">
          <UIcon name="i-lucide-mail" class="w-3.5 h-3.5 inline mr-1" />
          <a href="mailto:info.rapidbyt@gmail.com" class="hover:text-sky-500 transition-colors"
            >info.rapidbyt@gmail.com</a
          >
        </p>
      </div>
    </UContainer>
  </UPage>
</template>
