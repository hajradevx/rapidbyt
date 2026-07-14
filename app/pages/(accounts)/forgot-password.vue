<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

definePageMeta({ layout: false });

const toast = useToast();
const router = useRouter();
const loading = ref(false);
const submitted = ref(false);

// Only ask for username/email — the server sends a reset link to the
// registered email. The old flow (username + new password directly) let
// anyone reset anyone else's password without proof of identity.
const schema = z.object({
  username: z.string().min(1, "Username or email is required"),
});

const fields: AuthFormField[] = [
  { name: "username", type: "text", label: "Username or Email", required: true },
];

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    await $fetch("/api/accounts/password/forgot", {
      method: "POST",
      body: { username: payload.data.username },
    });

    submitted.value = true;
  } catch (err: unknown) {
    const error = err as { data?: { statusText?: string; message?: string }; message?: string };
    const message =
      error?.data?.statusText || error?.data?.message || error?.message || "Something went wrong";

    toast.add({
      title: "Error",
      description: message,
      color: "error",
      icon: "i-lucide-x-circle",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UMain class="flex flex-col items-center justify-center">
    <UPageCard class="max-w-md w-full">
      <!-- Success state -->
      <div v-if="submitted" class="text-center space-y-4 py-4">
        <div
          class="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto"
        >
          <UIcon name="i-lucide-mail-check" class="w-7 h-7 text-emerald-600" />
        </div>
        <h2 class="text-xl font-black text-zinc-900 dark:text-white">Check your email</h2>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">
          If an account with that username or email exists, we've sent a password reset link. Check
          your inbox.
        </p>
        <UButton label="Back to Login" to="/login" variant="solid" color="primary" class="w-full" />
      </div>

      <!-- Form -->
      <UAuthForm
        v-else
        :schema="schema"
        title="Forgot Password"
        description="Enter your username or email and we'll send you a reset link."
        icon="i-lucide-key"
        :loading
        :fields="fields"
        :submit="{ label: 'Send Reset Link', color: 'primary', variant: 'subtle' }"
        class="max-w-md"
        @submit="onSubmit"
      >
        <template #description>
          Remember your password?
          <ULink to="/login" class="text-primary font-medium">Log in</ULink>.
        </template>
      </UAuthForm>
    </UPageCard>
  </UMain>
</template>
