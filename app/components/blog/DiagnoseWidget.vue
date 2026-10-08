<script setup lang="ts">
interface DiagnoseResult {
  success: boolean;
  domain: string;
  emailSent: boolean;
  scores: {
    performance: number | null;
    seo: number | null;
    accessibility: number | null;
    bestPractices: number | null;
    desktopPerformance: number | null;
  };
  vitals: { lcp: string; fcp: string; tbt: string; cls: string };
  problems: string[];
  solutions: string[];
  severity: string;
  whatsappUrl: string;
}

const form = reactive({ url: "", email: "" });
const loading = ref(false);
const result = ref<DiagnoseResult | null>(null);
const error = ref("");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

async function runDiagnosis() {
  if (!form.url.trim() || !form.email.trim()) {
    error.value = "Please enter your website URL and email.";
    return;
  }
  if (!isValidUrl(form.url)) {
    error.value = "Please enter a valid URL (e.g. https://yourwebsite.com).";
    return;
  }
  if (!EMAIL_REGEX.test(form.email.trim())) {
    error.value = "Please enter a valid email address.";
    return;
  }
  error.value = "";
  loading.value = true;
  result.value = null;

  try {
    const data = await $fetch<DiagnoseResult>("/api/diagnose", {
      method: "POST",
      body: { url: form.url.trim(), email: form.email.trim(), name: "" },
    });
    result.value = data;
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }; message?: string };
    error.value =
      e?.data?.message || e?.message || "Analysis failed. Please check the URL and try again.";
  } finally {
    loading.value = false;
  }
}

function scoreColor(score: number | null) {
  if (score === null) return "text-zinc-400";
  if (score >= 90) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
}

function scoreBg(score: number | null) {
  if (score === null) return "bg-zinc-100 dark:bg-zinc-800";
  if (score >= 90)
    return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800";
  if (score >= 50) return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
  return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
}

function severityStyle(level: string) {
  if (level === "Good")
    return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400";
  if (level === "Needs Attention")
    return "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400";
  return "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400";
}

function severityIcon(level: string) {
  if (level === "Good") return "i-lucide-check-circle";
  if (level === "Needs Attention") return "i-lucide-alert-triangle";
  return "i-lucide-x-circle";
}
</script>

<template>
  <div
    class="rounded-2xl border border-sky-200 dark:border-sky-800 bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-900/20 dark:to-indigo-900/20 p-6 sm:p-8"
  >
    <!-- Header -->
    <div class="text-center mb-6">
      <div
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 dark:bg-sky-900/50 border border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-400 text-xs font-bold mb-3"
      >
        <UIcon name="i-lucide-scan-search" class="w-3.5 h-3.5" />
        INSTANT DIAGNOSIS
      </div>
      <h3 class="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-2">
        Want us to fix this for your site?
      </h3>
      <p class="text-sm text-zinc-600 dark:text-zinc-400">
        Free audit — we'll diagnose exactly what's slowing you down in 10 seconds.
      </p>
    </div>

    <!-- Form (if no result yet) -->
    <div v-if="!result">
      <form class="space-y-3" @submit.prevent="runDiagnosis">
        <div>
          <UInput
            v-model="form.url"
            placeholder="https://yourwebsite.com"
            size="lg"
            leading-icon="i-lucide-globe"
            class="w-full"
            :ui="{ base: 'w-full rounded-xl' }"
            :disabled="loading"
          />
        </div>
        <div>
          <UInput
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            size="lg"
            leading-icon="i-lucide-mail"
            class="w-full"
            :ui="{ base: 'w-full rounded-xl' }"
            :disabled="loading"
          />
        </div>

        <!-- Error -->
        <div
          v-if="error"
          class="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 rounded-lg"
        >
          <UIcon name="i-lucide-alert-circle" class="w-3.5 h-3.5 shrink-0" />
          {{ error }}
        </div>

        <UButton
          type="submit"
          :loading="loading"
          :label="loading ? 'Scanning…' : 'Get Free Audit'"
          size="lg"
          class="w-full font-bold"
          trailing-icon="i-lucide-arrow-right"
          color="primary"
        />

        <p class="text-xs text-zinc-500 dark:text-zinc-400 text-center">
          Free · No signup · Report emailed instantly
        </p>
      </form>
    </div>

    <!-- Results -->
    <div v-else class="space-y-4">
      <!-- Back button -->
      <button
        type="button"
        class="text-xs text-zinc-500 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1"
        @click="
          result = null;
          form.url = '';
          form.email = '';
        "
      >
        <UIcon name="i-lucide-arrow-left" class="w-3 h-3" />
        Scan another site
      </button>

      <!-- Severity banner -->
      <div
        :class="['rounded-xl border-2 p-4 flex items-start gap-3', severityStyle(result.severity)]"
      >
        <UIcon :name="severityIcon(result.severity)" class="w-5 h-5 mt-0.5 shrink-0" />
        <div class="flex-1">
          <p class="font-black text-sm">{{ result.severity }} — {{ result.domain }}</p>
          <p class="text-xs opacity-80 mt-0.5">Full report sent to {{ form.email }}</p>
        </div>
      </div>

      <!-- Score cards (compact) -->
      <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
        <div
          v-for="(s, label) in {
            Perf: result.scores.performance,
            SEO: result.scores.seo,
            A11y: result.scores.accessibility,
            BP: result.scores.bestPractices,
            Desk: result.scores.desktopPerformance,
          }"
          :key="label"
          :class="['rounded-lg border p-2 text-center', scoreBg(s)]"
        >
          <div :class="['text-2xl font-black', scoreColor(s)]">
            {{ s ?? "?" }}
          </div>
          <p class="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase">
            {{ label }}
          </p>
        </div>
      </div>

      <!-- CTA buttons -->
      <div class="flex flex-col sm:flex-row gap-2 pt-2">
        <UButton
          :to="result.whatsappUrl"
          target="_blank"
          rel="noopener noreferrer"
          label="Get Fix Plan on WhatsApp"
          leading-icon="i-lucide-message-circle"
          color="success"
          size="sm"
          class="w-full sm:w-auto font-bold"
        />
        <UButton
          to="/contact"
          label="Book Free Call"
          variant="outline"
          color="primary"
          size="sm"
          class="w-full sm:w-auto"
          trailing-icon="i-lucide-phone"
        />
      </div>
    </div>
  </div>
</template>
