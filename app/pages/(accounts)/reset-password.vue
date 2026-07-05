<script setup lang="ts">
import type * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const toast = useToast()
const router = useRouter()
const route = useRoute()

definePageMeta({ layout: false })

const loading = ref(false)
const token = route.query.token as string

if (!token) {
  toast.add({
    title: 'Invalid Token',
    description: 'The reset token is invalid or missing.',
    color: 'error',
    icon: 'i-lucide-x-circle'
  })
  router.push('/forgot-password')
}

const fields = ref<AuthFormField[]>([
  { name: 'email', type: 'email', label: 'Email', required: true },
  { name: 'password', type: 'password', label: 'New Password', required: true },
  { name: 'confirmPassword', type: 'password', label: 'Confirm Password', required: true }
])

type Schema = z.output<typeof schemas.accounts.resetPassword>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    const response = await $fetch('/api/accounts/reset-password', {
      method: 'POST',
      body: {
        token,
        email: payload.data.email,
        newPassword: payload.data.password,
      },
    })

    toast.add({
      title: 'Success',
      description: response.message || 'Password reset successfully!',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    router.push('/login')
  }
  catch (error: unknown) {
    const err = error as { data?: { statusText?: string, message?: string }, message?: string }
    const errorMessage = err?.data?.statusText || err?.data?.message || err?.message || 'Failed to reset password'

    toast.add({
      title: 'Error',
      description: errorMessage,
      color: 'error',
      icon: 'i-lucide-x-circle'
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <UMain class="flex flex-col items-center justify-center">
    <UPageCard class="max-w-md w-full">
      <UAuthForm
        :schema="schemas.accounts.resetPassword"
        title="Reset Password"
        description="Enter your email and new password below."
        icon="i-lucide-lock"
        :loading
        :fields="fields"
        :submit="{ label: 'Reset Password', color: 'primary', variant: 'subtle' }"
        class="max-w-md"
        @submit="onSubmit">
        <template #description>
          Remember your password? <ULink to="/login" class="text-primary font-medium">Log in</ULink>.
        </template>
      </UAuthForm>
    </UPageCard>
  </UMain>
</template>
