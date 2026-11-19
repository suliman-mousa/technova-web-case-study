/**
 * Excerpt: APP_ENV helper for security fail-closed paths.
 * Prefers explicit APP_ENV; if missing, falls back to NODE_ENV / public site URL and warns once.
 */

export type AppEnv = "development" | "test" | "production";

let missingAppEnvWarned = false;

function warnMissingAppEnv() {
  if (missingAppEnvWarned) return;
  missingAppEnvWarned = true;
  console.warn(
    "[app-env] APP_ENV is missing; falling back to NODE_ENV / NEXT_PUBLIC_SITE_URL production detection",
  );
}

export function getAppEnv(): AppEnv | undefined {
  const raw = process.env.APP_ENV?.trim().toLowerCase();
  if (raw === "development" || raw === "test" || raw === "production") {
    return raw;
  }
  return undefined;
}

export function isProductionRuntime(): boolean {
  const appEnv = getAppEnv();
  if (appEnv) {
    return appEnv === "production";
  }

  warnMissingAppEnv();

  if (process.env.NODE_ENV === "production") {
    return true;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return /^https:\/\/(www\.)?technova-eagle\.com\/?$/i.test(siteUrl);
}
