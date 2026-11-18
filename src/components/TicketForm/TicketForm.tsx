
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type {
  Ticket,
  TicketFormData,
} from "../../types/ticket.types";

import { validateTicketForm } from "../../utils/validation";

import InputField from "../common/forms/InputField";
import TextAreaField from "../common/forms/TextAreaField";
import SelectField from "../common/forms/SelectField";
import SubmitButton from "../common/forms/SubmitButton";
import FormError from "../common/forms/FormError";

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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
              error={errors.description}
              onChange={handleChange}
            />

            <div className="ticket-form-row">
              <SelectField
                id="priority"
                name="priority"
                label="Priority"
                value={formData.priority}
                options={[
                  { label: "High", value: "High" },
                  { label: "Medium", value: "Medium" },
                  { label: "Low", value: "Low" },
                ]}
                required
                disabled={saving}
                error={errors.priority}
                onChange={handleChange}
              />

              <SelectField
                id="status"
                name="status"
                label="Status"
                value={formData.status}
                options={[
                  { label: "Open", value: "Open" },
                  { label: "In Progress", value: "In Progress" },
                  { label: "Resolved", value: "Resolved" },
                ]}
                required
                disabled={saving}
                error={errors.status}
                onChange={handleChange}
              />
            </div>

            {errors.submit && (
              <FormError message={errors.submit} />
            )}
          </div>

          <div className="ticket-form-footer">
            <button
              type="button"
              className="ticket-form-cancel"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <SubmitButton
              label={ticket ? "Update Ticket" : "Create Ticket"}
              loading={saving}
              loadingText="Saving..."
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;
