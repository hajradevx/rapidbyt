<script setup lang="ts">
import type * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

const router = useRouter();

definePageMeta({ layout: false });
const toast = useToast();
const loading = ref(false);

const fields = ref<AuthFormField[]>([
  { name: "username", type: "text", label: "Username or Email", required: true },
  { name: "password", type: "password", label: "New Password", required: true },
  { name: "confirmPassword", type: "password", label: "Confirm Password", required: true },
]);

type Schema = z.output<typeof schemas.accounts.forgotPassword>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    const response = await $fetch("/api/accounts/password/forgot", {
      method: "POST",
      body: {
        username: payload.data.username,
        newPassword: payload.data.password,
      },
    });

    toast.add({
      title: "Success",
      description: response.message || "Password reset successfully!",
      color: "success",
      icon: "i-lucide-check-circle",
    });

    router.push("/login");
  } catch (err: unknown) {
    const error = err as { data?: { statusText?: string }; message?: string };
    const errorMessage = error?.data?.statusText || error?.message || "Failed to reset password";

    toast.add({
      title: "Error",
      description: errorMessage,
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
      <UAuthForm
        :schema="schemas.accounts.forgotPassword"
        title="Reset Password"
        description="Enter your username or email and new password."
        icon="i-lucide-key"
        :loading
        :fields="fields"
        :submit="{ label: 'Reset Password', color: 'primary', variant: 'subtle' }"
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
