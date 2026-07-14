export default eventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.username || !body.password) {
    throw createError({ statusCode: 400, statusMessage: "Username and password are required" });
  }

  // Hash the password securely before passing to the generic ORM
  const hashedPassword = await hashPassword(body.password);

  // Create the new account — orm.accounts.create throws createError on conflict/failure
  const account = await orm.accounts.create({
    email: body.email || null,
    username: body.username,
    name: body.name || body.username,
    password: hashedPassword,
    role: "user",
  });

  // Prepare secure account object (no password) for response
  const secureAccount = {
    id: account.id,
    username: account.username,
    email: account.email,
    role: account.role,
    name: account.name,
  };

  return sendSuccess(secureAccount, { message: "Account created successfully" });
});
