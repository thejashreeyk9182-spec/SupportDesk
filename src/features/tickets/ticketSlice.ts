
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTickets,
  addTicket,
  editTicket,
  removeTicket,
} from "./ticketThunks";

import type { Ticket } from "./ticket.types";

interface TicketState {
  tickets: Ticket[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  pageSize: number;
  activeRequestId?: string;
}

const initialState: TicketState = {
  tickets: [],
  loading: false,
  submitting: false,
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: 5,
};

const ticketSlice = createSlice({
  name: "tickets",
  initialState,

  reducers: {
    clearTicketError: (state) => {
      state.error = null;
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.activeRequestId = action.meta.requestId;
      })

      .addCase(fetchTickets.fulfilled, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.tickets = action.payload.data;
        state.total = action.payload.total;
        state.currentPage = action.payload.page;
        state.pageSize = action.payload.limit;
        state.activeRequestId = undefined;
      })

      .addCase(fetchTickets.rejected, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.activeRequestId = undefined;

        if (!action.meta.aborted) {
          state.error = action.payload ?? "Unable to fetch tickets";
        }
      })

      .addCase(addTicket.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })

      .addCase(addTicket.fulfilled, (state, action) => {
        state.submitting = false;
        state.tickets.unshift(action.payload);
        state.total += 1;
      })

      .addCase(addTicket.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? "Unable to create ticket";
      })

      .addCase(editTicket.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })

      .addCase(editTicket.fulfilled, (state, action) => {
        state.submitting = false;
        state.tickets = state.tickets.map((ticket) =>
          ticket.id === action.payload.id ? action.payload : ticket
        );
      })

      .addCase(editTicket.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? "Unable to update ticket";
      })

      .addCase(removeTicket.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })

      .addCase(removeTicket.fulfilled, (state, action) => {
        state.submitting = false;
        state.tickets = state.tickets.filter(
          (ticket) => ticket.id !== action.payload
        );
        state.total = Math.max(0, state.total - 1);
      })

      .addCase(removeTicket.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? "Unable to delete ticket";
      });
  },
});

export const { clearTicketError, setCurrentPage } = ticketSlice.actions;

export default ticketSlice.reducer;
