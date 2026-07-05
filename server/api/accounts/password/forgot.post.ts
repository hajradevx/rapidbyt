export default eventHandler(async event => {
  const body = await readBody(event)

  if (!body.username)
    throw createError({ statusCode: 400, statusMessage: 'Username or email is required' })

  if (!body.newPassword)
    throw createError({ statusCode: 400, statusMessage: 'New password is required' })

  if (body.newPassword.length < 8)
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters' })

  // Try to find account by username first, then by email
  let account = await orm.accounts.getByUsername(body.username)

  if (!account) {
    // If not found by username, try email
    account = await orm.accounts.getByEmail(body.username)
  }

  if (!account) {
    return sendSuccess(null, { message: 'If you have an account, your password has been reset.' })
  }

  // Check if new password is same as old password
  if (account.password) {
    const isSamePassword = await verifyPassword(account.password, body.newPassword)

    if (isSamePassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'New password cannot be the same as your current password. Please try a different password.'
      })
    }
  }

  // Hash the new password
  const hashedPassword = await hashPassword(body.newPassword)

  // Update the password
  await orm.accounts.updatePassword(account.id, hashedPassword)

  return sendSuccess(null, { message: 'Password reset successfully!' })
})
