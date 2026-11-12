import type { TicketFormData } from "../../types/ticket.types";

export type FormErrors = Partial<
  Record<keyof TicketFormData, string>
>;

export const validateTicket = (
  data: TicketFormData
): FormErrors => {
  const errors: FormErrors = {};

  if (!data.customerName.trim()) {
    errors.customerName = "Customer name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!data.subject.trim()) {
    errors.subject = "Subject is required";
  }

  if (!data.description.trim()) {
    errors.description = "Description is required";
  }

  return errors;
};