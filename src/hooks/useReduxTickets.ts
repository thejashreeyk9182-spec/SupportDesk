
import { useState } from "react";

import {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useBulkUpdateStatusMutation,
  useBulkAssignTicketsMutation,
} from "../features/tickets/ticketApi";

import type {
  Ticket,
  TicketFormData,
  TicketQueryParams,
} from "../features/tickets/ticket.types";

const getApiErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object") {
    if (
      "message" in error &&
      typeof error.message === "string"
    ) {
      return error.message;
    }

    if (
      "data" in error &&
      error.data &&
      typeof error.data === "object" &&
      "message" in error.data &&
      typeof error.data.message === "string"
    ) {
      return error.data.message;
    }
  }

  return "Something went wrong. Please try again.";
};

export const useReduxTickets = () => {
  const [params, setParams] = useState<TicketQueryParams>({
    search: "",
    status: "",
    priority: "",
    sort: "newest",
    page: 1,
    limit: 5,
  });

  // Fetch tickets
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetTicketsQuery(params);

  // Create ticket
  const [createTicket, { isLoading: isCreating }] =
    useCreateTicketMutation();

  // Update ticket
  const [updateTicket, { isLoading: isUpdating }] =
    useUpdateTicketMutation();

  // Delete ticket
  const [deleteTicket, { isLoading: isDeleting }] =
    useDeleteTicketMutation();

  // Bulk status update
  const [
    bulkUpdateStatusMutation,
    { isLoading: isBulkUpdating },
  ] = useBulkUpdateStatusMutation();

  // Bulk ticket assignment
  const [
    bulkAssignTicketsMutation,
    { isLoading: isBulkAssigning },
  ] = useBulkAssignTicketsMutation();

  // Update search, filters, sorting and pagination
  const updateParams = (
    updates: Partial<TicketQueryParams>
  ) => {
    setParams((previous) => ({
      ...previous,
      ...updates,
      page:
        updates.page !== undefined
          ? updates.page
          : updates.search !== undefined ||
              updates.status !== undefined ||
              updates.priority !== undefined ||
              updates.sort !== undefined ||
              updates.assignedTo !== undefined
            ? 1
            : previous.page,
    }));
  };

  // Create ticket
 const create = async (formData: TicketFormData) => {
  return await createTicket({
    ...formData,
    createdAt: new Date().toISOString(),
  }).unwrap();
};
  // Update ticket
  const update = async (
    id: string,
    formData: Partial<TicketFormData>
  ) => {
    return await updateTicket({
      id,
      data: formData,
    }).unwrap();
  };

  // Delete ticket
  const remove = async (id: string) => {
    return await deleteTicket(id).unwrap();
  };

  // Bulk update ticket status
  const bulkUpdateStatus = async (
    ids: string[],
    status: Ticket["status"]
  ) => {
    return await bulkUpdateStatusMutation({
      ids,
      status,
    }).unwrap();
  };

  // Bulk assign tickets
  const bulkAssignTickets = async (
    ids: string[],
    agentId: string | null
  ) => {
    return await bulkAssignTicketsMutation({
      ids,
      agentId,
    }).unwrap();
  };

  return {
    tickets: data?.data ?? [],
    loading: isLoading || isFetching,

    error: error ? getApiErrorMessage(error) : null,

    total: data?.total ?? 0,

    submitting:
      isCreating ||
      isUpdating ||
      isDeleting ||
      isBulkUpdating ||
      isBulkAssigning,

    isBulkUpdating,
    isBulkAssigning,

    params,
    updateParams,

    create,
    update,
    remove,

    bulkUpdateStatus,
    bulkAssignTickets,

    refetch,
  };
};
