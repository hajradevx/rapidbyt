<script setup lang="ts">
import storeImg from "~/assets/imgs/store.webp";
import bookImg from "~/assets/imgs/book.webp";
import sImg from "~/assets/imgs/s1.webp";
import snowsImg from "~/assets/imgs/snows.png";

const projects = [
  {
    title: "SnowsBrain",
    subtitle: "Multi-Niche AI Content Platform",
    desc: "A modern multi-niche content platform built to publish, organize, and manage diverse, AI-enhanced content across multiple topics.",
    icon: "i-lucide-brain",
    image: snowsImg,
    accent: "from-sky-500 to-indigo-600",
    tags: ["AI", "Multi-Niche", "Nuxt"],
    status: "Live",
    statusClass: "bg-emerald-500",
    features: [
      "AI-assisted content creation",
      "Google OAuth & role-based access",
      "Multi-niche publishing workflows",
    ],
    demo: "https://snowsbrain.com/",
    repo: null,
  },
  {
    title: "ShopSwift",
    subtitle: "E-Commerce Platform",
    desc: "A full-featured online store with product management, cart, checkout, Stripe payments, and order tracking.",
    icon: "i-lucide-shopping-bag",
    image: storeImg,
    accent: "from-amber-500 to-orange-600",
    tags: ["E-Commerce", "Nuxt", "Stripe"],
    status: "Live",
    statusClass: "bg-emerald-500",
    features: [
      "Product catalog with filters & search",
      "Stripe checkout & order management",
      "Admin dashboard with analytics",
    ],
    demo: "https://jewellerysite.hajradevx.workers.dev/",
    repo: null,
    adminCredentials: {
      email: "hajrauswa2000@gmail.com",
      password: "SuperSecret@123",
    },
  },
  {
    title: "PageTurner",
    subtitle: "Digital Book Library",
    desc: "A digital library app to catalogue, track reading progress, write reviews, and discover new books via an open API.",
    icon: "i-lucide-book-open",
    image: bookImg,
    accent: "from-emerald-500 to-teal-600",
    tags: ["Library", "API", "Vue"],
    status: "Coming Soon",
    statusClass: "bg-zinc-400",
    features: [
      "Personal bookshelf & reading tracker",
      "Book discovery via Open Library API",
      "Reviews, ratings & reading lists",
    ],
    demo: null,
    repo: null,
  },
  {
    title: "Nexus",
    subtitle: "Social Media Platform",
    desc: "A LinkedIn-style social platform with user profiles, connections, news feed, messaging, and job listings.",
    icon: "i-lucide-users",
    image: sImg,
    accent: "from-indigo-500 to-purple-600",
    tags: ["Social", "Real-time", "Full-stack"],
    status: "Coming Soon",
    statusClass: "bg-zinc-400",
    features: [
      "Profile pages, connections & endorsements",
      "Real-time feed, likes & comments",
      "Messaging & job board",
    ],
    demo: null,
    repo: null,
  },
];
</script>

<template>
  <section id="projects" class="py-24 bg-zinc-50 dark:bg-zinc-900/40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16 fade-up">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1.5 mb-5 rounded-full bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider"
        >
          <UIcon name="i-lucide-folder-open" class="w-3.5 h-3.5" />
          Our Work
        </span>
        <h2 class="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white mb-4">
          Projects built from<br class="hidden sm:block" />
          <span class="gradient-text">the ground up</span>
        </h2>
        <p class="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Real products. Real code. From e-commerce stores to social platforms — each project
          engineered for performance and growth.
        </p>
      </div>

      <!-- Grid -->
      <div class="grid md:grid-cols-2 gap-6">
        <article
          v-for="(project, i) in projects"
          :key="project.title"
          class="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          :style="`transition-delay:${i * 60}ms`"
        >
          <!-- Full Image -->
          <div class="relative w-full h-56 overflow-hidden">
            <img
              v-if="project.image"
              :src="project.image"
              :alt="project.title"
              class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <!-- Gradient overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
            />

            <!-- Status badge -->
            <div class="absolute top-3 right-3">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur text-[11px] font-bold text-zinc-700 dark:text-zinc-200 shadow"
              >
                <span :class="['w-1.5 h-1.5 rounded-full', project.statusClass]" />
                {{ project.status }}
              </span>
            </div>

            <!-- Tags on image bottom -->
            <div class="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-white text-[10px] font-semibold border border-white/30"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="flex flex-col flex-1 p-6">
            <!-- Title -->
            <div class="flex items-start gap-3 mb-3">
              <div
                :class="[
                  'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-sm',
                  project.accent,
                ]"
              >
                <UIcon :name="project.icon" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 class="font-black text-lg text-zinc-900 dark:text-white leading-tight">
                  {{ project.title }}
                </h3>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  {{ project.subtitle }}
                </p>
              </div>
            </div>

            <!-- Description -->
            <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
              {{ project.desc }}
            </p>

            <!-- Features -->
            <ul class="space-y-1.5 mb-5">
              <li
                v-for="feat in project.features"
                :key="feat"
                class="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400"
              >
                <UIcon name="i-lucide-check" class="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                <span>{{ feat }}</span>
              </li>
            </ul>

            <!-- Admin credentials -->
            <div
              v-if="project.adminCredentials"
              class="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
            >
              <p
                class="text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-1.5 flex items-center gap-1"
              >
                <UIcon name="i-lucide-key" class="w-3.5 h-3.5" />
                Demo Admin Credentials
              </p>
              <p class="text-[11px] text-zinc-600 dark:text-zinc-300">
                <span class="font-medium">Email:</span> {{ project.adminCredentials.email }}
              </p>
              <p class="text-[11px] text-zinc-600 dark:text-zinc-300">
                <span class="font-medium">Password:</span> {{ project.adminCredentials.password }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 mt-auto pt-1">
              <UButton
                v-if="project.demo"
                :to="project.demo"
                target="_blank"
                label="Live Demo"
                color="primary"
                size="sm"
                trailing-icon="i-lucide-arrow-up-right"
                class="flex-1 justify-center"
              />
              <UButton
                v-if="project.repo"
                :to="project.repo"
                label="Source"
                color="neutral"
                variant="outline"
                size="sm"
                leading-icon="i-lucide-github"
              />
              <div
                v-if="!project.demo && !project.repo"
                class="flex items-center gap-1.5 text-xs text-zinc-400"
              >
                <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
                Coming soon
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Bottom CTA -->
      <div class="text-center mt-14">
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          Want us to build something like this for you?
        </p>
        <UButton
          to="/contact"
          label="Start a Project"
          color="primary"
          size="lg"
          trailing-icon="i-lucide-arrow-right"
        />
      </div>
    </div>
  </section>
</template>
