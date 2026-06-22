export enum AuthErrorMessages {
  USER_ALREADY_EXISTS = "A user with this email already exists.",
  INVALID_CREDENTIALS = "Invalid email or password.",
}

export enum AuthConfigMessages {
  DEFAULT_COOKIE_NAME = "access_token",
  INVALID_JWT_EXPIRES = "Invalid JWT_EXPIRES_IN value, falling back to default.",
}

export const AuthLogMessages = {
  registerConflict: (email: string) =>
    `Register attempt failed: user already exists (${email})`,
  loginFailed: (email: string) => `Login failed for email=${email}`,
  loginSuccess: (userId: string) => `User logged in successfully: ${userId}`,
  registerSuccess: (userId: string) =>
    `User registered successfully: ${userId}`,
  logout: (userId?: string) => `User logged out${userId ? `: ${userId}` : ""}`,
};
