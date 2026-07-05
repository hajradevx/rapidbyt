<script setup lang="ts">
defineProps<{ open: boolean }>()
</script>

<template>
  <UModal :open="open" :ui="{ content: 'max-w-sm' }">
    <template #content>
      <UEmpty
        title="Logging out..."
        description="Please wait while we sign you out">
        <template #leading>
          <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 text-primary-500 animate-spin" />
        </template>
      </UEmpty>
    </template>
  </UModal>
</template>
