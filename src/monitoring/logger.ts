
type LogLevel = "info" | "warn" | "error" | "debug";

type LogContext = Record<string, unknown>;

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
}

const isDevelopment = import.meta.env.DEV;

const writeLog = (
  level: LogLevel,
  message: string,
  context?: LogContext
) => {
  // Debug logs are disabled in production.
  if (level === "debug" && !isDevelopment) {
    return;
  }

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context ? { context } : {}),
  };

  switch (level) {
    case "info":
      console.info("[INFO]", entry);
      break;

    case "warn":
      console.warn("[WARN]", entry);
      break;

    case "error":
      console.error("[ERROR]", entry);
      break;

    case "debug":
      console.debug("[DEBUG]", entry);
      break;
  }
};

export const logger = {
  info: (message: string, context?: LogContext) =>
    writeLog("info", message, context),

  warn: (message: string, context?: LogContext) =>
    writeLog("warn", message, context),

  error: (message: string, context?: LogContext) =>
    writeLog("error", message, context),

  debug: (message: string, context?: LogContext) =>
    writeLog("debug", message, context),
};
