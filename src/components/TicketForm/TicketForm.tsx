
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type {
  Ticket,
  TicketFormData,
} from "../../types/ticket.types";

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Customer name validation
    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    } else if (
      !/^[a-zA-Z\s]+$/.test(formData.customerName.trim())
    ) {
      newErrors.customerName = "Enter a valid customer name";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = "Enter a valid email address";
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle priority dropdown
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

  // Handle status dropdown
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

  // Submit form
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validateForm()) {
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
        {/* Form header */}
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

        <form onSubmit={handleSubmit}>
          <div className="ticket-form-body">
            {/* Customer name */}
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

            {/* Email */}
            <InputField
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              placeholder="Enter email address"
              required
              onChange={handleChange}
            />

            <FormError message={errors.email} />

            {/* Subject */}
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

            {/* Description */}
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

            {/* Priority and status dropdowns */}
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

            {/* Submit error */}
            {errors.submit && (
              <FormError message={errors.submit} />
            )}
          </div>

          {/* Form footer */}
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
