export default eventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.username || !body.password) {
    throw createError({ statusCode: 400, statusMessage: "Username and password are required" });
  }

  try {
    // Hash the password securely before passing to the generic ORM
    const hashedPassword = await hashPassword(body.password);

    // Create the new account
    const account = await orm.accounts.create({
      email: body.email,
      username: body.username,
      name: body.name || body.username,
      password: hashedPassword,
      role: "user",
    });

    // Prepare secure account object for session and response
    const secureAccount = {
      id: account.id,
      username: account.username,
      email: account.email,
      role: account.role,
      name: account.name,
    };

    return {
      success: true,
      data: secureAccount,
      message: "Account created successfully",
    };
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const err = error as Error;
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || "Failed to create account",
    });
  }
});
