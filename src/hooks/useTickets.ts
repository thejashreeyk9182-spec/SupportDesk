
import { useCallback, useEffect, useState } from "react";

import type {
  Ticket,
  TicketFormData,
  TicketQueryParams,
} from "../features/tickets/ticket.types";

import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../services/ticketService";

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [params, setParams] = useState<TicketQueryParams>({
    page: 1,
    limit: 5,
  });

  // Load tickets whenever query parameters change
  useEffect(() => {
    let cancelled = false;

    const loadTickets = async () => {
      try {
        const response = await getTickets(params);

        if (!cancelled) {
          setTickets(response.data);
          setTotal(response.total);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load tickets. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadTickets();

    return () => {
      cancelled = true;
    };
  }, [params]);

  // Manually refresh tickets after create, edit, or delete
  const refreshTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTickets(params);

      setTickets(response.data);
      setTotal(response.total);
    } catch {
      setError("Unable to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [params]);

  const updateParams = (newParams: Partial<TicketQueryParams>) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  };

  const addTicket = async (data: TicketFormData) => {
    const newTicket = await createTicket(data);
    await refreshTickets();
    return newTicket;
  };

  const editTicket = async (id: string, data: TicketFormData) => {
    const updatedTicket = await updateTicket(id, data);
    await refreshTickets();
    return updatedTicket;
  };

  const removeTicket = async (id: string) => {
    await deleteTicket(id);
    await refreshTickets();
  };

  return {
    tickets,
    total,
    loading,
    error,
    params,
    updateParams,
    addTicket,
    editTicket,
    removeTicket,
    refreshTickets,
  };
};
