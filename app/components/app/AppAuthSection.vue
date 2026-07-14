<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";

const { fetch: refreshSession } = useUserSession();

defineProps<{
  profileItems: DropdownMenuItem[][];
}>();

// Use a shared state so multiple headers resolve at the same time
const isSessionResolved = useState("is-session-resolved", () => false);

onMounted(async () => {
  if (!isSessionResolved.value) {
    // Sync session with server to avoid stale guest state on SWR-cached pages
    await refreshSession();
    isSessionResolved.value = true;
  }
});
</script>

<template>
  <div class="flex items-center min-w-25 justify-end">
    <!-- On SWR/Server, just render a skeleton for the auth area -->
    <template v-if="!isSessionResolved">
      <div class="h-9 w-24 sm:w-32 rounded-xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
    </template>

    <!-- Once resolved on client, show correct auth state -->
    <AuthState v-else>
      <template #default="{ loggedIn: authLoggedIn, user: authUser }">
        <div v-if="!authLoggedIn" class="flex items-center gap-2">
          <UButton label="Login" to="/login" variant="solid" color="primary" size="sm" />
        </div>

        <UDropdownMenu v-else :items="profileItems">
          <UButton
            color="neutral"
            variant="ghost"
            trailing-icon="i-heroicons-chevron-down-20-solid"
          >
            <UAvatar
              :src="
                authUser?.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser?.username || 'user'}`
              "
              :alt="authUser?.name || 'User'"
              size="sm"
              :as="{ img: 'img' }"
            />
            <span class="font-bold text-sm hidden sm:inline">{{ authUser?.name || "User" }}</span>
          </UButton>
        </UDropdownMenu>
      </template>

      <template #placeholder>
        <!-- This handles the microscopic gap during AuthState initialization -->
        <div class="h-9 w-24 sm:w-32 rounded-xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      </template>
    </AuthState>
  </div>
</template>
