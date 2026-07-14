<script setup lang="ts">
definePageMeta({ layout: "default" });
useSeoMeta({
  title: "RapidByt – Web Performance & Software Solutions",
  description:
    "Is your website costing you customers? RapidByt diagnoses and fixes slow sites, broken code, and weak SEO — turning digital problems into measurable growth.",
  ogTitle: "RapidByt – Web Performance & Software Solutions",
  ogDescription:
    "We diagnose slow sites, broken code, and weak SEO — then engineer the fixes that turn digital problems into revenue growth.",
  ogImage: "/og-image.png",
  twitterCard: "summary_large_image",
});

// Use a single shared observer for all fade-up elements
// rootMargin starts animation slightly before element enters viewport
onMounted(() => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );
  document.querySelectorAll(".fade-up").forEach((el) => io.observe(el));
});
</script>

<template>
  <UPage>
    <!-- Above the fold — rendered immediately -->
    <HomeHeroSection />
    <HomeStatsBar />

    <!-- Below the fold — browser can skip until scrolled to -->
    <div class="cv-auto">
      <HomeProblemsSection />
    </div>
    <div class="cv-auto">
      <HomeServicesSection />
    </div>
    <div class="cv-auto">
      <HomeWhySection />
    </div>
    <div class="cv-auto">
      <HomeTestimonialsSection />
    </div>
    <div class="cv-auto">
      <HomePricingSection />
    </div>
    <div class="cv-auto">
      <HomeFaqSection />
    </div>
    <div class="cv-auto">
      <HomeCtaSection />
    </div>
  </UPage>
</template>
