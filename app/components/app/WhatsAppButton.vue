<script setup lang="ts">
// Show button after a short delay so it doesn't compete with LCP
const visible = ref(false);
onMounted(() => {
  const t = setTimeout(() => (visible.value = true), 1500);
  onUnmounted(() => clearTimeout(t));
});

const waUrl =
  "https://wa.me/923168636339?text=Hi%20RapidByt!%20I'd%20like%20a%20free%20website%20audit.";
</script>

<template>
  <Transition name="wa-btn">
    <a
      v-if="visible"
      :href="waUrl"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with RapidByt on WhatsApp"
      class="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 group"
    >
      <!-- Pulse ring -->
      <span
        aria-hidden="true"
        class="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping"
      />
      <!-- Button -->
      <span
        class="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40 transition-transform duration-200 group-hover:scale-110"
      >
        <!-- WhatsApp SVG — no extra icon package needed -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          class="w-7 h-7"
          aria-hidden="true"
        >
          <path
            d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.417A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm4.93 13.41c-.207.584-1.212 1.116-1.654 1.168-.424.05-.971.072-1.567-.099a14.3 14.3 0 0 1-1.419-.525C9.874 15.08 8.5 13.02 8.395 12.878c-.104-.143-.85-1.13-.85-2.157 0-1.025.538-1.53.729-1.74.19-.208.415-.26.553-.26l.399.008c.128.005.3-.049.47.357.173.41.587 1.42.638 1.524.052.104.086.225.017.362-.07.138-.104.224-.207.345-.104.121-.218.27-.312.363-.103.103-.21.214-.09.42.12.206.534.882 1.146 1.428.787.7 1.45.916 1.657 1.02.207.104.328.087.45-.052.12-.139.52-.604.659-.811.138-.207.277-.173.467-.104.19.07 1.208.569 1.415.673.208.104.346.156.397.242.052.087.052.503-.156 1.088Z"
          />
        </svg>
      </span>
      <!-- Tooltip label — visible on hover, desktop only -->
      <span
        class="hidden sm:block absolute right-16 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
      >
        Chat with us on WhatsApp
      </span>
    </a>
  </Transition>
</template>

<style scoped>
.wa-btn-enter-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.wa-btn-enter-from {
  opacity: 0;
  transform: scale(0.7) translateY(20px);
}
</style>
