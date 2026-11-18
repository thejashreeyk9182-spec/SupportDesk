
import { useState } from "react";
import type { Ticket } from "../features/tickets/ticket.types";

interface UseDashboardTicketsProps {
  tickets: Ticket[];
  bulkUpdateStatus: (
    ids: string[],
    status: Ticket["status"]
  ) => Promise<{
    updatedIds: string[];
    failedIds: string[];
  }>;
  canUpdateStatus: boolean;
  isBulkUpdating: boolean;
}

const useDashboardTickets = ({
  tickets,
  bulkUpdateStatus,
  canUpdateStatus,
  isBulkUpdating,
}: UseDashboardTicketsProps) => {
  const [selectedTicketIds, setSelectedTicketIds] =
    useState<string[]>([]);

  const [bulkStatus, setBulkStatus] =
    useState<Ticket["status"]>("In Progress");

  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkError, setBulkError] = useState("");

  const clearMessages = () => {
    setBulkMessage("");
    setBulkError("");
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketIds((previous) =>
      previous.includes(ticketId)
        ? previous.filter((id) => id !== ticketId)
        : [...previous, ticketId]
    );

    clearMessages();
  };

  const handleSelectAll = () => {
    const currentPageIds = tickets.map((ticket) => ticket.id);

    const allSelected =
      currentPageIds.length > 0 &&
      currentPageIds.every((id) =>
        selectedTicketIds.includes(id)
      );

    setSelectedTicketIds((previous) =>
      allSelected
        ? previous.filter((id) => !currentPageIds.includes(id))
        : Array.from(new Set([...previous, ...currentPageIds]))
    );

    clearMessages();
  };

  const handleClearSelection = () => {
    setSelectedTicketIds([]);
    clearMessages();
  };

  const removeSelectedTicket = (ticketId: string) => {
    setSelectedTicketIds((previous) =>
      previous.filter((id) => id !== ticketId)
    );
  };

  const allCurrentPageSelected =
    tickets.length > 0 &&
    tickets.every((ticket) =>
      selectedTicketIds.includes(ticket.id)
    );

  const handleBulkStatusUpdate = async () => {
    if (
      !canUpdateStatus ||
      selectedTicketIds.length === 0 ||
      isBulkUpdating
    ) {
      return;
    }

    try {
      clearMessages();

      const result = await bulkUpdateStatus(
        selectedTicketIds,
        bulkStatus
      );

      setSelectedTicketIds(result.failedIds);

      if (result.failedIds.length > 0) {
        setBulkMessage(
          `${result.updatedIds.length} ticket(s) updated. ${result.failedIds.length} failed. Failed tickets remain selected.`
        );
      } else {
        setBulkMessage(
          `${result.updatedIds.length} ticket(s) updated successfully.`
        );
      }
    } catch (error) {
      console.error("Bulk status update failed:", error);

      setBulkError(
        "Unable to update selected tickets. Please try again."
      );
    }
  };

  return {
    selectedTicketIds,
    bulkStatus,
    setBulkStatus,
    bulkMessage,
    bulkError,
    allCurrentPageSelected,
    handleSelectTicket,
    handleSelectAll,
    handleClearSelection,
    removeSelectedTicket,
    handleBulkStatusUpdate,
  };
};

export default useDashboardTickets;
