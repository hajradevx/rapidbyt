<script setup lang="ts">
definePageMeta({ layout: 'default' })
useSeoMeta({
  title: 'Free Website Diagnostic — RapidByt',
  description: 'Enter your website URL and get an instant automated performance, SEO, and security report delivered to your inbox in seconds.',
})

interface DiagnoseResult {
  success: boolean
  domain: string
  emailSent: boolean
  scores: {
    performance: number | null
    seo: number | null
    accessibility: number | null
    bestPractices: number | null
    desktopPerformance: number | null
  }
  vitals: { lcp: string, fcp: string, tbt: string, cls: string }
  problems: string[]
  solutions: string[]
  severity: string
  whatsappUrl: string
}

const form = reactive({ url: '', email: '', name: '' })
const loading = ref(false)
const result = ref<DiagnoseResult | null>(null)
const error = ref('')
const progress = ref(0)
const progressMsg = ref('')

const progressSteps = [
  'Connecting to your website…',
  'Running PageSpeed analysis…',
  'Checking Core Web Vitals…',
  'Scanning SEO signals…',
  'Auditing accessibility…',
  'Checking security headers…',
  'Generating your report…',
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
let progressInterval: ReturnType<typeof setInterval> | null = null

function isValidUrl(input: string): boolean {
  const trimmed = input.trim()
  if (!trimmed) return false
  try {
    const url = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol) && !!parsed.hostname
  }
  catch {
    return false
  }
}

onUnmounted(() => {
  if (progressInterval) clearInterval(progressInterval)
})

async function runDiagnosis() {
  if (!form.url.trim() || !form.email.trim()) {
    error.value = 'Please enter your website URL and email address.'
    return
  }
  if (!isValidUrl(form.url)) {
    error.value = 'Please enter a valid website URL (e.g. https://yourwebsite.com).'
    return
  }
  if (!EMAIL_REGEX.test(form.email.trim())) {
    error.value = 'Please enter a valid email address.'
    return
  }
  error.value = ''
  loading.value = true
  result.value = null
  progress.value = 0

  // Animate progress while waiting (~20s average for PSI)
  let step = 0
  progressMsg.value = progressSteps[0]
  if (progressInterval) clearInterval(progressInterval)
  progressInterval = setInterval(() => {
    step++
    if (step < progressSteps.length) {
      progressMsg.value = progressSteps[step]
      progress.value = Math.min(82, Math.round((step / progressSteps.length) * 88))
    }
  }, 3000)

  try {
    const data = await $fetch<DiagnoseResult>('/api/diagnose', {
      method: 'POST',
      body: { url: form.url.trim(), email: form.email.trim(), name: form.name.trim() },
    })
    if (progressInterval) clearInterval(progressInterval)
    progressInterval = null
    progress.value = 100
    progressMsg.value = 'Report ready!'
    await new Promise(r => setTimeout(r, 600))
    result.value = data
  }
  catch (err: unknown) {
    if (progressInterval) clearInterval(progressInterval)
    progressInterval = null
    const e = err as { data?: { message?: string }, message?: string }
    error.value = e?.data?.message || e?.message || 'Analysis failed. Please check the URL and try again.'
  }
  finally {
    loading.value = false
  }
}

function scoreColor(score: number | null) {
  if (score === null) return 'text-zinc-400'
  if (score >= 90) return 'text-emerald-500'
  if (score >= 50) return 'text-amber-500'
  return 'text-red-500'
}
function scoreBg(score: number | null) {
  if (score === null) return 'bg-zinc-100 dark:bg-zinc-800'
  if (score >= 90) return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
  if (score >= 50) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
  return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
}
function severityStyle(level: string) {
  if (level === 'Good') return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400'
  if (level === 'Needs Attention') return 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400'
  return 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400'
}
function severityIcon(level: string) {
  if (level === 'Good') return 'i-lucide-check-circle'
  if (level === 'Needs Attention') return 'i-lucide-alert-triangle'
  return 'i-lucide-x-circle'
}
</script>

<template>
  <section class="relative overflow-hidden pt-12 pb-24">
    <!-- BG blobs -->
    <div class="absolute inset-0 -z-10 pointer-events-none">
      <div class="absolute top-0 left-1/3 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-3xl" />
      <div class="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl" />
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- ── Hero header ── -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400 text-sm font-medium mb-6">
          <UIcon name="i-lucide-scan-search" class="w-4 h-4" />
          Instant Website Diagnostic
        </div>
        <h1 class="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white">
          Find out <span class="gradient-text">exactly</span> what's<br class="hidden sm:block"> wrong with your site
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg">
          Enter your URL — our system automatically scans performance, SEO, accessibility, and security. Full report lands in your inbox in seconds.
        </p>
      </div>

      <!-- ── Input form ── -->
      <div v-if="!result" class="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 sm:p-10 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50 mb-8">
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
              :disabled="loading" />
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
                :disabled="loading" />
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
                :disabled="loading" />
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 rounded-xl">
            <UIcon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" />
            {{ error }}
          </div>

          <!-- Progress bar -->
          <div v-if="loading" class="space-y-3">
            <div class="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-700"
                :style="`width:${progress}%`" />
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
            trailing-icon="i-lucide-scan-search" />

          <p class="text-xs text-zinc-400 text-center">
            Free · No credit card · Report emailed instantly · Takes ~15 seconds
          </p>
        </form>
      </div>

      <!-- ── Results ── -->
      <div v-if="result" class="space-y-6">
        <!-- Back button -->
        <button
          class="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          @click="result = null; form.url = ''; form.email = ''; form.name = ''">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Analyse another site
        </button>

        <!-- Severity banner -->
        <div :class="['rounded-2xl border-2 p-5 flex items-start gap-4', severityStyle(result.severity)]">
          <UIcon :name="severityIcon(result.severity)" class="w-6 h-6 mt-0.5 shrink-0" />
          <div>
            <p class="font-black text-lg">
              {{ result.severity }} — {{ result.domain }}
            </p>
            <p class="text-sm opacity-80 mt-0.5">
              <template v-if="result.emailSent">
                Full report sent to {{ form.email }}
              </template>
              <template v-else>
                Report ready below — email delivery failed, but your results are shown here
              </template>
            </p>
          </div>
          <a
            :href="result.whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="ml-auto shrink-0 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
            <UIcon name="i-lucide-message-circle" class="w-4 h-4" />
            Fix on WhatsApp
          </a>
        </div>

        <!-- Score cards -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div
            v-for="(s, label) in {
              'Performance': result.scores.performance,
              'SEO': result.scores.seo,
              'Accessibility': result.scores.accessibility,
              'Best Practices': result.scores.bestPractices,
              'Desktop': result.scores.desktopPerformance,
            }"
            :key="label"
            :class="['rounded-2xl border p-4 text-center', scoreBg(s)]">
            <div :class="['text-4xl font-black mb-1', scoreColor(s)]">
              {{ s ?? '?' }}
            </div>
            <div :class="['w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden mb-2']">
              <div
                :class="['h-full rounded-full', s !== null && s >= 90 ? 'bg-emerald-400' : s !== null && s >= 50 ? 'bg-amber-400' : 'bg-red-400']"
                :style="`width:${s ?? 0}%`" />
            </div>
            <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {{ label }}
            </p>
          </div>
        </div>

        <!-- Core Web Vitals -->
        <div class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <h3 class="font-black text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-zap" class="w-5 h-5 text-amber-500" />
            Core Web Vitals (Mobile)
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div v-for="(val, key) in result.vitals" :key="key" class="text-center">
              <p class="text-xl font-black text-zinc-900 dark:text-white">
                {{ val }}
              </p>
              <p class="text-xs text-zinc-400 uppercase tracking-wider mt-0.5">
                {{ key.toUpperCase() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Problems -->
        <div v-if="result.problems.length > 0" class="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10 p-6">
          <h3 class="font-black text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-x-circle" class="w-5 h-5 text-red-500" />
            {{ result.problems.length }} Issues Found
          </h3>
          <ul class="space-y-2">
            <li
              v-for="p in result.problems"
              :key="p"
              class="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <span class="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
              {{ p }}
            </li>
          </ul>
        </div>

        <!-- Solutions -->
        <div v-if="result.solutions.length > 0" class="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/10 p-6">
          <h3 class="font-black text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-emerald-500" />
            Recommended Fixes
          </h3>
          <ul class="space-y-2">
            <li
              v-for="s in result.solutions"
              :key="s"
              class="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <UIcon name="i-lucide-check" class="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="s" />
            </li>
          </ul>
        </div>

        <!-- CTA -->
        <div class="rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-700 p-8 text-center">
          <h3 class="text-white font-black text-xl mb-2">
            Want us to fix all of this for you?
          </h3>
          <p class="text-sky-100 text-sm mb-6">
            Our engineers implement every fix. Most sites are fully optimised within 7 days.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              :href="result.whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl transition-colors w-full sm:w-auto justify-center">
              <UIcon name="i-lucide-message-circle" class="w-5 h-5" />
              Chat on WhatsApp
            </a>
            <UButton
              label="View Pricing"
              to="/#pricing"
              variant="ghost"
              class="text-sky-100 hover:text-white hover:bg-white/10 w-full sm:w-auto" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
