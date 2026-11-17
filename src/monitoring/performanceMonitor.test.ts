
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

let monitor: typeof import("./performanceMonitor");

beforeEach(async () => {
  vi.resetModules();
  monitor = await import("./performanceMonitor");
});

describe("Performance Monitor", () => {
  it("should return an empty list initially", () => {
    expect(monitor.getPerformanceMetrics()).toEqual([]);
  });

  it("should measure performance duration", () => {
    const startTime = performance.now() - 100;

    const metric = monitor.measurePerformance(
      "Test Operation",
      startTime
    );

    expect(metric.name).toBe("Test Operation");
    expect(metric.duration).toBeGreaterThanOrEqual(100);
    expect(metric.timestamp).toBeDefined();
  });

  it("should record manual performance measurements", () => {
    monitor.measurePerformance("API Loading", performance.now() - 50);

    expect(monitor.getPerformanceMetrics()).toHaveLength(1);
    expect(monitor.getPerformanceMetrics()[0].name).toBe(
      "API Loading"
    );
  });

  it("should keep only the latest 100 metrics", () => {
    for (let i = 1; i <= 105; i++) {
      monitor.measurePerformance(
        `Operation ${i}`,
        performance.now() - i
      );
    }

    const metrics = monitor.getPerformanceMetrics();

    expect(metrics).toHaveLength(100);
    expect(metrics[0].name).toBe("Operation 105");
  });

  it("should notify subscribers when a metric is recorded", () => {
    const listener = vi.fn();

    const unsubscribe =
      monitor.subscribeToPerformanceMetrics(listener);

    monitor.measurePerformance(
      "Dashboard Loading",
      performance.now() - 100
    );

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith([
      expect.objectContaining({
        name: "Dashboard Loading",
      }),
    ]);

    unsubscribe();

    monitor.measurePerformance(
      "Another Operation",
      performance.now() - 50
    );

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("should return a valid start time", () => {
    const startTime = monitor.startPerformanceMeasurement();

    expect(typeof startTime).toBe("number");
    expect(startTime).toBeGreaterThan(0);
  });
});
