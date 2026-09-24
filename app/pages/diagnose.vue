<script setup lang="ts">
definePageMeta({ layout: "default" });
useSeoMeta({
  title: "Free Website Diagnostic — RapidByt",
  description:
    "Enter your website URL and get an instant automated performance, SEO, and security report delivered to your inbox in seconds.",
});

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

const form = reactive({ url: "", email: "", name: "" });
const loading = ref(false);
const result = ref<DiagnoseResult | null>(null);
const error = ref("");
const progress = ref(0);
const progressMsg = ref("");

// Lead capture after results
const leadBudget = ref("");
const leadSubmitting = ref(false);
const leadSubmitted = ref(false);
const leadError = ref("");

const budgetOptions = [
  { label: "Under $100", value: "under_100" },
  { label: "$100 – $300", value: "100_300" },
  { label: "$300 – $700", value: "300_700" },
  { label: "$700 – $1500", value: "700_1500" },
  { label: "$1500+", value: "1500_plus" },
];

// Countdown timer — 24h urgency
const timeLeft = ref("");
function startTimer() {
  const deadline = Date.now() + 24 * 60 * 60 * 1000;
  const tick = () => {
    const diff = deadline - Date.now();
    if (diff <= 0) {
      timeLeft.value = "00:00:00";
      return;
    }
    const h = Math.floor(diff / 3600000)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((diff % 3600000) / 60000)
      .toString()
      .padStart(2, "0");
    const s = Math.floor((diff % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    timeLeft.value = `${h}:${m}:${s}`;
    setTimeout(tick, 1000);
  };
  tick();
}

const progressSteps = [
  "Connecting to your website…",
  "Running PageSpeed analysis…",
  "Checking Core Web Vitals…",
  "Scanning SEO signals…",
  "Auditing accessibility…",
  "Generating your report…",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let progressInterval: ReturnType<typeof setInterval> | null = null;

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

onUnmounted(() => {
  if (progressInterval) clearInterval(progressInterval);
});

async function runDiagnosis() {
  if (!form.url.trim() || !form.email.trim()) {
    error.value = "Please enter your website URL and email address.";
    return;
  }
  if (!isValidUrl(form.url)) {
    error.value = "Please enter a valid website URL (e.g. https://yourwebsite.com).";
    return;
  }
  if (!EMAIL_REGEX.test(form.email.trim())) {
    error.value = "Please enter a valid email address.";
    return;
  }
  error.value = "";
  loading.value = true;
  result.value = null;
  progress.value = 0;

  let step = 0;
  progressMsg.value = progressSteps[0];
  if (progressInterval) clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    step++;
    if (step < progressSteps.length) {
      progressMsg.value = progressSteps[step];
      progress.value = Math.min(85, Math.round((step / progressSteps.length) * 90));
    }
  }, 2000);

  try {
    const data = await $fetch<DiagnoseResult>("/api/diagnose", {
      method: "POST",
      body: { url: form.url.trim(), email: form.email.trim(), name: form.name.trim() },
    });
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = null;
    progress.value = 100;
    progressMsg.value = "Report ready!";
    await new Promise((r) => setTimeout(r, 600));
    result.value = data;
    startTimer();
  } catch (err: unknown) {
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = null;
    const e = err as { data?: { message?: string }; message?: string };
    error.value =
      e?.data?.message || e?.message || "Analysis failed. Please check the URL and try again.";
  } finally {
    loading.value = false;
  }
}

async function submitLead() {
  if (!leadBudget.value) {
    leadError.value = "Please select your budget range.";
    return;
  }
  leadError.value = "";
  leadSubmitting.value = true;
  try {
    await $fetch("/api/contact", {
      method: "POST",
      body: {
        name: form.name.trim() || "Diagnose visitor",
        email: form.email.trim(),
        website: form.url.trim(),
        service: "diagnose_followup",
        message: `Budget: ${leadBudget.value} | Severity: ${result.value?.severity} | Domain: ${result.value?.domain}`,
      },
    });
    leadSubmitted.value = true;
  } catch {
    leadError.value = "Something went wrong. Please try WhatsApp instead.";
  } finally {
    leadSubmitting.value = false;
  }
}

// Score-based urgency copy
const urgencyData = computed(() => {
  const perf = result.value?.scores.performance ?? 100;
  if (perf < 50) {
    return {
      emoji: "🔴",
      headline: "Critical — your site is losing customers right now",
      sub: `A score of ${perf} means visitors are leaving before your page even loads. Every day you wait costs you real revenue.`,
      badge: "CRITICAL",
      badgeClass: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400",
      gradient: "from-red-600 to-rose-700",
    };
  }
  if (perf < 90) {
    return {
      emoji: "🟡",
      headline: "Your site needs attention before it hurts your rankings",
      sub: `A score of ${perf} puts you behind competitors. Google actively demotes slow sites in search results.`,
      badge: "NEEDS FIXING",
      badgeClass: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400",
      gradient: "from-amber-500 to-orange-600",
    };
  }
  return {
    emoji: "🟢",
    headline: "Good score — let's keep it that way",
    sub: "Your performance is solid. We can help maintain it and push SEO & conversions even further.",
    badge: "GOOD",
    badgeClass: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400",
    gradient: "from-sky-600 to-indigo-700",
  };
});

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
  <UPage>
    <!-- BG blobs -->
    <div class="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      <div
        class="absolute top-0 left-1/3 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-3xl"
      />
      <div
        class="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl"
      />
    </div>

    <UContainer class="pt-12 pb-24 max-w-4xl">
      <!-- ── Hero header ── -->
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400 text-sm font-medium mb-6"
        >
          <UIcon name="i-lucide-scan-search" class="w-4 h-4" />
          Instant Website Diagnostic
        </div>
        <h1
          class="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white"
        >
          Find out <span class="gradient-text">exactly</span> what's<br class="hidden sm:block" />
          wrong with your site
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg">
          Enter your URL — our system automatically scans performance, SEO, accessibility, and
          security. Full report lands in your inbox in seconds.
        </p>
      </div>

      <!-- ── Input form ── -->
      <div
        v-if="!result"
        class="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 sm:p-10 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50 mb-8"
      >
        <form class="space-y-5" @submit.prevent="runDiagnosis">
          <div>
            <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Website URL <span class="text-red-500">*</span>
            </label>
            <UInput
              v-model="form.url"
              placeholder="https://yourwebsite.com"
              size="xl"
              leading-icon="i-lucide-globe"
              class="w-full"
              :ui="{ base: 'w-full rounded-xl text-lg' }"
              :disabled="loading"
            />
          </div>

          <div class="grid sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Your email <span class="text-red-500">*</span>
              </label>
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
            <div>
              <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Your name <span class="text-zinc-400 font-normal">(optional)</span>
              </label>
              <UInput
                v-model="form.name"
                placeholder="Jane Smith"
                size="lg"
                leading-icon="i-lucide-user"
                class="w-full"
                :ui="{ base: 'w-full rounded-xl' }"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- Error -->
          <div
            v-if="error"
            class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 rounded-xl"
          >
            <UIcon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" />
            {{ error }}
          </div>

          <!-- Progress bar -->
          <div v-if="loading" class="space-y-3">
            <div class="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-700"
                :style="`width:${progress}%`"
              />
            </div>
            <div class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <UIcon name="i-lucide-loader-circle" class="w-4 h-4 animate-spin text-sky-500" />
              {{ progressMsg }}
            </div>
          </div>

          <UButton
            type="submit"
            :loading="loading"
            :label="loading ? 'Analysing your site…' : 'Run Free Diagnostic'"
            size="xl"
            class="glow-btn w-full font-bold"
            trailing-icon="i-lucide-scan-search"
          />

          <p class="text-xs text-zinc-400 text-center">
            Free · No credit card · Report emailed instantly · Takes ~10 seconds
          </p>
        </form>
      </div>

      <!-- ── Results ── -->
      <div v-if="result" class="space-y-6">
        <!-- Back button -->
        <UButton
          label="Analyse another site"
          variant="ghost"
          color="neutral"
          leading-icon="i-lucide-arrow-left"
          class="text-sm"
          @click="
            result = null;
            form.url = '';
            form.email = '';
            form.name = '';
            leadSubmitted = false;
            leadBudget = '';
          "
        />

        <!-- Severity banner -->
        <div
          :class="[
            'rounded-2xl border-2 p-5 flex items-start gap-4',
            severityStyle(result.severity),
          ]"
        >
          <UIcon :name="severityIcon(result.severity)" class="w-6 h-6 mt-0.5 shrink-0" />
          <div>
            <p class="font-black text-lg">{{ result.severity }} — {{ result.domain }}</p>
            <p class="text-sm opacity-80 mt-0.5">
              <template v-if="result.emailSent"> Full report sent to {{ form.email }} </template>
              <template v-else>
                Report ready below — email delivery failed, but your results are shown here
              </template>
            </p>
          </div>
          <UButton
            :to="result.whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            label="Fix on WhatsApp"
            leading-icon="i-lucide-message-circle"
            color="success"
            size="sm"
            class="ml-auto shrink-0 font-bold"
          />
        </div>

        <!-- Score cards -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div
            v-for="(s, label) in {
              Performance: result.scores.performance,
              SEO: result.scores.seo,
              Accessibility: result.scores.accessibility,
              'Best Practices': result.scores.bestPractices,
              Desktop: result.scores.desktopPerformance,
            }"
            :key="label"
            :class="['rounded-2xl border p-4 text-center', scoreBg(s)]"
          >
            <div :class="['text-4xl font-black mb-1', scoreColor(s)]">
              {{ s ?? "?" }}
            </div>
            <div
              class="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden mb-2"
            >
              <div
                :class="[
                  'h-full rounded-full',
                  s !== null && s >= 90
                    ? 'bg-emerald-400'
                    : s !== null && s >= 50
                      ? 'bg-amber-400'
                      : 'bg-red-400',
                ]"
                :style="`width:${s ?? 0}%`"
              />
            </div>
            <p class="text-xs font-semibold text-muted">
              {{ label }}
            </p>
          </div>
        </div>

        <!-- Core Web Vitals -->
        <div
          class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
        >
          <h3 class="font-black text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-zap" class="w-5 h-5 text-amber-500" />
            Core Web Vitals (Mobile)
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div v-for="(val, key) in result.vitals" :key="key" class="text-center">
              <p class="text-xl font-black text-zinc-900 dark:text-white">
                {{ val }}
              </p>
              <p class="text-xs text-muted uppercase tracking-wider mt-0.5">
                {{ key.toUpperCase() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Problems -->
        <div
          v-if="result.problems.length > 0"
          class="rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10 p-6"
        >
          <h3 class="font-black text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-x-circle" class="w-5 h-5 text-red-500" />
            {{ result.problems.length }} Issues Found
          </h3>
          <ul class="space-y-2">
            <li
              v-for="p in result.problems"
              :key="p"
              class="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
              {{ p }}
            </li>
          </ul>
        </div>

        <!-- Solutions -->
        <div
          v-if="result.solutions.length > 0"
          class="rounded-md border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/10 p-6"
        >
          <h3 class="font-black text-muted mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-emerald-500" />
            Recommended Fixes
          </h3>
          <ul class="space-y-2">
            <li
              v-for="s in result.solutions"
              :key="s"
              class="flex items-start gap-3 text-sm text-muted"
            >
              <UIcon name="i-lucide-check" class="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="s" />
            </li>
          </ul>
        </div>

        <!-- ═══════════════════════════════════════════════════════════ -->
        <!-- LEAD CONVERSION CTA — score-based urgency                  -->
        <!-- ═══════════════════════════════════════════════════════════ -->
        <div :class="['rounded-2xl bg-gradient-to-br p-px', urgencyData.gradient]">
          <div class="rounded-2xl bg-zinc-900 p-8">
            <!-- Top row: badge + timer -->
            <div class="flex items-center justify-between flex-wrap gap-3 mb-5">
              <span
                :class="[
                  'text-xs font-black px-3 py-1 rounded-full tracking-widest',
                  urgencyData.badgeClass,
                ]"
              >
                {{ urgencyData.badge }}
              </span>
              <div v-if="timeLeft" class="flex items-center gap-2 text-xs text-zinc-400">
                <UIcon name="i-lucide-clock" class="w-3.5 h-3.5 text-amber-400" />
                Free fix consultation expires in
                <span class="font-black text-amber-400 tabular-nums">{{ timeLeft }}</span>
              </div>
            </div>

            <!-- Headline -->
            <p class="text-2xl font-black text-white mb-2">
              {{ urgencyData.emoji }} {{ urgencyData.headline }}
            </p>
            <p class="text-zinc-400 text-sm mb-6">
              {{ urgencyData.sub }}
            </p>

            <!-- Social proof strip -->
            <div class="flex items-center gap-4 mb-7 flex-wrap">
              <div class="flex -space-x-2">
                <div
                  v-for="n in 4"
                  :key="n"
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 border-2 border-zinc-900 flex items-center justify-center text-xs text-white font-bold"
                >
                  {{ ["A", "M", "S", "R"][n - 1] }}
                </div>
              </div>
              <p class="text-xs text-zinc-400">
                <span class="text-white font-bold">47 sites fixed</span> this month · avg
                <span class="text-emerald-400 font-bold">+62% performance boost</span>
              </p>
            </div>

            <!-- Inline lead form OR success state -->
            <div v-if="!leadSubmitted" class="space-y-4">
              <p class="text-sm font-semibold text-zinc-300">
                What's your budget for fixing these issues?
              </p>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  v-for="opt in budgetOptions"
                  :key="opt.value"
                  type="button"
                  :class="[
                    'px-3 py-2 rounded-xl text-sm font-semibold border transition-all',
                    leadBudget === opt.value
                      ? 'bg-sky-500 border-sky-400 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-sky-500 hover:text-white',
                  ]"
                  @click="leadBudget = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>

              <p v-if="leadError" class="text-xs text-red-400">
                {{ leadError }}
              </p>

              <div class="flex flex-col sm:flex-row gap-3 pt-1">
                <UButton
                  :loading="leadSubmitting"
                  label="Get My Free Fix Plan"
                  size="lg"
                  color="primary"
                  class="w-full sm:w-auto font-black"
                  trailing-icon="i-lucide-arrow-right"
                  @click="submitLead"
                />
                <UButton
                  :to="result.whatsappUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  label="Chat on WhatsApp"
                  leading-icon="i-lucide-message-circle"
                  color="success"
                  size="lg"
                  class="w-full sm:w-auto font-bold"
                />
              </div>
              <p class="text-xs text-zinc-500">
                No spam. No pressure. We'll send a tailored fix plan within 4 hours.
              </p>
            </div>

            <!-- Success state -->
            <div v-else class="rounded-xl bg-zinc-800 border border-emerald-700 p-6 text-center">
              <UIcon name="i-lucide-check-circle" class="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p class="text-white font-black text-lg mb-1">You're on the list!</p>
              <p class="text-zinc-400 text-sm mb-4">
                We'll send a personalised fix plan to
                <span class="text-white">{{ form.email }}</span> within 4 hours.
              </p>
              <UButton
                :to="result.whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                label="Want it faster? Chat now"
                leading-icon="i-lucide-message-circle"
                color="success"
                size="sm"
              />
            </div>
          </div>
        </div>

        <!-- Secondary CTA: pricing -->
        <div class="text-center pt-2">
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-3">Already know what you need?</p>
          <div class="flex items-center justify-center gap-3 flex-wrap">
            <UButton
              label="View Pricing"
              to="/#pricing"
              variant="outline"
              color="neutral"
              size="sm"
              trailing-icon="i-lucide-arrow-right"
            />
            <UButton
              label="See Our Services"
              to="/services"
              variant="ghost"
              color="neutral"
              size="sm"
            />
          </div>
        </div>
      </div>
    </UContainer>
  </UPage>
</template>
