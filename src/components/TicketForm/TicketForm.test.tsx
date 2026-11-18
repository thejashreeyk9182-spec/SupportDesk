
import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import TicketForm from "./TicketForm";
import type { Ticket } from "../../types/ticket.types";

const validTicket: Ticket = {
  id: "1",
  customerName: "John Smith",
  email: "john@example.com",
  subject: "Payment issue",
  description: "Unable to complete the payment transaction",
  priority: "High",
  status: "Open",
  createdAt: "2026-11-18",
};

const fillValidForm = () => {
  fireEvent.change(screen.getByPlaceholderText("Enter customer name"), {
    target: { value: "John Smith" },
  });

  fireEvent.change(screen.getByPlaceholderText("Enter email address"), {
    target: { value: "john@example.com" },
  });

  fireEvent.change(screen.getByPlaceholderText("Enter ticket subject"), {
    target: { value: "Payment issue" },
  });

  fireEvent.change(screen.getByPlaceholderText("Enter ticket description"), {
    target: {
      value: "Unable to complete the payment transaction",
    },
  });
};

describe("TicketForm", () => {
  it("renders the create ticket form", () => {
    render(
      <TicketForm
        ticket={null}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("Create New Ticket")).toBeInTheDocument();
  });

  it("renders the edit ticket form with existing values", () => {
    render(
      <TicketForm
        ticket={validTicket}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("Edit Ticket")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter customer name")
    ).toHaveValue("John Smith");
  });

  it("shows validation errors for empty fields", () => {
    render(
      <TicketForm
        ticket={null}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
        onClose={vi.fn()}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Create Ticket" })
    );

    expect(
      screen.getByText("Customer name is required")
    ).toBeInTheDocument();

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Subject is required")).toBeInTheDocument();
    expect(screen.getByText("Description is required")).toBeInTheDocument();
  });

  it("shows an error for an invalid email", () => {
    render(
      <TicketForm
        ticket={null}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
        onClose={vi.fn()}
      />
    );

    fillValidForm();

    fireEvent.change(screen.getByPlaceholderText("Enter email address"), {
      target: { value: "invalid-email" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Create Ticket" })
    );

    expect(
      screen.getByText("Please enter a valid email address")
    ).toBeInTheDocument();
  });

  it("submits valid form data", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <TicketForm
        ticket={null}
        onSubmit={onSubmit}
        onClose={vi.fn()}
      />
    );

    fillValidForm();

    fireEvent.click(
      screen.getByRole("button", { name: "Create Ticket" })
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      customerName: "John Smith",
      email: "john@example.com",
      subject: "Payment issue",
      description: "Unable to complete the payment transaction",
      priority: "Medium",
      status: "Open",
    });
  });

  it("trims whitespace before submitting form data", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <TicketForm
        ticket={null}
        onSubmit={onSubmit}
        onClose={vi.fn()}
      />
    );

    fillValidForm();

    fireEvent.change(screen.getByPlaceholderText("Enter customer name"), {
      target: { value: "  John Smith  " },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Create Ticket" })
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          customerName: "John Smith",
        })
      );
    });
  });

  it("calls onClose when Cancel is clicked", () => {
    const onClose = vi.fn();

    render(
      <TicketForm
        ticket={null}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();

    render(
      <TicketForm
        ticket={null}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Close form" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows an error when submission fails", async () => {
    const onSubmit = vi.fn().mockRejectedValue(
      new Error("Network error")
    );

    render(
      <TicketForm
        ticket={null}
        onSubmit={onSubmit}
        onClose={vi.fn()}
      />
    );

    fillValidForm();

    fireEvent.click(
      screen.getByRole("button", { name: "Create Ticket" })
    );

    expect(
      await screen.findByText(
        "Something went wrong. Please try again."
      )
    ).toBeInTheDocument();
  });

  it("shows saving text while submission is in progress", async () => {
    let resolveSubmit!: () => void;

    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        })
    );

    render(
      <TicketForm
        ticket={null}
        onSubmit={onSubmit}
        onClose={vi.fn()}
      />
    );

    fillValidForm();

    fireEvent.click(
      screen.getByRole("button", { name: "Create Ticket" })
    );

    expect(
      await screen.findByRole("button", { name: "Saving..." })
    ).toBeDisabled();

    resolveSubmit();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Create Ticket" })
      ).toBeEnabled();
    });
  });
});
