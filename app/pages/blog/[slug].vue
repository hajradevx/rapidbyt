<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { data: post } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection("blog").where("path", "=", `/blog/${slug}`).first(),
);

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Post not found" });
}

const canonicalUrl = `https://rapidbyt.com/blog/${slug}`;

useSeoMeta({
  title: `${post.value.title} | RapidByt`,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogImage: post.value.image
    ? `https://rapidbyt.com${post.value.image}`
    : "https://rapidbyt.com/og-image.png",
  ogType: "article",
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
    <UContainer class="py-12 max-w-3xl">
      <!-- Back -->
      <NuxtLink
        to="/blog"
        class="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors mb-8"
      >
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        Back to Blog
      </NuxtLink>

      <!-- Hero image -->
      <div
        v-if="post.image"
        class="mb-10 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
      >
        <NuxtImg
          :src="post.image"
          :alt="post.title"
          width="800"
          height="420"
          class="w-full object-cover"
          loading="eager"
        />
      </div>

      <!-- Meta -->
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

        <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5 mt-5">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- Article body -->
      <div
        class="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-black prose-a:text-sky-600 dark:prose-a:text-sky-400 prose-a:no-underline hover:prose-a:underline prose-code:text-sky-600 dark:prose-code:text-sky-400"
      >
        <ContentRenderer :value="post" />
      </div>

      <!-- CTA -->
      <div
        class="mt-16 rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/20 p-7 text-center"
      >
        <p class="font-black text-zinc-900 dark:text-white mb-1">
          Want us to fix this for your site?
        </p>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
          Free audit — we'll diagnose exactly what's slowing you down.
        </p>
        <div class="flex items-center justify-center gap-3 flex-wrap">
          <UButton
            label="Get Free Audit"
            to="/contact"
            color="primary"
            trailing-icon="i-lucide-arrow-right"
          />
          <UButton
            label="Instant Diagnosis"
            to="/diagnose"
            variant="outline"
            color="primary"
            leading-icon="i-lucide-scan-search"
          />
        </div>
      </div>
    </UContainer>
  </UPage>
</template>
