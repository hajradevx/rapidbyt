export default eventHandler(async event => {
  const body = await readBody(event)

  if (!body.username || !body.password)
    throw createError({ statusCode: 400, statusMessage: 'Username and password are required' })

  // Find account by username
  const account = await orm.accounts.getByUsername(body.username)

  if (!account || !account.password)
    throw createError({ statusCode: 401, statusMessage: 'Invalid username or password' })

  // Verify the password matches
  const isMatch = await verifyPassword(account.password, body.password)

  if (!isMatch)
    throw createError({ statusCode: 401, statusMessage: 'Invalid username or password' })

  // Remove password before sending to client / session
  const secureAccount = { ...account, password: undefined }

  // Start the session
  await setUserSession(event, { user: secureAccount, loggedInAt: new Date() })

  return sendSuccess(secureAccount, { message: 'Logged in successfully' })
})
