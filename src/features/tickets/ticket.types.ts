
export type TicketStatus =
  | "Open"
  | "In Progress"
  | "Resolved";

export type TicketPriority =
  | "Low"
  | "Medium"
  | "High";

export interface Ticket {
  id: string;
  ticketId?: string;
  customerName: string;
  email: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  assignedTo?: string;
}

export interface TicketFormData {
  customerName: string;
  email: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: string;
}

export interface TicketQueryParams {
  search?: string;
  status?: string;
  priority?: string;
  sort?: string;
  assignedTo?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedTickets {
  data: Ticket[];
  total: number;
  page: number;
  limit: number;
}
