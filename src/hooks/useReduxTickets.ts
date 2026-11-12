
import { useEffect, useState } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";

import {
  fetchTickets,
  addTicket,
  editTicket,
  removeTicket,
} from "../features/tickets/ticketThunks";

import {
  selectTickets,
  selectTicketLoading,
  selectTicketError,
  selectTicketTotal,
  selectTicketSubmitting,
} from "../features/tickets/ticketSelectors";

import type {
  TicketFormData,
  TicketQueryParams,
} from "../features/tickets/ticket.types";

export const useReduxTickets = () => {
  const dispatch = useAppDispatch();

  const tickets = useAppSelector(selectTickets);
  const loading = useAppSelector(selectTicketLoading);
  const error = useAppSelector(selectTicketError);
  const total = useAppSelector(selectTicketTotal);
  const submitting = useAppSelector(selectTicketSubmitting);

  const [params, setParams] = useState<TicketQueryParams>({
    search: "",
    status: "",
    priority: "",
    sort: "newest",
    page: 1,
    limit: 5,
  });

  useEffect(() => {
    const request = dispatch(fetchTickets(params));

    return () => {
      request.abort();
    };
  }, [dispatch, params]);

  const updateParams = (updates: Partial<TicketQueryParams>) => {
    setParams((previous) => ({
      ...previous,
      ...updates,
      page:
        updates.page !== undefined
          ? updates.page
          : updates.search !== undefined ||
              updates.status !== undefined ||
              updates.priority !== undefined ||
              updates.sort !== undefined
            ? 1
            : previous.page,
    }));
  };

  const create = async (data: TicketFormData) => {
    await dispatch(addTicket(data)).unwrap();
    dispatch(fetchTickets(params));
  };

 const update = async (
  id: string,
  data: Partial<TicketFormData>
) => {
  await dispatch(editTicket({ id, data })).unwrap();
};

  const remove = async (id: string) => {
    await dispatch(removeTicket(id)).unwrap();
  };

  return {
    tickets,
    loading,
    error,
    total,
    submitting,
    params,
    updateParams,
    create,
    update,
    remove,
  };
};
