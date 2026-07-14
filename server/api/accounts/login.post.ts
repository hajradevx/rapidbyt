export default eventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.username || !body.password)
    throw createError({ statusCode: 400, statusMessage: "Username and password are required" });

  // Find account by username
  const account = await orm.accounts.getByUsername(body.username);

  if (!account || !account.password)
    throw createError({ statusCode: 401, statusMessage: "Invalid username or password" });

  // Verify the password matches
  const isMatch = await verifyPassword(account.password, body.password);

  if (!isMatch)
    throw createError({ statusCode: 401, statusMessage: "Invalid username or password" });

  // Only expose safe fields in the session — never include password hash
  const sessionUser = {
    id: account.id,
    username: account.username,
    email: account.email ?? undefined,
    name: account.name ?? undefined,
    avatar: account.avatar ?? undefined,
    role: account.role,
  };

  // Start the session
  await setUserSession(event, { user: sessionUser, loggedInAt: new Date() });

  return sendSuccess(sessionUser, { message: "Logged in successfully" });
});
