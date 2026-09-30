<script setup lang="ts">
/**
 * Cookie Consent Banner
 * - Shows on first visit (no cookie stored yet)
 * - "Accept All" → sets consent cookie + loads personalised ads
 * - "Reject Non-Essential" → sets consent cookie, no personalised ads
 * - Persists choice in localStorage for 365 days
 */

const STORAGE_KEY = "rb_cookie_consent";
const EXPIRY_DAYS = 365;

type ConsentChoice = "accepted" | "rejected";

const visible = ref(false);

function getStored(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { value, expires } = JSON.parse(raw);
    if (Date.now() > expires) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return value as ConsentChoice;
  } catch {
    return null;
  }
}

function storeChoice(choice: ConsentChoice) {
  const expires = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: choice, expires }));
}

function applyConsent(choice: ConsentChoice) {
  if (typeof window === "undefined") return;
  // Signal to AdSense / Google tags whether personalised ads are allowed
  // gtag consent update (works if gtag is loaded via AdSense auto-ads)
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: choice === "accepted" ? "granted" : "denied",
      ad_user_data: choice === "accepted" ? "granted" : "denied",
      ad_personalization: choice === "accepted" ? "granted" : "denied",
      analytics_storage: choice === "accepted" ? "granted" : "denied",
    });
  }
}

function accept() {
  storeChoice("accepted");
  applyConsent("accepted");
  visible.value = false;
}

function reject() {
  storeChoice("rejected");
  applyConsent("rejected");
  visible.value = false;
}

onMounted(() => {
  const stored = getStored();
  if (!stored) {
    // Small delay so it doesn't flash on first paint
    setTimeout(() => {
      visible.value = true;
    }, 800);
  } else {
    applyConsent(stored);
  }
});
</script>

<template>
  <Transition name="cookie-slide">
    <div
      v-if="visible"
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      class="fixed bottom-4 left-4 right-4 z-[200] sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm"
    >
      <div
        class="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-900/10 dark:shadow-black/40 p-5"
      >
        <!-- Icon + heading -->
        <div class="flex items-start gap-3 mb-3">
          <div
            class="mt-0.5 w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center shrink-0"
          >
            <UIcon name="i-lucide-cookie" class="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <p class="font-black text-sm text-zinc-900 dark:text-white leading-snug">
              We use cookies
            </p>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
              We and our partners use cookies to personalise ads and analyse site traffic.
              <NuxtLink
                to="/privacy"
                class="text-sky-600 dark:text-sky-400 hover:underline underline-offset-2"
              >
                Privacy Policy
              </NuxtLink>
              ·
              <NuxtLink
                to="/disclaimer"
                class="text-sky-600 dark:text-sky-400 hover:underline underline-offset-2"
              >
                Disclaimer
              </NuxtLink>
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 mt-4">
          <UButton
            label="Reject Non-Essential"
            size="sm"
            variant="outline"
            color="neutral"
            class="flex-1 text-xs font-medium"
            @click="reject"
          />
          <UButton
            label="Accept All"
            size="sm"
            color="primary"
            class="flex-1 text-xs font-semibold"
            @click="accept"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.cookie-slide-enter-active,
.cookie-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.cookie-slide-enter-from,
.cookie-slide-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
