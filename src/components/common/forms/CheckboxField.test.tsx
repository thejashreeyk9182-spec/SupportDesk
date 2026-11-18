
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CheckboxField from "./CheckboxField";

describe("CheckboxField", () => {
  it("renders the label", () => {
    render(
      <CheckboxField
        id="terms"
        name="terms"
        label="Accept Terms"
        checked={false}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Accept Terms")).toBeInTheDocument();
  });

  it("displays the checked state", () => {
    render(
      <CheckboxField
        id="terms"
        name="terms"
        label="Accept Terms"
        checked
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("displays the unchecked state", () => {
    render(
      <CheckboxField
        id="terms"
        name="terms"
        label="Accept Terms"
        checked={false}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("disables the checkbox", () => {
    render(
      <CheckboxField
        id="terms"
        name="terms"
        label="Accept Terms"
        checked={false}
        disabled
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("marks the checkbox as required", () => {
    render(
      <CheckboxField
        id="terms"
        name="terms"
        label="Accept Terms"
        checked={false}
        required
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("checkbox")).toBeRequired();
  });

  it("calls onChange when checkbox is clicked", () => {
    const handleChange = vi.fn();

    render(
      <CheckboxField
        id="terms"
        name="terms"
        label="Accept Terms"
        checked={false}
        onChange={handleChange}
      />
    );

    fireEvent.click(screen.getByRole("checkbox"));

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
