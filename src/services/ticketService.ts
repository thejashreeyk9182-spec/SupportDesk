
import apiClient from "./apiClient";

import type {
  Ticket,
  TicketFormData,
  TicketQueryParams,
  PaginatedTickets,
} from "../features/tickets/ticket.types";

// 1. Get Tickets
export const getTickets = async (
  params: TicketQueryParams,
  signal?: AbortSignal
): Promise<PaginatedTickets> => {
  const response = await apiClient.get<Ticket[]>("/tickets", {
    params: {
      ...(params.search ? { q: params.search } : {}),
      ...(params.status ? { status: params.status } : {}),
      ...(params.priority ? { priority: params.priority } : {}),
      ...(params.sort === "oldest"
        ? { _sort: "createdAt", _order: "asc" }
        : {}),
      ...(params.sort === "newest"
        ? { _sort: "createdAt", _order: "desc" }
        : {}),
      _page: params.page ?? 1,
      _limit: params.limit ?? 5,
    },
    signal,
  });

  return {
    data: response.data,
    total: Number(response.headers["x-total-count"] ?? 0),
    page: params.page ?? 1,
    limit: params.limit ?? 5,
  };
};

// 2. Create Ticket with T101, T102 format
export const createTicket = async (
data: Partial<TicketFormData>
): Promise<Ticket> => {
  const response = await apiClient.get<Ticket[]>("/tickets");

  const ticketNumbers = response.data.map((ticket) => {
    const match = /^T(\d+)$/.exec(String(ticket.id));
    return match ? Number(match[1]) : 0;
  });

  const highestNumber = Math.max(100, ...ticketNumbers);
  const nextTicketId = `T${String(highestNumber + 1).padStart(3, "0")}`;

  const createResponse = await apiClient.post<Ticket>("/tickets", {
    ...data,
    id: nextTicketId,
    createdAt: new Date().toISOString(),
  });

  return createResponse.data;
};

// 3. Update Ticket
export const updateTicket = async (
  id: string,
  data: Partial<TicketFormData>
): Promise<Ticket> => {
  const response = await apiClient.patch<Ticket>(`/tickets/${id}`, data);
  return response.data;
};

// 4. Delete Ticket
export const deleteTicket = async (id: string): Promise<void> => {
  await apiClient.delete(`/tickets/${id}`);
};
