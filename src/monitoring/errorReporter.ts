
import { logger } from "./logger";

export interface ReportedError {
  id: string;
  message: string;
  source: string;
  timestamp: string;
}

const reportedErrors: ReportedError[] = [];

const listeners = new Set<
  (errors: ReportedError[]) => void
>();

const MAX_ERRORS = 100;

const notifyListeners = () => {
  const snapshot = [...reportedErrors];

  listeners.forEach((listener) => listener(snapshot));
};

export const reportError = (
  error: unknown,
  source: string
): ReportedError => {
  const message =
    error instanceof Error
      ? error.message
      : "An unexpected error occurred";

  const reportedError: ReportedError = {
    id: crypto.randomUUID(),
    message,
    source,
    timestamp: new Date().toISOString(),
  };

  reportedErrors.unshift(reportedError);

  if (reportedErrors.length > MAX_ERRORS) {
    reportedErrors.pop();
  }

  logger.error("Application error reported", {
    message,
    source,
  });

  notifyListeners();

  return reportedError;
};

export const getReportedErrors = (): ReportedError[] => {
  return [...reportedErrors];
};

export const subscribeToReportedErrors = (
  listener: (errors: ReportedError[]) => void
) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};
