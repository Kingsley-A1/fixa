import "server-only";
export function workspaceConfigured() {
  return Boolean(
    process.env.DATABASE_URL &&
    process.env.AUTH_SECRET &&
    process.env.AUTH_SECRET.length >= 32,
  );
}
export function registrationEnabled() {
  return workspaceConfigured() && process.env.ENABLE_REGISTRATION === "true";
}
