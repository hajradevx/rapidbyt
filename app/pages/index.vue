<script setup lang="ts">
definePageMeta({ layout: "default" });
useSeoMeta({
  title: "RapidByt – Web Performance & Speed Optimization Services",
  description:
    "RapidByt fixes slow websites, improves Google rankings & builds fast web apps. Free website speed test — get your performance score in 10 seconds.",
  ogTitle: "RapidByt – Web Performance & Speed Optimization Services",
  ogDescription:
    "Free website speed test + expert fixes. We improve Core Web Vitals, SEO rankings & page load times. Most sites see results in 7 days.",
  ogImage: "/og-image.png",
  twitterCard: "summary_large_image",
  keywords:
    "website speed optimization, web performance, Core Web Vitals, SEO optimization, page speed, slow website fix, web development Pakistan",
});
useHead({
  link: [{ rel: "canonical", href: "https://rapidbyt.com/" }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "RapidByt",
        url: "https://rapidbyt.com",
        logo: "https://rapidbyt.com/img/logo.png",
        description: "Web performance optimization, SEO, and software development agency.",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+92-316-863-6339",
          contactType: "customer service",
          availableLanguage: ["English", "Urdu"],
        },
        sameAs: [
          "https://twitter.com/rapidbyt",
          "https://linkedin.com/company/rapidbyt",
          "https://github.com/rapidbyt",
        ],
        offers: {
          "@type": "Offer",
          name: "Free Website Audit",
          price: "0",
          priceCurrency: "USD",
          url: "https://rapidbyt.com/diagnose",
        },
      }),
    },
  ],
});

// Use a single shared observer for all fade-up elements
useFadeUp();
</script>

<template>
  <UPage>
    <!-- Above the fold — rendered immediately -->
    <HomeHeroSection />
    <HomeStatsBar />

    <!-- Below the fold — browser can skip until scrolled to -->
    <div class="cv-auto">
      <HomeProjectsSection />
    </div>
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
