export const useLogout = () => {
  const { clear: clearSession } = useUserSession()
  const toast = useToast()
  const isLoggingOut = ref(false)

  const logout = async () => {
    isLoggingOut.value = true
    try {
      await clearSession()
      await navigateTo('/login', { replace: true })

      toast.add({
        title: 'Logged out successfully',
        icon: 'i-heroicons-check-circle',
        color: 'success'
      })
    }
    catch {
      toast.add({
        title: 'Logout failed',
        description: 'Please try again',
        icon: 'i-heroicons-x-circle',
        color: 'error'
      })
    }
    finally {
      isLoggingOut.value = false
    }
  }

  return {
    logout,
    isLoggingOut: readonly(isLoggingOut)
  }
}
