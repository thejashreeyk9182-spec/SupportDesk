import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";


import ErrorBoundary from "./ErrorBoundary";

const BrokenComponent = () => {
  throw new Error("Test rendering error");
};

describe("ErrorBoundary", () => {
  it("should display fallback UI when component crashes", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();

    expect(
      screen.getByText("Something went wrong!")
    ).toBeInTheDocument();

    vi.restoreAllMocks();
  });

  it("should render normal content when there is no error", () => {
    render(
      <ErrorBoundary>
        <h1>SupportDesk Dashboard</h1>
      </ErrorBoundary>
    );

    expect(
      screen.getByText("SupportDesk Dashboard")
    ).toBeInTheDocument();
  });
});