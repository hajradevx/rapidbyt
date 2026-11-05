<script setup lang="ts">
import type { CwvHistoryResult, CwvDataPoint } from "~/server/api/cwv-history.post";

definePageMeta({ layout: "default" });

useSeoMeta({
  title: "Core Web Vitals History Checker — Real User Data | RapidByt",
  description:
    "Check 40 weeks of real-user Core Web Vitals history for any website. LCP, CLS, INP, FCP, TTFB trends from Google's CrUX dataset. Free, no signup.",
  ogTitle: "Core Web Vitals History Checker — 40 Weeks of Real User Data",
  ogDescription:
    "See how LCP, CLS, INP, FCP & TTFB have trended over 40 weeks for any site. Real user data from Google's Chrome UX Report.",
  ogImage: "https://rapidbyt.com/og-image.png",
  twitterCard: "summary_large_image",
  keywords:
    "core web vitals history, CrUX data checker, LCP trend, CLS history, INP checker, real user performance data, chrome ux report",
});
useHead({
  link: [{ rel: "canonical", href: "https://rapidbyt.com/tools/cwv-history" }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "RapidByt Core Web Vitals History Checker",
        url: "https://rapidbyt.com/tools/cwv-history",
        description:
          "Check 40 weeks of real-user Core Web Vitals trends for any website using Google CrUX data.",
        applicationCategory: "WebApplication",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "40 weeks LCP trend chart",
          "40 weeks CLS trend chart",
          "40 weeks INP trend chart",
          "40 weeks FCP trend chart",
          "40 weeks TTFB trend chart",
          "Good / Needs Improvement / Poor distribution",
          "Origin-level and URL-level data",
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
            name: "CWV History",
            item: "https://rapidbyt.com/tools/cwv-history",
          },
        ],
      }),
    },
  ],
});

// ── State ─────────────────────────────────────────────────────────────
const urlInput = ref("");
const mode = ref<"origin" | "url">("origin");
const loading = ref(false);
const error = ref("");
const result = ref<CwvHistoryResult | null>(null);

// Which metric is shown in the big trend chart
const activeMetric = ref<"lcp" | "cls" | "inp" | "fcp" | "ttfb">("lcp");

// ── Metric meta ───────────────────────────────────────────────────────
const metricMeta = {
  lcp: { label: "LCP", full: "Largest Contentful Paint", unit: "ms", icon: "i-lucide-image" },
  cls: {
    label: "CLS",
    full: "Cumulative Layout Shift",
    unit: "",
    icon: "i-lucide-move-horizontal",
  },
  fcp: { label: "FCP", full: "First Contentful Paint", unit: "ms", icon: "i-lucide-timer" },
  inp: {
    label: "INP",
    full: "Interaction to Next Paint",
    unit: "ms",
    icon: "i-lucide-mouse-pointer-click",
  },
  ttfb: { label: "TTFB", full: "Time to First Byte", unit: "ms", icon: "i-lucide-server" },
} as const;

// ── Helpers ───────────────────────────────────────────────────────────
function isValidUrl(input: string): boolean {
  try {
    const url = input.trim().startsWith("http") ? input.trim() : `https://${input.trim()}`;
    const p = new URL(url);
    return ["http:", "https:"].includes(p.protocol) && !!p.hostname;
  } catch {
    return false;
  }
}

async function check() {
  if (!urlInput.value.trim()) {
    error.value = "Please enter a URL.";
    return;
  }
  if (!isValidUrl(urlInput.value)) {
    error.value = "Please enter a valid URL.";
    return;
  }
  error.value = "";
  loading.value = true;
  result.value = null;
  try {
    const data = await $fetch<CwvHistoryResult>("/api/cwv-history", {
      method: "POST",
      body: { url: urlInput.value.trim(), mode: mode.value },
    });
    result.value = data;
    activeMetric.value = "lcp";
  } catch (err: unknown) {
    const httpStatus =
      err && typeof err === "object" && "status" in err
        ? (err as { status?: number }).status
        : null;
    const msg =
      err && typeof err === "object" && "data" in err
        ? (err as { data?: { message?: string } }).data?.message
        : err instanceof Error
          ? err.message
          : "Something went wrong.";

    if (httpStatus === 503 || httpStatus === 403) {
      error.value =
        "API key required. Add NUXT_PAGESPEED_API_KEY to your .env file. " +
        "Get a free key at developers.google.com/speed/docs/insights/v5/get-started";
    } else if (httpStatus === 404) {
      error.value =
        "No data found for this site. It may not have enough Chrome user traffic in Google's CrUX dataset yet.";
    } else {
      error.value = msg ?? "Something went wrong.";
    }
  } finally {
    loading.value = false;
  }
}

// ── Formatting ────────────────────────────────────────────────────────
function fmtMs(v: number | null): string {
  if (v === null) return "—";
  return v >= 1000 ? `${(v / 1000).toFixed(2)}s` : `${Math.round(v)}ms`;
}
function fmtCls(v: number | null): string {
  if (v === null) return "—";
  return v.toFixed(3);
}
function fmtMetric(key: keyof typeof metricMeta, v: number | null): string {
  if (v === null) return "—";
  return key === "cls" ? fmtCls(v) : fmtMs(v);
}

function getThresholdStatus(
  metric: keyof typeof metricMeta,
  value: number | null,
): "good" | "ni" | "poor" | "unknown" {
  if (value === null || !result.value) return "unknown";
  const t = result.value.thresholds[metric];
  if (value <= t.good) return "good";
  if (value <= t.poor) return "ni";
  return "poor";
}

const statusColors = {
  good: {
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    border: "border-emerald-300 dark:border-emerald-700",
  },
  ni: {
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/30",
    border: "border-amber-300 dark:border-amber-700",
  },
  poor: {
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/30",
    border: "border-red-300 dark:border-red-700",
  },
  unknown: {
    text: "text-zinc-500 dark:text-zinc-400",
    bg: "bg-zinc-50 dark:bg-zinc-800",
    border: "border-zinc-200 dark:border-zinc-700",
  },
};

const statusLabel = { good: "Good", ni: "Needs Improvement", poor: "Poor", unknown: "No data" };

// ── SVG Line Chart ────────────────────────────────────────────────────
const CHART_W = 700;
const CHART_H = 180;
const PAD = { top: 16, right: 16, bottom: 32, left: 52 };

function buildChart(metric: keyof typeof metricMeta, dataPoints: CwvDataPoint[]) {
  const raw = dataPoints.map((d) => d[metric] as number | null);
  const values = raw.map((v) => (metric === "cls" && v !== null ? v : v));
  const valid = values.filter((v): v is number => v !== null);

  if (valid.length < 2) return null;

  const minVal = Math.min(...valid);
  const maxVal = Math.max(...valid);
  const range = maxVal - minVal || 1;

  const innerW = CHART_W - PAD.left - PAD.right;
  const innerH = CHART_H - PAD.top - PAD.bottom;
  const n = dataPoints.length;

  function xPos(i: number) {
    return PAD.left + (i / (n - 1)) * innerW;
  }
  function yPos(v: number) {
    return PAD.top + innerH - ((v - minVal) / range) * innerH;
  }

  // Build polyline points (skip nulls)
  const segments: string[] = [];
  let seg: string[] = [];
  values.forEach((v, i) => {
    if (v === null) {
      if (seg.length) {
        segments.push(seg.join(" "));
        seg = [];
      }
    } else {
      seg.push(`${xPos(i).toFixed(1)},${yPos(v).toFixed(1)}`);
    }
  });
  if (seg.length) segments.push(seg.join(" "));

  // Area fill — first segment only
  let areaPath = "";
  if (segments[0]) {
    const pts = segments[0].split(" ");
    if (pts.length >= 2) {
      const firstX = pts[0]!.split(",")[0];
      const lastX = pts[pts.length - 1]!.split(",")[0];
      const bottom = PAD.top + innerH;
      areaPath = `M${firstX},${bottom} L${pts.join(" L")} L${lastX},${bottom} Z`;
    }
  }

  // Threshold lines
  const thresholds = result.value!.thresholds[metric];
  const goodY = yPos(thresholds.good);
  const poorY = yPos(thresholds.poor);

  // Y-axis labels
  const yTicks = [minVal, (minVal + maxVal) / 2, maxVal];
  const yLabels = yTicks.map((v) => ({
    y: yPos(v),
    label:
      metric === "cls"
        ? v.toFixed(2)
        : v >= 1000
          ? `${(v / 1000).toFixed(1)}s`
          : `${Math.round(v)}ms`,
  }));

  // X-axis labels — show every ~8 weeks
  const xLabels = dataPoints
    .filter((_, i) => i === 0 || i === Math.floor(n / 2) || i === n - 1)
    .map((d, li) => {
      const origIdx = li === 0 ? 0 : li === 1 ? Math.floor(n / 2) : n - 1;
      const date = new Date(d.date + "T00:00:00");
      const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return { x: xPos(origIdx), label };
    });

  // Latest dot
  const latestIdx =
    values
      .map((v, i) => (v !== null ? i : -1))
      .filter((i) => i >= 0)
      .at(-1) ?? -1;
  const latestDot =
    latestIdx >= 0 && values[latestIdx] !== null
      ? { cx: xPos(latestIdx), cy: yPos(values[latestIdx]!) }
      : null;

  return {
    segments,
    areaPath,
    goodY,
    poorY,
    yLabels,
    xLabels,
    latestDot,
    innerW,
    innerH,
    minVal,
    maxVal,
  };
}

const activeChart = computed(() =>
  result.value ? buildChart(activeMetric.value, result.value.dataPoints) : null,
);

// Bar chart for distribution
function gradeBarWidth(pct: number) {
  return `${Math.max(pct, 2)}%`;
}

// Date label short
function shortDate(d: string) {
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
</script>

<template>
  <UPage>
    <!-- Background -->
    <div class="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      <div
        class="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-400/8 dark:bg-emerald-500/5 rounded-full blur-3xl"
      />
      <div
        class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-400/8 dark:bg-sky-500/5 rounded-full blur-3xl"
      />
    </div>

    <UContainer class="py-16 max-w-4xl">
      <!-- ── Header ──────────────────────────────────────────────────── -->
      <div class="text-center mb-10">
        <div
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-5"
        >
          <UIcon name="i-lucide-activity" class="w-4 h-4" />
          Real User Data · Google CrUX
        </div>
        <h1
          class="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4"
        >
          Core Web Vitals <span class="gradient-text">History</span>
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
          See 40 weeks of real-user LCP, CLS, INP, FCP & TTFB trends from Google's Chrome UX Report
          dataset — not lab scores, actual Chrome users.
        </p>
      </div>

      <!-- ── Input card ──────────────────────────────────────────────── -->
      <div
        class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 mb-8 shadow-sm"
      >
        <!-- Mode toggle -->
        <div class="flex gap-2 mb-4">
          <button
            v-for="m in ['origin', 'url'] as const"
            :key="m"
            class="px-4 py-1.5 rounded-full text-sm font-semibold transition border"
            :class="
              mode === m
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-emerald-400'
            "
            @click="mode = m"
          >
            {{ m === "origin" ? "Whole Site (origin)" : "Specific Page (URL)" }}
          </button>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <UIcon
              name="i-lucide-globe"
              class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
            />
            <input
              v-model="urlInput"
              type="url"
              :placeholder="
                mode === 'origin' ? 'https://example.com' : 'https://example.com/blog/article'
              "
              class="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition"
              :disabled="loading"
              @keydown.enter="check"
            />
          </div>
          <UButton
            :label="loading ? 'Loading…' : 'Check History'"
            :loading="loading"
            :disabled="loading"
            icon="i-lucide-activity"
            color="primary"
            size="lg"
            class="shrink-0"
            @click="check"
          />
        </div>

        <p
          v-if="error"
          class="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5"
        >
          <UIcon name="i-lucide-circle-x" class="w-4 h-4 shrink-0" />
          {{ error }}
        </p>

        <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400 dark:text-zinc-500">
          <span>Data source: Google Chrome UX Report</span>
          <span>·</span>
          <span>Updates weekly</span>
          <span>·</span>
          <span>~40 weeks of history</span>
          <span>·</span>
          <span>No signup required</span>
        </div>
      </div>

      <!-- ── Loading ─────────────────────────────────────────────────── -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-flex flex-col items-center gap-4">
          <div
            class="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center"
          >
            <UIcon
              name="i-lucide-loader-circle"
              class="w-7 h-7 text-emerald-600 dark:text-emerald-400 animate-spin"
            />
          </div>
          <div>
            <p class="font-semibold text-zinc-900 dark:text-white">Fetching CrUX data…</p>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Querying Google Chrome UX Report
            </p>
          </div>
        </div>
      </div>

      <!-- ── Results ─────────────────────────────────────────────────── -->
      <template v-if="result && !loading">
        <!-- Domain + data range -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">
              Showing
              <span class="font-semibold text-zinc-900 dark:text-white"
                >{{ result.dataPoints.length }} weeks</span
              >
              of data for
              <span class="font-semibold text-zinc-900 dark:text-white">{{ result.domain }}</span>
              <span class="ml-1 text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{{
                result.granularity
              }}</span>
            </p>
            <p v-if="result.dataPoints.length >= 2" class="text-xs text-zinc-400 mt-0.5">
              {{ shortDate(result.dataPoints[0]!.date) }} →
              {{ shortDate(result.dataPoints[result.dataPoints.length - 1]!.date) }}
            </p>
          </div>
          <a
            :href="`https://pagespeed.web.dev/report?url=${encodeURIComponent(result.url)}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs flex items-center gap-1.5 text-zinc-500 hover:text-emerald-600 transition"
          >
            <UIcon name="i-lucide-external-link" class="w-3.5 h-3.5" />
            View on PageSpeed Insights
          </a>
        </div>

        <!-- ── Latest scores summary ──────────────────────────────── -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <button
            v-for="key in ['lcp', 'cls', 'inp', 'fcp', 'ttfb'] as const"
            :key="key"
            class="rounded-xl border p-3 text-left transition hover:shadow-sm"
            :class="[
              activeMetric === key ? 'ring-2 ring-emerald-400' : '',
              statusColors[getThresholdStatus(key, result.latest?.[key] ?? null)].bg,
              statusColors[getThresholdStatus(key, result.latest?.[key] ?? null)].border,
            ]"
            @click="activeMetric = key"
          >
            <div class="flex items-center gap-1.5 mb-1">
              <UIcon
                :name="metricMeta[key].icon"
                class="w-3.5 h-3.5"
                :class="statusColors[getThresholdStatus(key, result.latest?.[key] ?? null)].text"
              />
              <span class="text-xs font-bold text-zinc-500 dark:text-zinc-400">{{
                metricMeta[key].label
              }}</span>
            </div>
            <p
              class="text-xl font-black leading-none"
              :class="statusColors[getThresholdStatus(key, result.latest?.[key] ?? null)].text"
            >
              {{ fmtMetric(key, result.latest?.[key] ?? null) }}
            </p>
            <p
              class="text-[10px] font-semibold mt-1 uppercase tracking-wide"
              :class="statusColors[getThresholdStatus(key, result.latest?.[key] ?? null)].text"
            >
              {{ statusLabel[getThresholdStatus(key, result.latest?.[key] ?? null)] }}
            </p>
          </button>
        </div>

        <!-- ── Trend chart ────────────────────────────────────────── -->
        <div
          class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden mb-5"
        >
          <!-- Chart header -->
          <div
            class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800"
          >
            <div>
              <p class="font-black text-zinc-900 dark:text-white text-sm">
                {{ metricMeta[activeMetric].full }} ({{ metricMeta[activeMetric].label }}) — p75
                Trend
              </p>
              <p class="text-xs text-zinc-400 mt-0.5">
                75th percentile of real Chrome user experiences · weekly
              </p>
            </div>
            <!-- Metric tab pills -->
            <div class="flex gap-1.5 flex-wrap">
              <button
                v-for="key in ['lcp', 'cls', 'inp', 'fcp', 'ttfb'] as const"
                :key="key"
                class="px-2.5 py-1 rounded-full text-xs font-bold transition border"
                :class="
                  activeMetric === key
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-emerald-400'
                "
                @click="activeMetric = key"
              >
                {{ metricMeta[key].label }}
              </button>
            </div>
          </div>

          <!-- SVG chart -->
          <div class="px-2 py-4 overflow-x-auto">
            <div v-if="!activeChart" class="text-center py-10 text-zinc-400 text-sm">
              No data available for {{ metricMeta[activeMetric].label }}
            </div>

            <svg
              v-else
              :viewBox="`0 0 ${CHART_W} ${CHART_H}`"
              class="w-full"
              :style="{ minWidth: '320px', height: `${CHART_H}px` }"
              aria-label="`${metricMeta[activeMetric].full} trend chart`"
            >
              <!-- Area gradient fill -->
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#10b981" stop-opacity="0.18" />
                  <stop offset="100%" stop-color="#10b981" stop-opacity="0.01" />
                </linearGradient>
              </defs>

              <!-- Grid lines -->
              <line
                v-for="yLabel in activeChart.yLabels"
                :key="yLabel.label"
                :x1="PAD.left"
                :y1="yLabel.y"
                :x2="CHART_W - PAD.right"
                :y2="yLabel.y"
                stroke="currentColor"
                stroke-opacity="0.08"
                stroke-width="1"
              />

              <!-- Good threshold line -->
              <line
                v-if="
                  activeChart.goodY >= PAD.top && activeChart.goodY <= PAD.top + activeChart.innerH
                "
                :x1="PAD.left"
                :y1="activeChart.goodY"
                :x2="CHART_W - PAD.right"
                :y2="activeChart.goodY"
                stroke="#10b981"
                stroke-opacity="0.5"
                stroke-width="1"
                stroke-dasharray="4 3"
              />

              <!-- Poor threshold line -->
              <line
                v-if="
                  activeChart.poorY >= PAD.top && activeChart.poorY <= PAD.top + activeChart.innerH
                "
                :x1="PAD.left"
                :y1="activeChart.poorY"
                :x2="CHART_W - PAD.right"
                :y2="activeChart.poorY"
                stroke="#ef4444"
                stroke-opacity="0.5"
                stroke-width="1"
                stroke-dasharray="4 3"
              />

              <!-- Area fill -->
              <path v-if="activeChart.areaPath" :d="activeChart.areaPath" fill="url(#areaGrad)" />

              <!-- Line segments -->
              <polyline
                v-for="(seg, si) in activeChart.segments"
                :key="si"
                :points="seg"
                fill="none"
                stroke="#10b981"
                stroke-width="2"
                stroke-linejoin="round"
                stroke-linecap="round"
              />

              <!-- Latest dot -->
              <circle
                v-if="activeChart.latestDot"
                :cx="activeChart.latestDot.cx"
                :cy="activeChart.latestDot.cy"
                r="4"
                fill="#10b981"
                stroke="white"
                stroke-width="2"
              />

              <!-- Y-axis labels -->
              <text
                v-for="yl in activeChart.yLabels"
                :key="yl.label"
                :x="PAD.left - 6"
                :y="yl.y + 4"
                text-anchor="end"
                font-size="10"
                fill="currentColor"
                opacity="0.5"
              >
                {{ yl.label }}
              </text>

              <!-- X-axis labels -->
              <text
                v-for="xl in activeChart.xLabels"
                :key="xl.label"
                :x="xl.x"
                :y="CHART_H - 4"
                text-anchor="middle"
                font-size="10"
                fill="currentColor"
                opacity="0.5"
              >
                {{ xl.label }}
              </text>
            </svg>
          </div>

          <!-- Legend -->
          <div class="flex flex-wrap gap-4 px-5 pb-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span class="flex items-center gap-1.5">
              <span class="w-5 h-px border-t-2 border-dashed border-emerald-500 inline-block" />
              Good threshold ({{
                activeMetric === "cls"
                  ? result.thresholds[activeMetric].good
                  : fmtMs(result.thresholds[activeMetric].good)
              }})
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-5 h-px border-t-2 border-dashed border-red-500 inline-block" />
              Poor threshold ({{
                activeMetric === "cls"
                  ? result.thresholds[activeMetric].poor
                  : fmtMs(result.thresholds[activeMetric].poor)
              }})
            </span>
          </div>
        </div>

        <!-- ── Distribution bars ───────────────────────────────────── -->
        <div
          class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 mb-8"
        >
          <h2 class="text-sm font-black text-zinc-900 dark:text-white mb-4">
            Average Distribution (all {{ result.dataPoints.length }} weeks)
          </h2>
          <div class="space-y-4">
            <div v-for="key in ['lcp', 'cls', 'inp', 'fcp', 'ttfb'] as const" :key="key">
              <div v-if="result.grades[key]" class="space-y-1">
                <div class="flex items-center gap-2 mb-1">
                  <UIcon :name="metricMeta[key].icon" class="w-3.5 h-3.5 text-zinc-400" />
                  <span class="text-xs font-bold text-zinc-700 dark:text-zinc-300">{{
                    metricMeta[key].label
                  }}</span>
                  <span class="text-[10px] text-zinc-400">{{ metricMeta[key].full }}</span>
                </div>
                <div class="flex rounded-lg overflow-hidden h-5 text-[10px] font-bold">
                  <div
                    v-if="result.grades[key]!.good > 0"
                    :style="{ width: gradeBarWidth(result.grades[key]!.good) }"
                    class="bg-emerald-500 flex items-center justify-center text-white transition-all"
                    :title="`Good: ${result.grades[key]!.good}%`"
                  >
                    <span v-if="result.grades[key]!.good >= 12"
                      >{{ result.grades[key]!.good }}%</span
                    >
                  </div>
                  <div
                    v-if="result.grades[key]!.needsImprovement > 0"
                    :style="{ width: gradeBarWidth(result.grades[key]!.needsImprovement) }"
                    class="bg-amber-400 flex items-center justify-center text-white transition-all"
                    :title="`Needs Improvement: ${result.grades[key]!.needsImprovement}%`"
                  >
                    <span v-if="result.grades[key]!.needsImprovement >= 12"
                      >{{ result.grades[key]!.needsImprovement }}%</span
                    >
                  </div>
                  <div
                    v-if="result.grades[key]!.poor > 0"
                    :style="{ width: gradeBarWidth(result.grades[key]!.poor) }"
                    class="bg-red-500 flex items-center justify-center text-white transition-all"
                    :title="`Poor: ${result.grades[key]!.poor}%`"
                  >
                    <span v-if="result.grades[key]!.poor >= 12"
                      >{{ result.grades[key]!.poor }}%</span
                    >
                  </div>
                </div>
                <div class="flex gap-3 text-[10px] text-zinc-400">
                  <span class="flex items-center gap-1"
                    ><span class="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Good
                    {{ result.grades[key]!.good }}%</span
                  >
                  <span class="flex items-center gap-1"
                    ><span class="w-2 h-2 rounded-full bg-amber-400 inline-block" /> NI
                    {{ result.grades[key]!.needsImprovement }}%</span
                  >
                  <span class="flex items-center gap-1"
                    ><span class="w-2 h-2 rounded-full bg-red-500 inline-block" /> Poor
                    {{ result.grades[key]!.poor }}%</span
                  >
                </div>
              </div>
              <div v-else class="text-xs text-zinc-400 flex items-center gap-2">
                <UIcon :name="metricMeta[key].icon" class="w-3.5 h-3.5" />
                <span>{{ metricMeta[key].label }} — no data</span>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div
          class="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-6 text-center"
        >
          <UIcon
            name="i-lucide-zap"
            class="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3"
          />
          <h2 class="text-lg font-black text-zinc-900 dark:text-white mb-2">
            Poor vitals? We fix them.
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-4 max-w-md mx-auto">
            Core Web Vitals directly affect your Google rankings. Run a full performance audit to
            get an actionable fix list.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <UButton
              label="Run Speed Audit"
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

      <!-- ── Explainer (pre-search, SEO content) ────────────────────── -->
      <div v-if="!result && !loading" class="mt-14 space-y-10">
        <div>
          <h2 class="text-2xl font-black text-zinc-900 dark:text-white mb-6 text-center">
            What are Core Web Vitals?
          </h2>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="m in [
                {
                  key: 'lcp',
                  desc: 'How fast the main content loads. Measures perceived load speed.',
                  good: '≤ 2.5s',
                  poor: '> 4s',
                },
                {
                  key: 'cls',
                  desc: 'How much the layout shifts unexpectedly. Measures visual stability.',
                  good: '≤ 0.1',
                  poor: '> 0.25',
                },
                {
                  key: 'inp',
                  desc: 'How quickly the page responds to user interactions. Measures interactivity.',
                  good: '≤ 200ms',
                  poor: '> 500ms',
                },
                {
                  key: 'fcp',
                  desc: 'When the first text or image appears on screen.',
                  good: '≤ 1.8s',
                  poor: '> 3s',
                },
                {
                  key: 'ttfb',
                  desc: 'Time from the user\'s request until the first byte of the response arrives.',
                  good: '≤ 800ms',
                  poor: '> 1.8s',
                },
              ]"
              :key="m.key"
              class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
            >
              <div class="flex items-center gap-2 mb-2">
                <div
                  class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center"
                >
                  <UIcon
                    :name="metricMeta[m.key as keyof typeof metricMeta].icon"
                    class="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                  />
                </div>
                <div>
                  <span class="font-black text-zinc-900 dark:text-white text-sm">{{
                    m.key.toUpperCase()
                  }}</span>
                  <span class="text-xs text-zinc-400 ml-1">{{
                    metricMeta[m.key as keyof typeof metricMeta].full
                  }}</span>
                </div>
              </div>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-2">
                {{ m.desc }}
              </p>
              <div class="flex gap-2 text-[10px]">
                <span
                  class="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold"
                  >Good {{ m.good }}</span
                >
                <span
                  class="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold"
                  >Poor {{ m.poor }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <div
          class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5"
        >
          <h2 class="font-black text-zinc-900 dark:text-white mb-2">
            Lab data vs real user data — what's the difference?
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Tools like PageSpeed Insights run a simulated test on a single device. CrUX data comes
            from real Chrome users visiting your site over a 28-day rolling window. It reflects
            actual network conditions, devices, and user behaviour. This is what Google uses for
            ranking — not the lab score.
          </p>
        </div>
      </div>
    </UContainer>
  </UPage>
</template>
