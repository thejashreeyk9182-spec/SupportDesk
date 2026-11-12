
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

const selectTicketState = (state: RootState) => state.tickets;

export const selectTickets = createSelector(
  [selectTicketState],
  (ticketState) => ticketState.tickets
);

export const selectTicketLoading = createSelector(
  [selectTicketState],
  (ticketState) => ticketState.loading
);

export const selectTicketError = createSelector(
  [selectTicketState],
  (ticketState) => ticketState.error
);

export const selectTicketTotal = createSelector(
  [selectTicketState],
  (ticketState) => ticketState.total
);

export const selectTicketSubmitting = createSelector(
  [selectTicketState],
  (ticketState) => ticketState.submitting
);
