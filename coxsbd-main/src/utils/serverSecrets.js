// src/utils/serverSecrets.js (This file MUST ONLY be imported by API routes or server components)

/**
 * Helper to ensure a secret is available, preventing deployment errors.
 * Used for server-side secrets only (no NEXT_PUBLIC_ prefix).
 */
function getRequiredSecret(name) {
  // We check for window to ensure this code never accidentally runs in the browser
  if (typeof window !== 'undefined') {
    throw new Error(`SECURITY ERROR: Attempted to access server secret ${name} on the client side.`);
  }
  
  const value = process.env[name];
  if (typeof value === 'undefined' || value === null) {
    throw new Error(`CRITICAL: Server secret environment variable ${name} is not set.`);
  }
  return value;
}

// Export the database configuration object
export const DATABASE_CONFIG = {
  USER: getRequiredSecret("DATABASE_USER"),
  PASSWORD: getRequiredSecret("DATABASE_PASSWORD"),
  NAME: getRequiredSecret("DATABASE_NAME"),
  HOST: getRequiredSecret("DATABASE_HOST"),
  PORT: parseInt(getRequiredSecret("DATABASE_PORT") || '5432', 10),
};