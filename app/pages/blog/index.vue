<script setup lang="ts">
definePageMeta({ layout: "default" });

useSeoMeta({
  title: "Blog — Web Performance, SEO & Speed Optimization Tips | RapidByt",
  description:
    "Practical guides on website speed optimization, Core Web Vitals, technical SEO, and web performance. Free, actionable tips from the RapidByt team.",
  ogTitle: "RapidByt Blog — Web Performance & SEO Guides",
  ogDescription:
    "Actionable articles on page speed, Core Web Vitals, technical SEO, and growing your business online.",
  ogImage: "https://rapidbyt.com/og-image.png",
});

useHead({
  link: [{ rel: "canonical", href: "https://rapidbyt.com/blog" }],
});

useFadeUp();

function resetCategory(): void {
  selectedCategory.value = null;
}

function selectCategory(cat: string): void {
  selectedCategory.value = cat;
}
const { data: posts } = await useAsyncData("blog-posts", () =>
  queryCollection("blog").order("date", "DESC").all(),
);

// ── Category filter ───────────────────────────────────────────────────────────
const selectedCategory = ref<string | null>(null);

const categoryOrder = ["Performance", "SEO", "Development", "Security", "Business"];

const categoryCounts = computed(() => {
  const counts: Record<string, number> = {};
  for (const post of posts.value ?? []) {
    counts[post.category] = (counts[post.category] ?? 0) + 1;
  }
  return counts;
});

const categories = computed(() => categoryOrder.filter((c) => (categoryCounts.value[c] ?? 0) > 0));
const filteredPosts = computed(() =>
  selectedCategory.value
    ? (posts.value ?? []).filter((p) => p.category === selectedCategory.value)
    : (posts.value ?? []),
);

// featured = latest post, rest = remaining
const featuredPost = computed(() => filteredPosts.value[0] ?? null);
const remainingPosts = computed(() => filteredPosts.value.slice(1));

// ── Category meta ─────────────────────────────────────────────────────────────
type CatMeta = { badge: string; glow: string; icon: string; activeBg: string; activeText: string };
const categoryMeta: Record<string, CatMeta> = {
  Performance: {
    badge: "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400",
    glow: "from-sky-500/20 to-transparent",
    icon: "i-lucide-zap",
    activeBg: "bg-sky-50 dark:bg-sky-900/30",
    activeText: "text-sky-600 dark:text-sky-400",
  },
  SEO: {
    badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400",
    glow: "from-emerald-500/20 to-transparent",
    icon: "i-lucide-search",
    activeBg: "bg-emerald-50 dark:bg-emerald-900/30",
    activeText: "text-emerald-600 dark:text-emerald-400",
  },
  Development: {
    badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400",
    glow: "from-indigo-500/20 to-transparent",
    icon: "i-lucide-code-2",
    activeBg: "bg-indigo-50 dark:bg-indigo-900/30",
    activeText: "text-indigo-600 dark:text-indigo-400",
  },
  Security: {
    badge: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400",
    glow: "from-rose-500/20 to-transparent",
    icon: "i-lucide-shield",
    activeBg: "bg-rose-50 dark:bg-rose-900/30",
    activeText: "text-rose-600 dark:text-rose-400",
  },
  Business: {
    badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400",
    glow: "from-amber-500/20 to-transparent",
    icon: "i-lucide-bar-chart-2",
    activeBg: "bg-amber-50 dark:bg-amber-900/30",
    activeText: "text-amber-600 dark:text-amber-400",
  },
};

function catBadge(cat: string) {
  return (
    categoryMeta[cat]?.badge ?? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
  );
}
function catGlow(cat: string) {
  return categoryMeta[cat]?.glow ?? "from-sky-500/10 to-transparent";
}
function catIcon(cat: string) {
  return categoryMeta[cat]?.icon ?? "i-lucide-tag";
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <UPage>
    <!-- Ambient BG -->
    <div class="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      <div
        class="absolute -top-20 right-1/4 size-125 bg-sky-400/10 dark:bg-sky-500/8 rounded-full blur-3xl"
      />
      <div
        class="absolute top-1/2 -left-20 w-72 h-72 bg-indigo-400/8 dark:bg-indigo-500/6 rounded-full blur-3xl"
      />
    </div>

    <UContainer class="pt-10 pb-20">
      <!-- ── Page Header ──────────────────────────────────────────────────── -->
      <div class="mb-10 fade-up">
        <div
          class="inline-flex items-center gap-2 px-3 py-4 rounded-full bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400 text-xs font-semibold mb-4"
        >
          <UIcon name="i-lucide-book-open" class="w-3.5 h-3.5" />
          From the Team
        </div>
        <div class="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1
              class="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight"
            >
              Web Performance &amp; SEO
              <span class="gradient-text">Insights</span>
            </h1>
            <p class="text-zinc-500 dark:text-zinc-400 mt-2 text-base max-w-lg">
              Practical, no-fluff guides to make your website faster, rank higher, and convert
              better.
            </p>
          </div>
          <p class="text-sm text-zinc-400 border p-1 rounded-md">
            <span class="font-bold text-zinc-700 dark:text-zinc-200">{{ posts?.length ?? 0 }}</span>
            articles
          </p>
        </div>
      </div>

      <!-- ── Mobile category pills ────────────────────────────────────────── -->
      <div class="lg:hidden flex flex-wrap gap-2 mb-6">
        <UButton
          label="All"
          size="xs"
          :color="selectedCategory === null ? 'primary' : 'neutral'"
          :variant="selectedCategory === null ? 'solid' : 'outline'"
          class="rounded-full"
          @click="resetCategory"
        >
          <span class="ml-1 opacity-70">{{ posts?.length ?? 0 }}</span>
        </UButton>
        <UButton
          v-for="cat in categories"
          :key="cat"
          size="xs"
          :color="selectedCategory === cat ? 'primary' : 'neutral'"
          :variant="selectedCategory === cat ? 'solid' : 'outline'"
          class="rounded-full"
          @click="selectCategory(cat)"
        >
          {{ cat }} <span class="ml-1 opacity-70">{{ categoryCounts[cat] }}</span>
        </UButton>
      </div>

      <!-- ── Main layout: sidebar + content ────────────────────────────────── -->
      <div class="flex gap-8 items-start">
        <!-- ── Sidebar ────────────────────────────────────────────────────── -->
        <aside class="hidden lg:flex flex-col w-52 shrink-0 sticky top-24">
          <p
            class="text-[11px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 px-1"
          >
            Categories
          </p>

          <!-- All Posts -->
          <UButton
            block
            size="sm"
            variant="ghost"
            color="neutral"
            class="justify-between mb-0.5 rounded-xl"
            :class="
              selectedCategory === null
                ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 font-bold'
                : ''
            "
            @click="resetCategory"
          >
            <span class="flex items-center gap-2">
              <UIcon name="i-lucide-layout-grid" class="w-4 h-4 shrink-0" />
              All Posts
            </span>
            <UBadge
              :color="selectedCategory === null ? 'primary' : 'neutral'"
              :variant="selectedCategory === null ? 'solid' : 'subtle'"
              size="xs"
            >
              {{ posts?.length ?? 0 }}
            </UBadge>
          </UButton>

          <!-- Per category -->
          <UButton
            v-for="cat in categories"
            :key="cat"
            block
            size="sm"
            variant="ghost"
            color="neutral"
            class="justify-between mb-0.5 rounded-xl"
            :class="
              selectedCategory === cat
                ? `${categoryMeta[cat]?.activeBg} ${categoryMeta[cat]?.activeText} font-bold`
                : ''
            "
            @click="selectCategory(cat)"
          >
            <span class="flex items-center gap-2">
              <UIcon :name="catIcon(cat)" class="w-4 h-4 shrink-0" />
              {{ cat }}
            </span>
            <UBadge color="neutral" variant="subtle" size="xs">
              {{ categoryCounts[cat] }}
            </UBadge>
          </UButton>

          <!-- Divider + CTA -->
          <div class="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <p class="text-xs text-zinc-400 dark:text-zinc-500 mb-3 leading-relaxed">
              Want a free audit of your site?
            </p>
            <UButton
              label="Free Audit"
              to="/contact"
              size="xs"
              color="primary"
              variant="soft"
              block
              trailing-icon="i-lucide-arrow-right"
            />
          </div>
        </aside>

        <!-- ── Posts area ──────────────────────────────────────────────────── -->
        <div class="flex-1 min-w-0">
          <!-- Result count -->
          <p class="text-xs text-zinc-400 mb-4">
            Showing
            <span class="font-bold text-zinc-700 dark:text-zinc-300">{{
              filteredPosts.length
            }}</span>
            {{ filteredPosts.length === 1 ? "article" : "articles" }}
            <span v-if="selectedCategory"
              >in <span class="font-semibold">{{ selectedCategory }}</span></span
            >
          </p>

          <div v-if="filteredPosts.length">
            <!-- ── Featured / Hero post ────────────────────────────────────── -->
            <NuxtLink
              v-if="featuredPost"
              :to="featuredPost.path"
              class="group block rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden card-hover mb-6 relative"
            >
              <!-- Hero image area -->
              <div
                class="relative w-full h-52 sm:h-64 bg-linear-to-br from-sky-900/60 to-indigo-900/60 dark:from-sky-950 dark:to-indigo-950 flex items-center justify-center overflow-hidden"
              >
                <div
                  :class="[
                    'absolute inset-0 bg-linear-to-br opacity-60',
                    catGlow(featuredPost.category),
                  ]"
                />
                <NuxtImg
                  v-if="featuredPost.image"
                  :src="featuredPost.image"
                  :alt="featuredPost.title"
                  class="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
                />
                <UIcon name="i-lucide-file-text" class="w-16 h-16 text-white/20 relative z-10" />
                <!-- Category badge -->
                <span
                  v-if="featuredPost.category"
                  :class="[
                    'absolute top-4 left-4 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full',
                    catBadge(featuredPost.category),
                  ]"
                >
                  {{ featuredPost.category }}
                </span>
                <!-- Featured label -->
                <span
                  class="absolute top-4 right-4 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/20"
                >
                  Latest
                </span>
              </div>

              <div class="p-6 sm:p-7">
                <div class="flex items-center gap-3 text-xs text-zinc-400 mb-3">
                  <span class="flex items-center gap-1.5">
                    <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
                    {{ formatDate(featuredPost.date) }}
                  </span>
                  <span>·</span>
                  <span class="flex items-center gap-1.5">
                    <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
                    {{ featuredPost.readTime }} min read
                  </span>
                </div>
                <h2
                  class="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-2 leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors"
                >
                  {{ featuredPost.title }}
                </h2>
                <p
                  class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-4"
                >
                  {{ featuredPost.description }}
                </p>
                <div class="flex items-center justify-between flex-wrap gap-3">
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="tag in (featuredPost.tags ?? []).slice(0, 4)"
                      :key="tag"
                      class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                  <span
                    class="flex items-center gap-1 text-sm font-bold text-sky-600 dark:text-sky-400"
                  >
                    Read article
                    <UIcon
                      name="i-lucide-arrow-right"
                      class="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </div>
              </div>
            </NuxtLink>

            <!-- ── Regular grid ───────────────────────────────────────────── -->
            <div
              v-if="remainingPosts.length"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <NuxtLink
                v-for="post in remainingPosts"
                :key="post.path"
                :to="post.path"
                class="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden card-hover flex flex-col"
              >
                <!-- Thumbnail -->
                <div
                  class="relative aspect-video w-full overflow-hidden bg-linear-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900"
                >
                  <div
                    :class="['absolute inset-0 bg-linear-to-br opacity-70', catGlow(post.category)]"
                  />
                  <NuxtImg
                    v-if="post.image"
                    :src="post.image"
                    :alt="post.title"
                    class="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
                  />
                  <UIcon
                    name="i-lucide-file-text"
                    class="absolute inset-0 m-auto w-9 h-9 text-zinc-300 dark:text-zinc-600"
                  />
                  <span
                    v-if="post.category"
                    :class="[
                      'absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full z-10',
                      catBadge(post.category),
                    ]"
                  >
                    {{ post.category }}
                  </span>
                </div>

                <div class="p-4 flex flex-col flex-1">
                  <div class="flex items-center gap-2 text-[11px] text-zinc-400 mb-2">
                    <UIcon name="i-lucide-calendar" class="w-3 h-3 shrink-0" />
                    {{ formatDate(post.date) }}
                    <span>·</span>
                    <UIcon name="i-lucide-clock" class="w-3 h-3 shrink-0" />
                    {{ post.readTime }} min
                  </div>

                  <h2
                    class="font-black text-sm text-zinc-900 dark:text-white mb-2 leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2"
                  >
                    {{ post.title }}
                  </h2>

                  <p
                    class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 line-clamp-2 mb-3"
                  >
                    {{ post.description }}
                  </p>

                  <div class="flex items-center justify-between mt-auto">
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="tag in (post.tags ?? []).slice(0, 2)"
                        :key="tag"
                        class="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                      >
                        #{{ tag }}
                      </span>
                    </div>
                    <UIcon
                      name="i-lucide-arrow-right"
                      class="w-4 h-4 text-sky-500 group-hover:translate-x-1 transition-transform shrink-0"
                    />
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else class="text-center py-20">
            <UIcon
              name="i-lucide-pencil-line"
              class="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4"
            />
            <p class="text-zinc-400">No posts in this category yet.</p>
          </div>
        </div>
      </div>

      <!-- ── Bottom CTA ────────────────────────────────────────────────────── -->
      <div
        class="mt-20 fade-up rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/20 p-8 sm:p-10 text-center"
      >
        <p class="text-lg font-black text-zinc-900 dark:text-white mb-2">
          Done reading? Let us fix your site instead.
        </p>
        <p class="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">
          Free audit — we'll find exactly what's slowing you down and costing you sales.
        </p>
        <div class="flex items-center justify-center gap-3 flex-wrap">
          <UButton
            label="Get Free Audit"
            to="/contact"
            size="lg"
            color="primary"
            trailing-icon="i-lucide-arrow-right"
          />
          <UButton
            label="Instant Diagnosis"
            to="/diagnose"
            size="lg"
            variant="outline"
            color="primary"
            leading-icon="i-lucide-scan-search"
          />
        </div>
      </div>
    </UContainer>
  </UPage>
</template>
