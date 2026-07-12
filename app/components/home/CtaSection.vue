<template>
  <section class="py-24 relative overflow-hidden">
    <div class="absolute inset-0 -z-10 bg-gradient-to-br from-sky-600 to-indigo-700" />
    <div class="absolute inset-0 -z-10 opacity-10">
      <div class="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
      <div class="absolute bottom-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl" />
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-up">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-6">
        Ready to stop losing customers<br class="hidden sm:block"> to a slow website?
      </h2>
      <p class="text-sky-100 text-lg mb-10 max-w-2xl mx-auto">
        Get your free audit delivered in 24 hours. No sales call required, no credit card, no commitment. Just a clear picture of what's hurting your business — and exactly how to fix it.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <UButton
          label="Get My Free Audit Now"
          to="/contact"
          size="xl"
          color="neutral"
          class="bg-white text-sky-700 hover:bg-sky-50 font-bold w-full sm:w-auto border-0"
          trailing-icon="i-lucide-arrow-right" />
        <UButton
          label="Instant Auto-Diagnosis"
          to="/diagnose"
          size="xl"
          variant="ghost"
          class="text-sky-100 hover:text-white hover:bg-white/10 w-full sm:w-auto"
          leading-icon="i-lucide-scan-search" />
      </div>
      <p class="text-sky-200 text-sm mt-6 opacity-80">
        Trusted by 100+ businesses. Average PageSpeed improvement: +58 points.
      </p>
    </div>
  </section>
</template>
