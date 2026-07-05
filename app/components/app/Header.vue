<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'

// const route = useRoute()
const { logout, isLoggingOut } = useLogout()

const links = ref<NavigationMenuItem[]>([
  { label: 'Home', icon: 'i-heroicons-home', to: '/' },
  { label: 'Product', icon: 'i-heroicons-document-text', to: '/products' },
])

const profileItems = ref<DropdownMenuItem[][]>([
  [{
    label: 'Logout',
    icon: 'i-lucide-log-out',
    onSelect: logout,
    disabled: isLoggingOut.value
  }]
])
</script>

<template>
  <UHeader class="border-b border-gray-200 dark:border-gray-800">
    <!-- Logo -->
    <template #left>
      <NuxtLink to="/" class="text-xl font-bold">
        EShop
      </NuxtLink>
    </template>

    <!-- Navigation -->
    <UNavigationMenu :items="links" router class="hidden md:flex" />
    <template #body>
      <UNavigationMenu :items="links" orientation="vertical" class="-mx-2.5" />
    </template>

    <template #right>
      <div class="flex items-center gap-3">
        <UColorModeButton />

        <AppAuthSection :profile-items="profileItems" />
      </div>
    </template>
  </UHeader>
</template>
