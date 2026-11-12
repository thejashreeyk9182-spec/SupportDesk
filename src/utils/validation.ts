import type { TicketFormData } from "../types/ticket.types";
// Validate customer name
export const validateName = (name: string): string => {
  if (!name.trim()) {
    return "Customer name is required";
  }

  if (name.trim().length < 3) {
    return "Name must be at least 3 characters";
  }

  return "";
};

// Validate email
export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!email.trim()) {
    return "Email is required";
  }

  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  return "";
};

// Validate ticket subject
export const validateSubject = (subject: string): string => {
  if (!subject.trim()) {
    return "Subject is required";
  }

  if (subject.trim().length < 5) {
    return "Subject must be at least 5 characters";
  }

  return "";
};

// Validate description
export const validateDescription = (
  description: string
): string => {
  if (!description.trim()) {
    return "Description is required";
  }

  if (description.trim().length < 10) {
    return "Description must be at least 10 characters";
  }

  return "";
};

// Validate complete ticket form
export const validateTicketForm = (
  data: TicketFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const nameError = validateName(data.customerName);
  const emailError = validateEmail(data.email);
  const subjectError = validateSubject(data.subject);
  const descriptionError = validateDescription(data.description);

  if (nameError) {
    errors.customerName = nameError;
  }

  if (emailError) {
    errors.email = emailError;
  }

  if (subjectError) {
    errors.subject = subjectError;
  }

  if (descriptionError) {
    errors.description = descriptionError;
  }

  return errors;
};