<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";

const route = useRoute();
const slug = route.params.slug as string;

// ── Current post ─────────────────────────────────────────
const { data: post } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection("blog").where("path", "=", `/blog/${slug}`).first(),
);

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Post not found" });
}

// ── Related posts in same category (for left sidebar) ────
const { data: relatedPosts } = await useAsyncData(`blog-related-${slug}`, () =>
  queryCollection("blog").where("category", "=", post.value!.category).order("date", "DESC").all(),
);

// Transform blog posts into ContentNavigationItem[] for UContentNavigation
const categoryNavigation = computed<ContentNavigationItem[]>(() => {
  if (!relatedPosts.value) return [];
  return relatedPosts.value.map((p) => ({
    title: p.title,
    path: p.path,
    // mark active item so UContentNavigation can highlight it
    active: p.path === `/blog/${slug}`,
  }));
});

// ── SEO ──────────────────────────────────────────────────
const canonicalUrl = `https://rapidbyt.com/blog/${slug}`;

useSeoMeta({
  title: `${post.value.title} | RapidByt`,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogImage: post.value.image
    ? `https://rapidbyt.com${post.value.image}`
    : "https://rapidbyt.com/og-image.png",
  articlePublishedTime: post.value.date,
  articleTag: post.value.tags?.join(", "),
});

useHead({
  link: [{ rel: "canonical", href: canonicalUrl }],
});

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
</script>

<template>
  <UPage v-if="post">
    <!-- ── LEFT: same-category article navigation ─────────── -->
    <template #left>
      <div class="pt-4">
        <!-- Category label -->
        <div class="flex items-center gap-2 px-1 mb-3">
          <UIcon name="i-lucide-layers" class="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <span
            class="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500"
          >
            {{ post.category }}
          </span>
          <UBadge
            :label="String(relatedPosts?.length ?? 0)"
            variant="soft"
            color="primary"
            size="sm"
          />
        </div>

        <!-- Navigation list -->
        <UContentNavigation
          :navigation="categoryNavigation"
          highlight
          color="primary"
          :collapsible="false"
        />

        <USeparator class="my-4" />

        <UButton
          to="/blog"
          variant="ghost"
          color="neutral"
          size="xs"
          leading-icon="i-lucide-layout-grid"
          label="All articles"
          class="w-full justify-start text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
        />
      </div>
    </template>

    <!-- ── CENTER: article content ────────────────────────── -->
    <UContainer class="py-12 max-w-none">
      <!-- Back -->
      <NuxtLink
        to="/blog"
        class="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors mb-8"
      >
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        Back to Blog
      </NuxtLink>

      <!-- Meta header -->
      <div class="mb-10">
        <div class="flex flex-wrap items-center gap-3 mb-4 text-xs text-zinc-400">
          <span
            class="px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400 font-semibold"
          >
            {{ post.category }}
          </span>
          <span class="flex items-center gap-1.5">
            <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
            {{ formatDate(post.date) }}
          </span>
          <span class="flex items-center gap-1.5">
            <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
            {{ post.readTime }} min read
          </span>
        </div>

        <h1
          class="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight mb-4"
        >
          {{ post.title }}
        </h1>

        <p class="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
          {{ post.description }}
        </p>

        <!-- Tags + Share -->
        <div class="flex flex-wrap items-center justify-between gap-3 mt-5">
          <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
            >
              #{{ tag }}
            </span>
          </div>
          <BlogShareButton
            :url="canonicalUrl"
            :title="post.title"
            :description="post.description"
          />
        </div>
      </div>

      <!-- Article body -->
      <div
        class="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-black prose-a:text-sky-600 dark:prose-a:text-sky-400 prose-a:no-underline hover:prose-a:underline prose-code:text-sky-600 dark:prose-code:text-sky-400"
      >
        <ContentRenderer :value="post" />
      </div>

      <!-- Bottom share + DiagnoseWidget -->
      <div class="mt-16">
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 mb-8"
        >
          <div>
            <p class="font-black text-zinc-900 dark:text-white text-sm">Found this helpful?</p>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Share it with someone who needs it.
            </p>
          </div>
          <BlogShareButton
            :url="canonicalUrl"
            :title="post.title"
            :description="post.description"
          />
        </div>

        <BlogDiagnoseWidget />
      </div>
    </UContainer>

    <!-- ── RIGHT: table of contents ──────────────────────── -->
    <template #right>
      <div class="pt-4">
        <UContentToc
          :links="post.body?.toc?.links"
          highlight
          color="primary"
          title="On this page"
        />
      </div>
    </template>
  </UPage>
</template>
