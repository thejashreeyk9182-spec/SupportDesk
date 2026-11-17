
import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { recordApiRequest } from "../../monitoring/apiMonitor";

export interface ApiError {
  status: FetchBaseQueryError["status"];
  message: string;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

const MAX_RETRIES = 2;

const shouldRetry = (error: FetchBaseQueryError): boolean => {
  const status = error.status;

  return (
    status === "FETCH_ERROR" ||
    status === "TIMEOUT_ERROR" ||
    (typeof status === "number" && status >= 500)
  );
};

const getErrorMessage = (error: FetchBaseQueryError): string => {
  if (error.status === "FETCH_ERROR") {
    return "Network error. Please check your internet connection.";
  }

  if (error.status === "TIMEOUT_ERROR") {
    return "Request timed out. Please try again.";
  }

  if (error.status === "PARSING_ERROR") {
    return "Invalid response received from the server.";
  }

  if (error.status === "CUSTOM_ERROR") {
    return "Something went wrong. Please try again.";
  }

  switch (error.status) {
    case 400:
      return "Invalid request. Please check your input.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return "A conflict occurred. Please try again.";
    case 422:
      return "Please check the submitted information.";
    case 500:
      return "Internal server error. Please try again later.";
    case 503:
      return "Service is temporarily unavailable.";
    default:
      return "Something went wrong. Please try again.";
  }
};

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  ApiError
> = async (args, api, extraOptions) => {
  const method =
    typeof args === "string"
      ? "GET"
      : (args.method ?? "GET").toUpperCase();

  const rawEndpoint = typeof args === "string" ? args : args.url;
  const endpoint = rawEndpoint.split("?")[0];

  const startTime = Date.now();

  let result = await rawBaseQuery(args, api, extraOptions);
  let retryCount = 0;

  while (
    method === "GET" &&
    result.error &&
    shouldRetry(result.error) &&
    retryCount < MAX_RETRIES
  ) {
    retryCount++;
    result = await rawBaseQuery(args, api, extraOptions);
  }

  const duration = Date.now() - startTime;

  if (result.error) {
    const message = getErrorMessage(result.error);

    recordApiRequest({
      id: `${Date.now()}-${Math.random()}`,
      endpoint,
      method,
      status: result.error.status,
      duration,
      success: false,
      timestamp: new Date().toISOString(),
      errorMessage: message,
    });

    if (
      result.error.status === 401 &&
      typeof window !== "undefined"
    ) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    return {
      error: {
        status: result.error.status,
        message,
      },
    };
  }

  recordApiRequest({
    id: `${Date.now()}-${Math.random()}`,
    endpoint,
    method,
    status: result.meta?.response?.status ?? 200,
    duration,
    success: true,
    timestamp: new Date().toISOString(),
  });

  return {
    data: result.data,
  };
};
