
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../../services/ticketService";

import type {
  Ticket,
  TicketFormData,
  TicketQueryParams,
  PaginatedTickets,
} from "./ticket.types";

export const fetchTickets = createAsyncThunk<
  PaginatedTickets,
  TicketQueryParams,
  { rejectValue: string }
>(
  "tickets/fetchTickets",
  async (params, { rejectWithValue, signal }) => {
    try {
      return await getTickets(params, signal);
    } catch (error) {
      if (axios.isCancel(error)) {
        return rejectWithValue("Request cancelled");
      }

      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("Unable to fetch tickets");
    }
  }
);

export const addTicket = createAsyncThunk<
  Ticket,
  TicketFormData,
  { rejectValue: string }
>(
  "tickets/addTicket",
  async (data, { rejectWithValue }) => {
    try {
      return await createTicket(data);
    } catch (error) {
      return rejectWithValue(
        axios.isAxiosError(error)
          ? error.message
          : "Unable to create ticket"
      );
    }
  }
);

export const editTicket = createAsyncThunk<
  Ticket,
  {id: string; data: Partial<TicketFormData>},
  { rejectValue: string }
>(
  "tickets/editTicket",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateTicket(id, data);
    } catch (error) {
      return rejectWithValue(
        axios.isAxiosError(error)
          ? error.message
          : "Unable to update ticket"
      );
    }
  }
);

export const removeTicket = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "tickets/removeTicket",
  async (id, { rejectWithValue }) => {
    try {
      await deleteTicket(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        axios.isAxiosError(error)
          ? error.message
          : "Unable to delete ticket"
      );
    }
  }
);
