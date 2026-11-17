
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import {
  registerGlobalErrorHandlers,
  unregisterGlobalErrorHandlers,
} from "./globalErrorHandler";

import { reportError } from "./errorReporter";

vi.mock("./errorReporter", () => ({
  reportError: vi.fn(),
}));

vi.mock("./logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe("Global Error Handler", () => {
  beforeEach(() => {
    unregisterGlobalErrorHandlers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    unregisterGlobalErrorHandlers();
  });

  it("should register global error handlers only once", () => {
    const addEventListenerSpy = vi.spyOn(
      window,
      "addEventListener"
    );

    registerGlobalErrorHandlers();
    registerGlobalErrorHandlers();

    const errorRegistrations = addEventListenerSpy.mock.calls.filter(
      ([eventName]) => eventName === "error"
    );

    const rejectionRegistrations = addEventListenerSpy.mock.calls.filter(
      ([eventName]) => eventName === "unhandledrejection"
    );

    expect(errorRegistrations).toHaveLength(1);
    expect(rejectionRegistrations).toHaveLength(1);

    addEventListenerSpy.mockRestore();
  });

  it("should report JavaScript errors", () => {
    registerGlobalErrorHandlers();

    const error = new Error("Something went wrong");

    window.dispatchEvent(
      new ErrorEvent("error", {
        message: error.message,
        error,
      })
    );

    expect(reportError).toHaveBeenCalledWith(
      error,
      "Global JavaScript Error"
    );
  });

  it("should report unhandled promise rejections", () => {
    registerGlobalErrorHandlers();

    const reason = new Error("Promise failed");

    const event = new Event("unhandledrejection");

    Object.defineProperty(event, "reason", {
      value: reason,
    });

    window.dispatchEvent(event);

    expect(reportError).toHaveBeenCalledWith(
      reason,
      "Unhandled Promise Rejection"
    );
  });

  it("should unregister global error handlers", () => {
    const removeEventListenerSpy = vi.spyOn(
      window,
      "removeEventListener"
    );

    registerGlobalErrorHandlers();
    unregisterGlobalErrorHandlers();

    const errorRemoval = removeEventListenerSpy.mock.calls.some(
      ([eventName]) => eventName === "error"
    );

    const rejectionRemoval = removeEventListenerSpy.mock.calls.some(
      ([eventName]) => eventName === "unhandledrejection"
    );

    expect(errorRemoval).toBe(true);
    expect(rejectionRemoval).toBe(true);

    removeEventListenerSpy.mockRestore();
  });
});
