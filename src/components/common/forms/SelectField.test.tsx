
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SelectField from "./SelectField";

const options = [
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

describe("SelectField", () => {
  it("renders the label", () => {
    render(
      <SelectField
        id="priority"
        name="priority"
        label="Priority"
        value="Medium"
        options={options}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Priority")).toBeInTheDocument();
  });

  it("renders all dropdown options", () => {
    render(
      <SelectField
        id="priority"
        name="priority"
        label="Priority"
        value="Medium"
        options={options}
        onChange={vi.fn()}
      />
    );

    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("displays the selected value", () => {
    render(
      <SelectField
        id="priority"
        name="priority"
        label="Priority"
        value="High"
        options={options}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("combobox")).toHaveValue("High");
  });

  it("marks the dropdown as required", () => {
    render(
      <SelectField
        id="priority"
        name="priority"
        label="Priority"
        value="Medium"
        options={options}
        required
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("combobox")).toBeRequired();
  });

  it("disables the dropdown", () => {
    render(
      <SelectField
        id="priority"
        name="priority"
        label="Priority"
        value="Medium"
        options={options}
        disabled
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("calls onChange when the selection changes", () => {
    const handleChange = vi.fn();

    render(
      <SelectField
        id="priority"
        name="priority"
        label="Priority"
        value="Medium"
        options={options}
        onChange={handleChange}
      />
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "High" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
