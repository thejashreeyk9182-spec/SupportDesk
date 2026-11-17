
import type { TicketFormData } from "../types/ticket.types";

// Validate customer name
export const validateName = (name: string): string => {
  const value = name.trim();

  if (!value) {
    return "Customer name is required";
  }

  if (value.length < 3) {
    return "Name must be at least 3 characters";
  }

  if (value.length > 100) {
    return "Name cannot exceed 100 characters";
  }

  if (/[\u0000-\u001F\u007F]/.test(value)) {
    return "Name contains invalid characters";
  }

  return "";
};

// Validate email
export const validateEmail = (email: string): string => {
  const value = email.trim();

  if (!value) {
    return "Email is required";
  }

  if (value.length > 254) {
    return "Email cannot exceed 254 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailRegex.test(value)) {
    return "Please enter a valid email address";
  }

  return "";
};

// Validate ticket subject
export const validateSubject = (subject: string): string => {
  const value = subject.trim();

  if (!value) {
    return "Subject is required";
  }

  if (value.length < 5) {
    return "Subject must be at least 5 characters";
  }

  if (value.length > 150) {
    return "Subject cannot exceed 150 characters";
  }

  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)) {
    return "Subject contains invalid characters";
  }

  return "";
};

// Validate ticket description
export const validateDescription = (
  description: string
): string => {
  const value = description.trim();

  if (!value) {
    return "Description is required";
  }

  if (value.length < 10) {
    return "Description must be at least 10 characters";
  }

  if (value.length > 2000) {
    return "Description cannot exceed 2000 characters";
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
