<script setup lang="ts">
definePageMeta({ layout: "default" });
useSeoMeta({
  title: "Services – RapidByt Web Performance Solutions",
  description:
    "Explore RapidByt's full suite of services: speed optimisation, SEO, web development, cloud infrastructure, security monitoring, and CRO.",
});
onMounted(() => {
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
    { threshold: 0.1 },
  );
  document.querySelectorAll(".fade-up").forEach((el) => io.observe(el));
});

const services = [
  {
    id: "speed",
    icon: "i-lucide-zap",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
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
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    title: "SEO & Core Web Vitals",
    badge: null,
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
    bg: "bg-sky-50 dark:bg-sky-900/20",
    title: "Web Application Development",
    badge: null,
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
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    title: "Cloud & Infrastructure",
    badge: null,
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
    bg: "bg-rose-50 dark:bg-rose-900/20",
    title: "Security & Uptime Monitoring",
    badge: null,
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
    bg: "bg-purple-50 dark:bg-purple-900/20",
    title: "Analytics & Conversion Optimisation",
    badge: null,
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
    <!-- Page Hero -->
    <section class="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20">
      <div class="absolute inset-0 -z-10 pointer-events-none">
        <div
          class="absolute top-0 right-1/3 w-80 h-80 bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-3xl"
        />
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400 text-sm font-medium mb-6"
        >
          <UIcon name="i-lucide-settings-2" class="w-4 h-4" />
          What We Do
        </div>
        <h1
          class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-5 text-zinc-900 dark:text-white"
        >
          Every service is built around<br class="hidden sm:block" />
          <span class="gradient-text">your bottom line</span>
        </h1>
        <p class="max-w-2xl mx-auto text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
          We don't offer services for the sake of it. Each one is tied to a measurable outcome —
          faster load times, higher rankings, more conversions, lower infrastructure costs.
        </p>
        <UButton
          label="Start With a Free Audit"
          to="/contact"
          size="lg"
          class="glow-btn"
          trailing-icon="i-lucide-arrow-right"
        />
      </div>
    </section>

    <!-- Services List -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div
          v-for="(s, i) in services"
          :id="s.id"
          :key="s.id"
          class="fade-up grid lg:grid-cols-2 gap-10 items-start rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 sm:p-10"
          :style="`transition-delay:${i * 50}ms`"
        >
          <!-- Left -->
          <div>
            <div class="flex items-center gap-3 mb-4">
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', s.bg]">
                <UIcon :name="s.icon" :class="['w-6 h-6', s.color]" />
              </div>
              <span
                v-if="s.badge"
                class="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400"
              >
                {{ s.badge }}
              </span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-2">
              {{ s.title }}
            </h2>
            <p class="font-semibold text-sky-600 dark:text-sky-400 mb-4 italic">
              {{ s.tagline }}
            </p>
            <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              {{ s.desc }}
            </p>
            <div
              class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
            >
              <p
                class="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-start gap-2"
              >
                <UIcon name="i-lucide-trending-up" class="w-4 h-4 mt-0.5 shrink-0" />
                {{ s.outcome }}
              </p>
            </div>
          </div>
          <!-- Right: Feature list -->
          <div>
            <h4 class="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">
              What's included
            </h4>
            <ul class="space-y-3">
              <li
                v-for="f in s.features"
                :key="f"
                class="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400"
              >
                <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                {{ f }}
              </li>
            </ul>
            <UButton
              label="Get Started"
              :to="`/contact?service=${s.id}`"
              size="sm"
              variant="outline"
              color="primary"
              class="mt-6"
              trailing-icon="i-lucide-arrow-right"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <HomeCtaSection />
  </UPage>
</template>
