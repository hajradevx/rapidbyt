<script setup lang="ts">
defineProps<{
  label: string;
  value: string | null | undefined;
  warn?: boolean;
}>();
</script>

<template>
  <div class="flex items-start gap-2 text-xs min-w-0">
    <code
      class="shrink-0 font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded text-[11px]"
      >{{ label }}</code
    >
    <span
      class="truncate leading-relaxed pt-0.5"
      :class="
        value ? 'text-zinc-800 dark:text-zinc-200' : 'italic text-zinc-400 dark:text-zinc-600'
      "
      :title="value ?? undefined"
    >
      <span
        v-if="warn && !value"
        class="inline-flex items-center gap-1 text-red-500 dark:text-red-400"
      >
        <UIcon name="i-lucide-circle-x" class="w-3 h-3 shrink-0" />
        missing
      </span>
      <span v-else>{{ value ?? "not set" }}</span>
    </span>
  </div>
</template>
