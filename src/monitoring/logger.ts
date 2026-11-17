
type LogLevel = "info" | "warn" | "error" | "debug";

type LogContext = Record<string, unknown>;

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
}

const isDevelopment = import.meta.env.DEV;

const SENSITIVE_KEY_PATTERN =
  /password|token|authorization|cookie|secret|api[-_]?key/i;

const sanitizeValue = (
  value: unknown,
  seen = new WeakSet<object>()
): unknown => {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
    };
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (seen.has(value)) {
    return "[Circular]";
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, seen));
  }

  const sanitized: Record<string, unknown> = {};

  Object.entries(value).forEach(([key, item]) => {
    sanitized[key] = SENSITIVE_KEY_PATTERN.test(key)
      ? "[REDACTED]"
      : sanitizeValue(item, seen);
  });

  return sanitized;
};

const writeLog = (
  level: LogLevel,
  message: string,
  context?: LogContext
) => {
  if (level === "debug" && !isDevelopment) {
    return;
  }

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context
      ? { context: sanitizeValue(context) as LogContext }
      : {}),
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
