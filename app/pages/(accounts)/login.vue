<script setup lang="ts">
import type * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

definePageMeta({
  layout: false,
});

const { fetch: refreshSession } = useUserSession();

const toast = useToast();
const loading = ref(false);

const fields = ref<AuthFormField[]>([
  { name: "username", type: "text", label: "Username", required: true },
  { name: "password", type: "password", label: "Password", required: true },
]);

type Schema = z.output<typeof schemas.accounts.login>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log("Submitted", payload);

  loading.value = true;
  try {
    await $fetch("/api/accounts/login", {
      method: "POST",
      body: payload.data,
    });

    await refreshSession();
    await navigateTo("/");

    toast.add({
      title: "Login successful!",
      icon: "i-lucide-check-circle",
      color: "primary",
    });
  } catch (error: unknown) {
    const err = error as { data?: { statusText?: string }; message?: string };

    const message =
      err?.data?.statusText || err?.message || "An unexpected error occurred. Please try again.";

    toast.add({
      title: "Login failed",
      description: message,
      icon: "i-lucide-x-circle",
      color: "error",
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
        :schema="schemas.accounts.login"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-lock"
        :loading
        :fields="fields"
        :submit="{ label: 'Login', color: 'primary', variant: 'subtle' }"
        class="max-w-md"
        @submit="onSubmit"
      >
        <template #description>
          New to the collective?
          <ULink to="/register" class="text-primary font-medium">Join now</ULink>.
        </template>
        <template #password-hint>
          <ULink to="/forgot-password" class="text-primary font-medium" tabindex="-1"
            >Forgot password?</ULink
          >
        </template>
        <template #footer>
          By signing in, you agree to our
          <ULink
            to="/terms"
            class="text-primary-500 font-bold uppercase tracking-widest text-[10px]"
            >Terms of Tech</ULink
          >.
        </template>
      </UAuthForm>
    </UPageCard>
  </UMain>
</template>
