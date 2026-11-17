
import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../app/api/baseQuery";

import type {
  Ticket,
  TicketFormData,
  TicketQueryParams,
  PaginatedTickets,
} from "./ticket.types";

interface BulkStatusRequest {
  ids: string[];
  status: Ticket["status"];
}

interface BulkAssignRequest {
  ids: string[];
  agentId: string | null;
}

interface BulkUpdateResponse {
  updatedIds: string[];
  failedIds: string[];
}

export const ticketApi = createApi({
  reducerPath: "ticketApi",
  baseQuery,
  tagTypes: ["Ticket"],

  endpoints: (builder) => ({
    // Get tickets with search, filtering, sorting and pagination
    getTickets: builder.query<PaginatedTickets, TicketQueryParams>({
      query: () => "/tickets",

      transformResponse: (
        response: Ticket[],
        _meta,
        arg
      ): PaginatedTickets => {
        let filteredTickets = [...response];

        // Search
        if (arg.search?.trim()) {
          const searchText = arg.search.toLowerCase().trim();

          filteredTickets = filteredTickets.filter((ticket) =>
            [
              ticket.id,
              ticket.customerName,
              ticket.email,
              ticket.subject,
              ticket.description,
            ].some((value) =>
              value?.toLowerCase().includes(searchText)
            )
          );
        }

        // Status filter
        if (arg.status) {
          filteredTickets = filteredTickets.filter(
            (ticket) => ticket.status === arg.status
          );
        }

        // Priority filter
        if (arg.priority) {
          filteredTickets = filteredTickets.filter(
            (ticket) => ticket.priority === arg.priority
          );
        }

        // Assigned agent filter
        if (arg.assignedTo) {
          filteredTickets = filteredTickets.filter(
            (ticket) => ticket.assignedTo === arg.assignedTo
          );
        }

        // Sorting
        if (arg.sort === "oldest") {
          filteredTickets.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()
          );
        } else if (arg.sort === "priority") {
          const priorityOrder: Record<Ticket["priority"], number> = {
            High: 3,
            Medium: 2,
            Low: 1,
          };

          filteredTickets.sort(
            (a, b) =>
              priorityOrder[b.priority] -
              priorityOrder[a.priority]
          );
        } else {
          filteredTickets.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          );
        }

        // Total before pagination
        const total = filteredTickets.length;

        // Pagination
        const page = Math.max(1, arg.page ?? 1);
        const limit = Math.max(1, arg.limit ?? 5);

        const startIndex = (page - 1) * limit;

        const paginatedTickets = filteredTickets.slice(
          startIndex,
          startIndex + limit
        );

        return {
          data: paginatedTickets,
          total,
          page,
          limit,
        };
      },

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((ticket) => ({
                type: "Ticket" as const,
                id: ticket.id,
              })),
              { type: "Ticket" as const, id: "LIST" },
            ]
          : [{ type: "Ticket" as const, id: "LIST" }],
    }),

    // Create ticket
    createTicket: builder.mutation<
      Ticket,
      TicketFormData & { createdAt: string }
    >({
      query: (data) => ({
        url: "/tickets",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [{ type: "Ticket", id: "LIST" }],
    }),

    // Update ticket
    updateTicket: builder.mutation<
      Ticket,
      { id: string; data: Partial<TicketFormData> }
    >({
      query: ({ id, data }) => ({
        url: `/tickets/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        { type: "Ticket", id },
        { type: "Ticket", id: "LIST" },
      ],
    }),

    // Delete ticket
    deleteTicket: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, id) => [
        { type: "Ticket", id },
        { type: "Ticket", id: "LIST" },
      ],
    }),

    // Bulk update ticket status
    bulkUpdateStatus: builder.mutation<
      BulkUpdateResponse,
      BulkStatusRequest
    >({
      async queryFn({ ids, status }, _api, _extraOptions, baseQuery) {
        const results = await Promise.all(
          ids.map(async (id) => {
            const result = await baseQuery({
              url: `/tickets/${id}`,
              method: "PATCH",
              body: { status },
            });

            return {
              id,
              success: !result.error,
            };
          })
        );

        const updatedIds = results
          .filter((result) => result.success)
          .map((result) => result.id);

        const failedIds = results
          .filter((result) => !result.success)
          .map((result) => result.id);

        if (updatedIds.length === 0 && failedIds.length > 0) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              message: "Unable to update ticket statuses.",
            },
          };
        }

        return {
          data: {
            updatedIds,
            failedIds,
          },
        };
      },

      invalidatesTags: [{ type: "Ticket", id: "LIST" }],
    }),

    // Bulk assign tickets
    bulkAssignTickets: builder.mutation<
      BulkUpdateResponse,
      BulkAssignRequest
    >({
      async queryFn({ ids, agentId }, _api, _extraOptions, baseQuery) {
        const results = await Promise.all(
          ids.map(async (id) => {
            const result = await baseQuery({
              url: `/tickets/${id}`,
              method: "PATCH",
              body: {
                assignedTo: agentId ?? "",
              },
            });

            return {
              id,
              success: !result.error,
            };
          })
        );

        const updatedIds = results
          .filter((result) => result.success)
          .map((result) => result.id);

        const failedIds = results
          .filter((result) => !result.success)
          .map((result) => result.id);

        if (updatedIds.length === 0 && failedIds.length > 0) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              message: "Unable to assign tickets.",
            },
          };
        }

        return {
          data: {
            updatedIds,
            failedIds,
          },
        };
      },

      invalidatesTags: [{ type: "Ticket", id: "LIST" }],
    }),
  }),
});

// Export generated hooks
export const {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useBulkUpdateStatusMutation,
  useBulkAssignTicketsMutation,
} = ticketApi;
