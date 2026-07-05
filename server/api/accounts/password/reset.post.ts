export default defineEventHandler(async event => {
  try {
    const { token, email, newPassword } = await readBody(event)

    if (!token || !email || !newPassword) {
      throw createError({
        statusCode: 400,
        message: 'Token, email, and password are required.',
      })
    }

    // Find account by reset token
    const account = await orm.accounts.getByResetToken(token)

    if (!account) {
      throw createError({ statusCode: 400, message: 'Invalid token.' })
    }

    // Verify email matches
    if (account.email !== email) {
      throw createError({ statusCode: 400, message: 'Email does not match.' })
    }

    // Check token expiration
    const now = new Date()
    if (!account.resetTokenExpiresAt || new Date(account.resetTokenExpiresAt) < now) {
      throw createError({ statusCode: 400, message: 'Token has expired.' })
    }

    // Check if new password is same as old password
    if (account.password) {
      const isSamePassword = await verifyPassword(account.password, newPassword)

      if (isSamePassword) {
        throw createError({
          statusCode: 400,
          message: 'New password cannot be the same as your current password. Please try a different password.'
        })
      }
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update password and clear reset token
    await orm.accounts.updatePassword(account.id, hashedPassword)
    await orm.accounts.clearResetToken(account.id)

    return {
      success: true,
      message: 'Password reset successfully.',
    }
  }
  catch (error: any) {
    console.error('Password reset error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal Server Error',
    })
  }
})
