
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import DataTable from "./DataTable";
import type { DataTableColumn } from "./DataTable";

interface TestTicket {
  id: string;
  subject: string;
  priority: string;
}

const mockTickets: TestTicket[] = [
  { id: "1", subject: "Login issue", priority: "High" },
  { id: "2", subject: "Payment issue", priority: "Low" },
  { id: "3", subject: "Dashboard issue", priority: "Medium" },
  { id: "4", subject: "Account issue", priority: "High" },
  { id: "5", subject: "Email issue", priority: "Low" },
  { id: "6", subject: "Profile issue", priority: "Medium" },
];

const columns: DataTableColumn<TestTicket>[] = [
  {
    id: "subject",
    header: "Subject",
    render: (ticket) => ticket.subject,
    sortable: true,
    sortValue: (ticket) => ticket.subject,
  },
  {
    id: "priority",
    header: "Priority",
    render: (ticket) => ticket.priority,
    sortable: true,
    sortValue: (ticket) => ticket.priority,
  },
];

describe("DataTable Component", () => {
  it("displays loading message", () => {
    render(
      <DataTable
        data={[]}
        columns={columns}
        getRowId={(ticket) => ticket.id}
        loading
      />
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays empty message when no records exist", () => {
    render(
      <DataTable
        data={[]}
        columns={columns}
        getRowId={(ticket) => ticket.id}
        emptyMessage="No tickets found"
      />
    );

    expect(screen.getByText("No tickets found")).toBeInTheDocument();
  });

  it("renders table rows correctly", () => {
    render(
      <DataTable
        data={mockTickets}
        columns={columns}
        getRowId={(ticket) => ticket.id}
        pagination={false}
      />
    );

    expect(screen.getByText("Login issue")).toBeInTheDocument();
    expect(screen.getByText("Payment issue")).toBeInTheDocument();
    expect(screen.getByText("Dashboard issue")).toBeInTheDocument();
  });

  it("sorts records in ascending order", () => {
    render(
      <DataTable
        data={mockTickets}
        columns={columns}
        getRowId={(ticket) => ticket.id}
        pagination={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /subject/i }));

    const rows = screen.getAllByRole("row");

    expect(rows[1]).toHaveTextContent("Account issue");
    expect(rows[2]).toHaveTextContent("Dashboard issue");
  });

  it("sorts records in descending order", () => {
    render(
      <DataTable
        data={mockTickets}
        columns={columns}
        getRowId={(ticket) => ticket.id}
        pagination={false}
      />
    );

    const subjectHeader = screen.getByRole("button", {
      name: /subject/i,
    });

    fireEvent.click(subjectHeader);
    fireEvent.click(subjectHeader);

    const rows = screen.getAllByRole("row");

  expect(rows[1]).toHaveTextContent("Profile issue");
  });

  it("does not sort a non-sortable column", () => {
    const nonSortableColumns: DataTableColumn<TestTicket>[] = [
      {
        id: "subject",
        header: "Subject",
        render: (ticket) => ticket.subject,
      },
    ];

    render(
      <DataTable
        data={mockTickets}
        columns={nonSortableColumns}
        getRowId={(ticket) => ticket.id}
        pagination={false}
      />
    );

    const subjectHeader = screen.getByRole("button", {
      name: /subject/i,
    });

    expect(subjectHeader).toBeDisabled();
  });

  it("displays pagination when records exceed page size", () => {
    render(
      <DataTable
        data={mockTickets}
        columns={columns}
        getRowId={(ticket) => ticket.id}
        pageSize={5}
      />
    );

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(screen.getByText("Login issue")).toBeInTheDocument();
    expect(screen.queryByText("Profile issue")).not.toBeInTheDocument();
  });

  it("moves to the next page when Next is clicked", () => {
    render(
      <DataTable
        data={mockTickets}
        columns={columns}
        getRowId={(ticket) => ticket.id}
        pageSize={5}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(screen.getByText("Profile issue")).toBeInTheDocument();
  });

  it("moves to the previous page when Previous is clicked", () => {
    render(
      <DataTable
        data={mockTickets}
        columns={columns}
        getRowId={(ticket) => ticket.id}
        pageSize={5}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    fireEvent.click(screen.getByRole("button", { name: /previous/i }));

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  });

  it("renders custom cell content", () => {
    const customColumns: DataTableColumn<TestTicket>[] = [
      {
        id: "subject",
        header: "Subject",
        render: (ticket) => (
          <strong>Ticket: {ticket.subject}</strong>
        ),
      },
    ];

    render(
      <DataTable
        data={mockTickets}
        columns={customColumns}
        getRowId={(ticket) => ticket.id}
        pagination={false}
      />
    );

    expect(screen.getByText("Ticket: Login issue")).toBeInTheDocument();
  });

  it("renders row actions", () => {
    render(
      <DataTable
        data={mockTickets}
        columns={columns}
        getRowId={(ticket) => ticket.id}
        renderActions={(ticket) => (
          <button type="button">Edit {ticket.id}</button>
        )}
        pagination={false}
      />
    );

    expect(
      screen.getByRole("button", { name: "Edit 1" })
    ).toBeInTheDocument();
  });

  it("calls onSelectionChange when a row is selected", () => {
    const onSelectionChange = vi.fn();

    render(
      <DataTable
        data={mockTickets}
        columns={columns}
        getRowId={(ticket) => ticket.id}
        selectable
        onSelectionChange={onSelectionChange}
        pagination={false}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");

    fireEvent.click(checkboxes[1]);

    expect(onSelectionChange).toHaveBeenCalledWith(["1"]);
  });

  it("selects all visible rows", () => {
    const onSelectionChange = vi.fn();

    render(
      <DataTable
        data={mockTickets}
        columns={columns}
        getRowId={(ticket) => ticket.id}
        selectable
        onSelectionChange={onSelectionChange}
        pagination={false}
      />
    );

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: /select all rows/i,
      })
    );

    expect(onSelectionChange).toHaveBeenCalledWith([
      "1", "2", "3", "4", "5", "6",
    ]);
  });
});

