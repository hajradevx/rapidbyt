<script setup lang="ts">
definePageMeta({ layout: "default" });
useSeoMeta({
  title: "Contact – RapidByt | Get Your Free Site Audit",
  description:
    "Get your free website performance audit from RapidByt. We'll identify what's slowing you down and send a prioritised fix report within 24 hours.",
});

const route = useRoute();
const { loggedIn, user } = useUserSession();
const serviceParam = route.query.service as string | undefined;

const serviceOptions = [
  { label: "Speed Optimisation", value: "speed" },
  { label: "SEO & Core Web Vitals", value: "seo" },
  { label: "Web App Development", value: "dev" },
  { label: "Cloud & Infrastructure", value: "cloud" },
  { label: "Security & Monitoring", value: "security" },
  { label: "Analytics & CRO", value: "cro" },
  { label: "Not sure – help me figure it out", value: "unsure" },
];

const BUSINESS_EMAIL = "info.rapidbyt@gmail.com";

const form = reactive({
  name: "",
  email: BUSINESS_EMAIL,
  website: "",
  service: serviceParam || "",
  message: "",
});

// Pre-fill name from session when logged in (email stays fixed)
watchEffect(() => {
  if (loggedIn.value && user.value) {
    if (user.value.name && !form.name) form.name = user.value.name;
  }
});

const submitting = ref(false);
const submitted = ref(false);
const error = ref("");
const whatsappUrl = ref("");

async function handleSubmit() {
  if (!form.name.trim() || !form.email.trim() || !form.website.trim()) {
    error.value = "Please fill in your name, email, and website URL.";
    return;
  }
  error.value = "";
  submitting.value = true;

  try {
    const data = await $fetch<{ success: boolean; whatsappUrl: string }>("/api/contact", {
      method: "POST",
      body: {
        name: form.name.trim(),
        email: form.email.trim(),
        website: form.website.trim(),
        service: form.service,
        message: form.message.trim(),
      },
    });
    whatsappUrl.value = data.whatsappUrl;
    submitted.value = true;
  } catch (err: unknown) {
    const e = err as { data?: { message?: string }; message?: string };
    error.value = e?.data?.message || e?.message || "Something went wrong. Please try again.";
  } finally {
    submitting.value = false;
  }
}

const contactInfo = [
  {
    icon: "i-lucide-mail",
    label: "Email us",
    value: "info.rapidbyt@gmail.com",
    href: "mailto:info.rapidbyt@gmail.com",
  },
  {
    icon: "i-lucide-message-circle",
    label: "WhatsApp",
    value: "+92 316 863 6339",
    href: "https://wa.me/923168636339",
  },
  { icon: "i-lucide-clock", label: "Response time", value: "Within 4 business hours", href: null },
  { icon: "i-lucide-calendar", label: "Audit delivery", value: "Within 24 hours", href: null },
];

const auditIncludes = [
  "PageSpeed Insights analysis (mobile & desktop)",
  "Core Web Vitals breakdown",
  "Top 10 performance bottlenecks",
  "SEO health snapshot",
  "Security header check",
  "Prioritised fix recommendations",
  "Estimated revenue impact",
];
</script>

<template>
  <UPage>
    <section class="relative overflow-hidden pt-24 pb-32">
      <div class="absolute inset-0 -z-10 pointer-events-none">
        <div
          class="absolute top-0 left-1/3 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-3xl"
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-16">
          <div
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400 text-sm font-medium mb-6"
          >
            <UIcon name="i-lucide-search" class="w-4 h-4" />
            Free Website Audit
          </div>
          <h1
            class="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-zinc-900 dark:text-white"
          >
            Let's find out what's<br class="hidden sm:block" />
            <span class="gradient-text">holding you back</span>
          </h1>
          <p class="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Fill in your details below and we'll analyse your site for speed, SEO, security, and
            code issues — and send you a prioritised report within 24 hours.
          </p>
        </div>

        <div class="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <!-- Form -->
          <div class="lg:col-span-2">
            <!-- Success state -->
            <div
              v-if="submitted"
              class="rounded-3xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-12 text-center"
            >
              <div
                class="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto mb-6"
              >
                <UIcon name="i-lucide-check-circle" class="w-8 h-8 text-emerald-600" />
              </div>
              <h2 class="text-2xl font-black text-zinc-900 dark:text-white mb-3">Request sent!</h2>
              <p class="text-zinc-500 dark:text-zinc-400 mb-2">
                Your audit request has been received. We'll send a full report to
                <strong class="text-zinc-700 dark:text-zinc-300">{{ form.email }}</strong>
                within 24 hours.
              </p>
              <p class="text-zinc-500 dark:text-zinc-400 mb-8">
                Want a faster reply? Drop us a message on WhatsApp right now.
              </p>
              <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
                <UButton
                  :to="whatsappUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  label="Chat on WhatsApp"
                  leading-icon="i-lucide-message-circle"
                  color="success"
                  size="lg"
                  class="w-full sm:w-auto font-bold"
                />
                <UButton
                  label="Back to Home"
                  to="/"
                  variant="outline"
                  color="neutral"
                  class="w-full sm:w-auto"
                />
              </div>
            </div>

            <!-- Form -->
            <form
              v-else
              class="space-y-6 rounded-3xl border border-muted bg-muted p-8 sm:p-10"
              @submit.prevent="handleSubmit"
            >
              <div class="grid sm:grid-cols-2 gap-6">
                <div class="w-full">
                  <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    Full name <span class="text-red-500">*</span>
                  </label>
                  <UInput
                    v-model="form.name"
                    placeholder="Jane Smith"
                    size="lg"
                    class="w-full"
                    :ui="{ base: 'w-full rounded-xl' }"
                  />
                </div>
                <div class="w-full">
                  <label class="block text-sm font-semibold text-muted mb-2">
                    Email address <span class="text-red-500">*</span>
                  </label>
                  <UInput
                    v-model="form.email"
                    type="email"
                    size="lg"
                    class="w-full"
                    readonly
                    :ui="{
                      base: 'w-full rounded-xl cursor-default',
                      trailing: 'pe-2',
                    }"
                  >
                    <template #trailing>
                      <UTooltip text="Audit reports go to this address">
                        <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-emerald-500" />
                      </UTooltip>
                    </template>
                  </UInput>
                  <p class="mt-1 text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                    <UIcon name="i-lucide-lock" class="w-3 h-3" />
                    Audit reports are sent to our team at this address
                  </p>
                </div>
              </div>

              <div class="w-full">
                <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  Website URL <span class="text-red-500">*</span>
                </label>
                <UInput
                  v-model="form.website"
                  placeholder="https://yourwebsite.com"
                  size="lg"
                  leading-icon="i-lucide-globe"
                  class="w-full"
                  :ui="{ base: 'w-full rounded-xl' }"
                />
              </div>

              <div class="w-full">
                <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  Which service are you interested in?
                </label>
                <USelect
                  v-model="form.service"
                  :items="serviceOptions"
                  value-key="value"
                  label-key="label"
                  placeholder="Select a service..."
                  size="lg"
                  class="w-full"
                  :ui="{ base: 'w-full rounded-xl' }"
                />
              </div>

              <div class="w-full">
                <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  Tell us about your main challenge
                </label>
                <UTextarea
                  v-model="form.message"
                  placeholder="e.g. Our site loads in 8 seconds and we're losing sales. Google rankings have dropped 30% in the last 3 months..."
                  :rows="4"
                  size="lg"
                  class="w-full"
                  :ui="{ base: 'w-full rounded-xl' }"
                />
              </div>

              <div
                v-if="error"
                class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 rounded-xl"
              >
                <UIcon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" />
                {{ error }}
              </div>

              <UButton
                type="submit"
                :loading="submitting"
                label="Send My Free Audit Request"
                size="xl"
                class="glow-btn w-full"
                trailing-icon="i-lucide-arrow-right"
              />

              <p class="text-xs text-zinc-400 text-center">
                No spam. No sales pressure. Just your audit report — delivered within 24 hours.
              </p>
            </form>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Contact info -->
            <div
              class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-5"
            >
              <h3 class="font-bold text-zinc-900 dark:text-white">Contact info</h3>
              <div v-for="c in contactInfo" :key="c.label" class="flex items-start gap-3">
                <div
                  class="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center shrink-0"
                >
                  <UIcon :name="c.icon" class="w-4 h-4 text-sky-500" />
                </div>
                <div>
                  <p class="text-xs text-zinc-400 mb-0.5">
                    {{ c.label }}
                  </p>
                  <UButton
                    v-if="c.href"
                    :to="c.href"
                    :label="c.value"
                    variant="link"
                    color="neutral"
                    size="sm"
                    class="p-0 font-semibold text-zinc-800 dark:text-zinc-200 hover:text-sky-600 dark:hover:text-sky-400"
                  />
                  <p v-else class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {{ c.value }}
                  </p>
                </div>
              </div>
            </div>

            <!-- What you get -->
            <div
              class="rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/20 p-6"
            >
              <h3 class="font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <UIcon name="i-lucide-gift" class="w-4 h-4 text-sky-500" />
                What you'll receive
              </h3>
              <ul class="space-y-3">
                <li
                  v-for="item in auditIncludes"
                  :key="item"
                  class="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  <UIcon name="i-lucide-check" class="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                  {{ item }}
                </li>
              </ul>
            </div>

            <!-- Social proof mini -->
            <div
              class="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
            >
              <div class="flex items-center gap-0.5 mb-2">
                <UIcon
                  v-for="n in 5"
                  :key="n"
                  name="i-lucide-star"
                  class="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                />
              </div>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 italic mb-3">
                "Submitted the form on Monday evening. Had a full 12-page audit in my inbox Tuesday
                morning. Incredibly detailed."
              </p>
              <p class="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                — Daniel K., Shopify Store Owner
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </UPage>
</template>
