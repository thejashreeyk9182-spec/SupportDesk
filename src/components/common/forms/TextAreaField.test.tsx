
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TextAreaField from "./TextAreaField";

describe("TextAreaField", () => {
  it("renders the label", () => {
    render(
      <TextAreaField
        id="description"
        name="description"
        label="Description"
        value=""
        onChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("displays the entered value", () => {
    render(
      <TextAreaField
        id="description"
        name="description"
        label="Description"
        value="Payment issue"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("textbox")).toHaveValue("Payment issue");
  });

  it("marks the field as required", () => {
    render(
      <TextAreaField
        id="description"
        name="description"
        label="Description"
        value=""
        required
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("textbox")).toBeRequired();
  });

  it("disables the textarea", () => {
    render(
      <TextAreaField
        id="description"
        name="description"
        label="Description"
        value=""
        disabled
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("displays the error message", () => {
    render(
      <TextAreaField
        id="description"
        name="description"
        label="Description"
        value=""
        error="Description is required"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText("Description is required")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("calls onChange when the value changes", () => {
    const handleChange = vi.fn();

    render(
      <TextAreaField
        id="description"
        name="description"
        label="Description"
        value=""
        onChange={handleChange}
      />
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Unable to login" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
