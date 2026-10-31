<script setup lang="ts">
interface Service {
  id: string;
  icon: string;
  color: string;
  title: string;
  badge?: string;
  tagline: string;
  desc: string;
  features: string[];
  outcome: string;
}

definePageMeta({ layout: "default" });

useSeoMeta({
  title: "Web Performance & Speed Optimization Services — RapidByt",
  description:
    "Website speed optimization, SEO & Core Web Vitals fixes, web app development, cloud infrastructure & security monitoring. Measurable results in 7 days.",
  ogTitle: "Web Performance Services — Speed, SEO, Dev & Cloud | RapidByt",
  ogDescription:
    "Speed optimization, SEO fixes, web development & cloud hosting. Average 58-point PageSpeed improvement. Free audit included.",
  ogImage: "https://rapidbyt.com/og-image.png",
  ogImageAlt: "Web Performance & Speed Optimization Services — RapidByt",
  twitterCard: "summary_large_image",
  twitterTitle: "Web Performance Services — Speed, SEO, Dev & Cloud | RapidByt",
  twitterDescription:
    "Speed optimization, SEO fixes, web development & cloud hosting. Average 58-point PageSpeed improvement. Free audit included.",
  twitterImage: "https://rapidbyt.com/og-image.png",
  keywords:
    "website speed optimization service, Core Web Vitals fix, SEO optimization service, web app development, Cloudflare hosting, website performance agency",
});

useHead({
  link: [{ rel: "canonical", href: "https://rapidbyt.com/services" }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        provider: { "@type": "Organization", name: "RapidByt", url: "https://rapidbyt.com" },
        serviceType: "Web Performance Optimization",
        areaServed: "Worldwide",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "RapidByt Services",
          itemListElement: [
            "Website Speed Optimization",
            "SEO & Core Web Vitals",
            "Web App Development",
            "Cloud & Infrastructure",
            "Security & Monitoring",
          ].map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name },
          })),
        },
      }),
    },
  ],
});

// Single shared observer for all fade-up elements
useFadeUp();

const services: Service[] = [
  {
    id: "speed",
    icon: "i-lucide-zap",
    color: "text-amber-500",
    title: "Website Speed Optimisation",
    badge: "Most Popular",
    tagline: "From painfully slow to blazing fast — guaranteed.",
    desc: "Page speed is the #1 factor in bounce rate, conversion rate, and Google rankings. We analyse every bottleneck and implement targeted fixes that deliver measurable results within days, not months.",
    features: [
      "Core Web Vitals (LCP, FID, CLS) remediation",
      "Image optimisation & next-gen format conversion (WebP/AVIF)",
      "JavaScript bundle splitting & tree-shaking",
      "Critical CSS extraction & render-blocking removal",
      "Cloudflare edge caching & CDN configuration",
      "Server-side rendering (SSR) & static generation",
      "Database query optimisation",
      "Third-party script audit & async loading",
    ],
    outcome: "Average PageSpeed score improvement: 58 points. Average load time reduction: 76%.",
  },
  {
    id: "seo",
    icon: "i-lucide-trending-up",
    color: "text-emerald-500",
    title: "SEO & Core Web Vitals",
    tagline: "Rank higher. Get found. Keep the traffic.",
    desc: "Technical SEO is foundational — without it, every other marketing channel is harder and more expensive. We fix the plumbing so your content can finally rank.",
    features: [
      "Technical SEO audit & priority roadmap",
      "Structured data / schema markup implementation",
      "XML sitemaps & robots.txt optimisation",
      "Canonical tags & duplicate content resolution",
      "Internal linking architecture review",
      "Page title & meta description optimisation",
      "Core Web Vitals tie-in (speed as ranking signal)",
      "Monthly ranking & traffic reporting",
    ],
    outcome: "Average organic traffic increase: 340% within 6 months.",
  },
  {
    id: "dev",
    icon: "i-lucide-code-2",
    color: "text-sky-500",
    title: "Web Application Development",
    tagline: "Built for performance from line one.",
    desc: "We build full-stack web applications using modern, edge-native technology that's fast by default. Every architectural decision is made with performance, scalability, and maintainability in mind.",
    features: [
      "Nuxt 4 / Next.js / Vue / React development",
      "Edge-first Cloudflare Workers + D1 architecture",
      "REST & GraphQL API design and implementation",
      "Authentication systems (OAuth, passwordless, MFA)",
      "Payment integration (Stripe, PayPal)",
      "Admin dashboards & CMS integrations",
      "Progressive Web App (PWA) development",
      "Accessibility (WCAG 2.1 AA) compliance",
    ],
    outcome: "Custom scoped — contact us for a project estimate.",
  },
  {
    id: "cloud",
    icon: "i-lucide-cloud",
    color: "text-indigo-500",
    title: "Cloud & Infrastructure",
    tagline: "Global edge presence. Zero cold starts. Infinite scale.",
    desc: "Legacy hosting is holding your business back. We migrate and modernise your infrastructure to serverless, edge-native platforms that cost less, perform more, and never go down.",
    features: [
      "Cloudflare Workers / Pages deployment",
      "D1 SQLite & R2 object storage setup",
      "AWS / GCP migration planning & execution",
      "Docker containerisation & Kubernetes orchestration",
      "CI/CD pipeline setup (GitHub Actions, GitLab)",
      "Environment management (dev / staging / prod)",
      "Cost optimisation audit",
      "Infrastructure-as-code (Terraform / Pulumi)",
    ],
    outcome: "Average infrastructure cost reduction: 45%. Uptime improvement: 99.98%.",
  },
  {
    id: "security",
    icon: "i-lucide-shield-check",
    color: "text-rose-500",
    title: "Security & Uptime Monitoring",
    tagline: "Sleep soundly. We've got your back 24/7.",
    desc: "A single security incident or extended outage can cost more than months of preventive investment. We set up proactive monitoring, alerting, and hardening so problems are caught before customers notice.",
    features: [
      "24/7 uptime monitoring with instant alerting",
      "SSL/TLS certificate management & auto-renewal",
      "Vulnerability scanning & CVE tracking",
      "Dependency audit & automated update policies",
      "DDoS protection via Cloudflare WAF",
      "Automated daily backups with tested restore",
      "Security headers & CSP implementation",
      "Incident response & post-mortem reporting",
    ],
    outcome: "99.98% average managed uptime. Mean time to detection: under 3 minutes.",
  },
  {
    id: "cro",
    icon: "i-lucide-bar-chart-2",
    color: "text-purple-500",
    title: "Analytics & Conversion Optimisation",
    tagline: "More traffic is useless if visitors don't convert.",
    desc: "Traffic without conversion is just noise. We dig into your analytics, identify where users drop off, and run structured experiments that compound your revenue over time.",
    features: [
      "GA4 & Plausible setup and configuration",
      "Heatmap & session recording analysis",
      "Funnel analysis & drop-off identification",
      "A/B and multivariate testing",
      "Landing page CRO recommendations",
      "Form optimisation & checkout flow analysis",
      "E-commerce revenue tracking",
      "Monthly conversion reporting",
    ],
    outcome: "Average conversion rate improvement: 28% within 90 days.",
  },
];
</script>

<template>
  <UPage>
    <!-- Hero -->
    <UPageHero
      title="Every service is built around your bottom line"
      description="We don't offer services for the sake of it. Each one is tied to a measurable outcome — faster load times, higher rankings, more conversions, lower infrastructure costs."
      :links="[
        {
          label: 'Start with a free audit',
          to: '/contact',
          size: 'lg',
          trailingIcon: 'i-lucide-arrow-right',
        },
      ]"
      :ui="{ title: 'font-black', links: 'justify-center' }"
      orientation="vertical"
    >
      <template #headline>
        <UBadge
          label="What we do"
          icon="i-lucide-settings-2"
          variant="subtle"
          color="primary"
          size="lg"
        />
      </template>
    </UPageHero>

    <!-- Services -->
    <UPageSection>
      <UPageGrid class="lg:grid-cols-2">
        <UPageCard
          v-for="(service, i) in services"
          :id="service.id"
          :key="service.id"
          :icon="service.icon"
          :title="service.title"
          :description="service.desc"
          variant="outline"
          class="fade-up scroll-mt-24"
          :style="`transition-delay: ${i * 50}ms`"
          :ui="{
            leadingIcon: service.color,
            title: 'text-xl font-black',
            body: 'w-full',
          }"
        >
          <template v-if="service.badge" #header>
            <UBadge :label="service.badge" variant="soft" color="primary" size="sm" />
          </template>

          <template #body>
            <p class="font-semibold italic text-primary mb-5">
              {{ service.tagline }}
            </p>

            <UAlert
              :description="service.outcome"
              icon="i-lucide-trending-up"
              color="success"
              variant="subtle"
              class="mb-6"
            />

            <h3 class="text-sm font-bold text-muted mb-3">What's included</h3>

            <ul class="space-y-2.5">
              <li
                v-for="feature in service.features"
                :key="feature"
                class="flex items-start gap-3 text-sm text-toned"
              >
                <UIcon name="i-lucide-check-circle" class="size-4 text-primary mt-0.5 shrink-0" />
                {{ feature }}
              </li>
            </ul>
          </template>

          <template #footer>
            <UButton
              label="Get started"
              :to="`/contact?service=${service.id}`"
              size="sm"
              variant="outline"
              color="primary"
              trailing-icon="i-lucide-arrow-right"
            />
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <!-- Bottom CTA -->
    <HomeCtaSection />
  </UPage>
</template>
