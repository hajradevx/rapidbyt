<script lang="ts" setup>
const route = useRoute()
const heroBackgroundClass = computed(() => route.meta?.heroBackground || '')

const { isLoading } = useLoadingIndicator()

const appear = ref(false)
const appeared = ref(false)
onMounted(() => {
  setTimeout(() => {
    appear.value = true
    setTimeout(() => {
      appeared.value = true
    }, 1000)
  }, 0)
})
</script>

<template>
  <AppHeader />
  <UMain class="relative">
    <HeroBackground
      class="absolute w-full transition-all text-primary shrink-0 -z-10"
      :class="[
        isLoading ? 'animate-pulse' : (appear ? heroBackgroundClass : 'opacity-0'),
        appeared ? 'duration-400' : 'duration-1000',
      ]" />
    <NuxtPage />
  </UMain>
  <AppFooter />
</template>
