
import { reportError } from "./errorReporter";
import { logger } from "./logger";

let isRegistered = false;

const handleWindowError = (event: ErrorEvent) => {
  reportError(
    event.error ?? event.message,
    "Global JavaScript Error"
  );

  logger.error("Uncaught JavaScript error", {
    message: event.message,
    filename: event.filename,
    line: event.lineno,
    column: event.colno,
  });
};

const handleUnhandledRejection = (
  event: PromiseRejectionEvent
) => {
  reportError(
    event.reason,
    "Unhandled Promise Rejection"
  );
};

export const registerGlobalErrorHandlers = () => {
  if (
    isRegistered ||
    typeof window === "undefined"
  ) {
    return;
  }

  window.addEventListener("error", handleWindowError);

  window.addEventListener(
    "unhandledrejection",
    handleUnhandledRejection
  );

  isRegistered = true;

  logger.info("Global error handlers registered");
};

export const unregisterGlobalErrorHandlers = () => {
  if (
    !isRegistered ||
    typeof window === "undefined"
  ) {
    return;
  }

  window.removeEventListener("error", handleWindowError);

  window.removeEventListener(
    "unhandledrejection",
    handleUnhandledRejection
  );

  isRegistered = false;

  logger.info("Global error handlers unregistered");
};
