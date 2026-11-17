
export interface ApiMetric {
  id: string;
  endpoint: string;
  method: string;
  status: number | string;
  duration: number;
  success: boolean;
  timestamp: string;
  errorMessage?: string;
}

const MAX_RECORDS = 100;

let apiMetrics: ApiMetric[] = [];

type ApiMetricListener = (metrics: ApiMetric[]) => void;

const listeners = new Set<ApiMetricListener>();

const notifyListeners = () => {
  const snapshot = [...apiMetrics];

  listeners.forEach((listener) => {
    listener(snapshot);
  });
};

export const recordApiRequest = (metric: ApiMetric) => {
  apiMetrics = [metric, ...apiMetrics].slice(0, MAX_RECORDS);

  notifyListeners();
};

export const getApiMetrics = (): ApiMetric[] => {
  return [...apiMetrics];
};

export const subscribeToApiMetrics = (
  listener: ApiMetricListener
) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const getApiSummary = () => {
  const total = apiMetrics.length;

  const successful = apiMetrics.filter(
    (item) => item.success
  ).length;

  const failed = total - successful;

  const averageDuration =
    total > 0
      ? apiMetrics.reduce(
          (sum, item) => sum + item.duration,
          0
        ) / total
      : 0;

  return {
    total,
    successful,
    failed,
    averageDuration: Number(averageDuration.toFixed(2)),
  };
};
