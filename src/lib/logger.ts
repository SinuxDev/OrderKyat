const isDev = process.env.NODE_ENV === "development";

export const logger = {
  /**
   * Log errors only in development. In production, wire this up to an
   * external service (e.g. Sentry) instead of leaking stack traces.
   */
  error: (message: string, error?: unknown): void => {
    if (isDev) {
      console.error(`[OrderKyat] ${message}`, error ?? "");
    }
  },
};
