
import apiClient from "./apiClient";

import type {
  Ticket,
  TicketFormData,
  TicketQueryParams,
  PaginatedTickets,
} from "../features/tickets/ticket.types";

export const getTickets = async (
  params: TicketQueryParams,
  signal?: AbortSignal
): Promise<PaginatedTickets> => {
  console.log("Current sort value:", params.sort);
  const page = params.page ?? 1;
  const limit = params.limit ?? 5;

  const response = await apiClient.get<Ticket[]>("/tickets", {
    params: {
      ...(params.search ? { q: params.search } : {}),
      ...(params.status ? { status: params.status } : {}),
      ...(params.priority ? { priority: params.priority } : {}),
      ...(params.assignedTo
        ? { assignedTo: params.assignedTo }
        : {}),
      ...(params.sort === "oldest"
        ? { _sort: "createdAt", _order: "asc" }
        : {}),
      ...(params.sort === "newest"
        ? { _sort: "createdAt", _order: "desc" }
        : {}),
      ...(params.sort === "priority"
        ? {}
        : { _page: page, _limit: limit }),
    },
    signal,
  });

  // Sort by priority: High → Medium → Low
  if (params.sort === "priority") {
    const priorityRank: Record<string, number> = {
      High: 3,
      Medium: 2,
      Low: 1,
    };

    const sortedTickets = [...response.data].sort(
      (a, b) =>
        (priorityRank[b.priority] ?? 0) -
        (priorityRank[a.priority] ?? 0)
    );

    const startIndex = (page - 1) * limit;

    return {
      data: sortedTickets.slice(startIndex, startIndex + limit),
      total: sortedTickets.length,
      page,
      limit,
    };
  }

  return {
    data: response.data,
    total: Number(
      response.headers["x-total-count"] ?? response.data.length
    ),
    page,
    limit,
  };
};

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

export const updateTicket = async (
  id: string,
  data: Partial<TicketFormData>
): Promise<Ticket> => {
  const response = await apiClient.patch<Ticket>(`/tickets/${id}`, data);
  return response.data;
};

export const deleteTicket = async (id: string): Promise<void> => {
  await apiClient.delete(`/tickets/${id}`);
};
