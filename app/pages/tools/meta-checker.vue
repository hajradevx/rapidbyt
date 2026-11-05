<script setup lang="ts">
import type { MetaCheckerResult, MetaIssue } from "~/server/api/meta-checker.post";

definePageMeta({ layout: "default" });

useSeoMeta({
  title: "Free Meta Tag Checker — Preview OG & Twitter Cards | RapidByt",
  description:
    "Instantly check any URL's meta tags, Open Graph preview, Twitter Card, and SEO score. Free, no signup. Find missing og:image, title, description issues.",
  ogTitle: "Free Meta Tag Checker — Preview OG & Twitter Cards",
  ogDescription:
    "Check any URL's meta tags, Open Graph preview, and Twitter Card for free. Find missing tags and SEO issues instantly.",
  ogImage: "https://rapidbyt.com/og-image.png",
  twitterCard: "summary_large_image",
  keywords:
    "meta tag checker, og image checker, open graph preview, twitter card tester, SEO meta tags, meta description checker",
});
useHead({
  link: [{ rel: "canonical", href: "https://rapidbyt.com/tools/meta-checker" }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "RapidByt Meta Tag Checker",
        url: "https://rapidbyt.com/tools/meta-checker",
        description:
          "Free tool to check any website's meta tags, Open Graph preview, Twitter Card, and SEO score.",
        applicationCategory: "WebApplication",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "Open Graph preview card",
          "Twitter Card preview",
          "Meta description length check",
          "Title tag length check",
          "Canonical URL check",
          "Robots meta check",
          "SEO score 0-100",
        ],
      }),
    },
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://rapidbyt.com" },
          {
            "@type": "ListItem",
            position: 2,
            name: "Meta Tag Checker",
            item: "https://rapidbyt.com/tools/meta-checker",
          },
        ],
      }),
    },
  ],
});

// ── State ─────────────────────────────────────────────────────────────
const urlInput = ref("");
const loading = ref(false);
const error = ref("");
const result = ref<MetaCheckerResult | null>(null);

// ── Helpers ───────────────────────────────────────────────────────────
function isValidUrl(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;
  try {
    const url = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) && !!parsed.hostname;
  } catch {
    return false;
  }
}

async function checkMeta() {
  if (!urlInput.value.trim()) {
    error.value = "Please enter a URL.";
    return;
  }
  if (!isValidUrl(urlInput.value)) {
    error.value = "Please enter a valid URL (e.g. https://example.com).";
    return;
  }
  error.value = "";
  loading.value = true;
  result.value = null;

  try {
    const data = await $fetch<MetaCheckerResult>("/api/meta-checker", {
      method: "POST",
      body: { url: urlInput.value.trim() },
    });
    result.value = data;
  } catch (err: unknown) {
    const msg =
      err && typeof err === "object" && "data" in err
        ? (err as { data?: { message?: string } }).data?.message
        : err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
    error.value = msg ?? "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
}

function handleEnter(e: KeyboardEvent) {
  if (e.key === "Enter") checkMeta();
}

// ── Grade styling ─────────────────────────────────────────────────────
const gradeConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  A: {
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-300 dark:border-emerald-700",
    label: "Excellent",
  },
  B: {
    bg: "bg-sky-50 dark:bg-sky-900/30",
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-300 dark:border-sky-700",
    label: "Good",
  },
  C: {
    bg: "bg-amber-50 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-300 dark:border-amber-700",
    label: "Needs Work",
  },
  D: {
    bg: "bg-orange-50 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-300 dark:border-orange-700",
    label: "Poor",
  },
  F: {
    bg: "bg-red-50 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-300 dark:border-red-700",
    label: "Critical",
  },
};

const severityConfig: Record<
  MetaIssue["severity"],
  { icon: string; color: string; bg: string; label: string }
> = {
  error: {
    icon: "i-lucide-circle-x",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    label: "Error",
  },
  warning: {
    icon: "i-lucide-triangle-alert",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
    label: "Warning",
  },
  info: {
    icon: "i-lucide-info",
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800",
    label: "Info",
  },
};

// Compute OG preview image URL — resolve relative paths
const ogPreviewImage = computed(() => {
  if (!result.value?.ogImage) return null;
  const img = result.value.ogImage;
  if (img.startsWith("http")) return img;
  // relative path — try to resolve against the checked URL
  try {
    return new URL(img, result.value.url).href;
  } catch {
    return img;
  }
});

const twitterPreviewImage = computed(() => {
  const img = result.value?.twitterImage ?? result.value?.ogImage ?? null;
  if (!img) return null;
  if (img.startsWith("http")) return img;
  try {
    return new URL(img, result.value!.url).href;
  } catch {
    return img;
  }
});

const errorCount = computed(
  () => result.value?.issues.filter((i) => i.severity === "error").length ?? 0,
);
const warningCount = computed(
  () => result.value?.issues.filter((i) => i.severity === "warning").length ?? 0,
);

// Active tab
const activeTab = ref<"issues" | "raw">("issues");
</script>

<template>
  <UPage>
    <!-- Background glow -->
    <div class="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      <div
        class="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-400/8 dark:bg-violet-500/6 rounded-full blur-3xl"
      />
      <div
        class="absolute bottom-1/3 left-1/4 w-96 h-96 bg-sky-400/8 dark:bg-sky-500/6 rounded-full blur-3xl"
      />
    </div>

    <UContainer class="py-16 max-w-4xl">
      <!-- ── Header ──────────────────────────────────────────────────── -->
      <div class="text-center mb-10">
        <div
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-400 text-sm font-medium mb-5"
        >
          <UIcon name="i-lucide-tag" class="w-4 h-4" />
          Free SEO Tool
        </div>

        <h1
          class="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4"
        >
          Meta Tag <span class="gradient-text">Checker</span>
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
          Paste any URL and instantly see your Open Graph preview, Twitter Card, SEO score, and
          every missing or broken meta tag.
        </p>
      </div>

      <!-- ── Input ───────────────────────────────────────────────────── -->
      <div
        class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 mb-8 shadow-sm"
      >
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <UIcon
              name="i-lucide-globe"
              class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
            />
            <input
              v-model="urlInput"
              type="url"
              placeholder="https://yourwebsite.com"
              class="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition"
              :disabled="loading"
              @keydown="handleEnter"
            />
          </div>
          <UButton
            :label="loading ? 'Checking…' : 'Check Tags'"
            :loading="loading"
            :disabled="loading"
            icon="i-lucide-search"
            color="primary"
            size="lg"
            class="shrink-0"
            @click="checkMeta"
          />
        </div>

        <p
          v-if="error"
          class="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5"
        >
          <UIcon name="i-lucide-circle-x" class="w-4 h-4 shrink-0" />
          {{ error }}
        </p>

        <p class="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
          No signup required · Works on any public URL · Checks 14+ SEO signals
        </p>
      </div>

      <!-- ── Loading state ───────────────────────────────────────────── -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-flex flex-col items-center gap-4">
          <div
            class="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center"
          >
            <UIcon
              name="i-lucide-loader-circle"
              class="w-7 h-7 text-violet-600 dark:text-violet-400 animate-spin"
            />
          </div>
          <div>
            <p class="font-semibold text-zinc-900 dark:text-white">Fetching meta tags…</p>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Scanning Open Graph, Twitter Card, and SEO signals
            </p>
          </div>
        </div>
      </div>

      <!-- ── Results ─────────────────────────────────────────────────── -->
      <template v-if="result && !loading">
        <!-- Score + summary bar -->
        <div
          class="rounded-2xl border p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          :class="[gradeConfig[result.grade].bg, gradeConfig[result.grade].border]"
        >
          <!-- Grade circle -->
          <div
            class="w-20 h-20 rounded-2xl border-4 flex flex-col items-center justify-center shrink-0 bg-white dark:bg-zinc-900"
            :class="gradeConfig[result.grade].border"
          >
            <span
              class="text-3xl font-black leading-none"
              :class="gradeConfig[result.grade].text"
              >{{ result.grade }}</span
            >
            <span class="text-xs font-semibold text-zinc-400 mt-0.5">{{ result.score }}/100</span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1.5">
              <span class="text-lg font-black truncate" :class="gradeConfig[result.grade].text">{{
                gradeConfig[result.grade].label
              }}</span>
              <span class="text-zinc-400 dark:text-zinc-500 text-sm">·</span>
              <span
                class="text-zinc-600 dark:text-zinc-400 text-sm truncate max-w-xs font-medium"
                >{{ result.domain }}</span
              >
            </div>

            <div class="flex flex-wrap gap-3 text-sm">
              <span
                v-if="errorCount > 0"
                class="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold"
              >
                <UIcon name="i-lucide-circle-x" class="w-3.5 h-3.5" />
                {{ errorCount }} error{{ errorCount !== 1 ? "s" : "" }}
              </span>
              <span
                v-if="warningCount > 0"
                class="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold"
              >
                <UIcon name="i-lucide-triangle-alert" class="w-3.5 h-3.5" />
                {{ warningCount }} warning{{ warningCount !== 1 ? "s" : "" }}
              </span>
              <span
                class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold"
              >
                <UIcon name="i-lucide-circle-check" class="w-3.5 h-3.5" />
                {{ result.passed.length }} passed
              </span>
            </div>

            <!-- Score bar -->
            <div
              class="mt-3 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden max-w-sm"
            >
              <div
                class="h-full rounded-full transition-all duration-700"
                :class="
                  result.score >= 90
                    ? 'bg-emerald-500'
                    : result.score >= 75
                      ? 'bg-sky-500'
                      : result.score >= 55
                        ? 'bg-amber-500'
                        : result.score >= 35
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                "
                :style="{ width: `${result.score}%` }"
              />
            </div>
          </div>

          <UButton
            label="Share Results"
            size="sm"
            variant="soft"
            color="primary"
            icon="i-lucide-share-2"
            @click="
              navigator.share?.({
                title: `Meta Tag Score for ${result.domain}`,
                url: window.location.href,
              }) ?? navigator.clipboard?.writeText(window.location.href)
            "
          />
        </div>

        <!-- Social previews grid -->
        <div class="grid sm:grid-cols-2 gap-5 mb-6">
          <!-- Facebook / OG preview -->
          <div
            class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
          >
            <div
              class="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800"
            >
              <div class="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                <span class="text-white font-black text-[9px]">f</span>
              </div>
              <span class="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >Facebook / LinkedIn Preview</span
              >
            </div>

            <!-- OG card mockup -->
            <div class="aspect-[1.91/1] bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
              <img
                v-if="ogPreviewImage"
                :src="ogPreviewImage"
                :alt="result.ogTitle ?? result.title ?? 'OG image'"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div
                v-else
                class="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-400"
              >
                <UIcon name="i-lucide-image-off" class="w-8 h-8" />
                <span class="text-xs">No og:image</span>
              </div>
            </div>

            <div class="p-3 border-t border-zinc-100 dark:border-zinc-800">
              <p class="text-[11px] uppercase tracking-wide text-zinc-400 mb-1 truncate">
                {{ result.domain }}
              </p>
              <p class="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">
                {{ result.ogTitle ?? result.title ?? "No title" }}
              </p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                {{ result.ogDescription ?? result.description ?? "No description" }}
              </p>
            </div>
          </div>

          <!-- Twitter / X preview -->
          <div
            class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
          >
            <div
              class="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800"
            >
              <div
                class="w-5 h-5 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center"
              >
                <span class="text-white dark:text-zinc-900 font-black text-[10px] leading-none"
                  >𝕏</span
                >
              </div>
              <span class="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >X (Twitter) Preview</span
              >
            </div>

            <div
              class="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden m-3"
              :class="result.twitterCard === 'summary' ? '' : ''"
            >
              <div
                class="bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden"
                :class="
                  result.twitterCard === 'summary'
                    ? 'aspect-square w-24 float-left'
                    : 'aspect-[1.91/1]'
                "
              >
                <img
                  v-if="twitterPreviewImage"
                  :src="twitterPreviewImage"
                  :alt="result.twitterTitle ?? result.title ?? 'Twitter image'"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  v-else
                  class="w-full h-full flex flex-col items-center justify-center gap-1 text-zinc-400"
                >
                  <UIcon name="i-lucide-image-off" class="w-6 h-6" />
                  <span class="text-xs">No image</span>
                </div>
              </div>
              <div class="p-3" :class="result.twitterCard === 'summary' ? 'overflow-hidden' : ''">
                <p class="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">
                  {{ result.twitterTitle ?? result.ogTitle ?? result.title ?? "No title" }}
                </p>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                  {{
                    result.twitterDescription ??
                    result.ogDescription ??
                    result.description ??
                    "No description"
                  }}
                </p>
                <p class="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                  <UIcon name="i-lucide-link" class="w-3 h-3" />
                  {{ result.domain }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab switcher: Issues / Raw tags -->
        <div
          class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden mb-8"
        >
          <!-- Tabs -->
          <div class="flex border-b border-zinc-100 dark:border-zinc-800">
            <button
              class="flex-1 sm:flex-none px-5 py-3.5 text-sm font-semibold transition"
              :class="
                activeTab === 'issues'
                  ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-500'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              "
              @click="activeTab = 'issues'"
            >
              Issues & Passed
              <span
                v-if="result.issues.length"
                class="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                :class="
                  errorCount > 0
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                    : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                "
                >{{ result.issues.length }}</span
              >
            </button>
            <button
              class="flex-1 sm:flex-none px-5 py-3.5 text-sm font-semibold transition"
              :class="
                activeTab === 'raw'
                  ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-500'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              "
              @click="activeTab = 'raw'"
            >
              Raw Tag Values
            </button>
          </div>

          <!-- Issues tab -->
          <div v-if="activeTab === 'issues'" class="p-5">
            <div v-if="result.issues.length === 0" class="text-center py-8">
              <UIcon name="i-lucide-party-popper" class="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p class="font-semibold text-zinc-900 dark:text-white">No issues found</p>
              <p class="text-sm text-zinc-500 dark:text-zinc-400">All checked tags look good!</p>
            </div>

            <div v-else class="space-y-3 mb-5">
              <div
                v-for="(issue, i) in result.issues"
                :key="i"
                class="rounded-xl border p-4"
                :class="severityConfig[issue.severity].bg"
              >
                <div class="flex items-start gap-3">
                  <UIcon
                    :name="severityConfig[issue.severity].icon"
                    class="w-4 h-4 mt-0.5 shrink-0"
                    :class="severityConfig[issue.severity].color"
                  />
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2 mb-0.5">
                      <code
                        class="text-xs font-mono bg-white/60 dark:bg-black/20 px-1.5 py-0.5 rounded"
                        >{{ issue.tag }}</code
                      >
                      <span
                        class="text-xs font-bold uppercase tracking-wide"
                        :class="severityConfig[issue.severity].color"
                      >
                        {{ severityConfig[issue.severity].label }}
                      </span>
                    </div>
                    <p class="text-sm text-zinc-800 dark:text-zinc-200 font-medium">
                      {{ issue.message }}
                    </p>
                    <p
                      class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-start gap-1.5"
                    >
                      <UIcon
                        name="i-lucide-lightbulb"
                        class="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500"
                      />
                      <span>{{ issue.fix }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Passed checks -->
            <div v-if="result.passed.length" class="mt-5">
              <p
                class="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-2"
              >
                ✓ Passed ({{ result.passed.length }})
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="p in result.passed"
                  :key="p"
                  class="inline-flex items-center gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full px-2.5 py-1"
                >
                  <UIcon name="i-lucide-check" class="w-3 h-3" />
                  {{ p }}
                </span>
              </div>
            </div>
          </div>

          <!-- Raw tags tab -->
          <div v-if="activeTab === 'raw'" class="p-5">
            <div class="grid sm:grid-cols-2 gap-4">
              <!-- Core SEO -->
              <div>
                <p class="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-3">Core SEO</p>
                <div class="space-y-2">
                  <RawTagRow label="title" :value="result.title" :warn="!result.title" />
                  <RawTagRow
                    label="description"
                    :value="result.description"
                    :warn="!result.description"
                  />
                  <RawTagRow
                    label="canonical"
                    :value="result.canonical"
                    :warn="!result.canonical"
                  />
                  <RawTagRow label="robots" :value="result.robots ?? 'index, follow (default)'" />
                  <RawTagRow label="viewport" :value="result.viewport" :warn="!result.viewport" />
                  <RawTagRow label="charset" :value="result.charset" :warn="!result.charset" />
                  <RawTagRow label="lang" :value="result.lang" :warn="!result.lang" />
                  <RawTagRow label="keywords" :value="result.keywords" />
                </div>
              </div>

              <!-- Open Graph -->
              <div>
                <p class="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-3">
                  Open Graph
                </p>
                <div class="space-y-2">
                  <RawTagRow label="og:title" :value="result.ogTitle" :warn="!result.ogTitle" />
                  <RawTagRow
                    label="og:description"
                    :value="result.ogDescription"
                    :warn="!result.ogDescription"
                  />
                  <RawTagRow label="og:image" :value="result.ogImage" :warn="!result.ogImage" />
                  <RawTagRow label="og:image:width" :value="result.ogImageWidth" />
                  <RawTagRow label="og:image:height" :value="result.ogImageHeight" />
                  <RawTagRow label="og:url" :value="result.ogUrl" />
                  <RawTagRow label="og:type" :value="result.ogType" />
                  <RawTagRow label="og:site_name" :value="result.ogSiteName" />
                  <RawTagRow label="og:locale" :value="result.ogLocale" />
                </div>

                <p class="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-3 mt-5">
                  Twitter Card
                </p>
                <div class="space-y-2">
                  <RawTagRow
                    label="twitter:card"
                    :value="result.twitterCard"
                    :warn="!result.twitterCard"
                  />
                  <RawTagRow label="twitter:title" :value="result.twitterTitle" />
                  <RawTagRow label="twitter:description" :value="result.twitterDescription" />
                  <RawTagRow label="twitter:image" :value="result.twitterImage" />
                  <RawTagRow label="twitter:site" :value="result.twitterSite" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div
          class="rounded-2xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 p-6 text-center"
        >
          <UIcon
            name="i-lucide-zap"
            class="w-8 h-8 text-violet-600 dark:text-violet-400 mx-auto mb-3"
          />
          <h2 class="text-lg font-black text-zinc-900 dark:text-white mb-2">
            Found issues? We can fix them.
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-4 max-w-md mx-auto">
            Our team fixes SEO issues, improves Core Web Vitals, and builds faster websites. Run a
            full performance audit for free.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <UButton
              label="Run Speed Test"
              to="/diagnose"
              color="primary"
              trailing-icon="i-lucide-arrow-right"
            />
            <UButton
              label="Talk to Us"
              to="/contact"
              color="primary"
              variant="outline"
              trailing-icon="i-lucide-message-circle"
            />
          </div>
        </div>
      </template>

      <!-- ── FAQ (below fold — SEO content) ─────────────────────────── -->
      <div v-if="!result && !loading" class="mt-14">
        <h2 class="text-2xl font-black text-zinc-900 dark:text-white mb-6 text-center">
          What does this tool check?
        </h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="feature in [
              {
                icon: 'i-lucide-type',
                label: 'Title Tag',
                desc: 'Length, presence, and SERP truncation risk.',
              },
              {
                icon: 'i-lucide-align-left',
                label: 'Meta Description',
                desc: 'Length, presence, and CTR impact.',
              },
              {
                icon: 'i-lucide-link',
                label: 'Canonical URL',
                desc: 'Duplicate content prevention check.',
              },
              {
                icon: 'i-lucide-image',
                label: 'og:image',
                desc: 'Social share image — size, format, and presence.',
              },
              {
                icon: 'i-lucide-twitter',
                label: 'Twitter Card',
                desc: 'Card type and image availability.',
              },
              {
                icon: 'i-lucide-smartphone',
                label: 'Viewport',
                desc: 'Mobile-friendliness meta tag check.',
              },
              {
                icon: 'i-lucide-bot',
                label: 'Robots',
                desc: 'noindex detection — are you blocking Google?',
              },
              {
                icon: 'i-lucide-globe-2',
                label: 'Language',
                desc: 'HTML lang attribute for accessibility + SEO.',
              },
              {
                icon: 'i-lucide-bar-chart-2',
                label: 'SEO Score',
                desc: 'A–F grade based on 14 weighted checks.',
              },
            ]"
            :key="feature.label"
            class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
          >
            <div class="flex items-center gap-2.5 mb-1.5">
              <div
                class="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0"
              >
                <UIcon :name="feature.icon" class="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <span class="font-bold text-zinc-900 dark:text-white text-sm">{{
                feature.label
              }}</span>
            </div>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {{ feature.desc }}
            </p>
          </div>
        </div>
      </div>
    </UContainer>
  </UPage>
</template>
