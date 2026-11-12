import type { Ticket } from "../features/tickets/ticket.types";

export const filterTickets = (
  tickets: Ticket[],
  search: string
): Ticket[] => {
  const value = search.toLowerCase().trim();

  if (!value) return tickets;

  return tickets.filter(
    (ticket) =>
      ticket.id.toLowerCase().includes(value) ||
      ticket.customerName.toLowerCase().includes(value) ||
      ticket.subject.toLowerCase().includes(value)
  );
};

export const sortTickets = (
  tickets: Ticket[],
  order: "newest" | "oldest"
): Ticket[] => {
  return [...tickets].sort((a, b) => {
    const difference =
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime();

    return order === "newest" ? -difference : difference;
  });
};