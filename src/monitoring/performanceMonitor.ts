
import { logger } from "./logger";

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: string;
  unit?: "ms" | "score";
}

const MAX_RECORDS = 100;

const performanceMetrics: PerformanceMetric[] = [];

type PerformanceMetricListener = (
  metrics: PerformanceMetric[]
) => void;

const listeners = new Set<PerformanceMetricListener>();

let observers: PerformanceObserver[] = [];
let monitoringStarted = false;

const notifyListeners = () => {
  const snapshot = [...performanceMetrics];

  listeners.forEach((listener) => {
    listener(snapshot);
  });
};

const recordMetric = (
  name: string,
  value: number,
  unit: "ms" | "score" = "ms"
) => {
  const metric: PerformanceMetric = {
    name,
    duration: Number(value.toFixed(2)),
    timestamp: new Date().toISOString(),
    unit,
  };

  // Update an existing metric instead of creating duplicates.
  const existingIndex = performanceMetrics.findIndex(
    (item) => item.name === name
  );

  if (existingIndex !== -1) {
    performanceMetrics.splice(existingIndex, 1);
  }

  performanceMetrics.unshift(metric);

  if (performanceMetrics.length > MAX_RECORDS) {
    performanceMetrics.pop();
  }

  logger.info("Performance metric recorded", {
    name,
    value: metric.duration,
    unit,
  });

  notifyListeners();

  return metric;
};

export const measurePerformance = (
  name: string,
  startTime: number
): PerformanceMetric => {
  const duration = performance.now() - startTime;

  return recordMetric(name, duration);
};

export const getPerformanceMetrics = (): PerformanceMetric[] => {
  return [...performanceMetrics];
};

export const startPerformanceMeasurement = (): number => {
  return performance.now();
};

export const subscribeToPerformanceMetrics = (
  listener: PerformanceMetricListener
) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const observeEntries = (
  type: string,
  callback: (entry: PerformanceEntry) => void
) => {
  if (
    typeof PerformanceObserver === "undefined" ||
    !PerformanceObserver.supportedEntryTypes?.includes(type)
  ) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(callback);
    });

    observer.observe({
      type,
      buffered: true,
    });

    observers.push(observer);
  } catch (error) {
    logger.warn("Performance observer unavailable", { type });
  }
};

export const startPerformanceMonitoring = () => {
  if (
    monitoringStarted ||
    typeof window === "undefined" ||
    typeof performance === "undefined"
  ) {
    return;
  }

  monitoringStarted = true;

  // Navigation Timing: Time to First Byte.
  const navigation = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming | undefined;

  if (navigation) {
    recordMetric(
      "TTFB",
      navigation.responseStart - navigation.requestStart
    );
  }

  // First Contentful Paint.
  observeEntries("paint", (entry) => {
    if (entry.name === "first-contentful-paint") {
      recordMetric("FCP", entry.startTime);
    }
  });

  // Largest Contentful Paint.
  observeEntries("largest-contentful-paint", (entry) => {
    recordMetric("LCP", entry.startTime);
  });

  // Cumulative Layout Shift.
  let cumulativeLayoutShift = 0;

  observeEntries("layout-shift", (entry) => {
    const shift = entry as PerformanceEntry & {
      value: number;
      hadRecentInput: boolean;
    };

    if (!shift.hadRecentInput) {
      cumulativeLayoutShift += shift.value;

      recordMetric(
        "CLS",
        cumulativeLayoutShift,
        "score"
      );
    }
  });

  // INP session estimate: maximum observed interaction duration.
  let maximumInteractionDuration = 0;

  observeEntries("event", (entry) => {
    const interaction = entry as PerformanceEntry & {
      duration: number;
    };

    maximumInteractionDuration = Math.max(
      maximumInteractionDuration,
      interaction.duration
    );

    recordMetric(
      "INP (session estimate)",
      maximumInteractionDuration
    );
  });

  logger.info("Performance monitoring started");
};

export const stopPerformanceMonitoring = () => {
  observers.forEach((observer) => observer.disconnect());

  observers = [];
  monitoringStarted = false;

  logger.info("Performance monitoring stopped");
};
