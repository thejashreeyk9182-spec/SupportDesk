
import { logger } from "./logger";

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: string;
}

const performanceMetrics: PerformanceMetric[] = [];

export const measurePerformance = (
  name: string,
  startTime: number
): PerformanceMetric => {
  const duration = Number(
    (performance.now() - startTime).toFixed(2)
  );

  const metric: PerformanceMetric = {
    name,
    duration,
    timestamp: new Date().toISOString(),
  };

  performanceMetrics.unshift(metric);

  // Keep only the latest 100 measurements.
  if (performanceMetrics.length > 100) {
    performanceMetrics.pop();
  }

  logger.info("Performance measured", {
    name,
    duration,
  });

  return metric;
};

export const getPerformanceMetrics = (): PerformanceMetric[] => {
  return [...performanceMetrics];
};

export const startPerformanceMeasurement = (): number => {
  return performance.now();
};
