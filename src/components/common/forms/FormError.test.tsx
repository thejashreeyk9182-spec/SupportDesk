
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FormError from "./FormError";

describe("FormError", () => {
  it("renders the error message", () => {
    render(<FormError message="Something went wrong" />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("does not render when the message is empty", () => {
    const { container } = render(<FormError message="" />);

    expect(container.firstChild).toBeNull();
  });

  it("renders the correct error text", () => {
    render(<FormError message="Please enter a valid email" />);

    expect(
      screen.getByText("Please enter a valid email")
    ).toBeInTheDocument();
  });

  it("has alert role for accessibility", () => {
    render(<FormError message="Invalid input" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
