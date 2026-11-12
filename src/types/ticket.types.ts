
export type {
  Ticket,
  TicketFormData,
  TicketPriority,
  TicketStatus,
} from "../features/tickets/ticket.types";

export interface TicketFilters {
  search: string;
  status: string;
  priority: string;
}
