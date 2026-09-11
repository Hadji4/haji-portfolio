// Minimal structured logger: no external dependency or SaaS account needed to
// start getting parseable, leveled logs out of the app. cPanel/Passenger
// captures stdout/stderr into its own log files, so JSON lines here are
// enough to grep/ingest later — this is a starting point, not a replacement
// for a real error tracker (Sentry or similar), which needs an account this
// audit had no credentials for.
type Level = "info" | "warn" | "error";

function write(level: Level, message: string, context?: Record<string, unknown>) {
  const entry = {
    time: new Date().toISOString(),
    level,
    message,
    ...(context ? { context } : {}),
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => write("info", message, context),
  warn: (message: string, context?: Record<string, unknown>) => write("warn", message, context),
  error: (message: string, error?: unknown, context?: Record<string, unknown>) =>
    write("error", message, {
      ...(error instanceof Error ? { error: error.message, stack: error.stack } : error ? { error } : {}),
      ...context,
    }),
};
