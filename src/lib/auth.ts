// Server-side authentication helper
export function validateAdminCredentials(
  username: string,
  password: string
): boolean {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  return username === adminUsername && password === adminPassword;
}

// Helper to create admin session token (simple JWT alternative)
export function createAdminToken(username: string): string {
  // Simple token: base64 encoded username + timestamp + secret
  const secret = process.env.ADMIN_SECRET || "default-secret-change-this";
  const payload = `${username}:${Date.now()}:${secret}`;
  return Buffer.from(payload).toString("base64");
}

// Validate admin token
export function validateAdminToken(token: string): boolean {
  try {
    const secret = process.env.ADMIN_SECRET || "default-secret-change-this";
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [username, timestamp, tokenSecret] = decoded.split(":");

    // Check if token is valid and not expired (24 hours)
    const isValid =
      tokenSecret === secret &&
      username === process.env.ADMIN_USERNAME &&
      Date.now() - parseInt(timestamp) < 24 * 60 * 60 * 1000;

    return isValid;
  } catch {
    return false;
  }
}
