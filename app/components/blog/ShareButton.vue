<script setup lang="ts">
const props = defineProps<{
  url: string;
  title: string;
  description?: string;
}>();

const copied = ref(false);
const open = ref(false);

const encodedUrl = computed(() => encodeURIComponent(props.url));
const encodedTitle = computed(() => encodeURIComponent(props.title));
const encodedDesc = computed(() => encodeURIComponent(props.description ?? ""));

const shareLinks = computed(() => [
  {
    label: "X (Twitter)",
    icon: "i-simple-icons-x",
    href: `https://x.com/intent/tweet?url=${encodedUrl.value}&text=${encodedTitle.value}`,
    color: "text-zinc-900 dark:text-white",
  },
  {
    label: "LinkedIn",
    icon: "i-simple-icons-linkedin",
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl.value}`,
    color: "text-sky-700 dark:text-sky-400",
  },
  {
    label: "Facebook",
    icon: "i-simple-icons-facebook",
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "WhatsApp",
    icon: "i-simple-icons-whatsapp",
    href: `https://api.whatsapp.com/send?text=${encodedTitle.value}%20${encodedUrl.value}`,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Reddit",
    icon: "i-simple-icons-reddit",
    href: `https://reddit.com/submit?url=${encodedUrl.value}&title=${encodedTitle.value}`,
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    label: "Email",
    icon: "i-lucide-mail",
    href: `mailto:?subject=${encodedTitle.value}&body=${encodedDesc.value}%0A%0A${encodedUrl.value}`,
    color: "text-zinc-500 dark:text-zinc-400",
  },
]);

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.url);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    // Fallback for browsers without clipboard API
    const el = document.createElement("textarea");
    el.value = props.url;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
}

function openNativeShare() {
  if (typeof navigator !== "undefined" && navigator.share) {
    navigator.share({
      title: props.title,
      text: props.description,
      url: props.url,
    });
  }
}

const hasNativeShare = computed(() => {
  if (typeof navigator === "undefined") return false;
  return !!navigator.share;
});
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Native share (mobile) -->
    <UButton
      v-if="hasNativeShare"
      variant="outline"
      color="neutral"
      size="sm"
      leading-icon="i-lucide-share-2"
      label="Share"
      @click="openNativeShare"
    />

    <!-- Dropdown share (desktop + fallback) -->
    <UDropdownMenu v-else v-model:open="open" :items="[]" :ui="{ content: 'min-w-44' }">
      <UButton
        variant="outline"
        color="neutral"
        size="sm"
        leading-icon="i-lucide-share-2"
        label="Share"
        trailing-icon="i-lucide-chevron-down"
      />

      <template #content>
        <div class="p-1.5 space-y-0.5">
          <!-- Social links -->
          <a
            v-for="item in shareLinks"
            :key="item.label"
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors w-full"
            @click="open = false"
          >
            <UIcon :name="item.icon" :class="['w-4 h-4 shrink-0', item.color]" />
            <span class="text-zinc-700 dark:text-zinc-300">{{ item.label }}</span>
          </a>

          <USeparator class="my-1" />

          <!-- Copy link -->
          <button
            type="button"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors w-full"
            @click="copyLink"
          >
            <UIcon
              :name="copied ? 'i-lucide-check' : 'i-lucide-link'"
              :class="[
                'w-4 h-4 shrink-0',
                copied ? 'text-emerald-500' : 'text-zinc-500 dark:text-zinc-400',
              ]"
            />
            <span
              :class="[
                'transition-colors',
                copied
                  ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                  : 'text-zinc-700 dark:text-zinc-300',
              ]"
            >
              {{ copied ? "Copied!" : "Copy link" }}
            </span>
          </button>
        </div>
      </template>
    </UDropdownMenu>

    <!-- Always show copy button alongside native share -->
    <UButton
      v-if="hasNativeShare"
      variant="ghost"
      color="neutral"
      size="sm"
      :leading-icon="copied ? 'i-lucide-check' : 'i-lucide-link'"
      :label="copied ? 'Copied!' : 'Copy'"
      :class="copied ? 'text-emerald-600 dark:text-emerald-400' : ''"
      @click="copyLink"
    />
  </div>
</template>
