
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import InputField from "./InputField";

describe("InputField", () => {
  it("renders the label", () => {
    render(
      <InputField
        id="name"
        name="name"
        label="Customer Name"
        value=""
        onChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Customer Name")).toBeInTheDocument();
  });

  it("displays the input value", () => {
    render(
      <InputField
        id="name"
        name="name"
        label="Customer Name"
        value="Theja"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByDisplayValue("Theja")).toBeInTheDocument();
  });

  it("marks the input as required", () => {
    render(
      <InputField
        id="name"
        name="name"
        label="Customer Name"
        value=""
        required
        onChange={vi.fn()}
      />
    );
expect(screen.getByRole("textbox")).toBeRequired();
  });

  it("disables the input", () => {
    render(
      <InputField
        id="name"
        name="name"
        label="Customer Name"
        value=""
        disabled
        onChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Customer Name")).toBeDisabled();
  });

  it("displays an error message", () => {
    render(
      <InputField
        id="email"
        name="email"
        label="Email"
        value=""
        error="Email is required"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it("calls onChange when the user types", () => {
    const handleChange = vi.fn();

    render(
      <InputField
        id="name"
        name="name"
        label="Customer Name"
        value=""
        onChange={handleChange}
      />
    );

    fireEvent.change(screen.getByLabelText("Customer Name"), {
      target: { value: "Theja" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
