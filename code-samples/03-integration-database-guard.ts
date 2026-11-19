/**
 * Excerpt: integration-test database safety guard.
 * Refuses production and any database whose name does not end with `_test`.
 */

export type IntegrationGuardInput = {
  databaseUrl?: string | null;
  nodeEnv?: string | null;
};

export function getDatabaseNameFromUrl(databaseUrl: string): string {
  const parsed = new URL(databaseUrl);
  const name = decodeURIComponent(parsed.pathname.replace(/^\//, "").split("/")[0] ?? "");
  if (!name) {
    throw new Error("DATABASE_URL must include a database name in the path.");
  }
  return name;
}

/** Throws when the environment is unsafe for integration tests. */
export function assertSafeIntegrationDatabase(input: IntegrationGuardInput = {}): void {
  const nodeEnv = input.nodeEnv ?? process.env.NODE_ENV ?? "";
  if (nodeEnv === "production") {
    throw new Error('Integration tests refuse to run when NODE_ENV is "production".');
  }

  const databaseUrl = (input.databaseUrl ?? process.env.DATABASE_URL)?.trim() ?? "";
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for integration tests.");
  }

  const databaseName = getDatabaseNameFromUrl(databaseUrl);
  if (!databaseName.endsWith("_test")) {
    throw new Error(
      `Refusing to run integration tests against database "${databaseName}". The name must end with "_test".`,
    );
  }
}
