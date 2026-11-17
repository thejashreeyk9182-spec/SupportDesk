
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { ApiMetric } from "./apiMonitor";

let monitor: typeof import("./apiMonitor");

const createMetric = (
  id: string,
  overrides: Partial<ApiMetric> = {}
): ApiMetric => ({
  id,
  endpoint: "/api/tickets",
  method: "GET",
  status: 200,
  duration: 100,
  success: true,
  timestamp: new Date().toISOString(),
  ...overrides,
});

beforeEach(async () => {
  vi.resetModules();
  monitor = await import("./apiMonitor");
});

describe("API Monitor", () => {
  it("should return an empty list initially", () => {
    expect(monitor.getApiMetrics()).toEqual([]);
  });

  it("should record API requests", () => {
    const metric = createMetric("1");

    monitor.recordApiRequest(metric);

    expect(monitor.getApiMetrics()).toHaveLength(1);
    expect(monitor.getApiMetrics()[0]).toEqual(metric);
  });

  it("should keep only the latest 100 records", () => {
    for (let i = 1; i <= 105; i++) {
      monitor.recordApiRequest(createMetric(String(i)));
    }

    const metrics = monitor.getApiMetrics();

    expect(metrics).toHaveLength(100);
    expect(metrics[0].id).toBe("105");
    expect(metrics[99].id).toBe("6");
  });

  it("should calculate API request summary correctly", () => {
    monitor.recordApiRequest(createMetric("1", {
      duration: 100,
      success: true,
    }));

    monitor.recordApiRequest(createMetric("2", {
      duration: 200,
      success: false,
      status: 500,
    }));

    const summary = monitor.getApiSummary();

    expect(summary.total).toBe(2);
    expect(summary.successful).toBe(1);
    expect(summary.failed).toBe(1);
    expect(summary.averageDuration).toBe(150);
  });

  it("should notify subscribers when a request is recorded", () => {
    const listener = vi.fn();

    const unsubscribe =
      monitor.subscribeToApiMetrics(listener);

    monitor.recordApiRequest(createMetric("1"));

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith([
      expect.objectContaining({ id: "1" }),
    ]);

    unsubscribe();

    monitor.recordApiRequest(createMetric("2"));

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
