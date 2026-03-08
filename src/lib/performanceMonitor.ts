import { logger } from "@/lib/logger";

export const measurePerformance = (label: string) => {
  if (typeof window !== "undefined" && "performance" in window) {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    logger.error(`[Performance - ${label}] domContentLoaded=${
      navigation.domContentLoadedEventEnd -
      navigation.domContentLoadedEventStart
    }ms loadComplete=${
      navigation.loadEventEnd - navigation.loadEventStart
    }ms totalTime=${navigation.loadEventEnd - navigation.fetchStart}ms`);
  }
};
