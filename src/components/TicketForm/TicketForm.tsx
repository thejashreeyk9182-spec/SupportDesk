
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type {
  Ticket,
  TicketFormData,
} from "../../types/ticket.types";

import {
  validateTicketForm,
} from "../../utils/validation";

import Button from "../common/Button";
import InputField from "../common/forms/InputField";
import TextAreaField from "../common/forms/TextAreaField";
import FormError from "../common/forms/FormError";
import Dropdown from "../common/Dropdown";

import "./TicketForm.css";

interface TicketFormProps {
  ticket: Ticket | null;
  onSubmit: (data: TicketFormData) => Promise<void>;
  onClose: () => void;
}

const initialForm: TicketFormData = {
  customerName: "",
  email: "",
  subject: "",
  description: "",
  priority: "Medium",
  status: "Open",
};

const TicketForm = ({
  ticket,
  onSubmit,
  onClose,
}: TicketFormProps) => {
  const [formData, setFormData] = useState<TicketFormData>(
    ticket
      ? {
          customerName: ticket.customerName,
          email: ticket.email,
          subject: ticket.subject,
          description: ticket.description,
          priority: ticket.priority,
          status: ticket.status,
        }
      : initialForm
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      submit: "",
    }));
  };

  const handlePriorityChange = (value: string) => {
    setFormData((previous) => ({
      ...previous,
      priority: value as TicketFormData["priority"],
    }));

    setErrors((previous) => ({
      ...previous,
      priority: "",
      submit: "",
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((previous) => ({
      ...previous,
      status: value as TicketFormData["status"],
    }));

    setErrors((previous) => ({
      ...previous,
      status: "",
      submit: "",
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (saving) return;

    const validationErrors = validateTicketForm(formData);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setSaving(true);

      await onSubmit({
        ...formData,
        customerName: formData.customerName.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        description: formData.description.trim(),
      });
    } catch {
      setErrors((previous) => ({
        ...previous,
        submit: "Something went wrong. Please try again.",
      }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ticket-form-overlay">
      <div className="ticket-form-container">
        <div className="ticket-form-header">
          <h2>{ticket ? "Edit Ticket" : "Create New Ticket"}</h2>

          <button
            type="button"
            className="ticket-form-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Close form"
          >
            &times;
          </button>
        </div>

      <form onSubmit={handleSubmit} noValidate>
          <div className="ticket-form-body">
            <InputField
              id="customerName"
              name="customerName"
              label="Customer Name"
              value={formData.customerName}
              placeholder="Enter customer name"
              required
              error={errors.customerName}
              onChange={handleChange}
            />

            <InputField
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              placeholder="Enter email address"
              required
              error={errors.email}
              onChange={handleChange}
            />

            <InputField
              id="subject"
              name="subject"
              label="Subject"
              value={formData.subject}
              placeholder="Enter ticket subject"
              required
              error={errors.subject}
              onChange={handleChange}
            />

            <TextAreaField
              id="description"
              name="description"
              label="Description"
              value={formData.description}
              placeholder="Enter ticket description"
              rows={4}
              required
              error={errors.description}
              onChange={handleChange}
            />

            <div className="ticket-form-row">
              <Dropdown
                label="Priority"
                name="priority"
                value={formData.priority}
                options={[
                  { label: "High", value: "High" },
                  { label: "Medium", value: "Medium" },
                  { label: "Low", value: "Low" },
                ]}
                onChange={handlePriorityChange}
              />

              <Dropdown
                label="Status"
                name="status"
                value={formData.status}
                options={[
                  { label: "Open", value: "Open" },
                  { label: "In Progress", value: "In Progress" },
                  { label: "Resolved", value: "Resolved" },
                ]}
                onChange={handleStatusChange}
              />
            </div>

            {errors.submit && (
              <FormError message={errors.submit} />
            )}
          </div>

          <div className="ticket-form-footer">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              loading={saving}
              disabled={saving}
            >
              {ticket ? "Update Ticket" : "Create Ticket"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;
