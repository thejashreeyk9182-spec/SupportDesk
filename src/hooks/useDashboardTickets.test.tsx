
import { describe, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import useDashboardTickets from "./useDashboardTickets";
import type { Ticket } from "../features/tickets/ticket.types";

const mockTickets = [
  {
    id: "1",
    status: "Open",
  },
  {
    id: "2",
    status: "In Progress",
  },
] as Ticket[];

const createProps = () => ({
  tickets: mockTickets,
  bulkUpdateStatus: vi.fn().mockResolvedValue({
    updatedIds: ["1", "2"],
    failedIds: [],
  }),
  canUpdateStatus: true,
  isBulkUpdating: false,
});

describe("useDashboardTickets", () => {
  it("should initialize with an empty selection", () => {
    const { result } = renderHook(() =>
      useDashboardTickets(createProps())
    );

    expect(result.current.selectedTicketIds).toEqual([]);
    expect(result.current.bulkStatus).toBe("In Progress");
    expect(result.current.bulkMessage).toBe("");
    expect(result.current.bulkError).toBe("");
  });

  it("should select and deselect a ticket", () => {
    const { result } = renderHook(() =>
      useDashboardTickets(createProps())
    );

    act(() => {
      result.current.handleSelectTicket("1");
    });

    expect(result.current.selectedTicketIds).toEqual(["1"]);

    act(() => {
      result.current.handleSelectTicket("1");
    });

    expect(result.current.selectedTicketIds).toEqual([]);
  });

  it("should select all current page tickets", () => {
    const { result } = renderHook(() =>
      useDashboardTickets(createProps())
    );

    act(() => {
      result.current.handleSelectAll();
    });

    expect(result.current.selectedTicketIds).toEqual(["1", "2"]);
    expect(result.current.allCurrentPageSelected).toBe(true);
  });

  it("should clear all selected tickets", () => {
    const { result } = renderHook(() =>
      useDashboardTickets(createProps())
    );

    act(() => {
      result.current.handleSelectAll();
    });

    act(() => {
      result.current.handleClearSelection();
    });

    expect(result.current.selectedTicketIds).toEqual([]);
  });

  it("should remove a deleted ticket from selection", () => {
    const { result } = renderHook(() =>
      useDashboardTickets(createProps())
    );

    act(() => {
      result.current.handleSelectAll();
    });

    act(() => {
      result.current.removeSelectedTicket("1");
    });

    expect(result.current.selectedTicketIds).toEqual(["2"]);
  });

  it("should update the bulk status", () => {
    const { result } = renderHook(() =>
      useDashboardTickets(createProps())
    );

    act(() => {
      result.current.setBulkStatus("Resolved");
    });

    expect(result.current.bulkStatus).toBe("Resolved");
  });

  it("should update selected tickets successfully", async () => {
    const props = createProps();

    const { result } = renderHook(() =>
      useDashboardTickets(props)
    );

    act(() => {
      result.current.handleSelectAll();
    });

    await act(async () => {
      await result.current.handleBulkStatusUpdate();
    });

    expect(props.bulkUpdateStatus).toHaveBeenCalledWith(
      ["1", "2"],
      "In Progress"
    );

    expect(result.current.selectedTicketIds).toEqual([]);
    expect(result.current.bulkMessage).toContain(
      "updated successfully"
    );
  });

  it("should keep failed tickets selected", async () => {
    const props = createProps();

    props.bulkUpdateStatus.mockResolvedValue({
      updatedIds: ["1"],
      failedIds: ["2"],
    });

    const { result } = renderHook(() =>
      useDashboardTickets(props)
    );

    act(() => {
      result.current.handleSelectAll();
    });

    await act(async () => {
      await result.current.handleBulkStatusUpdate();
    });

    expect(result.current.selectedTicketIds).toEqual(["2"]);
    expect(result.current.bulkMessage).toContain("1 ticket(s) updated");
    expect(result.current.bulkMessage).toContain("1 failed");
  });

  it("should not update when permission is denied", async () => {
    const props = {
      ...createProps(),
      canUpdateStatus: false,
    };

    const { result } = renderHook(() =>
      useDashboardTickets(props)
    );

    act(() => {
      result.current.handleSelectAll();
    });

    await act(async () => {
      await result.current.handleBulkStatusUpdate();
    });

    expect(props.bulkUpdateStatus).not.toHaveBeenCalled();
  });

  it("should handle bulk update failure", async () => {
    const props = createProps();

    props.bulkUpdateStatus.mockRejectedValue(
      new Error("Network error")
    );

    const { result } = renderHook(() =>
      useDashboardTickets(props)
    );

    act(() => {
      result.current.handleSelectAll();
    });

    await act(async () => {
      await result.current.handleBulkStatusUpdate();
    });

    expect(result.current.bulkError).toBe(
      "Unable to update selected tickets. Please try again."
    );
  });
});
