<script setup lang="ts">
import storeImg from "~/assets/imgs/store.webp";
import ecomImg from "~/assets/imgs/ecom.webp";
import bookImg from "~/assets/imgs/book.webp";
import sImg from "~/assets/imgs/s1.webp";

const projects = [
  {
    title: "SnowsBrain — Multi-Niche AI Content Platform",
    desc: "A modern multi-niche content platform built to publish, organize, and manage diverse, AI-enhanced content across multiple topics through a scalable and user-friendly web experience.",
    icon: "i-lucide-brain",
    image: ecomImg,
    bg: "bg-gradient-to-br from-sky-400/20 to-indigo-500/20 dark:from-sky-900/30 dark:to-indigo-900/30",
    iconBg: "bg-sky-50 dark:bg-sky-900/40",
    iconColor: "text-sky-500",
    tags: ["AI", "Multi-Niche", "Nuxt"],
    status: "Live",
    statusClass: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400",
    features: [
      "Multi-niche content publishing across diverse topics and categories",
      "AI-assisted content creation with a powerful admin management system",
      "Google OAuth, role-based access, comments, featured content, and publishing workflows",
    ],
    demo: "https://snowsbrain.com/",
    repo: null,
  },
  {
    title: "ShopSwift — E-Commerce Platform",
    desc: "A full-featured online store with product management, cart, checkout, Stripe payments, and order tracking.",
    icon: "i-lucide-shopping-bag",
    image: storeImg,
    bg: "bg-gradient-to-br from-amber-400/20 to-orange-500/20 dark:from-amber-900/30 dark:to-orange-900/30",
    iconBg: "bg-amber-50 dark:bg-amber-900/40",
    iconColor: "text-amber-500",
    tags: ["E-Commerce", "Nuxt", "Stripe"],
    status: "Live",
    statusClass: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400",
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
    title: "PageTurner — Book Library",
    desc: "A digital library app to catalogue, track reading progress, write reviews, and discover new books via an open API.",
    icon: "i-lucide-book-open",
    image: bookImg,
    bg: "bg-gradient-to-br from-emerald-400/20 to-teal-500/20 dark:from-emerald-900/30 dark:to-teal-900/30",
    iconBg: "bg-emerald-50 dark:bg-emerald-900/40",
    iconColor: "text-emerald-500",
    tags: ["Library", "API", "Vue"],
    status: "Coming Soon",
    statusClass: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400",
    features: [
      "Personal bookshelf & reading tracker",
      "Book discovery via Open Library API",
      "Reviews, ratings & reading lists",
    ],
    demo: null,
    repo: null,
  },
  {
    title: "Nexus — Social Media Platform",
    desc: "A LinkedIn-style social platform with user profiles, connections, news feed, messaging, and job listings.",
    icon: "i-lucide-users",
    image: sImg,
    bg: "bg-gradient-to-br from-indigo-400/20 to-purple-500/20 dark:from-indigo-900/30 dark:to-purple-900/30",
    iconBg: "bg-indigo-50 dark:bg-indigo-900/40",
    iconColor: "text-indigo-500",
    tags: ["Social", "Real-time", "Full-stack"],
    status: "Coming Soon",
    statusClass: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400",
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
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-4"
        >
          Our Work
        </div>
        <h2
          class="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white"
        >
          Projects we've built<br class="hidden sm:block" />
          from the ground up
        </h2>
        <p class="text-muted max-w-xl mx-auto">
          Real products. Real code. From e-commerce stores to social platforms — each project
          engineered for performance and growth.
        </p>
      </div>

      <!-- Project Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(project, i) in projects"
          :key="project.title"
          class="fade-up group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden card-hover"
          :style="`transition-delay:${i * 60}ms`"
        >
          <!-- Color band / mock thumbnail -->
          <div
            :class="[
              'aspect-square w-full flex items-center justify-center relative overflow-hidden',
              project.bg,
            ]"
          >
            <!-- Status badge -->
            <span
              v-if="project.status"
              :class="[
                'absolute top-3 right-3 z-10 text-xs font-bold px-2 py-0.5 rounded-full',
                project.statusClass,
              ]"
            >
              {{ project.status }}
            </span>

            <!-- Project screenshot (if provided) -->

            <img
              v-if="project.image"
              :src="project.image"
              :alt="project.title"
              class="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              width="400"
              height="176"
            />

            <!-- Overlay + icon (always shown, dimmed when image exists) -->
            <div
              :class="[
                'relative z-10 w-16 h-16 rounded-md flex items-center justify-center shadow-lg transition-opacity duration-300',
                project.iconBg,
                project.image ? 'opacity-0 group-hover:opacity-100' : '',
              ]"
            >
              <UIcon :name="project.icon" :class="['w-8 h-8', project.iconColor]" />
            </div>
          </div>

          <!-- Body -->
          <div class="p-6">
            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 mb-3">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
              >
                {{ tag }}
              </span>
            </div>

            <h3 class="font-bold text-lg text-zinc-900 dark:text-white mb-2">
              {{ project.title }}
            </h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
              {{ project.desc }}
            </p>

            <!-- Feature highlights -->
            <ul class="space-y-1.5 mb-5">
              <li
                v-for="feat in project.features"
                :key="feat"
                class="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400"
              >
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-sky-500 shrink-0" />
                {{ feat }}
              </li>
            </ul>

            <!-- Admin Credentials (demo info) -->
            <div
              v-if="project.adminCredentials"
              class="mb-4 rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 px-3 py-2.5"
            >
              <p
                class="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1.5 flex items-center gap-1"
              >
                <UIcon name="i-lucide-key-round" class="w-3 h-3" />
                Admin Login
              </p>
              <div class="space-y-1">
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] text-zinc-400 dark:text-zinc-500 w-14 shrink-0"
                    >Email</span
                  >
                  <code
                    class="text-[10px] font-mono text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded select-all"
                    >{{ project.adminCredentials.email }}</code
                  >
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] text-zinc-400 dark:text-zinc-500 w-14 shrink-0"
                    >Password</span
                  >
                  <code
                    class="text-[10px] font-mono text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded select-all"
                    >{{ project.adminCredentials.password }}</code
                  >
                </div>
              </div>
            </div>

            <!-- CTA -->
            <div class="flex items-center gap-3">
              <UButton
                v-if="project.demo"
                :to="project.demo"
                target="_blank"
                label="Live Demo"
                variant="soft"
                color="primary"
                size="sm"
                trailing-icon="i-lucide-arrow-up-right"
              />
              <UButton
                v-if="project.repo"
                :to="project.repo"
                label="Source"
                variant="ghost"
                color="neutral"
                size="sm"
                leading-icon="i-lucide-github"
              />
              <span
                v-if="!project.demo && !project.repo"
                class="text-xs text-zinc-400 dark:text-zinc-600 italic"
              >
                Coming soon
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="text-center mt-14 fade-up">
        <p class="text-zinc-500 dark:text-zinc-400 mb-4 text-sm">
          Want us to build something like this for you?
        </p>
        <UButton
          to="/contact"
          label="Start a Project"
          size="lg"
          color="primary"
          trailing-icon="i-lucide-arrow-right"
        />
      </div>
    </div>
  </section>
</template>
