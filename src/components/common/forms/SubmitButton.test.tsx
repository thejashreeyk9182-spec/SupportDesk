
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SubmitButton from "./SubmitButton";

describe("SubmitButton", () => {
  it("renders the button label", () => {
    render(<SubmitButton label="Create Ticket" />);

    expect(
      screen.getByRole("button", { name: "Create Ticket" })
    ).toBeInTheDocument();
  });

  it("renders loading text when loading is true", () => {
    render(
      <SubmitButton
        label="Create Ticket"
        loading
        loadingText="Saving..."
      />
    );

    expect(
      screen.getByRole("button", { name: "Saving..." })
    ).toBeInTheDocument();
  });

  it("disables the button while loading", () => {
    render(<SubmitButton label="Create Ticket" loading />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("disables the button when disabled is true", () => {
    render(<SubmitButton label="Create Ticket" disabled />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("enables the button when loading and disabled are false", () => {
    render(<SubmitButton label="Create Ticket" />);

    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("uses Please wait as the default loading text", () => {
    render(<SubmitButton label="Create Ticket" loading />);

    expect(
      screen.getByRole("button", { name: "Please wait..." })
    ).toBeInTheDocument();
  });

  it("has submit button type", () => {
    render(<SubmitButton label="Create Ticket" />);

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
